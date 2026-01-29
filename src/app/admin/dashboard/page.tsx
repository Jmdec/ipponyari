"use client"

import Image from "next/image"
import { useEffect, useState } from "react"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Loader2, TrendingUp, ShoppingCart, DollarSign, Users, ArrowUpRight, ArrowDownRight } from "lucide-react"
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts"

interface AnalyticsData {
  keyMetrics: {
    totalRevenue: number
    totalOrders: number
    totalCustomers: number
    overallRating: number
    totalReviews: number
    growthRate: number
  }
  revenueData: Array<{ date: string; revenue: number; orders: number }>
  orderStatusData: Array<{ status: string; count: number; percentage: number }>
  paymentMethodData: Array<{ method: string; count: number; percentage: number }>
  popularProducts: Array<{ name: string; orders: number; revenue: number; category: string; is_spicy: boolean }>
  categoryData: Array<{ category: string; orders: number; revenue: number }>
  reservationData: {
    totalWalkIns: number
    totalOnline: number
    walkInPercentage: number
    onlinePercentage: number
    trends: Array<{ date: string; walkIn: number; online: number; total: number }>
  }
  productsCount: number
}

const statusColors = {
  delivered: "#10b981",
  preparing: "#f59e0b",
  confirmed: "#3b82f6",
  ready: "#8b5cf6",
  pending: "#6b7280",
  cancelled: "#ef4444",
}

const paymentColors = ["#ef4444", "#f97316", "#f59e0b", "#eab308", "#84cc16"]

const MetricCard = ({
  title,
  value,
  change,
  icon: Icon,
  subtitle,
  trend = "up"
}: {
  title: string
  value: string | number
  change?: string
  icon: any
  subtitle: string
  trend?: "up" | "down" | "neutral"
}) => (
  <Card className="group relative overflow-hidden border border-gray-200 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-sm">
    <div className="absolute left-0 top-0 h-full w-[2px] bg-[#dc143c]/70" />

    <CardContent className="px-5">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-md border border-red-100 text-gray-700">
          <Icon className="h-6 w-6 text-red-900" />
        </div>
        <p className="text-lg font-bold uppercase tracking-wider text-red-900">
          {title}
        </p>
      </div>

      <div className="mt-4 flex items-center justify-center gap-2">
        <h3 className="text-2xl font-bold text-gray-900">{value}</h3>
        {change && (
          <span
            className={`flex items-center gap-1 text-sm font-medium ${trend === "up"
              ? "text-emerald-600"
              : trend === "down"
                ? "text-rose-600"
                : "text-gray-500"
              }`}
          >
            {trend === "up" && <ArrowUpRight className="h-4 w-4" />}
            {trend === "down" && <ArrowDownRight className="h-4 w-4" />}
            {change}
          </span>
        )}
      </div>

      {subtitle && (
        <p className="text-center mt-2 text-xs text-gray-400">
          {subtitle}
        </p>
      )}
    </CardContent>
  </Card>
)

export default function AdminDashboard() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isDesktop, setIsDesktop] = useState(false)
  const [period, setPeriod] = useState<"daily" | "weekly" | "monthly">("daily")

  useEffect(() => {
    const checkDesktop = () => {
      setIsDesktop(window.innerWidth < 1024) // lg breakpoint
    }
    checkDesktop()
    window.addEventListener("resize", checkDesktop)
    return () => window.removeEventListener("resize", checkDesktop)
  }, [])

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true)
        const response = await fetch(`/api/dashboard?period=${period}`)
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`)
        const data = await response.json()
        if (data.success) setAnalytics(data.data)
        else throw new Error(data.message || "Failed to fetch analytics")
      } catch (error) {
        setError(error instanceof Error ? error.message : "Unknown error occurred")
      } finally {
        setLoading(false)
      }
    }
    fetchAnalytics()
  }, [period])

  if (loading) {
    return (
      <SidebarProvider defaultOpen={!isDesktop}>
        <div className="flex min-h-screen w-full bg-gradient-to-br from-red-50 to-red-50">
          <AppSidebar />
          <div className="flex-1 min-w-0 flex items-center justify-center">
            <div className="flex items-center gap-3 bg-white px-8 py-6 rounded-2xl shadow-lg">
              <Loader2 className="h-6 w-6 animate-spin text-red-500" />
              <span className="text-gray-700 font-medium text-lg">Loading Dashboard...</span>
            </div>
          </div>
        </div>
      </SidebarProvider>
    )
  }

  if (error || !analytics) {
    return (
      <SidebarProvider defaultOpen={!isDesktop}>
        <div className="flex min-h-screen w-full bg-gray-50">
          <AppSidebar />
          <div className="flex-1 min-w-0 flex items-center justify-center p-4">
            <Card className="max-w-md w-full border-red-200">
              <CardHeader>
                <CardTitle className="text-red-600">Failed to Load Analytics</CardTitle>
                <CardDescription>{error || "No data available"}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <button
                  onClick={() => window.location.reload()}
                  className="w-full px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-medium"
                >
                  Retry
                </button>
              </CardContent>
            </Card>
          </div>
        </div>
      </SidebarProvider>
    )
  }

  console.log("[v0] Rendering dashboard with analytics:", analytics)

  return (
    <SidebarProvider defaultOpen={!isDesktop}>
      <div className="flex min-h-screen w-full bg-gradient-to-br from-red-50 to-red-50">
        <AppSidebar />
        <div className={`flex-1 min-w-0 ${isDesktop ? "ml-0" : "ml-72"}`}>
          {isDesktop && (
            <div className="sticky top-0 z-50 flex h-14 items-center gap-3 border-b bg-white px-4 shadow-sm">
              <SidebarTrigger className="-ml-1" />
              <Image
                src="/logoippon.png"
                alt="Ipponyari Logo"
                width={40}
                height={40}
                className="object-contain"
              />
              <h1 className="text-lg font-bold text-gray-900">Ipponyari Japanese Restaurant</h1>
            </div>
          )}

          <main className="p-4 md:p-6 lg:p-8 space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Dashboard</h1>
                <p className="text-gray-600 mt-1">Restaurant analytics and insights</p>
              </div>

              {/* Period Selector */}
              <div className="flex gap-2">
                {["daily", "weekly", "monthly"].map((p) => (
                  <button
                    key={p}
                    onClick={() => setPeriod(p as any)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition
                      ${period === p
                        ? "bg-red-600 text-white"
                        : "bg-white border text-gray-600 hover:bg-gray-100"}`}
                  >
                    {p.charAt(0).toUpperCase() + p.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
              <MetricCard
                title="Total Revenue"
                value={`₱${(analytics.keyMetrics?.totalRevenue || 0).toLocaleString()}`}
                change={`${analytics.keyMetrics?.growthRate || 0}%`}
                icon={DollarSign}
                subtitle="Last 30 days"
                trend="up"
              />
              <MetricCard
                title="Total Orders"
                value={(analytics.keyMetrics?.totalOrders || 0).toLocaleString()}
                icon={ShoppingCart}
                subtitle="All time orders"
                trend="neutral"
              />
              <MetricCard
                title="Rating Average"
                value={`${analytics.keyMetrics.overallRating.toFixed(1)} / 5`}
                icon={TrendingUp}
                subtitle="Customer satisfaction"
                trend="up"
              />
              <MetricCard
                title="Customers"
                value={(analytics.keyMetrics?.totalCustomers || 0).toLocaleString()}
                icon={Users}
                subtitle="Unique customers"
                trend="neutral"
              />
            </div>

            {/* Category & Products */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Category Performance */}
              <Card className="border-0 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-xl font-bold">Category Performance</CardTitle>
                  <CardDescription>Orders & Revenue by Category</CardDescription>
                </CardHeader>
                <CardContent>
                  {analytics.categoryData && analytics.categoryData.length > 0 ? (
                    <ResponsiveContainer width="100%" height={320}>
                      <BarChart data={analytics.categoryData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="category" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="orders" name="Orders" fill="#ef4444" radius={[6, 6, 0, 0]} />
                        <Bar dataKey="revenue" name="Revenue" fill="#f97316" radius={[6, 6, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="h-[320px] flex items-center justify-center text-gray-400">
                      No category data
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Popular Products */}
              <Card className="border-0 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-xl font-bold">Top Products</CardTitle>
                  <CardDescription>Best performing menu items</CardDescription>
                </CardHeader>
                <CardContent>
                  {analytics.popularProducts && analytics.popularProducts.length > 0 ? (
                    <div className="space-y-3">
                      {analytics.popularProducts.map((product, index) => (
                        <div
                          key={product.name}
                          className="flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors"
                        >
                          <div className="flex items-center gap-4">
                            <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-red-500 to-red-500 text-white rounded-lg font-bold text-lg">
                              {index + 1}
                            </div>
                            <div>
                              <h3 className="font-semibold text-gray-900">{product.name}</h3>
                              <div className="flex items-center gap-2 mt-1">
                                <Badge variant="secondary" className="text-xs">{product.category}</Badge>
                                {product.is_spicy && (
                                  <Badge variant="outline" className="text-xs border-red-300 text-red-700">🌶️ Spicy</Badge>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-bold text-gray-900">{product.orders}</div>
                            <div className="text-sm text-gray-500">orders</div>
                            <div className="text-sm font-medium text-red-600 mt-1">₱{product.revenue.toLocaleString()}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="py-12 text-center text-gray-400">
                      No product data available
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Customer Map */}
            <Card className="border-0 shadow-sm">
              <CardHeader>
                <CardTitle className="text-xl font-bold">Customer Map</CardTitle>
                <CardDescription>Walk-in vs Online Reservations</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart
                    data={[
                      { type: "Walk-in", count: analytics.reservationData.totalWalkIns },
                      { type: "Online", count: analytics.reservationData.totalOnline },
                    ]}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="type" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="#f97316" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Order Status & Payment Method */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Order Status */}
              <Card className="border-0 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-xl font-bold">Order Status</CardTitle>
                  <CardDescription>Current order distribution</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col items-center">
                  {analytics.orderStatusData && analytics.orderStatusData.length > 0 ? (
                    <>
                      <ResponsiveContainer width="100%" height={280}>
                        <PieChart>
                          <Pie
                            data={analytics.orderStatusData}
                            cx="50%"
                            cy="50%"
                            innerRadius={70}
                            outerRadius={100}
                            dataKey="count"
                            paddingAngle={3}
                            cornerRadius={8}
                          >
                            {analytics.orderStatusData.map((entry, i) => (
                              <Cell key={i} fill={statusColors[entry.status as keyof typeof statusColors]} />
                            ))}
                          </Pie>
                        </PieChart>
                      </ResponsiveContainer>
                      {/* Total Orders in center */}
                      <div className="mt-2 text-center">
                        <p className="text-sm text-gray-500">Total Orders</p>
                        <p className="text-2xl font-bold text-gray-900">
                          {analytics.orderStatusData.reduce((acc, item) => acc + item.count, 0)}
                        </p>
                      </div>

                      {/* Legend */}
                      <div className="grid grid-cols-2 gap-2 mt-4 w-full">
                        {analytics.orderStatusData.map((item) => (
                          <div key={item.status} className="flex items-center gap-2 text-sm">
                            <div
                              className="w-3 h-3 rounded-full"
                              style={{ backgroundColor: statusColors[item.status as keyof typeof statusColors] }}
                            />
                            <span className="text-gray-600 capitalize">{item.status}</span>
                            <span className="text-gray-900 font-medium ml-auto">{item.count}</span>
                          </div>
                        ))}
                      </div>
                    </>
                  ) : (
                    <div className="h-[280px] flex items-center justify-center text-gray-400">
                      No order status data
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Payment Method */}
              <Card className="border-0 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-xl font-bold">Payment Methods</CardTitle>
                  <CardDescription>Preferred payment options</CardDescription>
                </CardHeader>
                <CardContent>
                  {analytics.paymentMethodData && analytics.paymentMethodData.length > 0 ? (
                    <>
                      <ResponsiveContainer width="100%" height={280}>
                        <PieChart>
                          <Pie
                            data={analytics.paymentMethodData}
                            innerRadius={65}
                            outerRadius={100}
                            dataKey="count"
                            paddingAngle={4}
                          >
                            {analytics.paymentMethodData.map((_, i) => (
                              <Cell key={i} fill={paymentColors[i % paymentColors.length]} />
                            ))}
                          </Pie>
                        </PieChart>
                      </ResponsiveContainer>

                      {/* Legend */}
                      <div className="grid grid-cols-2 gap-2 mt-4 w-full">
                        {analytics.paymentMethodData.map((item, i) => (
                          <div key={item.method} className="flex items-center gap-2 text-sm">
                            <div
                              className="w-3 h-3 rounded-full"
                              style={{ backgroundColor: paymentColors[i % paymentColors.length] }}
                            />
                            <span className="text-gray-600 capitalize">{item.method}</span>
                            <span className="text-gray-900 font-medium ml-auto">{item.count}</span>
                          </div>
                        ))}
                      </div>
                    </>
                  ) : (
                    <div className="h-[280px] flex items-center justify-center text-gray-400">
                      No payment data
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  )
}
