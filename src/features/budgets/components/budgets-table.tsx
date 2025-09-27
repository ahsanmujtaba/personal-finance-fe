import { useMemo, useState } from 'react'
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { ArrowUpDown, Calendar, Edit, Eye, MoreHorizontal, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { DataTablePagination } from '@/components/data-table'
import { Budget } from '@/stores/redux/slices/budgetSlice'
import { BudgetSkeleton } from './budget-skeleton'

interface BudgetWithActions extends Budget {
  onEdit: (budget: Budget) => void
  onDelete: (budget: Budget) => void
  onViewDetails: (budget: Budget) => void
}

interface BudgetsTableProps {
  budgets: Budget[]
  onEdit: (budget: Budget) => void
  onDelete: (budget: Budget) => void
  onViewDetails: (budget: Budget) => void
  isLoading?: boolean
}

const columns: ColumnDef<BudgetWithActions>[] = [
  {
    accessorKey: 'notes',
    header: 'Name',
    cell: ({ row }) => {
      const budget = row.original
      const notes = row.getValue('notes') as string
      return (
        <button
          onClick={() => budget.onViewDetails(budget)}
          className="text-left hover:underline cursor-pointer max-w-[200px] truncate font-medium"
        >
          {notes || (
            <span className="text-muted-foreground italic">Unnamed Budget</span>
          )}
        </button>
      )
    },
  },
  {
    accessorKey: 'month',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className="h-auto p-0 font-semibold"
        >
          Month
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const month = row.getValue('month') as string
      const date = new Date(month)
      const formattedMonth = date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
      })
      return (
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <span className="font-medium">{formattedMonth}</span>
        </div>
      )
    },
  },
  {
    id: 'budget_items_count',
    header: 'Items',
    cell: ({ row }) => {
      const budget = row.original
      const itemsCount = budget.budget_items?.length || 0
      return (
        <Badge variant="secondary">
          {itemsCount} {itemsCount === 1 ? 'item' : 'items'}
        </Badge>
      )
    },
  },
  {
    id: 'total_planned',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className="h-auto p-0 font-semibold"
        >
          Total Planned
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const budget = row.original
      const totalPlanned = budget.budget_items?.reduce(
        (sum, item) => sum + parseFloat(item.planned_amount || '0'),
        0
      ) || 0
      return (
        <div className="font-medium">
          ${totalPlanned.toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </div>
      )
    },
    sortingFn: (rowA, rowB) => {
      const totalA = rowA.original.budget_items?.reduce(
        (sum, item) => sum + parseFloat(item.planned_amount || '0'),
        0
      ) || 0
      const totalB = rowB.original.budget_items?.reduce(
        (sum, item) => sum + parseFloat(item.planned_amount || '0'),
        0
      ) || 0
      return totalA - totalB
    },
  },
  {
    accessorKey: 'created_at',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className="h-auto p-0 font-semibold"
        >
          Created
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const createdAt = row.getValue('created_at') as string
      const date = new Date(createdAt)
      return (
        <div className="text-sm text-muted-foreground">
          {date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
          })}
        </div>
      )
    },
  },
  {
    id: 'actions',
    enableHiding: false,
    cell: ({ row }) => {
      const budget = row.original

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => budget.onViewDetails(budget)}>
              <Eye className="mr-2 h-4 w-4" />
              View details
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => budget.onEdit(budget)}>
              <Edit className="mr-2 h-4 w-4" />
              Edit budget
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => budget.onDelete(budget)}
              className="text-destructive"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete budget
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]

export function BudgetsTable({ budgets, onEdit, onDelete, onViewDetails, isLoading }: BudgetsTableProps) {
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = useState({})

  const budgetsWithActions = useMemo(
    () =>
      budgets.map((budget) => ({
        ...budget,
        onEdit,
        onDelete,
        onViewDetails,
      })),
    [budgets, onEdit, onDelete, onViewDetails]
  )

  const table = useReactTable({
    data: budgetsWithActions,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  })

  if (isLoading) {
    return <BudgetSkeleton />
  }

  return (
    <div className="w-full">
      <div className="flex items-center py-4">
        <Input
          placeholder="Filter by name..."
          value={(table.getColumn('notes')?.getFilterValue() as string) ?? ''}
          onChange={(event) =>
            table.getColumn('notes')?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No budgets found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="py-4">
        <DataTablePagination table={table} />
      </div>
    </div>
  )
}