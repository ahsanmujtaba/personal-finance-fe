import { useEffect, useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { CalendarIcon, Loader2 } from 'lucide-react'
import { format } from 'date-fns'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Textarea } from '@/components/ui/textarea'
import { Budget } from '@/stores/redux/slices/budgetSlice'

const budgetFormSchema = z.object({
  month: z.date().refine((date) => date !== undefined, {
    message: 'Please select a month for the budget.',
  }),
  notes: z.string().optional(),
})

type BudgetFormValues = z.infer<typeof budgetFormSchema>

interface BudgetDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  budget?: Budget | null
  onSubmit: (data: BudgetFormValues) => Promise<void>
  isLoading?: boolean
}

export function BudgetDialog({
  open,
  onOpenChange,
  budget,
  onSubmit,
  isLoading = false,
}: BudgetDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const isEditing = !!budget

  const form = useForm<BudgetFormValues>({
    resolver: zodResolver(budgetFormSchema),
    defaultValues: {
      month: undefined,
      notes: '',
    },
  })

  // Reset form when dialog opens/closes or budget changes
  useEffect(() => {
    if (open) {
      if (budget) {
        // Editing existing budget
        form.reset({
          month: new Date(budget.month),
          notes: budget.notes || '',
        })
      } else {
        // Creating new budget
        form.reset({
          month: undefined,
          notes: '',
        })
      }
    }
  }, [open, budget, form])

  const handleSubmit = async (data: BudgetFormValues) => {
    try {
      setIsSubmitting(true)
      await onSubmit(data)
      onOpenChange(false)
      form.reset()
    } catch (error) {
      // Error handling is done in the parent component
      console.error('Error submitting budget:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleOpenChange = (newOpen: boolean) => {
    if (!isSubmitting && !isLoading) {
      onOpenChange(newOpen)
      if (!newOpen) {
        form.reset()
      }
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? 'Edit Budget' : 'Create New Budget'}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? 'Update the budget details below.'
              : 'Create a new budget for a specific month. You can add budget items after creating the budget.'}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="month"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Month</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          className={cn(
                            'w-full pl-3 text-left font-normal',
                            !field.value && 'text-muted-foreground'
                          )}
                        >
                          {field.value ? (
                            format(field.value, 'MMMM yyyy')
                          ) : (
                            <span>Pick a month</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) =>
                          date > new Date() || date < new Date('1900-01-01')
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormDescription>
                    Select the month for this budget.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Add any notes or description for this budget..."
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Optional notes about this budget.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => handleOpenChange(false)}
                disabled={isSubmitting || isLoading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting || isLoading}
              >
                {isSubmitting || isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {isEditing ? 'Updating...' : 'Creating...'}
                  </>
                ) : (
                  <>{isEditing ? 'Update Budget' : 'Create Budget'}</>
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}