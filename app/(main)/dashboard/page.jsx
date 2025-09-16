import { checkUser } from "@/lib/checkUser";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { CreateAccountDrawer } from "@/components/create-account-drawer-swaraj";
import { getUserAccounts, getDashboardData } from "@/actions/dashboard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PlusCircle } from "lucide-react";
import {AccountCard }from "./_components/account-card";
import { BudgetTracker } from "./_components/budget-tracker";

export default async function DashboardPage() {
  const clerkUser = await currentUser();
  
  // Redirect to sign-in if not authenticated
  if (!clerkUser) {
    redirect('/sign-in');
  }

  // Sync user with database
  const user = await checkUser();
  
  // Fetch user's accounts and transactions
  const accounts = await getUserAccounts();
  const transactions = await getDashboardData();
  
  const totalBalance = accounts?.reduce((sum, account) => sum + account.balance, 0) || 0;
  
  return (
    <div className="w-full space-y-6 sm:space-y-8">
      {/* Welcome Section - Enhanced with Gradient */}
      <div className="rounded-lg p-6 mb-2 text-white ">
        <div className="text-center sm:text-left">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2 bg-clip-text text-white ">
            Welcome back{clerkUser?.firstName ? `, ${clerkUser.firstName}` : ''}!
          </h1>
          <p className="text-muted-foreground text-sm sm:text-base">
            Here's your financial overview for today
          </p>
        </div>
      </div>

      {/* Overview Section - Responsive Flex Layout */}
      <section>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
          <h2 className="text-lg sm:text-xl lg:text-2xl font-bold">Overview</h2>
          <div className="text-xs sm:text-sm text-muted-foreground">
            Updated recently
          </div>
        </div>
        
        {/* Flex container for overview cards and budget tracker */}
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Overview Cards */}
          <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Card className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm sm:text-base text-muted-foreground font-medium">
                  Total Balance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl sm:text-3xl font-bold">${totalBalance.toFixed(2)}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Across {accounts?.length || 0} accounts
                </p>
              </CardContent>
            </Card>
            <Card className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm sm:text-base text-muted-foreground font-medium">
                  Income
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl sm:text-3xl font-bold text-green-600">
                  ${transactions?.filter(t => t.type === "INCOME").reduce((sum, t) => sum + t.amount, 0)?.toFixed(2) || "0.00"}
                </p>
                <p className="text-xs text-muted-foreground mt-1">This month</p>
              </CardContent>
            </Card>
            <Card className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm sm:text-base text-muted-foreground font-medium">
                  Expenses
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl sm:text-3xl font-bold text-red-600">
                  ${transactions?.filter(t => t.type === "EXPENSE").reduce((sum, t) => sum + t.amount, 0)?.toFixed(2) || "0.00"}
                </p>
                <p className="text-xs text-muted-foreground mt-1">This month</p>
              </CardContent>
            </Card>
          </div>
          
          {/* Budget Tracker */}
          <div className="lg:w-[320px] flex-shrink-0">
            <BudgetTracker/>
          </div>
        </div>
      </section>

      {/* Quick Actions - Enhanced for All Devices */}
      <section className="sm:hidden">
        <Card className="p-4 bg-gradient-to-r from-blue-900/30 to-purple-900/30 border-gray-800">
          <div className="flex flex-col space-y-3">
            <h3 className="font-semibold text-base text-white">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-3">
              <CreateAccountDrawer>
                <Button size="sm" variant="outline" className="w-full bg-blue-900/50 hover:bg-blue-800/70 border-blue-700/50 text-blue-100">
                  <PlusCircle className="mr-2 h-4 w-4 text-blue-300" />
                  Add Account
                </Button>
              </CreateAccountDrawer>
              <Button size="sm" variant="outline" className="w-full bg-purple-900/50 hover:bg-purple-800/70 border-purple-700/50 text-purple-100">
                <PlusCircle className="mr-2 h-4 w-4 text-purple-300" />
                Scan Receipt
              </Button>
            </div>
          </div>
        </Card>
      </section>

      {/* Recent Activity Section - Replace the old Budget Progress */}
      <section className="space-y-4">
        <h2 className="text-lg sm:text-xl lg:text-2xl font-bold">Recent Activity</h2>
        <Card className="border border-gray-200 dark:border-gray-800">
          <CardContent className="pt-6">
            {transactions && transactions.length > 0 ? (
              <div className="space-y-4">
                {transactions.slice(0, 3).map((transaction) => (
                  <div key={transaction.id} className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-800">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        transaction.type === "INCOME" ? "bg-green-100 text-green-600 dark:bg-green-900/30" : "bg-red-100 text-red-600 dark:bg-red-900/30"
                      }`}>
                        {transaction.type === "INCOME" ? "+" : "-"}
                      </div>
                      <div>
                        <p className="font-medium">{transaction.name}</p>
                        <p className="text-xs text-muted-foreground">{new Date(transaction.date).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <p className={`font-medium ${transaction.type === "INCOME" ? "text-green-600" : "text-red-600"}`}>
                      {transaction.type === "INCOME" ? "+" : "-"}${transaction.amount.toFixed(2)}
                    </p>
                  </div>
                ))}
                <div className="text-center pt-2">
                  <Button variant="outline" size="sm" asChild>
                    <a href="/transactions">View All Transactions</a>
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground mb-4">No recent transactions</p>
                <Button variant="outline" size="sm">Add Transaction</Button>
              </div>
            )}
          </CardContent>
        </Card>
      </section>

      {/* Account Grid - Mobile Responsive */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <h2 className="text-lg sm:text-xl lg:text-2xl font-bold">Your Accounts</h2>
          <div className="hidden sm:block">
            <CreateAccountDrawer>
              <Button size="sm" variant="outline">
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Account
              </Button>
            </CreateAccountDrawer>
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {accounts && accounts.length > 0 ? (
            accounts.map((account) => (
              <AccountCard key={account.id} account={account}/>
            ))
          ) : (
            <Card className="col-span-full">
              <CardContent className="pt-6">
                <div className="text-center py-8">
                  <p className="text-muted-foreground mb-4">
                    No accounts yet. Create your first account to get started.
                  </p>
                  <CreateAccountDrawer>
                    <Button>
                      <PlusCircle className="mr-2 h-4 w-4" />
                      Create Your First Account
                    </Button>
                  </CreateAccountDrawer>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </section>
    </div>
  );
}
