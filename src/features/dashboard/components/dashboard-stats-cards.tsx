import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Badge } from '@/components/ui/badge'
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  Wallet, 
  Target,
  AlertTriangle,
  CheckCircle,
  Calendar
} from 'lucide-react'
import { DashboardData, CurrentMonthBudgetStats } from '@/types/dashboard'
import { cn } from '@/lib/utils'

interface DashboardStatsCardsProps {
  dashboardData: DashboardData | null
  isLoading: boolean
}

interface StatCardProps {
  title: string
  value: string
  change?: {
    value: number
    type: 'increase' | 'decrease'
    label: string
  }
  icon: React.ComponentType<{ className?: string }>
  variant?: 'default' | 'success' | 'warning' | 'destructive'
}

function StatCard({ title, value, change, icon: Icon, variant = 'default' }: StatCardProps) {
  const variantStyles = {
    default: 'border-border',
    success: 'border-green-200 bg-green-50/50 dark:border-green-800 dark:bg-green-950/50',
    warning: 'border-yellow-200 bg-yellow-50/50 dark:border-yellow-800 dark:bg-yellow-950/50',
    destructive: 'border-red-200 bg-red-50/50 dark:border-red-800 dark:bg-red-950/50'
  }

  const iconStyles = {
    default: 'text-muted-foreground',
    success: 'text-green-600 dark:text-green-400',
    warning: 'text-yellow-600 dark:text-yellow-400',
    destructive: 'text-red-600 dark:text-red-400'
  }

  return (
    <Card className={cn('transition-colors', variantStyles[variant])}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <Icon className={cn('h-4 w-4', iconStyles[variant])} />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {change && (
          <div className="flex items-center text-xs text-muted-foreground mt-1">
            {change.type === 'increase' ? (
              <TrendingUp className="mr-1 h-3 w-3 text-green-500" />
            ) : (
              <TrendingDown className="mr-1 h-3 w-3 text-red-500" />
            )}
            <span className={change.type === 'increase' ? 'text-green-600' : 'text-red-600'}>
              {change.value > 0 ? '+' : ''}{change.value.toFixed(1)}%
            </span>
            <span className="ml-1">{change.label}</span>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

function StatCardSkeleton() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-4 w-4 rounded" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-8 w-20 mb-2" />
        <Skeleton className="h-3 w-32" />
      </CardContent>
    </Card>
  )
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

function getBudgetVariant(percentage: number, isOverBudget: boolean): 'default' | 'success' | 'warning' | 'destructive' {
  if (isOverBudget) return 'destructive'
  if (percentage >= 90) return 'warning'
  if (percentage <= 70) return 'success'
  return 'default'
}

export function DashboardStatsCards({ dashboardData, isLoading }: DashboardStatsCardsProps) {
  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCardSkeleton />
        <StatCardSkeleton />
        <StatCardSkeleton />
        <StatCardSkeleton />
      </div>
    )
  }

  if (!dashboardData) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="col-span-full">
          <CardContent className="flex items-center justify-center h-24">
            <p className="text-muted-foreground">No dashboard data available</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Calculate stats from dashboard data only
  const stats: StatCardProps[] = [
    {
      title: 'Monthly Income',
      value: formatCurrency(dashboardData?.overview.current_month.income || 0),
      change: dashboardData?.overview.current_month.income_change_percentage ? {
        value: Math.abs(dashboardData.overview.current_month.income_change_percentage),
        type: dashboardData.overview.current_month.income_change_percentage >= 0 ? 'increase' : 'decrease',
        label: 'from last month'
      } : undefined,
      icon: TrendingUp,
      variant: 'success'
    },
    {
      title: 'Monthly Expenses',
      value: formatCurrency(dashboardData?.overview.current_month.expenses || 0),
      change: dashboardData?.overview.current_month.expense_change_percentage ? {
        value: Math.abs(dashboardData.overview.current_month.expense_change_percentage),
        type: dashboardData.overview.current_month.expense_change_percentage >= 0 ? 'increase' : 'decrease',
        label: 'from last month'
      } : undefined,
      icon: TrendingDown,
      variant: 'destructive'
    },
    {
      title: 'Net Income',
      value: formatCurrency(dashboardData?.overview.current_month.net || 0),
      change: undefined,
      icon: DollarSign,
      variant: (dashboardData?.overview.current_month.net || 0) >= 0 ? 'success' : 'destructive'
    },
    {
      title: 'Year to Date',
      value: formatCurrency(dashboardData?.overview.year_to_date.net || 0),
      change: undefined,
      icon: Calendar,
      variant: (dashboardData?.overview.year_to_date.net || 0) >= 0 ? 'success' : 'destructive'
    }
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, index) => (
        <StatCard key={index} {...stat} />
      ))}
    </div>
  )
}