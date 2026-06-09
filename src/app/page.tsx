import { HeroSection } from "@/components/home/HeroSection";
import { HashArchiveEntry } from "@/components/home/HashArchiveEntry";
import { BlogPreview } from "@/components/home/BlogPreview";
import { FeaturedProducts } from "@/components/home/FeaturedProducts";
import { CategoriesSection } from "@/components/home/CategoriesSection";
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
      <HashArchiveEntry />
      <BrushDivider />
      <BlogPreview />
      <BrushDivider />
      <FeaturedProducts />
      <BrushDivider />
      <CategoriesSection />
      <NewsletterSection />
    </>
  );
}
