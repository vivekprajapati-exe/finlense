"use client";

import { useState, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Camera, 
  Upload, 
  X, 
  CheckCircle, 
  AlertCircle,
  Loader2,
  RefreshCw,
  FileImage,
  Smartphone
} from "lucide-react";
import { toast } from "sonner";

export function ReceiptScanner({ onDataExtracted, onClose }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingProgress, setProcessingProgress] = useState(0);
  const [extractedData, setExtractedData] = useState(null);
  const [confidence, setConfidence] = useState(null);
  const fileInputRef = useRef(null);
  const cameraInputRef = useRef(null);

  // Simulate processing progress
  const updateProgress = useCallback(() => {
    const interval = setInterval(() => {
      setProcessingProgress(prev => {
        if (prev >= 90) {
          clearInterval(interval);
          return 90;
        }
        return prev + 10;
      });
    }, 300);
    return interval;
  }, []);

  const handleFileSelect = (file) => {
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file (JPG, PNG, etc.)');
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast.error('File size must be less than 10MB');
      return;
    }

    setSelectedFile(file);
    
    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e.target.result);
    };
    reader.readAsDataURL(file);
  };

  const processReceipt = async () => {
    if (!selectedFile) return;

    setIsProcessing(true);
    setProcessingProgress(0);
    const progressInterval = updateProgress();

    try {
      // TODO: Replace with actual OCR API call
      // Simulate API processing time
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock extracted data - replace with actual OCR results
      const mockData = {
        amount: "25.49",
        merchantName: "Coffee Shop Express",
        date: new Date().toISOString().split('T')[0],
        category: "food_dining",
        items: [
          { name: "Large Coffee", price: "4.50" },
          { name: "Sandwich", price: "8.99" },
          { name: "Cookie", price: "2.00" },
          { name: "Tax", price: "10.00" }
        ]
      };

      const mockConfidence = Math.floor(Math.random() * 20) + 80; // 80-99%

      setProcessingProgress(100);
      setTimeout(() => {
        setExtractedData(mockData);
        setConfidence(mockConfidence);
        setIsProcessing(false);
        
        if (mockConfidence >= 85) {
          toast.success(`Receipt processed successfully! (${mockConfidence}% confidence)`);
        } else {
          toast.warning(`Receipt processed with ${mockConfidence}% confidence. Please review the data.`);
        }
      }, 500);

    } catch (error) {
      setIsProcessing(false);
      setProcessingProgress(0);
      toast.error('Failed to process receipt. Please try again.');
      console.error('Receipt processing error:', error);
    }

    clearInterval(progressInterval);
  };

  const handleConfirmData = () => {
    if (extractedData && onDataExtracted) {
      onDataExtracted({
        ...extractedData,
        confidence,
        originalFile: selectedFile
      });
    }
    handleReset();
  };

  const handleReset = () => {
    setSelectedFile(null);
    setPreview(null);
    setIsProcessing(false);
    setProcessingProgress(0);
    setExtractedData(null);
    setConfidence(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
    if (cameraInputRef.current) cameraInputRef.current.value = '';
  };

  const getConfidenceColor = (confidence) => {
    if (confidence >= 90) return "bg-green-500";
    if (confidence >= 75) return "bg-yellow-500";
    return "bg-red-500";
  };

  const getConfidenceText = (confidence) => {
    if (confidence >= 90) return "Excellent";
    if (confidence >= 75) return "Good";
    return "Review Required";
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold">Receipt Scanner</h2>
          <p className="text-sm text-muted-foreground">
            Take a photo or upload an image of your receipt
          </p>
        </div>
        {onClose && (
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Upload Section */}
      {!selectedFile && (
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              {/* Mobile-First Upload Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Camera Button - Prioritized for mobile */}
                <Button
                  variant="outline"
                  size="lg"
                  className="h-24 flex flex-col gap-2"
                  onClick={() => cameraInputRef.current?.click()}
                >
                  <Camera className="h-8 w-8" />
                  <div className="text-center">
                    <div className="font-medium">Take Photo</div>
                    <div className="text-xs text-muted-foreground">
                      <Smartphone className="inline h-3 w-3 mr-1" />
                      Recommended for mobile
                    </div>
                  </div>
                </Button>

                {/* File Upload Button */}
                <Button
                  variant="outline"
                  size="lg"
                  className="h-24 flex flex-col gap-2"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload className="h-8 w-8" />
                  <div className="text-center">
                    <div className="font-medium">Upload File</div>
                    <div className="text-xs text-muted-foreground">
                      <FileImage className="inline h-3 w-3 mr-1" />
                      JPG, PNG up to 10MB
                    </div>
                  </div>
                </Button>
              </div>

              {/* Hidden File Inputs */}
              <input
                ref={cameraInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                className="hidden"
                onChange={(e) => handleFileSelect(e.target.files?.[0])}
              />
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => handleFileSelect(e.target.files?.[0])}
              />

              {/* Tips for mobile users */}
              <div className="sm:hidden bg-blue-50 dark:bg-blue-950/20 p-4 rounded-lg">
                <div className="flex items-start gap-2">
                  <Camera className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div className="text-sm">
                    <div className="font-medium text-blue-900 dark:text-blue-100">
                      Tips for best results:
                    </div>
                    <ul className="text-blue-700 dark:text-blue-300 mt-1 space-y-1 text-xs">
                      <li>• Ensure good lighting</li>
                      <li>• Keep receipt flat and fully visible</li>
                      <li>• Avoid shadows and reflections</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Preview and Processing */}
      {selectedFile && (
        <div className="space-y-4">
          {/* Image Preview */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <CardTitle className="text-lg">Receipt Preview</CardTitle>
              <Button variant="ghost" size="sm" onClick={handleReset}>
                <X className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent>
              <div className="relative">
                <img
                  src={preview}
                  alt="Receipt preview"
                  className="w-full max-h-64 sm:max-h-96 object-contain rounded-lg border bg-muted"
                />
                {isProcessing && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-lg">
                    <div className="text-center text-white">
                      <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2" />
                      <p className="text-sm">Processing receipt...</p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Processing Progress */}
          {isProcessing && (
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span className="text-sm font-medium">
                      Extracting data from receipt...
                    </span>
                  </div>
                  <Progress value={processingProgress} className="h-2" />
                  <p className="text-xs text-muted-foreground">
                    This usually takes 5-10 seconds
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Process Button */}
          {!isProcessing && !extractedData && (
            <Button onClick={processReceipt} size="lg" className="w-full">
              <Camera className="mr-2 h-4 w-4" />
              Process Receipt
            </Button>
          )}

          {/* Extracted Data */}
          {extractedData && (
            <Card>
              <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <CardTitle className="text-lg">Extracted Data</CardTitle>
                  <div className="flex items-center gap-2">
                    <Badge 
                      variant="secondary" 
                      className={`${getConfidenceColor(confidence)} text-white`}
                    >
                      {confidence}% {getConfidenceText(confidence)}
                    </Badge>
                    {confidence < 85 && (
                      <AlertCircle className="h-4 w-4 text-yellow-500" />
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Amount
                    </label>
                    <p className="text-2xl font-bold">${extractedData.amount}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Merchant
                    </label>
                    <p className="font-medium">{extractedData.merchantName}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Date
                    </label>
                    <p className="font-medium">{extractedData.date}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Category
                    </label>
                    <Badge variant="outline" className="capitalize">
                      {extractedData.category.replace('_', ' ')}
                    </Badge>
                  </div>
                </div>

                {extractedData.items && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground mb-2 block">
                      Items
                    </label>
                    <div className="bg-muted/30 rounded-lg p-3 space-y-2 max-h-32 overflow-y-auto">
                      {extractedData.items.map((item, index) => (
                        <div key={index} className="flex justify-between text-sm">
                          <span className="truncate mr-2">{item.name}</span>
                          <span className="font-medium">${item.price}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex flex-col sm:flex-row gap-3 pt-4">
                  <Button variant="outline" onClick={handleReset} className="flex-1">
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Scan Another
                  </Button>
                  <Button onClick={handleConfirmData} className="flex-1">
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Use This Data
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}
