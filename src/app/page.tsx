import { menuItems } from "@/data/menuData"
import HeroSection from "@/components/sections/Hero"
import FeaturedMenu from "@/components/sections/FeaturedMenu"
import AboutPreview from "@/components/sections/HomePreview"
import CTASection from "@/components/sections/CTASection"
import TestimonialsSection from "@/components/sections/testimonials-section"
import BlogSection from "@/components/sections/blog-section"

export default function Home() {
  const featuredItems = menuItems.slice(0, 3)

  return (
    <div className="min-h-screen">
      <HeroSection />
      <FeaturedMenu />
      <TestimonialsSection />
      <BlogSection />
      <AboutPreview />
      <CTASection />
    </div>
  )
}
