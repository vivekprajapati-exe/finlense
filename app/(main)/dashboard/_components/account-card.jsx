"use client";

import { ArrowUpRight, ArrowDownRight, CreditCard } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { useEffect } from "react";
import useFetch from "@/hooks/use-fetch";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { updateDefaultAccount } from "@/actions/account";
import { toast } from "sonner";

export function AccountCard({ account }) {
  const { name, type, balance, id, isDefault } = account;

  const {
    loading: updateDefaultLoading,
    fn: updateDefaultFn,
    data: updatedAccount,
    error,
  } = useFetch(updateDefaultAccount);

  const handleDefaultChange = async (event) => {
    event.preventDefault(); // Prevent navigation

    if (isDefault) {
      toast.warning("You need atleast 1 default account");
      return; // Don't allow toggling off the default account
    }

    await updateDefaultFn(id);
  };

  useEffect(() => {
    if (updatedAccount?.success) {
      toast.success("Default account updated successfully");
    }
  }, [updatedAccount]);

  useEffect(() => {
    if (error) {
      toast.error(error.message || "Failed to update default account");
    }
  }, [error]);

  return (
    <Card className="hover:shadow-lg transition-all duration-200 group relative border-muted/40 hover:border-muted/60">
      <Link href={`/account/${id}`} className="block">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-primary/10 rounded-lg">
              <CreditCard className="w-4 h-4 text-primary" />
            </div>
            <div>
              <CardTitle className="text-base sm:text-lg font-semibold capitalize truncate max-w-[120px] sm:max-w-none">
                {name}
              </CardTitle>
              {isDefault && (
                <Badge variant="secondary" className="text-xs mt-1">
                  Default
                </Badge>
              )}
            </div>
          </div>
          <Switch
            checked={isDefault}
            onClick={handleDefaultChange}
            disabled={updateDefaultLoading}
            className="flex-shrink-0"
          />
        </CardHeader>
        
        <CardContent className="pb-4">
          <div className="space-y-2">
            <div className="text-2xl sm:text-3xl font-bold">
              ${parseFloat(balance).toFixed(2)}
            </div>
            <p className="text-xs sm:text-sm text-muted-foreground">
              {type.charAt(0) + type.slice(1).toLowerCase()} Account
            </p>
          </div>
        </CardContent>
        
        <CardFooter className="flex justify-between text-xs sm:text-sm text-muted-foreground pt-4 border-t border-muted/20">
          <div className="flex items-center space-x-1">
            <ArrowUpRight className="h-3 w-3 sm:h-4 sm:w-4 text-green-500" />
            <span>Income</span>
          </div>
          <div className="flex items-center space-x-1">
            <ArrowDownRight className="h-3 w-3 sm:h-4 sm:w-4 text-red-500" />
            <span>Expense</span>
          </div>
        </CardFooter>
      </Link>
    </Card>
  );
}
