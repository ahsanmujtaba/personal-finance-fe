// Dashboard API Response Types

export interface DashboardOverview {
  current_month: {
    income: number
    expenses: number
    net: number
    income_change_percentage: number
    expense_change_percentage: number
  }
  year_to_date: {
    income: number
    expenses: number
    net: number
  }
  all_time: {
    income: number
    expenses: number
    net: number
  }
}

export interface Category {
  id: number
  user_id: number
  name: string
  type: string
  sort_order: number
  is_default: boolean
  created_at: string
  updated_at: string
}

export interface Budget {
  id: number
  user_id: number
  month: string
  notes: string | null
  created_at: string
  updated_at: string
}

export interface RecentExpenseTransaction {
  id: number
  user_id: number
  budget_id: number | null
  category_id: number
  date: string
  amount: string
  merchant: string | null
  note: string | null
  created_at: string
  updated_at: string
  budget_item_id: number | null
  category: Category
}

export interface RecentIncomeTransaction {
  id: number
  budget_id: number
  date: string
  amount: string
  source: string
  notes: string | null
  created_at: string
  updated_at: string
  user_id: number
  budget: Budget
}

export interface TopSpendingCategory {
  category: Category
  total_spent: number
}

export interface CategoryBreakdown {
  category: Category
  budgeted: number | null
  spent: number
  remaining: number
  percentage_used: number
  is_over_budget: boolean
}

export interface ActiveBudget {
  id: number
  name: string | null
  period: {
    start_date: string
    end_date: string
  }
  total_budgeted: number
  total_spent: number
  total_remaining: number
  percentage_used: number
  is_over_budget: boolean
  status: 'healthy' | 'warning' | 'over_budget'
  category_breakdown: CategoryBreakdown[]
}

export interface DashboardData {
  overview: DashboardOverview
  recent_transactions: {
    expenses: RecentExpenseTransaction[]
    incomes: RecentIncomeTransaction[]
  }
  top_spending_categories: TopSpendingCategory[]
  active_budgets: ActiveBudget[]
}

export interface DashboardApiResponse {
  success: boolean
  message: string
  data: DashboardData
}

// Current Month Budget Stats Types
export interface BudgetPeriod {
  start_date: string
  end_date: string
  days_total: number
  days_elapsed: number
  days_remaining: number
  period_progress_percentage: number
}

export interface BudgetSummary {
  total_budgeted: number
  total_spent: number
  total_remaining: number
  percentage_used: number
  is_over_budget: boolean
  over_budget_amount: number
}

export interface BudgetVelocity {
  daily_budget: number
  actual_daily_spending: number
  projected_month_end_spending: number
  on_track: boolean
}

export interface CategoryHealth {
  total_categories: number
  healthy_categories: number
  warning_categories: number
  over_budget_categories: number
}

export interface CurrentMonthBudgetStats {
  has_budget: boolean
  budget?: {
    id: number
    name: string
    period: BudgetPeriod
  }
  summary?: BudgetSummary
  velocity?: BudgetVelocity
  category_health?: CategoryHealth
  category_breakdown?: any[]
  message?: string
}

export interface CurrentMonthBudgetStatsApiResponse {
  success: boolean
  message: string
  data: CurrentMonthBudgetStats
}

// Dashboard Stats Card Types
export interface DashboardStatsCard {
  title: string
  value: string | number
  change?: {
    value: number
    type: 'increase' | 'decrease'
    label: string
  }
  icon: React.ComponentType<any>
  color?: 'default' | 'success' | 'warning' | 'destructive'
}