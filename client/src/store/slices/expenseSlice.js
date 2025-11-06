import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { expenseAPI } from '../../services/api'

const initialState = {
  expenses: [],
  stats: null,
  loading: false,
  error: null,
  pagination: {
    total: 0,
    page: 1,
    pages: 1,
  },
  filters: {
    category: '',
    startDate: '',
    endDate: '',
  },
}

export const fetchExpenses = createAsyncThunk(
  'expenses/fetchExpenses',
  async (params, { rejectWithValue }) => {
    try {
      const response = await expenseAPI.getAll(params)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch expenses')
    }
  }
)

export const fetchStats = createAsyncThunk(
  'expenses/fetchStats',
  async (_, { rejectWithValue }) => {
    try {
      const response = await expenseAPI.getStats()
      return response.data.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch statistics')
    }
  }
)

export const createExpense = createAsyncThunk(
  'expenses/createExpense',
  async (expenseData, { rejectWithValue }) => {
    try {
      const response = await expenseAPI.create(expenseData)
      return response.data.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create expense')
    }
  }
)

export const updateExpense = createAsyncThunk(
  'expenses/updateExpense',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await expenseAPI.update(id, data)
      return response.data.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update expense')
    }
  }
)

export const deleteExpense = createAsyncThunk(
  'expenses/deleteExpense',
  async (id, { rejectWithValue }) => {
    try {
      await expenseAPI.delete(id)
      return id
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete expense')
    }
  }
)

const expenseSlice = createSlice({
  name: 'expenses',
  initialState,
  reducers: {
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload }
    },
    clearFilters: (state) => {
      state.filters = initialState.filters
    },
    clearError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch expenses
      .addCase(fetchExpenses.pending, (state) => {
        state.loading = true
      })
      .addCase(fetchExpenses.fulfilled, (state, action) => {
        state.loading = false
        state.expenses = action.payload.data
        state.pagination = action.payload.pagination
        state.error = null
      })
      .addCase(fetchExpenses.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      // Fetch stats
      .addCase(fetchStats.fulfilled, (state, action) => {
        state.stats = action.payload
      })
      // Create expense
      .addCase(createExpense.fulfilled, (state, action) => {
        state.expenses.unshift(action.payload)
      })
      // Update expense
      .addCase(updateExpense.fulfilled, (state, action) => {
        const index = state.expenses.findIndex((e) => e._id === action.payload._id)
        if (index !== -1) {
          state.expenses[index] = action.payload
        }
      })
      // Delete expense
      .addCase(deleteExpense.fulfilled, (state, action) => {
        state.expenses = state.expenses.filter((e) => e._id !== action.payload)
      })
  },
})

export const { setFilters, clearFilters, clearError } = expenseSlice.actions
export default expenseSlice.reducer

