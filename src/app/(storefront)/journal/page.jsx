import JournalHero from "@/components/journal/JournalHero";
import JournalListingSection from "@/components/journal/JournalListingSection";
import HomeFollowInstagramSection from "@/components/home/HomeFollowInstagramSection";

export const metadata = {
  title: "Journal · Furniqo",
  description: "Ideas, guides, and inspiration for your home.",
};

export default function JournalPage() {
  return (
    <main className="bg-[#faf9f6]">
      <JournalHero />
      <JournalListingSection />
      <HomeFollowInstagramSection />
    </main>
  );
}
