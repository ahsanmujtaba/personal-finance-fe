import { useEffect, useState } from 'react'
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
  FormDescription,
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
import { Switch } from '@/components/ui/switch'
import { Category } from '@/stores/redux/slices/categoriesSlice'
import { useCategories } from '@/hooks/use-categories'
import { toast } from 'sonner'
import { useCategories as useCategoriesProvider } from './categories-provider'

const categorySchema = z.object({
  name: z.string().min(1, 'Category name is required').max(100, 'Name must be less than 100 characters'),
  type: z.enum(['expense', 'income', 'savings']),
  sort_order: z.number().min(0, 'Sort order must be 0 or greater').max(999, 'Sort order must be less than 1000'),
  is_default: z.boolean(),
})

type CategoryFormData = z.infer<typeof categorySchema>

interface CategoryDialogProps {
  open: boolean
  onClose: () => void
  category?: Category | null
}

export function CategoryDialog({ open, onClose, category }: CategoryDialogProps) {
  const { addCategory, editCategory } = useCategories()
  const { currentRow } = useCategoriesProvider()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: '',
      type: 'expense' as const,
      sort_order: 0,
      is_default: false,
    },
  })

  const isEditing = !!category || !!currentRow
  const categoryToEdit = category || currentRow

  useEffect(() => {
    if (open) {
      if (categoryToEdit) {
        // Editing existing category
        form.reset({
          name: categoryToEdit.name,
          type: categoryToEdit.type,
          sort_order: categoryToEdit.sort_order,
          is_default: categoryToEdit.is_default,
        })
      } else {
        // Creating new category
        form.reset({
          name: '',
          type: 'expense',
          sort_order: 0,
          is_default: false,
        })
      }
    }
  }, [open, categoryToEdit, form])

  const onSubmit = async (data: CategoryFormData) => {
    setIsSubmitting(true)
    try {
      if (isEditing && categoryToEdit) {
        await editCategory({
          id: categoryToEdit.id,
          ...data,
        }).unwrap()
        toast.success('Category updated successfully')
      } else {
        await addCategory(data).unwrap()
        toast.success('Category created successfully')
      }
      onClose()
    } catch (error: any) {
      toast.error(error.message || `Failed to ${isEditing ? 'update' : 'create'} category`)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleClose = () => {
    form.reset()
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? 'Edit Category' : 'Create New Category'}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? 'Update the category details below.'
              : 'Add a new category to organize your transactions.'}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter category name"
                      {...field}
                      disabled={isSubmitting}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Type</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    disabled={isSubmitting}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="expense">Expense</SelectItem>
                      <SelectItem value="income">Income</SelectItem>
                      <SelectItem value="savings">Saving</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Choose whether this category is for expenses, income, or savings.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="sort_order"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Sort Order</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="0"
                      {...field}
                      onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                      disabled={isSubmitting}
                    />
                  </FormControl>
                  <FormDescription>
                    Lower numbers appear first in lists (0-999).
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="is_default"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Default Category</FormLabel>
                    <FormDescription>
                      Mark this as a default category that cannot be deleted.
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      disabled={isSubmitting}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting
                  ? isEditing
                    ? 'Updating...'
                    : 'Creating...'
                  : isEditing
                  ? 'Update Category'
                  : 'Create Category'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}