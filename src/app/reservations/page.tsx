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
  const [formData, setFormData] = useState<{
    date: string;
    time: string;
    guests: string;
    dining_preference: string;
    name: string;
    email: string;
    phone: string;
    special_requests: string;
    occasion_type: string;
    occasion_instructions: string;
    reservation_fee: string;
    payment_method: string;
    payment_reference: string;
    payment_receipt: File | undefined;
  }>({
    date: "",
    time: "",
    guests: "2",
    dining_preference: "Main Dining",
    name: "",
    email: "",
    phone: "",
    special_requests: "",
    occasion_type: "",
    occasion_instructions: "",
    reservation_fee: "",
    payment_method: "",
    payment_reference: "",
    payment_receipt: undefined,
  })
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")
  const [emailError, setEmailError] = useState("")
  const [phoneError, setPhoneError] = useState("")
  const [dailyBookingsCount, setDailyBookingsCount] = useState(0)
  const [checkingBookings, setCheckingBookings] = useState(false)

  const calculateReservationFee = (occasionType: string, guests: number) => {
    let baseFee = 0;

    switch (occasionType) {
      case "Birthday":
        baseFee = 500; // base fee for birthday
        break;
      case "Anniversary":
        baseFee = 700; // base fee for anniversary
        break;
      case "Business Meeting":
        baseFee = 1000; // base fee for business meetings
        break;
      case "Casual Dinner":
        baseFee = 0; // no fee for casual dinner
        break;
      case "Other":
        baseFee = 300; // generic fee
        break;
      default:
        baseFee = 0;
        break;
    }

    // Add extra charge per guest above 4
    const extraGuests = guests > 4 ? guests - 4 : 0;
    const extraFeePerGuest = 200;

    return baseFee + extraGuests * extraFeePerGuest;
  };

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

    // Email validation
    if (name === "email") {
      setFormData((prev) => ({ ...prev, [name]: value }))
      if (!isValidEmail(value)) {
        setEmailError("Please enter a valid email address")
      } else {
        setEmailError("")
      }
      return
    }

    // Phone validation
    if (name === "phone") {
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

    // Date validation
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

    // Handle occasion_type or guests change to update reservation fee
    if (name === "occasion_type" || name === "guests") {
      setFormData((prev) => {
        const updated = { ...prev, [name]: value }
        const guestsNum = Number(updated.guests) || 1
        // Convert number to string to match formData type
        updated.reservation_fee = calculateReservationFee(updated.occasion_type || "", guestsNum).toString()
        return updated
      })
      return
    }

    // Default case for other fields
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
        // Reservation Details
        return (
          formData.date.trim() !== "" &&
          formData.time.trim() !== "" &&
          formData.guests.trim() !== "" &&
          formData.dining_preference.trim() !== ""
        )
      case 2:
        // Guest Information
        const phoneDigits = formData.phone.replace(/\D/g, "")
        return (
          formData.name.trim() !== "" &&
          formData.email.trim() !== "" &&
          isValidEmail(formData.email) &&
          formData.phone.trim() !== "" &&
          phoneDigits.length === 11 &&
          !phoneError &&
          !emailError
        )
      case 3:
        // Occasion Details
        return formData.occasion_type && formData.occasion_type !== ""
      case 4:
        if (isDailyLimitReached()) return false
        if (formData.reservation_fee && (isNaN(Number(formData.reservation_fee)) || Number(formData.reservation_fee) < 0)) return false
        if (!formData.payment_method) return false
        if (!formData.payment_reference) return false
        if (!formData.payment_receipt) return false
        return true
      default:
        return false
    }
  }

  const handleSubmit = async () => {
  if (isDailyLimitReached()) {
    setMessage(
      "You have reached the maximum of 2 reservations per day. Please choose a different date."
    )
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

    // Prepare JSON payload (excluding file)
    const payload: any = {
      ...formData,
      reservation_fee: Number(formData.reservation_fee) || 0,
    }
    delete payload.payment_receipt

    const response = await fetch("/api/reservations", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    })

    const responseText = await response.text()
    let data
    try {
      data = JSON.parse(responseText)
    } catch (e) {
      console.error("Failed to parse response:", responseText)
      setMessage("Server error: Invalid response format")
      return
    }

    if (!response.ok) {
      const errorMsg = data.message || data.error || "Failed to create reservation"
      setMessage(errorMsg)
      return
    }

    console.log("✅ Reservation created successfully")

    // If you need to upload the file separately:
    if (formData.payment_receipt) {
      const fileForm = new FormData()
      fileForm.append("receipt", formData.payment_receipt)

      const fileResponse = await fetch(`/api/reservations/upload-receipt/${data.reservation_id}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: fileForm,
      })

      if (!fileResponse.ok) {
        console.warn("Receipt upload failed, please check backend handling")
      }
    }

    // Trigger email confirmation
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
        dining_preference: "Main Dining",
        special_requests: "",
        occasion_type: "",
        occasion_instructions: "",
        reservation_fee: "",
        payment_method: "",
        payment_reference: "",
        payment_receipt: undefined,
      })
      setMessage("")
      setDailyBookingsCount(0)
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
      <div className="min-h-screen bg-linear-to-b from-[#8B0000] via-[#6B0000] to-[#2B0000] flex items-center justify-center p-4 relative overflow-hidden">
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
    <div className="min-h-screen bg-linear-to-b from-[#8B0000] via-[#6B0000] to-[#2B0000] py-12 px-4 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
        <div className="absolute top-0 left-0 w-96 h-96 bg-[#dc143c]/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#dc143c]/30 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="max-w-2xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-12 animate-in fade-in slide-in-from-top duration-700">
          <h1 className="text-5xl md:text-6xl font-black mb-2 text-white drop-shadow-2xl">
            Your Table <span className="text-[#ff6b6b]">Awaits</span>
          </h1>
          <p className="text-lg text-white/80">An elevated Japanese dining experience begins with your reservation</p>

          {user && (
            <div className="mt-4 inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 px-4 py-2 rounded-full shadow-lg">
              <User className="w-4 h-4 text-[#ff6b6b]" />
              <span className="text-sm text-white">
                Reserving as <span className="font-semibold">{user.name}</span>
              </span>
            </div>
          )}
        </div>

        {/* Progress Bar */}
        <div className="mb-10">
          <div className="relative">
            <div className="relative w-full px-5 mt-10">
              {/* Progress Line Background */}
              <div className="absolute top-5 left-5 right-5 h-1 bg-white/20 rounded"></div>

              {/* Progress Line Fill */}
              <div
                className="absolute top-5 left-5 h-1 bg-white rounded transition-all duration-500"
                style={{
                  width: `calc(${((step - 1) / 4) * 100}%)`,
                }}
              ></div>

              {/* Step Circles */}
              <div className="relative flex justify-between">
                {[1, 2, 3, 4, 5].map((s) => (
                  <div
                    key={s}
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all duration-300 transform ${s <= step
                      ? "bg-white text-[#8B0000] shadow-xl scale-110"
                      : "bg-white/20 text-white/50"
                      }`}
                  >
                    {s}
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-between text-center">
              <div className="text-center text-xs text-white/70 font-medium" style={{ width: "50px" }}>
                Reservation Details
              </div>
              <div className="text-center text-xs text-white/70 font-medium" style={{ width: "50px" }}>
                Guest Information
              </div>
              <div className="text-center text-xs text-white/70 font-medium" style={{ width: "50px " }}>
                Occasion Details
              </div>
              <div className="text-center text-xs text-white/70 font-medium" style={{ width: "50px" }}>
                Payment Details
              </div>
              <div className="text-center text-xs text-white/70 font-medium" style={{ width: "50px" }}>
                Confirmation
              </div>
            </div>
          </div>
        </div>

        {/* Form Card */}
        <div className="bg-white/5 backdrop-blur-xl rounded-2xl shadow-2xl overflow-hidden border border-white/10 animate-in fade-in zoom-in duration-500">
          <div className="bg-white h-1" />

          <div className="p-8 md:p-10">
            {/* Step 1: Reservation Details */}
            {step === 1 && (
              <div>
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-white mb-2">Reservation Details</h2>
                  <p className="text-white/70">Please provide the details for your reservation</p>
                </div>

                <div className="space-y-6">
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
                        className="w-full pl-12 pr-4 py-3 border border-white/20 bg-white/10 backdrop-blur-sm rounded-xl focus:outline-none focus:border-white focus:ring-2 focus:ring-white/30 transition-all text-lg text-white placeholder-white/40"
                      />
                    </div>
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
                        className="w-full pl-12 pr-4 py-3 border border-white/20 bg-white/10 backdrop-blur-sm rounded-xl focus:outline-none focus:border-white focus:ring-2 focus:ring-white/30 transition-all text-lg text-white placeholder-white/40"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="relative">
                      <label className="block text-sm font-semibold text-white mb-3">Number of Guests *</label>
                      <div className="relative">
                        <Users className="absolute left-4 top-3.5 w-5 h-5 text-[#ff6b6b] pointer-events-none" />
                        <input
                          type="number"
                          name="guests"
                          value={formData.guests}
                          min={1}
                          max={50} // optional, adjust max as needed
                          onChange={(e) => {
                            const value = e.target.value;
                            // Allow only positive numbers
                            if (/^\d*$/.test(value)) {
                              setFormData((prev) => ({ ...prev, guests: value }));
                            }
                          }}
                          placeholder="Number of Guests"
                          required
                          className="w-full md:w-auto min-w-[120px] pl-12 pr-4 py-3 border border-white/20 bg-white/10 backdrop-blur-sm rounded-xl focus:outline-none focus:border-white focus:ring-2 focus:ring-white/30 transition-all text-lg text-white placeholder-white/40"
                        />
                      </div>
                    </div>

                    <div className="relative">
                      <label className="block text-sm font-semibold text-white mb-3">Dining Preference *</label>
                      <div className="relative">
                        <Users className="absolute left-4 top-3.5 w-5 h-5 text-[#ff6b6b] pointer-events-none" />
                        <select
                          name="dining_preference"
                          value={formData.dining_preference}
                          onChange={handleChange}
                          className="w-full md:w-auto min-w-[120px] pl-12 pr-8 py-3 border border-white/20 bg-white/10 backdrop-blur-sm rounded-xl focus:outline-none focus:border-white focus:ring-2 focus:ring-white/30 transition-all text-lg text-white appearance-none"
                          required
                        >
                          {[
                            "Main Dining",
                            "Private Tatami Room",
                            "Chef's Counter",
                            "Window Seat",
                            "Celebration Area",
                            "Family Seating",
                            "Group Dining",
                          ].map((option) => (
                            <option key={option} value={option} className="bg-red-200 text-gray-900">
                              {option}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Guest Information */}
            {step === 2 && (
              <div>
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-white mb-2">Guest Information</h2>
                  <p className="text-white/70">Tell us about your party and any special needs</p>
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
                        placeholder="Full Name"
                        className="w-full pl-12 pr-4 py-3 border rounded-xl bg-white/10 backdrop-blur-sm focus:outline-none focus:border-white focus:ring-2 focus:ring-white/30 transition-all text-lg text-white placeholder-white/40 border-white/20"
                      />
                    </div>
                  </div>

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
                        <AlertCircle className="w-4 h-4 text-[#ff6b6b] shrink-0 mt-0.5" />
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

                  <div className="relative">
                    <label className="block text-sm font-semibold text-white mb-3">Special Request (Accessibility, Dietary, Celebrations)</label>
                    <div className="relative">
                      <MessageSquare className="absolute left-4 top-3.5 w-5 h-5 text-[#ff6b6b] pointer-events-none" />
                      <input
                        type="text"
                        name="special_requests"
                        value={formData.special_requests}
                        onChange={handleChange}
                        placeholder="Accessibility needs, dietary restrictions, celebrations, etc."
                        className="w-full pl-12 pr-4 py-3 border border-white/20 bg-white/10 backdrop-blur-sm rounded-xl focus:outline-none focus:border-white focus:ring-2 focus:ring-white/30 transition-all text-lg text-white placeholder-white/40"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Occasion Details */}
            {step === 3 && (
              <div>
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-white mb-2">Occasion Details</h2>
                  <p className="text-white/70">Let us know what you&apos;re celebrating or the purpose of your visit</p>
                </div>

                <div className="space-y-6">
                  <div className="relative">
                    <label className="block text-sm font-semibold text-white mb-3">Occasion Type *</label>
                    <div className="relative">
                      <Calendar className="absolute left-4 top-3.5 w-5 h-5 text-[#ff6b6b] pointer-events-none" />
                      <select
                        name="occasion_type"
                        value={formData.occasion_type || ""}
                        onChange={handleChange}
                        required
                        className="w-full pl-12 pr-4 py-3 border border-white/20 bg-white/10 backdrop-blur-sm rounded-xl focus:outline-none focus:border-white focus:ring-2 focus:ring-white/30 transition-all text-lg appearance-none text-white"
                      >
                        {[
                          "Select Occasion",
                          "Birthday",
                          "Anniversary",
                          "Business Meeting",
                          "Casual Dinner",
                          "Other",
                        ].map((option) => (
                          <option key={option} value={option} className="bg-red-200 text-gray-900">
                            {option}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="relative">
                    <label className="block text-sm font-semibold text-white mb-3">Special Instructions</label>
                    <div className="relative">
                      <MessageSquare className="absolute left-4 top-3.5 w-5 h-5 text-[#ff6b6b] pointer-events-none" />
                      <input
                        type="text"
                        name="occasion_instructions"
                        value={formData.occasion_instructions || ""}
                        onChange={handleChange}
                        placeholder="Anything else we should know?"
                        className="w-full pl-12 pr-4 py-3 border border-white/20 bg-white/10 backdrop-blur-sm rounded-xl focus:outline-none focus:border-white focus:ring-2 focus:ring-white/30 transition-all text-lg text-white placeholder-white/40"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Payment Details */}
            {step === 4 && (
              <div>
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-white mb-2">Payment Details</h2>
                  <p className="text-white/70">Secure your reservation</p>
                </div>

                <div className="space-y-6">
                  <div className="relative">
                    <label className="block text-sm font-semibold text-white mb-3">Reservation Fee</label>
                    <input
                      type="number"
                      name="reservation_fee"
                      value={formData.reservation_fee || ""}
                      readOnly
                      className="w-full pl-4 pr-4 py-3 border border-white/20 bg-white/10 backdrop-blur-sm rounded-xl focus:outline-none focus:border-white focus:ring-2 focus:ring-white/30 transition-all text-lg text-white placeholder-white/40"
                    />
                  </div>

                  <div className="relative">
                    <label className="block text-sm font-semibold text-white mb-3">Payment Method *</label>
                    <select
                      name="payment_method"
                      value={formData.payment_method || ""}
                      onChange={handleChange}
                      required
                      className="w-full pl-4 pr-4 py-3 border border-white/20 bg-white/10 backdrop-blur-sm rounded-xl focus:outline-none focus:border-white focus:ring-2 focus:ring-white/30 transition-all text-lg appearance-none text-white"
                    >
                      {["Credit Card", "PayPal", "GCash", "Security Bank", "Other"].map((option) => (
                        <option key={option} value={option} className="bg-red-200 text-gray-900">
                          {option}
                        </option>
                      ))}
                    </select>
                  </div>   

                  <div className="relative">
                    <label className="block text-sm font-semibold text-white mb-3">Reference Number *</label>
                    <input
                      type="text"
                      name="payment_reference"
                      value={formData.payment_reference || ""}
                      onChange={handleChange}
                      required
                      placeholder="Enter payment reference number"
                      className="w-full pl-4 pr-4 py-3 border border-white/20 bg-white/10 backdrop-blur-sm rounded-xl focus:outline-none focus:border-white focus:ring-2 focus:ring-white/30 transition-all text-lg text-white placeholder-white/40"
                    />
                  </div>

                  <div className="relative">
                    <label className="block text-sm font-semibold text-white mb-3">Receipt Screenshot *</label>
                    <input
                      type="file"
                      name="payment_receipt"
                      accept="image/*"
                      required
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          setFormData((prev) => ({ ...prev, payment_receipt: file }));
                        }
                      }}
                      className="w-full pl-4 pr-4 py-3 border border-white/20 bg-white/10 backdrop-blur-sm rounded-xl focus:outline-none focus:border-white focus:ring-2 focus:ring-white/30 transition-all text-lg text-white placeholder-white/40"
                    />
                    {formData.payment_receipt && (
                      <div className="mt-2 text-white text-xs">Selected: {formData.payment_receipt.name}</div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Step 5: Reservation Details (Confirmation) */}
            {step === 5 && (
              <div className="space-y-8">
                {/* Header */}
                <div className="mb-4">
                  <h2 className="text-3xl font-extrabold text-white mb-1">
                    Review & Confirm
                  </h2>
                  <p className="text-white/70 text-md">
                    Please review your reservation details before submitting.
                  </p>
                </div>

                {/* Receipt Container */}
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 shadow-lg space-y-6">

                  {/* Reservation Details */}
                  <div className="bg-white/5 rounded-xl p-4 border border-white/10 space-y-2">
                    <h3 className="text-lg font-semibold text-white mb-2">Reservation Details</h3>
                    <div className="grid grid-cols-2 gap-4 text-white/80">
                      <span><span className="font-semibold">Date:</span> {formData.date}</span>
                      <span><span className="font-semibold">Time:</span> {formData.time}</span>
                      <span><span className="font-semibold">Guests:</span> {formData.guests}</span>
                      <span><span className="font-semibold">Dining:</span> {formData.dining_preference}</span>
                    </div>
                  </div>

                  {/* Guest Information */}
                  <div className="bg-white/5 rounded-xl p-4 border border-white/10 space-y-2">
                    <h3 className="text-lg font-semibold text-white mb-2">Guest Information</h3>
                    <div className="flex flex-col gap-4 text-white/80">
                      <span><span className="font-semibold">Name:</span> {formData.name}</span>
                      <span><span className="font-semibold">Email:</span> {formData.email}</span>
                      <span><span className="font-semibold">Phone:</span> {formData.phone}</span>
                    </div>
                  </div>

                  {/* Occasion */}
                  <div className="bg-white/5 rounded-xl p-4 border border-white/10 space-y-2">
                    <h3 className="text-lg font-semibold text-white mb-2">Occasion</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-white/80">
                      <span><span className="font-semibold">Type:</span> {formData.occasion_type}</span>
                      <span><span className="font-semibold">Instructions:</span> {formData.occasion_instructions || '-'}</span>
                    </div>
                  </div>

                  {/* Payment */}
                  <div className="bg-white/5 rounded-xl p-4 border border-white/10 space-y-2">
                    <h3 className="text-lg font-semibold text-white mb-2">Payment</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-white/80">
                      <span><span className="font-semibold">Reservation Fee:</span> ₱{formData.reservation_fee || '0.00'}</span>
                      <span><span className="font-semibold">Payment Method:</span> {formData.payment_method}</span>
                      <span><span className="font-semibold">Reference:</span> {formData.payment_reference || '-'}</span>
                      {formData.payment_receipt && (
                        <span><span className="font-semibold">Receipt:</span> {formData.payment_receipt.name}</span>
                      )}
                    </div>
                  </div>

                  {/* Special Requests */}
                  {formData.special_requests && (
                    <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                      <h3 className="text-lg font-semibold text-white mb-2">Special Requests</h3>
                      <p className="text-white/80">{formData.special_requests}</p>
                    </div>
                  )}
                </div>
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

              {step < 5 ? (
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
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}