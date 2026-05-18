"use client";

import { Download, BarChart2, TrendingUp, PieChart, DollarSign } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function ReportsManagement() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl font-heading text-foreground">Reports & Analytics</h1>
        <button className="bg-muted text-foreground border border-border px-4 py-2 text-sm font-medium rounded-md hover:bg-muted/80 transition-colors flex items-center gap-2">
          <Download className="w-4 h-4" /> Export All Reports
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="shadow-sm border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Sales (YTD)</CardTitle>
            <DollarSign className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-heading">$842,500.00</div>
            <p className="text-xs text-green-600 flex items-center mt-1">
              <TrendingUp className="w-3 h-3 mr-1" /> +12% YoY
            </p>
          </CardContent>
        </Card>
        <Card className="shadow-sm border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Avg. Order Value</CardTitle>
            <BarChart2 className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-heading">$1,450.00</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Placeholder for complex charts */}
        <Card className="shadow-sm border-border h-96 flex flex-col">
          <CardHeader>
            <CardTitle className="font-heading flex items-center gap-2"><BarChart2 className="w-5 h-5"/> Monthly Revenue</CardTitle>
          </CardHeader>
          <CardContent className="flex-1 flex items-center justify-center bg-muted/20 border-t border-border">
             <p className="text-muted-foreground text-sm">Detailed revenue chart visualization goes here.</p>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-border h-96 flex flex-col">
          <CardHeader>
            <CardTitle className="font-heading flex items-center gap-2"><PieChart className="w-5 h-5"/> Sales by Category</CardTitle>
          </CardHeader>
          <CardContent className="flex-1 flex items-center justify-center bg-muted/20 border-t border-border">
             <p className="text-muted-foreground text-sm">Category breakdown chart visualization goes here.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
