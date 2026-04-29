import SiteHeader from "@/components/home/SiteHeader";
import SiteFooter from "@/components/home/SiteFooter";

export default function StorefrontLayout({ children }) {
  return (
    <div className="min-h-screen bg-[#f7f4ef] font-home-body antialiased">
      <SiteHeader />
      {children}
      <SiteFooter />
    </div>
  );
}
