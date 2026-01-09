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
  }

  // Find expenses by user ID
  async findByUserId(userId, filters = {}) {
    try {
      let query = this.getCollection().where('user', '==', userId);

      // Apply category filter
      if (filters.category && filters.category !== 'all') {
        query = query.where('category', '==', filters.category);
      }

      // Date range filters
      if (filters.startDate) {
        query = query.where('date', '>=', filters.startDate);
      }
      if (filters.endDate) {
        query = query.where('date', '<=', filters.endDate);
      }

      // Order by date desc when we can
      const needsOrderBy = !filters.startDate && !filters.endDate;
      if (needsOrderBy) {
        query = query.orderBy('date', 'desc');
      }

      // Apply limit if provided
      if (filters.limit) {
        query = query.limit(filters.limit);
      }

      const snapshot = await query.get();
      let expenses = snapshot.docs.map((doc) => this.formatExpense(doc));

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
      return [];
    }
  }

  // Find expense by ID
  async findById(expenseId, userId) {
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
  }

  // Update expense
  async update(expenseId, userId, updateData) {
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
  }

  // Delete expense
  async delete(expenseId, userId) {
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
  }

  // Get statistics
  async getStats(userId) {
    try {
      const query = this.getCollection().where('user', '==', userId);
      const snapshot = await query.get();
      const expenses = snapshot.docs.map((doc) => this.formatExpense(doc));

      // Current month stats
      const now = new Date();
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
      const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59).toISOString();

      const currentMonthExpenses = expenses.filter(
        (exp) => exp.date >= startOfMonth && exp.date <= endOfMonth
      );

      const currentMonthTotal = currentMonthExpenses.reduce((sum, exp) => sum + exp.amount, 0);
      const currentMonthCount = currentMonthExpenses.length;

      // By category
      const byCategory = {};
      currentMonthExpenses.forEach((exp) => {
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

      expenses.forEach((exp) => {
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

      const monthlyTrendArray = Object.values(monthlyTrend).sort((a, b) =>
        a.month.localeCompare(b.month)
      );

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

