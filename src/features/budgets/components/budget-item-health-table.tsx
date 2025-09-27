import React from 'react'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { TrendingUp, TrendingDown, AlertTriangle } from 'lucide-react'
import { type BudgetItemHealth } from '@/stores/redux/slices/budgetSlice'

interface BudgetItemHealthTableProps {
  data: BudgetItemHealth[]
  isLoading?: boolean
}

export function BudgetItemHealthTable({ data, isLoading }: BudgetItemHealthTableProps) {
  const formatCurrency = (amount: string | undefined) => {
    const num = parseFloat(amount || '0')
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(num)
  }

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'under_budget':
        return 'default'
      case 'on_budget':
        return 'secondary'
      case 'over_budget':
        return 'destructive'
      default:
        return 'outline'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'under_budget':
        return <TrendingDown className="h-4 w-4 text-green-500" />
      case 'on_budget':
        return <TrendingUp className="h-4 w-4 text-blue-500" />
      case 'over_budget':
        return <AlertTriangle className="h-4 w-4 text-red-500" />
      default:
        return null
    }
  }

  const getProgressColor = (status: string) => {
    switch (status) {
      case 'under_budget':
        return 'bg-green-500'
      case 'on_budget':
        return 'bg-blue-500'
      case 'over_budget':
        return 'bg-red-500'
      default:
        return 'bg-gray-500'
    }
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Budget Items Health</CardTitle>
          <CardDescription>Loading budget health information...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="animate-pulse">
                <div className="h-4 bg-muted rounded mb-2" />
                <div className="h-2 bg-muted rounded" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Budget Items Health</CardTitle>
          <CardDescription>Track spending vs planned amounts for each budget item</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-muted-foreground">No budget items found.</p>
            <p className="text-sm text-muted-foreground mt-1">
              Add budget items to see their health status.
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Budget Items Health</CardTitle>
        <CardDescription>
          Track spending vs planned amounts for each budget item
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Category</TableHead>
                <TableHead className="text-right">Planned</TableHead>
                <TableHead className="text-right">Spent</TableHead>
                <TableHead className="text-right">Remaining</TableHead>
                <TableHead className="text-center">Progress</TableHead>
                <TableHead className="text-center">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((item, index) => (
                <TableRow key={item.id || `budget-item-${index}`}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(item.status)}
                      {item.category}
                    </div>
                  </TableCell>
                  <TableCell className="text-right font-mono">
                    {formatCurrency(item.planned_amount)}
                  </TableCell>
                  <TableCell className="text-right font-mono">
                    {formatCurrency(item.spent_amount)}
                  </TableCell>
                  <TableCell className="text-right font-mono">
                    <span className={parseFloat(item.remaining_amount || '0') >= 0 ? 'text-green-600' : 'text-red-600'}>
                      {formatCurrency(item.remaining_amount || '0')}
                    </span>
                  </TableCell>
                  <TableCell className="text-center items-center">
                    <div className="flex items-center gap-2">
                      <Progress 
                        value={Math.min(parseFloat(item.utilization_percentage?.toString() || '0'), 100)} 
                        className="w-16 h-2"
                      />
                      <span className="text-sm text-muted-foreground min-w-[3rem]">
                        {(parseFloat(item.utilization_percentage?.toString() || '0')).toFixed(0)}%
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge variant={getStatusVariant(item.status)}>
                      {item.status.replace('_', ' ')}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}