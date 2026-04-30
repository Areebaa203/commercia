import SiteHeader from "@/components/home/SiteHeader";
import SiteFooter from "@/components/home/SiteFooter";
import { CartProvider } from "@/contexts/CartContext";

export default function StorefrontLayout({ children }) {
  return (
    <CartProvider>
      <div className="min-h-screen bg-[#f7f4ef] font-home-body antialiased">
        <SiteHeader />
        {children}
        <SiteFooter />
      </div>
    </CartProvider>
  );
}
