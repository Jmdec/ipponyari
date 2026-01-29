"use client"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import type React from "react"

import { AppSidebar } from "@/components/app-sidebar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  MoreHorizontal,
  Eye,
  Search,
  Loader2,
  ArrowUpDown,
  Edit,
  Package,
  Clock,
  CheckCircle,
  XCircle,
  Truck,
  DollarSign,
  User,
  Phone,
  MapPin,
  SquarePen,
  Icon,
} from "lucide-react"
import { Link as LinkIcon } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import {
  type ColumnDef,
  type ColumnFiltersState,
  type RowSelectionState,
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
} from "@tanstack/react-table"
import { Checkbox } from "@/components/ui/checkbox"
import Image from "next/image"

// Order data types
interface OrderItem {
  id: number
  name: string
  description: string
  price: number
  quantity: number
  category: string
  is_spicy: boolean
  is_vegetarian: boolean
  image_url: string
}

interface Order {
  id: number
  order_number: string
  customer_name: string
  customer_email: string
  customer_phone: string
  delivery_address: string
  delivery_city: string
  delivery_zip_code: string
  payment_method: string
  order_status: number | string
  subtotal: number
  delivery_fee: number
  total_amount: number
  notes?: string
  receipt_file?: string
  items: OrderItem[]
  created_at: string
  updated_at: string
}

const StatusStatistics = ({
  title,
  order_status,
  icon: Icon,
}: {
  title: string
  order_status: number | string
  icon: any
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
        <p className="text-3xl font-extrabold text-gray-900">{order_status}</p>
        <p className="text-sm text-gray-500">Orders</p>
      </div>
    </CardContent>
  </Card>
)

const orderStatuses = [
  { value: "pending", label: "Pending", color: "bg-yellow-100 text-yellow-800", icon: Clock },
  { value: "confirmed", label: "Confirmed", color: "bg-blue-100 text-blue-800", icon: CheckCircle },
  { value: "preparing", label: "Preparing", color: "bg-orange-100 text-orange-800", icon: Package },
  { value: "ready", label: "Ready", color: "bg-green-100 text-green-800", icon: CheckCircle },
  { value: "out_for_delivery", label: "Out for Delivery", color: "bg-purple-100 text-purple-800", icon: Truck },
  { value: "delivered", label: "Delivered", color: "bg-green-100 text-green-800", icon: Truck },
  { value: "cancelled", label: "Cancelled", color: "bg-red-100 text-red-800", icon: XCircle },
]

const paymentMethods = [
  { value: "cash", label: "Cash on Delivery" },
  { value: "gcash", label: "GCash" },
  { value: "paypal", label: "PayPal" },
  { value: "bpi", label: "BPI" },
  { value: "security_bank", label: "Security Bank" },
  { value: "maya", label: "Maya" },
]

export default function OrdersAdminPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)

  const { toast } = useToast()
  const router = useRouter()

  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({})
  const [globalFilter, setGlobalFilter] = useState("")

  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [paymentMethodFilter, setPaymentMethodFilter] = useState<string>("all")
  const [statusCounts, setStatusCounts] = useState<Record<string, number>>({})

  // State for desktop detection
  const [isDesktop, setIsDesktop] = useState(false)
  useEffect(() => {
    const checkDesktop = () => {
      setIsDesktop(window.innerWidth < 1024) // lg breakpoint
    }
    checkDesktop()
    window.addEventListener("resize", checkDesktop)
    return () => window.removeEventListener("resize", checkDesktop)
  }, [])

  const [updatingStatus, setUpdatingStatus] = useState<number | null>(null)

  // Helper function to safely calculate total revenue
  const calculateTotalRevenue = (orders: Order[]): string => {
    if (!Array.isArray(orders) || orders.length === 0) {
      return "0.00"
    }

    try {
      const total = orders.reduce((sum, order) => {
        const orderTotal = typeof order.total_amount === "number" ? order.total_amount : 0
        return sum + orderTotal
      }, 0)

      return total.toFixed(2)
    } catch (error) {
      console.error("Error calculating total revenue:", error)
      return "0.00"
    }
  }

  // Helper function to get status badge
  const getStatusBadge = (status: string) => {
    const statusInfo = orderStatuses.find((s) => s.value === status)

    return (
      <Badge variant="outline" className="text-xs">
        {statusInfo?.label || status}
      </Badge>
    )
  }

  // Helper function to get payment method badge
  const getPaymentMethodBadge = (method: string) => {
    const methodInfo = paymentMethods.find((m) => m.value === method)
    return (
      <Badge variant="outline" className="text-xs">
        {methodInfo?.label || method}
      </Badge>
    )
  }

  // Update order status
  const handleStatusUpdate = async (orderId: number, newStatus: string) => {
    setUpdatingStatus(orderId)
    try {
      const token = localStorage.getItem("auth_token")
      if (!token) {
        throw new Error("Authentication token not found")
      }

      const response = await fetch(`/api/orders/${orderId}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          "X-Admin-Request": "true", // Add admin header
        },
        body: JSON.stringify({ status: newStatus }),
      })

      const result = await response.json()
      if (!response.ok) {
        throw new Error(result.message || "Failed to update order status.")
      }

      toast({
        title: "Success",
        description: "Order status updated successfully!",
      })

      fetchOrders()

    } catch (error: any) {
      console.error("Error updating order status:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "There was an error updating the order status.",
      })
    } finally {
      setUpdatingStatus(null)
    }
  }

  // Fetch orders
  const fetchOrders = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem("auth_token")

      if (!token) {
        toast({
          variant: "destructive",
          title: "Authentication Required",
          description: "Please log in to access orders.",
        })
        router.push("/login")
        return
      }

      let url = "/api/orders?per_page=100"

      // Add filters to URL
      const params = new URLSearchParams()
      if (statusFilter !== "all") params.append("status", statusFilter)
      if (paymentMethodFilter !== "all") params.append("payment_method", paymentMethodFilter)
      if (globalFilter) params.append("search", globalFilter)

      if (params.toString()) {
        url += `&${params.toString()}`
      }

      console.log("Fetching orders from:", url) // Debug log

      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
          "X-Admin-Request": "true", // Add admin header to force admin view
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error("Orders API error response:", errorText)

        if (response.status === 401) {
          localStorage.removeItem("auth_token")
          router.push("/login")
          return
        }

        throw new Error(`HTTP ${response.status}: ${errorText}`)
      }

      const result = await response.json()
      console.log("Orders API response:", result) // Debug log

      if (result.success) {
        // Handle the transformed response structure
        const ordersData = result.data || []
        console.log("Setting orders:", ordersData) // Debug log

        // Ensure we have an array and validate the data structure
        if (Array.isArray(ordersData)) {
          const validatedOrders = ordersData.map((order) => ({
            ...order,
            total: typeof order.total === "number" ? order.total : 0,
            subtotal: typeof order.subtotal === "number" ? order.subtotal : 0,
            delivery_fee: typeof order.delivery_fee === "number" ? order.delivery_fee : 0,
            items: Array.isArray(order.items) ? order.items : [],
          }))

          setOrders(validatedOrders)
        } else {
          console.error("Orders data is not an array:", ordersData)
          setOrders([])
        }
      } else {
        throw new Error(result.message || "Failed to fetch orders")
      }
    } catch (error) {
      console.error("Failed to fetch orders:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to load orders. Please check your authentication.",
      })

      setOrders([])

      // If authentication error, redirect to login
      if (error instanceof Error && error.message.includes("401")) {
        localStorage.removeItem("auth_token")
        router.push("/login")
      }
    } finally {
      setLoading(false)
    }
  }

  const fetchOrderStatistics = async () => {
    try {
      const token = localStorage.getItem("auth_token")
      if (!token) return

      const res = await fetch("/api/orders/statistics", {
        headers: {
          Authorization: `Bearer ${token}`,
          "X-Admin-Request": "true",
        },
      })

      if (!res.ok) throw new Error("Failed to fetch statistics")

      const data = await res.json()
    } catch (err) {
      console.error("Stats error:", err)
    }
  }

  useEffect(() => {
    fetchOrders()
    fetchOrderStatistics()
  }, [statusFilter, paymentMethodFilter])

  // Debounce search
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (globalFilter !== undefined) {
        fetchOrders()
      }
    }, 500)

    return () => clearTimeout(timeoutId)
  }, [globalFilter])

  // Define columns for DataTable
  const columns: ColumnDef<Order>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={table.getIsAllPageRowsSelected()}
          indeterminate={table.getIsSomePageRowsSelected()}
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },

    {
      id: "update-status",
      enableHiding: false,
      cell: ({ row }) => {
        const order = row.original
        return (
          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Order Actions</DropdownMenuLabel>
                <DropdownMenuSeparator />

                {orderStatuses.map((status) => (
                  <DropdownMenuItem
                    key={status.value}
                    onClick={() => handleStatusUpdate(order.id, status.value)}
                    disabled={updatingStatus === order.id || order.order_status === status.value}
                  >
                    <status.icon className="mr-2 h-4 w-4" />
                    Mark as {status.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )
      },
    },
    {
      accessorKey: "order_number",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="p-0 h-auto font-normal"
        >
          Order #
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => (
        <div className="min-w-0">
          <div className="font-semibold text-gray-900 truncate">{row.original.order_number}</div>
        </div>
      ),
    },
    {
      accessorKey: "customer_name",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="p-0 h-auto font-normal hidden sm:flex"
        >
          Customer
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => (
        <div className="min-w-0 hidden sm:block">
          <div className="font-medium text-gray-900 truncate">{row.original.customer_name}</div>
          <div className="text-xs text-gray-500 truncate">{row.original.customer_email}</div>
        </div>
      ),
    },
    {
      accessorKey: "status",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="p-0 h-auto font-normal hidden lg:flex"
        >
          Status
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) =>
        <div className="hidden lg:block">{getStatusBadge(row.original.order_status)}</div>
    },
    {
      accessorKey: "payment_method",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="p-0 h-auto font-normal hidden lg:flex"
        >
          Payment
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => <div className="hidden lg:block">{getPaymentMethodBadge(row.original.payment_method)}</div>,
    },
    {
      accessorKey: "total_amount",
      header: ({ column }) => (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Total
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => (
        <div className="font-semibold">₱{(row.original.total_amount ?? 0).toFixed(2)}</div>
      ),
    },
    {
      accessorKey: "total_amount",
      header: ({ column }) => (
        <Button variant="ghost">
          Actions
        </Button>
      ),
      cell: ({ row }) => {
        const order = row.original
        return (
          <div className="flex items-center gap-1">
            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedOrder(order)}
                  className="h-8 w-8 p-0 sm:h-auto sm:w-auto sm:px-2"
                >
                  <Eye className="h-4 w-4" />
                </Button>
              </SheetTrigger>
              <SheetContent className="w-full sm:max-w-3xl overflow-y-auto">
                {selectedOrder && (
                  <>
                    <SheetHeader>
                      <SheetTitle>Order Details - #{selectedOrder.order_number}</SheetTitle>
                      <SheetDescription>Complete information for this order</SheetDescription>
                    </SheetHeader>
                    <div className="mt-6 space-y-6">
                      {/* Order Status and Quick Actions */}
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-4 bg-gray-50 rounded-lg">
                        <div>
                          <div className="flex items-center gap-3 mb-2">
                            {getStatusBadge(selectedOrder.order_status)}
                            {getPaymentMethodBadge(selectedOrder.payment_method)}
                          </div>
                          <p className="text-sm text-gray-600">
                            Order placed on{" "}
                            {new Date(selectedOrder.created_at).toLocaleDateString("en-US", {
                              month: "long",
                              day: "2-digit",
                              year: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-green-600">
                            ₱
                            {(typeof selectedOrder.total_amount === "number" ? selectedOrder.total_amount : 0).toFixed(
                              2,
                            )}
                          </div>
                          <div className="text-sm text-gray-500">
                            Subtotal: ₱
                            {(typeof selectedOrder.subtotal === "number" ? selectedOrder.subtotal : 0).toFixed(2)} +
                            Delivery: ₱
                            {(typeof selectedOrder.delivery_fee === "number" ? selectedOrder.delivery_fee : 0).toFixed(
                              2,
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Customer Information */}
                        <Card>
                          <CardHeader className="pb-3">
                            <h3 className="font-semibold text-lg flex items-center gap-2">
                              <User className="w-5 h-5" />
                              Customer Information
                            </h3>
                          </CardHeader>
                          <CardContent className="space-y-3">
                            <div>
                              <Label className="text-sm font-medium text-gray-500">Name</Label>
                              <p className="font-medium">{selectedOrder.customer_name}</p>
                            </div>
                            <div>
                              <Label className="text-sm font-medium text-gray-500">Email</Label>
                              <p className="text-sm">{selectedOrder.customer_email}</p>
                            </div>
                            <div className="flex items-center gap-2">
                              <Phone className="w-4 h-4 text-gray-400" />
                              <p className="text-sm">{selectedOrder.customer_phone}</p>
                            </div>
                          </CardContent>
                        </Card>

                        {/* Delivery Information */}
                        <Card>
                          <CardHeader className="pb-3">
                            <h3 className="font-semibold text-lg flex items-center gap-2">
                              <MapPin className="w-5 h-5" />
                              Delivery Address
                            </h3>
                          </CardHeader>
                          <CardContent className="space-y-2">
                            <p className="text-sm">{selectedOrder.delivery_address}</p>
                            <p className="text-sm">
                              {selectedOrder.delivery_city}, {selectedOrder.delivery_zip_code}
                            </p>
                          </CardContent>
                        </Card>
                      </div>

                      {/* Order Items */}
                      <Card>
                        <CardHeader className="pb-3">
                          <h3 className="font-semibold text-lg flex items-center gap-2">
                            <Package className="w-5 h-5" />
                            Order Items ({selectedOrder.items?.length || 0})
                          </h3>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-3">
                            {(selectedOrder.items || []).map((item, index) => (
                              <div key={index} className="flex items-center gap-3 p-3 border rounded-lg">
                                <div className="w-12 h-12 rounded-md overflow-hidden flex-shrink-0">
                                  <Image
                                    src={
                                      item.image_url ||
                                      "https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop" ||
                                      "/placeholder.svg"
                                    }
                                    alt={item.name}
                                    width={48}
                                    height={48}
                                    className="object-cover w-full h-full"
                                  />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <h4 className="font-medium text-sm truncate">{item.name}</h4>
                                  <p className="text-xs text-gray-500 truncate">{item.description}</p>
                                  <div className="flex items-center gap-2 mt-1">
                                    <Badge variant="outline" className="text-xs">
                                      {item.category}
                                    </Badge>
                                    {item.is_spicy && (
                                      <Badge variant="destructive" className="text-xs">
                                        Spicy
                                      </Badge>
                                    )}
                                    {item.is_vegetarian && (
                                      <Badge variant="secondary" className="text-xs bg-green-100 text-green-800">
                                        Veg
                                      </Badge>
                                    )}
                                  </div>
                                </div>
                                <div className="text-right">
                                  <div className="font-medium text-sm">
                                    ₱{(typeof item.price === "number" ? item.price : 0).toFixed(2)}
                                  </div>
                                  <div className="text-xs text-gray-500">Qty: {item.quantity || 0}</div>
                                  <div className="font-medium text-xs">
                                    ₱
                                    {((typeof item.price === "number" ? item.price : 0) * (item.quantity || 0)).toFixed(
                                      2,
                                    )}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>

                      {/* Additional Notes */}
                      {selectedOrder.notes && (
                        <Card>
                          <CardHeader className="pb-3">
                            <h3 className="font-semibold text-lg">Special Notes</h3>
                          </CardHeader>
                          <CardContent>
                            <p className="text-sm p-3 bg-gray-50 rounded-md whitespace-pre-wrap">
                              {selectedOrder.notes}
                            </p>
                          </CardContent>
                        </Card>
                      )}
                    </div>
                  </>
                )}
              </SheetContent>
            </Sheet>

            <div className="border-l-2 pl-4">
              <button
                onClick={() => router.push(`/admin/order/${order.id}/edit`)}
                className="text-red-600"
              >
                <SquarePen className="h-4 w-4" />
              </button>
            </div>
          </div>
        )
      },
    },
  ]

  // Initialize table instance
  const table = useReactTable({
    data: orders,
    columns: columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    state: {
      columnFilters,
      globalFilter,
      rowSelection,
    },
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    onRowSelectionChange: setRowSelection,
  })

  if (loading) {
    return (
      <SidebarProvider defaultOpen={!isDesktop}>
        <div className="flex min-h-screen w-full bg-gradient-to-br from-orange-50 to-red-50">
          <AppSidebar />
          <div className={`flex-1 min-w-0 ${isDesktop ? "ml-0" : "ml-72"}`}>
            <div className="flex items-center justify-center min-h-screen w-full">
              <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm px-6 py-4 rounded-xl shadow-lg">
                <Loader2 className="h-6 w-6 animate-spin text-orange-500" />
                <span className="text-gray-700 font-medium">Loading orders...</span>
              </div>
            </div>
          </div>
        </div>
      </SidebarProvider>
    )
  }

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

          <main className="flex-1 overflow-auto p-3 sm:p-4 md:p-6">
            <div className="max-w-full space-y-4 sm:space-y-6">
              {/* Header */}
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div>
                  <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Order Management</h1>
                  <p className="text-gray-600 mt-1">Manage customer orders and track delivery status</p>
                </div>

                <div className="flex items-center gap-4 bg-white/70 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-orange-100">
                  <div className="flex items-center gap-2 text-sm">
                    <DollarSign className="w-5 h-5 text-green-500" />
                    <span className="text-gray-600 font-medium">Total Revenue:</span>
                    <span className="font-bold text-green-600 text-lg">₱{calculateTotalRevenue(orders)}</span>
                  </div>
                </div>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <StatusStatistics
                  title="Pending"
                  order_status={statusCounts.pending ?? 0}
                  icon={Clock}
                />
                <StatusStatistics
                  title="Confirmed"
                  order_status={statusCounts.confirmed ?? 0}
                  icon={CheckCircle}
                />
                <StatusStatistics
                  title="Preparing"
                  order_status={statusCounts.preparing ?? 0}
                  icon={Package}
                />
                <StatusStatistics
                  title="Delivered"
                  order_status={statusCounts.delivered ?? 0}
                  icon={Truck}
                />
              </div>

              {/* Filters and Search */}
              <Card className="bg-white/70 backdrop-blur-sm shadow-xl p-0 pb-5 border-red-100">
                <CardHeader className="p-3 bg-gradient-to-r from-red-500 to-red-500 text-white rounded-t-lg">
                  <div className="flex flex-col gap-4">
                    <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
                      <div className="relative flex-1 max-w-sm">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/70" />
                        <Input
                          placeholder="Search orders..."
                          value={globalFilter || ""}
                          onChange={(event) => setGlobalFilter(event.target.value)}
                          className="pl-9 pr-3 py-2 w-full bg-white/20 border-white/30 text-white placeholder:text-white/70 focus:bg-white/30 focus:border-white/50"
                        />
                      </div>

                      <div className="flex gap-2">
                        <Select value={statusFilter} onValueChange={setStatusFilter}>
                          <SelectTrigger className="w-32 bg-white/20 border-white/30 text-white focus:bg-white/30 focus:border-white/50">
                            <SelectValue placeholder="Status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Status</SelectItem>
                            {orderStatuses.map((status) => (
                              <SelectItem key={status.value} value={status.value}>
                                {status.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>

                        <Select value={paymentMethodFilter} onValueChange={setPaymentMethodFilter}>
                          <SelectTrigger className="w-32 bg-white/20 border-white/30 text-white focus:bg-white/30 focus:border-white/50">
                            <SelectValue placeholder="Payment" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Payments</SelectItem>
                            {paymentMethods.map((method) => (
                              <SelectItem key={method.value} value={method.value}>
                                {method.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="bg-white">
                  <div className="text-sm text-gray-600 mb-4 font-medium">
                    Showing {table.getFilteredRowModel().rows.length} of {orders.length} orders
                  </div>

                  {/* Orders Table */}
                  <div className="w-full">
                    <div className="rounded-lg border border-orange-200 overflow-hidden shadow-lg">
                      <div className="overflow-x-auto">
                        <table className="w-full min-w-[800px]">
                          <thead className="bg-gradient-to-r from-orange-100 to-red-100">
                            <tr className="border-b border-orange-200">
                              {table.getHeaderGroups().map((headerGroup) =>
                                headerGroup.headers.map((header) => (
                                  <th
                                    key={header.id}
                                    className="text-left p-2 sm:p-3 text-xs sm:text-sm font-semibold text-gray-700"
                                  >
                                    {header.isPlaceholder ? null : (
                                      <div>
                                        {typeof header.column.columnDef.header === "function"
                                          ? header.column.columnDef.header(header.getContext())
                                          : header.column.columnDef.header}
                                      </div>
                                    )}
                                  </th>
                                )),
                              )}
                            </tr>
                          </thead>
                          <tbody>
                            {table.getRowModel().rows.map((row, index) => (
                              <tr
                                key={row.id}
                                className={`border-b border-orange-100 hover:bg-gradient-to-r hover:from-orange-50 hover:to-red-50 transition-all duration-200 ${index % 2 === 0 ? "bg-white" : "bg-orange-25"}`}
                              >
                                {row.getVisibleCells().map((cell) => (
                                  <td key={cell.id} className="p-2 sm:p-3 text-xs sm:text-sm">
                                    {typeof cell.column.columnDef.cell === "function"
                                      ? cell.column.columnDef.cell(cell.getContext())
                                      : (cell.getValue() as React.ReactNode)}
                                  </td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                    {table.getRowModel().rows.length === 0 && (
                      <div className="text-center py-12 text-gray-500 bg-white rounded-lg border border-orange-200 mt-4">
                        <div className="bg-gradient-to-r from-orange-100 to-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                          <Package className="w-8 h-8 text-orange-500" />
                        </div>
                        <p className="text-lg font-medium text-gray-700">No orders found</p>
                        {globalFilter && (
                          <p className="text-sm mt-1 text-gray-500">Try adjusting your search terms or filters</p>
                        )}
                      </div>
                    )}

                    {/*  

                    {totalPages > 1 && (
                      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-4 pt-4 border-t border-red-200">
                        <div className="text-sm text-gray-600">
                          Page {currentPage} of {totalPages}
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setCurrentPage(1)}
                            disabled={currentPage === 1}
                            className="border-red-300 text-red-600 hover:bg-red-50 disabled:opacity-50"
                          >
                            First
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                            disabled={currentPage === 1}
                            className="border-red-300 text-red-600 hover:bg-red-50 disabled:opacity-50"
                          >
                            Previous
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                            disabled={currentPage === totalPages}
                            className="border-red-300 text-red-600 hover:bg-red-50 disabled:opacity-50"
                          >
                            Next
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setCurrentPage(totalPages)}
                            disabled={currentPage === totalPages}
                            className="border-red-300 text-red-600 hover:bg-red-50 disabled:opacity-50"
                          >
                            Last
                          </Button>
                        </div>
                      </div>
                    
                    )}*/}
                  </div>
                </CardContent>
              </Card>
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  )
}
