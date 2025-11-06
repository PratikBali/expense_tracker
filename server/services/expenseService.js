import { getDB } from '../config/firebase.js';
import { FieldValue } from 'firebase-admin/firestore';

const COLLECTION_NAME = 'expenses';

class ExpenseService {
  constructor() {
    this.db = null;
  }

  getCollection() {
    if (!this.db) {
      this.db = getDB();
    }
    return this.db.collection(COLLECTION_NAME);
  }

  // Create new expense
  async create(expenseData) {
    try {
      const expenseRef = this.getCollection().doc();
      const newExpense = {
        ...expenseData,
        amount: parseFloat(expenseData.amount),
        date: expenseData.date || new Date().toISOString(),
        createdAt: FieldValue.serverTimestamp(),
        updatedAt: FieldValue.serverTimestamp(),
      };

      await expenseRef.set(newExpense);

      const doc = await expenseRef.get();
      return this.formatExpense(doc);
    } catch (error) {
      console.error('Error creating expense:', error);
      throw error;
    }
  }

  // Find expenses by user ID
  async findByUserId(userId, filters = {}) {
    try {
      let query = this.getCollection().where('user', '==', userId);

      // Apply category filter
      if (filters.category && filters.category !== 'all') {
        query = query.where('category', '==', filters.category);
      }

      // For date range filters, we need to be careful with Firestore composite indexes
      // Apply date range filters only if category is also filtered or no orderBy
      if (filters.startDate) {
        query = query.where('date', '>=', filters.startDate);
      }
      if (filters.endDate) {
        query = query.where('date', '<=', filters.endDate);
      }

      // Order by date descending (Firestore requires index if combined with where on different fields)
      // For now, we'll order in memory if we have multiple where clauses
      const needsOrderBy = !filters.startDate && !filters.endDate;

      if (needsOrderBy) {
        query = query.orderBy('date', 'desc');
      }

      // Apply limit if provided
      if (filters.limit) {
        query = query.limit(filters.limit);
      }

      const snapshot = await query.get();
      let expenses = snapshot.docs.map(doc => this.formatExpense(doc));

      // If we didn't order in query, order in memory
      if (!needsOrderBy) {
        expenses = expenses.sort((a, b) => new Date(b.date) - new Date(a.date));
        if (filters.limit) {
          expenses = expenses.slice(0, filters.limit);
        }
      }

      return expenses;
    } catch (error) {
      console.error('Error finding expenses:', error);
      console.error('Error details:', error.message);
      // Return empty array instead of throwing to prevent 500 errors
      console.warn('Returning empty array due to query error');
      return [];
    }
  }

  // Find expense by ID
  async findById(expenseId, userId) {
    try {
      const doc = await this.getCollection().doc(expenseId).get();

      if (!doc.exists) {
        return null;
      }

      const expense = this.formatExpense(doc);

      // Verify the expense belongs to the user
      if (expense.user !== userId) {
        return null;
      }

      return expense;
    } catch (error) {
      console.error('Error finding expense by ID:', error);
      throw error;
    }
  }

  // Update expense
  async update(expenseId, userId, updateData) {
    try {
      const expenseRef = this.getCollection().doc(expenseId);
      const doc = await expenseRef.get();

      if (!doc.exists) {
        throw new Error('Expense not found');
      }

      const expense = doc.data();
      if (expense.user !== userId) {
        throw new Error('Unauthorized');
      }

      const updates = {
        ...updateData,
        updatedAt: FieldValue.serverTimestamp(),
      };

      if (updates.amount) {
        updates.amount = parseFloat(updates.amount);
      }

      await expenseRef.update(updates);

      const updatedDoc = await expenseRef.get();
      return this.formatExpense(updatedDoc);
    } catch (error) {
      console.error('Error updating expense:', error);
      throw error;
    }
  }

  // Delete expense
  async delete(expenseId, userId) {
    try {
      const expenseRef = this.getCollection().doc(expenseId);
      const doc = await expenseRef.get();

      if (!doc.exists) {
        throw new Error('Expense not found');
      }

      const expense = doc.data();
      if (expense.user !== userId) {
        throw new Error('Unauthorized');
      }

      await expenseRef.delete();
      return true;
    } catch (error) {
      console.error('Error deleting expense:', error);
      throw error;
    }
  }

  // Get statistics
  async getStats(userId, filters = {}) {
    try {
      // Fetch all user expenses without complex filters to avoid index issues
      const query = this.getCollection().where('user', '==', userId);
      const snapshot = await query.get();
      const expenses = snapshot.docs.map(doc => this.formatExpense(doc));

      // Current month stats
      const now = new Date();
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
      const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59).toISOString();

      const currentMonthExpenses = expenses.filter(
        exp => exp.date >= startOfMonth && exp.date <= endOfMonth
      );

      const currentMonthTotal = currentMonthExpenses.reduce((sum, exp) => sum + exp.amount, 0);
      const currentMonthCount = currentMonthExpenses.length;

      // By category (current month only)
      const byCategory = {};
      currentMonthExpenses.forEach(exp => {
        if (!byCategory[exp.category]) {
          byCategory[exp.category] = { _id: exp.category, total: 0, count: 0 };
        }
        byCategory[exp.category].total += exp.amount;
        byCategory[exp.category].count += 1;
      });

      const byCategoryArray = Object.values(byCategory).sort((a, b) => b.total - a.total);

      // Monthly trend (last 6 months)
      const monthlyTrend = {};
      const sixMonthsAgo = new Date();
      sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

      expenses.forEach(exp => {
        const expDate = new Date(exp.date);
        if (expDate >= sixMonthsAgo) {
          const monthKey = `${expDate.getFullYear()}-${String(expDate.getMonth() + 1).padStart(2, '0')}`;
          if (!monthlyTrend[monthKey]) {
            monthlyTrend[monthKey] = { month: monthKey, total: 0, count: 0 };
          }
          monthlyTrend[monthKey].total += exp.amount;
          monthlyTrend[monthKey].count += 1;
        }
      });

      const monthlyTrendArray = Object.values(monthlyTrend).sort((a, b) => a.month.localeCompare(b.month));

      return {
        currentMonth: {
          total: currentMonthTotal,
          count: currentMonthCount,
        },
        byCategory: byCategoryArray,
        monthlyTrend: monthlyTrendArray,
      };
    } catch (error) {
      console.error('Error getting stats:', error);
      console.error('Error details:', error.message);
      // Return empty stats instead of throwing
      return {
        currentMonth: { total: 0, count: 0 },
        byCategory: [],
        monthlyTrend: [],
      };
    }
  }

  // Format expense document
  formatExpense(doc) {
    const data = doc.data();
    return {
      _id: doc.id,
      id: doc.id,
      ...data,
      createdAt: data.createdAt?.toDate ? data.createdAt.toDate().toISOString() : data.createdAt,
      updatedAt: data.updatedAt?.toDate ? data.updatedAt.toDate().toISOString() : data.updatedAt,
    };
  }
}

export default new ExpenseService();

