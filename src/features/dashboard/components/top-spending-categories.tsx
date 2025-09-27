import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { 
  TrendingUp,
  ShoppingCart,
  Car,
  Home,
  Utensils,
  Coffee,
  Gamepad2,
  Heart,
  GraduationCap,
  Plane,
  MoreHorizontal
} from 'lucide-react'
import { DashboardData } from '@/types/dashboard'
import { cn } from '@/lib/utils'

interface TopSpendingCategoriesProps {
  dashboardData: DashboardData | null
  isLoading: boolean
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount)
}

// Map category names to icons
function getCategoryIcon(categoryName: string) {
  const name = categoryName.toLowerCase()
  
  if (name.includes('food') || name.includes('restaurant') || name.includes('dining')) {
    return Utensils
  }
  if (name.includes('coffee') || name.includes('drink')) {
    return Coffee
  }
  if (name.includes('transport') || name.includes('car') || name.includes('gas') || name.includes('fuel')) {
    return Car
  }
  if (name.includes('shopping') || name.includes('retail') || name.includes('store')) {
    return ShoppingCart
  }
  if (name.includes('home') || name.includes('rent') || name.includes('utilities')) {
    return Home
  }
  if (name.includes('entertainment') || name.includes('game') || name.includes('movie')) {
    return Gamepad2
  }
  if (name.includes('health') || name.includes('medical') || name.includes('fitness')) {
    return Heart
  }
  if (name.includes('education') || name.includes('school') || name.includes('book')) {
    return GraduationCap
  }
  if (name.includes('travel') || name.includes('vacation') || name.includes('flight')) {
    return Plane
  }
  
  return MoreHorizontal
}

export function TopSpendingCategories({ dashboardData, isLoading }: TopSpendingCategoriesProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Top Spending Categories
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-muted animate-pulse" />
                    <div className="h-4 w-20 bg-muted rounded animate-pulse" />
                  </div>
                  <div className="h-4 w-16 bg-muted rounded animate-pulse" />
                </div>
                <div className="h-2 w-full bg-muted rounded animate-pulse" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!dashboardData?.top_spending_categories?.length) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Top Spending Categories
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-8">
            No spending data available
          </p>
        </CardContent>
      </Card>
    )
  }

  // Calculate total spending for percentage calculation
  const totalSpending = dashboardData.top_spending_categories.reduce(
    (sum, category) => sum + category.total_spent, 
    0
  )

  // Get top 5 categories
  const topCategories = [...dashboardData.top_spending_categories]
    .sort((a, b) => b.total_spent - a.total_spent)
    .slice(0, 5)

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          Top Spending Categories
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {topCategories.map((category, index) => {
            const percentage = totalSpending > 0 ? (category.total_spent / totalSpending) * 100 : 0
            const Icon = getCategoryIcon(category.category.name)
            
            return (
              <div key={category.category.id} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "flex h-8 w-8 items-center justify-center rounded-full",
                      index === 0 ? "bg-red-100 text-red-600 dark:bg-red-950 dark:text-red-400" :
                      index === 1 ? "bg-orange-100 text-orange-600 dark:bg-orange-950 dark:text-orange-400" :
                      index === 2 ? "bg-yellow-100 text-yellow-600 dark:bg-yellow-950 dark:text-yellow-400" :
                      "bg-blue-100 text-blue-600 dark:bg-blue-950 dark:text-blue-400"
                    )}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-sm font-medium leading-none">
                        {category.category.name}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {percentage.toFixed(1)}% of total spending
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">
                      {formatCurrency(category.total_spent)}
                    </p>
                  </div>
                </div>
                <Progress 
                  value={percentage} 
                  className={cn(
                    "h-2",
                    index === 0 ? "[&>div]:bg-red-500" :
                    index === 1 ? "[&>div]:bg-orange-500" :
                    index === 2 ? "[&>div]:bg-yellow-500" :
                    "[&>div]:bg-blue-500"
                  )}
                />
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}