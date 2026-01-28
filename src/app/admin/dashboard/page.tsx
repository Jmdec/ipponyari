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
    averageOrderValue: number
    totalCustomers: number
    growthRate: number
  }
  revenueData: Array<{ date: string; revenue: number; orders: number }>
  orderStatusData: Array<{ status: string; count: number; percentage: number }>
  paymentMethodData: Array<{ method: string; count: number; percentage: number }>
  popularProducts: Array<{ name: string; orders: number; revenue: number; category: string; is_spicy: boolean }>
  categoryData: Array<{ category: string; orders: number; revenue: number }>
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
  <Card className="group relative overflow-hidden border border-gray-200 bg-white transition-all duration-300 hover:-translate-y-0.5 hover:shadow-sm">
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

      {/* subtitle */}
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
  const [isMobile, setIsMobile] = useState(false)
  const [apiError, setApiError] = useState<string | null>(null)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        console.log("[v0] Fetching analytics from /api/dashboard...")
        const response = await fetch("/api/dashboard")
        console.log("[v0] Response status:", response.status)

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const data = await response.json()
        console.log("[v0] API Response:", data)

        if (data.success) {
          setAnalytics(data.data)
          if (data.data.error) {
            setApiError(data.data.error)
          }
          console.log("[v0] Analytics data set successfully")
        } else {
          throw new Error(data.message || "Failed to fetch analytics")
        }
      } catch (error) {
        console.error("[v0] Failed to fetch analytics:", error)
        setError(error instanceof Error ? error.message : "Unknown error occurred")
      } finally {
        setLoading(false)
      }
    }

    fetchAnalytics()
  }, [])

  if (loading) {
    return (
      <SidebarProvider defaultOpen={!isMobile}>
        <div className="flex min-h-screen w-full bg-gradient-to-br from-orange-50 to-red-50">
          <AppSidebar />
          <div className={`flex-1 min-w-0 ${isMobile ? "ml-0" : "ml-72"}`}>
            <div className="flex items-center justify-center min-h-screen w-full">
              <div className="flex items-center gap-3 bg-white px-8 py-6 rounded-2xl shadow-lg">
                <Loader2 className="h-6 w-6 animate-spin text-orange-500" />
                <span className="text-gray-700 font-medium text-lg">Loading Dashboard...</span>
              </div>
            </div>
          </div>
        </div>
      </SidebarProvider>
    )
  }

  if (error || !analytics) {
    return (
      <SidebarProvider defaultOpen={!isMobile}>
        <div className="flex min-h-screen w-full bg-gray-50">
          <AppSidebar />
          <div className={`flex-1 min-w-0 ${isMobile ? "ml-0" : "ml-72"}`}>
            <div className="flex items-center justify-center min-h-screen w-full p-4">
              <Card className="max-w-md w-full border-red-200">
                <CardHeader>
                  <CardTitle className="text-red-600">Failed to Load Analytics</CardTitle>
                  <CardDescription>{error || "No data available"}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-gray-600">
                    Make sure NEXT_PUBLIC_API_URL is set and your Laravel API is running
                  </p>
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
        </div>
      </SidebarProvider>
    )
  }

  console.log("[v0] Rendering dashboard with analytics:", analytics)

  return (
    <SidebarProvider defaultOpen={!isMobile}>
      <div className="flex min-h-screen w-full bg-gradient-to-br from-orange-50 to-red-50">
        <AppSidebar />
        <div className={`flex-1 min-w-0 ${isMobile ? "ml-0" : "ml-72"}`}>
          {isMobile && (
            <div className="sticky top-0 z-50 flex h-14 items-center gap-3 border-b bg-white px-4 shadow-sm">
              <SidebarTrigger className="-ml-1" />
              <div className="relative w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 overflow-hidden group-hover:scale-105 transition-transform duration-300">
                <Image src="/logoippon.png" alt="Ipponyari Logo" fill className="object-contain" />
              </div>
              <h1 className="text-lg font-bold text-gray-900">Ipponyari Japanese Restaurant</h1>
            </div>
          )}

          <main className="p-4 md:p-6 lg:p-8 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Dashboard</h1>
                <p className="text-gray-600 mt-1">Restaurant analytics and insights</p>
              </div>
              <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow-sm border">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-gray-700">Live</span>
              </div>
            </div>

            {!analytics.keyMetrics || analytics.keyMetrics.totalOrders === 0 ? (
              /* Empty State */
              <div className="space-y-6">
                <Card className="border-0 shadow-sm">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="p-3 bg-orange-100 rounded-lg">
                        <ShoppingCart className="w-6 h-6 text-orange-600" />
                      </div>
                      <div>
                        <CardTitle className="text-xl">No Orders Yet</CardTitle>
                        <CardDescription>Start receiving orders to see analytics</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="bg-orange-50 border-l-4 border-orange-400 rounded-lg p-4">
                      <h4 className="font-semibold text-orange-900 mb-2">Getting Started</h4>
                      <p className="text-orange-800 text-sm mb-3">
                        {apiError || "There are currently no orders in the system. This could be because the database is empty or the API endpoint requires authentication."}
                      </p>
                    </div>

                    {analytics.productsCount > 0 && (
                      <div className="bg-green-50 border-l-4 border-green-400 rounded-lg p-4">
                        <h4 className="font-semibold text-green-900 mb-2">✓ Products Ready</h4>
                        <p className="text-green-800 text-sm">
                          Found {analytics.productsCount} products in your catalog. Your products are ready for orders!
                        </p>
                      </div>
                    )}

                    <div className="grid md:grid-cols-2 gap-4 pt-4">
                      <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                        <h4 className="font-semibold text-gray-900 text-sm">Laravel Routes</h4>
                        <pre className="bg-gray-900 text-green-400 p-3 rounded text-xs overflow-x-auto">
                          {`Route::get('/analytics', 
                            [OrderController::class, 'analytics']
                          );`}
                        </pre>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                        <h4 className="font-semibold text-gray-900 text-sm">Environment</h4>
                        <pre className="bg-gray-900 text-green-400 p-3 rounded text-xs overflow-x-auto">
                          {`NEXT_PUBLIC_API_URL=
                          http://your-api.com`}
                        </pre>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ) : (
              <>
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
                    title="Average Order"
                    value={`₱${(analytics.keyMetrics?.averageOrderValue || 0).toLocaleString()}`}
                    icon={TrendingUp}
                    subtitle="Per order value"
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

                {/* Revenue Chart */}
                <Card className="border-0 shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-xl font-bold">Revenue Overview</CardTitle>
                    <CardDescription>Daily revenue and order trends</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {analytics.revenueData && analytics.revenueData.length > 0 ? (
                      <ResponsiveContainer width="100%" height={350}>
                        <AreaChart data={analytics.revenueData}>
                          <defs>
                            <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#f97316" stopOpacity={0.3} />
                              <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                          <XAxis dataKey="date" stroke="#6b7280" style={{ fontSize: '12px' }} />
                          <YAxis stroke="#6b7280" style={{ fontSize: '12px' }} />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: '#ffffff',
                              border: '1px solid #e5e7eb',
                              borderRadius: '8px',
                              boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                            }}
                          />
                          <Area
                            type="monotone"
                            dataKey="revenue"
                            stroke="#f97316"
                            fill="url(#colorRevenue)"
                            strokeWidth={2}
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="h-[350px] flex items-center justify-center text-gray-400">
                        No revenue data available
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Order Status & Payment Methods */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card className="border-0 shadow-sm">
                    <CardHeader>
                      <CardTitle className="text-xl font-bold">Order Status</CardTitle>
                      <CardDescription>Current order distribution</CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col items-center">
                      {analytics.orderStatusData && analytics.orderStatusData.length > 0 ? (
                        <>
                          <ResponsiveContainer width="100%" height={250}>
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
                                {analytics.orderStatusData.map((entry, index) => (
                                  <Cell
                                    key={`cell-${index}`}
                                    fill={statusColors[entry.status as keyof typeof statusColors]}
                                  />
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
                        <div className="h-[250px] flex items-center justify-center text-gray-400">
                          No order status data
                        </div>
                      )}
                    </CardContent>
                  </Card>


                  <Card className="border-0 shadow-sm">
                    <CardHeader>
                      <CardTitle className="text-xl font-bold">Payment Methods</CardTitle>
                      <CardDescription>Preferred payment options</CardDescription>
                    </CardHeader>
                    <CardContent>
                      {analytics.paymentMethodData && analytics.paymentMethodData.length > 0 ? (
                        <ResponsiveContainer width="100%" height={300}>
                          <BarChart data={analytics.paymentMethodData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                            <XAxis dataKey="method" stroke="#6b7280" style={{ fontSize: '12px' }} />
                            <YAxis stroke="#6b7280" style={{ fontSize: '12px' }} />
                            <Tooltip
                              contentStyle={{
                                backgroundColor: '#ffffff',
                                border: '1px solid #e5e7eb',
                                borderRadius: '8px'
                              }}
                            />
                            <Bar dataKey="count" fill="#f97316" radius={[8, 8, 0, 0]} />
                          </BarChart>
                        </ResponsiveContainer>
                      ) : (
                        <div className="h-[300px] flex items-center justify-center text-gray-400">
                          No payment data
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>

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
                              <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-orange-500 to-red-500 text-white rounded-lg font-bold text-lg">
                                {index + 1}
                              </div>
                              <div>
                                <h3 className="font-semibold text-gray-900">{product.name}</h3>
                                <div className="flex items-center gap-2 mt-1">
                                  <Badge variant="secondary" className="text-xs">
                                    {product.category}
                                  </Badge>
                                  {product.is_spicy && (
                                    <Badge variant="outline" className="text-xs border-orange-300 text-orange-700">
                                      🌶️ Spicy
                                    </Badge>
                                  )}
                                </div>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="font-bold text-gray-900">{product.orders}</div>
                              <div className="text-sm text-gray-500">orders</div>
                              <div className="text-sm font-medium text-orange-600 mt-1">
                                ₱{product.revenue.toLocaleString()}
                              </div>
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

                {/* Category Performance */}
                <Card className="border-0 shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-xl font-bold">Category Performance</CardTitle>
                    <CardDescription>Revenue breakdown by category</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {analytics.categoryData && analytics.categoryData.length > 0 ? (
                      <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={analytics.categoryData} layout="vertical">
                          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                          <XAxis type="number" stroke="#6b7280" style={{ fontSize: '12px' }} />
                          <YAxis dataKey="category" type="category" stroke="#6b7280" style={{ fontSize: '12px' }} width={100} />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: '#ffffff',
                              border: '1px solid #e5e7eb',
                              borderRadius: '8px'
                            }}
                          />
                          <Bar dataKey="revenue" fill="#f97316" radius={[0, 8, 8, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="h-[300px] flex items-center justify-center text-gray-400">
                        No category data
                      </div>
                    )}
                  </CardContent>
                </Card>
              </>
            )}
          </main>
        </div>
      </div>
    </SidebarProvider>
  )
}