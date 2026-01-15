"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Megaphone, Plus, Edit, Trash2, Calendar, Eye, EyeOff, Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Switch } from "@/components/ui/switch"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"

interface Announcement {
  id: number
  title: string
  content: string
  is_active: boolean
  created_at: string
}

export default function AdminAnnouncementsPage() {
  const { toast } = useToast()
  const [isMobile, setIsMobile] = useState(false)
  const [announcements, setAnnouncements] = useState<Announcement[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingAnnouncement, setEditingAnnouncement] = useState<Announcement | null>(null)
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    isActive: true,
  })

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  useEffect(() => {
    fetchAnnouncements()
  }, [])

  const fetchAnnouncements = async () => {
    try {
      setIsLoading(true)
      const response = await fetch("/api/announcements", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })
      
      if (!response.ok) {
        throw new Error(`Failed to fetch announcements: ${response.status}`)
      }
      
      const data = await response.json()
      setAnnouncements(Array.isArray(data) ? data : data.data || [])
    } catch (error) {
      console.error("Error fetching announcements:", error)
      toast({
        title: "Error",
        description: "Failed to fetch announcements",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreate = async () => {
    if (!formData.title.trim() || !formData.content.trim()) {
      toast({
        title: "Validation Error",
        description: "Title and content are required",
        variant: "destructive",
      })
      return
    }

    try {
      setIsSubmitting(true)
      const response = await fetch("/api/announcements", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        throw new Error("Failed to create announcement")
      }

      const newAnnouncement = await response.json()
      setAnnouncements([newAnnouncement, ...announcements])
      setIsDialogOpen(false)
      setFormData({ title: "", content: "", isActive: true })
      toast({
        title: "Success",
        description: "Announcement created successfully",
      })
    } catch (error) {
      console.error("Error creating announcement:", error)
      toast({
        title: "Error",
        description: "Failed to create announcement",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEdit = (announcement: Announcement) => {
    setEditingAnnouncement(announcement)
    setFormData({
      title: announcement.title,
      content: announcement.content,
      isActive: announcement.is_active,
    })
    setIsDialogOpen(true)
  }

  const handleUpdate = async () => {
    if (!editingAnnouncement) return

    if (!formData.title.trim() || !formData.content.trim()) {
      toast({
        title: "Validation Error",
        description: "Title and content are required",
        variant: "destructive",
      })
      return
    }

    try {
      setIsSubmitting(true)
      const response = await fetch(`/api/announcements/${editingAnnouncement.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        throw new Error("Failed to update announcement")
      }

      const updatedAnnouncement = await response.json()
      setAnnouncements(
        announcements.map((a) => (a.id === editingAnnouncement.id ? updatedAnnouncement : a))
      )
      setIsDialogOpen(false)
      setEditingAnnouncement(null)
      setFormData({ title: "", content: "", isActive: true })
      toast({
        title: "Success",
        description: "Announcement updated successfully",
      })
    } catch (error) {
      console.error("Error updating announcement:", error)
      toast({
        title: "Error",
        description: "Failed to update announcement",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this announcement?")) return

    try {
      const response = await fetch(`/api/announcements/${id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Failed to delete announcement")
      }

      setAnnouncements(announcements.filter((a) => a.id !== id))
      toast({
        title: "Success",
        description: "Announcement deleted successfully",
      })
    } catch (error) {
      console.error("Error deleting announcement:", error)
      toast({
        title: "Error",
        description: "Failed to delete announcement",
        variant: "destructive",
      })
    }
  }

  const toggleActive = async (announcement: Announcement) => {
    try {
      const response = await fetch(`/api/announcements/${announcement.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: announcement.title,
          content: announcement.content,
          isActive: !announcement.is_active,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to toggle announcement")
      }

      const updatedAnnouncement = await response.json()
      setAnnouncements(
        announcements.map((a) => (a.id === announcement.id ? updatedAnnouncement : a))
      )
      toast({
        title: "Success",
        description: `Announcement ${!announcement.is_active ? "activated" : "deactivated"}`,
      })
    } catch (error) {
      console.error("Error toggling announcement:", error)
      toast({
        title: "Error",
        description: "Failed to toggle announcement status",
        variant: "destructive",
      })
    }
  }

  return (
    <SidebarProvider defaultOpen={!isMobile}>
      <AppSidebar />
      <div className="flex-1">
        <div className="flex items-center gap-2 p-4 border-b">
          <SidebarTrigger />
          <h1 className="text-lg font-semibold">Announcements</h1>
        </div>

        <main className="flex-1 overflow-auto p-6">
          <div className="max-w-6xl mx-auto space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold flex items-center gap-2">
                  <Megaphone className="w-8 h-8 text-orange-600" />
                  Manage Announcements
                </h1>
                <p className="text-gray-600 mt-1">Create and manage customer announcements</p>
              </div>

              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button
                    onClick={() => {
                      setEditingAnnouncement(null)
                      setFormData({ title: "", content: "", isActive: true })
                    }}
                    className="bg-orange-600 hover:bg-orange-700"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    New Announcement
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>
                      {editingAnnouncement ? "Edit Announcement" : "Create New Announcement"}
                    </DialogTitle>
                    <DialogDescription>
                      {editingAnnouncement
                        ? "Update your announcement details"
                        : "Create a new announcement for your customers"}
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="title">Title</Label>
                      <Input
                        id="title"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        placeholder="Enter announcement title"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="content">Content</Label>
                      <Textarea
                        id="content"
                        value={formData.content}
                        onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                        placeholder="Enter announcement content"
                        rows={4}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="isActive">Active</Label>
                      <Switch
                        id="isActive"
                        checked={formData.isActive}
                        onCheckedChange={(checked) =>
                          setFormData({ ...formData, isActive: checked })
                        }
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button
                      onClick={editingAnnouncement ? handleUpdate : handleCreate}
                      disabled={isSubmitting}
                      className="bg-orange-600 hover:bg-orange-700"
                    >
                      {isSubmitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                      {editingAnnouncement ? "Update" : "Create"}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            {/* Announcements List */}
            <div className="space-y-4">
              {isLoading ? (
                <Card>
                  <CardContent className="text-center py-12">
                    <Loader2 className="w-8 h-8 text-orange-600 mx-auto mb-4 animate-spin" />
                    <p className="text-gray-600">Loading announcements...</p>
                  </CardContent>
                </Card>
              ) : announcements.length === 0 ? (
                <Card>
                  <CardContent className="text-center py-12">
                    <Megaphone className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">No announcements yet</p>
                    <p className="text-sm text-gray-500 mt-1">
                      Create your first announcement to get started
                    </p>
                  </CardContent>
                </Card>
              ) : (
                announcements.map((announcement) => (
                  <Card key={announcement.id}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <CardTitle className="text-lg">{announcement.title}</CardTitle>
                            <Badge variant={announcement.is_active ? "default" : "secondary"}>
                              {announcement.is_active ? "Active" : "Inactive"}
                            </Badge>
                          </div>
                          <CardDescription className="flex items-center gap-2 text-sm">
                            <Calendar className="w-4 h-4" />
                            {new Date(announcement.created_at).toLocaleDateString("en-US", {
                              month: "long",
                              day: "2-digit",
                              year: "numeric",
                            })}
                          </CardDescription>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleActive(announcement)}
                          >
                            {announcement.is_active ? (
                              <Eye className="w-4 h-4" />
                            ) : (
                              <EyeOff className="w-4 h-4" />
                            )}
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEdit(announcement)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(announcement.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-700">{announcement.content}</p>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  )
}