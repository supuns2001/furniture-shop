"use client";

import { useState } from "react";
import { AlertCircle, AlertTriangle, CheckCircle2, ChevronRight, Filter, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

export function InstalmentManagement() {
  const [activeTab, setActiveTab] = useState("all");

  const plans = [
    { id: "INST-1029", customer: "John Doe", order: "#ORD-9430", total: 1250, paid: 416.66, remaining: 833.34, status: "OVERDUE", daysLate: 5, nextAmount: 416.67 },
    { id: "INST-1030", customer: "Jane Smith", order: "#ORD-9428", total: 3400, paid: 1133.33, remaining: 2266.67, status: "DUE_SOON", daysUntilDue: 2, nextAmount: 1133.33 },
    { id: "INST-1031", customer: "Alice Johnson", order: "#ORD-9425", total: 850, paid: 425, remaining: 425, status: "ACTIVE", daysUntilDue: 15, nextAmount: 425 },
    { id: "INST-1032", customer: "Bob Brown", order: "#ORD-9410", total: 4500, paid: 4500, remaining: 0, status: "COMPLETED", nextAmount: 0 },
    { id: "INST-1033", customer: "Charlie Davis", order: "#ORD-9405", total: 1850, paid: 616.66, remaining: 1233.34, status: "OVERDUE", daysLate: 12, nextAmount: 616.67 },
  ];

  const filteredPlans = plans.filter(plan => {
    if (activeTab === "all") return true;
    if (activeTab === "overdue") return plan.status === "OVERDUE";
    if (activeTab === "due_soon") return plan.status === "DUE_SOON";
    if (activeTab === "completed") return plan.status === "COMPLETED";
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-heading text-foreground">Instalment Plans</h1>
        <button className="bg-foreground text-background px-4 py-2 text-sm font-medium rounded-md hover:bg-primary transition-colors">
          Export Report
        </button>
      </div>

      {/* KPI Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-card border border-border p-4 rounded-md shadow-sm">
          <p className="text-sm text-muted-foreground font-medium mb-1">Active Plans</p>
          <p className="text-2xl font-heading">245</p>
        </div>
        <div className="bg-card border border-border p-4 rounded-md shadow-sm">
          <p className="text-sm text-muted-foreground font-medium mb-1">Total Expected (30 Days)</p>
          <p className="text-2xl font-heading">$45,200</p>
        </div>
        <div className="bg-orange-50 border border-orange-200 p-4 rounded-md shadow-sm">
          <p className="text-sm text-orange-800 font-medium mb-1 flex items-center gap-2">
            <AlertCircle className="w-4 h-4" /> Due Soon
          </p>
          <p className="text-2xl font-heading text-orange-900">12</p>
        </div>
        <div className="bg-destructive/10 border border-destructive/20 p-4 rounded-md shadow-sm">
          <p className="text-sm text-destructive font-medium mb-1 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4" /> Overdue
          </p>
          <p className="text-2xl font-heading text-destructive">3</p>
        </div>
      </div>

      <div className="bg-card border border-border rounded-md shadow-sm">
        <div className="p-4 border-b border-border flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex gap-2 w-full sm:w-auto overflow-x-auto hide-scrollbar">
            {[
              { id: "all", label: "All Plans" },
              { id: "due_soon", label: "Due Soon" },
              { id: "overdue", label: "Overdue" },
              { id: "completed", label: "Completed" },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-colors whitespace-nowrap ${
                  activeTab === tab.id 
                    ? "bg-muted text-foreground" 
                    : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input 
                placeholder="Search plan ID, customer..." 
                className="pl-9 h-9 text-sm"
              />
            </div>
            <button className="p-2 border border-border rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
              <Filter className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-muted-foreground uppercase bg-muted/50">
              <tr>
                <th className="px-6 py-4 font-medium">Plan ID / Order</th>
                <th className="px-6 py-4 font-medium">Customer</th>
                <th className="px-6 py-4 font-medium">Progress</th>
                <th className="px-6 py-4 font-medium">Status / Due</th>
                <th className="px-6 py-4 font-medium text-right">Next Amount</th>
                <th className="px-6 py-4 font-medium text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredPlans.map(plan => (
                <tr key={plan.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-6 py-4">
                    <p className="font-medium text-foreground">{plan.id}</p>
                    <p className="text-xs text-muted-foreground mt-1">{plan.order}</p>
                  </td>
                  <td className="px-6 py-4 font-medium">{plan.customer}</td>
                  <td className="px-6 py-4">
                    <div className="w-32">
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-muted-foreground">${plan.paid.toFixed(0)}</span>
                        <span className="font-medium">${plan.total.toFixed(0)}</span>
                      </div>
                      <div className="w-full bg-muted h-1.5 rounded-full overflow-hidden">
                        <div 
                          className={`h-full ${plan.status === 'COMPLETED' ? 'bg-green-500' : 'bg-primary'}`}
                          style={{ width: `${(plan.paid / plan.total) * 100}%` }}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {plan.status === "OVERDUE" && (
                      <div>
                        <Badge variant="destructive" className="rounded-md font-normal text-xs mb-1">Overdue</Badge>
                        <p className="text-xs text-destructive font-medium flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3" /> {plan.daysLate} days late
                        </p>
                      </div>
                    )}
                    {plan.status === "DUE_SOON" && (
                      <div>
                        <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200 rounded-md font-normal text-xs mb-1">Due Soon</Badge>
                        <p className="text-xs text-orange-700 font-medium flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" /> In {plan.daysUntilDue} days
                        </p>
                      </div>
                    )}
                    {plan.status === "ACTIVE" && (
                      <div>
                        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 rounded-md font-normal text-xs mb-1">Active</Badge>
                        <p className="text-xs text-muted-foreground mt-1">In {plan.daysUntilDue} days</p>
                      </div>
                    )}
                    {plan.status === "COMPLETED" && (
                      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 rounded-md font-normal text-xs">
                        <CheckCircle2 className="w-3 h-3 mr-1" /> Completed
                      </Badge>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right font-medium">
                    {plan.nextAmount > 0 ? `$${plan.nextAmount.toFixed(2)}` : '-'}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="p-2 text-muted-foreground hover:text-foreground transition-colors hover:bg-muted rounded-md inline-flex">
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
