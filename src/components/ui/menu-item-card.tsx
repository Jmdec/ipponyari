"use client"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Plus, Flame, Leaf, X, ShoppingCart, Loader2 } from "lucide-react"
import { useCartStore } from "@/store/cartStore"
import { useAuthStore } from "@/store/authStore"
import { toast } from "@/hooks/use-toast"
import type { MenuItem } from "@/types"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

interface MenuItemCardProps {
  item: MenuItem
}

const getImageUrl = (imagePath: unknown): string => {
  if (typeof imagePath !== "string" || imagePath.trim() === "") {
    return "/placeholder.svg"
  }

  if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
    return imagePath
  }

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"
  let fullPath = imagePath
  if (!imagePath.startsWith("images/products/")) {
    fullPath = `images/products/${imagePath}`
  }

  return `${API_BASE_URL}/${fullPath}`
}

export default function MenuItemCard({ item }: MenuItemCardProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [products, setProducts] = useState<MenuItem[]>([])
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const addItem = useCartStore((state) => state.addItem)
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn)
  const router = useRouter()

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

  const formatPrice = (price: number | string): string => {
    const numPrice = typeof price === "number" ? price : Number.parseFloat(String(price))
    return numPrice.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
  }

  const handleAddToCart = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault()
      e.stopPropagation()
    }

    if (!isLoggedIn) {
      toast({
        title: "Please log in",
        description: "You need to be logged in to add items to your cart.",
        variant: "destructive",
      })
      router.push("/login")
      return
    }

    addItem(item)
    toast({
      title: "Added to cart!",
      description: `${item.name} has been added to your cart.`,
    })
  }

  const isSpicy = item.isSpicy || item.is_spicy || false
  const isVegetarian = item.isVegetarian || item.is_vegetarian || false

  if (loading) {
    return (
      <div className="group bg-gradient-to-br from-black via-red-950/20 to-black border border-red-800/50 
            rounded-xl overflow-hidden hover:border-red-600/80 transition-all duration-300 
            shadow-lg hover:shadow-2xl hover:shadow-red-900/40 hover:-translate-y-1 justify-center items-center
            relative flex flex-col h-full min-h-[30vh] md:min-h-[40vh] lg:min-h-[50vh] cursor-pointer">
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
    <Dialog>
      <DialogTrigger>
        <div className="group bg-gradient-to-br from-black via-red-950/20 to-black border border-red-800/50 
            rounded-xl overflow-hidden hover:border-red-600/80 transition-all duration-300 
            shadow-lg hover:shadow-2xl hover:shadow-red-900/40 hover:-translate-y-1
            relative flex flex-col h-full min-h-[30vh] md:min-h-[40vh] lg:min-h-[50vh] cursor-pointer">

          <div className="absolute top-2 left-2 z-10 flex gap-1">
            <Badge
              variant="secondary"
              className="bg-red-600 text-white text-[9px] sm:text-[10px] px-1.5 py-0.5 border border-red-700 font-semibold"
            >
              {item.category}
            </Badge>


            <div className="absolute top-2 right-2 z-10 flex-col gap-1 hidden sm:flex">
              {isSpicy && (
                <Badge
                  variant="destructive"
                  className="bg-red-500 text-white text-[9px] px-1 py-0 border border-red-600"
                >
                  <Flame className="w-2.5 h-2.5 mr-0.5" />
                  Hot
                </Badge>
              )}
              {isVegetarian && (
                <Badge
                  variant="secondary"
                  className="bg-green-600 text-white text-[9px] px-1 py-0 border border-green-700"
                >
                  <Leaf className="w-2.5 h-2.5 mr-0.5" />
                  Veg
                </Badge>
              )}
            </div>
          </div>

          <div className="flex flex-col h-full">
            {/* Image Section */}
            <div className="w-full h-[55%] flex-shrink-0 overflow-hidden bg-black relative">
              <Image
                src={getImageUrl(item.image) || "/placeholder.svg"}
                alt={item.name}
                width={300}
                height={300}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
            </div>

            {/* Content Section */}
            <div className="h-[45%] p-3 sm:p-4 flex flex-col justify-between overflow-hidden">
              <div className="min-h-0">

                {/* Title */}
                <h3 className="h-[60px] md:h-[30px] text-xl font-bold text-white mb-0.5 line-clamp-2">
                  {item.name}
                </h3>

                {/* Description */}
                <p className="hidden md:block text-sm text-gray-300 line-clamp-1">
                  {item.description}
                </p>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between gap-1.5 py-2 mt-2">
                <span className="text-2xl font-bold text-red-200 flex-shrink-0 whitespace-nowrap">
                  ₱{formatPrice(item.price)}
                </span>

                <Button
                  onClick={handleAddToCart}
                  size="icon"
                  className="bg-red-600 hover:bg-red-700 text-white border border-red-700 transition-all duration-300 hover:scale-105 text-[10px] sm:text-xs px-2 py-1 h-auto flex-shrink-0"
                >
                  <ShoppingCart className="w-4 h-4 m-1" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DialogTrigger>

      {/* Modal Dialog */}
      <DialogContent className="max-w-[95vw] md:max-w-xl lg:max-w-3xl max-h-[90vh] overflow-y-auto bg-gradient-to-br from-[#1a1a1a] to-[#2d0011] border border-red-800/50 p-4 sm:p-6 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
        <DialogHeader className="relative pr-8 mb-4">
          <DialogTitle className="text-xl sm:text-2xl md:text-3xl font-bold text-white">
            {item.name}
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col lg:flex-row gap-4 md:gap-6 lg:gap-8">
          {/* Image */}
          <div className="w-full lg:w-2/5 flex-shrink-0">
            <div className="relative w-full aspect-square rounded-xl overflow-hidden border-2 border-red-600/50 shadow-lg bg-black">
              <Image
                src={getImageUrl(item.image) || "/placeholder.svg"}
                alt={item.name}
                width={500}
                height={500}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
            </div>
          </div>

          {/* Details */}
          <div className="flex-1 flex flex-col justify-between">
            <div>
              {/* Badges */}
              <div className="mb-4 md:mb-6">
                <h4 className="text-xs sm:text-sm font-semibold text-red-400 mb-2 uppercase tracking-wide">
                  Category
                </h4>
                <Badge className="bg-gray-100 text-red-800 border border-red-700 text-xs sm:text-sm">
                  {item.category}
                </Badge>
                {isSpicy && (
                  <Badge className="bg-red-500 text-white border border-red-600 flex items-center gap-1 text-xs sm:text-sm">
                    <Flame className="w-3 h-3 sm:w-4 sm:h-4" />
                    Spicy
                  </Badge>
                )}
                {isVegetarian && (
                  <Badge className="bg-green-600 text-white border border-green-700 flex items-center gap-1 text-xs sm:text-sm">
                    <Leaf className="w-3 h-3 sm:w-4 sm:h-4" />
                    Vegetarian
                  </Badge>
                )}
              </div>
              {/* Description */}
              <div className="mb-4 md:mb-6">
                <h4 className="text-xs sm:text-sm font-semibold text-red-400 mb-2 uppercase tracking-wide">
                  Description
                </h4>
                <p className="text-gray-300 leading-relaxed text-sm md:text-base">
                  {item.description}
                </p>
              </div>

              <div className="flex gap-4 md:gap-6 justify-center items-end md:justify-between md:items-center flex-wrap">
                {/* Price */}
                <div className="mb-6 md:mb-8">
                  <p className="text-xs sm:text-sm text-gray-400 mb-1">Price</p>
                  <span className="text-2xl sm:text-3xl md:text-4xl font-bold text-red-400">
                    ₱{formatPrice(item.price)}
                  </span>
                </div>

                {/* Action Button */}
                <div>
                  <Button
                    onClick={handleAddToCart}
                    className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 sm:py-4 md:py-4 text-sm md:text-lg border border-red-700 transition-all duration-300 hover:scale-[1.02]"
                  >
                    <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
                    Add to Cart
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}