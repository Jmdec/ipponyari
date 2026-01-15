"use client"
import { useEffect, useState } from "react"
import { Star, Send, Sparkles, CheckCircle, ArrowRight, ChevronLeft, ChevronRight } from "lucide-react"

interface Testimonial {
  id: number
  client_name: string
  client_email: string
  rating: number
  message: string
  created_at: string
}

export default function TestimonialsPage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [rating, setRating] = useState(5)
  const [hoverRating, setHoverRating] = useState(0)
  const [charCount, setCharCount] = useState(0)
  const [showSuccess, setShowSuccess] = useState(false)
  const [currentSlide, setCurrentSlide] = useState(0)

  const [formData, setFormData] = useState({
    client_name: "",
    client_email: "",
    rating: 5,
    message: "",
  })

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const response = await fetch("/api/testimonials?status=approved")
        if (!response.ok) throw new Error("Failed to fetch testimonials")
        const data = await response.json()
        setTestimonials(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred")
      } finally {
        setLoading(false)
      }
    }

    fetchTestimonials()
  }, [])

  const handleFormChange = (e: { target: { name: any; value: any } }) => {
    const { name, value } = e.target
    if (name === "message") {
      setCharCount(value.length)
    }
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const isFormValid = () => {
    return formData.client_name.trim() && formData.client_email.trim() && formData.message.trim()
  }

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      const response = await fetch("/api/testimonials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          rating: rating,
        }),
      })

      if (!response.ok) throw new Error("Failed to submit testimonial")

      setShowSuccess(true)
      setFormData({
        client_name: "",
        client_email: "",
        rating: 5,
        message: "",
      })
      setRating(5)
      setCharCount(0)

      setTimeout(() => setShowSuccess(false), 4000)

      const refreshResponse = await fetch("/api/testimonials?status=approved")
      if (refreshResponse.ok) {
        const data = await refreshResponse.json()
        setTestimonials(data)
      }
    } catch (err) {
      console.error(err)
    } finally {
      setSubmitting(false)
    }
  }

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % testimonials.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + testimonials.length) % testimonials.length)
  }

  const goToSlide = (index: number) => {
    setCurrentSlide(index)
  }

  if (showSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#8B0000] via-[#6B0000] to-[#2B0000] flex items-center justify-center p-4 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
          <div className="absolute top-20 left-10 w-64 h-64 bg-[#dc143c]/30 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-64 h-64 bg-[#dc143c]/30 rounded-full blur-3xl animate-pulse delay-700"></div>
        </div>

        <div className="text-center relative z-10 animate-in zoom-in duration-500">
          <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl animate-bounce">
            <CheckCircle className="w-14 h-14 text-[#dc143c]" />
          </div>
          <h2 className="text-4xl font-black text-white mb-2 drop-shadow-lg">Thank You!</h2>
          <p className="text-xl text-white/90 mb-1">Your testimonial has been received</p>
          <p className="text-white/70">We appreciate your kind words and can't wait to see you again!</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#8B0000] via-[#6B0000] to-[#2B0000] py-16 px-4 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
        <div className="absolute top-0 left-0 w-96 h-96 bg-[#dc143c]/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#dc143c]/30 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#dc143c]/20 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-20 animate-in fade-in slide-in-from-top duration-700">
          <div className="mb-4 flex justify-center">
            <div className="bg-[#ff6b6b]/20 backdrop-blur-sm px-4 py-2 rounded-full border border-[#ff6b6b]/30">
              <span className="text-white text-sm font-semibold">⭐ LOVED BY GUESTS</span>
            </div>
          </div>
          <h1 className="text-6xl md:text-7xl font-black mb-4 text-white drop-shadow-2xl">Guest Stories</h1>
          <p className="text-xl text-white/80 max-w-2xl mx-auto">Discover why guests keep coming back to Ipponyari</p>
        </div>

        {/* Main Grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Testimonials Carousel */}
          <div className="lg:col-span-2 overflow-hidden">
            {loading && (
              <div className="text-center py-16 animate-in fade-in duration-500">
                <Sparkles className="w-8 h-8 text-[#ff6b6b] mx-auto animate-spin mb-4" />
                <p className="text-white/70">Loading stories...</p>
              </div>
            )}

            {error && (
              <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-8 text-center shadow-2xl">
                <p className="text-[#ff6b6b] font-semibold">Unable to load testimonials</p>
              </div>
            )}

            {!loading && !error && (
              <>
                {testimonials.length === 0 ? (
                  <div className="text-center py-16 bg-white/10 backdrop-blur-sm rounded-3xl border border-white/20 shadow-2xl animate-in fade-in zoom-in duration-500">
                    <Sparkles className="w-12 h-12 text-[#ff6b6b] mx-auto mb-4" />
                    <p className="text-white/80 text-lg font-semibold">Be the first to share your story</p>
                  </div>
                ) : (
                  <div className="relative">
                    {/* Carousel Container */}
                    <div className="overflow-hidden rounded-3xl">
                      <div
                        className="flex transition-transform duration-500 ease-in-out"
                        style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                      >
                        {testimonials.map((testimonial, index) => (
                          <div key={testimonial.id} className="w-full flex-shrink-0 px-8 sm:px-12">
                            <div 
                              style={{ animationDelay: `${index * 100}ms` }}
                              className="group relative bg-[#4B0000]/60 backdrop-blur-sm border border-white/30 rounded-3xl p-5 sm:p-6 md:p-8 hover:border-white/50 hover:shadow-2xl transition-all duration-500 overflow-hidden animate-in fade-in zoom-in"
                            >
                              <div className="absolute inset-0 bg-gradient-to-r from-[#ff6b6b]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                              <div className="relative">
                                {/* Stars */}
                                <div className="flex gap-1 mb-3 sm:mb-4">
                                  {[...Array(5)].map((_, i) => (
                                    <Star
                                      key={i}
                                      className={`w-4 h-4 sm:w-5 sm:h-5 ${
                                        i < testimonial.rating ? "text-[#ff6b6b] fill-[#ff6b6b]" : "text-white/40"
                                      }`}
                                    />
                                  ))}
                                </div>

                                <p className="text-3xl sm:text-5xl md:text-6xl text-[#ff6b6b]/40 font-serif leading-none mb-2">
                                  "
                                </p>

                                <p className="text-sm sm:text-base md:text-lg text-white leading-relaxed mb-4 sm:mb-6 font-light">
                                  {testimonial.message}
                                </p>

                                <div className="h-px bg-gradient-to-r from-white/0 via-white/40 to-white/0 mb-4 sm:mb-6" />

                                <div className="flex items-center justify-between">
                                  <div>
                                    <p className="font-bold text-white text-sm sm:text-base md:text-lg">
                                      {testimonial.client_name}
                                    </p>
                                    <p className="text-xs sm:text-sm text-white/80">
                                      {new Date(testimonial.created_at).toLocaleDateString("en-US", {
                                        month: "short",
                                        day: "numeric",
                                        year: "numeric",
                                      })}
                                    </p>
                                  </div>
                                  <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 text-white/0 group-hover:text-[#ff6b6b] transition-all duration-500 group-hover:translate-x-1" />
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Navigation Buttons */}
                    {testimonials.length > 1 && (
                      <>
                        <button
                          onClick={prevSlide}
                          className="absolute left-2 top-1/2 -translate-y-1/2 bg-white hover:bg-white/90 text-[#8B0000] p-2 sm:p-2.5 md:p-3 rounded-full shadow-lg transition-all hover:scale-110"
                          style={{ zIndex: 9999 }}
                          aria-label="Previous testimonial"
                        >
                          <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
                        </button>
                        <button
                          onClick={nextSlide}
                          className="absolute right-2 top-1/2 -translate-y-1/2 bg-white hover:bg-white/90 text-[#8B0000] p-2 sm:p-2.5 md:p-3 rounded-full shadow-lg transition-all hover:scale-110"
                          style={{ zIndex: 9999 }}
                          aria-label="Next testimonial"
                        >
                          <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
                        </button>
                      </>
                    )}

                    {/* Dots Indicator */}
                    {testimonials.length > 1 && (
                      <div className="flex justify-center gap-2 mt-6">
                        {testimonials.map((_, index) => (
                          <button
                            key={index}
                            onClick={() => goToSlide(index)}
                            className={`h-2 rounded-full transition-all ${
                              currentSlide === index ? "bg-white w-8" : "bg-white/30 w-2 hover:bg-white/50"
                            }`}
                            aria-label={`Go to testimonial ${index + 1}`}
                          />
                        ))}
                      </div>
                    )}

                    {/* Counter */}
                    {testimonials.length > 1 && (
                      <div className="text-center mt-4">
                        <p className="text-sm text-white/80 font-medium">
                          {currentSlide + 1} / {testimonials.length}
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </>
            )}
          </div>

          {/* Form */}
          <div className="lg:col-span-1">
            <div className="sticky top-8 bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 overflow-hidden group shadow-2xl">
              <div className="absolute inset-0 bg-gradient-to-br from-[#ff6b6b]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              <div className="relative">
                <h2 className="text-3xl font-black text-white mb-2 drop-shadow-lg">Share Your Story</h2>
                <p className="text-white/70 text-sm mb-8">Tell us about your experience</p>

                <div className="space-y-5">
                  {/* Name */}
                  <div>
                    <label className="block text-sm font-bold text-white mb-3">Your Name</label>
                    <input
                      type="text"
                      name="client_name"
                      value={formData.client_name}
                      onChange={handleFormChange}
                      required
                      placeholder="Enter your name"
                      className="w-full px-5 py-3.5 bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl focus:outline-none focus:border-white focus:ring-2 focus:ring-white/30 transition-all text-white placeholder-white/60"
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-sm font-bold text-white mb-3">Email Address</label>
                    <input
                      type="email"
                      name="client_email"
                      value={formData.client_email}
                      onChange={handleFormChange}
                      required
                      placeholder="your@email.com"
                      className="w-full px-5 py-3.5 bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl focus:outline-none focus:border-white focus:ring-2 focus:ring-white/30 transition-all text-white placeholder-white/60"
                    />
                  </div>

                  {/* Rating */}
                  <div>
                    <label className="block text-sm font-bold text-white mb-4">Your Rating</label>
                    <div className="flex gap-3">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setRating(star)}
                          onMouseEnter={() => setHoverRating(star)}
                          onMouseLeave={() => setHoverRating(0)}
                          className="transition-all transform hover:scale-125 focus:outline-none"
                        >
                          <Star
                            className={`w-8 h-8 transition-all ${
                              star <= (hoverRating || rating) ? "text-[#ff6b6b] fill-[#ff6b6b]" : "text-white/30"
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Message */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <label className="text-sm font-bold text-white">Your Message</label>
                      <span className="text-xs text-white/80">{charCount}/500</span>
                    </div>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleFormChange}
                      required
                      rows={5}
                      maxLength={500}
                      placeholder="What was your favorite moment?"
                      className="w-full px-5 py-3.5 bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl focus:outline-none focus:border-white focus:ring-2 focus:ring-white/30 transition-all resize-none text-white placeholder-white/60"
                    />
                  </div>

                  {/* Submit Button */}
                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={submitting || !isFormValid()}
                    className="w-full bg-white hover:bg-white/90 disabled:bg-white/20 text-[#8B0000] disabled:text-white/50 font-bold py-4 px-6 rounded-xl transition-all flex items-center justify-center gap-2 disabled:cursor-not-allowed mt-2 shadow-lg hover:scale-105 disabled:hover:scale-100"
                  >
                    <Send className="w-5 h-5" />
                    {submitting ? "Sharing..." : "Share Story"}
                  </button>

                  <p className="text-xs text-white/80 text-center pt-3">✓ Reviewed before appearing</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        {!loading && testimonials.length > 0 && (
          <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              {
                label: "Average Rating",
                value: (testimonials.reduce((sum, t) => sum + t.rating, 0) / testimonials.length).toFixed(1),
              },
              { label: "Happy Guests", value: testimonials.length },
              {
                label: "5-Star Reviews",
                value: testimonials.filter((t) => t.rating === 5).length,
              },
              {
                label: "Satisfaction",
                value: "100%",
              },
            ].map((stat, idx) => (
              <div
                key={idx}
                className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 text-center hover:border-white/30 hover:shadow-2xl transition-all animate-in fade-in zoom-in duration-500"
                style={{ animationDelay: `${idx * 100}ms` }}
              >
                <p className="text-3xl font-black text-[#ff6b6b] mb-2">{stat.value}</p>
                <p className="text-white/80 text-sm font-medium">{stat.label}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}