import { Calendar, DollarSign, TrendingUp, Target } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Budget } from '@/stores/redux/slices/budgetSlice'
import { StatsCardsSkeleton } from './stats-skeleton'

interface BudgetStatsCardsProps {
  budgets: Budget[]
  isLoading: boolean
}

export function BudgetStatsCards({ budgets, isLoading }: BudgetStatsCardsProps) {
  if (isLoading) {
    return <StatsCardsSkeleton />
  }

  // Calculate stats
  const totalBudgets = budgets.length
  
  const currentMonth = new Date().toISOString().slice(0, 7) // YYYY-MM format
  const currentMonthBudgets = budgets.filter(budget => 
    budget.month.startsWith(currentMonth)
  )
  
  const totalPlannedAmount = budgets.reduce((sum, budget) => {
    if (budget.budget_items) {
      return sum + budget.budget_items.reduce((itemSum, item) => 
        itemSum + parseFloat(item.planned_amount || '0'), 0
      )
    }
    return sum
  }, 0)
  
  const currentMonthPlanned = currentMonthBudgets.reduce((sum, budget) => {
    if (budget.budget_items) {
      return sum + budget.budget_items.reduce((itemSum, item) => 
        itemSum + parseFloat(item.planned_amount || '0'), 0
      )
    }
    return sum
  }, 0)

  const stats = [
    {
      title: 'Total Budgets',
      value: totalBudgets.toString(),
      description: 'Active budget periods',
      icon: Calendar,
      trend: totalBudgets > 0 ? '+' + totalBudgets : '0',
    },
    {
      title: 'Current Month',
      value: currentMonthBudgets.length.toString(),
      description: 'Budgets for this month',
      icon: Target,
      trend: currentMonthBudgets.length > 0 ? 'Active' : 'None',
    },
    {
      title: 'Total Planned',
      value: `$${totalPlannedAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      description: 'Across all budgets',
      icon: DollarSign,
      trend: totalPlannedAmount > 0 ? 'Allocated' : 'No allocation',
    },
    {
      title: 'This Month',
      value: `$${currentMonthPlanned.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      description: 'Current month planned',
      icon: TrendingUp,
      trend: currentMonthPlanned > 0 ? 'Planned' : 'No plan',
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, index) => {
        const Icon = stat.icon
        return (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <Icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                {stat.description}
              </p>
              <div className="mt-1">
                <span className="text-xs text-muted-foreground">
                  {stat.trend}
                </span>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}