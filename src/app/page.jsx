import SiteHeader from "@/components/home/SiteHeader";
import HeroSection from "@/components/home/HeroSection";
import PopularPicksSection from "@/components/home/PopularPicksSection";
import ShopByCategorySection from "@/components/home/ShopByCategorySection";
import AsSeenInYourSpaceSection from "@/components/home/AsSeenInYourSpaceSection";
import HomeValuePropsSection from "@/components/home/HomeValuePropsSection";
import HomeTestimonialSpotlightSection from "@/components/home/HomeTestimonialSpotlightSection";
import DealsOfTheWeekSection from "@/components/home/DealsOfTheWeekSection";
import HomeJournalSection from "@/components/home/HomeJournalSection";
import HomeFollowInstagramSection from "@/components/home/HomeFollowInstagramSection";
import SiteFooter from "@/components/home/SiteFooter";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#f7f4ef] font-home-body antialiased">
      <SiteHeader />
      <main>
        <HeroSection />
        <PopularPicksSection />
        <ShopByCategorySection />
        <AsSeenInYourSpaceSection />
        <DealsOfTheWeekSection />
        <HomeValuePropsSection />
        <HomeTestimonialSpotlightSection />
        <HomeJournalSection />
        <HomeFollowInstagramSection />
      </main>
      <SiteFooter />
    </div>
  );
}
