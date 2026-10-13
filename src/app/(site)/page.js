import HeroSection from "@/components/homepage/herosection";
import BrandsStrip from "@/components/homepage/BrandsStrip";
import FeaturedInventory from "@/components/homepage/FeaturedInventory";
import LatestArrivals from "@/components/homepage/LatestArrivals";
import LocationSection from "@/components/homepage/location";
import FAQSection from "@/components/homepage/FAQSection";
import StaffSection from "@/components/homepage/StaffSection";
import ReviewsSection from "@/components/homepage/ReviewsSection";
import StatsSection from "@/components/homepage/StatsSection";
export default function HomePage() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#f7f7f5] text-[#181818]">
      <HeroSection />           {/* 1. Hook - Who you are + main CTA */}
      <BrandsStrip />           {/* 2. Trust - What brands you deal in */}
      <FeaturedInventory />     {/* 3. Money Maker - Your best cars */}
      <LatestArrivals />        {/* 4. Freshness - What's new */}
      <StatsSection />          {/* 5. Proof - 2500+ Cars Sold, 4.9 Rating, 15+ Years - MOVED UP */}
      <ReviewsSection />        {/* 6. Social Proof - What customers say */}
      <StaffSection />          {/* 7. Humanize - Meet the team */}
      <LocationSection />       {/* 8. Action - Where to find you / Map */}
      <FAQSection />            {/* 9. Objection handling */}
      {/* Add a final CTASection here - "Ready to find your next car?" */}
    </main>
  );
}
// export default function HomePage() {
//   return (
//     <main className="min-h-screen overflow-hidden bg-[#f7f7f5] text-[#181818]">
//       <HeroSection />
//       <BrandsStrip />
//       <FeaturedInventory />
//       <LatestArrivals />
//       <StaffSection />
//       <ReviewsSection />
//       <StatsSection />
//       <LocationSection />
//       <FAQSection />
//     </main>
//   );
// }