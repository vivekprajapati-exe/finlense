"use client";

import { useRef, useEffect } from "react";
import { Camera, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import useFetch from "@/hooks/use-fetch";
import { scanReceipt } from "@/actions/transaction";

export function ReceiptScanner({ onScanComplete }) {
  const fileInputRef = useRef(null);

  const {
    loading: scanReceiptLoading,
    fn: scanReceiptFn,
    data: scannedData,
  } = useFetch(scanReceipt);

  const handleReceiptScan = async (file) => {
    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size should be less than 5MB");
      return;
    }

    await scanReceiptFn(file);
  };

  useEffect(() => {
    if (scannedData && !scanReceiptLoading) {
      onScanComplete(scannedData);
      toast.success("Receipt scanned successfully");
    }
  }, [scanReceiptLoading, scannedData]);

  return (
    <div className="mb-6">
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept="image/*"
        capture="environment"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleReceiptScan(file);
        }}
      />
      <Button
        type="button"
        className="w-full h-12 bg-primary/90 hover:bg-primary transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 group relative overflow-hidden"
        onClick={() => fileInputRef.current?.click()}
        disabled={scanReceiptLoading}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        {scanReceiptLoading ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin" />
            <span className="font-medium">Processing Receipt...</span>
          </>
        ) : (
          <>
            <Camera className="h-5 w-5" />
            <span className="font-medium">Scan Receipt with AI</span>
          </>
        )}
      </Button>
      <p className="text-xs text-center mt-2 text-muted-foreground">Upload a receipt image to automatically fill transaction details</p>
    </div>
  );
}
