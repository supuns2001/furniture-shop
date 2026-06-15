"use client";

import { useState, useEffect } from "react";
import { Save, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { toast } from "sonner";

export function SettingsManagement() {
  const [settings, setSettings] = useState({
    storeName: "Lumen Furniture",
    supportEmail: "support@lumen.com",
    currency: "LKR",
    emiRate: "0",
    notifyOrderConfirmations: true,
    notifyEmiReminders: true,
    notifyLowStockAlerts: true,
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    async function fetchSettings() {
      try {
        const response = await fetch("/api/admin/settings");
        if (response.ok) {
          const data = await response.json();
          setSettings({
            storeName: data.storeName || "Lumen Furniture",
            supportEmail: data.supportEmail || "support@lumen.com",
            currency: data.currency || "LKR",
            emiRate: data.emiRate || "0",
            notifyOrderConfirmations: data.notifyOrderConfirmations === "true",
            notifyEmiReminders: data.notifyEmiReminders === "true",
            notifyLowStockAlerts: data.notifyLowStockAlerts === "true",
          });
        } else {
          toast.error("Failed to load settings");
        }
      } catch (error) {
        console.error("Error loading settings:", error);
        toast.error("An error occurred while loading settings");
      } finally {
        setIsLoading(false);
      }
    }

    fetchSettings();
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const response = await fetch("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });

      if (response.ok) {
        // Also set the cookie directly on client-side for immediate propagation
        document.cookie = `store_currency=${settings.currency}; path=/; max-age=${60 * 60 * 24 * 365}`;
        
        toast.success("Settings updated successfully!");
        // Reload page to propagate changes to all server/client components instantly
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      } else {
        toast.error("Failed to update settings");
      }
    } catch (error) {
      console.error("Error saving settings:", error);
      toast.error("An error occurred while saving settings");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-[50vh] w-full items-center justify-center gap-2 text-muted-foreground">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
        <span>Loading store settings...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-heading text-foreground">Settings</h1>
          <p className="text-sm text-muted-foreground">Manage your store configurations and payment preferences.</p>
        </div>
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="bg-foreground text-background px-6 py-2 text-sm font-medium rounded-md hover:bg-primary hover:text-primary-foreground disabled:opacity-50 transition-colors flex items-center gap-2 cursor-pointer"
        >
          {isSaving ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          {isSaving ? "Saving..." : "Save Changes"}
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
              <Input
                id="storeName"
                value={settings.storeName}
                onChange={(e) => setSettings({ ...settings, storeName: e.target.value })}
                className="border-border focus-visible:ring-primary"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="supportEmail">Support Email</Label>
              <Input
                id="supportEmail"
                type="email"
                value={settings.supportEmail}
                onChange={(e) => setSettings({ ...settings, supportEmail: e.target.value })}
                className="border-border focus-visible:ring-primary"
              />
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
              <select
                id="currency"
                value={settings.currency}
                onChange={(e) => setSettings({ ...settings, currency: e.target.value })}
                className="flex h-10 w-full rounded-md border border-border bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="USD">USD ($)</option>
                <option value="LKR">LKR (Rs.)</option>
                <option value="EUR">EUR (€)</option>
                <option value="GBP">GBP (£)</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="emiRate">Default EMI Interest Rate (%)</Label>
              <Input
                id="emiRate"
                type="number"
                step="0.01"
                min="0"
                value={settings.emiRate}
                onChange={(e) => setSettings({ ...settings, emiRate: e.target.value })}
                className="border-border focus-visible:ring-primary"
              />
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
            <input
              type="checkbox"
              checked={settings.notifyOrderConfirmations}
              onChange={(e) => setSettings({ ...settings, notifyOrderConfirmations: e.target.checked })}
              className="w-4 h-4 accent-primary cursor-pointer"
            />
          </div>
          <div className="flex items-center justify-between py-2 border-b border-border">
            <div>
              <p className="font-medium">EMI Payment Reminders</p>
              <p className="text-muted-foreground text-xs">Send reminder 3 days before EMI is due.</p>
            </div>
            <input
              type="checkbox"
              checked={settings.notifyEmiReminders}
              onChange={(e) => setSettings({ ...settings, notifyEmiReminders: e.target.checked })}
              className="w-4 h-4 accent-primary cursor-pointer"
            />
          </div>
          <div className="flex items-center justify-between py-2">
            <div>
              <p className="font-medium">Low Stock Alerts</p>
              <p className="text-muted-foreground text-xs">Notify admin when product stock falls below 5.</p>
            </div>
            <input
              type="checkbox"
              checked={settings.notifyLowStockAlerts}
              onChange={(e) => setSettings({ ...settings, notifyLowStockAlerts: e.target.checked })}
              className="w-4 h-4 accent-primary cursor-pointer"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
