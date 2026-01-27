"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Clock,
  CheckCircle,
  XCircle,
  User,
  LogIn,
  Calendar,
  Users,
  Mail,
  Phone,
  ChefHat,
  MessageSquare,
  Filter,
  Plus,
} from "lucide-react"
import Link from "next/link"
import { toast } from "@/hooks/use-toast"
import { useAuthStore } from "@/store/authStore"

const ReservationsHistory = () => {
  const [reservations, setReservations] = useState<any[]>([])
  const [filteredReservations, setFilteredReservations] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [activeFilter, setActiveFilter] = useState<string>("all")

  const user = useAuthStore((state) => state.user)
  const token = useAuthStore((state) => state.token)

  useEffect(() => {
    const fetchReservations = async () => {
      if (!user || !token) {
        console.log("❌ No user or token found")
        setLoading(false)
        return
      }

      console.log("=== Frontend Debug ===")
      console.log("User:", user)
      console.log("User ID:", user.id)
      console.log("Token:", token ? "Present" : "Missing")

      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL

        const reservationsResponse = await fetch(`${apiUrl}/api/reservations`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        })

        console.log("Response status:", reservationsResponse.status)

        if (reservationsResponse.ok) {
          const reservationsData = await reservationsResponse.json()

          console.log("=== Backend Response ===")
          console.log("Full response:", reservationsData)
          console.log("Debug:", reservationsData.debug)
          console.log("Authenticated:", reservationsData.debug?.authenticated)
          console.log("Count:", reservationsData.debug?.total_count || reservationsData.data?.length)

          const resData = Array.isArray(reservationsData)
            ? reservationsData
            : reservationsData.data || []

          console.log("✅ Reservations loaded:", resData.length)
          setReservations(resData)
          setFilteredReservations(resData)
        } else {
          const errorData = await reservationsResponse.json()
          console.error("❌ Response not OK:", reservationsResponse.status, errorData)
          toast({
            title: "Error",
            description: errorData.message || "Failed to load reservations",
            variant: "destructive",
          })
        }
      } catch (error) {
        console.error("❌ Error fetching reservations:", error)
        toast({
          title: "Error",
          description: "Failed to load reservations. Please try again.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchReservations()
  }, [user, token])

  useEffect(() => {
    if (activeFilter === "all") {
      setFilteredReservations(reservations)
    } else {
      setFilteredReservations(reservations.filter((res) => res.status === activeFilter))
    }
  }, [activeFilter, reservations])

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="w-4 h-4" />
      case "confirmed":
        return <ChefHat className="w-4 h-4" />
      case "completed":
        return <CheckCircle className="w-4 h-4" />
      case "cancelled":
        return <XCircle className="w-4 h-4" />
      default:
        return <Clock className="w-4 h-4" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-amber-500/20 text-amber-300 border-amber-500/30"
      case "confirmed":
        return "bg-blue-500/20 text-blue-300 border-blue-500/30"
      case "completed":
        return "bg-emerald-500/20 text-emerald-300 border-emerald-500/30"
      case "cancelled":
        return "bg-red-500/20 text-red-300 border-red-500/30"
      default:
        return "bg-gray-500/20 text-gray-300 border-gray-500/30"
    }
  }

  const getStatusCount = (status: string) => {
    if (status === "all") return reservations.length
    return reservations.filter((res) => res.status === status).length
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#8B0000] via-[#6B0000] to-[#2B0000] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white font-semibold text-lg">Loading your reservations...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen relative overflow-hidden bg-gradient-to-b from-[#8B0000] via-[#6B0000] to-[#2B0000] flex items-center justify-center p-4">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
          <div className="absolute top-0 left-0 w-96 h-96 bg-[#dc143c]/30 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#dc143c]/30 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        <Card className="max-w-md w-full bg-[#4B0000]/70 backdrop-blur-sm border-white/30 shadow-2xl relative z-10">
          <CardContent className="p-10 text-center">
            <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <User className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-3xl font-black text-white mb-3">Welcome Back</h1>
            <p className="text-white/70 mb-8">Please log in to view your reservations history.</p>
            <div className="flex flex-col gap-3">
              <Link href="/login" className="w-full">
                <Button className="w-full bg-white hover:bg-white/90 text-[#8B0000] font-bold py-6 text-lg shadow-lg">
                  <LogIn className="w-5 h-5 mr-2" />
                  Login to Continue
                </Button>
              </Link>
              <Link href="/register" className="w-full">
                <Button
                  variant="outline"
                  className="w-full border-white/30 text-white hover:bg-white/10 hover:border-white/50 font-semibold py-6 text-lg bg-transparent"
                >
                  Create Account
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-b from-[#8B0000] via-[#6B0000] to-[#2B0000] py-8 px-4">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
        <div className="absolute top-0 left-0 w-96 h-96 bg-[#dc143c]/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#dc143c]/30 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-125 h-125 bg-[#dc143c]/20 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}`
        <div className="mb-8">
          <div className="text-center gap-4 mb-6">
            <div>
              <h1 className="text-4xl md:text-5xl font-black text-white mb-2">
                Your <span className="text-[#ff6b6b]">Reservation</span>
              </h1>
              <p className="text-white/70 text-lg">Track your dining experience in one place</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-3 bg-[#4B0000]/70 backdrop-blur-sm px-6 py-3 rounded-2xl shadow-lg border border-white/30">
              <User className="w-5 h-5 text-[#ff6b6b]" />
              <div>
                <p className="text-xs text-white/70">Welcome back,</p>
                <p className="font-bold text-white">{user.name}</p>
              </div>
            </div>

            {/* Filters */}
            <div className="bg-[#4B0000]/60 backdrop-blur-sm rounded-xl border border-white/20 p-3 h-fit lg:sticky lg:top-6">
              <div className="flex items-center gap-2 mb-2">
                <Filter className="w-4 h-4 text-[#ff6b6b]" />
                <span className="text-xs font-semibold text-white uppercase tracking-wide">
                  Status
                </span>
              </div>

              <div className="flex gap-2 overflow-x-auto lg:flex-col lg:overflow-visible">
                <button
                  onClick={() => setActiveFilter("all")}
                  className={`whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-semibold transition ${activeFilter === "all"
                    ? "bg-white text-[#8B0000] shadow"
                    : "bg-white/10 text-white hover:bg-white/20"
                    }`}
                >
                  All ({getStatusCount("all")})
                </button>

                <button
                  onClick={() => setActiveFilter("confirmed")}
                  className={`whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-semibold transition ${activeFilter === "confirmed"
                    ? "bg-blue-500 text-white shadow"
                    : "bg-white/10 text-white hover:bg-white/20"
                    }`}
                >
                  Confirmed ({getStatusCount("confirmed")})
                </button>

                <button
                  onClick={() => setActiveFilter("completed")}
                  className={`whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-semibold transition ${activeFilter === "completed"
                    ? "bg-emerald-500 text-white shadow"
                    : "bg-white/10 text-white hover:bg-white/20"
                    }`}
                >
                  Completed ({getStatusCount("completed")})
                </button>

                <button
                  onClick={() => setActiveFilter("cancelled")}
                  className={`whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-semibold transition ${activeFilter === "cancelled"
                    ? "bg-red-500 text-white shadow"
                    : "bg-white/10 text-white hover:bg-white/20"
                    }`}
                >
                  Cancelled ({getStatusCount("cancelled")})
                </button>
              </div>
            </div>

            <div className="mt-5 text-center">
              <Button
                asChild
                className="bg-white hover:bg-white/90 text-[#8B0000] font-bold text-md shadow-lg rounded-2xl"
              >
                <Link href="/reservations">
                  <Plus className="w-4 h-4 mr-2" />Make New Reservation
                </Link>
              </Button>
            </div>
          </div>


          {/* Content */}
          {filteredReservations.length === 0 ? (
            <div className="flex items-center justify-center py-16">
              <Card className="max-w-lg w-full bg-[#4B0000]/70 backdrop-blur-sm border-white/30 shadow-2xl">
                <CardContent className="p-12 text-center">
                  <div className="w-24 h-24 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Calendar className="w-12 h-12 text-[#ff6b6b]" />
                  </div>
                  <h2 className="text-3xl font-black text-white mb-3">No Reservations Yet</h2>
                  <p className="text-white/70 mb-8 text-lg">
                    Make your first reservation and enjoy our authentic Japanese cuisine!
                  </p>
                  <Button
                    asChild
                    className="bg-white hover:bg-white/90 text-[#8B0000] font-bold py-6 px-8 text-lg shadow-lg"
                  >
                    <Link href="/reservations">Make Reservation</Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          ) : (
            <div className="flex flex-col gap-6">
              {filteredReservations.map((reservation) => (
                <Card
                  key={reservation.id}
                  className="bg-[#4B0000]/70 backdrop-blur-sm border-white/30 shadow-xl hover:shadow-2xl py-0 transition-all overflow-hidden"
                >
                  <div className="bg-gradient-to-r from-[#8B0000] to-[#6B0000] p-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="flex">
                          <h2 className="text-white font-black text-2xl">{reservation.occasion_type}&nbsp;</h2>
                          <h3 className="text-white font-semnibold text-lg">- Reservation #{reservation.id}</h3>
                        </div>
                        <p className="text-white/70 text-sm">
                          {new Date(reservation.created_at).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </p>
                      </div>
                      <Badge
                        className={`${getStatusColor(reservation.status)} flex items-center gap-2 px-3 py-1 border`}
                      >
                        {getStatusIcon(reservation.status)}
                        <span className="capitalize font-semibold">{reservation.status}</span>
                      </Badge>
                    </div>
                  </div>

                  <CardContent className="p-6">
                    <div>
                      <div className="bg-white/10 rounded-xl p-4 border border-white/20">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <Calendar className="w-4 h-4 text-[#ff6b6b]" />
                              <span className="text-xs text-white/70 font-semibold">Date</span>
                            </div>
                            <p className="font-bold text-white">
                              {new Date(reservation.date).toLocaleDateString("en-US", {
                                month: "long",
                                day: "numeric",
                                year: "numeric",
                              })}
                            </p>
                          </div>
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <Clock className="w-4 h-4 text-[#ff6b6b]" />
                              <span className="text-xs text-white/70 font-semibold">Time</span>
                            </div>
                            <p className="font-bold text-white">{reservation.time}</p>
                          </div>
                        </div>
                      </div>
                      <div className="bg-white/5 rounded-xl p-4 space-y-3">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <Users className="w-5 h-5 text-white/70" />
                              <span className="text-white/70">Guests:</span>
                              <span className="font-bold text-white">{reservation.guests} people</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <User className="w-5 h-5 text-white/70" />
                              <span className="text-white/70">Name:</span>
                              <span className="font-bold text-white">{reservation.name}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Mail className="w-5 h-5 text-white/70" />
                              <span className="text-white/70">Email:</span>
                              <span className="font-semibold text-white">{reservation.email}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Phone className="w-5 h-5 text-white/70" />
                              <span className="text-white/70">Phone:</span>
                              <span className="font-semibold text-white">{reservation.phone}</span>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <ChefHat className="w-5 h-5 text-white/70" />
                              <span className="text-white/70">Dining Preference:</span>
                              <span className="font-semibold text-white">{reservation.dining_preference || '-'}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Calendar className="w-5 h-5 text-white/70" />
                              <span className="text-white/70">Occasion:</span>
                              <span className="font-semibold text-white">{reservation.occasion_type || '-'}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <MessageSquare className="w-5 h-5 text-white/70" />
                              <span className="text-white/70">Instructions:</span>
                              <span className="font-semibold text-white">{reservation.occasion_instructions || '-'}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className="bg-white/10 text-white border-white/20">Fee: ₱{reservation.reservation_fee || '0.00'}</Badge>
                          <Badge className="bg-white/10 text-white border-white/20">Method: {reservation.payment_method || '-'}</Badge>
                          {reservation.payment_reference && <Badge className="bg-white/10 text-white border-white/20">Ref: {reservation.payment_reference}</Badge>}
                          {reservation.payment_screenshot && (
                            <a href={`/${reservation.payment_screenshot}`} target="_blank" rel="noopener noreferrer" className="underline text-xs ml-2 text-blue-300">View Receipt</a>
                          )}
                        </div>
                      </div>

                      {reservation.special_requests && (
                        <div className="bg-white/10 rounded-xl p-4 border border-white/20">
                          <div className="flex items-start gap-2">
                            <MessageSquare className="w-5 h-5 text-[#ff6b6b] mt-1 flex-shrink-0" />
                            <div>
                              <p className="text-xs text-white/70 font-semibold mb-1">Special Requests</p>
                              <p className="text-white">{reservation.special_requests}</p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ReservationsHistory