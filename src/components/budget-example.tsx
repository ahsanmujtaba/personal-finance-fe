import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
// Local interface for the example component
interface ExampleBudgetItem {
  id: number
  category: string
  amount: number
  description: string
  date: string
  type: 'income' | 'expense'
}

export function BudgetExample() {
  const [items, setItems] = useState<ExampleBudgetItem[]>([])
  
  // Calculate totals from local state
  const totalIncome = items.filter(item => item.type === 'income').reduce((sum, item) => sum + item.amount, 0)
  const totalExpenses = items.filter(item => item.type === 'expense').reduce((sum, item) => sum + item.amount, 0)
  const balance = totalIncome - totalExpenses
  
  const [formData, setFormData] = useState({
    category: '',
    amount: '',
    description: '',
    type: 'expense' as 'income' | 'expense'
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.category || !formData.amount) return

    const newItem: ExampleBudgetItem = {
      id: Date.now(),
      category: formData.category,
      amount: parseFloat(formData.amount),
      description: formData.description,
      date: new Date().toISOString().split('T')[0],
      type: formData.type
    }

    setItems(prev => [...prev, newItem])
    setFormData({ category: '', amount: '', description: '', type: 'expense' })
  }

  const handleRemove = (id: number) => {
    setItems(prev => prev.filter(item => item.id !== id))
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Budget Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Total Income</p>
              <p className="text-2xl font-bold text-green-600">${totalIncome.toFixed(2)}</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Total Expenses</p>
              <p className="text-2xl font-bold text-red-600">${totalExpenses.toFixed(2)}</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Balance</p>
              <p className={`text-2xl font-bold ${balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                ${balance.toFixed(2)}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Add Budget Item</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Input
                  placeholder="Category"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                />
              </div>
              <div>
                <Input
                  type="number"
                  step="0.01"
                  placeholder="Amount"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                />
              </div>
            </div>
            <div>
              <Input
                placeholder="Description (optional)"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>
            <div>
              <Select
                value={formData.type}
                onValueChange={(value: 'income' | 'expense') => setFormData({ ...formData, type: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="income">Income</SelectItem>
                  <SelectItem value="expense">Expense</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button type="submit" className="w-full">
              Add Item
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Budget Items ({items.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {items.length === 0 ? (
              <p className="text-muted-foreground text-center py-4">No budget items yet. Add one above!</p>
            ) : (
              items.map((item: ExampleBudgetItem) => (
                <div key={item.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{item.category}</span>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        item.type === 'income' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {item.type}
                      </span>
                    </div>
                    {item.description && (
                      <p className="text-sm text-muted-foreground">{item.description}</p>
                    )}
                    <p className="text-xs text-muted-foreground">{item.date}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`font-bold ${
                      item.type === 'income' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {item.type === 'income' ? '+' : '-'}${item.amount.toFixed(2)}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleRemove(item.id)}
                    >
                      Remove
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}