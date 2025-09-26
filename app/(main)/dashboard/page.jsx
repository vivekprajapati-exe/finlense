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
import { Suspense } from "react";
import { DashboardOverview } from "./_components/transation-overview";
import { getCurrentBudget } from "@/actions/budget";

export default async function DashboardPage() {
  const clerkUser = await currentUser();
  
  // Redirect to sign-in if not authenticated
  if (!clerkUser) {
    redirect('/sign-in');
  }

  // Sync user with database
  const user = await checkUser();
  
 const [accounts, transactions] = await Promise.all([
    getUserAccounts(),
    getDashboardData(),
  ]);
  
const defaultAccount = accounts?.find((account) => account.isDefault);

  // Get budget for default account
  let budgetData = null;
  if (defaultAccount) {
    budgetData = await getCurrentBudget(defaultAccount.id);
  }
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
      <Suspense fallback={"LOading Overview..."}>
       <DashboardOverview
       accounts={accounts}
       transactions={transactions || []}
       />
      </Suspense>
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
            <BudgetTracker 
              initialBudget={budgetData?.budget}
              currentExpenses={budgetData?.currentExpenses || 0}
            />
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
