import { useState } from 'react'
import { Loader2, Trash2 } from 'lucide-react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Budget } from '@/stores/redux/slices/budgetSlice'

interface DeleteBudgetDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  budget: Budget | null
  onConfirm: (budget: Budget) => Promise<void>
  isLoading?: boolean
}

export function DeleteBudgetDialog({
  open,
  onOpenChange,
  budget,
  onConfirm,
  isLoading = false,
}: DeleteBudgetDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false)

  const handleConfirm = async () => {
    if (!budget) return

    try {
      setIsDeleting(true)
      await onConfirm(budget)
      onOpenChange(false)
    } catch (error) {
      // Error handling is done in the parent component
      console.error('Error deleting budget:', error)
    } finally {
      setIsDeleting(false)
    }
  }

  const handleOpenChange = (newOpen: boolean) => {
    if (!isDeleting && !isLoading) {
      onOpenChange(newOpen)
    }
  }

  if (!budget) return null

  const budgetMonth = new Date(budget.month).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
  })

  const itemsCount = budget.budget_items?.length || 0

  return (
    <AlertDialog open={open} onOpenChange={handleOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <Trash2 className="h-5 w-5 text-destructive" />
            Delete Budget
          </AlertDialogTitle>
          <AlertDialogDescription className="space-y-2">
            <p>
              Are you sure you want to delete the budget for{' '}
              <span className="font-semibold">{budgetMonth}</span>?
            </p>
            {itemsCount > 0 && (
              <p className="text-destructive font-medium">
                This budget contains {itemsCount} budget{' '}
                {itemsCount === 1 ? 'item' : 'items'} that will also be deleted.
              </p>
            )}
            <p className="text-sm text-muted-foreground">
              This action cannot be undone.
            </p>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting || isLoading}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            disabled={isDeleting || isLoading}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isDeleting || isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Deleting...
              </>
            ) : (
              <>
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Budget
              </>
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}