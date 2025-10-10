"use client"; "use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CalendarIcon, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { useRouter, useSearchParams } from "next/navigation";
import useFetch from "@/hooks/use-fetch";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CreateAccountDrawer } from "@/components/create-account-drawer";
import { cn } from "@/lib/utils";
import { createTransaction, updateTransaction } from "@/actions/transaction";
import { transactionSchema } from "@/app/lib/schema";
import { ReceiptScanner } from "./recipt-scanner";

export function AddTransactionForm({
  accounts,
  categories,
  editMode = false,
  initialData = null,
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get("edit");

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    getValues,
    reset,
  } = useForm({
    resolver: zodResolver(transactionSchema),
    defaultValues:
      editMode && initialData
        ? {
          type: initialData.type,
          amount: initialData.amount.toString(),
          description: initialData.description,
          accountId: initialData.accountId,
          category: initialData.category,
          date: new Date(initialData.date),
          isRecurring: initialData.isRecurring,
          ...(initialData.recurringInterval && {
            recurringInterval: initialData.recurringInterval,
          }),
        }
        : {
          type: "EXPENSE",
          amount: "",
          description: "",
          accountId: accounts.find((ac) => ac.isDefault)?.id,
          date: new Date(),
          isRecurring: false,
        },
  });

  const {
    loading: transactionLoading,
    fn: transactionFn,
    data: transactionResult,
  } = useFetch(editMode ? updateTransaction : createTransaction);

  const onSubmit = (data) => {
    const formData = {
      ...data,
      amount: parseFloat(data.amount),
    };

    if (editMode) {
      transactionFn(editId, formData);
    } else {
      transactionFn(formData);
    }
  };

  const handleScanComplete = (scannedData) => {
    if (scannedData) {
      // Update form with scanned data
      setValue("description", scannedData.description);
      setValue("amount", scannedData.amount.toString());

      // If there's a valid date
      if (scannedData.date) {
        try {
          const dateObj = new Date(scannedData.date);
          if (!isNaN(dateObj.getTime())) {
            setValue("date", dateObj);
          }
        } catch (e) {
          console.error("Invalid date format from receipt:", e);
        }
      }

      // Set category if it matches one of our categories
      if (scannedData.category) {
        const matchedCategory = categories.find(
          cat => cat.id.toLowerCase() === scannedData.category.toLowerCase() ||
            cat.name.toLowerCase() === scannedData.category.toLowerCase()
        );

        if (matchedCategory) {
          setValue("category", matchedCategory.id);
        }
      }

      // Set transaction type (usually EXPENSE for receipts)
      setValue("type", scannedData.type || "EXPENSE");

      // Show success message is already handled by the ReceiptScanner component
    }
  };

  useEffect(() => {
    if (transactionResult?.success && !transactionLoading) {
      toast.success(
        editMode
          ? "Transaction updated successfully"
          : "Transaction created successfully"
      );
      reset();
      // Navigate back to dashboard instead of account page for better UX
      router.push("/dashboard");
    }
  }, [transactionResult, transactionLoading, editMode, router, reset]);

  const type = watch("type");
  const isRecurring = watch("isRecurring");
  const date = watch("date");

  const filteredCategories = categories.filter(
    (category) => category.type === type
  );

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      {/* Receipt Scanner - Only show in create mode */}
      {!editMode && <ReceiptScanner onScanComplete={handleScanComplete} />}

      <div className="bg-card rounded-lg border shadow-sm p-6 space-y-6">
        {/* Transaction Type Selector - Enhanced UI */}
        <div className="grid grid-cols-2 gap-2">
          <Button
            type="button"
            variant={type === "EXPENSE" ? "default" : "outline"}
            className={cn(
              "h-12 relative overflow-hidden transition-all",
              type === "EXPENSE" ? "shadow-md" : ""
            )}
            onClick={() => setValue("type", "EXPENSE")}
          >
            <span className="font-medium">Expense</span>
          </Button>
          <Button
            type="button"
            variant={type === "INCOME" ? "default" : "outline"}
            className={cn(
              "h-12 relative overflow-hidden transition-all",
              type === "INCOME" ? "shadow-md" : ""
            )}
            onClick={() => setValue("type", "INCOME")}
          >
            <span className="font-medium">Income</span>
          </Button>
        </div>

        {/* Amount and Account - Enhanced UI */}
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center">
              Amount
              <span className="text-xs ml-1 text-muted-foreground">(required)</span>
            </label>
            <Input
              type="number"
              step="0.01"
              placeholder="0.00"
              className="h-10 focus-visible:ring-primary/50"
              {...register("amount")}
            />
            {errors.amount && (
              <p className="text-sm text-destructive">{errors.amount.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center">
              Account
              <span className="text-xs ml-1 text-muted-foreground">(required)</span>
            </label>
            <Select
              onValueChange={(value) => setValue("accountId", value)}
              defaultValue={getValues("accountId")}
            >
              <SelectTrigger className="h-10">
                <SelectValue placeholder="Select account" />
              </SelectTrigger>
              <SelectContent>
                {accounts.map((account) => (
                  <SelectItem key={account.id} value={account.id}>
                    <span className="font-medium">{account.name}</span>
                    <span className="ml-1 text-muted-foreground">(${parseFloat(account.balance).toFixed(2)})</span>
                  </SelectItem>
                ))}
                <CreateAccountDrawer>
                  <Button
                    variant="ghost"
                    className="relative flex w-full justify-center items-center gap-1 py-1.5 text-sm hover:bg-accent hover:text-accent-foreground"
                  >
                    <span className="text-xs mr-1">+</span> Create New Account
                  </Button>
                </CreateAccountDrawer>
              </SelectContent>
            </Select>
            {errors.accountId && (
              <p className="text-sm text-destructive">{errors.accountId.message}</p>
            )}
          </div>
        </div>

        {/* Category */}
        <div className="space-y-2">
          <label className="text-sm font-medium flex items-center">
            Category
            <span className="text-xs ml-1 text-muted-foreground">(required)</span>
          </label>
          <Select
            onValueChange={(value) => setValue("category", value)}
            defaultValue={getValues("category")}
          >
            <SelectTrigger className="h-10">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {filteredCategories.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  <span className="font-medium">{category.name}</span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.category && (
            <p className="text-sm text-destructive">{errors.category.message}</p>
          )}
        </div>

        {/* Date */}
        <div className="space-y-2">
          <label className="text-sm font-medium flex items-center">
            Date
            <span className="text-xs ml-1 text-muted-foreground">(required)</span>
          </label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full h-10 pl-3 text-left font-normal",
                  !date && "text-muted-foreground"
                )}
              >
                {date ? format(date, "PPP") : <span>Pick a date</span>}
                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={date}
                onSelect={(date) => setValue("date", date)}
                disabled={(date) =>
                  date > new Date() || date < new Date("1900-01-01")
                }
                initialFocus
              />
            </PopoverContent>
          </Popover>
          {errors.date && (
            <p className="text-sm text-destructive">{errors.date.message}</p>
          )}
        </div>

        {/* Description */}
        <div className="space-y-2">
          <label className="text-sm font-medium">
            Description
            <span className="text-xs ml-1 text-muted-foreground">(optional)</span>
          </label>
          <Input
            placeholder="Enter description"
            className="h-10 focus-visible:ring-primary/50"
            {...register("description")}
          />
          {errors.description && (
            <p className="text-sm text-destructive">{errors.description.message}</p>
          )}
        </div>
      </div>

      {/* Recurring Settings Card */}
      <div className="bg-card rounded-lg border shadow-sm p-6 space-y-6">
        {/* Recurring Toggle */}
        <div className="flex flex-row items-center justify-between rounded-lg bg-muted/30 p-4">
          <div className="space-y-1">
            <label className="text-base font-medium">Recurring Transaction</label>
            <div className="text-sm text-muted-foreground">
              Set up a recurring schedule for this transaction
            </div>
          </div>
          <Switch
            checked={isRecurring}
            onCheckedChange={(checked) => setValue("isRecurring", checked)}
            className="data-[state=checked]:bg-primary"
          />
        </div>

        {/* Recurring Interval */}
        {isRecurring && (
          <div className="space-y-2 pt-2">
            <label className="text-sm font-medium">Recurring Interval</label>
            <Select
              onValueChange={(value) => setValue("recurringInterval", value)}
              defaultValue={getValues("recurringInterval")}
            >
              <SelectTrigger className="h-10">
                <SelectValue placeholder="Select interval" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="DAILY">Daily</SelectItem>
                <SelectItem value="WEEKLY">Weekly</SelectItem>
                <SelectItem value="MONTHLY">Monthly</SelectItem>
                <SelectItem value="YEARLY">Yearly</SelectItem>
              </SelectContent>
            </Select>
            {errors.recurringInterval && (
              <p className="text-sm text-destructive">
                {errors.recurringInterval.message}
              </p>
            )}
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-4 pt-2">
        <Button
          type="button"
          variant="outline"
          className="w-full h-12 order-2 sm:order-1"
          onClick={() => router.push("/dashboard")}
          disabled={transactionLoading}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          className="w-full h-12 shadow-md order-1 sm:order-2"
          disabled={transactionLoading || !accounts?.length}
        >
          {transactionLoading ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              <span>{editMode ? "Updating..." : "Creating..."}</span>
            </>
          ) : (
            <span>{editMode ? "Update Transaction" : "Create Transaction"}</span>
          )}
        </Button>
      </div>
    </form>
  );
}
