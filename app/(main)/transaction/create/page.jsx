import { getUserAccounts } from "@/actions/dashboard";
import { defaultCategories } from "@/data/categories";
import { AddTransactionForm } from "../_components/transaction-form";
import { getTransaction } from "@/actions/transaction";
import { Receipt, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function AddTransactionPage({ searchParams }) {
  // Await searchParams to fix Next.js 15+ compatibility
  const resolvedSearchParams = await searchParams;
  const accounts = await getUserAccounts();
  const editId = resolvedSearchParams?.edit;

  let initialData = null;
  if (editId) {
    try {
      const transaction = await getTransaction(editId);
      initialData = transaction;
    } catch (error) {
      console.error("Error fetching transaction:", error);
      // Handle error gracefully - could redirect or show error message
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        {/* Header with improved UX */}
        <div className="flex items-center gap-4 mb-8">
          <div className="bg-primary/10 p-3 rounded-full">
            <Receipt className="h-6 w-6 text-primary" />
          </div>
          <div className="flex-1">
            <h1 className="text-2xl md:text-3xl font-bold">
              {editId ? "Edit Transaction" : "Add New Transaction"}
            </h1>
            <p className="text-muted-foreground mt-1">
              {editId 
                ? "Update your transaction details below" 
                : "Record your income or expense transaction"
              }
            </p>
          </div>
          <Link href="/dashboard">
            <Button variant="outline" size="sm" className="hidden sm:flex">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
        </div>

        {/* Transaction Form */}
        <AddTransactionForm
          accounts={accounts}
          categories={defaultCategories}
          editMode={!!editId}
          initialData={initialData}
        />
      </div>
    </div>
  );
}
