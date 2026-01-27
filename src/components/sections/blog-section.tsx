"use client"

import { useEffect, useState } from "react"
import { X, ChevronLeft, ChevronRight } from "lucide-react"

interface BlogPost {
  id: number
  title: string
  excerpt: string
  content: string
  author: string
  created_at: string
  video_url?: string
  thumbnail_url?: string
}

export default function BlogSection() {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null)
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch("/api/blog-posts")
        if (!response.ok) throw new Error("Failed to fetch blog posts")
        const data = await response.json()
        setPosts(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred")
      } finally {
        setLoading(false)
      }
    }

    fetchPosts()
  }, [])

  useEffect(() => {
    if (selectedPost) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "unset"
    }
    return () => {
      document.body.style.overflow = "unset"
    }
  }, [selectedPost])

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % Math.ceil(posts.length / 3))
  }

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + Math.ceil(posts.length / 3)) % Math.ceil(posts.length / 3))
  }

  const visiblePosts = posts.slice(currentIndex * 3, currentIndex * 3 + 3)

  if (loading) {
    return (
      <section className="py-24 bg-[#faf8f5]">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-4 mb-4">
              <div className="w-12 h-px bg-[#c41e3a]" />
              <span className="text-sm font-medium text-[#c41e3a] tracking-[0.2em] uppercase">Kitchen Chronicles</span>
              <div className="w-12 h-px bg-[#c41e3a]" />
            </div>
            <h2 className="text-5xl font-bold mb-4">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-700 to-red-600">
                Latest Stories
              </span>
            </h2>
            <p className="text-lg text-gray-700">
              Discover stories, recipes, and insights from our kitchen
            </p>
            <p className="text-lg text-stone-600 mt-4">Loading stories...</p>
          </div>
          
          <div className="flex justify-center gap-2 mt-6">
            <div className="w-2 h-2 bg-[#ff6b6b] rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-[#ff6b6b] rounded-full animate-bounce delay-100"></div>
            <div className="w-2 h-2 bg-[#ff6b6b] rounded-full animate-bounce delay-200"></div>
          </div>
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section className="py-24 bg-[#faf8f5]">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <div className="bg-white border border-red-200 rounded-lg p-8 text-center">
              <p className="text-red-600 text-lg">⚠️ {error}</p>
            </div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <>
      <section className="py-24 bg-[#faf8f5]">
        <div className="container mx-auto px-4 relative z-10">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-4 mb-4">
              <div className="w-12 h-px bg-[#c41e3a]" />
              <span className="text-sm font-medium text-[#c41e3a] tracking-[0.2em] uppercase">Kitchen Chronicles</span>
              <div className="w-12 h-px bg-[#c41e3a]" />
            </div>
            <h2 className="text-5xl font-bold mb-4">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-700 to-red-600">
                Latest Stories
              </span>
            </h2>
            <p className="text-lg text-gray-700">
              Discover stories, recipes, and insights from our kitchen
            </p>
          </div>

          {/* Blog Posts Carousel */}
          {posts.length > 0 ? (
            <div className="max-w-7xl mx-auto relative z-[100]">
              <div className="flex items-center gap-4">
                {/* Previous Button */}
                {posts.length > 3 && (
                  <button
                    onClick={prevSlide}
                    className="flex-shrink-0 bg-stone-900 hover:bg-stone-800 text-stone-100 rounded-full p-3 md:p-4 transition-all duration-300 hover:scale-110 relative z-[101]"
                    aria-label="Previous posts"
                  >
                    <ChevronLeft className="w-5 h-5 md:w-6 md:h-6" />
                  </button>
                )}

                {/* Cards Grid */}
                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {visiblePosts.map((post) => (
                    <div
                      key={post.id}
                      className="group overflow-hidden rounded-lg border border-stone-200 bg-white hover:shadow-xl transition-all duration-500 hover:-translate-y-1 cursor-pointer"
                      onClick={() => setSelectedPost(post)}
                    >
                      {/* Thumbnail/Video Preview */}
                      <div className="relative h-48 overflow-hidden bg-stone-100">
                        {post.thumbnail_url ? (
                          <img
                            src={`${process.env.NEXT_PUBLIC_API_URL}${post.thumbnail_url}`}
                            alt={post.title}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                            onError={(e) => {
                              e.currentTarget.src = "/placeholder.svg"
                            }}
                          />
                        ) : post.video_url ? (
                          <video
                            src={`${process.env.NEXT_PUBLIC_API_URL}${post.video_url}`}
                            className="w-full h-full object-cover"
                            muted
                            playsInline
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-5xl text-stone-300">
                            文
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-stone-900/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                        {/* Video indicator */}
                        {post.video_url && (
                          <div className="absolute top-3 left-3 bg-stone-900/80 text-stone-100 px-2 py-1 rounded-full text-xs tracking-wide flex items-center gap-1">
                            ▶ Video
                          </div>
                        )}

                        {/* Date badge */}
                        <div className="absolute top-3 right-3 bg-[#c41e3a] text-stone-100 px-2 py-1 rounded-full text-xs tracking-wide">
                          {new Date(post.created_at).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                          })}
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-5">
                        <h3 className="text-lg font-semibold line-clamp-2 group-hover:text-[#c41e3a] transition-colors leading-tight mb-2 text-stone-900">
                          {post.title}
                        </h3>

                        <p className="text-sm text-stone-500 line-clamp-2 leading-relaxed mb-3">{post.excerpt}</p>

                        {/* Author info */}
                        <div className="flex items-center gap-2 pt-3 mb-3 border-t border-stone-100">
                          <div className="w-7 h-7 rounded-full bg-stone-900 flex items-center justify-center text-stone-100 text-xs font-medium">
                            {post.author.charAt(0).toUpperCase()}
                          </div>
                          <p className="text-xs text-stone-600 truncate">{post.author}</p>
                        </div>

                        {/* Read More Link */}
                        <p className="text-[#c41e3a] text-sm font-medium group-hover:underline">Read more →</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Next Button */}
                {posts.length > 3 && (
                  <button
                    onClick={nextSlide}
                    className="flex-shrink-0 bg-stone-900 hover:bg-stone-800 text-stone-100 rounded-full p-3 md:p-4 transition-all duration-300 hover:scale-110 relative z-[101]"
                    aria-label="Next posts"
                  >
                    <ChevronRight className="w-5 h-5 md:w-6 md:h-6" />
                  </button>
                )}
              </div>

              {/* Dots Indicator */}
              {posts.length > 3 && (
                <div className="flex justify-center gap-2 mt-8">
                  {[...Array(Math.ceil(posts.length / 3))].map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentIndex(i)}
                      className={`h-2 rounded-full transition-all duration-300 ${i === currentIndex ? "bg-[#c41e3a] w-8" : "bg-stone-300 hover:bg-stone-400 w-2"
                        }`}
                      aria-label={`Go to slide ${i + 1}`}
                    />
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-20">
              <div className="inline-block p-8 bg-white rounded-lg border border-stone-200">
                <div className="text-7xl mb-6 text-stone-300">筆</div>
                <h2 className="text-2xl font-semibold text-stone-900 mb-3">No Stories Yet</h2>
                <p className="text-stone-500">Check back soon for new content!</p>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Modal */}
      {selectedPost && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedPost(null)}
        >
          <div
            className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header - Video or Thumbnail */}
            <div className="relative h-48 md:h-64 lg:h-80 overflow-hidden bg-stone-100 rounded-t-lg">
              {selectedPost.video_url ? (
                <video
                  src={`${process.env.NEXT_PUBLIC_API_URL}${selectedPost.video_url}`}
                  className="w-full h-full object-cover"
                  controls
                  playsInline
                />
              ) : selectedPost.thumbnail_url ? (
                <img
                  src={`${process.env.NEXT_PUBLIC_API_URL}${selectedPost.thumbnail_url}`}
                  alt={selectedPost.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = "/placeholder.svg"
                  }}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-8xl text-stone-300">文</div>
              )}

              {/* Close button */}
              <button
                onClick={() => setSelectedPost(null)}
                className="absolute top-4 right-4 bg-white/90 hover:bg-white p-2 rounded-full transition-all duration-300 hover:scale-110 z-10"
              >
                <X className="w-6 h-6 text-stone-800" />
              </button>

              {/* Date badge */}
              {!selectedPost.video_url && (
                <div className="absolute top-4 left-4 bg-[#c41e3a] text-stone-100 px-4 py-2 rounded-full text-sm tracking-wide">
                  {new Date(selectedPost.created_at).toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </div>
              )}
            </div>

            {/* Modal Content */}
            <div className="p-6 md:p-8">
              {/* Title */}
              <h2 className="text-2xl md:text-3xl font-semibold text-stone-900 mb-4 leading-tight">
                {selectedPost.title}
              </h2>

              {/* Author info */}
              <div className="flex items-center gap-3 mb-6 pb-6 border-b border-stone-200">
                <div className="w-10 h-10 rounded-full bg-stone-900 flex items-center justify-center text-stone-100 font-medium">
                  {selectedPost.author.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="font-medium text-stone-800">{selectedPost.author}</p>
                  <p className="text-xs text-stone-500">Chef & Writer</p>
                </div>
              </div>

              {/* Excerpt */}
              <div className="mb-6">
                <p className="text-lg text-stone-600 leading-relaxed italic border-l-2 border-[#c41e3a] pl-4">
                  {selectedPost.excerpt}
                </p>
              </div>

              {/* Content */}
              <div className="prose prose-stone max-w-none">
                <p className="text-stone-700 leading-relaxed whitespace-pre-wrap">{selectedPost.content}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
