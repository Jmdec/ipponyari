"use client"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import MenuItemCard from "@/components/ui/menu-item-card"
import type { MenuItem } from "@/types"

export default function FeaturedMenu() {
  const [featuredItems, setFeaturedItems] = useState<MenuItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchFeaturedItems = async () => {
      try {
        setLoading(true)
        setError(null)

        const response = await fetch("/api/product?is_featured=true")

        if (!response.ok) {
          throw new Error(`Failed to fetch featured items: ${response.status}`)
        }

        const data = await response.json()
        setFeaturedItems(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred while fetching featured items")
      } finally {
        setLoading(false)
      }
    }

    fetchFeaturedItems()
  }, [])

  if (loading) {
    return (
      <section className="relative py-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-red-950 via-red-900 to-black">
          <div className="absolute top-20 left-16 w-64 h-64 bg-gradient-to-br from-red-600/30 to-red-800/30 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute top-40 right-24 w-48 h-48 bg-gradient-to-br from-red-700/25 to-red-900/25 rounded-full blur-2xl animate-pulse delay-1000"></div>
          <div className="absolute bottom-32 left-1/4 w-80 h-80 bg-gradient-to-br from-red-500/20 to-red-800/20 rounded-full blur-3xl animate-pulse delay-500"></div>
          <div className="absolute bottom-20 right-1/3 w-56 h-56 bg-gradient-to-br from-red-600/30 to-red-800/30 rounded-full blur-2xl animate-pulse delay-700"></div>
          <div className="absolute top-1/2 left-1/2 w-72 h-72 bg-gradient-to-br from-red-600/15 to-red-800/15 rounded-full blur-3xl animate-pulse delay-300"></div>
          <div className="absolute top-10 right-10 w-40 h-40 bg-gradient-to-br from-red-700/35 to-red-900/35 rounded-full blur-xl animate-pulse delay-200"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4 text-white drop-shadow-sm">
              Featured <span className="text-red-400 drop-shadow-sm">Dishes</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto drop-shadow-sm">
              Loading our most popular Japanese dishes...
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="backdrop-blur-md bg-red-950/40 rounded-2xl p-6 border border-red-800/30 shadow-xl">
                <div className="animate-pulse">
                  <div className="bg-red-900/50 h-48 rounded-lg mb-4"></div>
                  <div className="h-4 bg-red-900/50 rounded mb-2"></div>
                  <div className="h-3 bg-red-900/50 rounded mb-4"></div>
                  <div className="h-4 bg-red-900/50 rounded w-20"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section className="relative py-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-red-950 via-red-900 to-black"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center">
            <h2 className="text-4xl font-bold mb-4 text-white">
              Featured <span className="text-red-400">Dishes</span>
            </h2>
            <p className="text-xl text-red-300 max-w-2xl mx-auto">{error}</p>
          </div>
        </div>
      </section>
    )
  }

  if (featuredItems.length === 0) {
    return (
      <section className="relative py-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-red-950 via-red-900 to-black"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center">
            <h2 className="text-4xl font-bold mb-4 text-white">
              Featured <span className="text-red-400">Dishes</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">No featured dishes available at the moment.</p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="relative py-16 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-red-950 via-red-900 to-black">
        <div className="absolute top-20 left-16 w-64 h-64 bg-gradient-to-br from-red-600/30 to-red-800/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-40 right-24 w-48 h-48 bg-gradient-to-br from-red-700/25 to-red-900/25 rounded-full blur-2xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-32 left-1/4 w-80 h-80 bg-gradient-to-br from-red-500/20 to-red-800/20 rounded-full blur-3xl animate-pulse delay-500"></div>
        <div className="absolute bottom-20 right-1/3 w-56 h-56 bg-gradient-to-br from-red-600/30 to-red-800/30 rounded-full blur-2xl animate-pulse delay-700"></div>
        <div className="absolute top-1/2 left-1/2 w-72 h-72 bg-gradient-to-br from-red-600/15 to-red-800/15 rounded-full blur-3xl animate-pulse delay-300"></div>
        <div className="absolute top-10 right-10 w-40 h-40 bg-gradient-to-br from-red-700/35 to-red-900/35 rounded-full blur-xl animate-pulse delay-200"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4 text-white drop-shadow-sm">
            Featured <span className="text-red-400 drop-shadow-sm">Dishes</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto drop-shadow-sm">
            Discover our most popular Japanese dishes, crafted with authentic flavors and fresh ingredients
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 mb-12">
          {featuredItems.map((item, index) => (
            <div
              key={item.id}
              className="transform hover:scale-105 transition-all duration-300"
              style={{ animationDelay: `${index * 150}ms` }}
            >
              <MenuItemCard item={item} />
            </div>
          ))}
        </div>

        <div className="text-center">
          <div className="inline-block backdrop-blur-md bg-red-950/20 rounded-2xl p-2 border border-red-800/30 shadow-xl">
            <Button
              size="lg"
              className="bg-gradient-to-r from-red-700 via-red-600 to-red-700 hover:from-red-800 hover:via-red-700 hover:to-red-800 px-12 py-6 shadow-2xl text-white font-semibold rounded-xl border-0 backdrop-blur-sm hover:shadow-red-500/25 transition-all duration-300 hover:scale-105"
            >
              <a href="/menu" className="flex items-center gap-2">
                View Full Menu
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}