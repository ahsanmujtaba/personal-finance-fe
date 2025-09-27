import React, { useState } from 'react'
import useDialogState from '@/hooks/use-dialog-state'
import { type Budget } from '@/stores/redux/slices/budgetSlice'

type BudgetDialogType = 'create' | 'update' | 'delete'

type BudgetContextType = {
  open: BudgetDialogType | null
  setOpen: (str: BudgetDialogType | null) => void
  currentRow: Budget | null
  setCurrentRow: React.Dispatch<React.SetStateAction<Budget | null>>
}

const BudgetContext = React.createContext<BudgetContextType | null>(null)

export function BudgetProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useDialogState<BudgetDialogType>(null)
  const [currentRow, setCurrentRow] = useState<Budget | null>(null)

  return (
    <BudgetContext.Provider value={{ open, setOpen, currentRow, setCurrentRow }}>
      {children}
    </BudgetContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useBudgetProvider = () => {
  const budgetContext = React.useContext(BudgetContext)

  if (!budgetContext) {
    throw new Error('useBudgetProvider has to be used within <BudgetProvider>')
  }

  return budgetContext
}