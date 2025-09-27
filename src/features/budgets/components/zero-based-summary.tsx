import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { AlertTriangle, CheckCircle, TrendingUp, DollarSign } from 'lucide-react'
import { type BudgetDetailSummary } from '@/stores/redux/slices/budgetSlice'

interface ZeroBasedSummaryProps {
  budgetSummary: BudgetDetailSummary | null
  isLoading?: boolean
}

export function ZeroBasedSummary({ budgetSummary, isLoading }: ZeroBasedSummaryProps) {
  const formatCurrency = (amount: string | number) => {
    const num = typeof amount === 'string' ? parseFloat(amount) : amount
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(num)
  }

  const getHealthScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600'
    if (score >= 60) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getHealthScoreBadge = (score: number) => {
    if (score >= 80) return { variant: 'default' as const, label: 'Excellent', icon: CheckCircle }
    if (score >= 60) return { variant: 'secondary' as const, label: 'Good', icon: TrendingUp }
    return { variant: 'destructive' as const, label: 'Needs Attention', icon: AlertTriangle }
  }

  const isZeroBased = (budgetSummary as any)?.unallocated_income ? parseFloat((budgetSummary as any).unallocated_income) === 0 : false
  const unallocatedAmount = (budgetSummary as any)?.unallocated_income ? parseFloat((budgetSummary as any).unallocated_income) : 0
  const healthScore = (budgetSummary as any)?.budget_health_score || 0
  const healthBadge = getHealthScoreBadge(healthScore)
  const HealthIcon = healthBadge.icon

  if (isLoading) {
    return (
      <Card className="border-0 shadow-sm h-full">
        <CardContent className="px-4 h-full flex flex-col justify-between">
          {/* Zero-Based Status Skeleton */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="animate-pulse">
                <div className="h-8 w-8 bg-muted rounded-full" />
              </div>
              <div className="animate-pulse">
                <div className="h-4 bg-muted rounded w-32 mb-2" />
                <div className="h-3 bg-muted rounded w-24" />
              </div>
            </div>
            <div className="animate-pulse">
              <div className="h-6 bg-muted rounded w-16" />
            </div>
          </div>

          {/* Health Score Skeleton */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="animate-pulse">
                <div className="h-8 w-8 bg-muted rounded-full" />
              </div>
              <div className="animate-pulse">
                <div className="h-5 bg-muted rounded w-12 mb-1" />
                <div className="h-3 bg-muted rounded w-20" />
              </div>
            </div>
            <div className="animate-pulse">
              <div className="h-2 bg-muted rounded w-20" />
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!budgetSummary) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Zero-Based Budget Summary</CardTitle>
          <CardDescription>No budget data available</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {/* Unified Zero-Based Status */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className={`p-2 rounded-full ${isZeroBased ? 'bg-green-100 text-green-600' : 'bg-orange-100 text-orange-600'}`}>
            {isZeroBased ? (
              <CheckCircle className="h-5 w-5" />
            ) : (
              <AlertTriangle className="h-5 w-5" />
            )}
          </div>
          <div>
            <h3 className="font-semibold">
              {isZeroBased ? 'Zero-Based Achieved' : 'Zero-Based In Progress'}
            </h3>
            <p className="text-sm text-muted-foreground">
              {isZeroBased ? 'All income allocated' : `${formatCurrency(unallocatedAmount)} remaining`}
            </p>
          </div>
        </div>
        <Badge variant={isZeroBased ? 'default' : 'secondary'} className="px-3">
          {isZeroBased ? 'Complete' : 'Pending'}
        </Badge>
      </div>

      {/* Health Score - Compact */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-full ${healthScore >= 80 ? 'bg-green-100 text-green-600' : healthScore >= 60 ? 'bg-yellow-100 text-yellow-600' : 'bg-red-100 text-red-600'}`}>
            <HealthIcon className="h-4 w-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className={`text-lg font-semibold ${getHealthScoreColor(healthScore)}`}>
                {healthScore.toFixed(0)}%
              </span>
              <Badge variant={healthBadge.variant} className="text-xs">
                {healthBadge.label}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground">Budget Health</p>
          </div>
        </div>
        <div className="w-24">
          <Progress value={healthScore} className="h-2" />
        </div>
      </div>
    </div>
  )
}