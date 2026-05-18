import { Bell, Search } from "lucide-react";
import { Input } from "@/components/ui/input";

export function AdminTopbar() {
  return (
    <header className="h-16 bg-card border-b border-border flex items-center justify-between px-6 sticky top-0 z-10">
      <div className="flex-1 max-w-md relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input 
          placeholder="Search orders, customers, or products..." 
          className="pl-10 border-border bg-muted/50 focus-visible:ring-primary h-10"
        />
      </div>
      <div className="flex items-center gap-4 ml-4">
        <button className="relative p-2 text-muted-foreground hover:text-foreground transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-destructive rounded-full" />
        </button>
      </div>
    </header>
  );
}
