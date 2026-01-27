"use client"

import { useState, useEffect } from "react"
import {
  ChevronRight,
  Users,
  Calendar,
  Clock,
  Mail,
  Phone,
  User,
  MessageSquare,
  CheckCircle,
  AlertCircle,
} from "lucide-react"

export default function ReservationsPage() {
  const [step, setStep] = useState(1)
  const [user, setUser] = useState<any>(null)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    date: "",
    time: "",
    guests: "2",
    special_requests: "",
  })
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")
  const [emailError, setEmailError] = useState("")
  const [phoneError, setPhoneError] = useState("")
  const [dailyBookingsCount, setDailyBookingsCount] = useState(0)
  const [checkingBookings, setCheckingBookings] = useState(false)

  useEffect(() => {
    const userData = localStorage.getItem("user_data")
    const token = localStorage.getItem("auth_token")

    if (!userData || !token) {
      window.location.href = "/login?redirect=/reservations"
      return
    }

    try {
      const parsedUser = JSON.parse(userData)
      setUser(parsedUser)
      setFormData((prev) => ({
        ...prev,
        name: parsedUser.name || "",
        email: parsedUser.email || "",
        phone: parsedUser.phone || prev.phone,
      }))
    } catch (error) {
      console.error("Error parsing user data:", error)
      window.location.href = "/login?redirect=/reservations"
    }
  }, [])

  useEffect(() => {
    const checkDailyBookings = async () => {
      if (!formData.date || !user) return

      setCheckingBookings(true)
      try {
        const token = localStorage.getItem("auth_token")
        const response = await fetch(`/api/reservations/check-daily?date=${formData.date}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (response.ok) {
          const data = await response.json()
          setDailyBookingsCount(data.count || 0)
        }
      } catch (error) {
        console.error("Error checking daily bookings:", error)
      } finally {
        setCheckingBookings(false)
      }
    }

    checkDailyBookings()
  }, [formData.date, user])

  const handleChange = (e: { target: { name: string; value: string } }) => {
    const { name, value } = e.target

    if (name === "email") {
      setFormData((prev) => ({ ...prev, [name]: value }))
      if (!isValidEmail(value)) {
        setEmailError("Please enter a valid email address")
      } else {
        setEmailError("")
      }
      return
    }

    if (name === "phone") {
      // Remove all non-digit characters for counting
      const digitsOnly = value.replace(/\D/g, "")
      if (digitsOnly.length > 11) {
        setPhoneError("Phone number cannot exceed 11 digits")
      } else if (!/^[0-9+()\- ]*$/.test(value)) {
        setPhoneError("Phone number can only contain digits, +, - or ()")
      } else {
        setPhoneError("")
        setFormData((prev) => ({ ...prev, [name]: value }))
      }
      return
    }

    if (name === "date") {
      setFormData((prev) => {
        const newData = { ...prev, [name]: value }
        if (value === getMinDate() && prev.time) {
          const selectedDateTime = new Date(`${value}T${prev.time}`)
          if (selectedDateTime <= new Date()) {
            newData.time = ""
          }
        }
        return newData
      })
      return
    }

    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const getMinDate = () => {
    const today = new Date()
    return today.toISOString().split("T")[0]
  }

  const getMinTime = () => {
    const today = new Date().toISOString().split("T")[0]
    if (formData.date === today) {
      const now = new Date()
      const hours = String(now.getHours()).padStart(2, "0")
      const minutes = String(now.getMinutes()).padStart(2, "0")
      return `${hours}:${minutes}`
    }
    return undefined
  }

  const isPastDateTime = () => {
    if (!formData.date || !formData.time) return false
    const selectedDateTime = new Date(`${formData.date}T${formData.time}`)
    const now = new Date()
    return selectedDateTime <= now
  }

  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const isDailyLimitReached = () => {
    return dailyBookingsCount >= 2
  }

  const isStepValid = () => {
    switch (step) {
      case 1:
        return formData.name.trim() !== ""
      case 2:
        const phoneDigits = formData.phone.replace(/\D/g, "")
        return (
          formData.email.trim() !== "" &&
          isValidEmail(formData.email) &&
          formData.phone.trim() !== "" &&
          phoneDigits.length === 11 &&
          !phoneError &&
          !emailError
        )
      case 3:
        if (formData.date === "" || formData.time === "") return false
        if (isPastDateTime()) return false
        if (isDailyLimitReached()) return false
        return true
      case 4:
        return !isDailyLimitReached()
      default:
        return false
    }
  }

  const handleSubmit = async () => {
    if (isDailyLimitReached()) {
      setMessage("You have reached the maximum of 2 reservations per day. Please choose a different date.")
      return
    }

    setLoading(true)
    setMessage("")

    try {
      const token = localStorage.getItem("auth_token")

      if (!token) {
        window.location.href = "/login?redirect=/reservations"
        return
      }

      console.log("📝 Submitting reservation with data:", formData)

      const headers: Record<string, string> = {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      }

      const response = await fetch("/api/reservations", {
        method: "POST",
        headers,
        body: JSON.stringify(formData),
      })

      console.log("📨 Response Status:", response.status)

      const responseText = await response.text()
      console.log("📨 Response Text:", responseText)

      let data
      try {
        data = JSON.parse(responseText)
      } catch (e) {
        console.error("Failed to parse response:", responseText)
        setMessage("Server error: Invalid response format")
        return
      }

      console.log("📨 Parsed Response:", data)

      if (!response.ok) {
        const errorMsg = data.message || data.error || "Failed to create reservation"
        console.error("❌ Error:", errorMsg)
        if (response.status === 400 && (errorMsg?.includes("maximum") || errorMsg?.includes("limit"))) {
          setMessage(errorMsg)
        } else {
          setMessage(errorMsg)
        }
        return
      }

      console.log("✅ Reservation created successfully")
      setMessage("success")

      setTimeout(() => {
        setStep(1)
        setFormData({
          name: user?.name || "",
          email: user?.email || "",
          phone: user?.phone || "",
          date: "",
          time: "",
          guests: "2",
          special_requests: "",
        })
        setMessage("")
        setDailyBookingsCount(0)
        window.location.href = "/reservation-history"
      }, 3000)
    } catch (error) {
      console.error("❌ Reservation error:", error)
      setMessage(error instanceof Error ? error.message : "An error occurred")
    } finally {
      setLoading(false)
    }
  }

  if (message === "success") {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#8B0000] via-[#6B0000] to-[#2B0000] flex items-center justify-center p-4 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
          <div className="absolute top-20 left-10 w-64 h-64 bg-[#dc143c]/30 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-64 h-64 bg-[#dc143c]/30 rounded-full blur-3xl animate-pulse delay-700"></div>
        </div>

        <div className="text-center max-w-md relative z-10 animate-in zoom-in duration-500">
          <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl animate-bounce">
            <CheckCircle className="w-14 h-14 text-[#dc143c]" />
          </div>
          <h2 className="text-4xl font-black text-white mb-3 drop-shadow-lg">Reservation Confirmed!</h2>
          <p className="text-xl text-white/90 mb-2">We&apos;re excited to see you at Ipponyari</p>
          <p className="text-white/70 mb-6">Check your email for confirmation details</p>

          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-4 mb-6">
            <p className="text-sm text-white/80 mb-1">View your reservation</p>
            <button
              onClick={() => (window.location.href = "/orders")}
              className="text-white font-semibold hover:text-[#ff6b6b] underline bg-transparent border-none cursor-pointer transition-colors"
            >
              Go to My Reservations
            </button>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => {
                setMessage("")
                setStep(1)
              }}
              className="flex-1 px-6 py-3 bg-white text-[#8B0000] hover:bg-white/90 font-semibold rounded-xl transition-all shadow-lg hover:scale-105"
            >
              Make Another Reservation
            </button>
            <button
              onClick={() => (window.location.href = "/menu")}
              className="flex-1 px-6 py-3 border-2 border-white text-white font-semibold rounded-xl hover:bg-white/10 transition-all hover:scale-105"
            >
              Browse Menu
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#8B0000] via-[#6B0000] to-[#2B0000] py-12 px-4 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
        <div className="absolute top-0 left-0 w-96 h-96 bg-[#dc143c]/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#dc143c]/30 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="max-w-2xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-12 animate-in fade-in slide-in-from-top duration-700">
          <h1 className="text-5xl md:text-6xl font-black mb-2 text-white drop-shadow-2xl">
            Reserve Your Spot
          </h1>
          <p className="text-lg text-[#ff6b6b] font-medium">Join us at Ipponyari for an unforgettable dining experience</p>

          {user && (
            <div className="mt-4 inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 px-4 py-2 rounded-full shadow-lg">
              <User className="w-4 h-4 text-[#ff6b6b]" />
              <span className="text-sm text-white">
                Booking as <span className="font-semibold">{user.name}</span>
              </span>
            </div>
          )}
        </div>

        {/* Progress Bar */}
        <div className="mb-10">
          <div className="relative">
            <div className="absolute top-5 left-0 right-0 flex items-center px-5">
              <div className="flex-1 flex items-center justify-between">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className={`h-1 rounded transition-all duration-300 ${i < step ? "bg-white" : "bg-white/20"}`}
                    style={{ width: "calc(33.333% - 20px)" }}
                  />
                ))}
              </div>
            </div>

            <div className="relative flex justify-between mb-3">
              {[1, 2, 3, 4].map((s) => (
                <div
                  key={s}
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all duration-300 z-10 ${s <= step ? "bg-white text-[#8B0000] shadow-xl scale-110" : "bg-white/20 text-white/50"
                    }`}
                >
                  {s}
                </div>
              ))}
            </div>

            <div className="flex justify-between">
              <div className="text-center text-xs text-white/70 font-medium" style={{ width: "40px" }}>
                Guest Info
              </div>
              <div className="text-center text-xs text-white/70 font-medium" style={{ width: "40px" }}>
                Contact
              </div>
              <div className="text-center text-xs text-white/70 font-medium" style={{ width: "40px" }}>
                Date & Time
              </div>
              <div className="text-center text-xs text-white/70 font-medium" style={{ width: "40px" }}>
                Review
              </div>
            </div>
          </div>
        </div>

        {/* Form Card */}
        <div className="bg-white/5 backdrop-blur-xl rounded-2xl shadow-2xl overflow-hidden border border-white/10 animate-in fade-in zoom-in duration-500">
          <div className="bg-white h-1" />

          <div className="p-8 md:p-10">
            {/* Step 1: Guest Info */}
            {step === 1 && (
              <div>
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-white mb-2">Let&apos;s start with your name</h2>
                  <p className="text-white/70">Help us personalize your reservation</p>
                </div>

                <div className="space-y-6">
                  <div className="relative">
                    <label className="block text-sm font-semibold text-white mb-3">Full Name *</label>
                    <div className="relative">
                      <User className="absolute left-4 top-3.5 w-5 h-5 text-[#ff6b6b] pointer-events-none" />
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        placeholder="Your name"
                        className="w-full pl-12 pr-4 py-3 border border-white/20 bg-white/10 backdrop-blur-sm rounded-xl focus:outline-none focus:border-white focus:ring-2 focus:ring-white/30 transition-all text-lg text-white placeholder-white/40"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="relative">
                      <label className="block text-sm font-semibold text-white mb-3">Number of Guests *</label>
                      <div className="relative">
                        <Users className="absolute left-4 top-3.5 w-5 h-5 text-[#ff6b6b] pointer-events-none" />
                        <select
                          name="guests"
                          value={formData.guests}
                          onChange={handleChange}
                          className="w-full pl-12 pr-4 py-3 border border-white/20 bg-white/10 backdrop-blur-sm rounded-xl focus:outline-none focus:border-white focus:ring-2 focus:ring-white/30 transition-all text-lg appearance-none text-white"
                        >
                          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                            <option key={num} value={num} className="bg-[#8B0000] text-white">
                              {num} {num === 1 ? "Guest" : "Guests"}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="flex items-end">
                      <div className="w-full h-12 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 flex items-center justify-center text-sm font-semibold text-white">
                        Perfect for your group!
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Contact */}
            {step === 2 && (
              <div>
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-white mb-2">How can we reach you?</h2>
                  <p className="text-white/70">We&apos;ll send confirmation to this email</p>
                </div>

                <div className="space-y-6">
                  <div className="relative">
                    <label className="block text-sm font-semibold text-white mb-3">Email Address *</label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-3.5 w-5 h-5 text-[#ff6b6b] pointer-events-none" />
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        onBlur={() => {
                          if (formData.email && !isValidEmail(formData.email)) {
                            setEmailError("Please enter a valid email address")
                          }
                        }}
                        required
                        placeholder="your@email.com"
                        className={`w-full pl-12 pr-4 py-3 rounded-xl focus:outline-none transition-all text-lg disabled:bg-white/5 disabled:text-white/50 text-white placeholder-white/40 bg-white/10 backdrop-blur-sm ${emailError
                          ? "border-white focus:border-white focus:ring-2 focus:ring-white/30"
                          : "border-white/20 focus:border-white focus:ring-2 focus:ring-white/30"
                          } border`}
                      />
                    </div>
                    {user?.email && <p className="text-xs text-white/50 mt-1">Using your account email</p>}
                    {emailError && !user?.email && (
                      <div className="mt-2 p-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl flex items-start gap-2">
                        <AlertCircle className="w-4 h-4 text-[#ff6b6b] flex-shrink-0 mt-0.5" />
                        <p className="text-[#ff6b6b] text-sm font-medium">{emailError}</p>
                      </div>
                    )}
                  </div>

                  <div className="relative">
                    <label className="block text-sm font-semibold text-white mb-3">Phone Number *</label>
                    <div className="relative">
                      <Phone className="absolute left-4 top-3.5 w-5 h-5 text-[#ff6b6b] pointer-events-none" />
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                        placeholder="09123456789"
                        className={`w-full pl-12 pr-4 py-3 border rounded-xl bg-white/10 backdrop-blur-sm focus:outline-none focus:border-white focus:ring-2 focus:ring-white/30 transition-all text-lg text-white placeholder-white/40 ${phoneError ? "border-red-500" : "border-white/20"
                          }`}
                      />
                    </div>
                    {phoneError && <p className="mt-2 text-sm text-[#ff6b6b]">{phoneError}</p>}
                  </div>

                </div>
              </div>
            )}

            {/* Step 3: Date & Time, Special Request */}
            {step === 3 && (
              <div>
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-white mb-2">When would you like to join us?</h2>
                  <p className="text-white/70">Pick your preferred date and time</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="relative">
                    <label className="block text-sm font-semibold text-white mb-3">Date *</label>
                    <div className="relative">
                      <Calendar className="absolute left-4 top-3.5 w-5 h-5 text-[#ff6b6b] pointer-events-none" />
                      <input
                        type="date"
                        name="date"
                        value={formData.date}
                        onChange={handleChange}
                        min={getMinDate()}
                        required
                        className="w-full pl-12 pr-4 py-3 border border-white/20 bg-white/10 backdrop-blur-sm rounded-xl focus:outline-none focus:border-white focus:ring-2 focus:ring-white/30 transition-all text-lg text-white [color-scheme:dark]"
                      />
                    </div>
                    {checkingBookings && formData.date && (
                      <p className="text-xs text-white/50 mt-1">Checking availability...</p>
                    )}
                    {!checkingBookings && formData.date && (
                      <div className="mt-2">
                        {isDailyLimitReached() ? (
                          <div className="p-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl flex items-start gap-2">
                            <AlertCircle className="w-4 h-4 text-[#ff6b6b] flex-shrink-0 mt-0.5" />
                            <p className="text-[#ff6b6b] text-sm font-medium">
                              You&apos;ve reached the maximum of 2 reservations for this date. Please choose another date.
                            </p>
                          </div>
                        ) : (
                          <p className="text-xs text-white/50">
                            You have {2 - dailyBookingsCount} reservation(s) remaining for this date.
                          </p>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="relative">
                    <label className="block text-sm font-semibold text-white mb-3">Time *</label>
                    <div className="relative">
                      <Clock className="absolute left-4 top-3.5 w-5 h-5 text-[#ff6b6b] pointer-events-none" />
                      <input
                        type="time"
                        name="time"
                        value={formData.time}
                        onChange={handleChange}
                        min={getMinTime()}
                        required
                        className="w-full pl-12 pr-4 py-3 border border-white/20 bg-white/10 backdrop-blur-sm rounded-xl focus:outline-none focus:border-white focus:ring-2 focus:ring-white/30 transition-all text-lg text-white [color-scheme:dark]"
                      />
                    </div>
                    {isPastDateTime() && (
                      <div className="mt-2 p-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl flex items-start gap-2">
                        <AlertCircle className="w-4 h-4 text-[#ff6b6b] flex-shrink-0 mt-0.5" />
                        <p className="text-[#ff6b6b] text-sm font-medium">Please select a future time.</p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="relative mt-4">
                  <label className="block text-sm font-semibold text-white mb-3">Special Request</label>
                  <div className="relative">
                    <MessageSquare className="absolute left-4 top-3.5 w-5 h-5 text-[#ff6b6b] pointer-events-none" />
                    <input
                      type="text"
                      name="special_requests"  // <-- matches formData key
                      value={formData.special_requests}
                      onChange={handleChange}
                      placeholder="Any special requests?"
                      className="w-full pl-12 pr-4 py-3 border border-white/20 bg-white/10 backdrop-blur-sm rounded-xl focus:outline-none focus:border-white focus:ring-2 focus:ring-white/30 transition-all text-lg text-white [color-scheme:dark]"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Review */}
            {step === 4 && (
              <div>
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-white mb-2">Review Your Reservation</h2>
                  <p className="text-white/70">Please confirm your details before submitting</p>
                </div>

                <div className="space-y-4 mb-6">
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                    <div className="flex items-center gap-3">
                      <User className="w-5 h-5 text-[#ff6b6b]" />
                      <div>
                        <p className="text-xs text-white/50">Guest Name</p>
                        <p className="font-semibold text-white">{formData.name}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                    <div className="flex items-center gap-3">
                      <Users className="w-5 h-5 text-[#ff6b6b]" />
                      <div>
                        <p className="text-xs text-white/50">Number of Guests</p>
                        <p className="font-semibold text-white">
                          {formData.guests} {Number.parseInt(formData.guests) === 1 ? "Guest" : "Guests"}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                    <div className="flex items-center gap-3">
                      <Mail className="w-5 h-5 text-[#ff6b6b]" />
                      <div>
                        <p className="text-xs text-white/50">Email</p>
                        <p className="font-semibold text-white">{formData.email}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                    <div className="flex items-center gap-3">
                      <Phone className="w-5 h-5 text-[#ff6b6b]" />
                      <div>
                        <p className="text-xs text-white/50">Phone</p>
                        <p className="font-semibold text-white">{formData.phone}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                    <div className="flex items-center gap-3">
                      <Calendar className="w-5 h-5 text-[#ff6b6b]" />
                      <div>
                        <p className="text-xs text-white/50">Date & Time</p>
                        <p className="font-semibold text-white">
                          {formData.date &&
                            new Date(formData.date).toLocaleDateString("en-US", {
                              weekday: "long",
                              month: "long",
                              day: "numeric",
                              year: "numeric",
                            })}{" "}
                          at {formData.time}
                        </p>
                      </div>
                    </div>
                  </div>

                  {formData.special_requests && (
                    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                      <div className="flex items-start gap-3">
                        <MessageSquare className="w-5 h-5 text-[#ff6b6b] mt-0.5" />
                        <div>
                          <p className="text-xs text-white/50">Special Requests</p>
                          <p className="font-semibold text-white">{formData.special_requests}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {message && message !== "success" && (
                  <div className="mb-6 p-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl">
                    <p className="text-[#ff6b6b] text-sm font-medium">{message}</p>
                  </div>
                )}
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex gap-4 mt-8">
              {step > 1 && (
                <button
                  onClick={() => setStep(step - 1)}
                  className="flex-1 px-6 py-3 border-2 border-white/30 text-white font-semibold rounded-xl hover:bg-white/10 transition-all hover:scale-105"
                >
                  Back
                </button>
              )}

              {step < 4 ? (
                <button
                  onClick={() => setStep(step + 1)}
                  disabled={!isStepValid()}
                  className="flex-1 px-6 py-3 bg-white hover:bg-white/90 disabled:bg-white/20 text-[#8B0000] disabled:text-white/50 font-semibold rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg disabled:shadow-none hover:scale-105 disabled:hover:scale-100"
                >
                  Continue
                  <ChevronRight className="w-5 h-5" />
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  disabled={loading || isDailyLimitReached()}
                  className="flex-1 px-6 py-3 bg-white hover:bg-white/90 disabled:bg-white/20 text-[#8B0000] disabled:text-white/50 font-semibold rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg disabled:shadow-none hover:scale-105 disabled:hover:scale-100"
                >
                  {loading ? "Confirming..." : "Confirm Reservation"}
                  <CheckCircle className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}