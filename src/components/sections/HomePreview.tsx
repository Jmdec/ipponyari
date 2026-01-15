import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export default function HomePreview() {
  return (
    <section className="relative py-24 overflow-hidden bg-gradient-to-br from-white via-gray-50 to-white">
      {/* Crimson accent elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#dc143c]/5 rounded-full blur-[100px]" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#7f0020]/5 rounded-full blur-[80px]" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Text Section */}
          <div className="space-y-8">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-px bg-gradient-to-r from-[#dc143c] to-[#7f0020]" />
              <span className="text-sm font-medium text-[#dc143c] tracking-[0.2em] uppercase">Our Philosophy</span>
            </div>

            <h2 className="text-4xl lg:text-5xl font-semibold leading-tight text-gray-900">
              Authentic Japanese
              <br />
              <span className="bg-gradient-to-r from-[#dc143c] to-[#7f0020] bg-clip-text text-transparent">
                Culinary Art
              </span>
            </h2>

            <p className="text-lg text-gray-600 leading-relaxed">
              At Ipponyari, we honor centuries-old traditions while embracing innovation. Our master chefs bring you
              authentic flavors from Japan's finest regions, crafting each dish with precision, passion, and the utmost
              respect for ingredients.
            </p>

            <p className="text-base text-gray-500 leading-relaxed">
              From delicate sashimi to perfectly grilled yakitori, every plate tells a story of craftsmanship and
              dedication to the art of Japanese cuisine.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                asChild
                size="lg"
                className="bg-gradient-to-r from-[#dc143c] to-[#7f0020] hover:from-[#e8324f] hover:to-[#a00028] text-white px-8 py-6 text-base tracking-wider shadow-[0_4px_20px_rgba(220,20,60,0.3)] hover:shadow-[0_4px_30px_rgba(220,20,60,0.5)] transition-all duration-300"
              >
                <Link href="/menu">Explore Menu</Link>
              </Button>

              <Button
                asChild
                variant="outline"
                size="lg"
                className="border-[#dc143c]/50 text-[#dc143c] hover:bg-[#dc143c]/10 hover:border-[#dc143c] px-8 py-6 text-base tracking-wider bg-transparent transition-all duration-300"
              >
                <Link href="/reservations">Book a Table</Link>
              </Button>
            </div>
          </div>

          {/* Feature Cards */}
          <div className="grid grid-cols-2 gap-6">
            {[
              {
                title: "Authentic Tradition",
                desc: "Recipes passed down through generations",
                icon: "伝",
              },
              {
                title: "Fresh Ingredients",
                desc: "Daily sourced premium seafood & produce",
                icon: "鮮",
              },
              {
                title: "Master Craftsmanship",
                desc: "Expert chefs with decades of experience",
                icon: "匠",
              },
              {
                title: "Warm Hospitality",
                desc: "Traditional Japanese omotenashi service",
                icon: "心",
              },
            ].map((card, idx) => (
              <Card
                key={idx}
                className="group hover:shadow-[0_10px_40px_rgba(220,20,60,0.15)] transition-all duration-500 hover:-translate-y-1 bg-white border-gray-200 hover:border-[#dc143c]/30 h-full"
              >
                <CardContent className="p-6 text-center flex flex-col items-center">
                  <div className="w-16 h-16 mb-4 flex items-center justify-center text-4xl font-bold text-[#dc143c] border-2 border-[#dc143c]/20 rounded-sm group-hover:border-[#dc143c]/50 group-hover:bg-[#dc143c]/5 transition-all duration-300">
                    {card.icon}
                  </div>
                  <h3 className="font-semibold text-base mb-2 text-gray-800">{card.title}</h3>
                  <p className="text-sm text-gray-500">{card.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}