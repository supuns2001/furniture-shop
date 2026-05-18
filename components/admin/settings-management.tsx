"use client";

import { Save } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export function SettingsManagement() {
  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl font-heading text-foreground">Settings</h1>
        <button className="bg-foreground text-background px-6 py-2 text-sm font-medium rounded-md hover:bg-primary transition-colors flex items-center gap-2">
          <Save className="w-4 h-4" /> Save Changes
        </button>
      </div>

      <Card className="shadow-sm border-border">
        <CardHeader>
          <CardTitle className="font-heading">Store Profile</CardTitle>
          <CardDescription>Update your store's basic information.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="storeName">Store Name</Label>
              <Input id="storeName" defaultValue="Lumen Furniture" className="border-border focus-visible:ring-primary" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="supportEmail">Support Email</Label>
              <Input id="supportEmail" defaultValue="support@lumen.com" className="border-border focus-visible:ring-primary" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-sm border-border">
        <CardHeader>
          <CardTitle className="font-heading">Payment & EMI</CardTitle>
          <CardDescription>Configure payment gateways and installment options.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="currency">Currency</Label>
              <Input id="currency" defaultValue="USD ($)" disabled className="bg-muted text-muted-foreground border-border" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="emiRate">Default EMI Interest Rate (%)</Label>
              <Input id="emiRate" defaultValue="0" className="border-border focus-visible:ring-primary" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-sm border-border">
        <CardHeader>
          <CardTitle className="font-heading">Notifications</CardTitle>
          <CardDescription>Manage automated email notifications.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 text-sm">
          <div className="flex items-center justify-between py-2 border-b border-border">
            <div>
              <p className="font-medium">Order Confirmations</p>
              <p className="text-muted-foreground text-xs">Send email to customer when order is placed.</p>
            </div>
            <input type="checkbox" defaultChecked className="w-4 h-4 accent-primary" />
          </div>
          <div className="flex items-center justify-between py-2 border-b border-border">
            <div>
              <p className="font-medium">EMI Payment Reminders</p>
              <p className="text-muted-foreground text-xs">Send reminder 3 days before EMI is due.</p>
            </div>
            <input type="checkbox" defaultChecked className="w-4 h-4 accent-primary" />
          </div>
          <div className="flex items-center justify-between py-2">
            <div>
              <p className="font-medium">Low Stock Alerts</p>
              <p className="text-muted-foreground text-xs">Notify admin when product stock falls below 5.</p>
            </div>
            <input type="checkbox" defaultChecked className="w-4 h-4 accent-primary" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
