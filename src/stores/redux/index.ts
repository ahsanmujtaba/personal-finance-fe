// Redux store and types
export { store } from './store'
export type { RootState, AppDispatch } from './store'

// Redux hooks
export { useAppDispatch, useAppSelector } from './hooks'

// Redux provider
export { ReduxProvider } from './ReduxProvider'

// Auth slice
export {
  authSlice,
  loginUser,
  registerUser,
  logoutUser,
  logoutAllDevices,
  fetchUserProfile,
  updateUserProfile,
  updateUserPassword,
  clearError as clearAuthError,
  loadUserFromStorage,
  clearAuth,
} from './slices/authSlice'
export type {
  User,
  AuthState,
  LoginCredentials,
  RegisterCredentials,
  UpdateProfileData,
  UpdatePasswordData,
} from './slices/authSlice'

// Budget slice
export {
  budgetSlice,
  fetchBudgets,
  fetchBudgetsByMonth,
  fetchBudgetById,
  createBudget,
  updateBudget,
  deleteBudget,
  createBudgetItem,
  updateBudgetItem,
  deleteBudgetItem,
  clearError as clearBudgetError,
  setCurrentBudget,
  setFilters,
  clearBudgets,
} from './slices/budgetSlice'
export type {
  Budget,
  BudgetItem,
  BudgetSummary,
  BudgetState,
  BudgetDetailSummary,
  CreateBudgetData,
  UpdateBudgetData,
  CreateBudgetItemData,
  UpdateBudgetItemData,
} from './slices/budgetSlice'

// Dashboard slice
export {
  dashboardSlice,
  fetchDashboardData,
  fetchCurrentMonthBudgetStats,
  clearError as clearDashboardError,
  clearDashboardData,
} from './slices/dashboardSlice'
export type {
  DashboardState,
} from './slices/dashboardSlice'

// Categories slice
export {
  categoriesSlice,
  fetchCategories,
  fetchCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
  clearError as clearCategoriesError,
  setCurrentCategory,
  setFilters as setCategoriesFilters,
  clearCategories,
} from './slices/categoriesSlice'
export type {
  Category,
  CreateCategoryData,
  UpdateCategoryData,
  CategoriesState,
} from './slices/categoriesSlice'