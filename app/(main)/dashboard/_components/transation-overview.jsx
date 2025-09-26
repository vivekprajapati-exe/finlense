"use client";

import { useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { format } from "date-fns";
import { ArrowUpRight, ArrowDownRight, TrendingUp, TrendingDown } from "lucide-react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';

// Define chart configuration with rich colors
const chartConfig = {
  Food: { label: "Food", color: "var(--chart-1)" },
  Shopping: { label: "Shopping", color: "var(--chart-2)" },
  Housing: { label: "Housing", color: "var(--chart-3)" },
  Transportation: { label: "Transportation", color: "var(--chart-4)" },
  Entertainment: { label: "Entertainment", color: "var(--chart-5)" },
  Healthcare: { label: "Healthcare", color: "var(--chart-6)" },
  Education: { label: "Education", color: "var(--chart-7)" },
  Personal: { label: "Personal", color: "var(--chart-8)" },
  Travel: { label: "Travel", color: "var(--chart-9)" },
  Other: { label: "Other", color: "var(--chart-10)" }
};

export function DashboardOverview({ accounts, transactions }) {
  const [selectedAccountId, setSelectedAccountId] = useState(
    accounts.find((a) => a.isDefault)?.id || accounts[0]?.id
  );

  // Filter transactions for selected account
  const accountTransactions = transactions.filter(
    (t) => t.accountId === selectedAccountId
  );

  // Get recent transactions (last 5)
  const recentTransactions = accountTransactions
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5);

  // Calculate expense breakdown for current month
  const currentDate = new Date();
  const currentMonthExpenses = accountTransactions.filter((t) => {
    const transactionDate = new Date(t.date);
    return (
      t.type === "EXPENSE" &&
      transactionDate.getMonth() === currentDate.getMonth() &&
      transactionDate.getFullYear() === currentDate.getFullYear()
    );
  });

  // Group expenses by category
  const expensesByCategory = currentMonthExpenses.reduce((acc, transaction) => {
    const category = transaction.category;
    if (!acc[category]) {
      acc[category] = 0;
    }
    acc[category] += transaction.amount;
    return acc;
  }, {});

  // Format data for pie chart
  const pieChartData = Object.entries(expensesByCategory).map(
    ([category, amount]) => ({
      name: category,
      value: amount,
    })
  );

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {/* Recent Transactions Card - Styled to match the enhanced design */}
      <Card className="flex flex-col">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div>
            <CardTitle className="text-base font-normal">
              Recent Transactions
            </CardTitle>
            <CardDescription>
              Last {recentTransactions.length} transactions
            </CardDescription>
          </div>
          <Select
            value={selectedAccountId}
            onValueChange={setSelectedAccountId}
          >
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Select account" />
            </SelectTrigger>
            <SelectContent>
              {accounts.map((account) => (
                <SelectItem key={account.id} value={account.id}>
                  {account.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardHeader>
        <CardContent className="flex-1">
          <div className="space-y-3">
            {recentTransactions.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-[250px] text-center text-muted-foreground">
                <div className="rounded-full bg-background p-3 border border-border mb-3">
                  <ArrowDownRight className="h-5 w-5" />
                </div>
                <p>No recent transactions</p>
              </div>
            ) : (
              recentTransactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between p-2 hover:bg-muted/30 rounded-md transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "flex items-center justify-center w-8 h-8 rounded-full",
                      transaction.type === "EXPENSE" 
                        ? "bg-red-100 text-red-600 dark:bg-red-900/20"
                        : "bg-green-100 text-green-600 dark:bg-green-900/20"
                    )}>
                      {transaction.type === "EXPENSE" ? (
                        <ArrowDownRight className="h-4 w-4" />
                      ) : (
                        <ArrowUpRight className="h-4 w-4" />
                      )}
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {transaction.description || transaction.category || "Untitled Transaction"}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {format(new Date(transaction.date), "MMM d, yyyy")}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div
                      className={cn(
                        "text-sm font-medium",
                        transaction.type === "EXPENSE"
                          ? "text-red-500"
                          : "text-green-500"
                      )}
                    >
                      {transaction.type === "EXPENSE" ? "-" : "+"}${transaction.amount.toFixed(2)}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
        {recentTransactions.length > 0 && (
          <CardFooter className="pt-0">
            <a 
              href="/transactions" 
              className="text-xs text-primary hover:underline flex items-center mt-1"
            >
              View all transactions
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-3 w-3 ml-1" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </a>
          </CardFooter>
        )}
      </Card>

      {/* Expense Breakdown Card - Enhanced with ShadCN styling */}
      <Card className="flex flex-col">
        <CardHeader className="items-start pb-2">
          <CardTitle className="text-base font-normal">
            Monthly Expense Breakdown
          </CardTitle>
          <CardDescription>
            {format(currentDate, "MMMM yyyy")}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex-1 pb-2">
          {pieChartData.length === 0 ? (
            <div className="flex items-center justify-center h-[250px] text-center text-muted-foreground">
              <p>No expenses recorded this month</p>
            </div>
          ) : (
            <ChartContainer
              config={chartConfig}
              className="mx-auto aspect-square max-h-[250px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieChartData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    innerRadius={40} // Adding inner radius for a donut chart look
                    fill="#8884d8" // Default fill color
                    stroke="none" // Remove black outlines
                  >
                    {pieChartData.map((entry, index) => {
                      // Map category to a color from the chart config
                      const categoryKey = entry.name;
                      // Use the exact color value instead of CSS variable reference
                      const colorVar = chartConfig[categoryKey]?.color || 
                                    `var(--chart-${(index % 10) + 1})`;
                      // These are the actual HSL colors that match the CSS variables
                      const colorMap = {
                        'var(--chart-1)': 'hsl(224, 76%, 56%)',
                        'var(--chart-2)': 'hsl(162, 84%, 39%)',
                        'var(--chart-3)': 'hsl(334, 76%, 60%)',
                        'var(--chart-4)': 'hsl(27, 98%, 57%)',
                        'var(--chart-5)': 'hsl(265, 73%, 60%)',
                        'var(--chart-6)': 'hsl(190, 77%, 50%)',
                        'var(--chart-7)': 'hsl(46, 95%, 56%)',
                        'var(--chart-8)': 'hsl(310, 95%, 62%)',
                        'var(--chart-9)': 'hsl(350, 95%, 62%)',
                        'var(--chart-10)': 'hsl(102, 62%, 46%)'
                      };
                      // Use the direct color value from the map or fallback to a standard color
                      const actualColor = colorMap[colorVar] || (index === 0 ? '#2563eb' : 
                                         index === 1 ? '#10b981' : 
                                         index === 2 ? '#f43f5e' : 
                                         index === 3 ? '#f97316' : 
                                         index === 4 ? '#8b5cf6' : '#0ea5e9');
                      
                      return (
                        <Cell 
                          key={`cell-${index}`}
                          fill={actualColor} 
                          strokeWidth={0}
                        />
                      );
                    })}
                  </Pie>
                  <ChartTooltip
                    content={
                      <ChartTooltipContent 
                        formatter={(value) => `$${value.toFixed(2)}`}
                      />
                    }
                  />
                </PieChart>
              </ResponsiveContainer>
            </ChartContainer>
          )}
        </CardContent>
        <CardFooter className="flex-col gap-1.5 text-sm pt-0">
          {pieChartData.length > 0 && (
            <>
              <div className="flex items-center gap-2 leading-none font-medium">
                {pieChartData[0]?.name || "Top category"}: ${pieChartData[0]?.value.toFixed(2) || "0.00"}
                <TrendingUp className="h-4 w-4 text-green-500" />
              </div>
              <div className="text-muted-foreground leading-none text-xs">
                Showing expenses for {accounts.find(a => a.id === selectedAccountId)?.name || "selected account"}
              </div>
            </>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}