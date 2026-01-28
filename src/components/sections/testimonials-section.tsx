"use client"

import { useEffect, useRef, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Star, Quote, X } from "lucide-react"

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
  const [selectedTestimonial, setSelectedTestimonial] =
    useState<Testimonial | null>(null)
  const [isHovered, setIsHovered] = useState(false)

  const trackRef = useRef<HTMLDivElement>(null)
  const position = useRef(0)
  const speed = 0.35 // 🔥 adjust speed here

  /* Fetch testimonials */
  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const response = await fetch("/api/testimonials?status=approved")
        const data = await response.json()
        setTestimonials(data.filter((t: Testimonial) => t.status === "approved"))
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchTestimonials()
  }, [])

  /* Continuous animation */
  useEffect(() => {
    if (!trackRef.current || testimonials.length === 0) return

    const track = trackRef.current
    let rafId: number

    const animate = () => {
      if (!isHovered) {
        position.current -= speed
        const resetPoint = track.scrollWidth / 2

        if (Math.abs(position.current) >= resetPoint) {
          position.current = 0
        }

        track.style.transform = `translateX(${position.current}px)`
      }
      rafId = requestAnimationFrame(animate)
    }

    rafId = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(rafId)
  }, [testimonials, isHovered])

  const duplicatedTestimonials = [...testimonials, ...testimonials]

  if (loading) return null

  return (
    <>
      <section className="py-20 bg-gradient-to-br from-amber-50 via-orange-50 to-stone-100 border-b-2 border-red-100">
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

            <h2 className="text-4xl lg:text-5xl font-bold mb-5">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-700 to-red-600">
                What Our Guests Say
              </span>
            </h2>

            <p className="text-gray-600 text-lg">
              Real experiences from our valued customers
            </p>
          </div>

          {/* Continuous Carousel */}
          <div
            className="relative overflow-hidden max-w-7xl mx-auto shadow-lg rounded-xl"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <div
              ref={trackRef}
              className="flex gap-6 will-change-transform"
            >
              {duplicatedTestimonials.map((testimonial, index) => (
                <Card
                  key={`${testimonial.id}-${index}`}
                  onClick={() => setSelectedTestimonial(testimonial)}
                  className="min-w-[300px] md:min-w-[360px] lg:min-w-[380px]
                             bg-white border-2 border-red-200 cursor-pointer
                             transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl"
                >
                  <CardContent className="p-6 space-y-4">
                    <Quote className="w-8 h-8 text-red-400" />

                    <div className="flex gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < testimonial.rating
                              ? "text-red-600 fill-red-600"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>

                    <p className="italic text-gray-700 line-clamp-3">
                      &apos;{testimonial.message}&apos;
                    </p>

                    <p className="text-red-600 font-semibold">
                      Read more →
                    </p>

                    <div className="pt-4 border-t border-red-100">
                      <p className="font-semibold text-gray-900">
                        {testimonial.client_name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(testimonial.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Modal */}
      {selectedTestimonial && (
        <div
          className="fixed inset-0 bg-black/50 z-[9999] flex items-center justify-center p-4"
          onClick={() => setSelectedTestimonial(null)}
        >
          <div
            className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border-2 border-red-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-gradient-to-r from-red-700 to-red-600 text-white p-6 rounded-t-2xl">
              <div className="flex justify-between">
                <div>
                  <h3 className="text-2xl font-bold">
                    {selectedTestimonial.client_name}
                  </h3>
                  <p className="text-sm text-red-100">
                    {new Date(selectedTestimonial.created_at).toLocaleDateString()}
                  </p>
                </div>

                <button
                  onClick={() => setSelectedTestimonial(null)}
                  className="hover:bg-white/20 rounded-full p-2"
                >
                  <X />
                </button>
              </div>

              <div className="flex gap-1 mt-4">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-5 h-5 ${
                      i < selectedTestimonial.rating
                        ? "text-amber-300 fill-amber-300"
                        : "text-white/30"
                    }`}
                  />
                ))}
              </div>
            </div>

            <div className="p-6">
              <Quote className="w-10 h-10 text-red-400 mb-4" />
              <p className="italic text-gray-700 text-lg">
                &apos;{selectedTestimonial.message}&apos;
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
