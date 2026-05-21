"use client";

import { useState, useEffect, useCallback } from "react";
import { Search, Filter, Eye, Download, Loader2, ChevronRight, Mail, MapPin, CreditCard, ShoppingBag, Calendar } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useCurrency } from "@/components/store/currency-context";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

type AdminOrder = {
  id: string;
  createdAt: string;
  status: string; // PENDING, PROCESSING, SHIPPED, DELIVERED, CANCELLED
  totalAmount: number;
  paymentMethod: string; // FULL_PAYMENT, INSTALMENT
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  } | null;
  user?: {
    id: string;
    name: string | null;
    email: string;
  } | null;
  guestEmail?: string | null;
  orderItems: {
    id: string;
    quantity: number;
    price: number;
    product: {
      name: string;
      images: { url: string }[];
    };
  }[];
  instalmentPlan?: {
    id: string;
    status: string;
    paidAmount: number;
    totalAmount: number;
  } | null;
};

const STATUS_OPTIONS = ["PENDING", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"];

const STATUS_BADGE_CLASSES: Record<string, string> = {
  PENDING:    "bg-amber-50 text-amber-700 border-amber-200",
  PROCESSING: "bg-blue-50 text-blue-700 border-blue-200",
  SHIPPED:    "bg-violet-50 text-violet-700 border-violet-200",
  DELIVERED:  "bg-emerald-50 text-emerald-700 border-emerald-200",
  CANCELLED:  "bg-red-50 text-red-700 border-red-200",
};

function fmtDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function OrdersManagement() {
  const { formatPrice } = useCurrency();
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);
  const [updatingOrderId, setUpdatingOrderId] = useState<string | null>(null);

  const fetchOrders = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/admin/orders");
      if (res.ok) {
        const data = await res.json();
        setOrders(data);
      } else {
        toast.error("Failed to load orders from server.");
      }
    } catch (e) {
      console.error(e);
      toast.error("An error occurred while fetching orders.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    setUpdatingOrderId(orderId);
    try {
      const res = await fetch("/api/admin/orders", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId, status: newStatus }),
      });

      if (res.ok) {
        toast.success("Order status updated successfully!");
        setOrders(prev =>
          prev.map(o => (o.id === orderId ? { ...o, status: newStatus } : o))
        );
      } else {
        const err = await res.json();
        toast.error(err.error || "Failed to update status.");
      }
    } catch (e) {
      console.error(e);
      toast.error("Failed to connect to the server.");
    } finally {
      setUpdatingOrderId(null);
    }
  };

  const handleExportCSV = () => {
    if (orders.length === 0) return toast.error("No orders to export.");

    const filtered = orders.filter(order => {
      // tab filter
      if (activeTab !== "all" && order.status.toLowerCase() !== activeTab) return false;
      // search filter
      if (searchTerm.trim() !== "") {
        const term = searchTerm.toLowerCase();
        const customerName = order.user?.name?.toLowerCase() || "";
        const customerEmail = order.user?.email?.toLowerCase() || order.guestEmail?.toLowerCase() || "";
        const orderId = order.id.toLowerCase();
        if (
          !orderId.includes(term) &&
          !customerName.includes(term) &&
          !customerEmail.includes(term)
        ) {
          return false;
        }
      }
      return true;
    });

    if (filtered.length === 0) return toast.error("No matching orders found to export.");

    // Define CSV header and map rows
    const headers = ["Order ID", "Date", "Customer Name", "Customer Email", "Total Amount", "Payment Method", "Status"];
    const rows = filtered.map(o => [
      o.id.toUpperCase(),
      new Date(o.createdAt).toISOString(),
      o.user?.name || "Guest User",
      o.user?.email || o.guestEmail || "N/A",
      o.totalAmount,
      o.paymentMethod === "INSTALMENT" ? "EMI Plan" : "Full Payment",
      o.status,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map(e => e.map(val => `"${val}"`).join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `lumen_orders_export_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("CSV file exported successfully!");
  };

  // Filter list
  const filteredOrders = orders.filter(order => {
    if (activeTab !== "all" && order.status.toLowerCase() !== activeTab) return false;

    if (searchTerm.trim() !== "") {
      const term = searchTerm.toLowerCase();
      const customerName = order.user?.name?.toLowerCase() || "";
      const customerEmail = order.user?.email?.toLowerCase() || order.guestEmail?.toLowerCase() || "";
      const orderId = order.id.toLowerCase();
      if (
        !orderId.includes(term) &&
        !customerName.includes(term) &&
        !customerEmail.includes(term)
      ) {
        return false;
      }
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-heading text-foreground">Orders</h1>
          <p className="text-xs text-muted-foreground mt-0.5">Manage customer orders, track payments, and update delivery processes.</p>
        </div>
        <button
          onClick={handleExportCSV}
          className="bg-foreground text-background hover:bg-foreground/95 border border-border px-5 py-2.5 text-xs font-semibold rounded-none uppercase tracking-wider transition-all flex items-center gap-2"
        >
          <Download className="w-3.5 h-3.5" /> Export CSV
        </button>
      </div>

      <div className="bg-card border border-border rounded-none shadow-none">
        {/* Filter and Search Panel */}
        <div className="p-4 border-b border-border flex flex-col xl:flex-row justify-between items-center gap-4">
          <div className="flex gap-1 w-full xl:w-auto overflow-x-auto hide-scrollbar bg-muted/20 p-1 border border-border">
            {["all", "pending", "processing", "shipped", "delivered", "cancelled"].map(tab => {
              const count = tab === "all" ? orders.length : orders.filter(o => o.status.toLowerCase() === tab).length;
              return (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 text-xs font-medium uppercase tracking-wider rounded-none transition-all whitespace-nowrap ${
                    activeTab === tab
                      ? "bg-foreground text-background"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                >
                  {tab} ({count})
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-2 w-full xl:w-auto">
            <div className="relative flex-1 xl:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search by ID, name or email..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="pl-9 h-10 text-xs rounded-none border-border"
              />
            </div>
            <button
              onClick={fetchOrders}
              className="p-2.5 border border-border rounded-none text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              title="Refresh Orders"
            >
              <Filter className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Main Orders Table */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
            <p className="text-xs text-muted-foreground uppercase tracking-widest">Loading live order system...</p>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="border border-dashed border-border m-6 p-16 text-center space-y-3">
            <ShoppingBag className="w-10 h-10 text-muted-foreground/30 mx-auto" />
            <p className="text-sm text-muted-foreground">No orders matching the active filters found.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="text-[10px] text-muted-foreground uppercase tracking-wider bg-muted/30 border-b border-border">
                <tr>
                  <th className="px-6 py-4 font-semibold w-12"></th>
                  <th className="px-6 py-4 font-semibold">Order ID</th>
                  <th className="px-6 py-4 font-semibold">Date</th>
                  <th className="px-6 py-4 font-semibold">Customer</th>
                  <th className="px-6 py-4 font-semibold">Total</th>
                  <th className="px-6 py-4 font-semibold">Payment</th>
                  <th className="px-6 py-4 font-semibold">Status</th>
                  <th className="px-6 py-4 font-semibold text-right">Process Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredOrders.map(order => {
                  const isExpanded = expandedOrderId === order.id;
                  const customerName = order.user?.name || "Guest User";
                  const customerEmail = order.user?.email || order.guestEmail || "N/A";
                  const itemsCount = order.orderItems.reduce((sum, item) => sum + item.quantity, 0);

                  return (
                    <React.Fragment key={order.id}>
                      {/* Table Row */}
                      <tr className="hover:bg-muted/10 transition-colors">
                        <td className="px-6 py-4">
                          <button
                            onClick={() => setExpandedOrderId(isExpanded ? null : order.id)}
                            className="p-1 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors rounded-none"
                          >
                            <ChevronRight className={`w-4 h-4 transition-transform duration-200 ${isExpanded ? "rotate-90 text-foreground" : ""}`} />
                          </button>
                        </td>
                        <td className="px-6 py-4 font-mono font-medium tracking-wide">
                          #{order.id.slice(0, 8).toUpperCase()}
                        </td>
                        <td className="px-6 py-4 text-muted-foreground">
                          {fmtDate(order.createdAt)}
                        </td>
                        <td className="px-6 py-4">
                          <div>
                            <p className="font-semibold text-foreground">{customerName}</p>
                            <p className="text-[10px] text-muted-foreground mt-0.5 truncate max-w-[150px]">{customerEmail}</p>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div>
                            <p className="font-semibold text-foreground">{formatPrice(order.totalAmount)}</p>
                            <p className="text-[10px] text-muted-foreground mt-0.5">{itemsCount} items</p>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          {order.paymentMethod === "INSTALMENT" ? (
                            <div>
                              <Badge variant="outline" className="rounded-none font-normal text-[10px] bg-sky-50 text-sky-700 border-sky-200">
                                EMI Plan
                              </Badge>
                              {order.instalmentPlan && (
                                <p className="text-[9px] text-muted-foreground mt-1">
                                  Paid: {formatPrice(order.instalmentPlan.paidAmount)} / {formatPrice(order.instalmentPlan.totalAmount)}
                                </p>
                              )}
                            </div>
                          ) : (
                            <Badge variant="outline" className="rounded-none font-normal text-[10px] bg-emerald-50 text-emerald-700 border-emerald-200">
                              Paid in Full
                            </Badge>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <Badge variant="outline" className={`rounded-none font-normal text-[10px] py-0.5 px-2 ${STATUS_BADGE_CLASSES[order.status] || ""}`}>
                            {order.status}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            {updatingOrderId === order.id ? (
                              <Loader2 className="w-3.5 h-3.5 animate-spin text-muted-foreground" />
                            ) : (
                              <select
                                value={order.status}
                                onChange={e => handleStatusChange(order.id, e.target.value)}
                                className="bg-background border border-border px-2 py-1 text-[10px] rounded-none focus:outline-none focus:border-foreground"
                              >
                                {STATUS_OPTIONS.map(opt => (
                                  <option key={opt} value={opt}>
                                    {opt}
                                  </option>
                                ))}
                              </select>
                            )}
                            <button
                              onClick={() => setExpandedOrderId(isExpanded ? null : order.id)}
                              className="p-1 border border-border text-muted-foreground hover:text-foreground hover:bg-muted rounded-none"
                              title="View Order Details"
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>

                      {/* Expanded Accordion Details */}
                      <AnimatePresence initial={false}>
                        {isExpanded && (
                          <tr>
                            <td colSpan={8} className="p-0 border-t border-b border-border bg-muted/5">
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.2, ease: "easeInOut" }}
                                className="overflow-hidden"
                              >
                                <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
                                  {/* Ordered items breakdown */}
                                  <div className="lg:col-span-2 space-y-4">
                                    <h4 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-1.5">
                                      <ShoppingBag className="w-3.5 h-3.5" /> Ordered Items ({order.orderItems.length})
                                    </h4>
                                    <div className="border border-border bg-background divide-y divide-border rounded-none">
                                      {order.orderItems.map(item => {
                                        const imgUrl = item.product.images?.[0]?.url;
                                        return (
                                          <div key={item.id} className="flex justify-between items-center p-3 text-xs">
                                            <div className="flex items-center gap-3">
                                              <div className="w-12 h-12 bg-muted border border-border shrink-0 overflow-hidden flex items-center justify-center">
                                                {imgUrl ? (
                                                  // eslint-disable-next-line @next/next/no-img-element
                                                  <img src={imgUrl} alt={item.product.name} className="w-full h-full object-cover" />
                                                ) : (
                                                  <ShoppingBag className="w-4 h-4 text-muted-foreground/30" />
                                                )}
                                              </div>
                                              <div>
                                                <p className="font-semibold text-foreground">{item.product.name}</p>
                                                <p className="text-[10px] text-muted-foreground mt-0.5">
                                                  {formatPrice(item.price)} × {item.quantity}
                                                </p>
                                              </div>
                                            </div>
                                            <span className="font-semibold text-foreground">{formatPrice(item.price * item.quantity)}</span>
                                          </div>
                                        );
                                      })}
                                    </div>
                                  </div>

                                  {/* Info and address panel */}
                                  <div className="space-y-6">
                                    {/* Customer & Shipping info */}
                                    <div className="space-y-3">
                                      <h4 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-1.5">
                                        <Mail className="w-3.5 h-3.5" /> Customer & Shipping
                                      </h4>
                                      <div className="border border-border p-4 bg-background space-y-3">
                                        <div>
                                          <p className="font-semibold text-foreground">{customerName}</p>
                                          <p className="text-[10px] text-muted-foreground">{customerEmail}</p>
                                        </div>
                                        {order.shippingAddress ? (
                                          <div className="text-[11px] text-muted-foreground pt-2 border-t border-border flex gap-2 items-start">
                                            <MapPin className="w-3.5 h-3.5 text-muted-foreground mt-0.5 shrink-0" />
                                            <div>
                                              <p className="text-foreground font-medium">Shipping Address</p>
                                              <p className="mt-0.5">{order.shippingAddress.street}</p>
                                              <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}</p>
                                              <p>{order.shippingAddress.country}</p>
                                            </div>
                                          </div>
                                        ) : (
                                          <p className="text-xs text-muted-foreground italic pt-2 border-t border-border">No shipping address recorded.</p>
                                        )}
                                      </div>
                                    </div>

                                    {/* Payment Method Panel */}
                                    <div className="space-y-3">
                                      <h4 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-1.5">
                                        <CreditCard className="w-3.5 h-3.5" /> Payment & Billing
                                      </h4>
                                      <div className="border border-border p-4 bg-background space-y-3">
                                        <div className="flex justify-between items-center text-xs">
                                          <span className="text-muted-foreground">Payment Method:</span>
                                          <span className="font-semibold text-foreground">
                                            {order.paymentMethod === "INSTALMENT" ? "EMI Plan" : "Full Payment"}
                                          </span>
                                        </div>
                                        {order.paymentMethod === "INSTALMENT" && order.instalmentPlan ? (
                                          <div className="space-y-2 pt-2 border-t border-border">
                                            <div className="flex justify-between text-[10px]">
                                              <span className="text-muted-foreground">EMI Status: {order.instalmentPlan.status}</span>
                                              <span className="font-semibold">
                                                {formatPrice(order.instalmentPlan.paidAmount)} / {formatPrice(order.instalmentPlan.totalAmount)}
                                              </span>
                                            </div>
                                            <div className="w-full bg-muted h-1 overflow-hidden">
                                              <div
                                                className="bg-foreground h-1"
                                                style={{ width: `${Math.min((order.instalmentPlan.paidAmount / order.instalmentPlan.totalAmount) * 100, 100)}%` }}
                                              />
                                            </div>
                                          </div>
                                        ) : (
                                          <div className="flex justify-between items-center text-xs pt-2 border-t border-border">
                                            <span className="text-muted-foreground">Billing Status:</span>
                                            <span className="font-semibold text-emerald-600">Paid in Full</span>
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </motion.div>
                            </td>
                          </tr>
                        )}
                      </AnimatePresence>
                    </React.Fragment>
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

import React from "react";
