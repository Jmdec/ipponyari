"use client"
import { useState, useEffect } from "react"
import type { MenuItem } from "@/types"
import MenuItemCard from "@/components/ui/menu-item-card"
import { Button } from "@/components/ui/button"
import { Loader2, Download, X, Sparkles, ChefHat } from "lucide-react"
import Image from "next/image"

export default function MenuPage() {
  const [products, setProducts] = useState<MenuItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedCategory, setSelectedCategory] = useState("All")

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
        setError(null)

        const response = await fetch("/api/product?paginate=false")
        if (!response.ok) throw new Error("Failed to fetch products")
        const data = await response.json()

        const transformedProducts: MenuItem[] = data.map((product: any) => ({
          id: product.id,
          name: product.name,
          description: product.description,
          price: typeof product.price === "string" ? Number.parseFloat(product.price) : product.price,
          category: product.category,
          image: product.image,
          isSpicy: product.is_spicy || false,
          isVegetarian: product.is_vegetarian || false,
        }))

        setProducts(transformedProducts)
      } catch (err) {
        console.error(err)
        setError(err instanceof Error ? err.message : "Failed to fetch products")
        setProducts([])
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  const categories = ["All", ...Array.from(new Set(products.map((p) => p.category)))]
  const filtered = selectedCategory === "All" ? products : products.filter((p) => p.category === selectedCategory)

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#fff5f5] via-[#ffe8e8] to-[#ffdbdb] flex items-center justify-center relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-32 h-32 bg-[#dc143c]/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-40 h-40 bg-[#dc143c]/10 rounded-full blur-3xl animate-pulse delay-700"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-[#dc143c]/5 rounded-full blur-3xl animate-pulse delay-300"></div>
        </div>

        <div className="flex flex-col items-center gap-4 bg-white/90 backdrop-blur-xl px-8 py-6 rounded-2xl border-2 border-[#dc143c]/20 shadow-2xl relative z-10">
          <ChefHat className="h-12 w-12 text-[#dc143c] animate-bounce" />
          <div className="flex items-center gap-3">
            <Loader2 className="h-6 w-6 animate-spin text-[#dc143c]" />
            <span className="text-gray-700 font-semibold text-lg">Preparing your menu...</span>
          </div>
          <div className="flex gap-1">
            <div className="w-2 h-2 bg-[#dc143c] rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-[#dc143c] rounded-full animate-bounce delay-100"></div>
            <div className="w-2 h-2 bg-[#dc143c] rounded-full animate-bounce delay-200"></div>
          </div>
        </div>
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

        {/* Enhanced Category Filters */}
        <div className="flex flex-wrap justify-center gap-3 mb-10 animate-in fade-in slide-in-from-bottom duration-700 delay-200">
          {categories.map((category, index) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              onClick={() => setSelectedCategory(category)}
              style={{ animationDelay: `${index * 50}ms` }}
              className={`${
                selectedCategory === category
                  ? "bg-white text-[#8B0000] hover:bg-white/90 shadow-lg scale-105 border-2 border-white"
                  : "bg-white/10 backdrop-blur-sm text-white border-2 border-white/30 hover:bg-white/20 hover:border-white hover:scale-105"
              } transition-all duration-300 font-semibold px-6 py-3 rounded-full shadow-md hover:shadow-xl animate-in zoom-in`}
            >
              {category}
            </Button>
          ))}
        </div>

        {/* Menu Items Grid */}
        {filtered.length === 0 ? (
          <div className="text-center py-20 animate-in fade-in duration-500">
            <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-12 max-w-md mx-auto shadow-xl border-2 border-white/20">
              <ChefHat className="h-16 w-16 text-white/50 mx-auto mb-4" />
              <p className="text-white text-lg font-medium mb-2">
                {selectedCategory === "All" ? "No menu items available" : `No items in ${selectedCategory}`}
              </p>
              <p className="text-white/70 text-sm">Check back soon for delicious updates!</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6 auto-rows-fr">
            {filtered.map((product, index) => (
              <div
                key={product.id}
                style={{ animationDelay: `${index * 50}ms` }}
                className="animate-in fade-in zoom-in duration-500"
              >
                <MenuItemCard item={product} />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Floating decoration elements */}
      <div className="fixed bottom-10 right-10 pointer-events-none opacity-10 hidden lg:block">
        <ChefHat className="h-32 w-32 text-white animate-pulse" />
      </div>
    </div>
  )
}