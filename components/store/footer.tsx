import Link from "next/link";
import { Globe, Mail } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-foreground text-background py-16 mt-20">
      <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12">
        <div className="col-span-1 md:col-span-1">
          <Link href="/" className="text-2xl font-heading font-semibold tracking-wide mb-6 inline-block">
            LUMEN
          </Link>
          <p className="text-sm text-background/70 leading-relaxed max-w-xs">
            Curated luxury furniture and home decor for the modern living space. Crafted with elegance and precision.
          </p>
        </div>
        
        <div>
          <h4 className="font-medium text-lg mb-6 tracking-wide">Shop</h4>
          <ul className="space-y-4 text-sm text-background/70">
            <li><Link href="/products?category=new" className="hover:text-primary transition-colors">New Arrivals</Link></li>
            <li><Link href="/products?category=living" className="hover:text-primary transition-colors">Living Room</Link></li>
            <li><Link href="/products?category=bedroom" className="hover:text-primary transition-colors">Bedroom</Link></li>
            <li><Link href="/products?category=dining" className="hover:text-primary transition-colors">Dining</Link></li>
          </ul>
        </div>
        
        <div>
          <h4 className="font-medium text-lg mb-6 tracking-wide">Help</h4>
          <ul className="space-y-4 text-sm text-background/70">
            <li><Link href="/faq" className="hover:text-primary transition-colors">FAQ</Link></li>
            <li><Link href="/contact" className="hover:text-primary transition-colors">Contact Us</Link></li>
            <li><Link href="/shipping" className="hover:text-primary transition-colors">Shipping & Returns</Link></li>
            <li><Link href="/emi" className="hover:text-primary transition-colors">EMI & Financing</Link></li>
          </ul>
        </div>
        
        <div>
          <h4 className="font-medium text-lg mb-6 tracking-wide">Newsletter</h4>
          <p className="text-sm text-background/70 mb-4">
            Subscribe to receive updates, access to exclusive deals, and more.
          </p>
          <div className="flex">
            <input 
              type="email" 
              placeholder="Enter your email" 
              className="bg-transparent border-b border-background/30 py-2 w-full focus:outline-none focus:border-primary text-sm transition-colors"
            />
            <button className="text-sm font-medium uppercase tracking-wider ml-4 hover:text-primary transition-colors">
              Subscribe
            </button>
          </div>
          
          <div className="flex space-x-6 mt-10">
            <a href="#" className="text-background/70 hover:text-primary transition-colors">
              <Globe className="w-5 h-5" />
            </a>
            <a href="#" className="text-background/70 hover:text-primary transition-colors">
              <Mail className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>
      
      <div className="container mx-auto px-6 mt-16 pt-8 border-t border-background/10 flex flex-col md:flex-row justify-between items-center text-xs text-background/50">
        <p>&copy; {new Date().getFullYear()} Lumen Furniture. All rights reserved.</p>
        <div className="flex space-x-4 mt-4 md:mt-0">
          <Link href="/privacy" className="hover:text-background transition-colors">Privacy Policy</Link>
          <Link href="/terms" className="hover:text-background transition-colors">Terms of Service</Link>
        </div>
      </div>
    </footer>
  );
}
