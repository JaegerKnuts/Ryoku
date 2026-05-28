import { HeroSection } from "@/components/home/HeroSection";
import { FeaturedProducts } from "@/components/home/FeaturedProducts";
import { CategoriesSection } from "@/components/home/CategoriesSection";
import { BlogPreview } from "@/components/home/BlogPreview";
import { NewsletterSection } from "@/components/home/NewsletterSection";

function BrushDivider() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="h-[2px] w-full" style={{ background: "linear-gradient(90deg, var(--brand), transparent)" }} />
    </div>
  );
}

export default function Home() {
  return (
    <>
      <HeroSection />
      <FeaturedProducts />
      <BrushDivider />
      <CategoriesSection />
      <BrushDivider />
      <BlogPreview />
      <NewsletterSection />
    </>
  );
}
