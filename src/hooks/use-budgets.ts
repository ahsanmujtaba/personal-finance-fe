import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState, clearBudgetError } from '@/stores/redux'
import {
  fetchBudgets,
  fetchBudgetsByMonth,
  fetchBudgetById,
  createBudget,
  updateBudget,
  deleteBudget,
  createBudgetItem,
  updateBudgetItem,
  deleteBudgetItem,
  createIncome,
  updateIncome,
  deleteIncome,
  createExpense,
  updateExpense,
  deleteExpense,
  setCurrentBudget,
  setFilters,
  clearBudgets,
  CreateBudgetData,
  UpdateBudgetData,
  CreateBudgetItemData,
  UpdateBudgetItemData,
  CreateIncomeData,
  UpdateIncomeData,
  CreateExpenseData,
  UpdateExpenseData,
  Budget,
} from '@/stores/redux/slices/budgetSlice'
import { useCallback } from 'react'

export const useBudgets = () => {
  const dispatch = useDispatch<AppDispatch>()
  const {
    budgets,
    currentBudget,
    budgetItems,
    budgetItemsHealth,
    incomes,
    expenses,
    isLoading,
    error,
    filters,
    summary,
    currentBudgetSummary,
  } = useSelector((state: RootState) => state.budgets)

  // Budget operations
  const loadBudgets = useCallback(() => {
    return dispatch(fetchBudgets())
  }, [dispatch])

  const loadBudgetsByMonth = useCallback((month: string) => {
    return dispatch(fetchBudgetsByMonth(month))
  }, [dispatch])

  const loadBudgetById = useCallback((id: number) => {
    return dispatch(fetchBudgetById(id))
  }, [dispatch])

  const addBudget = useCallback((budgetData: CreateBudgetData) => {
    return dispatch(createBudget(budgetData))
  }, [dispatch])

  const editBudget = useCallback((budgetData: UpdateBudgetData) => {
    return dispatch(updateBudget(budgetData))
  }, [dispatch])

  const removeBudget = useCallback((id: number) => {
    return dispatch(deleteBudget(id))
  }, [dispatch])

  // Budget Item operations
  const addBudgetItem = useCallback((itemData: CreateBudgetItemData) => {
    return dispatch(createBudgetItem(itemData))
  }, [dispatch])

  const editBudgetItem = useCallback((itemData: UpdateBudgetItemData) => {
    return dispatch(updateBudgetItem(itemData))
  }, [dispatch])

  const removeBudgetItem = useCallback((id: number) => {
    return dispatch(deleteBudgetItem(id))
  }, [dispatch])

  // Income operations
  const addIncome = useCallback((incomeData: CreateIncomeData) => {
    return dispatch(createIncome(incomeData))
  }, [dispatch])

  const editIncome = useCallback((incomeData: UpdateIncomeData) => {
    return dispatch(updateIncome(incomeData))
  }, [dispatch])

  const removeIncome = useCallback((id: number) => {
    return dispatch(deleteIncome(id))
  }, [dispatch])

  // Expense operations
  const addExpense = useCallback((expenseData: CreateExpenseData) => {
    return dispatch(createExpense(expenseData))
  }, [dispatch])

  const editExpense = useCallback((expenseData: UpdateExpenseData) => {
    return dispatch(updateExpense(expenseData))
  }, [dispatch])

  const removeExpense = useCallback((id: number) => {
    return dispatch(deleteExpense(id))
  }, [dispatch])

  // Utility actions
  const clearBudgetsError = useCallback(() => {
    dispatch(clearBudgetError())
  }, [dispatch])

  const selectBudget = useCallback((budget: Budget | null) => {
    dispatch(setCurrentBudget(budget))
  }, [dispatch])

  const updateFilters = useCallback((newFilters: { month?: string }) => {
    dispatch(setFilters(newFilters))
  }, [dispatch])

  const resetBudgets = useCallback(() => {
    dispatch(clearBudgets())
  }, [dispatch])

  // Computed values
  const totalPlannedAmount = budgetItems.reduce(
    (sum, item) => sum + parseFloat(item.planned_amount || '0'),
    0
  )

  const expenseBudgetItems = budgetItems.filter(
    (item) => item.category?.type === 'expense'
  )

  const incomeBudgetItems = budgetItems.filter(
    (item) => item.category?.type === 'income'
  )

  const savingsBudgetItems = budgetItems.filter(
    (item) => item.category?.type === 'savings'
  )

  const totalExpenseBudget = expenseBudgetItems.reduce(
    (sum, item) => sum + parseFloat(item.planned_amount || '0'),
    0
  )

  const totalIncomeBudget = incomeBudgetItems.reduce(
    (sum, item) => sum + parseFloat(item.planned_amount || '0'),
    0
  )

  const totalSavingsBudget = savingsBudgetItems.reduce(
    (sum, item) => sum + parseFloat(item.planned_amount || '0'),
    0
  )

  return {
    // State
    budgets,
    currentBudget,
    budgetItems,
    budgetItemsHealth,
    incomes,
    expenses,
    isLoading,
    error,
    filters,
    summary,
    currentBudgetSummary,
    
    // Computed
    totalPlannedAmount,
    expenseBudgetItems,
    incomeBudgetItems,
    savingsBudgetItems,
    totalExpenseBudget,
    totalIncomeBudget,
    totalSavingsBudget,
    
    // Budget Actions
    loadBudgets,
    loadBudgetsByMonth,
    loadBudgetById,
    addBudget,
    editBudget,
    removeBudget,
    
    // Budget Item Actions
    addBudgetItem,
    editBudgetItem,
    removeBudgetItem,
    
    // Income Actions
    addIncome,
    editIncome,
    removeIncome,
    
    // Expense Actions
    addExpense,
    editExpense,
    removeExpense,
    
    // Utility Actions
    clearBudgetsError,
    selectBudget,
    updateFilters,
    resetBudgets,
  }
}