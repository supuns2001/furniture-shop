"use client";

import { useState, useEffect, useCallback, Fragment } from "react";
import { Search, Mail, Download, Loader2, ChevronRight, MapPin, ShoppingBag, Calendar, User } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useCurrency } from "@/components/store/currency-context";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

type Address = {
  id: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  isDefault: boolean;
};

type PastOrder = {
  id: string;
  totalAmount: number;
  status: string;
  createdAt: string;
  paymentMethod: string;
};

type Customer = {
  id: string;
  name: string;
  email: string;
  orders: number;
  spent: number;
  lastOrder: string;
  status: string;
  createdAt: string;
  addresses: Address[];
  ordersList: PastOrder[];
};

const getDownloadTimestamp = () => Date.now();

export function CustomersManagement() {
  const { formatPrice } = useCurrency();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedCustomerId, setExpandedCustomerId] = useState<string | null>(null);

  const fetchCustomers = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/admin/customers");
      if (res.ok) {
        const data = await res.json();
        setCustomers(data);
      } else {
        toast.error("Failed to load customers from server.");
      }
    } catch (e) {
      console.error(e);
      toast.error("An error occurred while fetching customers.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

  const handleExportCSV = () => {
    if (customers.length === 0) return toast.error("No customer records to export.");

    const filtered = customers.filter(cust => {
      // Tab filter
      if (activeTab !== "all" && cust.status.toLowerCase() !== activeTab) return false;
      // Search filter
      if (searchTerm.trim() !== "") {
        const term = searchTerm.toLowerCase();
        if (
          !cust.id.toLowerCase().includes(term) &&
          !cust.name.toLowerCase().includes(term) &&
          !cust.email.toLowerCase().includes(term)
        ) {
          return false;
        }
      }
      return true;
    });

    if (filtered.length === 0) return toast.error("No matching records found to export.");

    const headers = ["Customer ID", "Name", "Email", "Registered Date", "Orders Count", "Total Spent", "Last Order Date", "Status"];
    const rows = filtered.map(c => [
      c.id,
      c.name,
      c.email,
      new Date(c.createdAt).toLocaleDateString(),
      c.orders,
      c.spent,
      c.lastOrder,
      c.status
    ]);

    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(","), ...rows.map(e => e.map(val => `"${val}"`).join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `lumen_customers_${activeTab}_${getDownloadTimestamp()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("CSV report downloaded successfully!");
  };

  const getTabCount = (tabName: string) => {
    if (tabName === "all") return customers.length;
    return customers.filter(c => c.status.toLowerCase() === tabName).length;
  };

  const filteredCustomers = customers.filter(cust => {
    if (activeTab !== "all" && cust.status.toLowerCase() !== activeTab) return false;

    if (searchTerm.trim() !== "") {
      const term = searchTerm.toLowerCase();
      if (
        !cust.id.toLowerCase().includes(term) &&
        !cust.name.toLowerCase().includes(term) &&
        !cust.email.toLowerCase().includes(term)
      ) {
        return false;
      }
    }
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-heading text-foreground tracking-tight">Customer Accounts</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage and audit registered customer profiles, transaction totals, and saved addresses.</p>
        </div>
        <button
          onClick={handleExportCSV}
          className="rounded-none bg-foreground text-background px-4 py-2 text-sm font-semibold tracking-wide hover:bg-neutral-800 transition-all flex items-center gap-2"
        >
          <Download className="w-4 h-4" /> Export CSV
        </button>
      </div>

      <div className="bg-card border border-border rounded-none shadow-sm overflow-hidden">
        <div className="p-4 border-b border-border flex flex-col md:flex-row justify-between items-center gap-4 bg-neutral-50/50">
          <div className="flex gap-2 w-full md:w-auto overflow-x-auto hide-scrollbar">
            {[
              { id: "all", label: "All Customers" },
              { id: "active", label: "Active" },
              { id: "new", label: "New" },
              { id: "vip", label: "VIP" },
              { id: "inactive", label: "Inactive" },
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
                {tab.label} <span className="text-xs ml-1 opacity-70 font-normal">({getTabCount(tab.id)})</span>
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto">
            <div className="relative flex-1 md:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search name, email, customer ID..."
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
            <p className="text-sm">Loading customer accounts from secure store...</p>
          </div>
        ) : filteredCustomers.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground">
            <p className="text-base font-medium">No customers found</p>
            <p className="text-sm mt-1">Try adjusting your filters or search keywords.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left border-collapse">
              <thead className="text-xs text-muted-foreground uppercase tracking-widest bg-neutral-50 border-b border-border">
                <tr>
                  <th className="px-6 py-4 font-semibold">Customer Details</th>
                  <th className="px-6 py-4 font-semibold">Registered Date</th>
                  <th className="px-6 py-4 font-semibold text-center">Total Orders</th>
                  <th className="px-6 py-4 font-semibold text-right">Total Spent</th>
                  <th className="px-6 py-4 font-semibold">Last Activity</th>
                  <th className="px-6 py-4 font-semibold text-center">Status</th>
                  <th className="px-6 py-4 font-semibold text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredCustomers.map(customer => {
                  const isExpanded = expandedCustomerId === customer.id;
                  return (
                    <Fragment key={customer.id}>
                      <tr
                        className={`hover:bg-neutral-50/50 transition-colors cursor-pointer border-b border-border ${
                          isExpanded ? "bg-neutral-50/20" : ""
                        }`}
                        onClick={() => setExpandedCustomerId(isExpanded ? null : customer.id)}
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 bg-neutral-100 flex items-center justify-center rounded-none border border-neutral-200">
                              <User className="w-4 h-4 text-neutral-600" />
                            </div>
                            <div>
                              <p className="font-semibold text-foreground text-sm">{customer.name}</p>
                              <p className="text-xs text-muted-foreground font-mono mt-0.5">{customer.id}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-muted-foreground font-mono text-xs">
                          {new Date(customer.createdAt).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })}
                        </td>
                        <td className="px-6 py-4 text-center font-semibold text-sm">
                          {customer.orders}
                        </td>
                        <td className="px-6 py-4 text-right font-semibold text-sm text-foreground">
                          {formatPrice(customer.spent)}
                        </td>
                        <td className="px-6 py-4 text-xs text-muted-foreground font-medium">
                          {customer.lastOrder}
                        </td>
                        <td className="px-6 py-4 text-center">
                          <Badge
                            className={`rounded-none font-semibold uppercase tracking-wider text-[10px] border px-2 py-0.5 ${
                              customer.status === "VIP"
                                ? "bg-amber-50 text-amber-800 border-amber-200"
                                : customer.status === "New"
                                ? "bg-green-50 text-green-800 border-green-200"
                                : customer.status === "Inactive"
                                ? "bg-red-50 text-red-800 border-red-200"
                                : "bg-blue-50 text-blue-800 border-blue-200"
                            }`}
                          >
                            {customer.status}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <button
                            className="p-1.5 text-muted-foreground hover:text-foreground transition-all hover:bg-neutral-100"
                            onClick={(e) => {
                              e.stopPropagation();
                              setExpandedCustomerId(isExpanded ? null : customer.id);
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

                      {/* Collapsible details row */}
                      <tr>
                        <td colSpan={7} className="p-0 border-none">
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
                                  {/* User Details */}
                                  <div className="space-y-4 bg-white border border-border p-4">
                                    <h3 className="text-xs uppercase tracking-widest font-bold text-foreground border-b pb-2 flex items-center gap-2">
                                      <User className="w-3.5 h-3.5" /> Customer Account Profile
                                    </h3>
                                    <div className="space-y-2 text-sm">
                                      <p className="flex justify-between">
                                        <span className="text-muted-foreground">Full Name:</span>
                                        <span className="font-semibold text-foreground">{customer.name}</span>
                                      </p>
                                      <p className="flex justify-between">
                                        <span className="text-muted-foreground">Email:</span>
                                        <a href={`mailto:${customer.email}`} className="font-semibold text-primary hover:underline flex items-center gap-1">
                                          <Mail className="w-3 h-3 inline" /> {customer.email}
                                        </a>
                                      </p>
                                      <p className="flex justify-between">
                                        <span className="text-muted-foreground">Registered:</span>
                                        <span className="font-mono text-xs">{new Date(customer.createdAt).toLocaleString()}</span>
                                      </p>
                                      <p className="flex justify-between">
                                        <span className="text-muted-foreground">System UUID:</span>
                                        <span className="font-mono text-[10px] text-muted-foreground">{customer.id}</span>
                                      </p>
                                    </div>
                                  </div>

                                  {/* Saved Shipping Addresses */}
                                  <div className="space-y-4 bg-white border border-border p-4">
                                    <h3 className="text-xs uppercase tracking-widest font-bold text-foreground border-b pb-2 flex items-center gap-2">
                                      <MapPin className="w-3.5 h-3.5" /> Saved Shipping Addresses
                                    </h3>
                                    {customer.addresses.length === 0 ? (
                                      <p className="text-xs text-muted-foreground italic py-2">No saved physical addresses recorded for this user.</p>
                                    ) : (
                                      <div className="space-y-3 max-h-40 overflow-y-auto pr-1">
                                        {customer.addresses.map((address) => (
                                          <div
                                            key={address.id}
                                            className={`p-2.5 border text-xs leading-relaxed relative ${
                                              address.isDefault
                                                ? "border-foreground bg-neutral-50/50"
                                                : "border-border"
                                            }`}
                                          >
                                            {address.isDefault && (
                                              <span className="absolute top-2 right-2 bg-foreground text-background text-[9px] font-bold px-1 uppercase tracking-wider scale-90">
                                                Default
                                              </span>
                                            )}
                                            <p className="font-semibold text-foreground">{address.street}</p>
                                            <p className="text-muted-foreground">
                                              {address.city}, {address.state} {address.zipCode}
                                            </p>
                                            <p className="text-muted-foreground uppercase tracking-wider text-[9px] font-bold mt-1">
                                              {address.country}
                                            </p>
                                          </div>
                                        ))}
                                      </div>
                                    )}
                                  </div>

                                  {/* Orders History Ledger */}
                                  <div className="space-y-4 bg-white border border-border p-4 lg:col-span-1">
                                    <h3 className="text-xs uppercase tracking-widest font-bold text-foreground border-b pb-2 flex items-center gap-2">
                                      <ShoppingBag className="w-3.5 h-3.5" /> Order History Ledger
                                    </h3>
                                    {customer.ordersList.length === 0 ? (
                                      <p className="text-xs text-muted-foreground italic py-2">This customer has not placed any orders yet.</p>
                                    ) : (
                                      <div className="space-y-2.5 max-h-40 overflow-y-auto pr-1 font-mono text-xs">
                                        {customer.ordersList.map((order) => (
                                          <div
                                            key={order.id}
                                            className="p-2 border border-border flex justify-between items-center bg-neutral-50/30 hover:bg-neutral-50 transition-colors"
                                          >
                                            <div>
                                              <p className="font-semibold text-foreground">ORD-{order.id.slice(0, 8).toUpperCase()}</p>
                                              <p className="text-[10px] text-muted-foreground mt-0.5">
                                                {new Date(order.createdAt).toLocaleDateString()} • {order.paymentMethod.replace("_", " ")}
                                              </p>
                                            </div>
                                            <div className="text-right">
                                              <p className="font-bold text-foreground">{formatPrice(order.totalAmount)}</p>
                                              <span
                                                className={`text-[9px] uppercase tracking-wider font-bold inline-block px-1 mt-1 ${
                                                  order.status === "DELIVERED"
                                                    ? "text-emerald-700 bg-emerald-50"
                                                    : order.status === "CANCELLED"
                                                    ? "text-red-700 bg-red-50"
                                                    : "text-amber-700 bg-amber-50"
                                                }`}
                                              >
                                                {order.status}
                                              </span>
                                            </div>
                                          </div>
                                        ))}
                                      </div>
                                    )}
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
