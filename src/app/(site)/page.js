
import HeroSection from "@/components/homepage/herosection";
import FeaturedInventory from "@/components/homepage/FeaturedInventory"
import LocationSection from "@/components/homepage/location"
import ModelsSection from "@/components/homepage/models"
import LatestArrivals from "@/components/homepage/LatestArrivals"
import FAQSection from "@/components/homepage/FAQSection"



export default async function HomePage() {

  return (
    <main className="min-h-screen bg-[#f7f7f5] text-black">

      {/* Hero */}
     <HeroSection/>
     <FeaturedInventory/>
     <LatestArrivals/>
     <LocationSection/>
     
     <ModelsSection/>
     <FAQSection/>
    </main>
  );
}
