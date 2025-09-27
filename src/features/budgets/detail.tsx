import { useEffect } from 'react'
import { useParams, useNavigate } from '@tanstack/react-router'
import { ArrowLeft, Plus } from 'lucide-react'
import { useBudgets } from '@/hooks/use-budgets'
import { useCategories } from '@/hooks/use-categories'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from 'sonner'
import {
  BudgetItemsTable,
  BudgetItemDialog,
  DeleteBudgetItemDialog,
  BudgetItemSkeleton,
  BudgetDetailProvider,
  useBudgetDetailProvider,
  BudgetDetailTabs,
  ZeroBasedSummary,
  BudgetItemHealthTable,
} from './components'
import { type BudgetItem, type Income, type Expense } from '@/stores/redux/slices/budgetSlice'
import { ThemeSwitch } from '@/components/theme-switch'
import { Header } from '@/components/layout/header'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Main } from '@/components/layout/main'
import { Search } from '@/components/search'
import { BudgetDetailSummaryCards } from '@/components/budget-detail-summary-cards'

function BudgetDetailPageContent() {
  const { budgetId } = useParams({ strict: false })
  const budgetIdNumber = parseInt(budgetId as string)
  const navigate = useNavigate()
  const {
    currentBudget,
    currentBudgetSummary,
    budgetItems,
    budgetItemsHealth,
    incomes,
    expenses,
    isLoading,
    error,
    loadBudgetById,
    addBudgetItem,
    editBudgetItem,
    removeBudgetItem,
    addIncome,
    editIncome,
    removeIncome,
    addExpense,
    editExpense,
    removeExpense,
    clearBudgetsError,
  } = useBudgets()
  const { categories, loadCategories } = useCategories()

  const { open, setOpen, currentRow, setCurrentRow } = useBudgetDetailProvider()

  useEffect(() => {
    if (budgetIdNumber) {
      loadBudgetById(budgetIdNumber)
    }
    loadCategories()
  }, [budgetIdNumber, loadBudgetById, loadCategories])

  useEffect(() => {
    if (error) {
      toast.error(error)
      clearBudgetsError()
    }
  }, [error, clearBudgetsError])

  const handleCreateBudgetItem = async (data: { category_id: number; planned_amount: number; notes?: string }) => {
    try {
      await addBudgetItem({ ...data, budget_id: budgetIdNumber })
      setOpen(null)
      toast.success('Budget item created successfully')
      // Refetch budget data to update summary and lists
      loadBudgetById(budgetIdNumber)
    } catch (error) {
      toast.error('Failed to create budget item')
    }
  }

  const handleEditBudgetItem = async (data: { category_id: number; planned_amount: number; notes?: string }) => {
    if (!currentRow) return
    try {
      await editBudgetItem({ ...data, id: currentRow.id })
      setOpen(null)
      toast.success('Budget item updated successfully')
      // Refetch budget data to update summary and lists
      loadBudgetById(budgetIdNumber)
    } catch (error) {
      toast.error('Failed to update budget item')
    }
  }

  const handleDeleteBudgetItem = async () => {
    if (!currentRow) return
    try {
      await removeBudgetItem(currentRow.id)
      setOpen(null)
      toast.success('Budget item deleted successfully')
      // Refetch budget data to update summary and lists
      loadBudgetById(budgetIdNumber)
    } catch (error) {
      toast.error('Failed to delete budget item')
    }
  }

  const handleEditClick = (budgetItem: BudgetItem) => {
    setCurrentRow(budgetItem)
    setOpen('update')
  }

  const handleDeleteClick = (budgetItem: BudgetItem) => {
    setCurrentRow(budgetItem)
    setOpen('delete')
  }

  // Income handlers
  const handleCreateIncome = async (incomeData: any) => {
    if (!currentBudget) return
    try {
      await addIncome({ ...incomeData, budget_id: currentBudget.id })
      toast.success('Income created successfully')
      // Refetch budget data to update summary and lists
      loadBudgetById(currentBudget.id)
    } catch (error) {
      toast.error('Failed to create income entry')
    }
  }

  const handleEditIncome = async (incomeData: any) => {
    try {
      await editIncome({ ...incomeData, budget_id: budgetIdNumber })
      toast.success('Income updated successfully')
      // Refetch budget data to update summary and lists
      loadBudgetById(budgetIdNumber)
    } catch (error) {
      toast.error('Failed to update income entry')
    }
  }

  const handleDeleteIncome = async (income: Income) => {
    try {
      await removeIncome(income.id)
      toast.success('Income deleted successfully')
      // Refetch budget data to update summary and lists
      loadBudgetById(budgetIdNumber)
    } catch (error) {
      toast.error('Failed to delete income entry')
    }
  }

  // Expense handlers
  const handleCreateExpense = async (expenseData: any) => {
    if (!currentBudget) return
    try {
      await addExpense({ ...expenseData, budget_id: currentBudget.id })
      toast.success('Expense created successfully')
      // Refetch budget data to update summary and lists
      loadBudgetById(currentBudget.id)
    } catch (error) {
      toast.error('Failed to create expense entry')
    }
  }

  const handleEditExpense = async (expenseData: any) => {
    try {
      await editExpense(expenseData)
      toast.success('Expense updated successfully')
      // Refetch budget data to update summary and lists
      loadBudgetById(budgetIdNumber)
    } catch (error) {
      toast.error('Failed to update expense entry')
    }
  }

  const handleDeleteExpense = async (expense: Expense) => {
    try {
      await removeExpense(expense.id)
      toast.success('Expense deleted successfully')
      // Refetch budget data to update summary and lists
      loadBudgetById(budgetIdNumber)
    } catch (error) {
      toast.error('Failed to delete expense entry')
    }
  }

  if (isLoading && !currentBudget) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" disabled>
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
        </div>
        <BudgetItemSkeleton />
      </div>
    )
  }

  if (!currentBudget) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <h2 className="text-2xl font-semibold">Budget not found</h2>
        <p className="text-muted-foreground">The budget you're looking for doesn't exist.</p>
        <Button onClick={() => navigate({ to: '/budgets' })}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Budgets
        </Button>
      </div>
    )
  }



  return (
    <div className="space-y-8">
      {/* Minimalist Header */}
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate({ to: '/budgets' })}
          className="h-8 w-8"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-semibold">
            {currentBudget.notes}
          </h1>
          <p className="text-sm text-muted-foreground">
            Budget Overview
          </p>
        </div>
      </div>

      {/* Consolidated Summary Section */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Zero-Based Status - Simplified */}
        <Card className="lg:col-span-1">
          <CardContent className="px-6">
            <ZeroBasedSummary 
              budgetSummary={currentBudgetSummary} 
              isLoading={isLoading} 
            />
          </CardContent>
        </Card>
        
        {/* Key Metrics - Streamlined */}
        <div className="lg:col-span-2">
          <BudgetDetailSummaryCards 
            summary={currentBudgetSummary} 
            isLoading={isLoading} 
          />
        </div>
      </div>

      {/* Main Content - Clean Tabs */}
      <BudgetDetailTabs
        budgetItems={budgetItems}
        incomes={incomes}
        expenses={expenses}
        categories={categories}
        isLoading={isLoading}
        budgetId={budgetIdNumber}
        onCreateBudgetItem={() => setOpen('create')}
        onEditBudgetItem={handleEditClick}
        onDeleteBudgetItem={handleDeleteClick}
        onCreateIncome={handleCreateIncome}
        onEditIncome={handleEditIncome}
        onDeleteIncome={handleDeleteIncome}
        onCreateExpense={handleCreateExpense}
        onEditExpense={handleEditExpense}
        onDeleteExpense={handleDeleteExpense}
      />

      {/* Dialogs */}
      <BudgetItemDialog
        open={open === 'create'}
        onOpenChange={(isOpen) => !isOpen && setOpen(null)}
        onSubmit={handleCreateBudgetItem}
        categories={categories}
        title="Create Budget Item"
        description="Add a new item to this budget"
      />

      <BudgetItemDialog
        open={open === 'update'}
        onOpenChange={(isOpen) => !isOpen && setOpen(null)}
        onSubmit={handleEditBudgetItem}
        categories={categories}
        budgetItem={currentRow}
        title="Edit Budget Item"
        description="Update the budget item details"
      />

      <DeleteBudgetItemDialog
        open={open === 'delete'}
        onOpenChange={(isOpen) => !isOpen && setOpen(null)}
        onConfirm={handleDeleteBudgetItem}
        budgetItem={currentRow}
      />
    </div>
  )
}

export default function BudgetDetailPage() {
  return (
    <BudgetDetailProvider>
      <Header>
        <Search />
        <div className="ml-auto flex items-center space-x-4">
          <ThemeSwitch />
          <ProfileDropdown />
        </div>
      </Header>
      <Main>
        <BudgetDetailPageContent />
      </Main>
    </BudgetDetailProvider>
  )
}