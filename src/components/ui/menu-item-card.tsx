"use client"

import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog"
import { Plus, Flame, Leaf, ShoppingCart, X } from "lucide-react"
import { useCartStore } from "@/store/cartStore"
import { useAuthStore } from "@/store/authStore"
import { toast } from "@/hooks/use-toast"
import type { MenuItem } from "@/types"
import { useRouter } from "next/navigation"

interface MenuItemCardProps {
  item: MenuItem
}

const getImageUrl = (imagePath: unknown): string => {
  if (typeof imagePath !== "string" || imagePath.trim() === "") {
    return "/placeholder.svg"
  }

  if (imagePath.startsWith("http")) return imagePath

  const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

  return imagePath.startsWith("images/products/")
    ? `${API_BASE_URL}/${imagePath}`
    : `${API_BASE_URL}/images/products/${imagePath}`
}

export default function MenuItemCard({ item }: MenuItemCardProps) {
  const addItem = useCartStore((state) => state.addItem)
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn)
  const router = useRouter()

  const formatPrice = (price: number | string) =>
    Number(price).toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })

  const handleAddToCart = () => {
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

  const isSpicy = item.isSpicy || item.is_spicy
  const isVegetarian = item.isVegetarian || item.is_vegetarian

  return (
    <Dialog>
      <div className="relative">
        <Badge
          onPointerDown={(e) => e.stopPropagation()}
          className="absolute top-2 left-2 z-20
          bg-red-900 text-red-200 border border-red-700
          text-xs sm:text-sm pointer-events-auto"
        >
          {item.category}
        </Badge>
      </div> 

      <DialogTrigger asChild>
        <div
          className="group cursor-pointer bg-gradient-to-br from-black via-red-950/20 to-black
          border border-red-800/50 rounded-xl overflow-hidden
          transition-all duration-300 hover:border-red-600/80 hover:-translate-y-1
          shadow-lg hover:shadow-red-900/40 flex flex-col min-h-[420px]"
        >

          {/* Image */}
          <div className="relative w-full aspect-[4/3] overflow-hidden bg-black">
            <Image
              src={getImageUrl(item.image)}
              alt={item.name}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              className="object-cover transition-transform duration-500 group-hover:scale-110"
              placeholder="blur"
              blurDataURL="/placeholder.svg"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
          </div>

          {/* Content */}
          <div className="flex flex-col justify-between p-4 flex-1">
            <div>
              <h3 className="text-lg font-semibold text-white line-clamp-2">
                {item.name}
              </h3>

              <p className="text-md text-gray-300 mb-0 line-clamp-2 leading-snug">
                {item.description && item.description.length > 50
                  ? `${item.description.substring(0, 50)}...`
                  : item.description}
              </p>
            </div>

            <div className="flex items-center justify-between mt-4">
              <span className="text-xl font-bold text-red-300">
                ₱{formatPrice(item.price)}
              </span>

              <Button
                onClick={(e) => {
                  e.stopPropagation()   // ⬅ prevents DialogTrigger
                  handleAddToCart()
                }}
                size="icon"
                className="bg-red-600 hover:bg-red-700 border border-red-700"
              >
                <ShoppingCart className="w-4 h-4" />
              </Button>
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

          <DialogClose asChild>
            <button className="absolute top-0 right-0">
              <X className="w-5 h-5 text-gray-400 hover:text-white" />
            </button>
          </DialogClose>
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