import React, { useState } from 'react'
import useDialogState from '@/hooks/use-dialog-state'
import { type BudgetItem } from '@/stores/redux/slices/budgetSlice'

type BudgetItemDialogType = 'create' | 'update' | 'delete'

type BudgetDetailContextType = {
  open: BudgetItemDialogType | null
  setOpen: (str: BudgetItemDialogType | null) => void
  currentRow: BudgetItem | null
  setCurrentRow: React.Dispatch<React.SetStateAction<BudgetItem | null>>
}

const BudgetDetailContext = React.createContext<BudgetDetailContextType | null>(null)

export function BudgetDetailProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useDialogState<BudgetItemDialogType>(null)
  const [currentRow, setCurrentRow] = useState<BudgetItem | null>(null)

  return (
    <BudgetDetailContext.Provider value={{ open, setOpen, currentRow, setCurrentRow }}>
      {children}
    </BudgetDetailContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useBudgetDetailProvider = () => {
  const budgetDetailContext = React.useContext(BudgetDetailContext)

  if (!budgetDetailContext) {
    throw new Error('useBudgetDetailProvider has to be used within <BudgetDetailProvider>')
  }

  return budgetDetailContext
}