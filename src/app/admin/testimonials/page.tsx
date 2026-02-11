"use client"

import type React from "react"
import Image from "next/image"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { Trash2, X, Edit2, Search, Plus, ChevronLeft, ChevronRight, MoreHorizontal, CheckCheckIcon } from "lucide-react"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"

interface Testimonial {
  id: number
  client_name: string
  client_email: string
  rating: number
  message: string
  status: "pending" | "approved" | "rejected"
  created_at: string
}

const testimonialStatus = [
  { value: "Pending", label: "Pending" },
  { value: "Approved", label: "Approved" },
  { value: "Rejected", label: "Rejected" },
]

const ITEMS_PER_PAGE = 10

export default function TestimonialsAdmin() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [loading, setLoading] = useState(true)
  const [isAdding, setIsAdding] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState("")
  const { toast } = useToast()
  const [overallRating, setOverallRating] = useState<number>(0)
  const [rowStatuses, setRowStatuses] = useState<Record<number, Testimonial["status"]>>({})
  const [ratingCount, setRatingCount] = useState<number>(0)

  const [isDesktop, setIsDesktop] = useState(false)
  useEffect(() => {
    const checkDesktop = () => {
      setIsDesktop(window.innerWidth < 1024) // lg breakpoint
    }
    checkDesktop()
    window.addEventListener("resize", checkDesktop)
    return () => window.removeEventListener("resize", checkDesktop)
  }, [])

  const [formData, setFormData] = useState({
    status: "pending" as "pending" | "approved" | "rejected",
  })

  useEffect(() => {
    fetchTestimonials()
  }, [])

  useEffect(() => {
    const initialStatuses: Record<number, Testimonial["status"]> = {}
    testimonials.forEach((t) => {
      initialStatuses[t.id] = t.status
    })
    setRowStatuses(initialStatuses)
  }, [testimonials])

  async function handleDelete(id: number) {
    if (!confirm("Are you sure you want to delete this testimonial?")) return

    try {
      const response = await fetch(`/api/testimonials/${id}`, {
        method: "DELETE",
      })

      if (!response.ok) throw new Error("Failed to delete")

      toast({
        title: "Success",
        description: "Testimonial deleted successfully",
      })

      fetchTestimonials()
    } catch (error) {
      console.error("Error deleting testimonial:", error)
      toast({
        title: "Error",
        description: "Failed to delete testimonial",
        variant: "destructive",
      })
    }
  }

  async function fetchTestimonials() {
    try {
      setLoading(true)
      const response = await fetch("/api/testimonials")
      if (!response.ok) throw new Error("Failed to fetch")
      const data = await response.json()
      setTestimonials(Array.isArray(data) ? data : data.data || [])
    } catch (error) {
      console.error("Error fetching testimonials:", error)
      toast({
        title: "Error",
        description: "Failed to fetch testimonials",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (testimonials.length === 0) {
      setOverallRating(0)
      setRatingCount(0)
      return
    }

    const totalRating = testimonials.reduce(
      (sum, testimonial) => sum + testimonial.rating,
      0
    )

    const average = totalRating / testimonials.length

    setOverallRating(Number(average.toFixed(1)))
    setRatingCount(testimonials.length)
  }, [testimonials])

  // Filter testimonials based on search term
  const filteredTestimonials = testimonials.filter(
    (t) =>
      t.client_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.client_email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.message.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Pagination
  const totalPages = Math.ceil(filteredTestimonials.length / ITEMS_PER_PAGE)
  const startIdx = (currentPage - 1) * ITEMS_PER_PAGE
  const endIdx = startIdx + ITEMS_PER_PAGE
  const paginatedTestimonials = filteredTestimonials.slice(startIdx, endIdx)

  const handlePreviousPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1))
  }

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
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

          <main className="p-8 max-w-7xl mx-auto">
            <div className="max-w-full space-y-4 sm:space-y-6">
              {/* Header */}
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div>
                  <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Testimonials Management</h1>
                  <p className="text-gray-600 mt-1">Manage what says about your restaurant</p>
                </div>

                <div>
                  <Card className="p-4">
                    <CardContent>
                      <div>
                        <p className="text-lg font-semibold">Overall Rating</p>
                        <h2 className="text-3xl font-bold text-yellow-500 flex items-center gap-2">
                          {overallRating}
                          <span className="text-xl">
                            {"★".repeat(Math.round(overallRating))}
                          </span>
                        </h2>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>

              <Card className="bg-white/70 backdrop-blur-sm shadow-xl p-0 pb-5 border-red-100">
                <CardHeader className="p-3 bg-gradient-to-r from-red-500 to-red-500 text-white rounded-t-lg">
                  <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-start">
                      <div className="relative flex-1 max-w-sm">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-red-800" />
                        <Input
                          placeholder="Search by name, email, or message..."
                          value={searchTerm}
                          onChange={(e) => {
                            setSearchTerm(e.target.value)
                            setCurrentPage(1)
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </CardHeader>

                <CardContent>
                  {loading ? (
                    <div className="text-center py-8">Loading testimonials...</div>
                  ) : paginatedTestimonials.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      {testimonials.length === 0 ? "No testimonials yet" : "No results found"}
                    </div>
                  ) : (
                    <>
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead className="border-b bg-gray-50">
                            <tr>
                              <th className="text-left py-3 px-4 font-semibold">Name</th>
                              <th className="text-left py-3 px-4 font-semibold">Email</th>
                              <th className="text-left py-3 px-4 font-semibold">Rating</th>
                              <th className="text-left py-3 px-4 font-semibold">Message</th>
                              <th className="text-left py-3 px-4 font-semibold">Date</th>
                              <th className="text-left py-3 px-4 font-semibold">Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {paginatedTestimonials.map((testimonial) => (
                              <tr key={testimonial.id} className="border-b hover:bg-gray-50">
                                <td className="py-3 px-4 font-medium">{testimonial.client_name}</td>
                                <td className="py-3 px-4 text-gray-600">{testimonial.client_email}</td>
                                <td className="py-3 px-4">
                                  <span className="text-yellow-500">{"★".repeat(testimonial.rating)}</span>
                                </td>
                                <td className="py-3 px-4 text-gray-700 max-w-xs truncate">{testimonial.message}</td>
                                <td className="py-3 px-4 text-gray-600">
                                  {new Date(testimonial.created_at).toLocaleDateString()}
                                </td>
                                <td className="py-3 px-4">
                                  <div className="flex items-center gap-2">
                                    <Select
                                      value={rowStatuses[testimonial.id]}
                                      onValueChange={(val: Testimonial["status"]) =>
                                        setRowStatuses((prev) => ({ ...prev, [testimonial.id]: val }))
                                      }
                                    >
                                      <SelectTrigger className="w-28">
                                        <SelectValue />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="pending">Pending</SelectItem>
                                        <SelectItem value="approved">Approved</SelectItem>
                                        <SelectItem value="rejected">Rejected</SelectItem>
                                      </SelectContent>
                                    </Select>

                                    <Button
                                      size="sm"
                                      variant="default"
                                      onClick={async () => {
                                        const statusToUpdate = rowStatuses[testimonial.id]
                                        try {
                                          const response = await fetch(`/api/testimonials/${testimonial.id}`, {
                                            method: "PUT",
                                            headers: { "Content-Type": "application/json" },
                                            body: JSON.stringify({ status: statusToUpdate }),
                                          })

                                          const data = await response.json()
                                          if (!response.ok) throw new Error(data.error || "Failed to update status")

                                          toast({
                                            title: "Success",
                                            description: "Status updated successfully",
                                          })

                                          setTestimonials((prev) =>
                                            prev.map((t) =>
                                              t.id === testimonial.id ? { ...t, status: statusToUpdate } : t
                                            )
                                          )
                                        } catch (error: any) {
                                          console.error(error)
                                          toast({
                                            title: "Error",
                                            description: error.message || "Failed to update status",
                                            variant: "destructive",
                                          })
                                        }
                                      }}
                                    >
                                      Save
                                    </Button>

                                    <Button
                                      variant="destructive"
                                      size="sm"
                                      onClick={() => handleDelete(testimonial.id)}
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </Button>
                                  </div>
                                </td>

                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>

                      {/* Pagination */}
                      <div className="flex items-center justify-between mt-6 pt-4 border-t">
                        <div className="text-sm text-gray-600">
                          Showing {startIdx + 1} to {Math.min(endIdx, filteredTestimonials.length)} of{" "}
                          {filteredTestimonials.length} results
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={handlePreviousPage}
                            disabled={currentPage === 1}
                          >
                            <ChevronLeft className="w-4 h-4" />
                          </Button>
                          <div className="flex items-center gap-2">
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                              <Button
                                key={page}
                                variant={currentPage === page ? "default" : "outline"}
                                size="sm"
                                onClick={() => setCurrentPage(page)}
                                className="w-8 h-8 p-0"
                              >
                                {page}
                              </Button>
                            ))}
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={handleNextPage}
                            disabled={currentPage === totalPages}
                          >
                            <ChevronRight className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider >
  )
}