import React, { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus, Loader2, Receipt, TrendingUp, Target } from 'lucide-react'
import { BudgetItemsTable, BudgetItemSkeleton } from './'
import { type BudgetItem, type Income, type Expense } from '@/stores/redux/slices/budgetSlice'
import { type Category } from '@/stores/redux/slices/categoriesSlice'
import { IncomeTable, IncomeDialog, ExpenseTable, ExpenseDialog } from './index'
import { DeleteDialog } from '@/components/delete-dialog'

interface BudgetDetailTabsProps {
  budgetItems: BudgetItem[]
  incomes: Income[]
  expenses: Expense[]
  categories: Category[]
  isLoading: boolean
  budgetId: number
  onCreateBudgetItem: () => void
  onEditBudgetItem: (item: BudgetItem) => void
  onDeleteBudgetItem: (item: BudgetItem) => void
  onCreateIncome: (data: any) => void
  onEditIncome: (data: any) => void
  onDeleteIncome: (income: Income) => void
  onCreateExpense: (data: any) => void
  onEditExpense: (data: any) => void
  onDeleteExpense: (expense: Expense) => void
}

export function BudgetDetailTabs({
  budgetItems,
  incomes,
  expenses,
  categories,
  isLoading,
  budgetId,
  onCreateBudgetItem,
  onEditBudgetItem,
  onDeleteBudgetItem,
  onCreateIncome,
  onEditIncome,
  onDeleteIncome,
  onCreateExpense,
  onEditExpense,
  onDeleteExpense,
}: BudgetDetailTabsProps) {
  const [incomeDialogOpen, setIncomeDialogOpen] = useState(false)
  const [expenseDialogOpen, setExpenseDialogOpen] = useState(false)
  const [editingIncome, setEditingIncome] = useState<Income | null>(null)
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null)
  const [activeTab, setActiveTab] = useState('budget-items')
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<{ type: 'expense' | 'income' | 'budget-item', item: any } | null>(null)

  const handleCreateIncome = () => {
    setEditingIncome(null)
    setIncomeDialogOpen(true)
  }

  const handleEditIncome = (income: Income) => {
    setEditingIncome(income)
    setIncomeDialogOpen(true)
  }

  const handleIncomeSubmit = (data: any) => {
    if (editingIncome) {
      onEditIncome({ ...data, id: editingIncome.id, budget_id: editingIncome.budget_id })
    } else {
      onCreateIncome(data)
    }
    setIncomeDialogOpen(false)
    setEditingIncome(null)
  }

  const handleCreateExpense = () => {
    setEditingExpense(null)
    setExpenseDialogOpen(true)
  }

  const handleEditExpense = (expense: Expense) => {
    setEditingExpense(expense)
    setExpenseDialogOpen(true)
  }

  const handleExpenseSubmit = (data: any) => {
    if (editingExpense) {
      onEditExpense({ ...data, id: editingExpense.id })
    } else {
      onCreateExpense(data)
    }
    setExpenseDialogOpen(false)
    setEditingExpense(null)
  }

  const handleDeleteClick = (type: 'expense' | 'income' | 'budget-item', item: any) => {
    setDeleteTarget({ type, item })
    setDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = () => {
    if (!deleteTarget) return
    
    switch (deleteTarget.type) {
      case 'expense':
        onDeleteExpense(deleteTarget.item)
        break
      case 'income':
        onDeleteIncome(deleteTarget.item)
        break
      case 'budget-item':
        onDeleteBudgetItem(deleteTarget.item)
        break
    }
    
    setDeleteDialogOpen(false)
    setDeleteTarget(null)
  }

  const getDeleteDialogContent = () => {
    if (!deleteTarget) return { title: '', description: '', itemName: '' }
    
    switch (deleteTarget.type) {
      case 'expense':
        return {
          title: 'Delete Expense',
          description: 'Are you sure you want to delete this expense? This action cannot be undone.',
          itemName: `${deleteTarget.item.merchant || 'Expense'} - $${parseFloat(deleteTarget.item.amount || '0').toFixed(2)}`
        }
      case 'income':
        return {
          title: 'Delete Income',
          description: 'Are you sure you want to delete this income record? This action cannot be undone.',
          itemName: `${deleteTarget.item.source} - $${parseFloat(deleteTarget.item.amount || '0').toFixed(2)}`
        }
      case 'budget-item':
        return {
          title: 'Delete Budget Item',
          description: 'Are you sure you want to delete this budget item? This action cannot be undone.',
          itemName: deleteTarget.item.category?.name || `Budget Item ${deleteTarget.item.id}`
        }
      default:
        return { title: '', description: '', itemName: '' }
    }
  }

  return (
    <>
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="grid w-full grid-cols-3 h-12">
        <TabsTrigger value="expenses" className="flex items-center gap-2">
          <Receipt className="h-4 w-4" />
          <span className="hidden sm:inline">Expenses</span>
        </TabsTrigger>
        <TabsTrigger value="income" className="flex items-center gap-2">
          <TrendingUp className="h-4 w-4" />
          <span className="hidden sm:inline">Income</span>
        </TabsTrigger>
        <TabsTrigger value="budget-items" className="flex items-center gap-2">
          <Target className="h-4 w-4" />
          <span className="hidden sm:inline">Budget Items</span>
        </TabsTrigger>
      </TabsList>

      <TabsContent value="expenses" className="space-y-6">
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-red-100 text-red-600 rounded-full">
                  <Receipt className="h-4 w-4" />
                </div>
                <div>
                  <CardTitle className="text-lg">Expenses</CardTitle>
                  <CardDescription className="text-sm">
                    Track actual spending
                  </CardDescription>
                </div>
              </div>
              <Button onClick={handleCreateExpense} size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add
              </Button>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-6 w-6 animate-spin" />
              </div>
            ) : (
              <ExpenseTable
                data={expenses}
                onEdit={handleEditExpense}
                onDelete={(expense) => handleDeleteClick('expense', expense)}
              />
            )}
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="income" className="space-y-6">
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 text-green-600 rounded-full">
                  <TrendingUp className="h-4 w-4" />
                </div>
                <div>
                  <CardTitle className="text-lg">Income</CardTitle>
                  <CardDescription className="text-sm">
                    Track earnings
                  </CardDescription>
                </div>
              </div>
              <Button onClick={handleCreateIncome} size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add
              </Button>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-6 w-6 animate-spin" />
              </div>
            ) : (
              <IncomeTable
                data={incomes}
                onEdit={handleEditIncome}
                onDelete={(income) => handleDeleteClick('income', income)}
              />
            )}
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="budget-items" className="space-y-6">
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 text-blue-600 rounded-full">
                  <Target className="h-4 w-4" />
                </div>
                <div>
                  <CardTitle className="text-lg">Budget Items</CardTitle>
                  <CardDescription className="text-sm">
                    Manage budget categories
                  </CardDescription>
                </div>
              </div>
              <Button onClick={onCreateBudgetItem} size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add
              </Button>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            {isLoading ? (
              <BudgetItemSkeleton />
            ) : (
              <BudgetItemsTable
                data={budgetItems}
                categories={categories}
                onEdit={onEditBudgetItem}
                onDelete={(item) => handleDeleteClick('budget-item', item)}
              />
            )}
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>

    <IncomeDialog
        open={incomeDialogOpen}
        onOpenChange={setIncomeDialogOpen}
        onSubmit={handleIncomeSubmit}
        income={editingIncome}
        title={editingIncome ? 'Edit Income' : 'Add Income'}
        description={editingIncome ? 'Update the income record details.' : 'Add a new income record to your budget.'}
      />

      <ExpenseDialog
        open={expenseDialogOpen}
        onOpenChange={setExpenseDialogOpen}
        onSubmit={handleExpenseSubmit}
        expense={editingExpense}
        budgetItems={budgetItems}
        budgetId={budgetId}
        title={editingExpense ? 'Edit Expense' : 'Add Expense'}
        description={editingExpense ? 'Update the expense record details.' : 'Add a new expense record to your budget.'}
      />

      <DeleteDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleDeleteConfirm}
        {...getDeleteDialogContent()}
      />
    </>
  )
}