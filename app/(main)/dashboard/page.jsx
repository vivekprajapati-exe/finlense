import { checkUser } from "@/lib/checkUser";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { CreateAccountDrawer } from "@/components/create-account-drawer-swaraj";
import { getUserAccounts, getDashboardData } from "@/actions/dashboard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PlusCircle } from "lucide-react";
import {AccountCard }from "./_components/account-card";

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
    <div className="w-full space-y-8">
      {/* Budget Progress  */}
      <section className="space-y-2">
        <h2 className="text-2xl font-bold">Budget Progress</h2>
        <Card>
          <CardContent className="pt-6">
            <p>Your budget tracking will appear here</p>
          </CardContent>
        </Card>
      </section>

      {/* Overview */}
      <section className="space-y-2">
        <h2 className="text-2xl font-bold">Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Total Balance</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">${totalBalance.toFixed(2)}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Income</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-green-600">
                ${transactions?.filter(t => t.type === "INCOME").reduce((sum, t) => sum + t.amount, 0)?.toFixed(2) || "0.00"}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Expenses</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-red-600">
                ${transactions?.filter(t => t.type === "EXPENSE").reduce((sum, t) => sum + t.amount, 0)?.toFixed(2) || "0.00"}
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Account Grid */}
      <section className="space-y-2">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Your Accounts</h2>
          <CreateAccountDrawer>
            <Button size="sm" variant="outline">
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Account
            </Button>
          </CreateAccountDrawer>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {accounts && accounts.length > 0 ? (
            accounts.map((account) => (
              <AccountCard key={account.id} account={account}/>
            ))
          ) : (
            <Card>
              <CardContent className="pt-6">
                <p>No accounts yet. Create your first account to get started.</p>
              </CardContent>
            </Card>
          )}
        </div>
      </section>
    </div>
  );
}
