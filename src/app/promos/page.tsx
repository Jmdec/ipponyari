"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Megaphone, Calendar, Sparkles } from "lucide-react"

interface Announcement {
  id: number
  title: string
  content: string
  is_active: boolean
  created_at: string
}

export default function PromosPage() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<Announcement | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const response = await fetch("/api/announcements")

        if (!response.ok) {
          throw new Error("Failed to fetch announcements")
        }

        const data = await response.json()
        setAnnouncements(Array.isArray(data) ? data : data.data || [])
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const getStatusBadge = (isActive: boolean) => {
    return isActive ? (
      <Badge className="bg-[#ff6b6b]/20 text-white border border-[#ff6b6b]/50 backdrop-blur-sm">Active</Badge>
    ) : (
      <Badge className="bg-white/10 text-white/50 border border-white/20 backdrop-blur-sm">Inactive</Badge>
    )
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#8B0000] via-[#6B0000] to-[#2B0000] py-20 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
        <div className="absolute top-0 left-0 w-96 h-96 bg-[#dc143c]/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#dc143c]/30 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#dc143c]/20 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="text-center mb-16 animate-in fade-in slide-in-from-top duration-700">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-6 py-3 rounded-full border border-white/20 mb-6">
            <Sparkles className="w-5 h-5 text-[#ff6b6b] animate-pulse" />
            <span className="text-white font-semibold text-sm uppercase tracking-wider">Special Offers</span>
          </div>

          <h1 className="text-5xl md:text-6xl font-bold mb-4 text-white drop-shadow-2xl">
            Promotions & <span className="text-[#ff6b6b]">Announcements</span>
          </h1>
          <p className="text-xl text-white/80">Check out our latest deals and special offers</p>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12 animate-in fade-in duration-500">
            <div className="w-12 h-12 border-4 border-[#ff6b6b] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-white/70">Loading promos and announcements...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-12 animate-in fade-in duration-500">
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-8 max-w-md mx-auto">
              <p className="text-[#ff6b6b] text-lg font-semibold">⚠️ Error: {error}</p>
            </div>
          </div>
        )}

        {!loading && !error && (
          <>
            {/* Announcements Grid */}
            {announcements.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
                {announcements.map((announcement, index) => (
                  <Card
                    key={announcement.id}
                    style={{ animationDelay: `${index * 100}ms` }}
                    className="group hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border-white/10 hover:border-white/30 relative cursor-pointer bg-red-700/50 animate-in fade-in zoom-in"
                    onClick={() => setSelectedAnnouncement(announcement)}
                  >
                    <div className="absolute top-4 right-4 z-10">{getStatusBadge(announcement.is_active)}</div>

                    {/* Gradient overlay on hover */}
                    <div className="absolute inset-0 bg-gradient-to-br from-[#ff6b6b]/0 to-[#ff6b6b]/0 group-hover:from-[#ff6b6b]/10 group-hover:to-transparent transition-all duration-300 pointer-events-none"></div>

                    <CardHeader className="relative">
                      <CardTitle className="text-2xl font-bold text-white pr-20 group-hover:text-[#ff6b6b] transition-colors">
                        {announcement.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4 relative">
                      <div className="text-sm text-white/60">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-[#ff6b6b]" />
                          <span>{formatDate(announcement.created_at)}</span>
                        </div>
                      </div>
                      <p className="text-white/70 line-clamp-3 items-baseline">{announcement.content}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 animate-in fade-in zoom-in duration-500">
                <div className="inline-block bg-white/10 backdrop-blur-sm border border-white/20 rounded-3xl p-12">
                  <Megaphone className="w-16 h-16 text-white/50 mx-auto mb-4" />
                  <p className="text-white/70 text-lg">No announcements available</p>
                </div>
              </div>
            )}
          </>
        )}

        {/* Modal for full details */}
        <Dialog open={!!selectedAnnouncement} onOpenChange={(open) => !open && setSelectedAnnouncement(null)}>
          <DialogContent className="max-w-2xl bg-gradient-to-b from-[#8B0000] to-[#6B0000] border-white/20 text-white backdrop-blur-xl">
            <DialogHeader>
              <div className="flex items-center justify-between gap-4">
                <DialogTitle className="text-2xl text-white drop-shadow-lg">{selectedAnnouncement?.title}</DialogTitle>
                {selectedAnnouncement && getStatusBadge(selectedAnnouncement.is_active)}
              </div>
            </DialogHeader>
            <div className="space-y-6">
              <div className="bg-[#ff6b6b]/20 backdrop-blur-sm p-4 rounded-lg border border-[#ff6b6b]/30">
                <div className="flex items-center gap-2">
                  <Megaphone className="w-5 h-5 text-[#ff6b6b] animate-pulse" />
                  <span className="text-sm font-semibold text-white">Special Offer</span>
                </div>
              </div>

              <div className="prose prose-invert max-w-none">
                <p className="text-white/90 whitespace-pre-wrap leading-relaxed">{selectedAnnouncement?.content}</p>
              </div>

              <div className="flex items-center gap-2 text-sm text-white/60 pt-4 border-t border-white/20">
                <Calendar className="w-4 h-4 text-[#ff6b6b]" />
                <span>Posted on {selectedAnnouncement && formatDate(selectedAnnouncement.created_at)}</span>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}