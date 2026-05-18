"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CreditCard, Package, User, Heart, Settings, LogOut, MapPin, AlertCircle, Clock } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export function AccountDashboard() {
  const [activeTab, setActiveTab] = useState("overview");

  // Mock data
  const user = { name: "Jane Doe", email: "jane@example.com" };
  const instalments = [
    {
      id: "INST-1234",
      product: "Aria Lounge Chair",
      totalAmount: 1250,
      paidAmount: 416.66,
      nextDueDate: "2026-06-18",
      nextAmount: 416.67,
      status: "ACTIVE",
      daysUntilDue: 30
    },
    {
      id: "INST-0987",
      product: "Nordic Minimalist Sofa",
      totalAmount: 3400,
      paidAmount: 1133.33,
      nextDueDate: "2026-05-19",
      nextAmount: 1133.33,
      status: "ACTIVE",
      daysUntilDue: 1
    }
  ];

  return (
    <div className="container mx-auto px-6 py-12 max-w-7xl">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar */}
        <div className="w-full md:w-64 shrink-0">
          <div className="mb-8">
            <h1 className="text-2xl font-heading text-foreground mb-1">My Account</h1>
            <p className="text-sm text-muted-foreground">Welcome back, {user.name.split(" ")[0]}</p>
          </div>

          <nav className="space-y-1">
            {[
              { id: "overview", label: "Dashboard", icon: User },
              { id: "orders", label: "Order History", icon: Package },
              { id: "instalments", label: "EMI Plans", icon: CreditCard },
              { id: "wishlist", label: "Wishlist", icon: Heart },
              { id: "addresses", label: "Addresses", icon: MapPin },
              { id: "settings", label: "Settings", icon: Settings },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors ${
                  activeTab === item.id 
                    ? "bg-foreground text-background" 
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </button>
            ))}
            <button className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors mt-8">
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 min-h-[600px]">
          <AnimatePresence mode="wait">
            {activeTab === "overview" && (
              <motion.div
                key="overview"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-8"
              >
                {/* Due Soon Alert */}
                {instalments.filter(i => i.daysUntilDue <= 3).map(instalment => (
                  <div key={instalment.id} className="bg-primary/10 border border-primary/20 p-6 flex flex-col sm:flex-row gap-6 items-center justify-between">
                    <div className="flex items-start gap-4">
                      <AlertCircle className="w-6 h-6 text-primary shrink-0 mt-0.5" />
                      <div>
                        <h3 className="font-medium text-primary">Payment Due Soon</h3>
                        <p className="text-sm text-primary/80 mt-1">
                          Your EMI payment of ${instalment.nextAmount} for the {instalment.product} is due in {instalment.daysUntilDue} day(s).
                        </p>
                      </div>
                    </div>
                    <button className="whitespace-nowrap bg-primary text-primary-foreground px-6 py-2 text-sm font-medium uppercase tracking-wider hover:bg-primary/90 transition-colors">
                      Pay Now
                    </button>
                  </div>
                ))}

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <Card className="rounded-none border-border shadow-none">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-widest">Active Orders</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-heading">2</div>
                    </CardContent>
                  </Card>
                  <Card className="rounded-none border-border shadow-none">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-widest">Active EMIs</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-heading">2</div>
                    </CardContent>
                  </Card>
                  <Card className="rounded-none border-border shadow-none">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-widest">Wishlist Items</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-heading">4</div>
                    </CardContent>
                  </Card>
                </div>

                <div>
                  <h2 className="text-xl font-heading mb-6">Recent Orders</h2>
                  <div className="border border-border">
                    <table className="w-full text-sm text-left">
                      <thead className="bg-muted text-muted-foreground uppercase tracking-wider text-xs">
                        <tr>
                          <th className="px-6 py-4 font-medium">Order ID</th>
                          <th className="px-6 py-4 font-medium">Date</th>
                          <th className="px-6 py-4 font-medium">Status</th>
                          <th className="px-6 py-4 font-medium text-right">Total</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border">
                        <tr className="hover:bg-muted/50 transition-colors">
                          <td className="px-6 py-4 font-medium">#ORD-9430</td>
                          <td className="px-6 py-4 text-muted-foreground">May 16, 2026</td>
                          <td className="px-6 py-4">
                            <Badge variant="outline" className="rounded-none font-normal text-xs bg-secondary/10 text-secondary border-secondary/20">Processing</Badge>
                          </td>
                          <td className="px-6 py-4 text-right font-medium">$3,400.00</td>
                        </tr>
                        <tr className="hover:bg-muted/50 transition-colors">
                          <td className="px-6 py-4 font-medium">#ORD-8211</td>
                          <td className="px-6 py-4 text-muted-foreground">Apr 22, 2026</td>
                          <td className="px-6 py-4">
                            <Badge variant="outline" className="rounded-none font-normal text-xs">Delivered</Badge>
                          </td>
                          <td className="px-6 py-4 text-right font-medium">$1,250.00</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === "instalments" && (
              <motion.div
                key="instalments"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-8"
              >
                <h2 className="text-2xl font-heading mb-6">Your Installment Plans</h2>
                <div className="space-y-6">
                  {instalments.map((plan) => (
                    <div key={plan.id} className="border border-border p-6 flex flex-col lg:flex-row gap-8 justify-between bg-card">
                      <div className="space-y-4 flex-1">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-medium text-lg">{plan.product}</h3>
                            <p className="text-sm text-muted-foreground mt-1">Plan ID: {plan.id}</p>
                          </div>
                          <Badge variant="outline" className="rounded-none font-normal text-xs border-primary text-primary">Active</Badge>
                        </div>
                        
                        <div className="w-full bg-muted h-2 mt-4">
                          <div 
                            className="bg-primary h-2" 
                            style={{ width: `${(plan.paidAmount / plan.totalAmount) * 100}%` }}
                          />
                        </div>
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>${plan.paidAmount.toLocaleString()} paid</span>
                          <span>${plan.totalAmount.toLocaleString()} total</span>
                        </div>
                      </div>

                      <div className="w-full lg:w-64 p-4 bg-muted/50 border border-border flex flex-col justify-center">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                          <Clock className="w-4 h-4" />
                          <span>Next due: {plan.nextDueDate}</span>
                        </div>
                        <p className="text-2xl font-heading text-foreground mb-4">${plan.nextAmount}</p>
                        <button className="w-full bg-foreground text-background py-3 text-sm font-medium uppercase tracking-wider hover:bg-primary hover:text-primary-foreground transition-colors">
                          Make Payment
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
            
            {/* Other tabs placeholders */}
            {["orders", "wishlist", "addresses", "settings"].includes(activeTab) && (
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="py-12 text-center text-muted-foreground border border-dashed border-border"
              >
                <p className="capitalize">{activeTab} section coming soon</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
