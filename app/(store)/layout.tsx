import { Header } from "@/components/store/header";
import { Footer } from "@/components/store/footer";

export default function StoreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow pt-24">{children}</main>
      <Footer />
    </div>
  );
}
