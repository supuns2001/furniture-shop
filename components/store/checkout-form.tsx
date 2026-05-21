"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

import { useSession } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Check, ChevronRight, CreditCard, Wallet, Loader2,
  MapPin, ChevronDown, ShoppingBag, Package, ArrowLeft,
} from "lucide-react";
import { useCurrency } from "@/components/store/currency-context";
import { useCart } from "@/components/store/cart-context";
import { toast } from "sonner";

/* ── Types ── */
type Address = {
  id: string; street: string; city: string;
  state: string; zipCode: string; country: string; isDefault: boolean;
};

type ShippingForm = {
  firstName: string; lastName: string; email: string; phone: string;
  street: string; city: string; state: string; zipCode: string;
  country: string; saveAddress: boolean;
};

const EMPTY_FORM: ShippingForm = {
  firstName: "", lastName: "", email: "", phone: "",
  street: "", city: "", state: "", zipCode: "", country: "Sri Lanka", saveAddress: false,
};

/* ── Step indicator ── */
const STEPS = ["Shipping", "Payment", "Review"];

function StepBar({ step }: { step: number }) {
  return (
    <div className="flex items-center mb-10">
      {STEPS.map((label, i) => {
        const n = i + 1;
        const done = step > n;
        const active = step === n;
        return (
          <div key={label} className="flex items-center">
            <div className={`flex items-center justify-center w-8 h-8 text-xs font-semibold transition-all ${
              done   ? "bg-foreground text-background" :
              active ? "bg-primary text-primary-foreground" :
                       "bg-muted text-muted-foreground"
            }`}>
              {done ? <Check className="w-4 h-4" /> : n}
            </div>
            <span className={`ml-2.5 text-xs font-medium uppercase tracking-widest ${active ? "text-foreground" : "text-muted-foreground"}`}>
              {label}
            </span>
            {i < STEPS.length - 1 && <ChevronRight className="w-4 h-4 mx-4 text-border" />}
          </div>
        );
      })}
    </div>
  );
}

/* ══════════════════════════════════════
   MAIN COMPONENT
══════════════════════════════════════ */
export function CheckoutForm() {
  const { formatPrice } = useCurrency();
  const { cartItems, cartTotal, clearCart } = useCart();
  const { data: session } = useSession();


  const userId = (session?.user as Record<string, unknown>)?.id as string | undefined;

  const [step, setStep] = useState(1);
  const [form, setForm] = useState<ShippingForm>(EMPTY_FORM);
  const [paymentMethod, setPaymentMethod] = useState<"FULL_PAYMENT" | "INSTALMENT">("FULL_PAYMENT");
  const [emiMonths, setEmiMonths] = useState<3 | 6 | 12>(3);
  const [savedAddresses, setSavedAddresses] = useState<Address[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
  const [showAddressDropdown, setShowAddressDropdown] = useState(false);
  const [isPlacing, setIsPlacing] = useState(false);
  const [placedOrder, setPlacedOrder] = useState<{ orderId: string; totalAmount: number } | null>(null);

  const monthly = parseFloat((cartTotal / emiMonths).toFixed(2));
  const dueTodayEmi = monthly;

  /* ── Pre-fill session user's data ── */
  useEffect(() => {
    if (session?.user) {
      const [first, ...rest] = (session.user.name || "").split(" ");
      const timer = setTimeout(() => {
        setForm(f => ({
          ...f,
          firstName: first || "",
          lastName: rest.join(" "),
          email: session.user?.email || "",
        }));
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [session]);

  /* ── Load saved addresses ── */
  useEffect(() => {
    if (!userId) return;
    fetch(`/api/account/addresses?userId=${userId}`)
      .then(r => r.json())
      .then((data: Address[]) => {
        if (Array.isArray(data)) {
          setSavedAddresses(data);
          const def = data.find(a => a.isDefault) || data[0];
          if (def) applySavedAddress(def);
        }
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  function applySavedAddress(addr: Address) {
    setSelectedAddressId(addr.id);
    const [first, ...rest] = (session?.user?.name || "").split(" ");
    setForm(f => ({
      ...f,
      firstName: first || f.firstName,
      lastName: rest.join(" ") || f.lastName,
      street: addr.street,
      city: addr.city,
      state: addr.state,
      zipCode: addr.zipCode,
      country: addr.country,
    }));
  }

  /* ── Validation ── */
  function validateStep1() {
    const required: (keyof ShippingForm)[] = ["firstName", "email", "street", "city", "zipCode"];
    for (const k of required) {
      if (!form[k]) { toast.error(`Please fill in all required fields.`); return false; }
    }
    if (!/\S+@\S+\.\S+/.test(form.email)) { toast.error("Enter a valid email."); return false; }
    return true;
  }

  /* ── Place order ── */
  async function placeOrder() {
    setIsPlacing(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: userId || null,
          guestEmail: !userId ? form.email : null,
          cartItems: cartItems.map(i => ({
            productId: i.productId,
            name: i.name,
            price: i.price,
            quantity: i.quantity,
          })),
          paymentMethod,
          emiMonths: paymentMethod === "INSTALMENT" ? emiMonths : null,
          shippingAddress: {
            street: form.street,
            city: form.city,
            state: form.state,
            zipCode: form.zipCode,
            country: form.country,
          },
          saveAddress: form.saveAddress && !!userId,
        }),
      });

      const data = await res.json();
      if (!res.ok) { toast.error(data.error || "Failed to place order."); return; }

      // Clear cart
      await clearCart();
      setPlacedOrder(data);
      setStep(4);
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsPlacing(false);
    }
  }

  /* ── Empty cart guard ── */
  if (cartItems.length === 0 && !placedOrder) {
    return (
      <div className="container mx-auto px-6 py-24 max-w-6xl text-center space-y-6">
        <ShoppingBag className="w-16 h-16 text-muted-foreground/30 mx-auto" />
        <h1 className="text-2xl font-heading">Your cart is empty</h1>
        <p className="text-muted-foreground">Add some items before checking out.</p>
        <Link href="/products" className="inline-block bg-foreground text-background px-8 py-3.5 text-sm font-medium uppercase tracking-widest hover:bg-primary transition-colors">
          Browse Products
        </Link>
      </div>
    );
  }

  /* ══ ORDER SUMMARY SIDEBAR ══ */
  const renderOrderSummary = () => (
    <div className="bg-muted/20 border border-border p-7 sticky top-32">
      <h2 className="font-heading text-xl mb-5 pb-4 border-b border-border">Order Summary</h2>

      {/* Items */}
      <div className="space-y-4 mb-5 max-h-72 overflow-y-auto pr-1">
        {cartItems.map(item => (
          <div key={item.id} className="flex gap-3">
            <div className="w-16 h-16 relative bg-muted shrink-0 border border-border/30">
              {item.image && <Image src={item.image} alt={item.name} fill className="object-cover" />}
              <span className="absolute -top-2 -right-2 w-5 h-5 bg-foreground text-background text-[10px] font-bold flex items-center justify-center rounded-full">
                {item.quantity}
              </span>
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium leading-tight">{item.name}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{item.variant}</p>
              <p className="text-sm font-medium mt-1">{formatPrice(item.price * item.quantity)}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Totals */}
      <div className="space-y-2.5 py-4 border-y border-border text-sm">
        <div className="flex justify-between text-muted-foreground">
          <span>Subtotal ({cartItems.reduce((s, i) => s + i.quantity, 0)} items)</span>
          <span className="text-foreground">{formatPrice(cartTotal)}</span>
        </div>
        <div className="flex justify-between text-muted-foreground">
          <span>Shipping</span>
          <span className="text-emerald-600 font-medium">Free</span>
        </div>
        <div className="flex justify-between text-muted-foreground">
          <span>Tax</span>
          <span>Included</span>
        </div>
      </div>

      <div className="flex justify-between items-center mt-5">
        <span className="font-medium">Total</span>
        <span className="text-2xl font-heading text-primary">{formatPrice(cartTotal)}</span>
      </div>

      {paymentMethod === "INSTALMENT" && (
        <div className="mt-4 p-4 bg-primary/5 border border-primary/20 space-y-1.5 text-sm">
          <div className="flex justify-between font-medium text-primary">
            <span>Due Today</span>
            <span>{formatPrice(dueTodayEmi)}</span>
          </div>
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Monthly × {emiMonths - 1} more</span>
            <span>{formatPrice(monthly)} / mo</span>
          </div>
          <p className="text-xs text-muted-foreground/70 mt-1">0% interest · Auto-debit on same date</p>
        </div>
      )}
    </div>
  );

  /* ══ SUCCESS SCREEN ══ */
  if (step === 4 && placedOrder) {
    return (
      <div className="container mx-auto px-6 py-16 max-w-2xl text-center">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="space-y-6">
          <div className="w-24 h-24 bg-emerald-50 border-2 border-emerald-200 rounded-full flex items-center justify-center mx-auto">
            <Check className="w-12 h-12 text-emerald-600" />
          </div>
          <div>
            <h1 className="text-4xl font-heading mb-3">Order Confirmed!</h1>
            <p className="text-muted-foreground">
              Thank you{session?.user?.name ? `, ${session.user.name.split(" ")[0]}` : ""}! Your order has been placed successfully.
            </p>
          </div>

          <div className="border border-border p-6 text-left space-y-3 bg-muted/20">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground uppercase tracking-wider text-xs">Order ID</span>
              <span className="font-medium">#{placedOrder.orderId.slice(0, 8).toUpperCase()}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground uppercase tracking-wider text-xs">Total Paid</span>
              <span className="font-medium">{formatPrice(paymentMethod === "INSTALMENT" ? dueTodayEmi : placedOrder.totalAmount)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground uppercase tracking-wider text-xs">Payment</span>
              <span className="font-medium">{paymentMethod === "INSTALMENT" ? `${emiMonths}-Month EMI` : "Full Payment"}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground uppercase tracking-wider text-xs">Status</span>
              <span className="text-amber-600 font-medium">Pending</span>
            </div>
          </div>

          <p className="text-sm text-muted-foreground">
            A confirmation will be sent to <strong>{form.email}</strong>.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            {userId && (
              <Link href="/account?tab=orders" className="flex items-center justify-center gap-2 border border-foreground px-8 py-3.5 text-sm font-medium uppercase tracking-widest hover:bg-foreground hover:text-background transition-all">
                <Package className="w-4 h-4" />
                View Orders
              </Link>
            )}
            <Link href="/" className="flex items-center justify-center gap-2 bg-foreground text-background px-8 py-3.5 text-sm font-medium uppercase tracking-widest hover:bg-primary hover:text-primary-foreground transition-all">
              Continue Shopping
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  /* ══ MAIN CHECKOUT LAYOUT ══ */
  return (
    <div className="container mx-auto px-4 sm:px-6 py-10 max-w-6xl">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-muted-foreground uppercase tracking-widest mb-8">
        <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
        <ChevronRight className="w-3 h-3" />
        <Link href="/products" className="hover:text-foreground transition-colors">Shop</Link>
        <ChevronRight className="w-3 h-3" />
        <span className="text-foreground">Checkout</span>
      </div>

      <h1 className="text-3xl font-heading mb-8">Checkout</h1>

      <div className="flex flex-col lg:flex-row gap-12">
        {/* ── Form area ── */}
        <div className="w-full lg:w-[60%]">
          <StepBar step={step} />

          <AnimatePresence mode="wait">

            {/* ════ STEP 1 — SHIPPING ════ */}
            {step === 1 && (
              <motion.div key="step1"
                initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -24 }} transition={{ duration: 0.2 }}
                className="space-y-8"
              >
                {/* Saved addresses dropdown */}
                {savedAddresses.length > 0 && (
                  <div>
                    <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground mb-2">Use a saved address</p>
                    <div className="relative">
                      <button
                        onClick={() => setShowAddressDropdown(v => !v)}
                        className="w-full flex justify-between items-center border border-border px-4 py-3 text-sm text-left hover:border-foreground transition-colors"
                      >
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-muted-foreground" />
                          {selectedAddressId
                            ? (() => {
                                const a = savedAddresses.find(x => x.id === selectedAddressId);
                                return a ? `${a.street}, ${a.city}` : "Select address";
                              })()
                            : "Select a saved address"}
                        </div>
                        <ChevronDown className="w-4 h-4 text-muted-foreground" />
                      </button>
                      <AnimatePresence>
                        {showAddressDropdown && (
                          <motion.div
                            initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }}
                            className="absolute z-20 w-full border border-border bg-background shadow-lg mt-1"
                          >
                            {savedAddresses.map(addr => (
                              <button key={addr.id}
                                onClick={() => { applySavedAddress(addr); setShowAddressDropdown(false); }}
                                className="w-full text-left px-4 py-3 text-sm hover:bg-muted transition-colors border-b border-border/50 last:border-0"
                              >
                                <p className="font-medium">{addr.street}</p>
                                <p className="text-xs text-muted-foreground">{addr.city}, {addr.state} {addr.zipCode}</p>
                              </button>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                    <div className="flex items-center gap-3 my-5">
                      <div className="flex-1 h-px bg-border" />
                      <span className="text-xs text-muted-foreground">or enter manually</span>
                      <div className="flex-1 h-px bg-border" />
                    </div>
                  </div>
                )}

                {/* Contact */}
                <div>
                  <h2 className="text-base font-medium uppercase tracking-widest text-foreground mb-4">Contact</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {[
                      { id: "email", label: "Email *", type: "email", key: "email" as keyof ShippingForm, full: true },
                      { id: "phone", label: "Phone", type: "tel", key: "phone" as keyof ShippingForm },
                    ].map(({ id, label, type, key, full }) => (
                      <div key={id} className={full ? "sm:col-span-2" : ""}>
                        <label htmlFor={id} className="block text-xs font-medium text-muted-foreground uppercase tracking-widest mb-1.5">{label}</label>
                        <input id={id} type={type}
                          value={form[key] as string}
                          onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                          className="w-full border border-border bg-background px-4 py-3 text-sm focus:outline-none focus:border-foreground transition-colors"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Shipping address */}
                <div>
                  <h2 className="text-base font-medium uppercase tracking-widest text-foreground mb-4">Shipping Address</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {[
                      { id: "firstName", label: "First Name *", key: "firstName" as keyof ShippingForm },
                      { id: "lastName",  label: "Last Name",    key: "lastName" as keyof ShippingForm },
                      { id: "street",    label: "Address *",    key: "street" as keyof ShippingForm,  full: true },
                      { id: "city",      label: "City *",       key: "city" as keyof ShippingForm },
                      { id: "state",     label: "State / Province", key: "state" as keyof ShippingForm },
                      { id: "zipCode",   label: "ZIP Code *",   key: "zipCode" as keyof ShippingForm },
                      { id: "country",   label: "Country",      key: "country" as keyof ShippingForm },
                    ].map(({ id, label, key, full }) => (
                      <div key={id} className={full ? "sm:col-span-2" : ""}>
                        <label htmlFor={id} className="block text-xs font-medium text-muted-foreground uppercase tracking-widest mb-1.5">{label}</label>
                        <input id={id}
                          value={form[key] as string}
                          onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                          className="w-full border border-border bg-background px-4 py-3 text-sm focus:outline-none focus:border-foreground transition-colors"
                        />
                      </div>
                    ))}
                  </div>

                  {userId && (
                    <label className="flex items-center gap-2.5 mt-4 text-sm cursor-pointer">
                      <input type="checkbox" checked={form.saveAddress}
                        onChange={e => setForm(f => ({ ...f, saveAddress: e.target.checked }))}
                        className="w-4 h-4 border border-border"
                      />
                      Save this address to my account
                    </label>
                  )}
                </div>

                <button onClick={() => { if (validateStep1()) setStep(2); }}
                  className="w-full sm:w-auto bg-foreground text-background px-10 py-4 text-sm font-medium uppercase tracking-widest hover:bg-primary hover:text-primary-foreground transition-all"
                >
                  Continue to Payment
                </button>
              </motion.div>
            )}

            {/* ════ STEP 2 — PAYMENT ════ */}
            {step === 2 && (
              <motion.div key="step2"
                initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -24 }} transition={{ duration: 0.2 }}
                className="space-y-8"
              >
                <div>
                  <h2 className="text-base font-medium uppercase tracking-widest mb-4">Payment Method</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {[
                      { val: "FULL_PAYMENT",  label: "Full Payment",      sub: "Pay the total amount now",  icon: CreditCard },
                      { val: "INSTALMENT",    label: "Installment (EMI)",  sub: "Split into monthly payments", icon: Wallet },
                    ].map(({ val, label, sub, icon: Icon }) => (
                      <button key={val}
                        onClick={() => setPaymentMethod(val as "FULL_PAYMENT" | "INSTALMENT")}
                        className={`flex items-center gap-4 p-5 border text-left transition-all ${
                          paymentMethod === val
                            ? "border-foreground bg-foreground/5"
                            : "border-border hover:border-foreground/40"
                        }`}
                      >
                        <div className={`w-10 h-10 flex items-center justify-center shrink-0 ${
                          paymentMethod === val ? "bg-foreground text-background" : "bg-muted text-muted-foreground"
                        }`}>
                          <Icon className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="font-medium text-sm">{label}</p>
                          <p className="text-xs text-muted-foreground mt-0.5">{sub}</p>
                        </div>
                        {paymentMethod === val && <Check className="w-4 h-4 ml-auto text-foreground" />}
                      </button>
                    ))}
                  </div>
                </div>

                {/* EMI tenure selector */}
                <AnimatePresence>
                  {paymentMethod === "INSTALMENT" && (
                    <motion.div key="emi"
                      initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }} className="overflow-hidden"
                    >
                      <div className="border border-border p-6 space-y-5">
                        <h3 className="text-xs font-medium uppercase tracking-widest text-muted-foreground">Select Tenure</h3>
                        <div className="grid grid-cols-3 gap-3">
                          {([3, 6, 12] as const).map(m => (
                            <button key={m}
                              onClick={() => setEmiMonths(m)}
                              className={`py-4 text-center border transition-all ${
                                emiMonths === m
                                  ? "border-foreground bg-foreground text-background"
                                  : "border-border hover:border-foreground/50"
                              }`}
                            >
                              <p className="text-lg font-heading">{m}</p>
                              <p className="text-xs uppercase tracking-wider mt-0.5">months</p>
                            </button>
                          ))}
                        </div>

                        <div className="bg-muted/50 p-4 space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Monthly Payment</span>
                            <span className="font-medium">{formatPrice(monthly)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Due Today (1st installment)</span>
                            <span className="font-medium">{formatPrice(dueTodayEmi)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Interest Rate</span>
                            <span className="text-emerald-600 font-medium">0%</span>
                          </div>
                          <div className="flex justify-between border-t border-border pt-2 font-medium">
                            <span>Total Amount</span>
                            <span>{formatPrice(cartTotal)}</span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Payment notice */}
                <div className="bg-muted/30 border border-border p-5 text-sm text-muted-foreground flex gap-3">
                  <CreditCard className="w-5 h-5 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-foreground mb-1">Secure Payment</p>
                    <p>Payment processing is handled securely. This is a demo — no real charges will be made.</p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <button onClick={() => setStep(1)} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
                    <ArrowLeft className="w-4 h-4" />
                    Back to Shipping
                  </button>
                  <button onClick={() => setStep(3)}
                    className="bg-foreground text-background px-10 py-4 text-sm font-medium uppercase tracking-widest hover:bg-primary hover:text-primary-foreground transition-all"
                  >
                    Review Order
                  </button>
                </div>
              </motion.div>
            )}

            {/* ════ STEP 3 — REVIEW ════ */}
            {step === 3 && (
              <motion.div key="step3"
                initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -24 }} transition={{ duration: 0.2 }}
                className="space-y-6"
              >
                <h2 className="text-base font-medium uppercase tracking-widest">Review Your Order</h2>

                {/* Shipping summary */}
                <div className="border border-border">
                  <div className="flex justify-between items-center px-5 py-3.5 bg-muted/30 border-b border-border">
                    <p className="text-xs font-medium uppercase tracking-widest">Shipping Address</p>
                    <button onClick={() => setStep(1)} className="text-xs text-muted-foreground hover:text-foreground transition-colors">Edit</button>
                  </div>
                  <div className="px-5 py-4 text-sm space-y-0.5">
                    <p className="font-medium">{form.firstName} {form.lastName}</p>
                    <p className="text-muted-foreground">{form.street}</p>
                    <p className="text-muted-foreground">{form.city}{form.state ? `, ${form.state}` : ""} {form.zipCode}</p>
                    <p className="text-muted-foreground">{form.country}</p>
                    <p className="text-muted-foreground mt-1">{form.email}</p>
                  </div>
                </div>

                {/* Payment summary */}
                <div className="border border-border">
                  <div className="flex justify-between items-center px-5 py-3.5 bg-muted/30 border-b border-border">
                    <p className="text-xs font-medium uppercase tracking-widest">Payment</p>
                    <button onClick={() => setStep(2)} className="text-xs text-muted-foreground hover:text-foreground transition-colors">Edit</button>
                  </div>
                  <div className="px-5 py-4 text-sm">
                    {paymentMethod === "FULL_PAYMENT" ? (
                      <div className="flex items-center gap-2">
                        <CreditCard className="w-4 h-4 text-muted-foreground" />
                        <span>Full Payment — {formatPrice(cartTotal)}</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <Wallet className="w-4 h-4 text-muted-foreground" />
                        <span>{emiMonths}-Month EMI — {formatPrice(monthly)}/mo · Due today: {formatPrice(dueTodayEmi)}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Items summary */}
                <div className="border border-border">
                  <div className="px-5 py-3.5 bg-muted/30 border-b border-border">
                    <p className="text-xs font-medium uppercase tracking-widest">{cartItems.length} Items</p>
                  </div>
                  <div className="divide-y divide-border">
                    {cartItems.map(item => (
                      <div key={item.id} className="flex justify-between items-center px-5 py-3.5 text-sm">
                        <div>
                          <span className="font-medium">{item.name}</span>
                          <span className="text-muted-foreground ml-2">× {item.quantity}</span>
                          {item.variant !== "Default" && <span className="text-xs text-muted-foreground block mt-0.5">{item.variant}</span>}
                        </div>
                        <span className="font-medium">{formatPrice(item.price * item.quantity)}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Place order */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pt-2">
                  <button onClick={() => setStep(2)} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
                    <ArrowLeft className="w-4 h-4" />
                    Back to Payment
                  </button>
                  <button
                    onClick={placeOrder}
                    disabled={isPlacing}
                    className="flex items-center gap-2 bg-primary text-primary-foreground px-10 py-4 text-sm font-medium uppercase tracking-widest hover:bg-primary/90 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {isPlacing ? (
                      <><Loader2 className="w-4 h-4 animate-spin" /> Placing Order...</>
                    ) : (
                      <><Check className="w-4 h-4" /> Place Order — {formatPrice(paymentMethod === "INSTALMENT" ? dueTodayEmi : cartTotal)}</>
                    )}
                  </button>
                </div>

                <p className="text-xs text-muted-foreground">
                  By placing your order, you agree to our Terms of Service and Privacy Policy.
                </p>
              </motion.div>
            )}

          </AnimatePresence>
        </div>

        {/* ── Sidebar ── */}
        <div className="w-full lg:w-[40%]">
          {renderOrderSummary()}
        </div>
      </div>
    </div>
  );
}
