"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Users, 
  CreditCard, 
  Tag, 
  Truck, 
  BarChart, 
  Settings,
  FlaskConical,
} from "lucide-react";

const navigation = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "Products", href: "/admin/products", icon: Package },
  { name: "Orders", href: "/admin/orders", icon: ShoppingCart },
  { name: "Instalments", href: "/admin/instalments", icon: CreditCard },
  { name: "Customers", href: "/admin/customers", icon: Users },
  { name: "Promotions", href: "/admin/promotions", icon: Tag },
  { name: "Delivery", href: "/admin/delivery", icon: Truck },
  { name: "Reports", href: "/admin/reports", icon: BarChart },
  { name: "Settings", href: "/admin/settings", icon: Settings },
];

const isDemoMode = process.env.NEXT_PUBLIC_DEMO_MODE === "true";

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <div className="flex flex-col w-64 bg-card border-r border-border h-screen sticky top-0">
      <div className="h-16 flex items-center px-6 border-b border-border">
        <Link href="/admin" className="text-xl font-heading font-semibold tracking-wide text-foreground">
          LUMEN ADMIN
        </Link>
      </div>
      <div className="flex-1 overflow-y-auto py-4">
        <nav className="space-y-1 px-3">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive 
                    ? "bg-primary text-primary-foreground" 
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                <item.icon className="w-4 h-4" />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* ── Demo Mode Badge ──────────────────────────────────────────────── */}
      {isDemoMode && (
        <div className="mx-3 mb-3 rounded-lg border border-amber-500/40 bg-amber-500/10 px-3 py-2.5">
          <div className="flex items-center gap-2 mb-1">
            <FlaskConical className="w-3.5 h-3.5 text-amber-500 shrink-0" />
            <span className="text-xs font-semibold text-amber-500 uppercase tracking-wide">
              Demo Mode
            </span>
          </div>
          <p className="text-[11px] text-amber-500/80 leading-snug">
            Showing mock data. Set{" "}
            <code className="font-mono bg-amber-500/20 px-1 rounded">DEMO_MODE=false</code>{" "}
            and connect a database for live data.
          </p>
        </div>
      )}

      <div className="p-4 border-t border-border">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-medium">
            AD
          </div>
          <div>
            <p className="text-sm font-medium text-foreground">Admin User</p>
            <p className="text-xs text-muted-foreground">admin@lumen.com</p>
          </div>
        </div>
      </div>
    </div>
  );
}

