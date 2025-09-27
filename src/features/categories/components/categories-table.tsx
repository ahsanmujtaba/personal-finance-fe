import { ArrowUpDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Category } from '@/stores/redux/slices/categoriesSlice'
import { useState, useMemo } from 'react'
import { CategoriesTableActions } from './categories-table-actions.tsx'
import {
  type SortingState,
  type VisibilityState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  createColumnHelper,
} from '@tanstack/react-table'
import { DataTablePagination } from '@/components/data-table'

type CategoryWithActions = Category & {
  onEdit: () => void
  onDelete: () => void
}

const columnHelper = createColumnHelper<CategoryWithActions>()

const columns = [
  columnHelper.accessor('name', {
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        className="h-auto p-0 font-semibold hover:bg-transparent"
      >
        Name
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => (
      <div className="font-medium">{row.getValue('name')}</div>
    ),
  }),
  columnHelper.accessor('type', {
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        className="h-auto p-0 font-semibold hover:bg-transparent"
      >
        Type
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const type = row.getValue('type') as string
      return (
        <Badge 
          variant={type === 'expense' ? 'destructive' : type === 'savings' ? 'secondary' : 'default'}
          className={type === 'income' ? 'bg-green-100 text-green-800 hover:bg-green-200' : type === 'savings' ? 'bg-blue-100 text-blue-800 hover:bg-blue-200' : ''}
        >
          {type}
        </Badge>
      )
    },
  }),
  columnHelper.accessor('is_default', {
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        className="h-auto p-0 font-semibold hover:bg-transparent"
      >
        Default
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const isDefault = row.getValue('is_default') as boolean
      return (
        <div>
          {isDefault && (
            <Badge variant="outline">Default</Badge>
          )}
        </div>
      )
    },
  }),
  columnHelper.display({
    id: 'actions',
    header: () => 'Actions',
    cell: ({ row }) => (
      <CategoriesTableActions
        category={row.original}
        onEdit={row.original.onEdit}
        onDelete={row.original.onDelete}
      />
    ),
  }),
]

interface CategoriesTableProps {
  categories: Category[]
  onEdit: (category: Category) => void
  onDelete: (category: Category) => void
}

export function CategoriesTable({ categories, onEdit, onDelete }: CategoriesTableProps) {
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = useState({})

  // Add onEdit and onDelete to each category for the actions column
  const categoriesWithActions: CategoryWithActions[] = useMemo(() => 
    categories.map(category => ({
      ...category,
      onEdit: () => onEdit(category),
      onDelete: () => onDelete(category),
    })), [categories, onEdit, onDelete]
  )

  const table = useReactTable({
    data: categoriesWithActions,
    columns,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
    },
    enableRowSelection: false,
    onSortingChange: setSorting,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
  })

  return (
    <div className="space-y-4">
      <div className="overflow-hidden rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id} colSpan={header.colSpan}>
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
                  <div className="text-center">
                    <h3 className="text-lg font-semibold">No categories found</h3>
                    <p className="text-muted-foreground mt-2">
                      Create your first category to get started.
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <DataTablePagination table={table} />
    </div>
  )
}