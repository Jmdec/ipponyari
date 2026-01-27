"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Star, Quote, ChevronLeft, ChevronRight, X } from "lucide-react"

interface Testimonial {
  id: number
  client_name: string
  client_email: string
  rating: number
  message: string
  created_at: string
  image_url: string
  status?: string
}

export default function TestimonialsSection() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [loading, setLoading] = useState(true)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [selectedTestimonial, setSelectedTestimonial] = useState<Testimonial | null>(null)
  const [visibleCount, setVisibleCount] = useState(1)
  const [isHovered, setIsHovered] = useState(false)

  // Determine how many cards to show based on screen size
  const getVisibleCount = () => {
    if (typeof window === "undefined") return 1
    if (window.innerWidth >= 1024) return 3 // desktop
    if (window.innerWidth >= 768) return 2  // tablet
    return 1                               // mobile
  }

  useEffect(() => {
    const handleResize = () => setVisibleCount(getVisibleCount())
    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  // Fetch testimonials
  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const response = await fetch("/api/testimonials?status=approved")
        if (!response.ok) throw new Error("Failed to fetch testimonials")
        const data = await response.json()
        const approvedTestimonials = data.filter((t: Testimonial) => t.status === "approved")
        setTestimonials(approvedTestimonials)
      } catch (err) {
        console.error("Error fetching testimonials:", err)
      } finally {
        setLoading(false)
      }
    }
    fetchTestimonials()
  }, [])

  // Auto-scroll testimonials
  useEffect(() => {
    if (testimonials.length <= visibleCount) return
    if (isHovered) return

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + visibleCount) % testimonials.length)
    }, 1000)

    return () => clearInterval(interval)
  }, [testimonials, visibleCount, isHovered])

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + visibleCount) % testimonials.length)
  }

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - visibleCount + testimonials.length) % testimonials.length)
  }

  if (loading) {
    return (
      <section className="py-20 bg-gradient-to-br from-amber-50 via-orange-50 to-stone-100">
        <div className="container mx-auto px-4 text-center">
          <div className="text-center mb-16">
            <div className="flex items-center justify-center gap-4 mb-4">
              <div className="w-12 h-px bg-[#c41e3a]" />
              <span className="text-xs lg:text-sm font-medium text-[#c41e3a] tracking-[0.2em] uppercase">
                Trusted Impressions
              </span>
              <div className="w-12 h-px bg-[#c41e3a]" />
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold leading-tight mb-5">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-700 to-red-600">
                What Our Guests Say
              </span>
            </h2>
            <p className="text-md lg:text-lg text-gray-600 leading-relaxed">
              Real experiences from our valued customers
            </p>
          </div>
          <div className="flex justify-center gap-2 mt-6">
            <div className="w-2 h-2 bg-[#ff6b6b] rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-[#ff6b6b] rounded-full animate-bounce delay-100"></div>
            <div className="w-2 h-2 bg-[#ff6b6b] rounded-full animate-bounce delay-200"></div>
          </div>
          <p className="text-lg text-gray-600">Loading testimonials...</p>
        </div>
      </section>
    )
  }

  return (
    <>
      <section className="py-20 bg-gradient-to-br from-amber-50 via-orange-50 to-stone-100 border-b-2 border-red-100 shadow-sm">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-16">
            <div className="flex items-center justify-center gap-4 mb-4">
              <div className="w-12 h-px bg-[#c41e3a]" />
              <span className="text-xs lg:text-sm font-medium text-[#c41e3a] tracking-[0.2em] uppercase">
                Trusted Impressions
              </span>
              <div className="w-12 h-px bg-[#c41e3a]" />
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold leading-tight mb-5">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-700 to-red-600">
                What Our Guests Say
              </span>
            </h2>
            <p className="text-md lg:text-lg text-gray-600 leading-relaxed">
              Real experiences from our valued customers
            </p>
          </div>

          {/* Testimonials Carousel */}
          {testimonials.length > 0 ? (
            <div
              className="max-w-6xl mx-auto flex items-center gap-4"
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              {/* Previous Button */}
              {testimonials.length > visibleCount && (
                <button
                  onClick={prevSlide}
                  className="flex-shrink-0 bg-red-600 hover:bg-red-700 text-white rounded-full p-3 md:p-4 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 relative z-50"
                  aria-label="Previous testimonial"
                >
                  <ChevronLeft className="w-5 h-5 md:w-6 md:h-6" />
                </button>
              )}

              {/* Cards */}
              <div className={`grid gap-6 flex-1 grid-cols-1 md:grid-cols-2 lg:grid-cols-3`}>
                {testimonials
                  .slice(currentIndex, currentIndex + visibleCount)
                  .map((testimonial) => (
                    <Card
                      key={testimonial.id}
                      onClick={() => setSelectedTestimonial(testimonial)}
                      className="group hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border-2 border-red-200 bg-white cursor-pointer"
                    >
                      <CardContent className="p-6 space-y-4">
                        <Quote className="w-8 h-8 text-red-400" />
                        <div className="flex gap-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${i < testimonial.rating ? "text-red-600 fill-red-600" : "text-gray-300"}`}
                            />
                          ))}
                        </div>
                        <p className="text-gray-700 italic line-clamp-3">
                          &apos;{testimonial.message}&apos;
                        </p>
                        <p className="text-red-600 font-semibold group-hover:text-red-700">
                          Read more →
                        </p>
                        <div className="pt-4 border-t border-red-100">
                          <p className="font-semibold text-gray-900">{testimonial.client_name}</p>
                          <p className="text-xs text-gray-500">
                            {new Date(testimonial.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
              </div>

              {/* Next Button */}
              {testimonials.length > visibleCount && (
                <button
                  onClick={nextSlide}
                  className="flex-shrink-0 bg-red-600 hover:bg-red-700 text-white rounded-full p-3 md:p-4 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 relative z-50"
                  aria-label="Next testimonial"
                >
                  <ChevronRight className="w-5 h-5 md:w-6 md:h-6" />
                </button>
              )}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600">No testimonials yet. Be the first to share your experience!</p>
            </div>
          )}
        </div>
      </section>

      {/* Modal */}
      {selectedTestimonial && (
        <div
          className="fixed inset-0 bg-black/50 z-[9999] flex items-center justify-center p-4"
          onClick={() => setSelectedTestimonial(null)}
        >
          <div
            className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl relative border-2 border-red-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-gradient-to-r from-red-700 to-red-600 text-white p-6 rounded-t-2xl">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-2xl font-bold">{selectedTestimonial.client_name}</h3>
                  <p className="text-red-100 text-sm mt-1">
                    {new Date(selectedTestimonial.created_at).toLocaleDateString()}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedTestimonial(null)}
                  className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition-all"
                  aria-label="Close modal"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="flex gap-1 mt-4">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-6 h-6 ${i < selectedTestimonial.rating ? "text-amber-300 fill-amber-300" : "text-white text-opacity-30"}`}
                  />
                ))}
              </div>
            </div>

            <div className="p-6 space-y-4">
              <Quote className="w-12 h-12 text-red-400" />
              <p className="text-gray-700 text-lg leading-relaxed italic">
                &apos;{selectedTestimonial.message}&apos;
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
