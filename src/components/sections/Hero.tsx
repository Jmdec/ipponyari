"use client"

import Link from "next/link"
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
        const response = await fetch("/api/product?paginate=false")

        if (!response.ok) {
          throw new Error(`Failed to fetch products: ${response.status}`)
        }

        const data = await response.json()
        const products = Array.isArray(data) ? data : []

        setDishes(products)
      } catch (error) {
        console.error("Error fetching all products:", error)
        setDishes([])
      } finally {
        setLoading(false)
      }
    }

    fetchAllProducts()
  }, [])

  // Auto-slide functionality
  useEffect(() => {
    if (dishes.length === 0 || isHovered) return

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % dishes.length)
    }, 4000)

    return () => clearInterval(interval)
  }, [dishes.length, isHovered])

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % dishes.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? dishes.length - 1 : prev - 1))
  }

  const getNextIndex = () => {
    return (currentSlide + 1) % dishes.length
  }

  return (
    <>
      <section className="relative min-h-[80vh] lg:min-h-[75vh] py-10 flex items-center justify-center overflow-hidden bg-gradient-to-br from-black via-[#1a0008] to-[#2d0011]">
        {/* Ambient glow effects */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 right-1/4 w-[600px] h-[600px] bg-[#dc143c]/10 rounded-full blur-[150px]" />
          <div className="absolute bottom-1/4 left-1/4 w-[500px] h-[500px] bg-[#dc143c]/15 rounded-full blur-[120px]" />
        </div>

        <div className="container mx-auto px-4 lg:px-8 relative z-10">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-16">
              {/* Left side - Text content */}
              <div className="flex-1 text-center lg:text-left w-full">
                <h1 className="text-4xl md:text-5xl xl:text-6xl font-light text-white mb-6 lg:mb-8 leading-tight">
                  Where Tradition Meets <br className="hidden lg:block"/>
                  <span className="text-[#dc143c] font-semibold">Authentic Taste</span>
                </h1>

                <p className="text-md md:text-lg lg:text-xl text-white/80 italic mb-8 lg:mb-12 leading-relaxed max-w-2xl mx-auto lg:mx-0">
                  Experience the essence of Japanese culinary heritage, crafted with passion and served with the warmth of traditional hospitality
                </p>

                {/* Buttons */}
                <div className="flex flex-col md:flex-row gap-4 justify-center lg:justify-start">
                  <Button
                    asChild
                    size="lg"
                    className="bg-[#dc143c] hover:bg-[#b01030] text-white text-base lg:text-lg px-8 py-6 shadow-[0_0_30px_rgba(220,20,60,0.3)] hover:shadow-[0_0_40px_rgba(220,20,60,0.5)] transition-all duration-300 border-0"
                  >
                    <Link href="/menu">Explore Our Menu</Link>
                  </Button>
                  <Button
                    asChild
                    variant="outline"
                    size="lg"
                    className="text-base lg:text-lg px-8 py-6 border-2 border-white/30 text-white hover:bg-white/10 hover:border-white/50 bg-transparent backdrop-blur-sm transition-all duration-300"
                  >
                    <Link href="/reservations">Make Reservation</Link>
                  </Button>
                </div>
              </div>

              {/* Right side - Slider with Preview */}
              <div className="flex-1 w-full max-w-md lg:max-w-md">
                {loading ? (
                  <div className="w-full h-[500px] flex items-center justify-center bg-black/30 backdrop-blur-sm rounded-2xl border border-[#dc143c]/20">
                    <div className="w-8 h-8 border-2 border-[#dc143c]/30 border-t-[#dc143c] rounded-full animate-spin"></div>
                  </div>
                ) : dishes.length === 0 ? (
                  <div className="w-full h-[480px] flex items-center justify-center bg-black/30 backdrop-blur-sm rounded-2xl border border-[#dc143c]/20">
                    <p className="text-white/60 text-center px-4">No dishes available at the moment.</p>
                  </div>
                ) : (
                  <div 
                    className="relative flex gap-4" 
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                  >
                    {/* Navigation Arrows */}
                    {dishes.length > 1 && (
                      <>
                        <button
                          onClick={prevSlide}
                          className="absolute left-2 lg:-left-14 top-1/2 -translate-y-1/2 z-30 bg-[#dc143c] hover:bg-[#b01030] backdrop-blur-sm text-white p-3 lg:p-2.5 rounded-full transition-all hover:scale-110 border-2 border-white/20 shadow-[0_0_20px_rgba(220,20,60,0.5)]"
                          aria-label="Previous slide"
                        >
                          <ChevronLeft className="w-5 h-5 lg:w-5 lg:h-5" />
                        </button>

                        <button
                          onClick={nextSlide}
                          className="absolute right-2 lg:-right-14 top-1/2 -translate-y-1/2 z-30 bg-[#dc143c] hover:bg-[#b01030] backdrop-blur-sm text-white p-3 lg:p-2.5 rounded-full transition-all hover:scale-110 border-2 border-white/20 shadow-[0_0_20px_rgba(220,20,60,0.5)]"
                          aria-label="Next slide"
                        >
                          <ChevronRight className="w-5 h-5 lg:w-5 lg:h-5" />
                        </button>
                      </>
                    )}

                    {/* Main Card */}
                    <div className="flex-1 relative z-10">
                      <div className="relative bg-gradient-to-br from-black/20 to-[#dc143c]/10 backdrop-blur-md rounded-2xl overflow-hidden border border-[#dc143c]/30 shadow-[0_8px_32px_rgba(220,20,60,0.3)]">
                        {/* Slides */}
                        <div className="relative h-[480px]">
                          {dishes.map((dish, index) => (
                            <div
                              key={dish.id}
                              className={`absolute inset-0 transition-all duration-700 ease-in-out ${
                                index === currentSlide
                                  ? "opacity-100 translate-x-0"
                                  : index < currentSlide
                                  ? "opacity-0 -translate-x-full"
                                  : "opacity-0 translate-x-full"
                              }`}
                            >
                              {/* Image */}
                              <div className="relative h-70 overflow-hidden">
                                <img
                                  src={dish.image_url || "/placeholder.svg"}
                                  alt={dish.name}
                                  className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                                
                                {/* Category Badge */}
                                <div className="absolute top-3 left-3">
                                  <span className="inline-block px-3 py-1 bg-[#dc143c] text-white text-xs font-semibold rounded-full shadow-lg uppercase tracking-wide">
                                    {dish.category}
                                  </span>
                                </div>
                              </div>

                              {/* Content */}
                              <div className="p-5 bg-gradient-to-b from-black/50 to-black/70 backdrop-blur-sm">
                                <h3 className="text-xl font-bold mb-2 text-[#dc143c] line-clamp-1">{dish.name}</h3>
                                
                                {dish.price > 0 && (
                                  <p className="text-2xl font-bold mb-3 text-white">
                                    ₱{Number(dish.price).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                                  </p>
                                )}

                                <p className="text-white/80 text-sm leading-relaxed mb-4 line-clamp-3">
                                  {dish.description}
                                </p>

                                <button
                                  onClick={() => setSelectedDish(dish)}
                                  className="w-full py-2.5 bg-[#dc143c] hover:bg-[#b01030] text-white rounded-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-xl text-sm"
                                >
                                  View Details
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Modal Popup */}
      {selectedDish && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300"
          onClick={() => setSelectedDish(null)}
        >
          <div
            className="relative bg-gradient-to-br from-[#1a1a1a] to-[#2d0011] rounded-2xl max-w-4xl w-full max-h-[90vh] animate-in zoom-in duration-300 shadow-2xl border border-[#dc143c]/30 flex flex-col md:flex-row overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedDish(null)}
              className="absolute top-4 right-4 z-10 bg-black/50 hover:bg-black/70 text-[#dc143c] hover:text-white rounded-full p-2 transition-colors backdrop-blur-sm border border-[#dc143c]/50"
              aria-label="Close"
            >
              <X size={24} />
            </button>

            {/* Left side - Image */}
            <div className="relative w-full md:w-2/5 h-64 md:h-auto flex-shrink-0 overflow-hidden">
              <img
                src={selectedDish.image_url || "/placeholder.svg"}
                alt={selectedDish.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            </div>

            {/* Right side - Details */}
            <div className="flex-1 p-6 md:p-8 flex flex-col justify-between overflow-y-auto">
              <div>
                <div className="mb-4">
                  <span className="inline-block px-3 py-1.5 bg-[#dc143c] text-white text-xs font-semibold rounded-full mb-4 uppercase tracking-wide">
                    {selectedDish.category}
                  </span>
                  <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">{selectedDish.name}</h2>
                  {selectedDish.price > 0 && (
                    <p className="text-3xl md:text-4xl font-bold text-[#dc143c]">
                      ₱{Number(selectedDish.price).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                    </p>
                  )}
                </div>

                <p className="text-white/80 text-base leading-relaxed mb-6">{selectedDish.description}</p>
              </div>

              <Button
                asChild
                size="lg"
                className="w-full bg-[#dc143c] hover:bg-[#b01030] text-white shadow-lg"
              >
                <Link href="/menu">View Full Menu</Link>
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
