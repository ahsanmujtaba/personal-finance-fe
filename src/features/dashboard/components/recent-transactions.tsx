import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { 
  ArrowUpCircle, 
  ArrowDownCircle, 
  Calendar,
  Building2,
  Wallet
} from 'lucide-react'
import { DashboardData } from '@/types/dashboard'
import { cn } from '@/lib/utils'

interface RecentTransactionsProps {
  dashboardData: DashboardData | null
  isLoading: boolean
}

function formatCurrency(amount: string | number): string {
  const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(numAmount)
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric'
  })
}

export function RecentTransactions({ dashboardData, isLoading }: RecentTransactionsProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wallet className="h-5 w-5" />
            Recent Transactions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-muted animate-pulse" />
                  <div className="space-y-1">
                    <div className="h-4 w-24 bg-muted rounded animate-pulse" />
                    <div className="h-3 w-16 bg-muted rounded animate-pulse" />
                  </div>
                </div>
                <div className="h-4 w-16 bg-muted rounded animate-pulse" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!dashboardData?.recent_transactions) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wallet className="h-5 w-5" />
            Recent Transactions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-8">
            No recent transactions available
          </p>
        </CardContent>
      </Card>
    )
  }

  // Combine and sort transactions by date
  const allTransactions = [
    ...dashboardData.recent_transactions.expenses.map(expense => ({
      ...expense,
      type: 'expense' as const,
      displayName: expense.merchant || expense.category.name,
      displayAmount: expense.amount
    })),
    ...dashboardData.recent_transactions.incomes.map(income => ({
      ...income,
      type: 'income' as const,
      displayName: income.source,
      displayAmount: income.amount
    }))
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 8) // Show only 8 most recent

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wallet className="h-5 w-5" />
          Recent Transactions
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {allTransactions.map((transaction, index) => (
            <div key={`${transaction.type}-${transaction.id}`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={cn(
                    "flex h-8 w-8 items-center justify-center rounded-full",
                    transaction.type === 'expense' 
                      ? "bg-red-100 text-red-600 dark:bg-red-950 dark:text-red-400"
                      : "bg-green-100 text-green-600 dark:bg-green-950 dark:text-green-400"
                  )}>
                    {transaction.type === 'expense' ? (
                      <ArrowDownCircle className="h-4 w-4" />
                    ) : (
                      <ArrowUpCircle className="h-4 w-4" />
                    )}
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {transaction.displayName}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      {formatDate(transaction.date)}
                      {transaction.type === 'expense' && 'category' in transaction && (
                        <>
                          <span>•</span>
                          <Badge variant="outline" className="text-xs px-1 py-0">
                            {transaction.category.name}
                          </Badge>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                <div className={cn(
                  "text-sm font-medium",
                  transaction.type === 'expense' 
                    ? "text-red-600 dark:text-red-400"
                    : "text-green-600 dark:text-green-400"
                )}>
                  {transaction.type === 'expense' ? '-' : '+'}
                  {formatCurrency(transaction.displayAmount)}
                </div>
              </div>
              {index < allTransactions.length - 1 && (
                <Separator className="mt-3" />
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}