import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"

export default function CTASection() {
  return (
    <section className="relative py-24 overflow-hidden bg-gradient-to-br from-red-900 via-red-950 to-black">
      <div className="relative container mx-auto px-4 text-center">
        <div className="mb-4">
          <span className="text-red-400/70 text-sm tracking-[0.3em] uppercase font-semibold">Ready to Dine?</span>
        </div>

        <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white drop-shadow-lg">
          Your Table Awaits
          <br />
          <span className="text-red-400">
            Authentic Japanese Cuisine
          </span>
        </h2>

        <p className="text-lg md:text-xl mb-10 text-gray-300 max-w-2xl mx-auto leading-relaxed">
          Reserve your seat today and savor the finest Japanese dishes, prepared fresh daily by our master chefs
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button
            asChild
            size="lg"
            className="text-base px-10 py-6 bg-red-600 hover:bg-red-700 text-white font-bold tracking-wider shadow-2xl hover:shadow-red-500/50 transition-all duration-300 hover:scale-105"
          >
            <Link href="/menu">Order Now</Link>
          </Button>
          <Button
            asChild
            size="lg"
            variant="outline"
            className="text-base px-10 py-6 border-2 border-red-600 text-white hover:bg-red-600 hover:border-red-600 bg-transparent font-bold tracking-wider transition-all duration-300 hover:scale-105"
          >
            <Link href="/contact">Contact Us</Link>
          </Button>
        </div>

        <div className="mt-12 text-red-400/60 text-sm tracking-wider">
          <span>一本槍 — Ipponyari Japanese Restaurant</span>
        </div>
      </div>
    </section>
  )
}