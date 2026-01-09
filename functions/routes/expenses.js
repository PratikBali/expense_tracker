import express from 'express';
import { body, query, validationResult } from 'express-validator';
import expenseService from '../services/expenseService.js';
import { authenticateJWT } from '../middleware/auth.js';

const router = express.Router();

// All routes require authentication
router.use(authenticateJWT);

// Validation middleware
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }
  next();
};

// @route   GET /api/expenses
// @desc    Get all expenses for user
router.get(
  '/',
  [
    query('category').optional().isString(),
    query('startDate').optional().isISO8601(),
    query('endDate').optional().isISO8601(),
    query('limit').optional().isInt({ min: 1, max: 100 }),
    query('page').optional().isInt({ min: 1 }),
  ],
  validate,
  async (req, res) => {
    try {
      const { category, startDate, endDate, limit = 50, page = 1 } = req.query;

      // Build filters
      const filters = {
        category: category !== 'all' ? category : undefined,
        startDate: startDate ? new Date(startDate).toISOString() : undefined,
        endDate: endDate ? new Date(endDate).toISOString() : undefined,
        limit: parseInt(limit),
      };

      // Get expenses
      const expenses = await expenseService.findByUserId(req.user._id || req.user.id, filters);

      res.json({
        success: true,
        data: expenses,
        pagination: {
          total: expenses.length,
          page: parseInt(page),
          pages: Math.ceil(expenses.length / parseInt(limit)),
        },
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
);

// @route   GET /api/expenses/stats
// @desc    Get expense statistics
router.get('/stats', async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;
    const stats = await expenseService.getStats(userId);

    res.json({
      success: true,
      data: stats,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   GET /api/expenses/:id
// @desc    Get single expense
router.get('/:id', async (req, res) => {
  try {
    const expense = await expenseService.findById(
      req.params.id,
      req.user._id || req.user.id
    );

    if (!expense) {
      return res.status(404).json({
        success: false,
        message: 'Expense not found',
      });
    }

    res.json({ success: true, data: expense });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   POST /api/expenses
// @desc    Create new expense
router.post(
  '/',
  [
    body('amount').isFloat({ min: 0 }).withMessage('Amount must be positive'),
    body('category').isIn([
      'food',
      'transportation',
      'entertainment',
      'utilities',
      'healthcare',
      'shopping',
      'education',
      'travel',
      'other',
    ]).withMessage('Invalid category'),
    body('description').trim().notEmpty().isLength({ max: 500 }),
    body('date').optional().isISO8601(),
    body('tags').optional().isArray(),
  ],
  validate,
  async (req, res) => {
    try {
      const expense = await expenseService.create({
        ...req.body,
        user: req.user._id || req.user.id,
      });

      res.status(201).json({ success: true, data: expense });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
);

// @route   PUT /api/expenses/:id
// @desc    Update expense
router.put(
  '/:id',
  [
    body('amount').optional().isFloat({ min: 0 }),
    body('category').optional().isIn([
      'food',
      'transportation',
      'entertainment',
      'utilities',
      'healthcare',
      'shopping',
      'education',
      'travel',
      'other',
    ]),
    body('description').optional().trim().isLength({ max: 500 }),
    body('date').optional().isISO8601(),
    body('tags').optional().isArray(),
  ],
  validate,
  async (req, res) => {
    try {
      const expense = await expenseService.update(
        req.params.id,
        req.user._id || req.user.id,
        req.body
      );

      if (!expense) {
        return res.status(404).json({
          success: false,
          message: 'Expense not found',
        });
      }

      res.json({ success: true, data: expense });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
);

// @route   DELETE /api/expenses/:id
// @desc    Delete expense
router.delete('/:id', async (req, res) => {
  try {
    const result = await expenseService.delete(
      req.params.id,
      req.user._id || req.user.id
    );

    if (!result) {
      return res.status(404).json({
        success: false,
        message: 'Expense not found',
      });
    }

    res.json({ success: true, message: 'Expense deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;

