import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { BudgetDetailSummary } from '@/stores/redux'
import { DollarSign, TrendingUp, Calculator, Wallet } from 'lucide-react'

interface BudgetDetailSummaryCardsProps {
  summary: BudgetDetailSummary | null
  isLoading: boolean
}

export function BudgetDetailSummaryCards({ summary, isLoading }: BudgetDetailSummaryCardsProps) {
  if (isLoading) {
    return (
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <Skeleton className="h-4 w-[100px]" />
              <Skeleton className="h-4 w-4" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-7 w-[120px] mb-1" />
              <Skeleton className="h-3 w-[80px]" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (!summary) {
    return (
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">No Data Available</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">--</div>
            <p className="text-xs text-muted-foreground">Budget summary not loaded</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  const formatCurrency = (amount: string) => {
    const num = parseFloat(amount)
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(num)
  }

  const getBalanceColor = (balance: string) => {
    const num = parseFloat(balance)
    if (num > 0) return 'text-green-600'
    if (num < 0) return 'text-red-600'
    return 'text-gray-600'
  }



  return (
    <div className="grid gap-3 grid-cols-2 lg:grid-cols-4">
      {/* Total Planned */}
      <Card className="border shadow-sm">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 text-blue-600 rounded-full">
              <Calculator className="h-4 w-4" />
            </div>
            <div>
              <div className="text-lg font-semibold">{formatCurrency(summary.total_planned)}</div>
              <p className="text-xs text-muted-foreground">Planned</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Total Income */}
      <Card className="border shadow-sm">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 text-green-600 rounded-full">
              <TrendingUp className="h-4 w-4" />
            </div>
            <div>
              <div className="text-lg font-semibold text-green-600">{formatCurrency(summary.total_income)}</div>
              <p className="text-xs text-muted-foreground">Income</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Total Expenses */}
      <Card className="border shadow-sm">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-100 text-red-600 rounded-full">
              <Wallet className="h-4 w-4" />
            </div>
            <div>
              <div className="text-lg font-semibold text-red-600">{formatCurrency(summary.total_expenses)}</div>
              <p className="text-xs text-muted-foreground">Expenses</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Balance */}
      <Card className="border shadow-sm">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-full ${
              parseFloat(summary.balance) > 0 
                ? 'bg-green-100 text-green-600' 
                : parseFloat(summary.balance) < 0 
                ? 'bg-red-100 text-red-600' 
                : 'bg-gray-100 text-gray-600'
            }`}>
              <DollarSign className="h-4 w-4" />
            </div>
            <div>
              <div className={`text-lg font-semibold ${getBalanceColor(summary.balance)}`}>
                {formatCurrency(summary.balance)}
              </div>
              <p className="text-xs text-muted-foreground">
                {parseFloat(summary.balance) >= 0 ? 'Remaining' : 'Over budget'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}