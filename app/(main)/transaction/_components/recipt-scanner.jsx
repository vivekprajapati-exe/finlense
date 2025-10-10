"use client";

import { useRef, useState } from "react";
import { toast } from "sonner";
import { scanReceipt } from "@/actions/receipt";
import { Button } from "@/components/ui/button";
import { Receipt, Loader2, Upload } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";

export function ReceiptScanner({ onScanComplete }) {
  const fileInputRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [errorMessage, setErrorMessage] = useState("");

  // Simulate progress for better UX
  const simulateProgress = () => {
    setProgress(0);
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) {
          clearInterval(interval);
          return prev;
        }
        return prev + 10;
      });
    }, 500);

    return () => clearInterval(interval);
  };

  const handleReceiptScan = async (file) => {
    if (!file) return;

    // Reset states
    setIsLoading(true);
    setErrorMessage("");

    // Start progress animation
    const stopProgress = simulateProgress();

    try {
      // Validate file before upload
      if (file.size > 5 * 1024 * 1024) {
        throw new Error("File size exceeds 5MB limit. Please upload a smaller image.");
      }

      if (!['image/jpeg', 'image/png', 'image/webp', 'application/pdf'].includes(file.type)) {
        throw new Error("Only JPEG, PNG, WebP images and PDF files are supported.");
      }

      // Create FormData for file upload
      const formData = new FormData();
      formData.append('receipt', file);

      // Call the server action
      const result = await scanReceipt(file);

      // Complete progress animation
      setProgress(100);
      stopProgress();

      if (!result.success) {
        throw new Error(result.error || "Failed to scan receipt.");
      }

      // Show success message
      toast.success("Receipt scanned successfully! Transaction details have been extracted.");

      // Pass the extracted data to the parent component
      if (onScanComplete && typeof onScanComplete === 'function') {
        onScanComplete(result.data);
      }

    } catch (error) {
      console.error("Receipt scanning error:", error);

      // Stop progress animation
      stopProgress();
      setProgress(0);

      // Show specific error message
      const errorMsg = error.message || "Failed to scan receipt. Please try again.";
      setErrorMessage(errorMsg);

      toast.error(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      handleReceiptScan(file);
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <Card className="overflow-hidden">
      <CardContent className="pt-6">
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="bg-primary/10 p-3 rounded-full">
            <Receipt className="h-6 w-6 text-primary" />
          </div>

          <div>
            <h3 className="text-lg font-semibold">AI Receipt Scanner</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Upload a receipt to automatically fill transaction details
            </p>
          </div>

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/jpeg,image/png,image/webp,application/pdf"
            className="hidden"
          />

          <Button
            onClick={handleButtonClick}
            disabled={isLoading}
            className="w-full flex items-center gap-2"
            variant="outline"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Upload className="h-4 w-4" />
            )}
            {isLoading ? "Scanning..." : "Upload Receipt"}
          </Button>

          {isLoading && (
            <div className="w-full space-y-2">
              <Progress value={progress} className="h-2" />
              <p className="text-xs text-muted-foreground">
                Analyzing receipt with AI...
              </p>
            </div>
          )}

          {errorMessage && (
            <p className="text-sm text-destructive">{errorMessage}</p>
          )}

          <p className="text-xs text-muted-foreground pb-2">
            Supported formats: JPEG, PNG, WebP, PDF (max 5MB)
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
