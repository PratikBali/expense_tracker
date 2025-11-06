import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { authAPI } from '../../services/api'

const initialState = {
  user: null,
  isAuthenticated: false,
  loading: true,
  error: null,
}

export const checkAuth = createAsyncThunk(
  'auth/checkAuth',
  async (_, { rejectWithValue }) => {
    try {
      const response = await authAPI.me()
      return response.data.user
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Authentication failed')
    }
  }
)

export const logout = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      await authAPI.logout()
      return null
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Logout failed')
    }
  }
)

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      // Check Auth
      .addCase(checkAuth.pending, (state) => {
        state.loading = true
      })
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.loading = false
        state.isAuthenticated = true
        state.user = action.payload
        state.error = null
      })
      .addCase(checkAuth.rejected, (state, action) => {
        state.loading = false
        state.isAuthenticated = false
        state.user = null
        state.error = action.payload
      })
      // Logout
      .addCase(logout.fulfilled, (state) => {
        state.user = null
        state.isAuthenticated = false
        state.error = null
      })
  },
})

export const { clearError } = authSlice.actions
export default authSlice.reducer

