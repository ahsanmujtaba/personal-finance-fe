import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState, clearCategoriesError } from '@/stores/redux'
import {
  fetchCategories,
  fetchCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
  setCurrentCategory,
  setFilters,
  clearCategories,
  CreateCategoryData,
  UpdateCategoryData,
  Category,
} from '@/stores/redux/slices/categoriesSlice'
import { useCallback } from 'react'

export const useCategories = () => {
  const dispatch = useDispatch<AppDispatch>()
  const {
    categories,
    currentCategory,
    isLoading,
    error,
    filters,
  } = useSelector((state: RootState) => state.categories)

  // Actions
  const loadCategories = useCallback(
    (type?: 'expense' | 'income' | 'savings') => {
      return dispatch(fetchCategories({ type }))
    },
    [dispatch]
  )

  const loadCategoryById = useCallback(
    (id: number) => {
      return dispatch(fetchCategoryById(id))
    },
    [dispatch]
  )

  const addCategory = useCallback(
    (categoryData: CreateCategoryData) => {
      return dispatch(createCategory(categoryData))
    },
    [dispatch]
  )

  const editCategory = useCallback(
    (categoryData: UpdateCategoryData) => {
      return dispatch(updateCategory(categoryData))
    },
    [dispatch]
  )

  const removeCategory = useCallback(
    (id: number) => {
      return dispatch(deleteCategory(id))
    },
    [dispatch]
  )

  const clearCategoriesErrorCallback = useCallback(() => {
    dispatch(clearCategoriesError())
  }, [dispatch])

  const selectCategory = useCallback(
    (category: Category | null) => {
      dispatch(setCurrentCategory(category))
    },
    [dispatch]
  )

  const updateFilters = useCallback(
    (newFilters: { type?: 'expense' | 'income' | 'savings' }) => {
      dispatch(setFilters(newFilters))
    },
    [dispatch]
  )

  const resetCategories = useCallback(() => {
    dispatch(clearCategories())
  }, [dispatch])

  // Computed values
  const expenseCategories = categories.filter(cat => cat.type === 'expense')
  const incomeCategories = categories.filter(cat => cat.type === 'income')
  const savingCategories = categories.filter(cat => cat.type === 'savings')
  const defaultCategories = categories.filter(cat => cat.is_default)

  return {
    // State
    categories,
    currentCategory,
    isLoading,
    error,
    filters,
    
    // Computed
    expenseCategories,
    incomeCategories,
    savingCategories,
    defaultCategories,
    
    // Actions
    loadCategories,
    loadCategoryById,
    addCategory,
    editCategory,
    removeCategory,
    clearCategoriesError: clearCategoriesErrorCallback,
    selectCategory,
    updateFilters,
    resetCategories,
  }
}