"use client"

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"
import { X, ChevronLeft, ChevronRight } from "lucide-react"

interface Product {
  id: number
  name: string
  description: string
  price: number
  category: string
  image_url: string
  is_featured: boolean
}

export default function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [dishes, setDishes] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedDish, setSelectedDish] = useState<Product | null>(null)
  const [isHovered, setIsHovered] = useState(false)

  useEffect(() => {
    const fetchAllProducts = async () => {
      try {
        const res = await fetch("/api/product?paginate=false")
        if (!res.ok) throw new Error("Failed to fetch products")
        const data = await res.json()
        setDishes(Array.isArray(data) ? data : [])
      } catch (err) {
        console.error(err)
        setDishes([])
      } finally {
        setLoading(false)
      }
    }

    fetchAllProducts()
  }, [])

  useEffect(() => {
    if (currentSlide >= dishes.length && dishes.length > 0) {
      setCurrentSlide(0)
    }
  }, [dishes.length, currentSlide])

  useEffect(() => {
    if (dishes.length <= 1 || isHovered || selectedDish) return

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % dishes.length)
    }, 4000)

    return () => clearInterval(interval)
  }, [dishes, isHovered, selectedDish])

  const nextSlide = () => {
    if (dishes.length === 0) return
    setCurrentSlide((prev) => (prev + 1) % dishes.length)
  }

  const prevSlide = () => {
    if (dishes.length === 0) return
    setCurrentSlide((prev) => (prev === 0 ? dishes.length - 1 : prev - 1))
  }

  const getNextIndex = () => {
    if (dishes.length === 0) return 0
    return (currentSlide + 1) % dishes.length
  }

  return (
    <>
      <section className="relative min-h-[70vh] lg:min-h-[75vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-black via-[#1a0008] to-[#2d0011]">
        {/* Ambient glow effects */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 right-1/4 w-[600px] h-[600px] bg-[#dc143c]/10 rounded-full blur-[150px]" />
          <div className="absolute bottom-1/4 left-1/4 w-[500px] h-[500px] bg-[#dc143c]/15 rounded-full blur-[120px]" />
        </div>
        
        <div className="container mx-auto px-4 lg:px-8 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-12">

            <div className="flex-1 text-center lg:text-left">
              <h1 className="text-4xl lg:text-6xl font-light text-white mb-6">
                Where Tradition Meets{" "}
                <span className="text-[#dc143c] font-normal">Authentic Taste</span>
              </h1>

              <p className="text-white/80 italic max-w-xl mb-10">
                Experience the essence of Japanese culinary heritage, crafted
                with passion and served with warmth.
              </p>

              <div className="flex gap-4 justify-center lg:justify-start">
                <Button asChild size="lg" className="bg-[#dc143c]">
                  <Link href="/menu">Explore Our Menu</Link>
                </Button>
                <Button asChild size="lg" variant="outline">
                  <Link href="/reservations">Make Reservation</Link>
                </Button>
              </div>
            </div>

            <div
              className="relative w-full max-w-sm"
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              {loading ? (
                <div className="w-full h-[480px] flex items-center justify-center bg-black/30 backdrop-blur-sm rounded-2xl border border-[#dc143c]/20">
                  <div className="w-8 h-8 border-2 border-[#dc143c]/30 border-t-[#dc143c] rounded-full animate-spin" />
                </div>
              ) : dishes.length === 0 ? (
                <div className="w-full h-[480px] flex items-center justify-center bg-black/30 backdrop-blur-sm rounded-2xl border border-[#dc143c]/20">
                  <p className="text-white/60 text-center px-4">No dishes available.</p>
                </div>
              ) : (
                <>
                  {/* NAV */}
                  {dishes.length > 1 && (
                    <>
                      <button
                        onClick={prevSlide}
                        aria-label="Previous dish"
                        className="absolute left-2 top-1/2 -translate-y-1/2 z-20 bg-[#dc143c] p-2 rounded-full"
                      >
                        <ChevronLeft />
                      </button>
                      <button
                        onClick={nextSlide}
                        aria-label="Next dish"
                        className="absolute right-2 top-1/2 -translate-y-1/2 z-20 bg-[#dc143c] p-2 rounded-full"
                      >
                        <ChevronRight />
                      </button>
                    </>
                  )}

                  {/* CARD */}
                  <div className="relative h-[480px] rounded-2xl overflow-hidden">
                    {dishes.map((dish, index) => (
                      <div
                        key={dish.id}
                        className={`absolute inset-0 transition-all duration-700 ${
                          index === currentSlide
                            ? "opacity-100 translate-x-0"
                            : "opacity-0 translate-x-full"
                        }`}
                      >
                        <div className="relative h-64">
                          <Image
                            src={dish.image_url || "/placeholder.svg"}
                            alt={dish.name}
                            fill
                            priority={index === currentSlide}
                            className="object-cover"
                          />
                        </div>

                        <div className="p-5 bg-black/70">
                          <h3 className="text-xl font-bold text-[#dc143c]">
                            {dish.name}
                          </h3>

                          {dish.price > 0 && (
                            <p className="text-white text-xl font-bold">
                              ₱{dish.price.toLocaleString()}
                            </p>
                          )}

                          <p className="text-white/80 text-sm line-clamp-3 mb-4">
                            {dish.description}
                          </p>

                          <button
                            onClick={() => setSelectedDish(dish)}
                            className="w-full bg-[#dc143c] py-2 rounded-md"
                          >
                            View Details
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* MODAL */}
      {selectedDish && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
          onClick={() => setSelectedDish(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-[#1a1a1a] rounded-xl max-w-xl w-full overflow-hidden"
          >
            <button
              onClick={() => setSelectedDish(null)}
              className="absolute top-4 right-4 text-white"
            >
              <X />
            </button>

            <div className="relative h-80">
              <Image
                src={selectedDish.image_url || "/placeholder.svg"}
                alt={selectedDish.name}
                fill
                className="object-cover"
              />
            </div>

            <div className="p-6">
              <h2 className="text-2xl font-bold text-white mb-2">
                {selectedDish.name}
              </h2>

              <p className="text-white/80 mb-4">
                {selectedDish.description}
              </p>

              <Button asChild className="w-full bg-[#dc143c]">
                <Link href="/menu">View Full Menu</Link>
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
