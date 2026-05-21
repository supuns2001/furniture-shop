"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  AlertTriangle, 
  DollarSign, 
  Package, 
  CreditCard, 
  TrendingUp, 
  AlertCircle, 
  Loader2,
  RefreshCw
} from "lucide-react";
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useCurrency } from "@/components/store/currency-context";

export function AdminDashboard() {
  const { formatPrice, currencySymbol } = useCurrency();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<any>(null);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch("/api/admin/dashboard");
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || "Failed to retrieve dashboard metrics");
      }
      setData(result);
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred while loading dashboard metrics.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        {/* Title skeleton */}
        <div className="flex justify-between items-center">
          <div className="h-10 w-64 bg-muted rounded-md"></div>
          <div className="h-10 w-28 bg-muted rounded-md"></div>
        </div>

        {/* Banners skeleton */}
        <div className="space-y-3">
          <div className="h-20 w-full bg-muted rounded-md"></div>
          <div className="h-20 w-full bg-muted rounded-md"></div>
        </div>

        {/* KPI Cards skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i} className="shadow-sm border-border bg-card">
              <CardHeader className="pb-2">
                <div className="h-4 w-28 bg-muted rounded-md"></div>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="h-8 w-24 bg-muted rounded-md"></div>
                <div className="h-4 w-32 bg-muted rounded-md"></div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Grid skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2 shadow-sm border-border bg-card h-[380px]"></Card>
          <Card className="shadow-sm border-border bg-card h-[380px]"></Card>
        </div>

        {/* Table skeleton */}
        <Card className="shadow-sm border-border bg-card h-[250px]"></Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4 max-w-md mx-auto text-center">
        <AlertTriangle className="w-12 h-12 text-destructive animate-bounce" />
        <h2 className="text-xl font-semibold font-heading text-foreground">Dashboard Failed to Load</h2>
        <p className="text-sm text-muted-foreground">{error}</p>
        <button
          onClick={fetchDashboardData}
          className="bg-primary text-primary-foreground px-4 py-2 text-sm font-medium rounded-md hover:bg-primary/95 transition-colors flex items-center gap-2 cursor-pointer shadow-sm mt-2"
        >
          <RefreshCw className="w-4 h-4" /> Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-heading text-foreground">Dashboard Overview</h1>
        <div className="text-sm text-muted-foreground bg-white border border-border px-4 py-2 rounded-md shadow-sm">
          Last 7 Days
        </div>
      </div>

      {/* Instalment Alert Banners */}
      <div className="space-y-3">
        {/* Overdue Alert */}
        {data.alerts.overdue.count > 0 && (
          <div className="bg-destructive/10 border-l-4 border-destructive p-4 rounded-r-md flex items-start gap-4 shadow-sm transition-all duration-300 animate-in fade-in slide-in-from-top-4">
            <AlertTriangle className="w-5 h-5 text-destructive mt-0.5 shrink-0 animate-pulse" />
            <div className="flex-1 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="font-semibold text-destructive">Overdue Instalments</h3>
                <p className="text-sm text-destructive/80 mt-1">
                  {data.alerts.overdue.count} customer{data.alerts.overdue.count > 1 ? "s have" : " has"} overdue payments. Total outstanding: {formatPrice(data.alerts.overdue.totalAmount)}
                </p>
              </div>
              <button 
                onClick={() => router.push("/admin/instalments")}
                className="whitespace-nowrap bg-destructive text-destructive-foreground px-4 py-2 text-sm font-medium rounded-md hover:bg-destructive/90 transition-colors shadow-sm cursor-pointer"
              >
                Review Overdue
              </button>
            </div>
          </div>
        )}

        {/* Due Soon Alert */}
        {data.alerts.dueSoon.count > 0 && (
          <div className="bg-orange-50 border-l-4 border-orange-500 p-4 rounded-r-md flex items-start gap-4 shadow-sm transition-all duration-300 animate-in fade-in slide-in-from-top-4">
            <AlertCircle className="w-5 h-5 text-orange-600 mt-0.5 shrink-0" />
            <div className="flex-1 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="font-semibold text-orange-800">Payments Due Soon</h3>
                <p className="text-sm text-orange-700 mt-1">
                  {data.alerts.dueSoon.count} instalment{data.alerts.dueSoon.count > 1 ? "s are" : " is"} due within the next 3 days. Total expected: {formatPrice(data.alerts.dueSoon.totalAmount)}
                </p>
              </div>
              <button 
                onClick={() => router.push("/admin/instalments")}
                className="whitespace-nowrap bg-orange-100 text-orange-800 border border-orange-200 px-4 py-2 text-sm font-medium rounded-md hover:bg-orange-200 transition-colors cursor-pointer"
              >
                View Due Soon
              </button>
            </div>
          </div>
        )}
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="shadow-sm border-border bg-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-heading">{formatPrice(data.kpis.totalRevenue)}</div>
            <p className={`text-xs flex items-center mt-1 ${data.kpis.revenueGrowth >= 0 ? "text-green-600" : "text-destructive"}`}>
              <TrendingUp className={`w-3 h-3 mr-1 ${data.kpis.revenueGrowth < 0 ? "rotate-180" : ""}`} /> 
              {data.kpis.revenueGrowth >= 0 ? "+" : ""}{data.kpis.revenueGrowth}% from last month
            </p>
          </CardContent>
        </Card>
        <Card className="shadow-sm border-border bg-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Orders</CardTitle>
            <Package className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-heading">+{data.kpis.totalOrdersCount}</div>
            <p className={`text-xs flex items-center mt-1 ${data.kpis.ordersGrowth >= 0 ? "text-green-600" : "text-destructive"}`}>
              <TrendingUp className={`w-3 h-3 mr-1 ${data.kpis.ordersGrowth < 0 ? "rotate-180" : ""}`} /> 
              {data.kpis.ordersGrowth >= 0 ? "+" : ""}{data.kpis.ordersGrowth}% from last month
            </p>
          </CardContent>
        </Card>
        <Card className="shadow-sm border-border bg-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Pending Instalments</CardTitle>
            <CreditCard className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-heading">{data.kpis.pendingInstalmentsCount}</div>
            <p className="text-xs text-muted-foreground mt-1">Requiring active collection</p>
          </CardContent>
        </Card>
        <Card className="shadow-sm border-border bg-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Low Stock Alerts</CardTitle>
            <AlertTriangle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold font-heading ${data.kpis.lowStockAlertsCount > 0 ? "text-destructive" : ""}`}>{data.kpis.lowStockAlertsCount}</div>
            <p className="text-xs text-muted-foreground mt-1">Products below stock threshold</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sales Chart */}
        <Card className="lg:col-span-2 shadow-sm border-border bg-card">
          <CardHeader>
            <CardTitle className="font-heading">Revenue Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data.salesData} margin={{ top: 5, right: 10, left: 10, bottom: 0 }}>
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
        <Card className="shadow-sm border-border bg-card">
          <CardHeader>
            <CardTitle className="font-heading">Top Selling Products</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {data.topSelling.map((product: any, i: number) => (
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
      <Card className="shadow-sm border-border bg-card">
        <CardHeader>
          <CardTitle className="font-heading">Recent Orders</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            {data.recentOrders.length === 0 ? (
              <div className="text-center py-10 text-muted-foreground">
                No recent orders found.
              </div>
            ) : (
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
                  {data.recentOrders.map((order: any, i: number) => (
                    <tr key={i} className="hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-3 font-medium text-primary cursor-pointer hover:underline" onClick={() => router.push("/admin/orders")}>{order.id}</td>
                      <td className="px-4 py-3">{order.customer}</td>
                      <td className="px-4 py-3 text-muted-foreground">{order.date}</td>
                      <td className="px-4 py-3">
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
                      <td className="px-4 py-3 text-right font-medium">{formatPrice(order.amount)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
