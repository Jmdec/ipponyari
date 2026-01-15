"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { Trash2, Edit2, Plus, ChevronLeft, ChevronRight } from "lucide-react"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { useIsMobile } from "@/hooks/use-mobile"

interface Chef {
  id: number
  name: string
  position: string
  specialty: string
  experience_years: number
  bio: string
  image_url?: string
  rating?: number
  created_at: string
}

const ITEMS_PER_PAGE = 10
const API_URL = process.env.NEXT_PUBLIC_API_URL || ""

export default function ChefsAdmin() {
  const [chefs, setChefs] = useState<Chef[]>([])
  const [loading, setLoading] = useState(true)
  const [isAdding, setIsAdding] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState("")
  const { toast } = useToast()
  const isMobile = useIsMobile()

  const [formData, setFormData] = useState({
    name: "",
    position: "",
    specialty: "",
    experience_years: 0,
    bio: "",
    image: null as File | null,
    rating: 0,
  })

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    try {
      const form = new FormData()
      form.append("name", formData.name)
      form.append("position", formData.position)
      form.append("specialty", formData.specialty)
      form.append("experience_years", formData.experience_years.toString())
      form.append("bio", formData.bio)
      form.append("rating", formData.rating.toString())
      if (formData.image) {
        form.append("image", formData.image)
      }

      const url = editingId ? `${API_URL}/api/chefs/${editingId}` : `${API_URL}/api/chefs`
      const method = editingId ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        body: form,
      })

      if (!response.ok) throw new Error("Failed to save")

      toast({
        title: "Success",
        description: editingId ? "Chef updated successfully" : "Chef created successfully",
      })

      setFormData({
        name: "",
        position: "",
        specialty: "",
        experience_years: 0,
        bio: "",
        image: null,
        rating: 0,
      })
      setEditingId(null)
      setIsAdding(false)
      setCurrentPage(1)
      fetchChefs()
    } catch (error) {
      console.error("Error saving chef:", error)
      toast({
        title: "Error",
        description: "Failed to save chef",
        variant: "destructive",
      })
    }
  }

  async function handleDelete(id: number) {
    if (!confirm("Are you sure you want to delete this chef?")) return

    try {
      const response = await fetch(`${API_URL}/api/chefs/${id}`, {
        method: "DELETE",
      })

      if (!response.ok) throw new Error("Failed to delete")

      toast({
        title: "Success",
        description: "Chef deleted successfully",
      })

      fetchChefs()
    } catch (error) {
      console.error("Error deleting chef:", error)
      toast({
        title: "Error",
        description: "Failed to delete chef",
        variant: "destructive",
      })
    }
  }

  function handleEdit(chef: Chef) {
    setFormData({
      name: chef.name,
      position: chef.position,
      specialty: chef.specialty,
      experience_years: chef.experience_years,
      bio: chef.bio,
      image: null,
      rating: chef.rating || 0,
    })
    setEditingId(chef.id)
    setIsAdding(true)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  async function fetchChefs() {
    try {
      setLoading(true)
      const response = await fetch(`${API_URL}/api/chefs`)
      if (!response.ok) throw new Error("Failed to fetch")
      const data = await response.json()
      setChefs(Array.isArray(data) ? data : data.data || [])
    } catch (error) {
      console.error("Error fetching chefs:", error)
      toast({
        title: "Error",
        description: "Failed to fetch chefs",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchChefs()
  }, [])

  // Filter chefs based on search term
  const filteredChefs = chefs.filter(
    (chef) =>
      chef.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      chef.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
      chef.specialty.toLowerCase().includes(searchTerm.toLowerCase()) ||
      chef.bio.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Pagination
  const totalPages = Math.ceil(filteredChefs.length / ITEMS_PER_PAGE)
  const startIdx = (currentPage - 1) * ITEMS_PER_PAGE
  const endIdx = startIdx + ITEMS_PER_PAGE
  const paginatedChefs = filteredChefs.slice(startIdx, endIdx)

  const handlePreviousPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1))
  }

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
  }

  const getImageUrl = (imageUrl?: string) => {
    if (!imageUrl) return "/placeholder.svg"
    if (imageUrl.startsWith("http")) return imageUrl
    return `${API_URL}${imageUrl}`
  }

  return (
    <SidebarProvider defaultOpen={!isMobile}>
      <AppSidebar />
      <div className="flex-1">
        <div className="flex items-center gap-2 p-4 border-b">
          <SidebarTrigger />
          <h1 className="text-lg font-semibold">Chefs</h1>
        </div>
        <div className="p-8 max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold">Chefs Management</h1>
            <Button
              onClick={() => {
                setIsAdding(!isAdding)
                if (isAdding) {
                  setFormData({
                    name: "",
                    position: "",
                    specialty: "",
                    experience_years: 0,
                    bio: "",
                    image: null,
                    rating: 0,
                  })
                  setEditingId(null)
                }
              }}
            >
              <Plus className="w-4 h-4 mr-2" />
              {isAdding ? "Cancel" : "Add Chef"}
            </Button>
          </div>

          {isAdding && (
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>{editingId ? "Edit Chef" : "Create New Chef"}</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <Input
                    placeholder="Name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                  <Input
                    placeholder="Position"
                    value={formData.position}
                    onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                    required
                  />
                  <Input
                    placeholder="Specialty"
                    value={formData.specialty}
                    onChange={(e) => setFormData({ ...formData, specialty: e.target.value })}
                    required
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      type="number"
                      placeholder="Years of Experience"
                      value={formData.experience_years}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          experience_years: Number.parseInt(e.target.value),
                        })
                      }
                      required
                    />
                    <Input
                      type="number"
                      placeholder="Rating (0-5)"
                      min="0"
                      max="5"
                      step="0.1"
                      value={formData.rating}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          rating: Number.parseFloat(e.target.value),
                        })
                      }
                    />
                  </div>
                  <Textarea
                    placeholder="Bio"
                    value={formData.bio}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    required
                    rows={4}
                  />
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        image: e.target.files?.[0] || null,
                      })
                    }
                  />
                  <Button type="submit" className="w-full">
                    {editingId ? "Update Chef" : "Create Chef"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          )}

          {/* Search Bar */}
          <div className="mb-6">
            <Input
              placeholder="Search by name, position, specialty, or bio..."
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
                <div className="text-center py-8">Loading chefs...</div>
              ) : paginatedChefs.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  {chefs.length === 0 ? "No chefs yet" : "No results found"}
                </div>
              ) : (
                <>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="border-b bg-gray-50">
                        <tr>
                          <th className="text-left py-3 px-4 font-semibold">Image</th>
                          <th className="text-left py-3 px-4 font-semibold">Name</th>
                          <th className="text-left py-3 px-4 font-semibold">Position</th>
                          <th className="text-left py-3 px-4 font-semibold">Specialty</th>
                          <th className="text-left py-3 px-4 font-semibold">Experience</th>
                          <th className="text-left py-3 px-4 font-semibold">Rating</th>
                          <th className="text-left py-3 px-4 font-semibold">Bio</th>
                          <th className="text-left py-3 px-4 font-semibold">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {paginatedChefs.map((chef) => (
                          <tr key={chef.id} className="border-b hover:bg-gray-50">
                            <td className="py-3 px-4">
                              <img
                                src={getImageUrl(chef.image_url)}
                                alt={chef.name}
                                className="w-12 h-12 object-cover rounded"
                              />
                            </td>
                            <td className="py-3 px-4 font-medium">{chef.name}</td>
                            <td className="py-3 px-4 text-gray-600">{chef.position}</td>
                            <td className="py-3 px-4 text-gray-600">{chef.specialty}</td>
                            <td className="py-3 px-4 text-gray-600">{chef.experience_years} years</td>
                            <td className="py-3 px-4">
                              {chef.rating ? (
                                <span className="text-yellow-500">{"★".repeat(Math.round(chef.rating))}</span>
                              ) : (
                                <span className="text-gray-400">-</span>
                              )}
                            </td>
                            <td className="py-3 px-4 text-gray-700 max-w-xs truncate">{chef.bio}</td>
                            <td className="py-3 px-4">
                              <div className="flex gap-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleEdit(chef)}
                                  className="hover:bg-blue-50"
                                >
                                  <Edit2 className="w-4 h-4" />
                                </Button>
                                <Button
                                  variant="destructive"
                                  size="sm"
                                  onClick={() => handleDelete(chef.id)}
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
                      Showing {startIdx + 1} to {Math.min(endIdx, filteredChefs.length)} of{" "}
                      {filteredChefs.length} results
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