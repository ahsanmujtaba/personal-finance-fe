import { useEffect } from 'react'
import { Plus, Wallet, TrendingUp, Calendar, BarChart3 } from 'lucide-react'
import { toast } from 'sonner'
import { useNavigate } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { useBudgets } from '@/hooks/use-budgets'
import { useCategories } from '@/hooks/use-categories'
import {
  BudgetsTable,
  BudgetDialog,
  DeleteBudgetDialog,
  BudgetStatsCards,
  BudgetSkeleton,
  StatsCardsSkeleton,
  BudgetProvider,
  useBudgetProvider,
} from './components'
import { Budget } from '@/stores/redux/slices/budgetSlice'
import { BudgetSummaryCards } from '@/components/budget-summary-cards'

function BudgetsPageContent() {
  const navigate = useNavigate()
  const {
    budgets,
    isLoading,
    error,
    summary,
    loadBudgets,
    addBudget,
    editBudget,
    removeBudget,
    clearBudgetsError,
  } = useBudgets()

  const { loadCategories } = useCategories()
  const { open, setOpen, currentRow, setCurrentRow } = useBudgetProvider()

  // Load data on mount
  useEffect(() => {
    loadBudgets()
    loadCategories() // Categories are needed for budget items
  }, [])

  // Show error toast when error occurs
  useEffect(() => {
    if (error) {
      toast.error(error)
      clearBudgetsError()
    }
  }, [error, clearBudgetsError])

  const handleCreateBudget = () => {
    setCurrentRow(null)
    setOpen('create')
  }

  const handleEditBudget = (budget: Budget) => {
    setCurrentRow(budget)
    setOpen('update')
  }

  const handleDeleteBudget = (budget: Budget) => {
    setCurrentRow(budget)
    setOpen('delete')
  }

  const handleBudgetSubmit = async (data: { month: Date; notes?: string }) => {
    try {
      const budgetData = {
        month: data.month.toISOString().slice(0, 7) + '-01', // Format as YYYY-MM-01
        notes: data.notes || '',
      }

      if (currentRow) {
        await editBudget({ id: currentRow.id, ...budgetData })
        toast.success('Budget updated successfully!')
      } else {
        await addBudget(budgetData)
        toast.success('Budget created successfully!')
      }
    } catch (error) {
      // Error will be shown via useEffect above
      throw error
    }
  }

  const handleBudgetDelete = async (budget: Budget) => {
    try {
      await removeBudget(budget.id)
      toast.success('Budget deleted successfully!')
    } catch (error) {
      // Error will be shown via useEffect above
      throw error
    }
  }

  const handleViewDetails = (budget: Budget) => {
    navigate({ to: '/budgets/$budgetId', params: { budgetId: budget.id.toString() } })
  }

  if (isLoading && budgets.length === 0) {
    return (
      <div className="space-y-8">
        {/* Minimalist Header */}
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 text-blue-600 rounded-full">
            <Wallet className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-2xl font-semibold">Budgets</h1>
            <p className="text-sm text-muted-foreground">
              Manage monthly budgets
            </p>
          </div>
          <div className="ml-auto">
            <Button disabled size="sm">
              <Plus className="h-4 w-4 mr-2" />
              New Budget
            </Button>
          </div>
        </div>
        
        <BudgetSummaryCards summary={null} isLoading={true} />
        <BudgetSkeleton />
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Minimalist Header */}
      <div className="flex items-center gap-3">
        <div className="p-2 bg-blue-100 text-blue-600 rounded-full">
          <Wallet className="h-5 w-5" />
        </div>
        <div>
          <h1 className="text-2xl font-semibold">Budgets</h1>
          <p className="text-sm text-muted-foreground">
            Manage monthly budgets
          </p>
        </div>
        <div className="ml-auto">
          <Button onClick={handleCreateBudget} size="sm">
            <Plus className="h-4 w-4 mr-2" />
            New Budget
          </Button>
        </div>
      </div>

      {/* <BudgetSummaryCards summary={summary} isLoading={isLoading} /> */}

      {/* Clean Table Card */}
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 text-green-600 rounded-full">
              <BarChart3 className="h-4 w-4" />
            </div>
            <div>
              <CardTitle className="text-lg">All Budgets</CardTitle>
              <CardDescription className="text-sm">
                {budgets.length} budget{budgets.length !== 1 ? 's' : ''} total
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <BudgetsTable
            budgets={budgets}
            onEdit={handleEditBudget}
            onDelete={handleDeleteBudget}
            onViewDetails={handleViewDetails}
            isLoading={isLoading}
          />
        </CardContent>
      </Card>

      <BudgetDialog
        open={open === 'create' || open === 'update'}
        onOpenChange={(isOpen) => !isOpen && setOpen(null)}
        budget={currentRow}
        onSubmit={handleBudgetSubmit}
      />

      <DeleteBudgetDialog
        open={open === 'delete'}
        onOpenChange={(isOpen) => !isOpen && setOpen(null)}
        budget={currentRow}
        onConfirm={handleBudgetDelete}
      />
    </div>
  )
}

export default function BudgetsPage() {
  return (
    <BudgetProvider>
      <Header>
        <Search />
        <div className="ml-auto flex items-center space-x-4">
          <ThemeSwitch />
          <ProfileDropdown />
        </div>
      </Header>
      <Main>
        <BudgetsPageContent />
      </Main>
    </BudgetProvider>
  )
}