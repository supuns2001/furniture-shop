"use client";

import { useState } from "react";
import { Search, Filter, Mail, MoreVertical } from "lucide-react";
import { Input } from "@/components/ui/input";

export function CustomersManagement() {
  const [activeTab, setActiveTab] = useState("all");

  const customers = [
    { id: "CUST-001", name: "Liam Johnson", email: "liam@example.com", orders: 4, spent: 8500, lastOrder: "May 18, 2026", status: "Active" },
    { id: "CUST-002", name: "Emma Davis", email: "emma@example.com", orders: 2, spent: 3450, lastOrder: "May 18, 2026", status: "Active" },
    { id: "CUST-003", name: "Noah Smith", email: "noah@example.com", orders: 1, spent: 4500, lastOrder: "May 17, 2026", status: "New" },
    { id: "CUST-004", name: "Olivia Wilson", email: "olivia@example.com", orders: 8, spent: 12400, lastOrder: "May 17, 2026", status: "VIP" },
    { id: "CUST-005", name: "William Brown", email: "william@example.com", orders: 1, spent: 0, lastOrder: "May 16, 2026", status: "Inactive" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl font-heading text-foreground">Customers</h1>
      </div>

      <div className="bg-card border border-border rounded-md shadow-sm">
        <div className="p-4 border-b border-border flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex gap-2 w-full sm:w-auto overflow-x-auto hide-scrollbar">
            {["all", "active", "new", "vip"].map(tab => (
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
              <Input placeholder="Search customers..." className="pl-9 h-9 text-sm" />
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
                <th className="px-6 py-4 font-medium">Customer Name</th>
                <th className="px-6 py-4 font-medium">Email</th>
                <th className="px-6 py-4 font-medium">Orders</th>
                <th className="px-6 py-4 font-medium">Total Spent</th>
                <th className="px-6 py-4 font-medium">Last Order</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {customers.map(customer => (
                <tr key={customer.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-6 py-4">
                    <p className="font-medium text-foreground flex items-center gap-2">
                      {customer.name}
                      {customer.status === 'VIP' && <span className="bg-primary/20 text-primary text-[10px] px-1.5 py-0.5 rounded-sm uppercase tracking-widest font-bold">VIP</span>}
                      {customer.status === 'New' && <span className="bg-green-100 text-green-700 text-[10px] px-1.5 py-0.5 rounded-sm uppercase tracking-widest font-bold">New</span>}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">{customer.id}</p>
                  </td>
                  <td className="px-6 py-4 text-muted-foreground">{customer.email}</td>
                  <td className="px-6 py-4 font-medium">{customer.orders}</td>
                  <td className="px-6 py-4 font-medium">${customer.spent.toLocaleString()}</td>
                  <td className="px-6 py-4 text-muted-foreground">{customer.lastOrder}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button className="p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-colors" title="Send Email">
                        <Mail className="w-4 h-4" />
                      </button>
                      <button className="p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-colors">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </div>
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
