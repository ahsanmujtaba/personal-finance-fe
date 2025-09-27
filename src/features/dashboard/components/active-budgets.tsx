import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  Target,
  Calendar,
  AlertTriangle,
  CheckCircle,
  TrendingUp,
  Clock,
  Plus,
  Receipt,
  Eye
} from 'lucide-react'
import { DashboardData } from '@/types/dashboard'
import { cn } from '@/lib/utils'
import { useNavigate } from '@tanstack/react-router'
import { ExpenseDialog } from '@/features/budgets/components/expense-dialog'
import { IncomeDialog } from '@/features/budgets/components/income-dialog'
import { useBudgets } from '@/hooks/use-budgets'
import { useCategories } from '@/hooks/use-categories'
import { toast } from 'sonner'

interface ActiveBudgetsProps {
  dashboardData: DashboardData | null
  isLoading: boolean
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount)
}

function formatDateRange(startDate: string, endDate: string): string {
  const start = new Date(startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  const end = new Date(endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  return `${start} - ${end}`
}

function getBudgetStatusIcon(status: string) {
  switch (status) {
    case 'healthy':
      return CheckCircle
    case 'warning':
      return Clock
    case 'over_budget':
      return AlertTriangle
    default:
      return Target
  }
}

function getBudgetStatusColor(status: string) {
  switch (status) {
    case 'healthy':
      return 'text-green-600 dark:text-green-400'
    case 'warning':
      return 'text-yellow-600 dark:text-yellow-400'
    case 'over_budget':
      return 'text-red-600 dark:text-red-400'
    default:
      return 'text-muted-foreground'
  }
}

function getProgressColor(status: string) {
  switch (status) {
    case 'healthy':
      return '[&>div]:bg-green-500'
    case 'warning':
      return '[&>div]:bg-yellow-500'
    case 'over_budget':
      return '[&>div]:bg-red-500'
    default:
      return '[&>div]:bg-blue-500'
  }
}

export function ActiveBudgets({ dashboardData, isLoading }: ActiveBudgetsProps) {
  const navigate = useNavigate()
  const { addExpense, addIncome, budgetItems } = useBudgets()
  const { categories } = useCategories()
  const [expenseDialogOpen, setExpenseDialogOpen] = useState(false)
  const [incomeDialogOpen, setIncomeDialogOpen] = useState(false)
  const [selectedBudgetId, setSelectedBudgetId] = useState<number | null>(null)

  const handleBudgetClick = (budgetId: number) => {
    navigate({ to: '/budgets/$budgetId', params: { budgetId: budgetId.toString() } })
  }

  const handleAddExpense = (budgetId: number) => {
    setSelectedBudgetId(budgetId)
    setExpenseDialogOpen(true)
  }

  const handleAddIncome = (budgetId: number) => {
    setSelectedBudgetId(budgetId)
    setIncomeDialogOpen(true)
  }

  const handleExpenseSubmit = async (data: any) => {
    try {
      await addExpense(data)
      toast.success('Expense added successfully')
      setExpenseDialogOpen(false)
      setSelectedBudgetId(null)
    } catch (error) {
      toast.error('Failed to add expense')
    }
  }

  const handleIncomeSubmit = async (data: any) => {
    try {
      await addIncome({ ...data, budget_id: selectedBudgetId })
      toast.success('Income added successfully')
      setIncomeDialogOpen(false)
      setSelectedBudgetId(null)
    } catch (error) {
      toast.error('Failed to add income')
    }
  }
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Active Budgets
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="space-y-3 p-4 border rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-muted animate-pulse" />
                    <div className="space-y-1">
                      <div className="h-4 w-24 bg-muted rounded animate-pulse" />
                      <div className="h-3 w-20 bg-muted rounded animate-pulse" />
                    </div>
                  </div>
                  <div className="h-6 w-16 bg-muted rounded animate-pulse" />
                </div>
                <div className="h-2 w-full bg-muted rounded animate-pulse" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!dashboardData?.active_budgets?.length) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Active Budgets
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-8">
            No active budgets found
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="h-5 w-5" />
          Active Budgets
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {dashboardData.active_budgets.map((budget) => {
            const StatusIcon = getBudgetStatusIcon(budget.status)
            const progressValue = Math.min(budget.percentage_used, 100)
            
            return (
              <div key={budget.id} className="space-y-3 p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                <div className="flex items-center justify-between">
                  <div 
                    className="flex items-center gap-3 cursor-pointer flex-1"
                    onClick={() => handleBudgetClick(budget.id)}
                  >
                    <div className={cn(
                      "flex h-8 w-8 items-center justify-center rounded-full",
                      budget.status === 'healthy' ? "bg-green-100 text-green-600 dark:bg-green-950 dark:text-green-400" :
                      budget.status === 'warning' ? "bg-yellow-100 text-yellow-600 dark:bg-yellow-950 dark:text-yellow-400" :
                      budget.status === 'over_budget' ? "bg-red-100 text-red-600 dark:bg-red-950 dark:text-red-400" :
                      "bg-blue-100 text-blue-600 dark:bg-blue-950 dark:text-blue-400"
                    )}>
                      <StatusIcon className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-sm font-medium leading-none hover:text-primary transition-colors">
                        {budget.name || `Budget #${budget.id}`}
                      </p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                        <Calendar className="h-3 w-3" />
                        {formatDateRange(budget.period.start_date, budget.period.end_date)}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge 
                      variant={budget.status === 'over_budget' ? 'destructive' : 
                              budget.status === 'warning' ? 'secondary' : 'default'}
                      className="text-xs"
                    >
                      {budget.status.replace('_', ' ')}
                    </Badge>
                  </div>
                </div>
                
                {/* Quick Action Buttons */}
                <div className="flex items-center gap-2 pt-2 border-t">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleBudgetClick(budget.id)
                    }}
                    className="flex-1"
                  >
                    <Eye className="h-3 w-3 mr-1" />
                    View Details
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleAddExpense(budget.id)
                    }}
                    className="flex-1"
                  >
                    <Receipt className="h-3 w-3 mr-1" />
                    Add Expense
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleAddIncome(budget.id)
                    }}
                    className="flex-1"
                  >
                    <TrendingUp className="h-3 w-3 mr-1" />
                    Add Income
                  </Button>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">
                      {formatCurrency(budget.total_spent)} of {formatCurrency(budget.total_budgeted)}
                    </span>
                    <span className={cn(
                      "font-medium",
                      getBudgetStatusColor(budget.status)
                    )}>
                      {budget.percentage_used.toFixed(1)}%
                    </span>
                  </div>
                  <Progress 
                    value={progressValue} 
                    className={cn("h-2", getProgressColor(budget.status))}
                  />
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>
                      Remaining: {formatCurrency(budget.total_remaining)}
                    </span>
                    {budget.is_over_budget && (
                      <span className="text-red-600 dark:text-red-400 font-medium">
                        Over budget
                      </span>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
      
      {/* Dialogs */}
      <ExpenseDialog
        open={expenseDialogOpen}
        onOpenChange={setExpenseDialogOpen}
        onSubmit={handleExpenseSubmit}
        budgetItems={budgetItems.filter(item => item.budget_id === selectedBudgetId)}
        budgetId={selectedBudgetId || 0}
        title="Add Expense"
        description="Add a new expense to this budget."
      />
      
      <IncomeDialog
        open={incomeDialogOpen}
        onOpenChange={setIncomeDialogOpen}
        onSubmit={handleIncomeSubmit}
        title="Add Income"
        description="Add a new income to this budget."
      />
    </Card>
  )
}