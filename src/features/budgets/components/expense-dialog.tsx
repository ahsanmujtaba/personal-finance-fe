import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { type Expense, type BudgetItem } from '@/stores/redux/slices/budgetSlice'
import { useCategories } from '@/hooks/use-categories'
import { DatePicker } from '@/components/date-picker'

const expenseSchema = z.object({
  budget_id: z.number().min(1, 'Budget ID is required'),
  budget_item_id: z.number().min(1, 'Budget item is required'),
  category_id: z.number().min(1, 'Category is required'),
  amount: z.number().min(0.01, 'Amount must be greater than 0'),
  date: z.date(),
  merchant: z.string().optional(),
  note: z.string().optional(),
})

type ExpenseFormData = z.infer<typeof expenseSchema>

interface ExpenseDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: ExpenseFormData) => void
  expense?: Expense | null
  budgetItems: BudgetItem[]
  budgetId: number
  title: string
  description: string
}

export function ExpenseDialog({
  open,
  onOpenChange,
  onSubmit,
  expense,
  budgetItems,
  budgetId,
  title,
  description,
}: ExpenseDialogProps) {
  const { categories, loadCategories } = useCategories()
  const form = useForm<ExpenseFormData>({
    resolver: zodResolver(expenseSchema),
    defaultValues: {
      budget_id: budgetId,
      budget_item_id: 0,
      category_id: 0,
      amount: 0,
      merchant: '',
      note: '',
      date: new Date(),
    },
  })

  useEffect(() => {
    loadCategories()
  }, [loadCategories])

  useEffect(() => {
    if (expense) {
      form.reset({
        budget_id: budgetId,
        budget_item_id: expense.budget_item_id || 0,
        category_id: expense.category_id || 0,
        amount: parseFloat(expense.amount?.toString() || '0'),
        merchant: expense.merchant || '',
        note: expense.note || '',
        date: expense.date ? new Date(expense.date) : new Date(),
      })
    } else {
      form.reset({
        budget_id: budgetId,
        budget_item_id: 0,
        category_id: 0,
        amount: 0,
        merchant: '',
        note: '',
        date: new Date(),
      })
    }
  }, [expense, form, budgetId])

  const handleSubmit = (data: ExpenseFormData) => {
    // Convert date to ISO string format for API submission
    const formattedData = {
      ...data,
      date: data.date.toISOString().split('T')[0],
    } as any
    onSubmit(formattedData)
    form.reset()
  }



  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Amount</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
                        $
                      </span>
                      <Input
                        type="number"
                        step="0.01"
                        min="0"
                        placeholder="0.00"
                        className="pl-8"
                        {...field}
                        onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Date</FormLabel>
                  <FormControl>
                    <DatePicker
                      selected={field.value}
                      onSelect={(date: Date | undefined) => {
                        field.onChange(date || new Date())
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="budget_item_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Budget Item</FormLabel>
                  <Select
                    onValueChange={(value) => field.onChange(parseInt(value))}
                    value={field.value?.toString()}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a budget item" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                        {budgetItems.map((item) => (
                          <SelectItem key={item.id} value={item.id.toString()}>
                            {item.category?.name || `Budget Item ${item.id}`}
                          </SelectItem>
                        ))}
                      </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="category_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select
                    onValueChange={(value) => field.onChange(parseInt(value))}
                    value={field.value?.toString()}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id.toString()}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="merchant"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Merchant (Optional)</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Merchant name"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="note"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Note (Optional)</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Additional details about the expense"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {expense ? 'Update' : 'Create'} Expense
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}