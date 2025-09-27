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
import { type BudgetItem } from '@/stores/redux/slices/budgetSlice'

interface DeleteBudgetItemDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: () => void
  budgetItem: BudgetItem | null
}

export function DeleteBudgetItemDialog({
  open,
  onOpenChange,
  onConfirm,
  budgetItem,
}: DeleteBudgetItemDialogProps) {
  if (!budgetItem) return null

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Budget Item</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete this budget item? This action cannot be undone.
            <br />
            <br />
            <strong>Budget Item:</strong> {budgetItem.category?.name || 'Unknown Category'}
            <br />
            <strong>Planned Amount:</strong> ${parseFloat(budgetItem.planned_amount || '0').toFixed(2)}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}