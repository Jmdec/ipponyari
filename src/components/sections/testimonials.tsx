"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Star } from "lucide-react"

interface Testimonial {
  id: number
  name: string
  role: string
  content: string
  rating: number
  image?: string
  created_at: string
}

export default function TestimonialsSection() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const response = await fetch("/api/testimonials")
        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.details || data.error || "Failed to fetch testimonials")
        }

        setTestimonials(data)
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : "An error occurred"
        setError(errorMsg)
      } finally {
        setLoading(false)
      }
    }

    fetchTestimonials()
  }, [])

  if (loading) {
    return (
      <section className="py-20 bg-gradient-to-br from-white via-gray-50 to-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold mb-4">
              <span className="bg-gradient-to-r from-[#dc143c] via-[#e8324f] to-[#7f0020] bg-clip-text text-transparent">
                What Our Guests Say
              </span>
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-64 bg-[#dc143c]/5 rounded-lg animate-pulse" />
            ))}
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="relative py-20 overflow-hidden">
      {/* Background with crimson accents */}
      <div className="absolute inset-0 bg-gradient-to-br from-white via-gray-50 to-white">
        <div className="absolute top-10 left-10 w-32 h-32 bg-[#dc143c]/10 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-[#7f0020]/10 rounded-full blur-lg animate-pulse delay-1000"></div>
        <div className="absolute bottom-20 left-1/4 w-40 h-40 bg-[#dc143c]/5 rounded-full blur-2xl animate-pulse delay-500"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="text-lg font-medium text-[#dc143c] tracking-wide">GUEST REVIEWS</span>
          <h2 className="text-4xl lg:text-5xl font-bold mt-4 mb-6">
            <span className="bg-gradient-to-r from-[#dc143c] via-[#e8324f] to-[#7f0020] bg-clip-text text-transparent">
              What Our Guests Say
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Join thousands of satisfied customers who have experienced authentic Japanese hospitality
          </p>
        </div>

        {/* Testimonials Grid */}
        {error ? (
          <div className="bg-[#dc143c]/5 border border-[#dc143c]/30 rounded-lg p-6 text-center">
            <p className="text-[#dc143c] font-semibold mb-2">Unable to load testimonials</p>
            <p className="text-[#7f0020] text-sm">{error}</p>
          </div>
        ) : testimonials.length === 0 ? (
          <div className="text-center text-gray-600 py-8">No testimonials yet. Be the first to share!</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {testimonials.map((testimonial) => (
              <Card
                key={testimonial.id}
                className="group hover:shadow-[0_10px_40px_rgba(220,20,60,0.15)] transition-all duration-500 hover:-translate-y-2 bg-white/80 backdrop-blur-sm border border-[#dc143c]/10 hover:border-[#dc143c]/30 h-full flex flex-col"
              >
                <CardContent className="p-8 flex flex-col flex-1">
                  {/* Rating Stars */}
                  <div className="flex gap-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-5 h-5 ${
                          i < testimonial.rating ? "fill-[#dc143c] text-[#dc143c]" : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>

                  {/* Testimonial Content */}
                  <p className="text-gray-700 mb-6 flex-1 leading-relaxed italic">"{testimonial.content}"</p>

                  {/* Author Info */}
                  <div className="border-t border-[#dc143c]/10 pt-4">
                    <h3 className="font-bold text-lg text-gray-800">{testimonial.name}</h3>
                    <p className="text-sm text-[#dc143c] font-medium">{testimonial.role}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
