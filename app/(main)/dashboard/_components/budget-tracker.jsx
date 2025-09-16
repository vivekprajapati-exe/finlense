"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function BudgetTracker({ initialBudget = 1000, initialSpent = 350 }) {
  const [budget, setBudget] = useState(initialBudget)
  const [spent, setSpent] = useState(initialSpent)
  const [budgetInput, setBudgetInput] = useState(budget.toString())
  const [spentInput, setSpentInput] = useState(spent.toString())

  const percentage = Math.min((spent / budget) * 100, 100)
  const remaining = Math.max(budget - spent, 0)

  const radius = 70
  const circumference = 2 * Math.PI * radius
  const strokeDasharray = circumference
  const strokeDashoffset = circumference - (percentage / 100) * circumference

  const handleUpdateBudget = () => {
    const newBudget = Number.parseFloat(budgetInput) || 0
    const newSpent = Number.parseFloat(spentInput) || 0
    setBudget(newBudget)
    setSpent(newSpent)
  }

  const getProgressColor = () => {
    if (percentage >= 90) return "stroke-red-500"
    if (percentage >= 75) return "stroke-yellow-500"
    return "stroke-green-500"
  }

  return (
    <Card className="p-4 w-full h-full flex flex-col justify-center bg-gradient-to-br from-gray-900 to-gray-800 border-gray-700 shadow-xl">
      <div className="space-y-4">
        <div className="flex flex-col items-center">
          <h3 className="text-base font-semibold text-gray-200 mb-2">Monthly Budget</h3>
        </div>
        {/* Circular Progress */}
        <div className="relative flex items-center justify-center">
          <svg className="transform -rotate-90 w-36 h-36" width="144" height="144" viewBox="0 0 144 144">
            <circle
              cx="72"
              cy="72"
              r={radius + 4}
              stroke="#374151"
              strokeWidth="1"
              fill="transparent"
              className="opacity-50"
            />
            {/* Background circle */}
            <circle cx="72" cy="72" r={radius} stroke="#1f2937" strokeWidth="6" fill="transparent" />
            {/* Progress circle */}
            <circle
              cx="72"
              cy="72"
              r={radius}
              stroke="currentColor"
              strokeWidth="6"
              fill="transparent"
              strokeDasharray={strokeDasharray}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              className={`transition-all duration-1000 ease-out ${getProgressColor()}`}
            />
          </svg>

          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <div className="text-3xl font-bold text-white">{percentage.toFixed(0)}%</div>
            <div className="text-xs text-gray-300 mt-1">
              ${spent.toLocaleString()} / ${budget.toLocaleString()}
            </div>
            <div className={`text-sm font-medium mt-1 ${remaining > 0 ? "text-green-400" : "text-red-400"}`}>
              ${remaining.toLocaleString()} left
            </div>
          </div>
        </div>
        
        {/* Budget Details */}
        <div className="space-y-1 mt-4 text-center">
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-400">Monthly Limit:</span>
            <span className="text-gray-200 font-medium">${budget.toLocaleString()}</span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-400">Spent:</span>
            <span className={`font-medium ${spent > budget * 0.8 ? 'text-red-400' : 'text-gray-200'}`}>
              ${spent.toLocaleString()}
            </span>
          </div>
          <div className="h-px bg-gray-700 my-2"></div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-400">Remaining:</span>
            <span className={`font-medium ${remaining > 0 ? "text-green-400" : "text-red-400"}`}>
              ${remaining.toLocaleString()}
            </span>
          </div>
        </div>
      </div>
    </Card>
  )
}
