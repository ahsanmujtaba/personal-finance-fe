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
import { type Income } from '@/stores/redux/slices/budgetSlice'
import { DatePicker } from '@/components/date-picker'

const incomeSchema = z.object({
  source: z.string().min(1, 'Source is required'),
  amount: z.number().min(0.01, 'Amount must be greater than 0'),
  note: z.string().optional(),
  date: z.date(),
})

type IncomeFormData = z.infer<typeof incomeSchema>

interface IncomeDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: IncomeFormData) => void
  income?: Income | null
  title: string
  description: string
}

export function IncomeDialog({
  open,
  onOpenChange,
  onSubmit,
  income,
  title,
  description,
}: IncomeDialogProps) {
  const form = useForm<IncomeFormData>({
    resolver: zodResolver(incomeSchema),
    defaultValues: {
      source: '',
      amount: 0,
      note: '',
      date: new Date(),
    },
  })

  useEffect(() => {
    if (income) {
      form.reset({
        source: income.source || '',
        amount: parseFloat(income.amount || '0'),
        note: income.note || '',
        date: income.date ? new Date(income.date) : new Date(),
      })
    } else {
      form.reset({
        source: '',
        amount: 0,
        note: '',
        date: new Date(),
      })
    }
  }, [income, form])

  const handleSubmit = (data: IncomeFormData) => {
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
              name="source"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Source</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g., Salary, Freelance work, etc."
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
                      placeholder="Additional notes about this income"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
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
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {income ? 'Update' : 'Create'} Income
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}