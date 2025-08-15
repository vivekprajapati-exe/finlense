"use client";

import { useState } from "react";
import {
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerFooter,
  DrawerClose
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function CreateAccountDrawer({ children }) {
  const [open, setOpen] = useState(false);
  const [accountName, setAccountName] = useState("");
  const [accountBalance, setAccountBalance] = useState("");
  const [accountType, setAccountType] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Call your backend API to create an account
    console.log("Creating account:", {
      accountName,
      accountBalance,
      accountType,
    });
    setOpen(false);
    setAccountName("");
    setAccountBalance("");
    setAccountType("");
  };

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>{children}</DrawerTrigger>
      <DrawerContent className="bg-background text-foreground">
        <DrawerHeader>
          <DrawerTitle>Create New Account</DrawerTitle>
          <DrawerDescription>
            Add a new account to track your balance and transactions.
          </DrawerDescription>
        </DrawerHeader>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="accountName">Account Name</Label>
            <Input
              id="accountName"
              placeholder="e.g. Savings"
              value={accountName}
              onChange={(e) => setAccountName(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="accountBalance">Initial Balance</Label>
            <Input
              id="accountBalance"
              type="number"
              step="0.01"
              placeholder="e.g. 1000.00"
              value={accountBalance}
              onChange={(e) => setAccountBalance(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="accountType">Account Type</Label>
            <Input
              id="accountType"
              placeholder="e.g. Checking"
              value={accountType}
              onChange={(e) => setAccountType(e.target.value)}
              required
            />
          </div>

          <DrawerFooter>
            <Button type="submit">Create Account</Button>
            <DrawerClose asChild>
              <Button variant="outline" type="button">
                Cancel
              </Button>
            </DrawerClose>
          </DrawerFooter>
        </form>
      </DrawerContent>
    </Drawer>
  );
}
