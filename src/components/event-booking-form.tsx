"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface FormData {
  name: string
  email: string
  userId?: number
  eventType: string
  guests: number
  preferredDate: string
  preferredTime: string
  venueArea: string
}

interface User {
  id: number
  name: string
  email: string
}

interface EventBookingFormProps {
  onSuccess?: () => void
  user?: User | null
}

export default function EventBookingForm({ onSuccess, user: initialUser }: EventBookingFormProps) {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    userId: undefined,
    eventType: "",
    guests: 0,
    preferredDate: "",
    preferredTime: "",
    venueArea: "",
  })

  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")
  const [user, setUser] = useState<User | null>(initialUser || null)

  useEffect(() => {
    if (initialUser) {
      setUser(initialUser)
      return
    }

    const userData = localStorage.getItem("user_data")
    if (userData) {
      try {
        const parsedUser = JSON.parse(userData)
        setUser(parsedUser)
      } catch (error) {
        console.error("Error parsing user data:", error)
      }
    }
  }, [initialUser])

  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        name: user.name || "",
        email: user.email || "",
        userId: user.id,
      }))
    }
  }, [user])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: name === "guests" ? Number.parseInt(value) : value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage("")
    setLoading(true)

    try {
      const token = localStorage.getItem("auth_token")
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      }

      if (token) {
        headers["Authorization"] = `Bearer ${token}`
      }

      const response = await fetch("/api/events", {
        method: "POST",
        headers,
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to book event")
      }

      setMessage("Event booked successfully!")

      setFormData({
        name: user?.name || "",
        email: user?.email || "",
        userId: user?.id,
        eventType: "",
        guests: 0,
        preferredDate: "",
        preferredTime: "",
        venueArea: "",
      })

      setTimeout(() => {
        onSuccess?.()
      }, 1500)
    } catch (error) {
      setMessage("Error booking event. Please try again.")
      console.error("Error:", error)
    } finally {
      setLoading(false)
    }
  }

  const isLoggedIn = !!user

  return (
    <div className="w-full max-h-[90vh] overflow-y-auto">
      <Card className="bg-white border-2 border-[#dc143c]/20 shadow-lg">
        <div className="p-4 md:p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="border-b border-[#dc143c]/20 pb-2">
              <h2 className="text-lg font-bold text-gray-800">Contact Information</h2>
              {isLoggedIn && (
                <p className="text-xs text-gray-600 mt-1">
                  Booking as: <span className="font-semibold text-[#dc143c]">{user.name}</span>
                </p>
              )}
              {!isLoggedIn && <p className="text-xs text-gray-500 mt-1">Not logged in - booking as guest</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-gray-700 font-semibold text-sm">
                  Full Name
                </Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="Enter your full name"
                  disabled={isLoggedIn}
                  className={`border-2 border-[#dc143c]/30 focus:ring-2 focus:ring-[#dc143c]/30 focus:border-[#dc143c] py-2 px-3 font-semibold text-sm rounded-lg hover:border-[#dc143c]/50 transition-all ${
                    isLoggedIn ? "bg-gray-100 cursor-not-allowed" : "bg-white"
                  }`}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-700 font-semibold text-sm">
                  Email Address
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="your.email@example.com"
                  disabled={isLoggedIn}
                  className={`border-2 border-[#dc143c]/30 focus:ring-2 focus:ring-[#dc143c]/30 focus:border-[#dc143c] py-2 px-3 font-semibold text-sm rounded-lg hover:border-[#dc143c]/50 transition-all ${
                    isLoggedIn ? "bg-gray-100 cursor-not-allowed" : "bg-white"
                  }`}
                />
              </div>
            </div>

            <div className="border-b border-[#dc143c]/20 pb-2 pt-2">
              <h2 className="text-lg font-bold text-gray-800">Event Details</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="eventType" className="text-gray-700 font-semibold text-sm">
                  Event Type
                </Label>
                <select
                  id="eventType"
                  name="eventType"
                  value={formData.eventType}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border-2 border-[#dc143c]/30 rounded-lg bg-white text-gray-800 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#dc143c]/30 focus:border-[#dc143c] transition-all hover:border-[#dc143c]/50"
                >
                  <option value="">Select an event type</option>
                  <option value="wedding">Wedding</option>
                  <option value="corporate">Corporate Event</option>
                  <option value="birthday">Birthday Party</option>
                  <option value="conference">Conference</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="guests" className="text-gray-700 font-semibold text-sm">
                  Number of Guests
                </Label>
                <select
                  id="guests"
                  name="guests"
                  value={formData.guests}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border-2 border-[#dc143c]/30 rounded-lg bg-white text-gray-800 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#dc143c]/30 focus:border-[#dc143c] transition-all hover:border-[#dc143c]/50"
                >
                  <option value="">Select number of guests</option>
                  {Array.from({ length: 30 }, (_, i) => i + 1).map((num) => (
                    <option key={num} value={num}>
                      {num} {num === 1 ? "Guest" : "Guests"}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="border-b border-[#dc143c]/20 pb-2 pt-2">
              <h2 className="text-lg font-bold text-gray-800">Date & Time</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="preferredDate" className="text-gray-700 font-semibold text-sm">
                  Preferred Date
                </Label>
                <Input
                  id="preferredDate"
                  name="preferredDate"
                  type="date"
                  value={formData.preferredDate}
                  onChange={handleChange}
                  required
                  min={new Date().toISOString().split("T")[0]}
                  className="border-2 border-[#dc143c]/30 focus:ring-2 focus:ring-[#dc143c]/30 focus:border-[#dc143c] py-2 px-3 font-semibold text-sm rounded-lg hover:border-[#dc143c]/50 transition-all bg-white"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="preferredTime" className="text-gray-700 font-semibold text-sm">
                  Preferred Time
                </Label>
                <Input
                  id="preferredTime"
                  name="preferredTime"
                  type="time"
                  value={formData.preferredTime}
                  onChange={handleChange}
                  required
                  style={{ position: "relative", zIndex: 9999 }}
                  className="border-2 border-[#dc143c]/30 focus:ring-2 focus:ring-[#dc143c]/30 focus:border-[#dc143c] py-2 px-3 font-semibold text-sm rounded-lg hover:border-[#dc143c]/50 transition-all bg-white"
                />
              </div>
            </div>

            <div className="border-b border-[#dc143c]/20 pb-2 pt-2">
              <h2 className="text-lg font-bold text-gray-800">Venue</h2>
            </div>

            <div className="space-y-2">
              <Label htmlFor="venueArea" className="text-gray-700 font-semibold text-sm">
                Venue Area (Inside Restaurant)
              </Label>
              <select
                id="venueArea"
                name="venueArea"
                value={formData.venueArea}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border-2 border-[#dc143c]/30 rounded-lg bg-white text-gray-800 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#dc143c]/30 focus:border-[#dc143c] transition-all hover:border-[#dc143c]/50"
              >
                <option value="">Select a venue area</option>
                <option value="vip_area">VIP AREA</option>
                <option value="main_hall">Main Hall</option>
                <option value="private_room">Private Room</option>
              </select>
            </div>

            {message && (
              <div
                className={`p-3 rounded-lg text-center font-bold text-sm border-2 ${
                  message.includes("successfully")
                    ? "bg-green-100 text-green-800 border-green-300"
                    : "bg-red-100 text-red-800 border-red-300"
                }`}
              >
                {message}
              </div>
            )}

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-[#dc143c] to-[#7f0020] hover:from-[#e8324f] hover:to-[#a00028] text-white font-bold py-2 px-4 rounded-lg text-sm transition-all shadow-md hover:shadow-lg active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Booking..." : "Book Event"}
            </Button>
          </form>
        </div>
      </Card>
    </div>
  )
}
