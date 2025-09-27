import { configureStore } from '@reduxjs/toolkit'
import { budgetSlice } from './slices/budgetSlice'
import { authSlice } from './slices/authSlice'
import { categoriesSlice } from './slices/categoriesSlice'
import { dashboardSlice } from './slices/dashboardSlice'

export const store = configureStore({
  reducer: {
    budgets: budgetSlice.reducer,
    auth: authSlice.reducer,
    categories: categoriesSlice.reducer,
    dashboard: dashboardSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch