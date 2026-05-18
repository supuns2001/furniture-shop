"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Check, ChevronRight, CreditCard, Wallet } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function CheckoutForm() {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [paymentMethod, setPaymentMethod] = useState<"full" | "emi">("full");
  const [emiMonths, setEmiMonths] = useState<3 | 6 | 12>(3);

  // Mock cart
  const cartTotal = 1250;
  const depositAmount = paymentMethod === "emi" ? cartTotal / emiMonths : cartTotal;

  const nextStep = () => {
    if (step < 3) setStep((step + 1) as 1 | 2 | 3);
  };

  return (
    <div className="container mx-auto px-6 py-12 max-w-6xl">
      <h1 className="text-3xl font-heading text-foreground mb-8">Checkout</h1>
      
      <div className="flex flex-col lg:flex-row gap-16">
        {/* Main Checkout Area */}
        <div className="w-full lg:w-2/3">
          {/* Progress Indicator */}
          <div className="flex items-center mb-12">
            {["Address", "Payment", "Confirm"].map((label, index) => {
              const stepNumber = index + 1;
              const isActive = step === stepNumber;
              const isCompleted = step > stepNumber;
              
              return (
                <div key={label} className="flex items-center">
                  <div className={`flex items-center justify-center w-8 h-8 rounded-full text-xs font-medium ${
                    isActive ? "bg-primary text-primary-foreground" : 
                    isCompleted ? "bg-foreground text-background" : 
                    "bg-muted text-muted-foreground"
                  }`}>
                    {isCompleted ? <Check className="w-4 h-4" /> : stepNumber}
                  </div>
                  <span className={`ml-3 text-sm font-medium tracking-wide uppercase ${
                    isActive ? "text-foreground" : "text-muted-foreground"
                  }`}>
                    {label}
                  </span>
                  {index < 2 && <ChevronRight className="w-4 h-4 mx-4 text-border" />}
                </div>
              );
            })}
          </div>

          <AnimatePresence mode="wait">
            {/* Step 1: Address */}
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                <div className="space-y-4">
                  <h2 className="text-xl font-medium">Contact Information</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email address</Label>
                      <Input id="email" type="email" className="rounded-none border-border focus-visible:ring-primary h-12" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone number</Label>
                      <Input id="phone" type="tel" className="rounded-none border-border focus-visible:ring-primary h-12" />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h2 className="text-xl font-medium mt-8">Shipping Address</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First name</Label>
                      <Input id="firstName" className="rounded-none border-border focus-visible:ring-primary h-12" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last name</Label>
                      <Input id="lastName" className="rounded-none border-border focus-visible:ring-primary h-12" />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="address">Address</Label>
                      <Input id="address" className="rounded-none border-border focus-visible:ring-primary h-12" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="city">City</Label>
                      <Input id="city" className="rounded-none border-border focus-visible:ring-primary h-12" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="zipCode">ZIP Code</Label>
                      <Input id="zipCode" className="rounded-none border-border focus-visible:ring-primary h-12" />
                    </div>
                  </div>
                </div>

                <button 
                  onClick={nextStep}
                  className="w-full md:w-auto bg-foreground text-background px-10 py-4 text-sm font-medium tracking-widest uppercase hover:bg-primary transition-colors"
                >
                  Continue to Payment
                </button>
              </motion.div>
            )}

            {/* Step 2: Payment */}
            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                <div className="space-y-4">
                  <h2 className="text-xl font-medium">Payment Method</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <button
                      onClick={() => setPaymentMethod("full")}
                      className={`flex items-center gap-4 p-6 border transition-all ${
                        paymentMethod === "full" ? "border-primary bg-primary/5" : "border-border hover:border-foreground/30"
                      }`}
                    >
                      <CreditCard className={`w-6 h-6 ${paymentMethod === "full" ? "text-primary" : "text-muted-foreground"}`} />
                      <div className="text-left">
                        <h3 className="font-medium">Full Payment</h3>
                        <p className="text-sm text-muted-foreground">Pay the total amount now</p>
                      </div>
                    </button>
                    
                    <button
                      onClick={() => setPaymentMethod("emi")}
                      className={`flex items-center gap-4 p-6 border transition-all ${
                        paymentMethod === "emi" ? "border-primary bg-primary/5" : "border-border hover:border-foreground/30"
                      }`}
                    >
                      <Wallet className={`w-6 h-6 ${paymentMethod === "emi" ? "text-primary" : "text-muted-foreground"}`} />
                      <div className="text-left">
                        <h3 className="font-medium">Installment Plan</h3>
                        <p className="text-sm text-muted-foreground">0% Interest EMI</p>
                      </div>
                    </button>
                  </div>
                </div>

                <AnimatePresence>
                  {paymentMethod === "emi" && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="overflow-hidden space-y-4"
                    >
                      <h3 className="font-medium text-sm text-muted-foreground uppercase tracking-widest">Select Tenure</h3>
                      <div className="flex gap-4">
                        {[3, 6, 12].map((months) => (
                          <button
                            key={months}
                            onClick={() => setEmiMonths(months as 3 | 6 | 12)}
                            className={`flex-1 py-3 text-sm font-medium border transition-all ${
                              emiMonths === months ? "border-primary text-primary" : "border-border text-muted-foreground"
                            }`}
                          >
                            {months} Months
                          </button>
                        ))}
                      </div>
                      <div className="bg-muted p-4 text-sm mt-4">
                        <p className="mb-2"><strong>Deposit Due Today:</strong> ${(cartTotal / emiMonths).toFixed(2)}</p>
                        <p className="text-muted-foreground">Remaining balance will be billed monthly over {emiMonths - 1} months.</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="space-y-4 mt-8">
                  <h2 className="text-xl font-medium">Card Details</h2>
                  <div className="bg-muted p-6 rounded-sm border border-border flex items-center justify-center h-32">
                    <p className="text-muted-foreground text-sm">Stripe Payment Element would load here</p>
                  </div>
                </div>

                <div className="flex justify-between items-center mt-8">
                  <button 
                    onClick={() => setStep(1)}
                    className="text-sm font-medium uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Back to Address
                  </button>
                  <button 
                    onClick={nextStep}
                    className="bg-foreground text-background px-10 py-4 text-sm font-medium tracking-widest uppercase hover:bg-primary transition-colors"
                  >
                    Pay ${depositAmount.toFixed(2)}
                  </button>
                </div>
              </motion.div>
            )}

            {/* Step 3: Confirm */}
            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-16"
              >
                <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Check className="w-10 h-10 text-primary" />
                </div>
                <h2 className="text-3xl font-heading mb-4">Order Confirmed</h2>
                <p className="text-muted-foreground max-w-md mx-auto mb-8">
                  Thank you for your purchase. Your order number is #ORD-9430. We've sent a confirmation email with your order details.
                </p>
                <button 
                  onClick={() => window.location.href = '/'}
                  className="bg-foreground text-background px-10 py-4 text-sm font-medium tracking-widest uppercase hover:bg-primary transition-colors"
                >
                  Return to Home
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Order Summary */}
        <div className="w-full lg:w-1/3">
          <div className="bg-muted/30 p-8 border border-border sticky top-32">
            <h2 className="font-heading text-2xl mb-6 pb-4 border-b border-border">Order Summary</h2>
            
            <div className="space-y-4 mb-6">
              <div className="flex gap-4">
                <div className="w-16 h-16 relative bg-muted shrink-0">
                  <Image src="https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?q=80&w=200&auto=format&fit=crop" alt="Item" fill className="object-cover" />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-sm">Aria Lounge Chair</h4>
                  <p className="text-xs text-muted-foreground mt-1">Cream, Boucle</p>
                  <p className="text-sm font-medium mt-2">$1,250.00</p>
                </div>
              </div>
            </div>

            <div className="space-y-3 py-4 border-y border-border text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span>$1,250.00</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Shipping</span>
                <span>Free</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Tax</span>
                <span>Calculated at next step</span>
              </div>
            </div>

            <div className="flex justify-between items-end mt-6">
              <span className="font-medium">Total</span>
              <span className="text-2xl font-heading text-primary">${cartTotal.toFixed(2)}</span>
            </div>

            {paymentMethod === "emi" && (
              <div className="mt-4 p-3 bg-primary/5 border border-primary/20 text-sm">
                <div className="flex justify-between font-medium text-primary mb-1">
                  <span>Due Today</span>
                  <span>${depositAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Next Payment</span>
                  <span>${depositAmount.toFixed(2)} in 1 month</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
