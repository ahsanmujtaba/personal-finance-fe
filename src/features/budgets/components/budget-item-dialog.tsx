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
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { type BudgetItem } from '@/stores/redux/slices/budgetSlice'
import { type Category } from '@/stores/redux/slices/categoriesSlice'

const budgetItemSchema = z.object({
  category_id: z.number().min(1, 'Please select a category'),
  planned_amount: z.number().min(0.01, 'Amount must be greater than 0'),
  notes: z.string().optional(),
})

type BudgetItemFormData = z.infer<typeof budgetItemSchema>

interface BudgetItemDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: BudgetItemFormData) => void
  categories: Category[]
  budgetItem?: BudgetItem | null
  title: string
  description: string
}

export function BudgetItemDialog({
  open,
  onOpenChange,
  onSubmit,
  categories,
  budgetItem,
  title,
  description,
}: BudgetItemDialogProps) {
  const form = useForm<BudgetItemFormData>({
    resolver: zodResolver(budgetItemSchema),
    defaultValues: {
      category_id: 0,
      planned_amount: 0,
      notes: '',
    },
  })

  useEffect(() => {
    if (budgetItem) {
      form.reset({
        category_id: budgetItem.category_id,
        planned_amount: parseFloat(budgetItem.planned_amount || '0'),
        notes: budgetItem.notes || '',
      })
    } else {
      form.reset({
        category_id: 0,
        planned_amount: 0,
        notes: '',
      })
    }
  }, [budgetItem, form])

  const handleSubmit = (data: BudgetItemFormData) => {
    onSubmit(data)
    form.reset()
  }

  const getCategoryTypeVariant = (type: string) => {
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
              name="category_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select
                    onValueChange={(value) => field.onChange(parseInt(value))}
                    value={field.value ? field.value.toString() : ''}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id.toString()}>
                          <div className="flex items-center gap-2">
                            <Badge variant={getCategoryTypeVariant(category.type)}>
                              {category.type}
                            </Badge>
                            {category.name}
                          </div>
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
              name="planned_amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Planned Amount</FormLabel>
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
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes (Optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Add any notes about this budget item..."
                      className="resize-none"
                      rows={3}
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
                {budgetItem ? 'Update' : 'Create'} Budget Item
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}