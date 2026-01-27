"use client"
import { useState, useEffect } from "react"
import type { MenuItem } from "@/types"
import MenuItemCard from "@/components/ui/menu-item-card"
import { Button } from "@/components/ui/button"
import { Loader2, Download, X, Sparkles, ChefHat, Search } from "lucide-react"
import Image from "next/image"

const ITEMS_PER_PAGE = 12

export default function MenuPage() {
  const [products, setProducts] = useState<MenuItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [selectedCategory, setSelectedCategory] = useState("All")
  const [searchQuery, setSearchQuery] = useState("")
  const [currentPage, setCurrentPage] = useState(1)

  const [deferredPrompt, setDeferredPrompt] = useState<any>(null)
  const [showInstallPopup, setShowInstallPopup] = useState(false)
  const [showInstallButton, setShowInstallButton] = useState(false)

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e)
      setShowInstallButton(true)
      setTimeout(() => {
        setShowInstallPopup(true)
      }, 3000)
    }
    const handleAppInstalled = () => {
      setShowInstallPopup(false)
      setShowInstallButton(false)
      setDeferredPrompt(null)
    }
    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt)
    window.addEventListener("appinstalled", handleAppInstalled)
    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt)
      window.removeEventListener("appinstalled", handleAppInstalled)
    }
  }, [])
  const handleInstallApp = async () => {
    if (!deferredPrompt) return
    deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice
    if (outcome === "accepted") {
      setShowInstallPopup(false)
    }
    setDeferredPrompt(null)
  }
  const handleDismissPopup = () => {
    setShowInstallPopup(false)
  }

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true)
        const res = await fetch("/api/product?paginate=false")
        if (!res.ok) throw new Error("Failed to fetch products")
        const data = await res.json()

        const transformed: MenuItem[] = data.map((p: any) => ({
          id: p.id,
          name: p.name,
          description: p.description,
          price: Number(p.price),
          category: p.category,
          image: p.image,
          isSpicy: p.is_spicy || false,
          isVegetarian: p.is_vegetarian || false,
        }))

        setProducts(transformed)
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  const categories = ["All", ...Array.from(new Set(products.map(p => p.category)))]

  const filtered = products.filter(item => {
    const matchCategory =
      selectedCategory === "All" || item.category === selectedCategory

    const q = searchQuery.toLowerCase()
    const matchSearch =
      item.name.toLowerCase().includes(q) ||
      item.description?.toLowerCase().includes(q)

    return matchCategory && matchSearch
  })

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE)

  const paginatedItems = filtered.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  )

  useEffect(() => {
    setCurrentPage(1)
  }, [selectedCategory, searchQuery])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#8B0000]">
        <Loader2 className="h-10 w-10 animate-spin text-white" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#fff5f5] via-[#ffe8e8] to-[#ffdbdb] flex items-center justify-center">
        <div className="text-center bg-white/90 backdrop-blur-xl px-8 py-6 rounded-2xl border-2 border-[#dc143c]/20 shadow-2xl max-w-md">
          <div className="w-16 h-16 bg-[#dc143c]/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <X className="h-8 w-8 text-[#dc143c]" />
          </div>
          <p className="text-gray-800 font-bold text-xl mb-2">Oops! Something went wrong</p>
          <p className="text-gray-600 text-sm">{error}</p>
          <Button
            onClick={() => window.location.reload()}
            className="mt-4 bg-[#dc143c] hover:bg-[#b01030] text-white"
          >
            Try Again
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#8B0000] via-[#6B0000] to-[#2B0000] relative overflow-hidden">
      {/* Animated background patterns */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
        <div className="absolute top-0 left-0 w-96 h-96 bg-[#dc143c]/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#dc143c]/30 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/4 w-64 h-64 bg-[#dc143c]/20 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>
      {/* Install Button - Mobile Only */}
      {(true || showInstallButton) && (
        <div className="fixed bottom-6 left-4 z-50 md:hidden animate-in slide-in-from-bottom duration-500">
          <Button
            onClick={handleInstallApp}
            className="bg-gradient-to-r from-[#dc143c] to-[#7f0020] hover:from-[#e8324f] hover:to-[#a00028] text-white shadow-2xl hover:shadow-xl transition-all duration-300 rounded-full px-5 py-3 border-2 border-white flex items-center gap-2 hover:scale-105"
            title="Install App"
          >
            <Download className="h-5 w-5 animate-bounce" />
            <span className="text-sm font-semibold">Install App</span>
          </Button>
        </div>
      )}
      {/* Install App Popup */}
      {showInstallPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative bg-white rounded-3xl shadow-2xl max-w-sm w-full overflow-hidden animate-in zoom-in duration-300">
            <button
              onClick={handleDismissPopup}
              className="absolute top-4 right-4 z-10 text-gray-400 hover:text-gray-600 transition-colors bg-white/80 rounded-full p-1 hover:bg-white"
            >
              <X className="h-5 w-5" />
            </button>
            <div className="bg-gradient-to-br from-[#dc143c] to-[#7f0020] pt-10 pb-8 px-6 relative overflow-hidden">
              <div className="absolute inset-0 bg-[url('/pattern.svg')] opacity-10"></div>
              <div className="flex justify-center mb-4 relative">
                <div className="bg-white rounded-3xl shadow-lg overflow-hidden ring-4 ring-white/30">
                  <Image src="/icon-512x512.png" alt="Ipponyari Logo" width={140} height={140} className="object-cover" />
                </div>
              </div>
              <h2 className="text-2xl font-bold text-white text-center mb-2">Install Ipponyari App</h2>
              <p className="text-white/95 text-center text-sm leading-relaxed flex items-center justify-center gap-2">
                <Sparkles className="h-4 w-4" />
                Quick access • Faster ordering • Exclusive offers
              </p>
            </div>
            <div className="p-6 space-y-3">
              <Button
                onClick={handleInstallApp}
                className="w-full bg-gradient-to-r from-[#dc143c] to-[#7f0020] hover:from-[#e8324f] hover:to-[#a00028] text-white py-6 text-base font-semibold rounded-xl shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105"
              >
                <Download className="h-5 w-5 mr-2" />
                Install Now
              </Button>
              <Button
                onClick={handleDismissPopup}
                variant="ghost"
                className="w-full text-gray-600 hover:bg-gray-100 py-3 rounded-xl"
              >
                Maybe Later
              </Button>
            </div>
          </div>
        </div>
      )}
      <div className="max-w-7xl mx-auto p-4 relative z-10">
        {/* Hero Header with Animation */}
        <div className="text-center mb-12 animate-in fade-in slide-in-from-top duration-700">
          <div className="inline-block mb-4">
            <div className="flex items-center gap-3 bg-white/5 backdrop-blur-sm px-6 py-3 rounded-full border border-white/10">
              <ChefHat className="h-5 w-5 text-[#ff6b6b] animate-pulse" />
              <span className="text-[#ff6b6b] font-medium text-xs uppercase tracking-widest">Authentic Japanese Cuisine</span>
            </div>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-2 drop-shadow-2xl animate-in zoom-in duration-500">
            Your Table Awaits
          </h1>
          <h2 className="text-4xl md:text-6xl font-bold text-[#ff6b6b] mb-6 drop-shadow-xl">
            Ipponyari Menu
          </h2>
          <p className="text-white/80 text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
            Reserve your seat today and savor the finest Japanese dishes, prepared fresh daily by our master chefs
          </p>
          {/* Decorative elements */}
          <div className="flex justify-center gap-2 mt-6">
            <div className="w-2 h-2 bg-[#ff6b6b] rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-[#ff6b6b] rounded-full animate-bounce delay-100"></div>
            <div className="w-2 h-2 bg-[#ff6b6b] rounded-full animate-bounce delay-200"></div>
          </div>
        </div>

        {/* Search and Category Filter */}
        <div className="flex flex-col md:flex-row justify-center items-center gap-4 px-4 mb-10">

          {/* Search */}
          <div className="relative w-full max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search dishes..."
              className="w-full rounded-xl bg-white/90 px-11 py-3 text-sm font-medium
              text-[#8B0000] shadow-lg border border-white/30
              focus:outline-none focus:ring-2 focus:ring-[#ff6b6b]"
            />
          </div>

          {/* Category Dropdown */}
          <div className="relative w-full max-w-xs">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full appearance-none rounded-xl bg-white/90 px-5 py-3
              font-semibold text-[#8B0000] shadow-lg border border-white/30
              focus:outline-none focus:ring-2 focus:ring-[#ff6b6b]"
            >
              {categories.map(category => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>

            <div className="pointer-events-none absolute inset-y-0 right-4 flex items-center">
              <svg className="h-4 w-4 text-[#8B0000]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>

        {/* Menu Items */}
        <div className="max-w-7xl mx-auto pb-16">
          {paginatedItems.length === 0 ? (
            <p className="text-center text-white/70">No items found.</p>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 mb-12">
              {paginatedItems.map(item => (
                <div key={item.id} className="transform hover:scale-105 transition-all duration-300">
                  <MenuItemCard key={item.id} item={item} />
                </div>
              ))}
            </div>
          )}

          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-4 mt-12">
              <Button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(p => p - 1)}
                className="rounded-full px-6 disabled:opacity-40 bg-red-700/80 hover:bg-red-600/90 text-white"
              >
                Prev
              </Button>

              <span className="text-white/80 text-sm">
                Page {currentPage} of {totalPages}
              </span>

              <Button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(p => p + 1)}
                className="rounded-full px-6 disabled:opacity-40 bg-red-900/80 hover:bg-red-600/90 text-white"
              >
                Next
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
