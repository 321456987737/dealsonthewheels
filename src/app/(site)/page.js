import HeroSection from "@/components/homepage/herosection";
import BrandsStrip from "@/components/homepage/BrandsStrip";
import FeaturedInventory from "@/components/homepage/FeaturedInventory";
import LatestArrivals from "@/components/homepage/LatestArrivals";
import LocationSection from "@/components/homepage/location";
import FAQSection from "@/components/homepage/FAQSection";
import StaffSection from "@/components/homepage/StaffSection";
import ReviewsSection from "@/components/homepage/ReviewsSection";
export default function HomePage() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#f7f7f5] text-[#181818]">
      <HeroSection />

      <BrandsStrip />

      <FeaturedInventory />

      <LatestArrivals />
      <StaffSection />
      <ReviewsSection />
      <LocationSection />

      <FAQSection />
    </main>
  );
}