import { AccountDashboard } from "@/components/store/account-dashboard";

export const metadata = {
  title: "My Account | Lumen Furniture",
  description: "Manage your orders and installments.",
};

export default function AccountPage() {
  return (
    <div className="bg-background min-h-screen">
      <AccountDashboard />
    </div>
  );
}
