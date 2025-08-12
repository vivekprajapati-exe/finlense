"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
// import useFetch from "@/hooks/use-fetch";
// import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
  DrawerClose,
} from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { createAccount } from "@/actions/dashboard";
// import { accountSchema } from "@/app/lib/schema";

export function CreateAccountDrawer({ children }) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleCreateAccount = async (data) => {
    setIsLoading(true);
    try {
      await createAccount(data);
      setOpen(false);
      // You can add toast notification here when you have sonner installed
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (    
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>{children}</DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Create New Account</DrawerTitle>
        </DrawerHeader>
        <div className="p-4 space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium mb-1">Account Name</label>
            <Input id="name" placeholder="e.g. Main Checking" />
          </div>
          
          <div>
            <label htmlFor="type" className="block text-sm font-medium mb-1">Account Type</label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select account type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="CHECKING">Checking</SelectItem>
                <SelectItem value="SAVINGS">Savings</SelectItem>
                <SelectItem value="CREDIT_CARD">Credit Card</SelectItem>
                <SelectItem value="INVESTMENT">Investment</SelectItem>
                <SelectItem value="OTHER">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <label htmlFor="balance" className="block text-sm font-medium mb-1">Starting Balance</label>
            <Input id="balance" type="number" step="0.01" placeholder="0.00" />
          </div>
          
          <div className="flex items-center justify-between">
            <label htmlFor="is-default" className="text-sm font-medium">Set as default account</label>
            <Switch id="is-default" />
          </div>
          
          <div className="flex justify-end gap-2 pt-4">
            <DrawerClose asChild>
              <Button variant="outline">Cancel</Button>
            </DrawerClose>
            <Button disabled={isLoading} onClick={() => handleCreateAccount({
              name: document.getElementById('name').value,
              type: document.querySelector('[data-value]')?.getAttribute('data-value') || 'CHECKING',
              balance: document.getElementById('balance').value || 0,
              isDefault: document.getElementById('is-default').checked,
            })}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Create Account
            </Button>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
