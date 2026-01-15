"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { Trash2, Edit2, Plus, X } from "lucide-react"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { useIsMobile } from "@/hooks/use-mobile"

interface BlogPost {
  id: number
  title: string
  excerpt: string
  content: string
  author: string
  image_url?: string
  created_at: string
}

export default function BlogPostsAdmin() {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const [isAdding, setIsAdding] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const { toast } = useToast()
  const isMobile = useIsMobile()

  const [formData, setFormData] = useState({
    title: "",
    excerpt: "",
    content: "",
    author: "",
    image: null as File | null,
  })

  useEffect(() => {
    fetchPosts()
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    try {
      const form = new FormData()
      form.append("title", formData.title)
      form.append("excerpt", formData.excerpt)
      form.append("content", formData.content)
      form.append("author", formData.author)
      if (formData.image) {
        form.append("image", formData.image)
      }

      const url = editingId ? `/api/blog-posts/${editingId}` : "/api/blog-posts"
      const method = editingId ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        body: form,
      })

      if (!response.ok) throw new Error("Failed to save")

      toast({
        title: "Success",
        description: editingId ? "Blog post updated successfully" : "Blog post created successfully",
      })

      setFormData({ title: "", excerpt: "", content: "", author: "", image: null })
      setEditingId(null)
      setIsAdding(false)
      fetchPosts()
    } catch (error) {
      console.error("Error saving post:", error)
      toast({
        title: "Error",
        description: "Failed to save blog post",
        variant: "destructive",
      })
    }
  }

  async function handleDelete(id: number) {
    if (!confirm("Are you sure you want to delete this post?")) return

    try {
      const response = await fetch(`/api/blog-posts/${id}`, {
        method: "DELETE",
      })

      if (!response.ok) throw new Error("Failed to delete")

      toast({
        title: "Success",
        description: "Blog post deleted successfully",
      })

      fetchPosts()
    } catch (error) {
      console.error("Error deleting post:", error)
      toast({
        title: "Error",
        description: "Failed to delete blog post",
        variant: "destructive",
      })
    }
  }

  function handleEdit(post: BlogPost) {
    setFormData({
      title: post.title,
      excerpt: post.excerpt,
      content: post.content,
      author: post.author,
      image: null,
    })
    setEditingId(post.id)
    setIsAdding(true)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  async function fetchPosts() {
    try {
      setLoading(true)
      const response = await fetch("/api/blog-posts")
      if (!response.ok) throw new Error("Failed to fetch")
      const data = await response.json()
      setPosts(data)
    } catch (error) {
      console.error("Error fetching posts:", error)
      toast({
        title: "Error",
        description: "Failed to fetch blog posts",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <SidebarProvider defaultOpen={!isMobile}>
        <AppSidebar />
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading blog posts...</p>
          </div>
        </div>
      </SidebarProvider>
    )
  }

  return (
    <SidebarProvider defaultOpen={!isMobile}>
      <AppSidebar />
      <div className="flex-1 flex flex-col">
        <div className="flex items-center gap-2 p-4 border-b bg-background">
          <SidebarTrigger />
          <h1 className="text-lg font-semibold">Blog Posts</h1>
        </div>

        <div className="flex-1 overflow-auto">
          <div className="p-6 md:p-8 max-w-5xl mx-auto">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-foreground">Blog Posts</h1>
                <p className="text-muted-foreground mt-1">Manage and create your blog content</p>
              </div>
              <Button
                onClick={() => {
                  setIsAdding(!isAdding)
                  if (isAdding) {
                    setFormData({ title: "", excerpt: "", content: "", author: "", image: null })
                    setEditingId(null)
                  }
                }}
                size="lg"
                className="w-full md:w-auto"
              >
                <Plus className="w-4 h-4 mr-2" />
                {isAdding ? "Cancel" : "New Post"}
              </Button>
            </div>

            {/* Form */}
            {isAdding && (
              <Card className="mb-8 border-2">
                <CardHeader className="border-b bg-muted/50">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-2xl">{editingId ? "Edit Post" : "Create New Post"}</CardTitle>
                    <button
                      onClick={() => {
                        setIsAdding(false)
                        setFormData({ title: "", excerpt: "", content: "", author: "", image: null })
                        setEditingId(null)
                      }}
                      className="text-muted-foreground hover:text-foreground"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </CardHeader>
                <CardContent className="pt-6">
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground">Title</label>
                        <Input
                          placeholder="Enter post title"
                          value={formData.title}
                          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                          required
                          className="h-10"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground">Author</label>
                        <Input
                          placeholder="Enter author name"
                          value={formData.author}
                          onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                          required
                          className="h-10"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground">Excerpt</label>
                      <Textarea
                        placeholder="Short summary of your post (appears in previews)"
                        value={formData.excerpt}
                        onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                        required
                        rows={3}
                        className="resize-none"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground">Content</label>
                      <Textarea
                        placeholder="Full blog post content"
                        value={formData.content}
                        onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                        required
                        rows={8}
                        className="resize-none font-mono text-sm"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground">Featured Image</label>
                      <div className="border-2 border-dashed border-muted-foreground/30 rounded-lg p-6 text-center hover:border-muted-foreground/50 transition-colors cursor-pointer">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              image: e.target.files?.[0] || null,
                            })
                          }
                          className="hidden"
                          id="image-upload"
                        />
                        <label htmlFor="image-upload" className="cursor-pointer block">
                          <p className="text-sm font-medium text-foreground">
                            {formData.image ? formData.image.name : "Click to upload or drag and drop"}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">PNG, JPG, GIF up to 10MB</p>
                        </label>
                      </div>
                    </div>

                    <div className="flex gap-3 pt-4">
                      <Button type="submit" size="lg" className="flex-1">
                        {editingId ? "Update Post" : "Create Post"}
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="lg"
                        onClick={() => {
                          setIsAdding(false)
                          setFormData({ title: "", excerpt: "", content: "", author: "", image: null })
                          setEditingId(null)
                        }}
                      >
                        Cancel
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            )}

            {/* Posts List */}
            <div className="space-y-4">
              {posts.length === 0 ? (
                <Card className="border-dashed">
                  <CardContent className="pt-12 pb-12 text-center">
                    <p className="text-muted-foreground mb-4">No blog posts yet</p>
                    <Button onClick={() => setIsAdding(true)}>Create your first post</Button>
                  </CardContent>
                </Card>
              ) : (
                posts.map((post) => (
                  <Card key={post.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="pt-6">
                      <div className="flex flex-col md:flex-row gap-6">
                       {post.image_url && (
                          <img
                            src={`${process.env.NEXT_PUBLIC_API_URL}${post.image_url}`}
                            alt={post.title}
                            className="w-full md:w-32 h-32 object-cover rounded-lg flex-shrink-0"
                            onError={(e) => {
                              e.currentTarget.src = "/placeholder.svg"
                            }}
                          />
                        )}
                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold text-lg text-foreground line-clamp-2">{post.title}</h3>
                          <p className="text-sm text-muted-foreground mb-2">By {post.author}</p>
                          <p className="text-sm text-foreground line-clamp-2 mb-3">{post.excerpt}</p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(post.created_at).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="flex gap-2 flex-shrink-0">
                          <Button variant="outline" size="sm" onClick={() => handleEdit(post)}>
                            <Edit2 className="w-4 h-4" />
                          </Button>
                          <Button variant="destructive" size="sm" onClick={() => handleDelete(post.id)}>
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </SidebarProvider>
  )
}
