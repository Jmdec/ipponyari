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
  Utensils,
  Clock,
  CheckCircle,
  XCircle,
  User,
  Calendar,
} from "lucide-react"
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

// Event data types
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
  status: "pending" | "confirmed" | "completed" | "cancelled"
  created_at: string
  updated_at: string
}

const eventStatuses = [
  { value: "pending", label: "Pending", color: "bg-yellow-100 text-yellow-800", icon: Clock },
  { value: "confirmed", label: "Confirmed", color: "bg-blue-100 text-blue-800", icon: CheckCircle },
  { value: "completed", label: "Completed", color: "bg-green-100 text-green-800", icon: CheckCircle },
  { value: "cancelled", label: "Cancelled", color: "bg-red-100 text-red-800", icon: XCircle },
]

const eventTypes = [
  { value: "wedding", label: "Wedding" },
  { value: "corporate", label: "Corporate Event" },
  { value: "birthday", label: "Birthday Party" },
  { value: "conference", label: "Conference" },
  { value: "other", label: "Other" },
]

const venueAreas = [
  { value: "vip_area", label: "VIP AREA" },
  { value: "main_hall", label: "Main Hall" },
  { value: "private_room", label: "Private Room" },
]

export default function EventsAdminPage() {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null)
  const { toast } = useToast()
  const router = useRouter()

  // DataTable states
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({})
  const [globalFilter, setGlobalFilter] = useState("")

  // Filter states
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [eventTypeFilter, setEventTypeFilter] = useState<string>("all")

  // State for mobile detection
  const [isMobile, setIsMobile] = useState(false)
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  const [updatingStatus, setUpdatingStatus] = useState<number | null>(null)

  // Helper function to get status badge
  const getStatusBadge = (status: string) => {
    const statusInfo = eventStatuses.find((s) => s.value === status)
    if (!statusInfo) return null

    const Icon = statusInfo.icon
    return (
      <Badge className={`text-xs px-2 py-1 ${statusInfo.color}`}>
        <Icon className="w-3 h-3 mr-1" />
        {statusInfo.label}
      </Badge>
    )
  }

  // Helper function to get event type badge
  const getEventTypeBadge = (type: string) => {
    const typeInfo = eventTypes.find((t) => t.value === type)
    return (
      <Badge variant="outline" className="text-xs">
        {typeInfo?.label || type}
      </Badge>
    )
  }

  // Update event status
  const handleStatusUpdate = async (eventId: number, newStatus: string) => {
    setUpdatingStatus(eventId)
    try {
      const token = localStorage.getItem("auth_token")
      if (!token) {
        throw new Error("Authentication token not found")
      }

      console.log("[v0] Updating event status:", { eventId, newStatus })

      const response = await fetch(`/api/events/${eventId}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          "X-Admin-Request": "true",
        },
        body: JSON.stringify({ status: newStatus }),
      })

      const result = await response.json()
      console.log("[v0] Status update response:", result)

      if (!response.ok) {
        throw new Error(result.message || result.error || "Failed to update event status.")
      }

      toast({
        title: "Success",
        description: "Event status updated successfully!",
      })

      // Refresh events list
      fetchEvents()
    } catch (error: any) {
      console.error("Error updating event status:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "There was an error updating the event status.",
      })
    } finally {
      setUpdatingStatus(null)
    }
  }

  // Fetch events
  const fetchEvents = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem("auth_token")

      if (!token) {
        toast({
          variant: "destructive",
          title: "Authentication Required",
          description: "Please log in to access events.",
        })
        router.push("/login")
        return
      }

      let url = "/api/events?per_page=100"

      // Add filters to URL
      const params = new URLSearchParams()
      if (statusFilter !== "all") params.append("status", statusFilter)
      if (eventTypeFilter !== "all") params.append("eventType", eventTypeFilter)
      if (globalFilter) params.append("search", globalFilter)

      if (params.toString()) {
        url += `&${params.toString()}`
      }

      console.log("Fetching events from:", url)

      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
          "X-Admin-Request": "true",
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error("Events API error response:", errorText)

        if (response.status === 401) {
          localStorage.removeItem("auth_token")
          router.push("/login")
          return
        }

        throw new Error(`HTTP ${response.status}: ${errorText}`)
      }

      const result = await response.json()
      console.log("Events API response:", result)

      if (result.success) {
        const eventsData = result.data || []
        console.log("Setting events:", eventsData)

        if (Array.isArray(eventsData)) {
          const validatedEvents = eventsData.map((event) => ({
            ...event,
            status: event.status || "pending",
          }))

          setEvents(validatedEvents)
        } else {
          console.error("Events data is not an array:", eventsData)
          setEvents([])
        }
      } else {
        throw new Error(result.message || "Failed to fetch events")
      }
    } catch (error) {
      console.error("Failed to fetch events:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to load events. Please check your authentication.",
      })

      setEvents([])

      if (error instanceof Error && error.message.includes("401")) {
        localStorage.removeItem("auth_token")
        router.push("/login")
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchEvents()
  }, [statusFilter, eventTypeFilter])

  // Debounce search
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (globalFilter !== undefined) {
        fetchEvents()
      }
    }, 500)

    return () => clearTimeout(timeoutId)
  }, [globalFilter])

  // Define columns for DataTable
  const columns: ColumnDef<Event>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")}
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
      accessorKey: "id",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="p-0 h-auto font-normal"
        >
          Event #
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => (
        <div className="min-w-0">
          <div className="font-semibold text-gray-900 truncate">#{row.original.id}</div>
          <div className="text-xs text-gray-500 sm:hidden truncate">{row.original.name}</div>
        </div>
      ),
    },
    {
      accessorKey: "name",
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
          <div className="font-medium text-gray-900 truncate">{row.original.name}</div>
          <div className="text-xs text-gray-500 truncate">{row.original.email}</div>
        </div>
      ),
    },
    {
      accessorKey: "eventType",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="p-0 h-auto font-normal hidden lg:flex"
        >
          Type
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => <div className="hidden lg:block">{getEventTypeBadge(row.original.eventType)}</div>,
    },
    {
      accessorKey: "status",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="p-0 h-auto font-normal"
        >
          Status
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => getStatusBadge(row.original.status),
    },
    {
      accessorKey: "guests",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="p-0 h-auto font-normal hidden lg:flex"
        >
          Guests
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => <div className="text-sm hidden lg:block font-medium">{row.original.guests} people</div>,
    },
    {
      accessorKey: "preferredDate",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="p-0 h-auto font-normal hidden lg:flex"
        >
          Date
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => (
        <div className="text-sm hidden lg:block">
          {new Date(row.original.preferredDate).toLocaleDateString("en-US", {
            month: "short",
            day: "2-digit",
            year: "numeric",
          })}
        </div>
      ),
    },
    {
      accessorKey: "created_at",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="p-0 h-auto font-normal hidden lg:flex"
        >
          Created
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => (
        <div className="text-sm hidden lg:block">
          {new Date(row.original.created_at).toLocaleDateString("en-US", {
            month: "short",
            day: "2-digit",
            year: "numeric",
          })}
        </div>
      ),
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const event = row.original
        return (
          <div className="flex items-center gap-1">
            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedEvent(event)}
                  className="h-8 w-8 p-0 sm:h-auto sm:w-auto sm:px-2"
                >
                  <Eye className="h-4 w-4" />
                  <span className="ml-1 sr-only sm:not-sr-only hidden sm:inline">View</span>
                </Button>
              </SheetTrigger>
              <SheetContent className="w-full sm:max-w-3xl overflow-y-auto">
                {selectedEvent && (
                  <>
                    <SheetHeader>
                      <SheetTitle>Event Details - #{selectedEvent.id}</SheetTitle>
                      <SheetDescription>Complete information for this event booking</SheetDescription>
                    </SheetHeader>
                    <div className="mt-6 space-y-6">
                      {/* Event Status and Quick Actions */}
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-4 bg-gray-50 rounded-lg">
                        <div>
                          <div className="flex items-center gap-3 mb-2">
                            {getStatusBadge(selectedEvent.status)}
                            {getEventTypeBadge(selectedEvent.eventType)}
                          </div>
                          <p className="text-sm text-gray-600">
                            Event booked on{" "}
                            {new Date(selectedEvent.created_at).toLocaleDateString("en-US", {
                              month: "long",
                              day: "2-digit",
                              year: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </p>
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
                              <p className="font-medium">{selectedEvent.name}</p>
                            </div>
                            <div>
                              <Label className="text-sm font-medium text-gray-500">Email</Label>
                              <p className="text-sm">{selectedEvent.email}</p>
                            </div>
                            {selectedEvent.userId && (
                              <div>
                                <Label className="text-sm font-medium text-gray-500">User ID</Label>
                                <p className="text-sm font-mono">{selectedEvent.userId}</p>
                              </div>
                            )}
                          </CardContent>
                        </Card>

                        {/* Event Information */}
                        <Card>
                          <CardHeader className="pb-3">
                            <h3 className="font-semibold text-lg flex items-center gap-2">
                              <Utensils className="w-5 h-5" />
                              Event Information
                            </h3>
                          </CardHeader>
                          <CardContent className="space-y-3">
                            <div>
                              <Label className="text-sm font-medium text-gray-500">Event Type</Label>
                              <p className="font-medium capitalize">{selectedEvent.eventType}</p>
                            </div>
                            <div>
                              <Label className="text-sm font-medium text-gray-500">Number of Guests</Label>
                              <p className="font-medium">{selectedEvent.guests} people</p>
                            </div>
                            <div>
                              <Label className="text-sm font-medium text-gray-500">Venue Area</Label>
                              <p className="font-medium capitalize">
                                {selectedEvent.venueArea ? selectedEvent.venueArea.replace("_", " ") : "Not specified"}
                              </p>
                            </div>
                          </CardContent>
                        </Card>
                      </div>

                      {/* Date and Time */}
                      <Card>
                        <CardHeader className="pb-3">
                          <h3 className="font-semibold text-lg flex items-center gap-2">
                            <Calendar className="w-5 h-5" />
                            Date & Time
                          </h3>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label className="text-sm font-medium text-gray-500">Preferred Date</Label>
                              <p className="font-medium">
                                {new Date(selectedEvent.preferredDate).toLocaleDateString("en-US", {
                                  month: "long",
                                  day: "numeric",
                                  year: "numeric",
                                })}
                              </p>
                            </div>
                            <div>
                              <Label className="text-sm font-medium text-gray-500">Preferred Time</Label>
                              <p className="font-medium">{selectedEvent.preferredTime}</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </>
                )}
              </SheetContent>
            </Sheet>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Event Actions</DropdownMenuLabel>
                <DropdownMenuSeparator />

                {eventStatuses.map((status) => (
                  <DropdownMenuItem
                    key={status.value}
                    onClick={() => handleStatusUpdate(event.id, status.value)}
                    disabled={updatingStatus === event.id || event.status === status.value}
                  >
                    <status.icon className="mr-2 h-4 w-4" />
                    Mark as {status.label}
                  </DropdownMenuItem>
                ))}

                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => router.push(`/admin/event/${event.id}/edit`)} className="text-red-600">
                  <Edit className="mr-2 h-4 w-4" />
                  Edit Event
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )
      },
    },
  ]

  // Initialize table instance
  const table = useReactTable({
    data: events,
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
      <SidebarProvider defaultOpen={!isMobile}>
        <div className="flex min-h-screen w-full bg-gradient-to-br from-orange-50 to-red-50">
          <AppSidebar />
          <div className={`flex-1 min-w-0 ${isMobile ? "ml-0" : "ml-72"}`}>
            <div className="flex items-center justify-center min-h-screen w-full">
              <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm px-6 py-4 rounded-xl shadow-lg">
                <Loader2 className="h-6 w-6 animate-spin text-orange-500" />
                <span className="text-gray-700 font-medium">Loading events...</span>
              </div>
            </div>
          </div>
        </div>
      </SidebarProvider>
    )
  }

  return (
    <SidebarProvider defaultOpen={!isMobile}>
      <div className="flex min-h-screen w-full bg-gradient-to-br from-orange-50 to-red-50">
        <AppSidebar />
        <div className={`flex-1 min-w-0 ${isMobile ? "ml-0" : "ml-72"}`}>
          {isMobile && (
            <div className="sticky top-0 z-50 flex h-12 items-center gap-2 border-b bg-white/90 backdrop-blur-sm px-4 md:hidden shadow-sm">
              <SidebarTrigger className="-ml-1" />
              <span className="text-sm font-semibold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                Events
              </span>
            </div>
          )}
          <main className="flex-1 overflow-auto p-3 sm:p-4 md:p-6">
            <div className="max-w-full space-y-4 sm:space-y-6">
              {/* Header */}
              <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-orange-100">
                  <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                    イベント管理 Events
                  </h1>
                  <p className="text-sm sm:text-base text-gray-600 mt-1">Manage event bookings and track status</p>
                  <p className="text-xs text-gray-500 mt-1">Showing all events from all customers (Admin View)</p>
                </div>
                <div className="flex items-center gap-4 bg-white/70 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-orange-100">
                  <div className="flex items-center gap-2 text-sm">
                    <Utensils className="w-5 h-5 text-orange-500" />
                    <span className="text-gray-600 font-medium">Total Events:</span>
                    <span className="font-bold text-orange-600 text-lg">{events.length}</span>
                  </div>
                </div>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {eventStatuses.map((status) => {
                  const count = events.filter((event) => event.status === status.value).length
                  const Icon = status.icon
                  return (
                    <Card
                      key={status.value}
                      className="p-4 bg-white/70 backdrop-blur-sm shadow-lg border border-orange-100 hover:shadow-xl transition-all duration-200"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-600">{status.label}</p>
                          <p className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                            {count}
                          </p>
                        </div>
                        <div className="bg-gradient-to-r from-orange-100 to-red-100 p-2 rounded-lg">
                          <Icon className="w-6 h-6 text-orange-600" />
                        </div>
                      </div>
                    </Card>
                  )
                })}
              </div>

              {/* Filters and Search */}
              <Card className="bg-white/70 backdrop-blur-sm shadow-xl border-orange-100">
                <CardHeader className="pb-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-t-lg">
                  <div className="flex flex-col gap-4">
                    <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
                      <div className="relative flex-1 max-w-sm">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/70" />
                        <Input
                          placeholder="Search events..."
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
                            {eventStatuses.map((status) => (
                              <SelectItem key={status.value} value={status.value}>
                                {status.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>

                        <Select value={eventTypeFilter} onValueChange={setEventTypeFilter}>
                          <SelectTrigger className="w-32 bg-white/20 border-white/30 text-white focus:bg-white/30 focus:border-white/50">
                            <SelectValue placeholder="Type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Types</SelectItem>
                            {eventTypes.map((type) => (
                              <SelectItem key={type.value} value={type.value}>
                                {type.label}
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
                    Showing {table.getFilteredRowModel().rows.length} of {events.length} events
                  </div>
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
                          <Utensils className="w-8 h-8 text-orange-500" />
                        </div>
                        <p className="text-lg font-medium text-gray-700">No events found</p>
                        {globalFilter && (
                          <p className="text-sm mt-1 text-gray-500">Try adjusting your search terms or filters</p>
                        )}
                      </div>
                    )}
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
