"use client"
import Image from "next/image"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Plus, Flame, Leaf, ShoppingCart } from "lucide-react"
import { useCartStore } from "@/store/cartStore"
import { useAuthStore } from "@/store/authStore"
import { toast } from "@/hooks/use-toast"
import type { MenuItem } from "@/types"
import { useRouter } from "next/navigation"

const CartPlusIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 576 512"
    fill="currentColor"
    className="w-3.5 h-3.5"
  >
    <path d="M0 24C0 10.7 10.7 0 24 0H69.5c22 0 41.5 12.8 50.6 32h411c26.3 0 45.5 25 38.6 50.4l-41 152.3c-8.5 31.4-37 53.3-69.5 53.3H170.7l5.4 28.5c2.2 11.3 12.1 19.5 23.6 19.5H488c13.3 0 24 10.7 24 24s-10.7 24-24 24H199.7c-34.6 0-64.3-24.6-70.7-58.5L77.4 54.5c-.7-3.8-4-6.5-7.9-6.5H24C10.7 48 0 37.3 0 24zM128 464a48 48 0 1 1 96 0 48 48 0 1 1 -96 0zm336-48a48 48 0 1 1 0 96 48 48 0 1 1 0-96zM252 160c0 11 9 20 20 20h44v44c0 11 9 20 20 20s20-9 20-20V180h44c11 0 20-9 20-20s-9-20-20-20H356V96c0-11-9-20-20-20s-20 9-20 20v44H272c-11 0-20 9-20 20z"/>
  </svg>
)

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
  const addItem = useCartStore((state) => state.addItem)
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn)
  const router = useRouter()

  const formatPrice = (price: number | string): string => {
    const numPrice = typeof price === "number" ? price : Number.parseFloat(String(price))
    return numPrice.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
  }

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

  const isSpicy = item.isSpicy || item.is_spicy || false
  const isVegetarian = item.isVegetarian || item.is_vegetarian || false

  return (
    <>
      <Card className="overflow-hidden bg-gradient-to-br from-red-950 to-black border-2 border-red-800 shadow-lg hover:shadow-2xl hover:shadow-red-900/50 transition-all duration-300 relative flex flex-col h-full hover:border-red-600 p-0">
        <div className="absolute top-2 left-2 z-10 flex gap-1">
          <Badge
            variant="secondary"
            className="bg-red-600 text-white text-[9px] sm:text-[10px] px-1.5 py-0.5 border border-red-700 font-semibold"
          >
            {item.category}
          </Badge>
        </div>

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

        <div className="absolute top-1.5 right-1.5 z-20 sm:hidden">
          <Button
            onClick={handleAddToCart}
            size="sm"
            className="w-6 h-6 rounded-full bg-red-600 text-white hover:bg-red-700 font-bold shadow-lg border border-white transition-all duration-300 p-0 flex items-center justify-center"
          >
            <CartPlusIcon />
          </Button>
        </div>

        <CardContent className="p-0 text-center flex-1 flex flex-col">
          <div className="flex justify-center flex-shrink-0">
            <div className="w-full h-48 sm:h-56 md:h-64 overflow-hidden">
              <Image
                src={getImageUrl(item.image) || "/placeholder.svg"}
                alt={item.name}
                width={300}
                height={180}
                className="object-cover w-full h-full transition-transform duration-300 hover:scale-110"
              />
            </div>
          </div>

          <div className="flex-shrink-0 mb-0.5 sm:mb-1 min-h-[1.5rem] sm:min-h-[1.8rem] flex items-center justify-center px-1 mt-1 sm:mt-1.5">
            <h3 className={`font-bold text-white uppercase leading-tight line-clamp-1 ${
              item.name.length > 35 ? 'text-[7px] sm:text-[8px] md:text-[9px] tracking-tighter' :
              item.name.length > 25 ? 'text-[8px] sm:text-[9px] md:text-[10px] tracking-tight' :
              item.name.length > 20 ? 'text-[9px] sm:text-[10px] md:text-xs tracking-tight' : 
              'text-xs sm:text-sm md:text-base tracking-wide'
            }`}>
              {item.name}
            </h3>
          </div>

          <div className="mb-0.5 flex-shrink-0 px-2">
            <p className="text-[10px] sm:text-xs text-gray-300 mb-0 line-clamp-1 leading-snug">
              {item.description && item.description.length > 50
                ? `${item.description.substring(0, 50)}...`
                : item.description}
            </p>
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-red-400 hover:text-red-300 hover:bg-red-950/50 text-[10px] sm:text-xs p-0 h-auto mb-0.5"
                >
                  View More Details
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-[95vw] sm:max-w-[85vw] md:max-w-2xl lg:max-w-3xl max-h-[90vh] overflow-y-auto bg-gradient-to-br from-red-950 to-black border-2 border-red-800">
                <DialogHeader>
                  <DialogTitle className="text-base sm:text-lg md:text-xl font-bold text-white pr-8">
                    {item.name}
                  </DialogTitle>
                </DialogHeader>
                <div className="space-y-3 sm:space-y-4">
                  <div className="flex justify-center">
                    <div className="w-full max-w-[280px] h-[280px] sm:max-w-[320px] sm:h-[320px] md:max-w-[384px] md:h-[384px] rounded-lg overflow-hidden border-2 sm:border-3 border-red-600 shadow-lg">
                      <Image
                        src={getImageUrl(item.image) || "/placeholder.svg"}
                        alt={item.name}
                        width={384}
                        height={384}
                        className="object-cover w-full h-full"
                      />
                    </div>
                  </div>
                  <div className="flex gap-2 justify-center flex-wrap">
                    <Badge variant="secondary" className="bg-red-600 text-white border border-red-700 text-xs sm:text-sm">
                      {item.category}
                    </Badge>
                    {isSpicy && (
                      <Badge variant="destructive" className="bg-red-500 text-white border border-red-600 text-xs sm:text-sm">
                        <Flame className="w-3 h-3 mr-1" />
                        Hot
                      </Badge>
                    )}
                    {isVegetarian && (
                      <Badge variant="secondary" className="bg-green-600 text-white border border-green-700 text-xs sm:text-sm">
                        <Leaf className="w-3 h-3 mr-1" />
                        Vegetarian
                      </Badge>
                    )}
                  </div>
                  <p className="text-gray-300 leading-relaxed text-sm sm:text-base px-1">
                    {item.description}
                  </p>
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-2 sm:gap-4">
                    <span className="text-xl sm:text-2xl font-bold text-red-400">
                      ₱ {formatPrice(item.price)}
                    </span>
                  </div>
                  <Button
                    onClick={handleAddToCart}
                    className="w-full bg-red-600 hover:bg-red-700 text-white font-bold border border-red-700 text-sm sm:text-base py-2 sm:py-2.5"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add to Cart
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <div className="flex-1" />

          <div className="flex justify-center items-center gap-0.5 sm:gap-0 flex-shrink-0 mb-1 sm:mb-1.5">
            <span className="text-sm sm:text-base md:text-lg font-bold text-red-400">
              ₱ {formatPrice(item.price)}
            </span>
          </div>
        </CardContent>

        <CardFooter className="p-1.5 py-1.5 sm:p-2.5 hidden sm:block flex-shrink-0">
          <Button
            onClick={handleAddToCart}
            className="w-full text-sm sm:text-base py-2.5 sm:py-3 bg-red-600 text-white hover:bg-red-700 font-bold shadow-md border border-red-700 transition-all duration-300 hover:scale-[1.02]"
            size="sm"
          >
            <Plus className="w-5 h-5 mr-2" />
            Add to Cart
          </Button>
        </CardFooter>
      </Card>
    </>
  )
}