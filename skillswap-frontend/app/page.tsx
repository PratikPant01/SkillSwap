import Categories from "@/component/categories";
import FeaturedService from "@/component/featuredsevice";
import Hero from "@/component/hero";
import HowItWorks from "@/component/howitworks";


export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Hero />
      <Categories />
      <FeaturedService />
      <HowItWorks/>
    </div>
  );
}
