import { createFileRoute } from '@tanstack/react-router'
import BudgetDetailPage from '@/features/budgets/detail'

export const Route = createFileRoute('/_authenticated/budgets/$budgetId')({
  component: BudgetDetailPage,
})