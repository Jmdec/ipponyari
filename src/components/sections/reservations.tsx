"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Calendar, Clock, Users, Phone } from "lucide-react"

export default function ReservationsSection() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    date: "",
    time: "",
    guests: "2",
    message: "",
  })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(false)

    try {
      const response = await fetch("/api/reservations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.details || data.error || "Failed to create reservation")
      }

      setSuccess(true)
      setFormData({
        name: "",
        email: "",
        phone: "",
        date: "",
        time: "",
        guests: "2",
        message: "",
      })

      setTimeout(() => setSuccess(false), 5000)
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "An error occurred"
      setError(errorMsg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="py-24 bg-gradient-to-b from-black via-[#0d0004] to-black">
      {/* Crimson glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#dc143c]/5 rounded-full blur-[150px]" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="w-12 h-px bg-gradient-to-r from-transparent to-[#dc143c]" />
            <span className="text-sm font-medium text-[#dc143c] tracking-[0.2em] uppercase">Reservations</span>
            <div className="w-12 h-px bg-gradient-to-l from-transparent to-[#dc143c]" />
          </div>
          <h2 className="text-4xl font-semibold text-white">Reserve Your Table</h2>
          <p className="text-lg text-white/50 max-w-2xl mx-auto mt-4">Join us for an unforgettable dining experience</p>
        </div>

        {/* Reservation Form */}
        <div className="max-w-2xl mx-auto">
          <Card className="border-[#dc143c]/20 bg-gradient-to-b from-[#1a0008] to-black shadow-[0_0_60px_rgba(220,20,60,0.1)]">
            <CardHeader className="border-b border-[#dc143c]/20">
              <CardTitle className="text-white">Reservation Details</CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              {success && (
                <div className="mb-6 p-4 bg-emerald-900/30 border border-emerald-500/50 rounded-lg">
                  <p className="text-emerald-400 font-semibold">Reservation submitted successfully!</p>
                  <p className="text-emerald-300/70 text-sm">We'll confirm your booking shortly.</p>
                </div>
              )}

              {error && (
                <div className="mb-6 p-4 bg-[#dc143c]/10 border border-[#dc143c]/30 rounded-lg">
                  <p className="text-[#dc143c] font-semibold">Error</p>
                  <p className="text-[#dc143c]/70 text-sm">{error}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name and Email */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-white/70 mb-2">Full Name</label>
                    <Input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Your name"
                      required
                      className="bg-black/50 border-[#dc143c]/30 text-white placeholder:text-white/30 focus:border-[#dc143c] focus:ring-[#dc143c]/20"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-white/70 mb-2">Email</label>
                    <Input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="your@email.com"
                      required
                      className="bg-black/50 border-[#dc143c]/30 text-white placeholder:text-white/30 focus:border-[#dc143c] focus:ring-[#dc143c]/20"
                    />
                  </div>
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-medium text-white/70 mb-2 flex items-center gap-2">
                    <Phone className="w-4 h-4 text-[#dc143c]" />
                    Phone Number
                  </label>
                  <Input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+1 (555) 000-0000"
                    required
                    className="bg-black/50 border-[#dc143c]/30 text-white placeholder:text-white/30 focus:border-[#dc143c] focus:ring-[#dc143c]/20"
                  />
                </div>

                {/* Date, Time, Guests */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-white/70 mb-2 flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-[#dc143c]" />
                      Date
                    </label>
                    <Input
                      type="date"
                      name="date"
                      value={formData.date}
                      onChange={handleChange}
                      required
                      className="bg-black/50 border-[#dc143c]/30 text-white focus:border-[#dc143c] focus:ring-[#dc143c]/20"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-white/70 mb-2 flex items-center gap-2">
                      <Clock className="w-4 h-4 text-[#dc143c]" />
                      Time
                    </label>
                    <Input
                      type="time"
                      name="time"
                      value={formData.time}
                      onChange={handleChange}
                      required
                      className="bg-black/50 border-[#dc143c]/30 text-white focus:border-[#dc143c] focus:ring-[#dc143c]/20"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-white/70 mb-2 flex items-center gap-2">
                      <Users className="w-4 h-4 text-[#dc143c]" />
                      Guests
                    </label>
                    <select
                      name="guests"
                      value={formData.guests}
                      onChange={handleChange}
                      className="w-full px-3 py-2 bg-black/50 border border-[#dc143c]/30 rounded-md text-white focus:border-[#dc143c] focus:ring-[#dc143c]/20"
                    >
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                        <option key={num} value={num} className="bg-black text-white">
                          {num} {num === 1 ? "Guest" : "Guests"}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Message */}
                <div>
                  <label className="block text-sm font-medium text-white/70 mb-2">Special Requests</label>
                  <Textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Any special requests or dietary requirements?"
                    className="bg-black/50 border-[#dc143c]/30 text-white placeholder:text-white/30 focus:border-[#dc143c] focus:ring-[#dc143c]/20 resize-none"
                    rows={4}
                  />
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-[#dc143c] to-[#7f0020] hover:from-[#e8324f] hover:to-[#a00028] text-white py-6 tracking-wider shadow-[0_0_30px_rgba(220,20,60,0.3)] hover:shadow-[0_0_40px_rgba(220,20,60,0.5)] transition-all duration-300"
                >
                  {loading ? "Submitting..." : "Reserve Table"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
