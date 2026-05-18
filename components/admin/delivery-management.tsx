"use client";

import { Search, Filter, Truck, CheckCircle2, Clock } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

export function DeliveryManagement() {
  const shipments = [
    { id: "SHP-001", orderId: "#ORD-9430", customer: "Liam Johnson", courier: "FedEx Freight", tracking: "FX837492819", status: "In Transit", estimated: "May 20, 2026" },
    { id: "SHP-002", orderId: "#ORD-9429", customer: "Emma Davis", courier: "UPS Ground", tracking: "1Z9999999999999999", status: "Out for Delivery", estimated: "Today" },
    { id: "SHP-003", orderId: "#ORD-9428", customer: "Noah Smith", courier: "Pending", tracking: "-", status: "Pending Pickup", estimated: "TBD" },
    { id: "SHP-004", orderId: "#ORD-9427", customer: "Olivia Wilson", courier: "FedEx Home", tracking: "FX837492820", status: "Delivered", estimated: "Delivered on May 17" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl font-heading text-foreground">Delivery & Shipping</h1>
      </div>

      <div className="bg-card border border-border rounded-md shadow-sm">
        <div className="p-4 border-b border-border flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input placeholder="Search shipments..." className="pl-9 h-9 text-sm" />
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
                <th className="px-6 py-4 font-medium">Shipment ID</th>
                <th className="px-6 py-4 font-medium">Order & Customer</th>
                <th className="px-6 py-4 font-medium">Courier</th>
                <th className="px-6 py-4 font-medium">Tracking #</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium">Estimated Delivery</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {shipments.map(shipment => (
                <tr key={shipment.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-6 py-4 font-medium">{shipment.id}</td>
                  <td className="px-6 py-4">
                    <p className="font-medium text-foreground">{shipment.orderId}</p>
                    <p className="text-xs text-muted-foreground mt-1">{shipment.customer}</p>
                  </td>
                  <td className="px-6 py-4 text-muted-foreground flex items-center gap-2">
                    {shipment.courier !== 'Pending' && <Truck className="w-3 h-3" />}
                    {shipment.courier}
                  </td>
                  <td className="px-6 py-4 font-mono text-xs">{shipment.tracking}</td>
                  <td className="px-6 py-4">
                    <Badge variant="outline" className={`font-normal rounded-md text-xs
                      ${shipment.status === 'In Transit' ? 'bg-blue-50 text-blue-700 border-blue-200' : ''}
                      ${shipment.status === 'Out for Delivery' ? 'bg-purple-50 text-purple-700 border-purple-200' : ''}
                      ${shipment.status === 'Delivered' ? 'bg-green-50 text-green-700 border-green-200' : ''}
                      ${shipment.status === 'Pending Pickup' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' : ''}
                    `}>
                      {shipment.status}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 text-muted-foreground flex items-center gap-2">
                    {shipment.status === 'Delivered' ? <CheckCircle2 className="w-3 h-3 text-green-600" /> : <Clock className="w-3 h-3" />}
                    {shipment.estimated}
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
