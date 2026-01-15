"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { Trash2, Edit2, Plus, ChevronLeft, ChevronRight } from "lucide-react"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { useIsMobile } from "@/hooks/use-mobile"

interface Testimonial {
  id: number
  client_name: string
  client_email: string
  rating: number
  message: string
  status: "pending" | "approved" | "rejected"
  created_at: string
}

const ITEMS_PER_PAGE = 10

export default function TestimonialsAdmin() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [loading, setLoading] = useState(true)
  const [isAdding, setIsAdding] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState("")
  const { toast } = useToast()
  const isMobile = useIsMobile()

  const [formData, setFormData] = useState({
    client_name: "",
    client_email: "",
    rating: 5,
    message: "",
    status: "pending" as "pending" | "approved" | "rejected",
  })

  useEffect(() => {
    fetchTestimonials()
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    try {
      const url = editingId ? `/api/testimonials/${editingId}` : "/api/testimonials"
      const method = editingId ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) throw new Error("Failed to save")

      toast({
        title: "Success",
        description: editingId ? "Testimonial updated successfully" : "Testimonial created successfully",
      })

      setFormData({
        client_name: "",
        client_email: "",
        rating: 5,
        message: "",
        status: "pending",
      })
      setEditingId(null)
      setIsAdding(false)
      setCurrentPage(1)
      fetchTestimonials()
    } catch (error) {
      console.error("Error saving testimonial:", error)
      toast({
        title: "Error",
        description: "Failed to save testimonial",
        variant: "destructive",
      })
    }
  }

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

  function handleEdit(testimonial: Testimonial) {
    setFormData({
      client_name: testimonial.client_name,
      client_email: testimonial.client_email,
      rating: testimonial.rating,
      message: testimonial.message,
      status: testimonial.status,
    })
    setEditingId(testimonial.id)
    setIsAdding(true)
    window.scrollTo({ top: 0, behavior: "smooth" })
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
    <SidebarProvider defaultOpen={!isMobile}>
      <AppSidebar />
      <div className="flex-1">
        <div className="flex items-center gap-2 p-4 border-b">
          <SidebarTrigger />
          <h1 className="text-lg font-semibold">Testimonials</h1>
        </div>
        <div className="p-8 max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold">Testimonials Management</h1>
            <Button
              onClick={() => {
                setIsAdding(!isAdding)
                if (isAdding) {
                  setFormData({
                    client_name: "",
                    client_email: "",
                    rating: 5,
                    message: "",
                    status: "pending",
                  })
                  setEditingId(null)
                }
              }}
            >
              <Plus className="w-4 h-4 mr-2" />
              {isAdding ? "Cancel" : "Add Testimonial"}
            </Button>
          </div>

          {isAdding && (
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>{editingId ? "Edit Testimonial" : "Create New Testimonial"}</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <Input
                    placeholder="Client Name"
                    value={formData.client_name}
                    onChange={(e) => setFormData({ ...formData, client_name: e.target.value })}
                    required
                  />
                  <Input
                    type="email"
                    placeholder="Client Email"
                    value={formData.client_email}
                    onChange={(e) => setFormData({ ...formData, client_email: e.target.value })}
                    required
                  />
                  <div className="flex gap-4">
                    <div className="flex-1">
                      <label className="text-sm font-medium">Rating</label>
                      <Select
                        value={formData.rating.toString()}
                        onValueChange={(value) => setFormData({ ...formData, rating: Number.parseInt(value) })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {[1, 2, 3, 4, 5].map((num) => (
                            <SelectItem key={num} value={num.toString()}>
                              {num} Stars
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex-1">
                      <label className="text-sm font-medium">Status</label>
                      <Select
                        value={formData.status}
                        onValueChange={(value: any) => setFormData({ ...formData, status: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="approved">Approved</SelectItem>
                          <SelectItem value="rejected">Rejected</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <Textarea
                    placeholder="Message"
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    required
                    rows={4}
                  />
                  <Button type="submit" className="w-full">
                    {editingId ? "Update Testimonial" : "Create Testimonial"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          )}

          {/* Search Bar */}
          <div className="mb-6">
            <Input
              placeholder="Search by name, email, or message..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value)
                setCurrentPage(1)
              }}
            />
          </div>

          {/* Data Table */}
          <Card>
            <CardContent className="pt-6">
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
                          <th className="text-left py-3 px-4 font-semibold">Status</th>
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
                            <td className="py-3 px-4">
                              <span
                                className={`inline-block px-2 py-1 text-xs rounded font-medium ${
                                  testimonial.status === "approved"
                                    ? "bg-green-100 text-green-800"
                                    : testimonial.status === "rejected"
                                      ? "bg-red-100 text-red-800"
                                      : "bg-yellow-100 text-yellow-800"
                                }`}
                              >
                                {testimonial.status}
                              </span>
                            </td>
                            <td className="py-3 px-4 text-gray-600">
                              {new Date(testimonial.created_at).toLocaleDateString()}
                            </td>
                            <td className="py-3 px-4">
                              <div className="flex gap-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleEdit(testimonial)}
                                  className="hover:bg-blue-50"
                                >
                                  <Edit2 className="w-4 h-4" />
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
      </div>
    </SidebarProvider>
  )
}