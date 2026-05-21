"use client";

import { useState, useEffect, useCallback, Fragment } from "react";
import { Search, Mail, Download, Loader2, ChevronRight, MapPin, Calendar, CreditCard, AlertCircle, AlertTriangle, CheckCircle2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useCurrency } from "@/components/store/currency-context";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

type CustomerInfo = {
  id: string;
  name: string | null;
  email: string;
};

type ProductShortInfo = {
  name: string;
  images: { url: string }[];
};

type OrderShortInfo = {
  id: string;
  createdAt: string;
  totalAmount: number;
  paymentMethod: string;
  user: CustomerInfo | null;
  orderItems: {
    id: string;
    quantity: number;
    price: number;
    product: ProductShortInfo;
  }[];
};

type Payment = {
  id: string;
  amount: number;
  dueDate: string;
  paidDate: string | null;
  status: "PENDING" | "PAID" | "OVERDUE";
};

type InstalmentPlan = {
  id: string;
  orderId: string;
  totalAmount: number;
  paidAmount: number;
  tenureMonths: number;
  interestRate: number;
  status: "ACTIVE" | "COMPLETED" | "DEFAULTED";
  createdAt: string;
  order: OrderShortInfo;
  payments: Payment[];
};

const getDownloadTimestamp = () => Date.now();

export function InstalmentManagement() {
  const { formatPrice } = useCurrency();
  const [plans, setPlans] = useState<InstalmentPlan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedPlanId, setExpandedPlanId] = useState<string | null>(null);
  const [processingPaymentId, setProcessingPaymentId] = useState<string | null>(null);

  const fetchPlans = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/admin/instalments");
      if (res.ok) {
        const data = await res.json();
        setPlans(data);
      } else {
        toast.error("Failed to load instalment plans from server.");
      }
    } catch (e) {
      console.error(e);
      toast.error("An error occurred while fetching instalment plans.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPlans();
  }, [fetchPlans]);

  // Record manual payment administrative action
  const handleTogglePaymentStatus = async (paymentId: string, currentStatus: string) => {
    setProcessingPaymentId(paymentId);
    const newStatus = currentStatus === "PAID" ? "PENDING" : "PAID";
    
    try {
      const res = await fetch("/api/admin/instalments", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ paymentId, status: newStatus }),
      });

      if (res.ok) {
        const updatedPlan: InstalmentPlan = await res.json();
        toast.success(
          newStatus === "PAID" 
            ? "Payment successfully recorded as PAID!" 
            : "Payment rolled back to PENDING!"
        );
        // Sync local React state
        setPlans(prev => prev.map(p => p.id === updatedPlan.id ? updatedPlan : p));
      } else {
        const err = await res.json();
        toast.error(err.error || "Failed to update payment status.");
      }
    } catch (e) {
      console.error(e);
      toast.error("Network or server connection failed.");
    } finally {
      setProcessingPaymentId(null);
    }
  };

  const handleExportCSV = () => {
    if (plans.length === 0) return toast.error("No instalment plans to export.");

    const filtered = getFilteredPlans();
    if (filtered.length === 0) return toast.error("No matching records found to export.");

    const headers = ["Plan ID", "Order ID", "Customer", "Customer Email", "Total Amount", "Paid Amount", "Remaining", "Tenure (Months)", "Plan Status"];
    const rows = filtered.map(p => [
      p.id,
      p.orderId,
      p.order.user?.name || "Guest Customer",
      p.order.user?.email || "",
      p.totalAmount,
      p.paidAmount,
      p.totalAmount - p.paidAmount,
      p.tenureMonths,
      p.status
    ]);

    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(","), ...rows.map(e => e.map(val => `"${val}"`).join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `lumen_instalments_${activeTab}_${getDownloadTimestamp()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("CSV ledger downloaded successfully!");
  };

  // Helper date checker for due soon and overdue calculations
  const getDaysDiff = (dateStr: string) => {
    const dueDate = new Date(dateStr);
    const today = new Date();
    // Reset hours to compare purely by days
    dueDate.setHours(0,0,0,0);
    today.setHours(0,0,0,0);
    const diffTime = dueDate.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  // Dynamic KPI calculations
  const kpis = {
    activePlans: plans.filter(p => p.status === "ACTIVE").length,
    overdueCount: plans.reduce((acc, p) => {
      const hasOverdue = p.payments.some(pay => pay.status !== "PAID" && getDaysDiff(pay.dueDate) < 0);
      return acc + (hasOverdue ? 1 : 0);
    }, 0),
    dueSoonCount: plans.reduce((acc, p) => {
      const hasDueSoon = p.payments.some(pay => {
        const diff = getDaysDiff(pay.dueDate);
        return pay.status !== "PAID" && diff >= 0 && diff <= 7;
      });
      return acc + (hasDueSoon ? 1 : 0);
    }, 0),
    expectedRevenue30Days: plans.reduce((acc, p) => {
      // Sum pending payments due within next 30 days
      const pendingSum = p.payments
        .filter(pay => pay.status !== "PAID" && getDaysDiff(pay.dueDate) >= -30 && getDaysDiff(pay.dueDate) <= 30)
        .reduce((s, pay) => s + pay.amount, 0);
      return acc + pendingSum;
    }, 0),
  };

  const getFilteredPlans = () => {
    return plans.filter(p => {
      // Search match
      if (searchTerm.trim() !== "") {
        const term = searchTerm.toLowerCase();
        const planId = p.id.toLowerCase();
        const orderId = p.orderId.toLowerCase();
        const customerName = (p.order.user?.name || "").toLowerCase();
        const customerEmail = (p.order.user?.email || "").toLowerCase();
        if (
          !planId.includes(term) &&
          !orderId.includes(term) &&
          !customerName.includes(term) &&
          !customerEmail.includes(term)
        ) {
          return false;
        }
      }

      // Tab filter match
      if (activeTab === "all") return true;
      if (activeTab === "completed") return p.status === "COMPLETED";
      if (activeTab === "overdue") {
        return p.payments.some(pay => pay.status !== "PAID" && getDaysDiff(pay.dueDate) < 0);
      }
      if (activeTab === "due_soon") {
        return p.payments.some(pay => {
          const diff = getDaysDiff(pay.dueDate);
          return pay.status !== "PAID" && diff >= 0 && diff <= 7;
        });
      }
      return true;
    });
  };

  const getTabCount = (tabId: string) => {
    if (tabId === "all") return plans.length;
    if (tabId === "completed") return plans.filter(p => p.status === "COMPLETED").length;
    if (tabId === "overdue") {
      return plans.filter(p => p.payments.some(pay => pay.status !== "PAID" && getDaysDiff(pay.dueDate) < 0)).length;
    }
    if (tabId === "due_soon") {
      return plans.filter(p => p.payments.some(pay => {
        const diff = getDaysDiff(pay.dueDate);
        return pay.status !== "PAID" && diff >= 0 && diff <= 7;
      })).length;
    }
    return 0;
  };

  const filteredPlans = getFilteredPlans();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-heading text-foreground tracking-tight">Instalment Plans (EMI)</h1>
          <p className="text-sm text-muted-foreground mt-1">Audit customer instalment plans, check overdue balances, and manually log verified bank transactions.</p>
        </div>
        <button
          onClick={handleExportCSV}
          className="rounded-none bg-foreground text-background px-4 py-2 text-sm font-semibold tracking-wide hover:bg-neutral-800 transition-all flex items-center gap-2"
        >
          <Download className="w-4 h-4" /> Export Report
        </button>
      </div>

      {/* Dynamic KPI Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white border border-border p-4 rounded-none shadow-sm">
          <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider mb-1">Active Plans</p>
          <p className="text-2xl font-heading text-foreground">{isLoading ? "..." : kpis.activePlans}</p>
        </div>
        <div className="bg-white border border-border p-4 rounded-none shadow-sm">
          <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider mb-1">Expected Inflow (30 Days)</p>
          <p className="text-2xl font-heading text-foreground">{isLoading ? "..." : formatPrice(kpis.expectedRevenue30Days)}</p>
        </div>
        <div className="bg-amber-50/50 border border-amber-200 p-4 rounded-none shadow-sm">
          <p className="text-xs text-amber-800 font-semibold uppercase tracking-wider mb-1 flex items-center gap-2">
            <AlertCircle className="w-4 h-4" /> Due Soon (7 Days)
          </p>
          <p className="text-2xl font-heading text-amber-900">{isLoading ? "..." : kpis.dueSoonCount}</p>
        </div>
        <div className="bg-red-50/50 border border-red-200 p-4 rounded-none shadow-sm">
          <p className="text-xs text-red-800 font-semibold uppercase tracking-wider mb-1 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 animate-pulse" /> Overdue Plans
          </p>
          <p className="text-2xl font-heading text-red-900">{isLoading ? "..." : kpis.overdueCount}</p>
        </div>
      </div>

      <div className="bg-card border border-border rounded-none shadow-sm overflow-hidden">
        <div className="p-4 border-b border-border flex flex-col md:flex-row justify-between items-center gap-4 bg-neutral-50/50">
          <div className="flex gap-2 w-full md:w-auto overflow-x-auto hide-scrollbar">
            {[
              { id: "all", label: "All Plans" },
              { id: "due_soon", label: "Due Soon" },
              { id: "overdue", label: "Overdue" },
              { id: "completed", label: "Completed" },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 text-sm font-semibold rounded-none border-b-2 transition-all whitespace-nowrap capitalize ${
                  activeTab === tab.id
                    ? "border-foreground text-foreground bg-white"
                    : "border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/50"
                }`}
              >
                {tab.label} <span className="text-xs ml-1 opacity-70 font-normal">({isLoading ? "0" : getTabCount(tab.id)})</span>
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto">
            <div className="relative flex-1 md:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search plan ID, order ID, customer name..."
                className="pl-9 h-10 text-sm rounded-none border-border bg-white"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3 text-muted-foreground">
            <Loader2 className="w-8 h-8 animate-spin text-foreground" />
            <p className="text-sm">Loading instalment plans from ledger...</p>
          </div>
        ) : filteredPlans.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground">
            <p className="text-base font-medium">No instalment plans found</p>
            <p className="text-sm mt-1">Try tweaking your search keywords or filter category.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left border-collapse">
              <thead className="text-xs text-muted-foreground uppercase tracking-widest bg-neutral-50 border-b border-border">
                <tr>
                  <th className="px-6 py-4 font-semibold">Plan ID / Order</th>
                  <th className="px-6 py-4 font-semibold">Customer</th>
                  <th className="px-6 py-4 font-semibold">Installments Progress</th>
                  <th className="px-6 py-4 font-semibold">Plan Status</th>
                  <th className="px-6 py-4 font-semibold text-right">Remaining Balance</th>
                  <th className="px-6 py-4 font-semibold text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredPlans.map(plan => {
                  const isExpanded = expandedPlanId === plan.id;
                  const remaining = plan.totalAmount - plan.paidAmount;
                  const progressPct = (plan.paidAmount / plan.totalAmount) * 100;
                  
                  // Compute simple status flag
                  const hasOverdue = plan.payments.some(pay => pay.status !== "PAID" && getDaysDiff(pay.dueDate) < 0);
                  const hasDueSoon = plan.payments.some(pay => {
                    const diff = getDaysDiff(pay.dueDate);
                    return pay.status !== "PAID" && diff >= 0 && diff <= 7;
                  });

                  let nextPaymentInfo = "";
                  if (plan.status === "ACTIVE") {
                    const nextUnpaid = plan.payments.find(pay => pay.status !== "PAID");
                    if (nextUnpaid) {
                      const days = getDaysDiff(nextUnpaid.dueDate);
                      if (days < 0) {
                        nextPaymentInfo = `${Math.abs(days)} days OVERDUE`;
                      } else {
                        nextPaymentInfo = `Next installment in ${days} days`;
                      }
                    }
                  }

                  return (
                    <Fragment key={plan.id}>
                      <tr
                        className={`hover:bg-neutral-50/50 transition-colors cursor-pointer border-b border-border ${
                          isExpanded ? "bg-neutral-50/20" : ""
                        }`}
                        onClick={() => setExpandedPlanId(isExpanded ? null : plan.id)}
                      >
                        <td className="px-6 py-4">
                          <p className="font-semibold text-foreground text-sm font-mono">{plan.id.slice(0, 13).toUpperCase()}</p>
                          <p className="text-xs text-muted-foreground mt-0.5 font-mono">ORD-{plan.orderId.slice(0, 8).toUpperCase()}</p>
                        </td>
                        <td className="px-6 py-4 font-semibold">
                          {plan.order.user?.name || "Guest Customer"}
                          <span className="block text-xs font-normal text-muted-foreground font-mono mt-0.5">{plan.order.user?.email || "No email"}</span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="w-56">
                            <div className="flex justify-between text-[11px] mb-1.5 font-mono">
                              <span className="text-neutral-500 font-semibold">{formatPrice(plan.paidAmount)} paid</span>
                              <span className="font-semibold text-neutral-800">{formatPrice(plan.totalAmount)}</span>
                            </div>
                            <div className="w-full bg-neutral-100 h-2 border border-neutral-200 overflow-hidden">
                              <div
                                className={`h-full transition-all duration-300 ${
                                  plan.status === "COMPLETED"
                                    ? "bg-emerald-600"
                                    : hasOverdue
                                    ? "bg-rose-600"
                                    : "bg-neutral-900"
                                }`}
                                style={{ width: `${progressPct}%` }}
                              />
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          {plan.status === "COMPLETED" ? (
                            <Badge className="bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-none uppercase font-bold tracking-widest text-[9px] px-2 py-0.5">
                              <CheckCircle2 className="w-3 h-3 mr-1" /> COMPLETED
                            </Badge>
                          ) : hasOverdue ? (
                            <div>
                              <Badge variant="destructive" className="rounded-none uppercase font-bold tracking-widest text-[9px] px-2 py-0.5">
                                OVERDUE
                              </Badge>
                              <p className="text-[10px] text-rose-600 font-bold mt-1 font-mono">{nextPaymentInfo}</p>
                            </div>
                          ) : hasDueSoon ? (
                            <div>
                              <Badge className="bg-amber-50 text-amber-800 border border-amber-200 rounded-none uppercase font-bold tracking-widest text-[9px] px-2 py-0.5">
                                DUE SOON
                              </Badge>
                              <p className="text-[10px] text-amber-700 font-semibold mt-1 font-mono">{nextPaymentInfo}</p>
                            </div>
                          ) : (
                            <div>
                              <Badge className="bg-blue-50 text-blue-800 border border-blue-200 rounded-none uppercase font-bold tracking-widest text-[9px] px-2 py-0.5">
                                ACTIVE
                              </Badge>
                              <p className="text-[10px] text-muted-foreground font-medium mt-1 font-mono">{nextPaymentInfo}</p>
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4 text-right font-semibold text-sm">
                          {formatPrice(remaining)}
                        </td>
                        <td className="px-6 py-4 text-center">
                          <button
                            className="p-1.5 text-muted-foreground hover:text-foreground transition-all hover:bg-neutral-100"
                            onClick={(e) => {
                              e.stopPropagation();
                              setExpandedPlanId(isExpanded ? null : plan.id);
                            }}
                          >
                            <ChevronRight
                              className={`w-4 h-4 transition-transform duration-200 ${
                                isExpanded ? "rotate-90 text-foreground" : ""
                              }`}
                            />
                          </button>
                        </td>
                      </tr>

                      {/* Chronological Payment Schedule Detail Accordion */}
                      <tr>
                        <td colSpan={6} className="p-0 border-none">
                          <AnimatePresence initial={false}>
                            {isExpanded && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.25, ease: "easeInOut" }}
                                className="overflow-hidden bg-neutral-50/30 border-b border-border"
                              >
                                <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
                                  {/* Payment Tenure Plan Metadata */}
                                  <div className="space-y-4 bg-white border border-border p-4 h-fit">
                                    <h3 className="text-xs uppercase tracking-widest font-bold text-foreground border-b pb-2 flex items-center gap-2">
                                      <CreditCard className="w-3.5 h-3.5" /> EMI Tenure Plan Details
                                    </h3>
                                    <div className="space-y-2.5 text-sm font-mono text-neutral-700">
                                      <p className="flex justify-between">
                                        <span className="text-muted-foreground font-sans">Tenure Duration:</span>
                                        <span className="font-bold">{plan.tenureMonths} Months</span>
                                      </p>
                                      <p className="flex justify-between">
                                        <span className="text-muted-foreground font-sans">Interest Rate:</span>
                                        <span className="font-bold">{plan.interestRate}% P.A.</span>
                                      </p>
                                      <p className="flex justify-between">
                                        <span className="text-muted-foreground font-sans">Total Repayment:</span>
                                        <span className="font-bold text-neutral-900">{formatPrice(plan.totalAmount)}</span>
                                      </p>
                                      <p className="flex justify-between">
                                        <span className="text-muted-foreground font-sans">Cleared Amount:</span>
                                        <span className="font-bold text-emerald-600">{formatPrice(plan.paidAmount)}</span>
                                      </p>
                                      <p className="flex justify-between border-t pt-2">
                                        <span className="text-muted-foreground font-sans">Outstanding:</span>
                                        <span className="font-bold text-rose-600">{formatPrice(remaining)}</span>
                                      </p>
                                    </div>
                                  </div>

                                  {/* Payment Schedule List Table */}
                                  <div className="space-y-4 bg-white border border-border p-4 lg:col-span-2">
                                    <h3 className="text-xs uppercase tracking-widest font-bold text-foreground border-b pb-2 flex items-center gap-2">
                                      <Calendar className="w-3.5 h-3.5" /> Chronological Installment Schedule
                                    </h3>
                                    <div className="overflow-x-auto">
                                      <table className="w-full text-xs text-left border-collapse">
                                        <thead className="bg-neutral-50 text-muted-foreground uppercase font-bold tracking-wider border-b border-border">
                                          <tr>
                                            <th className="px-4 py-2 text-center">Inst. #</th>
                                            <th className="px-4 py-2 text-right">Amount</th>
                                            <th className="px-4 py-2">Due Date</th>
                                            <th className="px-4 py-2 text-center">Payment Status</th>
                                            <th className="px-4 py-2">Paid On</th>
                                            <th className="px-4 py-2 text-center">Action</th>
                                          </tr>
                                        </thead>
                                        <tbody className="divide-y divide-border">
                                          {plan.payments.map((payment, index) => {
                                            const isProcessing = processingPaymentId === payment.id;
                                            const daysLeft = getDaysDiff(payment.dueDate);
                                            
                                            return (
                                              <tr key={payment.id} className="hover:bg-neutral-50/40">
                                                <td className="px-4 py-3 text-center font-bold text-neutral-500 font-mono">
                                                  #{index + 1}
                                                </td>
                                                <td className="px-4 py-3 text-right font-bold font-mono">
                                                  {formatPrice(payment.amount)}
                                                </td>
                                                <td className="px-4 py-3 font-mono text-muted-foreground">
                                                  {new Date(payment.dueDate).toLocaleDateString()}
                                                  {payment.status !== "PAID" && (
                                                    <span className={`block text-[9px] font-sans font-bold uppercase mt-0.5 ${
                                                      daysLeft < 0 ? "text-rose-600" : "text-amber-700"
                                                    }`}>
                                                      {daysLeft < 0 ? `${Math.abs(daysLeft)}d late` : `in ${daysLeft}d`}
                                                    </span>
                                                  )}
                                                </td>
                                                <td className="px-4 py-3 text-center">
                                                  <Badge
                                                    className={`rounded-none font-bold uppercase text-[9px] border tracking-wider px-1.5 py-0.2 ${
                                                      payment.status === "PAID"
                                                        ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                                                        : daysLeft < 0
                                                        ? "bg-rose-50 text-rose-800 border-rose-200"
                                                        : "bg-neutral-50 text-neutral-700 border-neutral-200"
                                                    }`}
                                                  >
                                                    {payment.status === "PAID" ? "PAID" : daysLeft < 0 ? "OVERDUE" : "PENDING"}
                                                  </Badge>
                                                </td>
                                                <td className="px-4 py-3 font-mono text-muted-foreground">
                                                  {payment.paidDate ? new Date(payment.paidDate).toLocaleString() : "-"}
                                                </td>
                                                <td className="px-4 py-3 text-center">
                                                  <button
                                                    onClick={() => handleTogglePaymentStatus(payment.id, payment.status)}
                                                    disabled={isProcessing}
                                                    className={`px-2 py-1 text-[10px] rounded-none border font-bold uppercase tracking-wide transition-all inline-flex items-center gap-1 ${
                                                      payment.status === "PAID"
                                                        ? "border-red-200 text-red-700 bg-red-50 hover:bg-red-100 hover:text-red-800"
                                                        : "border-emerald-200 text-emerald-700 bg-emerald-50 hover:bg-emerald-100 hover:text-emerald-800"
                                                    } disabled:opacity-50`}
                                                  >
                                                    {isProcessing ? (
                                                      <Loader2 className="w-3 h-3 animate-spin" />
                                                    ) : payment.status === "PAID" ? (
                                                      "Unpay"
                                                    ) : (
                                                      "Record Pay"
                                                    )}
                                                  </button>
                                                </td>
                                              </tr>
                                            );
                                          })}
                                        </tbody>
                                      </table>
                                    </div>
                                  </div>
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </td>
                      </tr>
                    </Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
