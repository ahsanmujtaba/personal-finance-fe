import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import { makeApiRequest, formatApiError } from '@/lib/api-response'

export interface Category {
  id: number
  name: string
  type: 'expense' | 'income' | 'savings'
  sort_order: number
  is_default: boolean
  created_at: string
  updated_at: string
}

export interface CategoriesState {
  categories: Category[]
  currentCategory: Category | null
  isLoading: boolean
  error: string | null
  filters: {
    type?: 'expense' | 'income' | 'savings'
  }
}

export interface CreateCategoryData {
  name: string
  type: 'expense' | 'income' | 'savings'
  sort_order?: number
  is_default?: boolean
}

export interface UpdateCategoryData {
  id: number
  name: string
  type: 'expense' | 'income' | 'savings'
  sort_order?: number
  is_default?: boolean
}

const initialState: CategoriesState = {
  categories: [],
  currentCategory: null,
  isLoading: false,
  error: null,
  filters: {},
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'

// Async thunks for API calls
export const fetchCategories = createAsyncThunk(
  'categories/fetchCategories',
  async (params: { type?: 'expense' | 'income' | 'savings' } = {}, { rejectWithValue, getState }) => {
    const { type } = params
    try {
      const state = getState() as { auth: { token: string } }
      const token = state.auth.token
      const url = type 
        ? `${API_BASE_URL}/api/categories?type=${type}`
        : `${API_BASE_URL}/api/categories`
      
      const data = await makeApiRequest<Category[]>(
        url,
        {
          method: 'GET',
        },
        token
      )

      return data
    } catch (error: any) {
      return rejectWithValue(formatApiError(error))
    }
  }
)

export const fetchCategoryById = createAsyncThunk(
  'categories/fetchCategoryById',
  async (id: number, { rejectWithValue, getState }) => {
    try {
      const state = getState() as { auth: { token: string } }
      const token = state.auth.token

      const data = await makeApiRequest<Category>(
        `${API_BASE_URL}/api/categories/${id}`,
        {
          method: 'GET',
        },
        token
      )

      return data
    } catch (error: any) {
      return rejectWithValue(formatApiError(error))
    }
  }
)

export const createCategory = createAsyncThunk(
  'categories/createCategory',
  async (categoryData: CreateCategoryData, { rejectWithValue, getState }) => {
    try {
      const state = getState() as { auth: { token: string } }
      const token = state.auth.token

      const data = await makeApiRequest<Category>(
        `${API_BASE_URL}/api/categories`,
        {
          method: 'POST',
          body: JSON.stringify(categoryData),
        },
        token
      )

      return data
    } catch (error: any) {
      return rejectWithValue(formatApiError(error))
    }
  }
)

export const updateCategory = createAsyncThunk(
  'categories/updateCategory',
  async (categoryData: UpdateCategoryData, { rejectWithValue, getState }) => {
    try {
      const state = getState() as { auth: { token: string } }
      const token = state.auth.token
      const { id, ...updateData } = categoryData

      const data = await makeApiRequest<Category>(
        `${API_BASE_URL}/api/categories/${id}`,
        {
          method: 'PUT',
          body: JSON.stringify(updateData),
        },
        token
      )

      return data
    } catch (error: any) {
      return rejectWithValue(formatApiError(error))
    }
  }
)

export const deleteCategory = createAsyncThunk(
  'categories/deleteCategory',
  async (id: number, { rejectWithValue, getState }) => {
    try {
      const state = getState() as { auth: { token: string } }
      const token = state.auth.token

      await makeApiRequest(
        `${API_BASE_URL}/api/categories/${id}`,
        {
          method: 'DELETE',
        },
        token
      )

      return id
    } catch (error: any) {
      return rejectWithValue(formatApiError(error))
    }
  }
)

const categoriesSlice = createSlice({
  name: 'categories',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
    setCurrentCategory: (state, action: PayloadAction<Category | null>) => {
      state.currentCategory = action.payload
    },
    setFilters: (state, action: PayloadAction<{ type?: 'expense' | 'income' | 'savings' }>) => {
      state.filters = action.payload
    },
    clearCategories: (state) => {
      state.categories = []
      state.currentCategory = null
      state.error = null
    },
  },
  extraReducers: (builder) => {
    // Fetch Categories
    builder
      .addCase(fetchCategories.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchCategories.fulfilled, (state, action: PayloadAction<Category[]>) => {
        state.isLoading = false
        state.categories = action.payload
        state.error = null
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })

    // Fetch Category by ID
    builder
      .addCase(fetchCategoryById.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchCategoryById.fulfilled, (state, action: PayloadAction<Category>) => {
        state.isLoading = false
        state.currentCategory = action.payload
        state.error = null
      })
      .addCase(fetchCategoryById.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })

    // Create Category
    builder
      .addCase(createCategory.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(createCategory.fulfilled, (state, action: PayloadAction<Category>) => {
        state.isLoading = false
        state.categories.push(action.payload)
        state.error = null
      })
      .addCase(createCategory.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })

    // Update Category
    builder
      .addCase(updateCategory.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(updateCategory.fulfilled, (state, action: PayloadAction<Category>) => {
        state.isLoading = false
        const index = state.categories.findIndex(cat => cat.id === action.payload.id)
        if (index !== -1) {
          state.categories[index] = action.payload
        }
        if (state.currentCategory?.id === action.payload.id) {
          state.currentCategory = action.payload
        }
        state.error = null
      })
      .addCase(updateCategory.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })

    // Delete Category
    builder
      .addCase(deleteCategory.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(deleteCategory.fulfilled, (state, action: PayloadAction<number>) => {
        state.isLoading = false
        state.categories = state.categories.filter(cat => cat.id !== action.payload)
        if (state.currentCategory?.id === action.payload) {
          state.currentCategory = null
        }
        state.error = null
      })
      .addCase(deleteCategory.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
  },
})

export const { clearError, setCurrentCategory, setFilters, clearCategories } = categoriesSlice.actions
export { categoriesSlice }