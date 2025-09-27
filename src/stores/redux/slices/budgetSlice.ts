import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import { makeApiRequest, formatApiError } from '@/lib/api-response'

// Types based on API structure
export interface Budget {
  id: number
  user_id: number
  month: string
  notes?: string
  created_at: string
  updated_at: string
  budget_items?: BudgetItem[]
  incomes?: Income[]
  expenses?: Expense[]
}

export interface BudgetItem {
  id: number
  budget_id: number
  category_id: number
  planned_amount: string
  notes?: string
  created_at: string
  updated_at: string
  budget?: Budget,
  spent_amount: string
  remaining_amount: string
  utilization_percentage: number
  status: 'under_budget' | 'on_budget' | 'over_budget'
  category?: {
    id: number
    user_id: number
    name: string
    type: 'expense' | 'income' | 'savings'
    color?: string
    sort_order: number
    is_default: boolean
    created_at: string
    updated_at: string
  }
}

export interface BudgetSummary {
  total_budgets: number
  current_month_budgets: number
  current_month_planned_amount: string
  current_month_actual_amount: string
  current_month_balance: string
}

export interface BudgetsApiResponse {
  budgets: Budget[]
  summary: BudgetSummary
}

export interface BudgetDetailSummary {
  total_planned: string
  actual_spent: string
  total_income: string
  total_expenses: string
  savings: string
  balance: string
  unallocated_income: string
  over_budget_items_count: number
  under_budget_items_count: number
  budget_health_score: number
  is_zero_based: boolean
}

export interface BudgetItemHealth {
  id: number
  category: string
  planned_amount: string
  spent_amount: string
  remaining_amount: string
  utilization_percentage: number
  status: 'under_budget' | 'on_budget' | 'over_budget'
}

export interface Income {
  id: number
  user_id: number
  budget_id: number
  amount: string
  source: string
  note?: string
  date: string
  created_at: string
  updated_at: string
  budget?: Budget
}

export interface Expense {
  id: number
  budget_id: number
  category_id: number
  budget_item_id: number
  amount: string
  merchant: string
  note?: string
  date: string
  created_at: string
  updated_at: string
  category: {
    id: number
    name: string
    type: string
    sort_order: number
    is_default: boolean
    created_at: string
    updated_at: string
  }
  budget_item?: BudgetItem
}

export interface BudgetDetailApiResponse {
  budget: Budget
  summary: BudgetDetailSummary
  budget_items_health: BudgetItemHealth[]
}

export interface BudgetState {
  budgets: Budget[]
  currentBudget: Budget | null
  budgetItems: BudgetItem[]
  incomes: Income[]
  expenses: Expense[]
  summary: BudgetSummary | null
  currentBudgetSummary: BudgetDetailSummary | null
  budgetItemsHealth: BudgetItemHealth[]
  isLoading: boolean
  error: string | null
  filters: {
    month?: string
  }
}

export interface CreateBudgetData {
  month: string
  notes?: string
}

export interface UpdateBudgetData {
  id: number
  month: string
  notes?: string
}

export interface CreateBudgetItemData {
  budget_id: number
  category_id: number
  planned_amount: number
  notes?: string
}

export interface UpdateBudgetItemData {
  id: number
  category_id: number
  planned_amount: number
  notes?: string
}

export interface CreateIncomeData {
  budget_id: number
  amount: number
  source: string
  note?: string
  date: string
}

export interface UpdateIncomeData {
  id: number
  budget_id: number
  amount: number
  source: string
  note?: string
  date: string
}

export interface CreateExpenseData {
  budget_id: number
  category_id: number
  budget_item_id: number
  amount: number
  merchant?: string
  note?: string
  date: string
}

export interface UpdateExpenseData {
  id: number
  budget_id: number
  category_id: number
  budget_item_id: number
  amount: number
  merchant?: string
  note?: string
  date: string
}
const initialState: BudgetState = {
  budgets: [],
  currentBudget: null,
  budgetItems: [],
  incomes: [],
  expenses: [],
  summary: null,
  currentBudgetSummary: null,
  budgetItemsHealth: [],
  isLoading: false,
  error: null,
  filters: {},
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'

// Async thunks for Budget CRUD operations
export const fetchBudgets = createAsyncThunk(
  'budgets/fetchBudgets',
  async (_, { rejectWithValue, getState }) => {
    try {
      const state = getState() as { auth: { token: string } }
      const token = state.auth.token

      const data = await makeApiRequest<BudgetsApiResponse>(
        `${API_BASE_URL}/api/budgets`,
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

export const fetchBudgetsByMonth = createAsyncThunk(
  'budgets/fetchBudgetsByMonth',
  async (month: string, { rejectWithValue, getState }) => {
    try {
      const state = getState() as { auth: { token: string } }
      const token = state.auth.token

      const data = await makeApiRequest<Budget[]>(
        `${API_BASE_URL}/api/budgets/month/${month}`,
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

export const fetchBudgetById = createAsyncThunk(
  'budgets/fetchBudgetById',
  async (id: number, { rejectWithValue, getState }) => {
    try {
      const state = getState() as { auth: { token: string } }
      const token = state.auth.token

      const data = await makeApiRequest<BudgetDetailApiResponse>(
        `${API_BASE_URL}/api/budgets/${id}`,
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

export const createBudget = createAsyncThunk(
  'budgets/createBudget',
  async (budgetData: CreateBudgetData, { rejectWithValue, getState }) => {
    try {
      const state = getState() as { auth: { token: string } }
      const token = state.auth.token

      const data = await makeApiRequest<Budget>(
        `${API_BASE_URL}/api/budgets`,
        {
          method: 'POST',
          body: JSON.stringify(budgetData),
        },
        token
      )

      return data
    } catch (error: any) {
      return rejectWithValue(formatApiError(error))
    }
  }
)

export const updateBudget = createAsyncThunk(
  'budgets/updateBudget',
  async (budgetData: UpdateBudgetData, { rejectWithValue, getState }) => {
    try {
      const state = getState() as { auth: { token: string } }
      const token = state.auth.token

      const data = await makeApiRequest<Budget>(
        `${API_BASE_URL}/api/budgets/${budgetData.id}`,
        {
          method: 'PUT',
          body: JSON.stringify({
            month: budgetData.month,
            notes: budgetData.notes,
          }),
        },
        token
      )

      return data
    } catch (error: any) {
      return rejectWithValue(formatApiError(error))
    }
  }
)

export const deleteBudget = createAsyncThunk(
  'budgets/deleteBudget',
  async (id: number, { rejectWithValue, getState }) => {
    try {
      const state = getState() as { auth: { token: string } }
      const token = state.auth.token

      await makeApiRequest(
        `${API_BASE_URL}/api/budgets/${id}`,
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

// Async thunks for Budget Items CRUD operations
export const createBudgetItem = createAsyncThunk(
  'budgets/createBudgetItem',
  async (itemData: CreateBudgetItemData, { rejectWithValue, getState }) => {
    try {
      const state = getState() as { auth: { token: string } }
      const token = state.auth.token

      const data = await makeApiRequest<BudgetItem>(
        `${API_BASE_URL}/api/budgets/${itemData.budget_id}/items`,
        {
          method: 'POST',
          body: JSON.stringify({
            category_id: itemData.category_id,
            planned_amount: itemData.planned_amount,
            notes: itemData.notes,
          }),
        },
        token
      )

      return data
    } catch (error: any) {
      return rejectWithValue(formatApiError(error))
    }
  }
)

export const updateBudgetItem = createAsyncThunk(
  'budgets/updateBudgetItem',
  async (itemData: UpdateBudgetItemData, { rejectWithValue, getState }) => {
    try {
      const state = getState() as { auth: { token: string } }
      const token = state.auth.token

      const data = await makeApiRequest<BudgetItem>(
        `${API_BASE_URL}/api/budget-items/${itemData.id}`,
        {
          method: 'PATCH',
          body: JSON.stringify({
            category_id: itemData.category_id,
            planned_amount: itemData.planned_amount,
            notes: itemData.notes,
          }),
        },
        token
      )

      return data
    } catch (error: any) {
      return rejectWithValue(formatApiError(error))
    }
  }
)

export const deleteBudgetItem = createAsyncThunk(
  'budgets/deleteBudgetItem',
  async (id: number, { rejectWithValue, getState }) => {
    try {
      const state = getState() as { auth: { token: string } }
      const token = state.auth.token

      await makeApiRequest(
        `${API_BASE_URL}/api/budget-items/${id}`,
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

// Income CRUD operations
export const createIncome = createAsyncThunk(
  'budgets/createIncome',
  async (incomeData: CreateIncomeData, { rejectWithValue, getState }) => {
    try {
      const state = getState() as { auth: { token: string } }
      const token = state.auth.token

      const data = await makeApiRequest<Income>(
        `${API_BASE_URL}/api/incomes`,
        {
          method: 'POST',
          body: JSON.stringify({
            budget_id: incomeData.budget_id,
            amount: incomeData.amount,
            source: incomeData.source,
            note: incomeData.note,
            date: incomeData.date,
          }),
        },
        token
      )

      return data
    } catch (error: any) {
      return rejectWithValue(formatApiError(error))
    }
  }
)

export const updateIncome = createAsyncThunk(
  'budgets/updateIncome',
  async (incomeData: UpdateIncomeData, { rejectWithValue, getState }) => {
    try {
      const state = getState() as { auth: { token: string } }
      const token = state.auth.token

      const data = await makeApiRequest<Income>(
        `${API_BASE_URL}/api/incomes/${incomeData.id}`,
        {
          method: 'PATCH',
          body: JSON.stringify({
            budget_id: incomeData.budget_id,
            amount: incomeData.amount,
            source: incomeData.source,
            note: incomeData.note,
            date: incomeData.date,
          }),
        },
        token
      )

      return data
    } catch (error: any) {
      return rejectWithValue(formatApiError(error))
    }
  }
)

export const deleteIncome = createAsyncThunk(
  'budgets/deleteIncome',
  async (id: number, { rejectWithValue, getState }) => {
    try {
      const state = getState() as { auth: { token: string } }
      const token = state.auth.token

      await makeApiRequest(
        `${API_BASE_URL}/api/incomes/${id}`,
        {
          method: 'DELETE',
        },
        token
      )

      return { id }
    } catch (error: any) {
      return rejectWithValue(formatApiError(error))
    }
  }
)

// Expense CRUD operations
export const createExpense = createAsyncThunk(
  'budgets/createExpense',
  async (expenseData: CreateExpenseData, { rejectWithValue, getState }) => {
    try {
      const state = getState() as { auth: { token: string } }
      const token = state.auth.token

      const data = await makeApiRequest<Expense>(
        `${API_BASE_URL}/api/expenses`,
        {
          method: 'POST',
          body: JSON.stringify({
          budget_id: expenseData.budget_id,
          category_id: expenseData.category_id,
          budget_item_id: expenseData.budget_item_id,
          amount: expenseData.amount,
          merchant: expenseData.merchant,
          note: expenseData.note,
          date: expenseData.date,
        }),
        },
        token
      )

      return data
    } catch (error: any) {
      return rejectWithValue(formatApiError(error))
    }
  }
)

export const updateExpense = createAsyncThunk(
  'budgets/updateExpense',
  async (expenseData: UpdateExpenseData, { rejectWithValue, getState }) => {
    try {
      const state = getState() as { auth: { token: string } }
      const token = state.auth.token

      const data = await makeApiRequest<Expense>(
        `${API_BASE_URL}/api/expenses/${expenseData.id}`,
        {
          method: 'PATCH',
          body: JSON.stringify({
          budget_id: expenseData.budget_id,
          category_id: expenseData.category_id,
          budget_item_id: expenseData.budget_item_id,
          amount: expenseData.amount,
          merchant: expenseData.merchant,
          note: expenseData.note,
          date: expenseData.date,
        }),
        },
        token
      )

      return data
    } catch (error: any) {
      return rejectWithValue(formatApiError(error))
    }
  }
)

export const deleteExpense = createAsyncThunk(
  'budgets/deleteExpense',
  async (id: number, { rejectWithValue, getState }) => {
    try {
      const state = getState() as { auth: { token: string } }
      const token = state.auth.token

      await makeApiRequest(
        `${API_BASE_URL}/api/expenses/${id}`,
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

const budgetSlice = createSlice({
  name: 'budgets',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
    setCurrentBudget: (state, action: PayloadAction<Budget | null>) => {
      state.currentBudget = action.payload
    },
    setFilters: (state, action: PayloadAction<{ month?: string }>) => {
      state.filters = action.payload
    },
    clearBudgets: (state) => {
      state.budgets = []
      state.currentBudget = null
      state.budgetItems = []
      state.error = null
    },
  },
  extraReducers: (builder) => {
    // Fetch Budgets
    builder
      .addCase(fetchBudgets.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchBudgets.fulfilled, (state, action: PayloadAction<BudgetsApiResponse>) => {
        state.isLoading = false
        state.budgets = action.payload.budgets
        state.summary = action.payload.summary
        state.error = null
      })
      .addCase(fetchBudgets.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })

    // Fetch Budgets by Month
    builder
      .addCase(fetchBudgetsByMonth.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchBudgetsByMonth.fulfilled, (state, action: PayloadAction<Budget[]>) => {
        state.isLoading = false
        state.budgets = action.payload
        state.error = null
      })
      .addCase(fetchBudgetsByMonth.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })

    // Fetch Budget by ID
    builder
      .addCase(fetchBudgetById.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchBudgetById.fulfilled, (state, action: PayloadAction<BudgetDetailApiResponse>) => {
        state.isLoading = false
        state.currentBudget = action.payload.budget
        state.currentBudgetSummary = action.payload.summary
        state.budgetItemsHealth = action.payload.budget_items_health || []
        if (action.payload.budget.budget_items) {
          state.budgetItems = action.payload.budget.budget_items
        }
        // Extract incomes and expenses from the budget object (nested structure)
        state.incomes = action.payload.budget.incomes || []
        state.expenses = action.payload.budget.expenses || []
        state.error = null
      })
      .addCase(fetchBudgetById.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })

    // Create Budget
    builder
      .addCase(createBudget.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(createBudget.fulfilled, (state, action: PayloadAction<Budget>) => {
        state.isLoading = false
        state.budgets.push(action.payload)
        state.error = null
      })
      .addCase(createBudget.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })

    // Update Budget
    builder
      .addCase(updateBudget.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(updateBudget.fulfilled, (state, action: PayloadAction<Budget>) => {
        state.isLoading = false
        const index = state.budgets.findIndex(budget => budget.id === action.payload.id)
        if (index !== -1) {
          state.budgets[index] = action.payload
        }
        if (state.currentBudget?.id === action.payload.id) {
          state.currentBudget = action.payload
        }
        state.error = null
      })
      .addCase(updateBudget.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })

    // Delete Budget
    builder
      .addCase(deleteBudget.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(deleteBudget.fulfilled, (state, action: PayloadAction<number>) => {
        state.isLoading = false
        state.budgets = state.budgets.filter(budget => budget.id !== action.payload)
        if (state.currentBudget?.id === action.payload) {
          state.currentBudget = null
          state.budgetItems = []
        }
        state.error = null
      })
      .addCase(deleteBudget.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })

    // Create Budget Item
    builder
      .addCase(createBudgetItem.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(createBudgetItem.fulfilled, (state, action: PayloadAction<BudgetItem>) => {
        state.isLoading = false
        state.budgetItems.push(action.payload)
        state.error = null
      })
      .addCase(createBudgetItem.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })

    // Update Budget Item
    builder
      .addCase(updateBudgetItem.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(updateBudgetItem.fulfilled, (state, action: PayloadAction<BudgetItem>) => {
        state.isLoading = false
        const index = state.budgetItems.findIndex(item => item.id === action.payload.id)
        if (index !== -1) {
          state.budgetItems[index] = action.payload
        }
        state.error = null
      })
      .addCase(updateBudgetItem.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })

    // Delete Budget Item
    builder
      .addCase(deleteBudgetItem.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(deleteBudgetItem.fulfilled, (state, action: PayloadAction<number>) => {
        state.isLoading = false
        state.budgetItems = state.budgetItems.filter(item => item.id !== action.payload)
        state.error = null
      })
      .addCase(deleteBudgetItem.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })

    // Create Income
    builder
      .addCase(createIncome.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(createIncome.fulfilled, (state, action: PayloadAction<Income>) => {
        state.isLoading = false
        state.incomes.push(action.payload)
        state.error = null
      })
      .addCase(createIncome.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })

    // Update Income
    builder
      .addCase(updateIncome.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(updateIncome.fulfilled, (state, action: PayloadAction<Income>) => {
        state.isLoading = false
        const index = state.incomes.findIndex(income => income.id === action.payload.id)
        if (index !== -1) {
          state.incomes[index] = action.payload
        }
        state.error = null
      })
      .addCase(updateIncome.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })

    // Delete Income
    builder
      .addCase(deleteIncome.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(deleteIncome.fulfilled, (state, action) => {
        state.isLoading = false
        state.incomes = state.incomes.filter(income => income.id !== action.payload.id)
        state.error = null
      })
      .addCase(deleteIncome.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })

    // Create Expense
    builder
      .addCase(createExpense.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(createExpense.fulfilled, (state, action: PayloadAction<Expense>) => {
        state.isLoading = false
        state.expenses.push(action.payload)
        state.error = null
      })
      .addCase(createExpense.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })

    // Update Expense
    builder
      .addCase(updateExpense.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(updateExpense.fulfilled, (state, action: PayloadAction<Expense>) => {
        state.isLoading = false
        const index = state.expenses.findIndex(expense => expense.id === action.payload.id)
        if (index !== -1) {
          state.expenses[index] = action.payload
        }
        state.error = null
      })
      .addCase(updateExpense.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })

    // Delete Expense
    builder
      .addCase(deleteExpense.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(deleteExpense.fulfilled, (state, action: PayloadAction<number>) => {
        state.isLoading = false
        state.expenses = state.expenses.filter(expense => expense.id !== action.payload)
        state.error = null
      })
      .addCase(deleteExpense.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
  },
})

export const { clearError, setCurrentBudget, setFilters, clearBudgets } = budgetSlice.actions
export { budgetSlice }