"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { DollarSign, TrendingUp, TrendingDown, AlertCircle, Edit2, Check, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"
import { updateBudget } from "@/actions/budget"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose
} from "@/components/ui/dialog"

export function BudgetTracker({ initialBudget = 1000, currentExpenses = 350 }) {
  // Handle proper data types and defaults
  const parsedBudget = typeof initialBudget?.amount === 'number' ? initialBudget.amount : 
                      typeof initialBudget === 'number' ? initialBudget : 1000
  const parsedExpenses = typeof currentExpenses === 'number' ? currentExpenses : 350
  
  const [budget, setBudget] = useState(parsedBudget)
  const [spent, setSpent] = useState(parsedExpenses)
  const [isEditing, setIsEditing] = useState(false)
  const [newBudgetAmount, setNewBudgetAmount] = useState(parsedBudget)
  const [isUpdating, setIsUpdating] = useState(false)

  // Update state when props change
  useEffect(() => {
    setBudget(parsedBudget)
    setSpent(parsedExpenses)
    setNewBudgetAmount(parsedBudget)
  }, [parsedBudget, parsedExpenses])
  
  // Calculate budget metrics
  const percentage = budget > 0 ? Math.min((spent / budget) * 100, 100) : 0
  const remaining = Math.max(budget - spent, 0)
  const isOverBudget = spent > budget
  
  // Helper function to get status info based on percentage
  const getBudgetStatus = () => {
    if (percentage >= 90) {
      return {
        label: "Critical",
        color: "text-red-500",
        bgColor: "bg-red-500",
        icon: AlertCircle,
        message: "Budget almost depleted"
      }
    } else if (percentage >= 75) {
      return {
        label: "Warning",
        color: "text-yellow-500",
        bgColor: "bg-yellow-500",
        icon: TrendingUp,
        message: "Spending faster than usual"
      }
    } else {
      return {
        label: "Good",
        color: "text-emerald-500",
        bgColor: "bg-emerald-500",
        icon: TrendingDown,
        message: "On track with budget"
      }
    }
  }
  
  const status = getBudgetStatus()

  return (
    <Card className="w-full h-full shadow-sm border border-border/50 hover:border-border/80 transition-all">
      <div className="p-4 space-y-3">
        {/* Header with clean design */}
        <div className="flex items-center justify-between">
          <h3 className="text-base font-medium">Budget Overview</h3>
          {!isEditing && (
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-6 w-6 opacity-60 hover:opacity-100" 
              onClick={() => setIsEditing(true)}
            >
              <Edit2 className="h-3.5 w-3.5" />
            </Button>
          )}
        </div>
        
        {/* Progress Bar */}
        <Progress 
          value={percentage} 
          className={`h-2.5 ${
            percentage >= 90 ? "bg-red-100 dark:bg-red-900/30" : 
            percentage >= 75 ? "bg-yellow-100 dark:bg-yellow-900/30" : 
            "bg-emerald-100 dark:bg-emerald-900/30"
          }`}
        />
        
        {/* Budget Status */}
        <div className="flex justify-between items-center text-sm pt-0.5">
          <div className={`text-xs ${status.color}`}>
            <status.icon className="w-3 h-3 inline mr-1" />
            {percentage.toFixed(0)}% Used
          </div>
          <Badge variant={percentage >= 90 ? "destructive" : percentage >= 75 ? "warning" : "outline"} className="text-xs">
            {status.label}
          </Badge>
        </div>
        
        {/* Simple Budget Numbers */}
        <div className="flex justify-between items-center pt-1">
          {isEditing ? (
            <div className="flex items-center gap-1">
              <DollarSign className="w-4 h-4 text-muted-foreground" />
              <Input
                type="number"
                min="0"
                step="100"
                value={newBudgetAmount}
                onChange={(e) => setNewBudgetAmount(Number(e.target.value))}
                className="h-8 w-28 text-sm"
              />
              <div className="flex items-center gap-1 ml-1">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-7 w-7 bg-red-100 dark:bg-red-900/20 text-red-600"
                  onClick={() => {
                    setIsEditing(false);
                    setNewBudgetAmount(budget);
                  }}
                >
                  <X className="h-3.5 w-3.5" />
                </Button>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-7 w-7 bg-green-100 dark:bg-green-900/20 text-green-600"
                      disabled={isUpdating}
                    >
                      <Check className="h-3.5 w-3.5" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Update Budget</DialogTitle>
                      <DialogDescription>
                        Set monthly budget to ${Number(newBudgetAmount).toLocaleString()}?
                      </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="mt-4 space-x-2">
                      <DialogClose asChild>
                        <Button variant="outline">Cancel</Button>
                      </DialogClose>
                      <Button 
                        onClick={async () => {
                          if (newBudgetAmount < 0) {
                            toast.error("Budget amount cannot be negative");
                            return;
                          }
                          setIsUpdating(true);
                          try {
                            const result = await updateBudget(Number(newBudgetAmount));
                            if (result.success) {
                              setBudget(Number(newBudgetAmount));
                              setIsEditing(false);
                              toast.success("Budget updated successfully");
                            } else {
                              toast.error(result.error || "Failed to update budget");
                            }
                          } catch (error) {
                            toast.error("An error occurred while updating budget");
                            console.error(error);
                          } finally {
                            setIsUpdating(false);
                          }
                        }}
                        disabled={isUpdating}
                      >
                        {isUpdating ? "Updating..." : "Save"}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          ) : (
            <div className="flex flex-col">
              <span className="text-xs text-muted-foreground">Budget</span>
              <span className="text-base font-medium">${budget.toLocaleString()}</span>
            </div>
          )}
          
          <div className="flex flex-col text-right">
            <span className="text-xs text-muted-foreground">Remaining</span>
            <span className={`text-base font-medium ${isOverBudget ? 'text-red-500' : 'text-emerald-500'}`}>
              ${remaining.toLocaleString()}
            </span>
          </div>
        </div>
      </div>
    </Card>
  )
}
