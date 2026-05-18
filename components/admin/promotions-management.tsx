"use client";

import { Plus, Search, Filter, Trash2, Edit } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

export function PromotionsManagement() {
  const promotions = [
    { id: "PRM-01", code: "SUMMER26", discount: "20% OFF", type: "Percentage", usage: "145 / 500", expiry: "Aug 31, 2026", status: "Active" },
    { id: "PRM-02", code: "FREESHIP", discount: "Free Shipping", type: "Shipping", usage: "34 / Unlimited", expiry: "Dec 31, 2026", status: "Active" },
    { id: "PRM-03", code: "WELCOME10", discount: "10% OFF", type: "Percentage", usage: "89 / Unlimited", expiry: "None", status: "Active" },
    { id: "PRM-04", code: "FLASH50", discount: "$50 OFF", type: "Fixed Amount", usage: "100 / 100", expiry: "May 15, 2026", status: "Expired" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl font-heading text-foreground">Promotions & Coupons</h1>
        <button className="bg-foreground text-background px-4 py-2 text-sm font-medium rounded-md hover:bg-primary transition-colors flex items-center gap-2">
          <Plus className="w-4 h-4" /> Create Promotion
        </button>
      </div>

      <div className="bg-card border border-border rounded-md shadow-sm">
        <div className="p-4 border-b border-border flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input placeholder="Search codes..." className="pl-9 h-9 text-sm" />
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
                <th className="px-6 py-4 font-medium">Promo Code</th>
                <th className="px-6 py-4 font-medium">Discount</th>
                <th className="px-6 py-4 font-medium">Usage</th>
                <th className="px-6 py-4 font-medium">Expiry Date</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {promotions.map(promo => (
                <tr key={promo.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-6 py-4">
                    <p className="font-bold text-foreground font-mono">{promo.code}</p>
                    <p className="text-xs text-muted-foreground mt-1">{promo.type}</p>
                  </td>
                  <td className="px-6 py-4 font-medium text-primary">{promo.discount}</td>
                  <td className="px-6 py-4 text-muted-foreground">{promo.usage}</td>
                  <td className="px-6 py-4 text-muted-foreground">{promo.expiry}</td>
                  <td className="px-6 py-4">
                    <Badge variant="outline" className={`font-normal rounded-md text-xs
                      ${promo.status === 'Active' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-gray-100 text-gray-600 border-gray-200'}
                    `}>
                      {promo.status}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button className="p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-colors">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="p-1.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-md transition-colors">
                        <Trash2 className="w-4 h-4" />
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
