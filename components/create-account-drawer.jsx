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
import useFetch from "@/hooks/use-fetch";
// import { accountSchema } from "@/app/lib/schema";

export function CreateAccountDrawer({ children }) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useFetch(createAccount)

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
    <>
    {/* Swaraj write the code here */}
    </>
  );
}
