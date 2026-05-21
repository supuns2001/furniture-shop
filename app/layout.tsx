import type { Metadata } from "next";
import { cookies } from "next/headers";
import { CurrencyProvider } from "@/components/store/currency-context";
import { CartProvider } from "@/components/store/cart-context";
import { AuthProvider } from "@/components/store/auth-provider";
import { DEFAULT_CURRENCY } from "@/lib/currency";
import { Toaster } from "sonner";
import "./globals.css";

export const metadata: Metadata = {
  title: "Luxury Furniture Shop",
  description: "High-end furniture and home decor.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const initialCurrency = cookieStore.get("store_currency")?.value || DEFAULT_CURRENCY;

  return (
    <html
      lang="en"
      className="h-full antialiased"
    >
      <body className="min-h-full flex flex-col font-sans text-foreground bg-background">
        <AuthProvider>
          <CurrencyProvider initialCurrency={initialCurrency}>
            <CartProvider>
              {children}
              <Toaster position="bottom-right" richColors closeButton />
            </CartProvider>
          </CurrencyProvider>
        </AuthProvider>
      </body>
    </html>
  );
}


