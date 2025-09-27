import { useEffect, useState } from 'react'
import { Plus, Filter, Search, Tag, TrendingUp, TrendingDown, PiggyBank, Grid3X3 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useCategories } from '@/hooks/use-categories'
import { CategoriesTable } from './components/categories-table'
import { CategoryDialog } from './components/category-dialog'
import { CategorySkeleton } from './components/category-skeleton'
import { StatsGridSkeleton } from './components/stats-skeleton'
import { CategoriesProvider, useCategories as useCategoriesProvider } from './components/categories-provider'
import { Category } from '@/stores/redux/slices/categoriesSlice'
import { toast } from 'sonner'
import { Header } from '@/components/layout/header'
import { ThemeSwitch } from '@/components/theme-switch'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Main } from '@/components/layout/main'
import { Search as MainSearch } from '@/components/search'

function CategoriesPageContent() {
  const {
    categories,
    isLoading,
    error,
    filters,
    expenseCategories,
    incomeCategories,
    savingCategories,
    loadCategories,
    updateFilters,
    clearCategoriesError,
  } = useCategories()

  const { open, setOpen, currentRow, setCurrentRow } = useCategoriesProvider()

  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    loadCategories(filters.type)
  }, [loadCategories, filters.type])

  useEffect(() => {
    if (error) {
      toast.error(error)
      clearCategoriesError()
    }
  }, [error, clearCategoriesError])

  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleCreateCategory = () => {
    setCurrentRow(null)
    setOpen('create')
  }

  const handleEditCategory = (category: Category) => {
    setCurrentRow(category)
    setOpen('update')
  }

  const handleDeleteCategory = (category: Category) => {
    setCurrentRow(category)
    setOpen('delete')
  }

  const handleFilterChange = (type: string) => {
    if (type === 'all') {
      updateFilters({})
    } else {
      updateFilters({ type: type as 'expense' | 'income' | 'savings' })
    }
  }

  return (
    <div className="space-y-8">
      {/* Minimalist Header */}
      <div className="flex items-center gap-3">
        <div className="p-2 bg-purple-100 text-purple-600 rounded-full">
          <Tag className="h-5 w-5" />
        </div>
        <div>
          <h1 className="text-2xl font-semibold">Categories</h1>
          <p className="text-sm text-muted-foreground">
            Organize budget categories
          </p>
        </div>
        <div className="ml-auto">
          <Button onClick={handleCreateCategory} size="sm">
            <Plus className="h-4 w-4 mr-2" />
            New Category
          </Button>
        </div>
      </div>

      {/* Clean Stats Cards */}
      {isLoading ? (
        <StatsGridSkeleton />
      ) : (
        <div className="grid gap-4 md:grid-cols-3">
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-red-100 text-red-600 rounded-full">
                  <TrendingDown className="h-4 w-4" />
                </div>
                <div>
                  <CardTitle className="text-sm font-medium">Expenses</CardTitle>
                  <div className="text-2xl font-bold">{expenseCategories.length}</div>
                </div>
              </div>
            </CardHeader>
          </Card>
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 text-green-600 rounded-full">
                  <TrendingUp className="h-4 w-4" />
                </div>
                <div>
                  <CardTitle className="text-sm font-medium">Income</CardTitle>
                  <div className="text-2xl font-bold">{incomeCategories.length}</div>
                </div>
              </div>
            </CardHeader>
          </Card>
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 text-blue-600 rounded-full">
                  <PiggyBank className="h-4 w-4" />
                </div>
                <div>
                  <CardTitle className="text-sm font-medium">Savings</CardTitle>
                  <div className="text-2xl font-bold">{savingCategories.length}</div>
                </div>
              </div>
            </CardHeader>
          </Card>
        </div>
      )}

      {/* Clean Table Card */}
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 text-orange-600 rounded-full">
                <Grid3X3 className="h-4 w-4" />
              </div>
              <div>
                <CardTitle className="text-lg">All Categories</CardTitle>
                <p className="text-sm text-muted-foreground">
                  {filteredCategories.length} categor{filteredCategories.length !== 1 ? 'ies' : 'y'} total
                </p>
              </div>
            </div>
            
            {/* Compact Filters */}
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                   placeholder="Search..."
                   value={searchTerm}
                   onChange={(e) => setSearchTerm(e.target.value)}
                   className="pl-9 w-48 h-9"
                 />
              </div>
              <Select value={filters.type || 'all'} onValueChange={handleFilterChange}>
                <SelectTrigger className="w-32">
                  <Filter className="mr-2 h-4 w-4" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="expense">Expense</SelectItem>
                  <SelectItem value="income">Income</SelectItem>
                  <SelectItem value="savings">Savings</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          {isLoading ? (
            <CategorySkeleton />
          ) : (
            <CategoriesTable
              categories={filteredCategories}
              onEdit={handleEditCategory}
              onDelete={handleDeleteCategory}
            />
          )}
        </CardContent>
      </Card>

      {/* Category Dialog */}
      <CategoryDialog
        open={open !== null}
        onClose={() => setOpen(null)}
        category={currentRow}
      />
    </div>
  )
}

export default function CategoriesPage() {
  return (
    <CategoriesProvider>
      <Header fixed>
        <MainSearch />
        <div className='ms-auto flex items-center space-x-4'>
          <ThemeSwitch />
  
          <ProfileDropdown />
        </div>
      </Header>

      <Main>
        <CategoriesPageContent />
      </Main>
      
    </CategoriesProvider>
  )
}