import { MoreHorizontal, Edit, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { type BudgetItem } from '@/stores/redux/slices/budgetSlice'
import { type Category } from '@/stores/redux/slices/categoriesSlice'

interface BudgetItemsTableProps {
  data: BudgetItem[]
  categories: Category[]
  onEdit: (budgetItem: BudgetItem) => void
  onDelete: (budgetItem: BudgetItem) => void
}

export function BudgetItemsTable({ data, categories, onEdit, onDelete }: BudgetItemsTableProps) {
  const formatCurrency = (amount: string | undefined) => {
    const num = parseFloat(amount || '0')
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(num)
  }

  const getCategoryName = (categoryId: number) => {
    const category = categories.find(cat => cat.id === categoryId)
    return category?.name || 'Unknown Category'
  }

  const getCategoryType = (categoryId: number) => {
    const category = categories.find(cat => cat.id === categoryId)
    return category?.type || 'expense'
  }

  const getCategoryColor = (type: string) => {
    switch (type) {
      case 'income':
        return '#10B981'
      case 'expense':
        return '#EF4444'
      case 'savings':
        return '#8B5CF6'
      default:
        return '#6B7280'
    }
  }

  const getTypeVariant = (type: string) => {
    switch (type) {
      case 'income':
        return 'default'
      case 'expense':
        return 'destructive'
      case 'savings':
        return 'secondary'
      default:
        return 'outline'
    }
  }

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'on_track':
        return 'default'
      case 'over_budget':
        return 'destructive'
      case 'under_budget':
        return 'secondary'
      default:
        return 'outline'
    }
  }

  if (data.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No budget items found.</p>
        <p className="text-sm text-muted-foreground mt-1">
          Add your first budget item to get started.
        </p>
      </div>
    )
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Category</TableHead>
            <TableHead>Type</TableHead>
            <TableHead className="text-right">Planned Amount</TableHead>
            <TableHead className="text-right">Spent</TableHead>
            <TableHead className="text-right">Remaining</TableHead>
            <TableHead className="text-center">Status</TableHead>
            <TableHead>Notes</TableHead>
            <TableHead>Progress</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((item) => {
            const categoryType = getCategoryType(item.category_id)
            return (
              <TableRow key={item.id}>
                <TableCell className="font-medium">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: getCategoryColor(getCategoryType(item.category_id)) }}
                    />
                    {getCategoryName(item.category_id)}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant={getTypeVariant(categoryType)}>
                    {categoryType}
                  </Badge>
                </TableCell>
                <TableCell className="text-right font-mono">
                  ${parseFloat(item.planned_amount || '0').toFixed(2)}
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
                  
                <TableCell className="max-w-[200px] truncate">
                  {item.notes || '-'}
                </TableCell>
                <TableCell>
                  <Badge variant={getStatusVariant(item.status)}>
                    {item.status ? item.status.replace('_', ' ') : 'Unknown'}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => onEdit(item)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => onDelete(item)}
                        className="text-destructive"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </div>
  )
}