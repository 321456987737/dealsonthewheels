import Footer from "@/components/site/Footer";
import Header from "@/components/site/Header";
import CarStartup from "@/components/startinganimation";
export const metadata = {
  title: "Demo Auto | Demo Vehicle Website",
  description: "A demo automotive inventory and dealership website.",
};

export default function mainlayout({ children }) {
  return (
    <div className="min-h-full flex flex-col">
        <CarStartup
          variant="drive"
          brand="Your car logo here"
          duration={2200}
        />
      <Header />
        {children}
        <Footer/>
    </div>
    
  );
}
