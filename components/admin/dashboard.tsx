"use client";

import { AlertTriangle, DollarSign, Package, CreditCard, TrendingUp, AlertCircle } from "lucide-react";
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useCurrency } from "@/components/store/currency-context";

const salesData = [
  { name: "Mon", total: Math.floor(Math.random() * 5000) + 1000 },
  { name: "Tue", total: Math.floor(Math.random() * 5000) + 1000 },
  { name: "Wed", total: Math.floor(Math.random() * 5000) + 1000 },
  { name: "Thu", total: Math.floor(Math.random() * 5000) + 1000 },
  { name: "Fri", total: Math.floor(Math.random() * 5000) + 1000 },
  { name: "Sat", total: Math.floor(Math.random() * 5000) + 1000 },
  { name: "Sun", total: Math.floor(Math.random() * 5000) + 1000 },
];

export function AdminDashboard() {
  const { formatPrice, currencySymbol } = useCurrency();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-heading text-foreground">Dashboard Overview</h1>
        <div className="text-sm text-muted-foreground bg-white border border-border px-4 py-2 rounded-md shadow-sm">
          Last 30 Days
        </div>
      </div>

      {/* Instalment Alert Banners */}
      <div className="space-y-3">
        {/* Overdue Alert */}
        <div className="bg-destructive/10 border-l-4 border-destructive p-4 rounded-r-md flex items-start gap-4 shadow-sm">
          <AlertTriangle className="w-5 h-5 text-destructive mt-0.5 shrink-0" />
          <div className="flex-1 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="font-semibold text-destructive">Overdue Instalments</h3>
              <p className="text-sm text-destructive/80 mt-1">
                3 customers have overdue payments. Total outstanding: {formatPrice(1250)}
              </p>
            </div>
            <button className="whitespace-nowrap bg-destructive text-destructive-foreground px-4 py-2 text-sm font-medium rounded-md hover:bg-destructive/90 transition-colors shadow-sm">
              Review Overdue
            </button>
          </div>
        </div>

        {/* Due Soon Alert */}
        <div className="bg-orange-50 border-l-4 border-orange-500 p-4 rounded-r-md flex items-start gap-4 shadow-sm">
          <AlertCircle className="w-5 h-5 text-orange-600 mt-0.5 shrink-0" />
          <div className="flex-1 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="font-semibold text-orange-800">Payments Due Soon</h3>
              <p className="text-sm text-orange-700 mt-1">
                12 instalments are due within the next 3 days. Total expected: {formatPrice(4580)}
              </p>
            </div>
            <button className="whitespace-nowrap bg-orange-100 text-orange-800 border border-orange-200 px-4 py-2 text-sm font-medium rounded-md hover:bg-orange-200 transition-colors">
              View Due Soon
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="shadow-sm border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-heading">{formatPrice(45231.89)}</div>
            <p className="text-xs text-green-600 flex items-center mt-1">
              <TrendingUp className="w-3 h-3 mr-1" /> +20.1% from last month
            </p>
          </CardContent>
        </Card>
        <Card className="shadow-sm border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Orders</CardTitle>
            <Package className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-heading">+2350</div>
            <p className="text-xs text-green-600 flex items-center mt-1">
              <TrendingUp className="w-3 h-3 mr-1" /> +180.1% from last month
            </p>
          </CardContent>
        </Card>
        <Card className="shadow-sm border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Pending Instalments</CardTitle>
            <CreditCard className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-heading">15</div>
            <p className="text-xs text-muted-foreground mt-1">Requiring attention</p>
          </CardContent>
        </Card>
        <Card className="shadow-sm border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Low Stock Alerts</CardTitle>
            <AlertTriangle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-heading text-destructive">4</div>
            <p className="text-xs text-muted-foreground mt-1">Products below threshold</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sales Chart */}
        <Card className="lg:col-span-2 shadow-sm border-border">
          <CardHeader>
            <CardTitle className="font-heading">Revenue Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={salesData} margin={{ top: 5, right: 10, left: 10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E5E0" />
                  <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis
                    stroke="#888888"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => `${currencySymbol}${value}`}
                  />
                  <Tooltip 
                    contentStyle={{ backgroundColor: "#FFFFFF", borderRadius: "8px", border: "1px solid #E5E5E0", boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)" }}
                    itemStyle={{ color: "#1C1C1A" }}
                  />
                  <Line type="monotone" dataKey="total" stroke="#C9A96E" strokeWidth={3} dot={{ r: 4, fill: "#C9A96E", strokeWidth: 0 }} activeDot={{ r: 6, strokeWidth: 0 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Top Selling Products */}
        <Card className="shadow-sm border-border">
          <CardHeader>
            <CardTitle className="font-heading">Top Selling Products</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {[
                { name: "Aria Lounge Chair", sales: 245, revenue: 306250 },
                { name: "Nordic Minimalist Sofa", sales: 180, revenue: 612000 },
                { name: "Walnut Dining Table", sales: 124, revenue: 347200 },
                { name: "Ceramic Table Lamp", sales: 89, revenue: 40050 },
                { name: "Velvet Accent Chair", sales: 76, revenue: 67640 },
              ].map((product, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none">{product.name}</p>
                    <p className="text-xs text-muted-foreground">{product.sales} sales</p>
                  </div>
                  <div className="font-medium text-sm">{formatPrice(product.revenue)}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Orders Table */}
      <Card className="shadow-sm border-border">
        <CardHeader>
          <CardTitle className="font-heading">Recent Orders</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-muted-foreground uppercase bg-muted/50 rounded-md">
                <tr>
                  <th className="px-4 py-3 font-medium rounded-l-md">Order ID</th>
                  <th className="px-4 py-3 font-medium">Customer</th>
                  <th className="px-4 py-3 font-medium">Date</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium text-right rounded-r-md">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {[
                  { id: "#ORD-9430", customer: "Liam Johnson", date: "Today, 10:42 AM", status: "Processing", amount: 3400 },
                  { id: "#ORD-9429", customer: "Emma Davis", date: "Today, 09:15 AM", status: "Shipped", amount: 1250 },
                  { id: "#ORD-9428", customer: "Noah Smith", date: "Yesterday, 04:30 PM", status: "Pending", amount: 4500 },
                  { id: "#ORD-9427", customer: "Olivia Wilson", date: "Yesterday, 11:20 AM", status: "Delivered", amount: 850 },
                ].map((order, i) => (
                  <tr key={i} className="hover:bg-muted/30 transition-colors">
                    <td className="px-4 py-3 font-medium">{order.id}</td>
                    <td className="px-4 py-3">{order.customer}</td>
                    <td className="px-4 py-3 text-muted-foreground">{order.date}</td>
                    <td className="px-4 py-3">
                      <Badge variant="outline" className={`font-normal rounded-md text-xs
                        ${order.status === 'Processing' ? 'bg-blue-50 text-blue-700 border-blue-200' : ''}
                        ${order.status === 'Shipped' ? 'bg-purple-50 text-purple-700 border-purple-200' : ''}
                        ${order.status === 'Delivered' ? 'bg-green-50 text-green-700 border-green-200' : ''}
                        ${order.status === 'Pending' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' : ''}
                      `}>
                        {order.status}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-right font-medium">{formatPrice(order.amount)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
