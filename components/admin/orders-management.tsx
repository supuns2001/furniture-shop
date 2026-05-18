"use client";

import { useState } from "react";
import { Search, Filter, Eye, Download } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

export function OrdersManagement() {
  const [activeTab, setActiveTab] = useState("all");

  const orders = [
    { id: "#ORD-9430", date: "May 18, 2026", customer: "Liam Johnson", total: 3400, items: 2, status: "Processing", payment: "Paid (EMI)" },
    { id: "#ORD-9429", date: "May 18, 2026", customer: "Emma Davis", total: 1250, items: 1, status: "Shipped", payment: "Paid (Full)" },
    { id: "#ORD-9428", date: "May 17, 2026", customer: "Noah Smith", total: 4500, items: 3, status: "Pending", payment: "Pending" },
    { id: "#ORD-9427", date: "May 17, 2026", customer: "Olivia Wilson", total: 850, items: 1, status: "Delivered", payment: "Paid (Full)" },
    { id: "#ORD-9426", date: "May 16, 2026", customer: "William Brown", total: 2800, items: 1, status: "Cancelled", payment: "Refunded" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl font-heading text-foreground">Orders</h1>
        <button className="bg-muted text-foreground border border-border px-4 py-2 text-sm font-medium rounded-md hover:bg-muted/80 transition-colors flex items-center gap-2">
          <Download className="w-4 h-4" /> Export CSV
        </button>
      </div>

      <div className="bg-card border border-border rounded-md shadow-sm">
        <div className="p-4 border-b border-border flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex gap-2 w-full sm:w-auto overflow-x-auto hide-scrollbar">
            {["all", "pending", "processing", "shipped", "delivered"].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-colors whitespace-nowrap capitalize ${
                  activeTab === tab 
                    ? "bg-muted text-foreground" 
                    : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input placeholder="Search orders..." className="pl-9 h-9 text-sm" />
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
                <th className="px-6 py-4 font-medium">Order ID</th>
                <th className="px-6 py-4 font-medium">Date</th>
                <th className="px-6 py-4 font-medium">Customer</th>
                <th className="px-6 py-4 font-medium">Total</th>
                <th className="px-6 py-4 font-medium">Payment</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {orders.map(order => (
                <tr key={order.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-6 py-4 font-medium">{order.id}</td>
                  <td className="px-6 py-4 text-muted-foreground">{order.date}</td>
                  <td className="px-6 py-4">{order.customer}</td>
                  <td className="px-6 py-4">
                    <p className="font-medium">${order.total.toLocaleString()}</p>
                    <p className="text-xs text-muted-foreground mt-1">{order.items} items</p>
                  </td>
                  <td className="px-6 py-4 text-muted-foreground">{order.payment}</td>
                  <td className="px-6 py-4">
                    <Badge variant="outline" className={`font-normal rounded-md text-xs
                      ${order.status === 'Processing' ? 'bg-blue-50 text-blue-700 border-blue-200' : ''}
                      ${order.status === 'Shipped' ? 'bg-purple-50 text-purple-700 border-purple-200' : ''}
                      ${order.status === 'Delivered' ? 'bg-green-50 text-green-700 border-green-200' : ''}
                      ${order.status === 'Pending' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' : ''}
                      ${order.status === 'Cancelled' ? 'bg-red-50 text-red-700 border-red-200' : ''}
                    `}>
                      {order.status}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-colors">
                      <Eye className="w-4 h-4" />
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
