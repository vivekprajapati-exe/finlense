"use client";

import { useState, useEffect, useMemo } from "react";
import {
  ChevronDown,
  ChevronUp,
  MoreHorizontal,
  Trash,
  Search,
  X,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  Clock,
} from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { categoryColors } from "@/data/categories";
import { bulkDeleteTransactions } from "@/actions/account";
import useFetch from "@/hooks/use-fetch";
import { BarLoader } from "react-spinners";
import { useRouter } from "next/navigation";

const ITEMS_PER_PAGE = 10;

const RECURRING_INTERVALS = {
  DAILY: "Daily",
  WEEKLY: "Weekly",
  MONTHLY: "Monthly",
  YEARLY: "Yearly",
};

export function TransactionTable({ transactions }) {

  const router = useRouter();
  const [selectedIds, setSelectedIds] = useState([]);
  const [sortConfig, setSortConfig] = useState({
    field: "date",
    direction: "desc",
  });



  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [recurringFilter, setRecurringFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);



  // Memoized filtered and sorted transactions
  const filteredAndSortedTransactions = useMemo(() => {
    let result = [...transactions];

    // Apply search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      result = result.filter((transaction) =>
        transaction.description?.toLowerCase().includes(searchLower)
      );
    }

    // Apply type filter
    if (typeFilter) {
      result = result.filter((transaction) => transaction.type === typeFilter);
    }

    // Apply recurring filter
    if (recurringFilter) {
      result = result.filter((transaction) => {
        if (recurringFilter === "recurring") return transaction.isRecurring;
        return !transaction.isRecurring;
      });
    }

    // Apply sorting
    result.sort((a, b) => {
      let comparison = 0;

      switch (sortConfig.field) {
        case "date":
          comparison = new Date(a.date) - new Date(b.date);
          break;
        case "amount":
          comparison = a.amount - b.amount;
          break;
        case "category":
          comparison = a.category.localeCompare(b.category);
          break;
        default:
          comparison = 0;
      }

      return sortConfig.direction === "asc" ? comparison : -comparison;
    });

    return result;
  }, [transactions, searchTerm, typeFilter, recurringFilter, sortConfig]);



  // Pagination calculations
  const totalPages = Math.ceil(
    filteredAndSortedTransactions.length / ITEMS_PER_PAGE
  );
  const paginatedTransactions = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredAndSortedTransactions.slice(
      startIndex,
      startIndex + ITEMS_PER_PAGE
    );
  }, [filteredAndSortedTransactions, currentPage]);

  const handleSort = (field) => {
    setSortConfig((current) => ({
      field,
      direction:
        current.field === field && current.direction === "asc" ? "desc" : "asc",
    }));
  };

  const handleSelect = (id) => {
    setSelectedIds((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id]
    );
  };

  const handleSelectAll = () => {
    setSelectedIds((current) =>
      current.length === paginatedTransactions.length
        ? []
        : paginatedTransactions.map((t) => t.id)
    );
  };

  const {
    loading: deleteLoading,
    fn: deleteFn,
    data: deleted,
  } = useFetch(bulkDeleteTransactions);

  const handleBulkDelete = async () => {
    if (
      !window.confirm(
        `Are you sure you want to delete ${selectedIds.length} transactions?`
      )
    ){
      return;
    }
    deleteFn(selectedIds);
  };

  useEffect(() => {
    if (deleted?.success && !deleteLoading) {
      toast.success("Transactions deleted successfully");
      setSelectedIds([]);
    }
  }, [deleted, deleteLoading]);

  const handleClearFilters = () => {
    setSearchTerm("");
    setTypeFilter("");
    setRecurringFilter("");
    setCurrentPage(1);
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    setSelectedIds([]); // Clear selections on page change
  };



  return (
    <div className="space-y-4">
      {deleteLoading && (
        <BarLoader className="mt-4" width={"100%"} color="#9333ea" />
      )}
      {/* Filters - Mobile Optimized */}
      <div className="flex flex-col space-y-4">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search transactions..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="pl-8"
          />
        </div>
        
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
          <div className="flex gap-2 flex-1">
            <Select
              value={typeFilter}
              onValueChange={(value) => {
                setTypeFilter(value);
                setCurrentPage(1);
              }}
            >
              <SelectTrigger className="w-full sm:w-[130px]">
                <SelectValue placeholder="All Types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="INCOME">Income</SelectItem>
                <SelectItem value="EXPENSE">Expense</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={recurringFilter}
              onValueChange={(value) => {
                setRecurringFilter(value);
                setCurrentPage(1);
              }}
            >
              <SelectTrigger className="w-full sm:w-[130px]">
                <SelectValue placeholder="All Transactions" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="recurring">Recurring Only</SelectItem>
                <SelectItem value="non-recurring">Non-recurring Only</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-2">
            {/* Bulk Actions */}

            {selectedIds.length > 0 && (
              <Button
                variant="destructive"
                size="sm"
                onClick={handleBulkDelete}
                className="flex-1 sm:flex-initial"
              >
                <Trash className="h-4 w-4 mr-2" />
                Delete ({selectedIds.length})
              </Button>

            )}

            {(searchTerm || typeFilter || recurringFilter) && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleClearFilters}
                title="Clear filters"
                className="px-3"
              >
                <X className="h-4 w-4" />
                <span className="hidden sm:inline ml-2">Clear</span>
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Transactions Table - Mobile Responsive */}
      <div className="rounded-md border overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[40px] sm:w-[50px]">
                  <Checkbox
                    checked={
                      selectedIds.length === paginatedTransactions.length &&
                      paginatedTransactions.length > 0
                    }
                    onCheckedChange={handleSelectAll}
                  />
                </TableHead>
                <TableHead
                  className="cursor-pointer min-w-[100px]"
                  onClick={() => handleSort("date")}
                >
                  <div className="flex items-center">
                    Date
                    {sortConfig.field === "date" &&
                      (sortConfig.direction === "asc" ? (
                        <ChevronUp className="ml-1 h-4 w-4" />
                      ) : (
                        <ChevronDown className="ml-1 h-4 w-4" />
                      ))}
                  </div>
                </TableHead>
                <TableHead className="min-w-[120px]">Description</TableHead>
                <TableHead
                  className="cursor-pointer min-w-[100px]"
                  onClick={() => handleSort("category")}
                >
                  <div className="flex items-center">
                    Category
                    {sortConfig.field === "category" &&
                      (sortConfig.direction === "asc" ? (
                        <ChevronUp className="ml-1 h-4 w-4" />
                      ) : (
                        <ChevronDown className="ml-1 h-4 w-4" />
                      ))}
                  </div>
                </TableHead>
                <TableHead
                  className="cursor-pointer text-right min-w-[80px]"
                  onClick={() => handleSort("amount")}
                >
                  <div className="flex items-center justify-end">
                    Amount
                    {sortConfig.field === "amount" &&
                      (sortConfig.direction === "asc" ? (
                        <ChevronUp className="ml-1 h-4 w-4" />
                      ) : (
                        <ChevronDown className="ml-1 h-4 w-4" />
                      ))}
                  </div>
                </TableHead>
                <TableHead className="hidden sm:table-cell min-w-[100px]">Recurring</TableHead>
                <TableHead className="w-[40px] sm:w-[50px]" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedTransactions.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="text-center text-muted-foreground py-8"
                  >
                    No transactions found
                  </TableCell>
                </TableRow>
              ) : (
                paginatedTransactions.map((transaction) => (
                  <TableRow key={transaction.id} className="hover:bg-muted/50">
                    <TableCell>
                      <Checkbox
                        checked={selectedIds.includes(transaction.id)}
                        onCheckedChange={() => handleSelect(transaction.id)}
                      />
                    </TableCell>
                    <TableCell className="text-xs sm:text-sm">
                      {format(new Date(transaction.date), "MMM dd")}
                      <div className="text-xs text-muted-foreground sm:hidden">
                        {format(new Date(transaction.date), "yyyy")}
                      </div>
                    </TableCell>
                    <TableCell className="text-xs sm:text-sm">
                      <div className="truncate max-w-[120px] sm:max-w-none" title={transaction.description}>
                        {transaction.description}
                      </div>
                    </TableCell>
                    <TableCell className="capitalize text-xs sm:text-sm">
                      <span
                        style={{
                          background: categoryColors[transaction.category],
                        }}
                        className="px-1.5 py-0.5 sm:px-2 sm:py-1 rounded text-white text-xs"
                      >
                        {transaction.category}
                      </span>
                    </TableCell>
                    <TableCell
                      className={cn(
                        "text-right font-medium text-xs sm:text-sm",
                        transaction.type === "EXPENSE"
                          ? "text-red-500"
                          : "text-green-500"
                      )}
                    >
                      {transaction.type === "EXPENSE" ? "-" : "+"}$
                      {transaction.amount.toFixed(2)}
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                      {transaction.isRecurring ? (
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger>
                              <Badge
                                variant="secondary"
                                className="gap-1 bg-purple-100 text-purple-700 hover:bg-purple-200 text-xs"
                              >
                                <RefreshCw className="h-3 w-3" />
                                <span className="hidden sm:inline">
                                  {RECURRING_INTERVALS[transaction.recurringInterval]}
                                </span>
                              </Badge>
                            </TooltipTrigger>
                            <TooltipContent>
                              <div className="text-sm">
                                <div className="font-medium">Next Date:</div>
                                <div>
                                  {format(
                                    new Date(transaction.nextRecurringDate),
                                    "PPP"
                                  )}
                                </div>
                              </div>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      ) : (
                        <Badge variant="outline" className="gap-1 text-xs">
                          <Clock className="h-3 w-3" />
                          <span className="hidden sm:inline">One-time</span>
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-6 w-6 sm:h-8 sm:w-8 p-0">
                            <MoreHorizontal className="h-3 w-3 sm:h-4 sm:w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() =>
                              router.push(
                                `/transaction/create?edit=${transaction.id}`
                              )
                            }
                          >
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="text-destructive"
                            onClick={() => deleteFn([transaction.id])}
                          >
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Mobile Transaction Info - Only show recurring info on mobile */}
      <div className="sm:hidden space-y-2">
        {paginatedTransactions.filter(t => t.isRecurring).length > 0 && (
          <div className="text-xs text-muted-foreground">
            <span className="font-medium">Recurring Transactions:</span>
            <div className="flex flex-wrap gap-1 mt-1">
              {paginatedTransactions
                .filter(t => t.isRecurring)
                .map((transaction) => (
                  <Badge
                    key={transaction.id}
                    variant="secondary"
                    className="text-xs bg-purple-100 text-purple-700"
                  >
                    {transaction.description} - {RECURRING_INTERVALS[transaction.recurringInterval]}
                  </Badge>
                ))}
            </div>
          </div>
        )}
      </div>

      {/* Pagination - Mobile Optimized */}
      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="h-8 w-8 p-0 sm:h-9 sm:w-9"
            >
              <ChevronLeft className="h-3 w-3 sm:h-4 sm:w-4" />
            </Button>
            
            <div className="flex items-center gap-1">
              <span className="text-xs sm:text-sm font-medium">
                Page {currentPage} of {totalPages}
              </span>
            </div>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="h-8 w-8 p-0 sm:h-9 sm:w-9"
            >
              <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4" />
            </Button>
          </div>
          
          <div className="text-xs sm:text-sm text-muted-foreground">
            Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1} to {Math.min(currentPage * ITEMS_PER_PAGE, filteredAndSortedTransactions.length)} of {filteredAndSortedTransactions.length} transactions
          </div>
        </div>
      )}
    </div>
  );
}