import { Suspense } from "react";
import { getAccountWithTransactions } from "@/actions/account";
import { BarLoader } from "react-spinners";
import { TransactionTable } from "../_components/transaction-table";
import { notFound } from "next/navigation";
import { AccountChart } from "../_components/account-chart";

export default async function AccountPage({ params }) {
  const accountData = await getAccountWithTransactions(params.id);

  if (!accountData) {
    notFound();
  }

  const { transactions, ...account } = accountData;

  return (
    <div className="space-y-6 sm:space-y-8 px-2 sm:px-4 lg:px-5">
      {/* Header Section - Mobile Optimized */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 sm:gap-8">
        <div className="min-w-0 flex-1">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold tracking-tight gradient-title capitalize break-words">
            {account.name}
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground mt-1">
            {account.type.charAt(0) + account.type.slice(1).toLowerCase()} Account
          </p>
        </div>

        <div className="flex-shrink-0 text-left sm:text-right sm:pb-2">
          <div className="text-xl sm:text-2xl lg:text-3xl font-bold">
            ${parseFloat(account.balance).toFixed(2)}
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground">
            {account._count.transactions} Transaction{account._count.transactions !== 1 ? 's' : ''}
          </p>
        </div>
      </div>

      {/* Chart Section - Mobile Responsive */}
      <div className="w-full">
        <Suspense
          fallback={
            <div className="w-full">
              <BarLoader className="mt-4" width={"100%"} color="#9333ea" />
            </div>
          }
        >
          <AccountChart transactions={transactions} />
        </Suspense>
      </div>

      {/* Transactions Table - Mobile Optimized */}
      <div className="w-full overflow-hidden">
        <Suspense
          fallback={
            <div className="w-full">
              <BarLoader className="mt-4" width={"100%"} color="#9333ea" />
            </div>
          }
        >
          <TransactionTable transactions={transactions} />
        </Suspense>
      </div>
    </div>
  );
}