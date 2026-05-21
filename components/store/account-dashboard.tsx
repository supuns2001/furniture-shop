"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  CreditCard, Package, User, Heart, Settings, LogOut,
  MapPin, AlertCircle, Loader2, Edit2, Save, X,
  Plus, Trash2, Star, ShoppingBag, CheckCircle, KeyRound,
  Eye, EyeOff, Home, ChevronRight,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useCurrency } from "@/components/store/currency-context";
import { useCart } from "@/components/store/cart-context";
import Link from "next/link";
import { toast } from "sonner";

/* ─────────────── Types ─────────────── */
type Order = {
  id: string;
  createdAt: string;
  status: string;
  totalAmount: number;
  paymentMethod: string;
  shippingAddress: Address | null;
  orderItems: {
    id: string;
    quantity: number;
    price: number;
    product: {
      name: string;
      images: { url: string }[];
    };
  }[];
  instalmentPlan?: InstalmentPlan | null;
};
type InstalmentPlan = {
  id: string;
  totalAmount: number;
  paidAmount: number;
  tenureMonths: number;
  status: string;
  order: { id: string; orderItems: { product: { name: string } }[] };
  payments: { id: string; dueDate: string; status: string; amount: number; paidDate?: string | null }[];
};
type WishlistItem = {
  id: string;
  product: { id: string; name: string; basePrice: number; slug: string; images: { url: string }[] };
};
type Address = {
  id: string; street: string; city: string; state: string;
  zipCode: string; country: string; isDefault: boolean;
};

const STATUS_COLORS: Record<string, string> = {
  PENDING:    "text-amber-700   border-amber-300   bg-amber-50",
  PROCESSING: "text-blue-700    border-blue-300    bg-blue-50",
  SHIPPED:    "text-violet-700  border-violet-300  bg-violet-50",
  DELIVERED:  "text-emerald-700 border-emerald-300 bg-emerald-50",
  CANCELLED:  "text-red-700     border-red-300     bg-red-50",
};

const tabAnim = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  exit:    { opacity: 0, y: -8 },
  transition: { duration: 0.22 },
};

/* ─────────────── Helpers ─────────────── */
function fmt(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
}
function daysUntil(dateStr: string) {
  return Math.ceil((new Date(dateStr).getTime() - Date.now()) / 86_400_000);
}

/* ══════════════════════════════════════
   MAIN COMPONENT
   ══════════════════════════════════════ */
export function AccountDashboard() {
  const { formatPrice } = useCurrency();
  const { data: session, status, update: updateSession } = useSession();
  const router = useRouter();
  const { addToCart } = useCart();

  const [activeTab, setActiveTab] = useState("overview");

  /* data */
  const [orders,      setOrders]      = useState<Order[]>([]);
  const [instalments, setInstalments] = useState<InstalmentPlan[]>([]);
  const [wishlist,    setWishlist]    = useState<WishlistItem[]>([]);
  const [addresses,   setAddresses]   = useState<Address[]>([]);
  const [isLoading,   setIsLoading]   = useState(true);

  /* UI states for order filters, expanded accordions and payment action loading */
  const [orderFilter, setOrderFilter] = useState("ALL");
  const [expandedOrders, setExpandedOrders] = useState<Record<string, boolean>>({});
  const [payingPaymentId, setPayingPaymentId] = useState<string | null>(null);

  /* profile edit */
  const [editingName,  setEditingName]  = useState(false);
  const [profileName,  setProfileName]  = useState("");
  const [savingName,   setSavingName]   = useState(false);

  /* password change */
  const [pwForm,    setPwForm]    = useState({ current: "", next: "", confirm: "" });
  const [showPw,    setShowPw]    = useState(false);
  const [savingPw,  setSavingPw]  = useState(false);

  /* add address */
  const [showAddAddr,  setShowAddAddr]  = useState(false);
  const [addrForm,     setAddrForm]     = useState({ street: "", city: "", state: "", zipCode: "", country: "Sri Lanka", isDefault: false });
  const [savingAddr,   setSavingAddr]   = useState(false);

  const userId = (session?.user as Record<string, unknown>)?.id as string | undefined;

  /* ── Redirect if not auth ── */
  useEffect(() => {
    if (status === "unauthenticated") router.push("/auth/signin?callbackUrl=/account");
  }, [status, router]);

  /* ── Fetch data ── */
  const fetchData = useCallback(async () => {
    if (!userId) return;
    setIsLoading(true);
    try {
      const [o, i, w, a] = await Promise.all([
        fetch(`/api/account/orders?userId=${userId}`)
          .then(r => r.ok ? r.json() : [])
          .catch(err => { console.error("Error fetching orders:", err); return []; }),
        fetch(`/api/account/instalments?userId=${userId}`)
          .then(r => r.ok ? r.json() : [])
          .catch(err => { console.error("Error fetching instalments:", err); return []; }),
        fetch(`/api/account/wishlist?userId=${userId}`)
          .then(r => r.ok ? r.json() : [])
          .catch(err => { console.error("Error fetching wishlist:", err); return []; }),
        fetch(`/api/account/addresses?userId=${userId}`)
          .then(r => r.ok ? r.json() : [])
          .catch(err => { console.error("Error fetching addresses:", err); return []; }),
      ]);
      setOrders(Array.isArray(o) ? o : []);
      setInstalments(Array.isArray(i) ? i : []);
      setWishlist(Array.isArray(w) ? w : []);
      setAddresses(Array.isArray(a) ? a : []);
    } catch (e) {
      console.error("Error in Promise.all inside fetchData:", e);
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  const handlePayPayment = async (paymentId: string) => {
    setPayingPaymentId(paymentId);
    try {
      const res = await fetch("/api/account/instalments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ paymentId }),
      });
      if (res.ok) {
        toast.success("Installment payment successful!");
        await fetchData(); // Refresh data to show updated state
      } else {
        const err = await res.json();
        toast.error(err.error || "Payment failed.");
      }
    } catch (e) {
      console.error(e);
      toast.error("Failed to process instalment payment.");
    } finally {
      setPayingPaymentId(null);
    }
  };

  const toggleOrderExpand = (orderId: string) => {
    setExpandedOrders(prev => ({
      ...prev,
      [orderId]: !prev[orderId]
    }));
  };

  useEffect(() => {
    if (userId) {
      const timer = setTimeout(() => {
        setProfileName(session?.user?.name || "");
        fetchData();
      }, 0);
      return () => clearTimeout(timer);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  /* ── Actions ── */
  const saveName = async () => {
    if (!profileName.trim()) return;
    setSavingName(true);
    const res = await fetch("/api/account/profile", {
      method: "PATCH", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, name: profileName }),
    });
    setSavingName(false);
    if (res.ok) { await updateSession({ name: profileName }); setEditingName(false); toast.success("Name updated!"); }
    else toast.error("Failed to update name.");
  };

  const changePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (pwForm.next !== pwForm.confirm) return toast.error("New passwords do not match.");
    if (pwForm.next.length < 8) return toast.error("Password must be at least 8 characters.");
    setSavingPw(true);
    const res = await fetch("/api/account/profile", {
      method: "PUT", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, currentPassword: pwForm.current, newPassword: pwForm.next }),
    });
    const data = await res.json();
    setSavingPw(false);
    if (res.ok) { setPwForm({ current: "", next: "", confirm: "" }); toast.success("Password changed!"); }
    else toast.error(data.error || "Failed.");
  };

  const removeWishlist = async (id: string) => {
    setWishlist(prev => prev.filter(w => w.id !== id));
    await fetch(`/api/account/wishlist?id=${id}`, { method: "DELETE" });
    toast.success("Removed from wishlist.");
  };

  const addAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingAddr(true);
    const res = await fetch("/api/account/addresses", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, ...addrForm }),
    });
    setSavingAddr(false);
    if (res.ok) {
      const newAddr = await res.json();
      if (addrForm.isDefault) setAddresses(prev => prev.map(a => ({ ...a, isDefault: false })));
      setAddresses(prev => [...prev, newAddr]);
      setShowAddAddr(false);
      setAddrForm({ street: "", city: "", state: "", zipCode: "", country: "Sri Lanka", isDefault: false });
      toast.success("Address added!");
    } else toast.error("Failed to add address.");
  };

  const deleteAddress = async (id: string) => {
    setAddresses(prev => prev.filter(a => a.id !== id));
    await fetch(`/api/account/addresses?id=${id}`, { method: "DELETE" });
    toast.success("Address removed.");
  };

  const setDefaultAddress = async (id: string) => {
    setAddresses(prev => prev.map(a => ({ ...a, isDefault: a.id === id })));
    await fetch("/api/account/addresses", {
      method: "PATCH", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, userId }),
    });
    toast.success("Default address updated.");
  };

  /* ── Loading / unauth guard ── */
  if (status === "loading" || status === "unauthenticated") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  /* ── Derived ── */
  const user           = session!.user!;
  const activeEMIs     = instalments.filter(i => i.status === "ACTIVE");
  const upcomingPays   = activeEMIs
    .flatMap(inst => inst.payments.filter(p => p.status === "PENDING").map(p => ({ ...p, inst })))
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());

  const navItems = [
    { id: "overview",   label: "Dashboard",    icon: User },
    { id: "orders",     label: "Order History", icon: Package },
    { id: "instalments",label: "EMI Plans",     icon: CreditCard },
    { id: "wishlist",   label: "Wishlist",      icon: Heart },
    { id: "addresses",  label: "Addresses",     icon: MapPin },
    { id: "settings",   label: "Settings",      icon: Settings },
  ];

  /* ══════ RENDER ══════ */
  return (
    <div className="container mx-auto px-4 sm:px-6 py-10 max-w-7xl">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-muted-foreground uppercase tracking-widest mb-8">
        <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
        <ChevronRight className="w-3 h-3" />
        <span className="text-foreground">My Account</span>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* ── Sidebar ── */}
        <aside className="w-full md:w-60 shrink-0">
          {/* Avatar + info */}
          <div className="mb-6 pb-6 border-b border-border">
            <div className="w-14 h-14 rounded-full bg-foreground text-background flex items-center justify-center text-xl font-heading mb-3">
              {user.name?.charAt(0).toUpperCase() ?? "?"}
            </div>
            <p className="font-medium text-foreground">{user.name}</p>
            <p className="text-xs text-muted-foreground mt-0.5 truncate">{user.email}</p>
          </div>

          <nav className="space-y-0.5">
            {navItems.map(({ id, label, icon: Icon }) => (
              <button key={id} onClick={() => setActiveTab(id)}
                className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-none transition-all ${
                  activeTab === id
                    ? "bg-foreground text-background"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                {label}
              </button>
            ))}
            <div className="pt-4 mt-4 border-t border-border">
              <button onClick={() => void signOut({ callbackUrl: "/" })}
                className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            </div>
          </nav>
        </aside>

        {/* ── Main ── */}
        <div className="flex-1 min-h-[600px]">
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <AnimatePresence mode="wait">

              {/* ════ OVERVIEW ════ */}
              {activeTab === "overview" && (
                <motion.div key="overview" {...tabAnim} className="space-y-8">
                  {/* Due soon alerts */}
                  {upcomingPays.filter(p => daysUntil(p.dueDate) <= 5).map((p, i) => (
                    <div key={i} className="bg-amber-50 border border-amber-200 p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4 justify-between">
                      <div className="flex gap-3">
                        <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                        <div>
                          <p className="font-medium text-amber-800 text-sm">Payment Due in {daysUntil(p.dueDate)} day(s)</p>
                          <p className="text-xs text-amber-700 mt-0.5">
                            {formatPrice(p.amount)} for your EMI plan — due {fmt(p.dueDate)}
                          </p>
                        </div>
                      </div>
                      <button
                        disabled={payingPaymentId === p.id}
                        onClick={() => handlePayPayment(p.id)}
                        className="shrink-0 bg-amber-600 text-white px-5 py-2 text-xs font-medium uppercase tracking-wider hover:bg-amber-700 transition-colors flex items-center gap-2 disabled:opacity-50"
                      >
                        {payingPaymentId === p.id ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : null}
                        Pay Now
                      </button>
                    </div>
                  ))}

                  {/* Stat cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                    {[
                      { label: "Total Orders",   value: orders.length,      icon: Package,    tab: "orders"      },
                      { label: "Active EMIs",     value: activeEMIs.length,  icon: CreditCard, tab: "instalments" },
                      { label: "Wishlist Items",  value: wishlist.length,    icon: Heart,      tab: "wishlist"    },
                    ].map(({ label, value, icon: Icon, tab }) => (
                      <button key={label} onClick={() => setActiveTab(tab)}
                        className="group text-left border border-border hover:border-foreground transition-all p-6"
                      >
                        <div className="flex justify-between items-start mb-3">
                          <p className="text-xs font-medium text-muted-foreground uppercase tracking-widest">{label}</p>
                          <Icon className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                        </div>
                        <p className="text-4xl font-heading text-foreground">{value}</p>
                      </button>
                    ))}
                  </div>

                  {/* Recent orders */}
                  <div>
                    <div className="flex justify-between items-center mb-4">
                      <h2 className="text-lg font-heading">Recent Orders</h2>
                      {orders.length > 0 && (
                        <button onClick={() => setActiveTab("orders")} className="text-xs text-muted-foreground hover:text-foreground transition-colors uppercase tracking-wider">
                          View all →
                        </button>
                      )}
                    </div>
                    {orders.length === 0 ? (
                      <div className="border border-dashed border-border p-12 text-center space-y-4">
                        <ShoppingBag className="w-10 h-10 text-muted-foreground/30 mx-auto" />
                        <p className="text-muted-foreground text-sm">No orders yet.</p>
                        <Link href="/products" className="inline-block text-xs uppercase tracking-widest border-b border-foreground pb-0.5 font-medium hover:text-primary transition-colors">
                          Start Shopping
                        </Link>
                      </div>
                    ) : (
                      <div className="border border-border overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead className="bg-muted text-muted-foreground text-xs uppercase tracking-wider">
                            <tr>
                              <th className="px-5 py-3 text-left font-medium">Order</th>
                              <th className="px-5 py-3 text-left font-medium">Date</th>
                              <th className="px-5 py-3 text-left font-medium">Status</th>
                              <th className="px-5 py-3 text-right font-medium">Total</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-border">
                            {orders.slice(0, 5).map(o => (
                              <tr key={o.id} className="hover:bg-muted/40 transition-colors">
                                <td className="px-5 py-4 font-medium">#{o.id.slice(0, 8).toUpperCase()}</td>
                                <td className="px-5 py-4 text-muted-foreground">{fmt(o.createdAt)}</td>
                                <td className="px-5 py-4">
                                  <Badge variant="outline" className={`rounded-none font-normal text-xs ${STATUS_COLORS[o.status] || ""}`}>
                                    {o.status.charAt(0) + o.status.slice(1).toLowerCase()}
                                  </Badge>
                                </td>
                                <td className="px-5 py-4 text-right font-medium">{formatPrice(o.totalAmount)}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}

              {/* ════ ORDER HISTORY ════ */}
              {activeTab === "orders" && (
                <motion.div key="orders" {...tabAnim} className="space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <h2 className="text-2xl font-heading">Order History</h2>
                    
                    {/* Status Filters */}
                    <div className="flex flex-wrap gap-1 border border-border p-1 bg-muted/20">
                      {["ALL", "PENDING", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"].map(status => {
                        const count = status === "ALL" 
                          ? orders.length 
                          : orders.filter(o => o.status === status).length;
                        return (
                          <button
                            key={status}
                            onClick={() => setOrderFilter(status)}
                            className={`px-3 py-1.5 text-[10px] font-medium uppercase tracking-wider transition-all rounded-none ${
                              orderFilter === status
                                ? "bg-foreground text-background"
                                : "text-muted-foreground hover:bg-muted hover:text-foreground"
                            }`}
                          >
                            {status.toLowerCase()} ({count})
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {orders.length === 0 ? (
                    <div className="border border-dashed border-border p-16 text-center space-y-4">
                      <Package className="w-12 h-12 text-muted-foreground/30 mx-auto" />
                      <p className="text-muted-foreground">You haven&apos;t placed any orders yet.</p>
                      <Link href="/products" className="inline-block mt-2 text-xs uppercase tracking-widest border-b border-foreground pb-0.5 font-medium">
                        Browse Products
                      </Link>
                    </div>
                  ) : orders.filter(o => orderFilter === "ALL" || o.status === orderFilter).length === 0 ? (
                    <div className="border border-dashed border-border p-16 text-center space-y-2">
                      <Package className="w-10 h-10 text-muted-foreground/30 mx-auto" />
                      <p className="text-muted-foreground text-sm">No orders matching &quot;{orderFilter.toLowerCase()}&quot; filter.</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {orders
                        .filter(o => orderFilter === "ALL" || o.status === orderFilter)
                        .map(o => {
                          const isExpanded = !!expandedOrders[o.id];
                          return (
                            <div key={o.id} className="border border-border bg-background transition-all hover:border-muted-foreground/30">
                              {/* Order Header / Accordion Trigger */}
                              <div 
                                onClick={() => toggleOrderExpand(o.id)}
                                className="flex flex-wrap justify-between items-center gap-4 px-6 py-5 bg-muted/10 border-b border-border cursor-pointer select-none"
                              >
                                <div className="flex items-center gap-6 text-sm">
                                  <div>
                                    <p className="text-[10px] text-muted-foreground uppercase tracking-widest mb-0.5">Order ID</p>
                                    <p className="font-mono font-medium">#{o.id.slice(0, 8).toUpperCase()}</p>
                                  </div>
                                  <div>
                                    <p className="text-[10px] text-muted-foreground uppercase tracking-widest mb-0.5">Date Placed</p>
                                    <p className="font-medium text-muted-foreground">{fmt(o.createdAt)}</p>
                                  </div>
                                  <div>
                                    <p className="text-[10px] text-muted-foreground uppercase tracking-widest mb-0.5">Payment Method</p>
                                    <p className="font-medium text-muted-foreground">
                                      {o.paymentMethod === "INSTALMENT" ? "EMI Plan" : "Full Payment"}
                                    </p>
                                  </div>
                                </div>
                                <div className="flex items-center gap-4">
                                  <Badge variant="outline" className={`rounded-none font-normal text-xs py-1 px-3 ${STATUS_COLORS[o.status] || ""}`}>
                                    {o.status.charAt(0) + o.status.slice(1).toLowerCase()}
                                  </Badge>
                                  <span className="font-heading text-lg text-foreground">{formatPrice(o.totalAmount)}</span>
                                  <ChevronRight className={`w-4 h-4 text-muted-foreground transition-transform duration-300 ${isExpanded ? "rotate-90 text-foreground" : ""}`} />
                                </div>
                              </div>

                              {/* Accordion Content */}
                              <AnimatePresence initial={false}>
                                {isExpanded && (
                                  <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: "auto", opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{ duration: 0.22, ease: "easeInOut" }}
                                    className="overflow-hidden"
                                  >
                                    <div className="p-6 border-t border-border divide-y divide-border space-y-6">
                                      {/* Ordered Items with Product Images */}
                                      <div>
                                        <h3 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-4">Ordered Items</h3>
                                        <div className="space-y-4">
                                          {o.orderItems.map(item => {
                                            const imgUrl = item.product.images?.[0]?.url;
                                            return (
                                              <div key={item.id} className="flex items-center justify-between text-sm py-1">
                                                <div className="flex items-center gap-4">
                                                  <div className="w-14 h-14 bg-muted border border-border overflow-hidden shrink-0 flex items-center justify-center">
                                                    {imgUrl ? (
                                                      // eslint-disable-next-line @next/next/no-img-element
                                                      <img src={imgUrl} alt={item.product.name} className="w-full h-full object-cover" />
                                                    ) : (
                                                      <ShoppingBag className="w-5 h-5 text-muted-foreground/30" />
                                                    )}
                                                  </div>
                                                  <div>
                                                    <p className="font-medium text-foreground">{item.product.name}</p>
                                                    <p className="text-xs text-muted-foreground mt-0.5">
                                                      {formatPrice(item.price)} × {item.quantity}
                                                    </p>
                                                  </div>
                                                </div>
                                                <span className="font-medium text-foreground">{formatPrice(item.price * item.quantity)}</span>
                                              </div>
                                            );
                                          })}
                                        </div>
                                      </div>

                                      {/* Details & Address Grid */}
                                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6">
                                        {/* Shipping Address */}
                                        <div className="space-y-2">
                                          <h3 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Shipping Details</h3>
                                          {o.shippingAddress ? (
                                            <div className="text-sm space-y-0.5">
                                              <p className="font-medium text-foreground">{user.name}</p>
                                              <p className="text-muted-foreground">{o.shippingAddress.street}</p>
                                              <p className="text-muted-foreground">
                                                {o.shippingAddress.city}, {o.shippingAddress.state} {o.shippingAddress.zipCode}
                                              </p>
                                              <p className="text-muted-foreground">{o.shippingAddress.country}</p>
                                            </div>
                                          ) : (
                                            <p className="text-sm text-muted-foreground italic">No shipping address recorded</p>
                                          )}
                                        </div>

                                        {/* Payment details or EMI overview */}
                                        <div className="space-y-2">
                                          <h3 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Payment Information</h3>
                                          <div className="text-sm space-y-1">
                                            <div className="flex justify-between">
                                              <span className="text-muted-foreground">Payment Method:</span>
                                              <span className="font-medium text-foreground">
                                                {o.paymentMethod === "INSTALMENT" ? "Equated Monthly Installment (EMI)" : "Full Payment"}
                                              </span>
                                            </div>
                                            {o.paymentMethod === "FULL_PAYMENT" ? (
                                              <div className="flex justify-between">
                                                <span className="text-muted-foreground">Status:</span>
                                                <span className="font-medium text-emerald-600">Paid in Full</span>
                                              </div>
                                            ) : o.instalmentPlan ? (
                                              <div className="space-y-2 mt-2 border border-border p-3 bg-muted/10">
                                                <div className="flex justify-between text-xs">
                                                  <span className="text-muted-foreground">Paid Amount:</span>
                                                  <span className="font-medium text-foreground">
                                                    {formatPrice(o.instalmentPlan.paidAmount)} / {formatPrice(o.instalmentPlan.totalAmount)}
                                                  </span>
                                                </div>
                                                <div className="w-full bg-muted h-1.5 overflow-hidden">
                                                  <div 
                                                    className="bg-foreground h-1.5" 
                                                    style={{ width: `${Math.min((o.instalmentPlan.paidAmount / o.instalmentPlan.totalAmount) * 100, 100)}%` }} 
                                                  />
                                                </div>
                                                <div className="flex justify-between text-[10px] text-muted-foreground">
                                                  <span>EMI Status: {o.instalmentPlan.status}</span>
                                                  <span>{o.instalmentPlan.tenureMonths} Months</span>
                                                </div>
                                              </div>
                                            ) : (
                                              <p className="text-xs text-muted-foreground italic">EMI plan initializing...</p>
                                            )}
                                          </div>
                                        </div>
                                      </div>

                                      {/* Actions Section */}
                                      <div className="pt-4 flex justify-end gap-3">
                                        <button 
                                          onClick={() => window.print()}
                                          className="px-4 py-2 border border-border hover:bg-muted text-[10px] font-medium uppercase tracking-widest transition-colors flex items-center gap-1.5 text-foreground"
                                        >
                                          <Package className="w-3.5 h-3.5" />
                                          Print Invoice
                                        </button>
                                        {o.paymentMethod === "INSTALMENT" && (
                                          <button 
                                            onClick={() => {
                                              setActiveTab("instalments");
                                              toast.success("Navigated to EMI Plans!");
                                            }}
                                            className="px-4 py-2 bg-foreground text-background hover:bg-primary hover:text-primary-foreground text-[10px] font-medium uppercase tracking-widest transition-all"
                                          >
                                            Manage EMI
                                          </button>
                                        )}
                                      </div>
                                    </div>
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </div>
                          );
                        })}
                    </div>
                  )}
                </motion.div>
              )}

              {/* ════ EMI PLANS ════ */}
              {activeTab === "instalments" && (
                <motion.div key="instalments" {...tabAnim} className="space-y-6">
                  <h2 className="text-2xl font-heading">EMI Plans</h2>
                  {instalments.length === 0 ? (
                    <div className="border border-dashed border-border p-16 text-center space-y-4">
                      <CreditCard className="w-12 h-12 text-muted-foreground/30 mx-auto" />
                      <p className="text-muted-foreground">No active EMI plans.</p>
                      <Link href="/products" className="inline-block mt-2 text-xs uppercase tracking-widest border-b border-foreground pb-0.5 font-medium">
                        Shop with EMI
                      </Link>
                    </div>
                  ) : (
                    instalments.map(plan => {
                      const nextPay = plan.payments.find(p => p.status === "PENDING");
                      const productName = plan.order.orderItems[0]?.product.name || "Product";
                      const progress = Math.min((plan.paidAmount / plan.totalAmount) * 100, 100);
                      const remaining = plan.totalAmount - plan.paidAmount;
                      return (
                        <div key={plan.id} className="border border-border">
                          {/* Header */}
                          <div className="px-6 py-4 border-b border-border bg-muted/30 flex flex-wrap justify-between items-center gap-3">
                            <div>
                              <p className="font-medium">{productName}</p>
                              <p className="text-xs text-muted-foreground mt-0.5">Plan ID: {plan.id.slice(0, 8).toUpperCase()} · {plan.tenureMonths}-month EMI</p>
                            </div>
                            <Badge variant="outline" className={`rounded-none font-normal text-xs ${
                              plan.status === "COMPLETED" 
                                ? "border-emerald-300 text-emerald-700 bg-emerald-50" 
                                : "border-amber-300 text-amber-700 bg-amber-50"
                            }`}>
                              {plan.status.charAt(0) + plan.status.slice(1).toLowerCase()}
                            </Badge>
                          </div>

                          <div className="p-6 flex flex-col lg:flex-row gap-8">
                            {/* Progress & Full Payment Schedule */}
                            <div className="flex-1 space-y-6">
                              <div>
                                <div className="flex justify-between text-xs text-muted-foreground mb-2">
                                  <span>Paid: {formatPrice(plan.paidAmount)}</span>
                                  <span>Total: {formatPrice(plan.totalAmount)}</span>
                                </div>
                                <div className="w-full bg-muted h-2.5 rounded-full overflow-hidden">
                                  <motion.div
                                    className="bg-foreground h-2.5 rounded-full"
                                    initial={{ width: 0 }}
                                    animate={{ width: `${progress}%` }}
                                    transition={{ duration: 0.8, ease: "easeOut" }}
                                  />
                                </div>
                                <p className="text-xs text-muted-foreground mt-2">{progress.toFixed(1)}% complete · {formatPrice(remaining)} remaining</p>
                              </div>

                              {/* Comprehensive Payment Schedule */}
                              <div className="space-y-3">
                                <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Payment Schedule</p>
                                <div className="border border-border divide-y divide-border text-xs">
                                  {plan.payments.map((p, idx) => (
                                    <div key={p.id} className="flex justify-between items-center p-3 hover:bg-muted/10 transition-colors">
                                      <div className="flex items-center gap-3">
                                        <span className="text-muted-foreground font-mono">#{idx + 1}</span>
                                        <div>
                                          <p className="font-medium text-foreground">{fmt(p.dueDate)}</p>
                                          {p.paidDate && (
                                            <p className="text-[10px] text-emerald-600 font-sans mt-0.5">Paid on {fmt(p.paidDate)}</p>
                                          )}
                                        </div>
                                      </div>
                                      <div className="flex items-center gap-3">
                                        <span className="font-medium">{formatPrice(p.amount)}</span>
                                        <Badge variant="outline" className={`rounded-none text-[10px] py-0.5 px-1.5 font-normal ${
                                          p.status === "PAID"
                                            ? "border-emerald-300 text-emerald-700 bg-emerald-50"
                                            : p.status === "OVERDUE" || daysUntil(p.dueDate) < 0
                                            ? "border-red-300 text-red-700 bg-red-50"
                                            : daysUntil(p.dueDate) <= 5
                                            ? "border-amber-300 text-amber-700 bg-amber-50"
                                            : "border-border text-muted-foreground bg-muted/10"
                                        }`}>
                                          {p.status === "PAID" ? "Paid" : p.status === "PENDING" && daysUntil(p.dueDate) < 0 ? "Overdue" : p.status}
                                        </Badge>
                                        {p.status !== "PAID" && (
                                          <button
                                            disabled={payingPaymentId === p.id}
                                            onClick={() => handlePayPayment(p.id)}
                                            className="bg-foreground text-background px-3 py-1 text-[10px] uppercase tracking-wider hover:bg-primary hover:text-primary-foreground transition-all disabled:opacity-50 flex items-center gap-1 font-medium"
                                          >
                                            {payingPaymentId === p.id ? (
                                              <Loader2 className="w-3 h-3 animate-spin" />
                                            ) : null}
                                            Pay
                                          </button>
                                        )}
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>

                            {/* Pay now panel */}
                            {nextPay && (
                              <div className="w-full lg:w-56 border border-border p-5 bg-muted/30 flex flex-col justify-center gap-3 self-start">
                                <p className="text-xs text-muted-foreground uppercase tracking-widest">Next Payment</p>
                                <p className="text-2xl font-heading">{formatPrice(nextPay.amount)}</p>
                                <p className="text-xs text-muted-foreground">{fmt(nextPay.dueDate)}</p>
                                <button
                                  disabled={payingPaymentId === nextPay.id}
                                  onClick={() => handlePayPayment(nextPay.id)}
                                  className="w-full bg-foreground text-background py-3 text-xs font-medium uppercase tracking-widest hover:bg-primary hover:text-primary-foreground transition-colors mt-1 flex items-center justify-center gap-2 disabled:opacity-50"
                                >
                                  {payingPaymentId === nextPay.id ? (
                                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                  ) : null}
                                  Make Payment
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })
                  )}
                </motion.div>
              )}

              {/* ════ WISHLIST ════ */}
              {activeTab === "wishlist" && (
                <motion.div key="wishlist" {...tabAnim} className="space-y-6">
                  <h2 className="text-2xl font-heading">Wishlist <span className="text-muted-foreground text-lg font-sans font-normal">({wishlist.length})</span></h2>
                  {wishlist.length === 0 ? (
                    <div className="border border-dashed border-border p-16 text-center space-y-4">
                      <Heart className="w-12 h-12 text-muted-foreground/30 mx-auto" />
                      <p className="text-muted-foreground">Your wishlist is empty.</p>
                      <Link href="/products" className="inline-block mt-2 text-xs uppercase tracking-widest border-b border-foreground pb-0.5 font-medium">
                        Explore Products
                      </Link>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                      {wishlist.map(({ id, product }) => (
                        <div key={id} className="border border-border group flex flex-col">
                          {/* Image */}
                          <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                            {product.images[0] ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img src={product.images[0].url} alt={product.name}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-muted-foreground/30">
                                <ShoppingBag className="w-10 h-10" />
                              </div>
                            )}
                            <button onClick={() => removeWishlist(id)}
                              className="absolute top-3 right-3 w-8 h-8 bg-white/80 backdrop-blur flex items-center justify-center text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-all"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                          {/* Info */}
                          <div className="p-4 flex flex-col gap-3 flex-1">
                            <div>
                              <Link href={`/products/${product.slug}`} className="font-medium text-sm hover:text-primary transition-colors">
                                {product.name}
                              </Link>
                              <p className="text-primary text-sm mt-1">{formatPrice(product.basePrice)}</p>
                            </div>
                            <button
                              onClick={() => {
                                void addToCart({ productId: product.id, name: product.name, price: product.basePrice, quantity: 1, image: product.images[0]?.url || "", variant: "Default" });
                                toast.success(`${product.name} added to cart!`);
                              }}
                              className="mt-auto w-full border border-foreground py-2.5 text-xs font-medium uppercase tracking-widest hover:bg-foreground hover:text-background transition-all"
                            >
                              Add to Cart
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </motion.div>
              )}

              {/* ════ ADDRESSES ════ */}
              {activeTab === "addresses" && (
                <motion.div key="addresses" {...tabAnim} className="space-y-6">
                  <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-heading">Saved Addresses</h2>
                    <button onClick={() => setShowAddAddr(v => !v)}
                      className="flex items-center gap-2 border border-foreground px-5 py-2 text-xs font-medium uppercase tracking-widest hover:bg-foreground hover:text-background transition-all"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      Add Address
                    </button>
                  </div>

                  {/* Add address form */}
                  <AnimatePresence>
                    {showAddAddr && (
                      <motion.form
                        key="addr-form"
                        initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
                        onSubmit={addAddress}
                        className="border border-foreground p-6 space-y-4 overflow-hidden"
                      >
                        <p className="text-sm font-medium uppercase tracking-widest">New Address</p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          {[
                            { key: "street",  label: "Street Address", full: true },
                            { key: "city",    label: "City" },
                            { key: "state",   label: "State / Province" },
                            { key: "zipCode", label: "ZIP / Postal Code" },
                            { key: "country", label: "Country" },
                          ].map(({ key, label, full }) => (
                            <div key={key} className={full ? "sm:col-span-2" : ""}>
                              <label className="block text-xs text-muted-foreground uppercase tracking-widest mb-1.5">{label}</label>
                              <input
                                required
                                value={String(addrForm[key as keyof typeof addrForm])}
                                onChange={e => setAddrForm(f => ({ ...f, [key]: e.target.value }))}
                                className="w-full border border-border bg-background px-4 py-2.5 text-sm focus:outline-none focus:border-foreground transition-colors"
                              />
                            </div>
                          ))}
                        </div>
                        <label className="flex items-center gap-2.5 text-sm cursor-pointer">
                          <input type="checkbox" checked={addrForm.isDefault} onChange={e => setAddrForm(f => ({ ...f, isDefault: e.target.checked }))}
                            className="w-4 h-4 border border-border"
                          />
                          Set as default address
                        </label>
                        <div className="flex gap-3">
                          <button type="submit" disabled={savingAddr}
                            className="flex items-center gap-2 bg-foreground text-background px-6 py-2.5 text-xs font-medium uppercase tracking-widest hover:bg-primary hover:text-primary-foreground transition-all disabled:opacity-50"
                          >
                            {savingAddr ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                            Save Address
                          </button>
                          <button type="button" onClick={() => setShowAddAddr(false)}
                            className="flex items-center gap-2 border border-border px-6 py-2.5 text-xs font-medium uppercase tracking-widest hover:bg-muted transition-all"
                          >
                            <X className="w-3.5 h-3.5" />
                            Cancel
                          </button>
                        </div>
                      </motion.form>
                    )}
                  </AnimatePresence>

                  {/* Address list */}
                  {addresses.length === 0 && !showAddAddr ? (
                    <div className="border border-dashed border-border p-16 text-center space-y-4">
                      <Home className="w-12 h-12 text-muted-foreground/30 mx-auto" />
                      <p className="text-muted-foreground">No saved addresses.</p>
                      <button onClick={() => setShowAddAddr(true)} className="text-xs uppercase tracking-widest border-b border-foreground pb-0.5 font-medium">
                        Add your first address
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      {addresses.map(addr => (
                        <div key={addr.id} className={`border p-5 relative group ${addr.isDefault ? "border-foreground" : "border-border"}`}>
                          {addr.isDefault && (
                            <div className="flex items-center gap-1.5 mb-3">
                              <CheckCircle className="w-3.5 h-3.5 text-foreground" />
                              <span className="text-xs font-medium uppercase tracking-widest">Default</span>
                            </div>
                          )}
                          <p className="text-sm font-medium">{addr.street}</p>
                          <p className="text-sm text-muted-foreground mt-0.5">{addr.city}, {addr.state} {addr.zipCode}</p>
                          <p className="text-sm text-muted-foreground">{addr.country}</p>

                          <div className="flex gap-3 mt-4">
                            {!addr.isDefault && (
                              <button onClick={() => setDefaultAddress(addr.id)}
                                className="text-xs text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1.5"
                              >
                                <Star className="w-3.5 h-3.5" />
                                Set default
                              </button>
                            )}
                            <button onClick={() => deleteAddress(addr.id)}
                              className="text-xs text-muted-foreground hover:text-destructive transition-colors flex items-center gap-1.5"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              Remove
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </motion.div>
              )}

              {/* ════ SETTINGS ════ */}
              {activeTab === "settings" && (
                <motion.div key="settings" {...tabAnim} className="space-y-8 max-w-xl">
                  <h2 className="text-2xl font-heading">Settings</h2>

                  {/* Profile */}
                  <section className="border border-border">
                    <div className="px-6 py-4 border-b border-border bg-muted/30">
                      <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">Profile Information</p>
                    </div>
                    <div className="p-6 space-y-5">
                      {/* Name */}
                      <div>
                        <label className="block text-xs font-medium uppercase tracking-widest text-muted-foreground mb-2">Full Name</label>
                        {editingName ? (
                          <div className="flex gap-2">
                            <input value={profileName} onChange={e => setProfileName(e.target.value)}
                              className="flex-1 border border-border bg-background px-4 py-2.5 text-sm focus:outline-none focus:border-foreground transition-colors"
                            />
                            <button onClick={saveName} disabled={savingName}
                              className="px-4 py-2.5 bg-foreground text-background text-xs font-medium uppercase hover:bg-primary hover:text-primary-foreground transition-all disabled:opacity-50 flex items-center gap-1.5"
                            >
                              {savingName ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                              Save
                            </button>
                            <button onClick={() => { setEditingName(false); setProfileName(user.name || ""); }}
                              className="px-4 py-2.5 border border-border text-xs font-medium uppercase hover:bg-muted transition-all"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ) : (
                          <div className="flex justify-between items-center">
                            <p className="text-sm">{user.name}</p>
                            <button onClick={() => setEditingName(true)}
                              className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1.5 transition-colors"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                              Edit
                            </button>
                          </div>
                        )}
                      </div>
                      {/* Email (read-only) */}
                      <div>
                        <label className="block text-xs font-medium uppercase tracking-widest text-muted-foreground mb-2">Email</label>
                        <p className="text-sm text-muted-foreground">{user.email}</p>
                        <p className="text-xs text-muted-foreground/60 mt-1">Email cannot be changed.</p>
                      </div>
                    </div>
                  </section>

                  {/* Change Password */}
                  <section className="border border-border">
                    <div className="px-6 py-4 border-b border-border bg-muted/30 flex items-center gap-2">
                      <KeyRound className="w-3.5 h-3.5 text-muted-foreground" />
                      <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">Change Password</p>
                    </div>
                    <form onSubmit={changePassword} className="p-6 space-y-4">
                      {[
                        { key: "current", label: "Current Password",  ph: "••••••••" },
                        { key: "next",    label: "New Password",       ph: "Min. 8 characters" },
                        { key: "confirm", label: "Confirm New Password", ph: "••••••••" },
                      ].map(({ key, label, ph }) => (
                        <div key={key}>
                          <label className="block text-xs font-medium uppercase tracking-widest text-muted-foreground mb-2">{label}</label>
                          <div className="relative">
                            <input
                              type={showPw ? "text" : "password"}
                              placeholder={ph}
                              required
                              value={pwForm[key as keyof typeof pwForm]}
                              onChange={e => setPwForm(f => ({ ...f, [key]: e.target.value }))}
                              className="w-full border border-border bg-background px-4 py-2.5 pr-10 text-sm focus:outline-none focus:border-foreground transition-colors"
                            />
                          </div>
                        </div>
                      ))}
                      <div className="flex items-center gap-2 pt-1">
                        <button type="button" onClick={() => setShowPw(v => !v)}
                          className="text-xs text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1.5"
                        >
                          {showPw ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                          {showPw ? "Hide" : "Show"} passwords
                        </button>
                      </div>
                      <button type="submit" disabled={savingPw}
                        className="flex items-center gap-2 bg-foreground text-background px-6 py-2.5 text-xs font-medium uppercase tracking-widest hover:bg-primary hover:text-primary-foreground transition-all disabled:opacity-50"
                      >
                        {savingPw ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <KeyRound className="w-3.5 h-3.5" />}
                        Update Password
                      </button>
                    </form>
                  </section>

                  {/* Danger zone */}
                  <section className="border border-destructive/30">
                    <div className="px-6 py-4 border-b border-destructive/30 bg-destructive/5">
                      <p className="text-xs font-medium uppercase tracking-widest text-destructive">Danger Zone</p>
                    </div>
                    <div className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div>
                        <p className="text-sm font-medium">Sign out everywhere</p>
                        <p className="text-xs text-muted-foreground mt-0.5">This will end your current session.</p>
                      </div>
                      <button onClick={() => void signOut({ callbackUrl: "/" })}
                        className="flex items-center gap-2 border border-destructive text-destructive px-5 py-2.5 text-xs font-medium uppercase tracking-widest hover:bg-destructive hover:text-destructive-foreground transition-all whitespace-nowrap"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        Sign Out
                      </button>
                    </div>
                  </section>
                </motion.div>
              )}

            </AnimatePresence>
          )}
        </div>
      </div>
    </div>
  );
}
