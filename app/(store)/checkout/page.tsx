import { CheckoutForm } from "@/components/store/checkout-form";

export const metadata = {
  title: "Checkout | Lumen Furniture",
  description: "Secure checkout for your luxury furniture.",
};

export default function CheckoutPage() {
  return (
    <div className="bg-background min-h-screen">
      <CheckoutForm />
    </div>
  );
}
