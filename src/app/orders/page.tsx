"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Package,
  Clock,
  CheckCircle,
  XCircle,
  Truck,
  User,
  LogIn,
  Calendar,
  ChefHat,
  Filter,
  Utensils,
  AlertCircle,
} from "lucide-react"
import Link from "next/link"
import { apiClient } from "@/lib/api"
import type { Order } from "@/types"
import { toast } from "@/hooks/use-toast"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface Event {
  id: number
  name: string
  email: string
  userId?: number
  eventType: string
  guests: number
  preferredDate: string
  preferredTime: string
  venueArea: string
  status?: string
  created_at: string
  updated_at?: string
}

const Orders = () => {
  const [orders, setOrders] = useState<Order[]>([])
  const [events, setEvents] = useState<Event[]>([])
  const [reservations, setReservations] = useState<any[]>([])
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([])
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([])
  const [filteredReservations, setFilteredReservations] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  const [activeTab, setActiveTab] = useState<"orders" | "events" | "reservations">("orders")
  const [activeFilter, setActiveFilter] = useState<string>("all")
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null)
  const [cancellingOrderId, setCancellingOrderId] = useState<number | null>(null)
  const [showCancelDialog, setShowCancelDialog] = useState(false)
  const [orderToCancel, setOrderToCancel] = useState<Order | null>(null)

  useEffect(() => {
    const checkAuthAndFetchData = async () => {
      const token = localStorage.getItem("auth_token")
      const userData = localStorage.getItem("user_data")

      if (!token) {
        setLoading(false)
        return
      }

      if (userData) {
        try {
          setUser(JSON.parse(userData))
        } catch (error) {
          console.error("Error parsing user data:", error)
        }
      }

      try {
        const ordersResponse = await apiClient.getOrders()
        if (ordersResponse.success && ordersResponse.data) {
          const ordersData = Array.isArray(ordersResponse.data)
            ? ordersResponse.data
            : ordersResponse.data.data || ordersResponse.data.orders || []
          setOrders(ordersData)
          setFilteredOrders(ordersData)
        }

        try {
          const apiUrl = process.env.NEXT_PUBLIC_API_URL
          const userData = JSON.parse(localStorage.getItem("user_data") || "{}")
          const userId = userData?.id

          const eventsUrl = userId ? `${apiUrl}/api/events?user_id=${userId}` : `${apiUrl}/api/events`

          const eventsResponse = await fetch(eventsUrl, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
          if (eventsResponse.ok) {
            const eventsData = await eventsResponse.json()
            const eventsList = Array.isArray(eventsData) ? eventsData : eventsData.data || []
            setEvents(eventsList)
            setFilteredEvents(eventsList)
          }
        } catch (error) {
          console.error("Error fetching events:", error)
        }

        try {
          const apiUrl = process.env.NEXT_PUBLIC_API_URL
          const reservationsResponse = await fetch(`${apiUrl}/api/reservations`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
          if (reservationsResponse.ok) {
            const reservationsData = await reservationsResponse.json()
            const resData = Array.isArray(reservationsData) ? reservationsData : reservationsData.data || []
            setReservations(resData)
            setFilteredReservations(resData)
          }
        } catch (error) {
          console.error("Error fetching reservations:", error)
        }
      } catch (error) {
        console.error("Error fetching data:", error)
        toast({
          title: "Error",
          description: "Failed to load data. Please try again.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    checkAuthAndFetchData()
  }, [])

  useEffect(() => {
    if (activeTab === "orders") {
      if (activeFilter === "all") {
        setFilteredOrders(orders)
      } else {
        setFilteredOrders(orders.filter((order) => order.order_status === activeFilter))
      }
    } else if (activeTab === "events") {
      if (activeFilter === "all") {
        setFilteredEvents(events)
      } else {
        setFilteredEvents(events.filter((event) => event.status === activeFilter))
      }
    } else {
      if (activeFilter === "all") {
        setFilteredReservations(reservations)
      } else {
        setFilteredReservations(reservations.filter((res) => res.status === activeFilter))
      }
    }
  }, [activeFilter, orders, events, reservations, activeTab])

  const canCancelOrder = (order: Order) => {
    const cancellableStatuses = ["pending", "confirmed"]
    return cancellableStatuses.includes(order.order_status)
  }

  const handleCancelClick = (order: Order) => {
    setOrderToCancel(order)
    setShowCancelDialog(true)
  }

  const handleCancelOrder = async () => {
    if (!orderToCancel) return

    setCancellingOrderId(orderToCancel.id)
    setShowCancelDialog(false)

    try {
      const token = localStorage.getItem("auth_token")
      const apiUrl = process.env.NEXT_PUBLIC_API_URL

      const response = await fetch(`${apiUrl}/api/orders/${orderToCancel.id}/cancel`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })

      const data = await response.json()

      if (response.ok && data.success) {
        const updatedOrders = orders.map((order) =>
          order.id === orderToCancel.id ? { ...order, order_status: "cancelled" as const } : order,
        )
        setOrders(updatedOrders)
        setFilteredOrders(
          activeFilter === "all" ? updatedOrders : updatedOrders.filter((order) => order.order_status === activeFilter),
        )

        toast({
          title: "Order Cancelled",
          description: "Your order has been cancelled successfully.",
        })
      } else {
        throw new Error(data.message || "Failed to cancel order")
      }
    } catch (error: any) {
      console.error("Error cancelling order:", error)
      toast({
        title: "Cancellation Failed",
        description: error.message || "Failed to cancel order. Please try again.",
        variant: "destructive",
      })
    } finally {
      setCancellingOrderId(null)
      setOrderToCancel(null)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="w-4 h-4" />
      case "confirmed":
      case "preparing":
        return <ChefHat className="w-4 h-4" />
      case "ready":
        return <Package className="w-4 h-4" />
      case "out_for_delivery":
        return <Truck className="w-4 h-4" />
      case "delivered":
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
        return "bg-amber-900/50 text-amber-300 border-amber-500/50"
      case "confirmed":
      case "preparing":
        return "bg-blue-900/50 text-blue-300 border-blue-500/50"
      case "ready":
        return "bg-violet-900/50 text-violet-300 border-violet-500/50"
      case "out_for_delivery":
        return "bg-purple-900/50 text-purple-300 border-purple-500/50"
      case "delivered":
      case "completed":
        return "bg-emerald-900/50 text-emerald-300 border-emerald-500/50"
      case "cancelled":
        return "bg-red-900/50 text-red-300 border-red-500/50"
      default:
        return "bg-gray-800 text-gray-300 border-gray-600"
    }
  }

  const getStatusCount = (status: string) => {
    if (activeTab === "orders") {
      if (status === "all") return orders.length
      return orders.filter((order) => order.order_status === status).length
    } else if (activeTab === "events") {
      if (status === "all") return events.length
      return events.filter((event) => event.status === status).length
    } else {
      if (status === "all") return reservations.length
      return reservations.filter((res) => res.status === status).length
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#dc143c] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-700 font-semibold text-lg">Loading your history...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 flex items-center justify-center p-4">
        <Card className="max-w-md w-full bg-white shadow-xl border-gray-200">
          <CardContent className="p-10 text-center">
            <div className="w-20 h-20 bg-[#dc143c] rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
              <User className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-3xl font-black text-gray-900 mb-3">Welcome Back</h1>
            <p className="text-gray-600 mb-8">Please log in to view your order history, events, and reservations.</p>
            <div className="flex flex-col gap-3">
              <Link href="/login" className="w-full">
                <Button className="w-full bg-[#dc143c] hover:bg-[#b01030] text-white font-bold py-6 text-lg shadow-md">
                  <LogIn className="w-5 h-5 mr-2" />
                  Login to Continue
                </Button>
              </Link>
              <Link href="/register" className="w-full">
                <Button
                  variant="outline"
                  className="w-full border border-[#dc143c] text-[#dc143c] hover:bg-[#dc143c]/10 font-semibold py-6 text-lg bg-white"
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

  const currentData =
    activeTab === "orders" ? filteredOrders : activeTab === "events" ? filteredEvents : filteredReservations

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 py-8 px-4">
      <AlertDialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <AlertDialogContent className="max-w-md bg-white border-gray-200">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-xl text-gray-900">
              <AlertCircle className="w-6 h-6 text-[#dc143c]" />
              Cancel Order?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-base pt-2 text-gray-600">
              Are you sure you want to cancel order{" "}
              <strong className="text-gray-900">{orderToCancel?.order_number}</strong>?
              <br />
              <br />
              This action cannot be undone and you will need to place a new order if you change your mind.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-2 sm:gap-0">
            <AlertDialogCancel className="mt-0 bg-white border-gray-300 text-gray-700 hover:bg-gray-50 hover:text-gray-900">
              Keep Order
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleCancelOrder}
              className="bg-[#dc143c] hover:bg-[#b01030] text-white font-semibold"
            >
              Yes, Cancel Order
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <div>
              <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-2">
                Your{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#dc143c] to-gray-900">
                  History
                </span>
              </h1>
              <p className="text-gray-600 text-lg">Track your orders, events, and reservations</p>
            </div>
            <div className="flex items-center gap-3 bg-white px-6 py-3 rounded-2xl shadow-md border border-gray-200">
              <User className="w-5 h-5 text-[#dc143c]" />
              <div>
                <p className="text-xs text-gray-500">Welcome back,</p>
                <p className="font-bold text-gray-900">{user.name}</p>
              </div>
            </div>
          </div>

          {/* Tab buttons - light theme */}
          <div className="flex gap-3 mb-6 flex-wrap">
            <button
              onClick={() => {
                setActiveTab("orders")
                setActiveFilter("all")
              }}
              className={`flex-1 min-w-fit py-4 px-6 rounded-2xl font-bold text-lg transition-all ${
                activeTab === "orders"
                  ? "bg-[#dc143c] text-white shadow-lg scale-105"
                  : "bg-white text-gray-600 hover:bg-gray-50 shadow-md border border-gray-200"
              }`}
            >
              <Package className="w-5 h-5 inline-block mr-2 mb-1" />
              Orders ({orders.length})
            </button>
            <button
              onClick={() => {
                setActiveTab("events")
                setActiveFilter("all")
              }}
              className={`flex-1 min-w-fit py-4 px-6 rounded-2xl font-bold text-lg transition-all ${
                activeTab === "events"
                  ? "bg-[#dc143c] text-white shadow-lg scale-105"
                  : "bg-white text-gray-600 hover:bg-gray-50 shadow-md border border-gray-200"
              }`}
            >
              <Utensils className="w-5 h-5 inline-block mr-2 mb-1" />
              Events ({events.length})
            </button>
            <button
              onClick={() => {
                setActiveTab("reservations")
                setActiveFilter("all")
              }}
              className={`flex-1 min-w-fit py-4 px-6 rounded-2xl font-bold text-lg transition-all ${
                activeTab === "reservations"
                  ? "bg-[#dc143c] text-white shadow-lg scale-105"
                  : "bg-white text-gray-600 hover:bg-gray-50 shadow-md border border-gray-200"
              }`}
            >
              <Calendar className="w-5 h-5 inline-block mr-2 mb-1" />
              Reservations ({reservations.length})
            </button>
          </div>

          {/* Filters - light theme */}
          <div className="bg-white rounded-2xl shadow-md p-4 border border-gray-200">
            <div className="flex items-center gap-2 mb-3">
              <Filter className="w-4 h-4 text-[#dc143c]" />
              <span className="text-sm font-semibold text-gray-700">Filter by Status</span>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setActiveFilter("all")}
                className={`px-4 py-2 rounded-xl font-semibold text-sm transition-all ${
                  activeFilter === "all"
                    ? "bg-[#dc143c] text-white shadow-md"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                All ({getStatusCount("all")})
              </button>
              {activeTab === "orders" ? (
                <>
                  <button
                    onClick={() => setActiveFilter("pending")}
                    className={`px-4 py-2 rounded-xl font-semibold text-sm transition-all ${
                      activeFilter === "pending"
                        ? "bg-amber-500 text-white shadow-md"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    Pending ({getStatusCount("pending")})
                  </button>
                  <button
                    onClick={() => setActiveFilter("confirmed")}
                    className={`px-4 py-2 rounded-xl font-semibold text-sm transition-all ${
                      activeFilter === "confirmed"
                        ? "bg-blue-500 text-white shadow-md"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    Confirmed ({getStatusCount("confirmed")})
                  </button>
                  <button
                    onClick={() => setActiveFilter("preparing")}
                    className={`px-4 py-2 rounded-xl font-semibold text-sm transition-all ${
                      activeFilter === "preparing"
                        ? "bg-blue-500 text-white shadow-md"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    Preparing ({getStatusCount("preparing")})
                  </button>
                  <button
                    onClick={() => setActiveFilter("delivered")}
                    className={`px-4 py-2 rounded-xl font-semibold text-sm transition-all ${
                      activeFilter === "delivered"
                        ? "bg-emerald-500 text-white shadow-md"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    Delivered ({getStatusCount("delivered")})
                  </button>
                  <button
                    onClick={() => setActiveFilter("cancelled")}
                    className={`px-4 py-2 rounded-xl font-semibold text-sm transition-all ${
                      activeFilter === "cancelled"
                        ? "bg-red-500 text-white shadow-md"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    Cancelled ({getStatusCount("cancelled")})
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => setActiveFilter("pending")}
                    className={`px-4 py-2 rounded-xl font-semibold text-sm transition-all ${
                      activeFilter === "pending"
                        ? "bg-amber-500 text-white shadow-md"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    Pending ({getStatusCount("pending")})
                  </button>
                  <button
                    onClick={() => setActiveFilter("confirmed")}
                    className={`px-4 py-2 rounded-xl font-semibold text-sm transition-all ${
                      activeFilter === "confirmed"
                        ? "bg-emerald-500 text-white shadow-md"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    Confirmed ({getStatusCount("confirmed")})
                  </button>
                  <button
                    onClick={() => setActiveFilter("cancelled")}
                    className={`px-4 py-2 rounded-xl font-semibold text-sm transition-all ${
                      activeFilter === "cancelled"
                        ? "bg-red-500 text-white shadow-md"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    Cancelled ({getStatusCount("cancelled")})
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Empty state - light */}
        {currentData.length === 0 && (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              {activeTab === "orders" ? (
                <Package className="w-12 h-12 text-gray-400" />
              ) : activeTab === "events" ? (
                <Utensils className="w-12 h-12 text-gray-400" />
              ) : (
                <Calendar className="w-12 h-12 text-gray-400" />
              )}
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">No {activeTab} found</h2>
            <p className="text-gray-600 mb-6">
              {activeFilter === "all"
                ? `You haven't made any ${activeTab} yet.`
                : `No ${activeTab} with "${activeFilter}" status.`}
            </p>
            {activeTab === "orders" && (
              <Link href="/menu">
                <Button className="bg-[#dc143c] hover:bg-[#b01030] text-white shadow-md">Browse Menu</Button>
              </Link>
            )}
            {activeTab === "reservations" && (
              <Link href="/reservations">
                <Button className="bg-[#dc143c] hover:bg-[#b01030] text-white shadow-md">Make a Reservation</Button>
              </Link>
            )}
          </div>
        )}

        {/* Orders/Events/Reservations Grid - light cards */}
        {currentData.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {activeTab === "orders" &&
              filteredOrders.map((order) => (
                <Card
                  key={order.id}
                  className="bg-white border-gray-200 hover:border-[#dc143c] hover:shadow-lg transition-all cursor-pointer"
                  onClick={() => setExpandedOrder(expandedOrder === String(order.id) ? null : String(order.id))}
                >
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <p className="text-xs text-gray-500">Order Number</p>
                        <p className="font-bold text-gray-900">{order.order_number}</p>
                      </div>
                      <Badge className={getStatusColor(order.order_status)}>
                        {getStatusIcon(order.order_status)}
                        <span className="ml-1 capitalize">{order.order_status.replace("_", " ")}</span>
                      </Badge>
                    </div>

                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-500">Date</span>
                        <span className="text-gray-900">{new Date(order.created_at).toLocaleDateString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Items</span>
                        <span className="text-gray-900">{order.items?.length || 0} items</span>
                      </div>
                      <div className="flex justify-between font-semibold">
                        <span className="text-gray-700">Total</span>
                        <span className="text-[#dc143c]">₱{Number(order.total_amount).toFixed(2)}</span>
                      </div>
                    </div>

                    {canCancelOrder(order) && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleCancelClick(order)
                        }}
                        disabled={cancellingOrderId === order.id}
                        className="w-full mt-4 border-[#dc143c] text-[#dc143c] hover:bg-[#dc143c]/10"
                      >
                        {cancellingOrderId === order.id ? "Cancelling..." : "Cancel Order"}
                      </Button>
                    )}
                  </CardContent>
                </Card>
              ))}

            {activeTab === "events" &&
              filteredEvents.map((event) => (
                <Card
                  key={event.id}
                  className="bg-white border-gray-200 hover:border-[#dc143c] hover:shadow-lg transition-all"
                >
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <p className="text-xs text-gray-500">Event Type</p>
                        <p className="font-bold text-gray-900 capitalize">{event.eventType}</p>
                      </div>
                      <Badge className={getStatusColor(event.status || "pending")}>
                        {getStatusIcon(event.status || "pending")}
                        <span className="ml-1 capitalize">{event.status || "pending"}</span>
                      </Badge>
                    </div>

                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-500">Date</span>
                        <span className="text-gray-900">{event.preferredDate}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Time</span>
                        <span className="text-gray-900">{event.preferredTime}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Guests</span>
                        <span className="text-gray-900">{event.guests}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Venue</span>
                        <span className="text-gray-900">{event.venueArea}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}

            {activeTab === "reservations" &&
              filteredReservations.map((reservation) => (
                <Card
                  key={reservation.id}
                  className="bg-white border-gray-200 hover:border-[#dc143c] hover:shadow-lg transition-all"
                >
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <p className="text-xs text-gray-500">Reservation</p>
                        <p className="font-bold text-gray-900">{reservation.name}</p>
                      </div>
                      <Badge className={getStatusColor(reservation.status || "pending")}>
                        {getStatusIcon(reservation.status || "pending")}
                        <span className="ml-1 capitalize">{reservation.status || "pending"}</span>
                      </Badge>
                    </div>

                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-500">Date</span>
                        <span className="text-gray-900">{reservation.date}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Time</span>
                        <span className="text-gray-900">{reservation.time}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Guests</span>
                        <span className="text-gray-900">{reservation.guests}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Orders
