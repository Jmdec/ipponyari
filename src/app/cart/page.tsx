"use client"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Minus, Plus, X, ShoppingBag } from "lucide-react"
import { useCartStore } from "@/store/cartStore"
import { toast } from "@/hooks/use-toast"

const getImageUrl = (imagePath: string): string => {
  if (!imagePath) {
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

const formatPrice = (price: number): string => {
  return price.toLocaleString("en-PH", { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

const Cart = () => {
  const { items, updateQuantity, removeItem, getTotal, clearCart } = useCartStore()
  const total = getTotal()

  const handleQuantityChange = (itemId: string | number, newQuantity: number) => {
    if (newQuantity < 1) {
      removeItem(itemId)
      toast({
        title: "Item removed",
        description: "Item has been removed from your cart.",
      })
    } else {
      updateQuantity(itemId, newQuantity)
    }
  }

  const handleRemoveItem = (itemId: string | number, itemName: string) => {
    removeItem(itemId)
    toast({
      title: "Item removed",
      description: `${itemName} has been removed from your cart.`,
    })
  }

  const handleClearCart = () => {
    clearCart()
    toast({
      title: "Cart cleared",
      description: "All items have been removed from your cart.",
    })
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen relative overflow-hidden bg-gradient-to-b from-[#8B0000] via-[#6B0000] to-[#2B0000]">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
          <div className="absolute top-0 left-0 w-96 h-96 bg-[#dc143c]/30 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#dc143c]/30 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#dc143c]/20 rounded-full blur-3xl animate-pulse delay-500"></div>
        </div>

        <div className="relative z-10 py-8">
          <div className="container mx-auto px-4">
            <div className="text-center py-16">
              <div className="bg-[#4B0000]/70 backdrop-blur-sm border-white/30 rounded-3xl p-12 max-w-md mx-auto shadow-2xl">
                <div className="relative">
                  <ShoppingBag className="w-24 h-24 text-[#ff6b6b] mx-auto mb-6" />
                </div>
                <h1 className="text-3xl font-bold mb-4 text-white text-balance">Your Cart is Empty</h1>
                <p className="text-xl text-white/70 mb-8 text-pretty">
                  Looks like you haven't added any delicious Japanese dishes yet!
                </p>
                <Button
                  asChild
                  size="lg"
                  className="bg-white hover:bg-white/90 text-[#8B0000] font-bold px-8 py-6 rounded-2xl shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
                >
                  <Link href="/menu">Browse Our Menu</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-b from-[#8B0000] via-[#6B0000] to-[#2B0000]">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
        <div className="absolute top-0 left-0 w-96 h-96 bg-[#dc143c]/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#dc143c]/30 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#dc143c]/20 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      <div className="relative z-10 py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="flex-1">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  <h1 className="text-3xl font-bold text-white text-balance">
                    Your Cart ({items.length} {items.length === 1 ? "item" : "items"})
                  </h1>
                </div>
                <Button
                  variant="outline"
                  onClick={handleClearCart}
                  className="text-white border-white/30 hover:bg-white/10 hover:border-white/50 bg-transparent hover:text-white"
                >
                  Clear Cart
                </Button>
              </div>

              <div className="space-y-4">
                {items.map((item) => {
                  const itemPrice = Number(item.price) || 0
                  const itemTotal = itemPrice * item.quantity

                  return (
                    <Card
                      key={item.id}
                      className="group hover:shadow-2xl transition-all duration-300 bg-[#4B0000]/70 backdrop-blur-sm border-white/30 hover:border-white/50 rounded-2xl overflow-hidden"
                    >
                      <CardContent className="p-6">
                        <div className="flex flex-col sm:flex-row gap-4">
                          <div className="relative w-full sm:w-24 h-24 rounded-xl overflow-hidden bg-black/50 shadow-md border border-white/20">
                            <img
                              src={getImageUrl(item.image) || "/placeholder.svg?height=96&width=96&query=Japanese food"}
                              alt={item.name}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement
                                target.src = "/japanese-food.jpg"
                              }}
                            />
                          </div>

                          <div className="flex-1">
                            <div className="flex items-start justify-between mb-2">
                              <div>
                                <h3 className="font-semibold text-lg text-white">{item.name}</h3>
                                <p className="text-sm text-white/70 line-clamp-2">{item.description}</p>
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleRemoveItem(item.id, item.name)}
                                className="text-white/70 hover:text-[#ff6b6b] hover:bg-white/10 rounded-full"
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>

                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <Badge
                                  variant="outline"
                                  className="text-xs bg-white/10 border-white/30 text-white"
                                >
                                  {item.category}
                                </Badge>
                                {item.isSpicy && (
                                  <Badge className="text-xs bg-[#ff6b6b] text-white border-0">
                                    Spicy
                                  </Badge>
                                )}
                                {item.isVegetarian && (
                                  <Badge className="text-xs bg-emerald-600 text-white">Veggie</Badge>
                                )}
                              </div>

                              <div className="flex items-center gap-4">
                                <div className="flex items-center gap-2 bg-white/10 rounded-full p-1 border border-white/30">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                                    className="h-8 w-8 p-0 rounded-full hover:bg-white/20 text-white hover:text-white"
                                  >
                                    <Minus className="h-3 w-3" />
                                  </Button>
                                  <span className="w-8 text-center font-medium text-white">{item.quantity}</span>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                                    className="h-8 w-8 p-0 rounded-full hover:bg-white/20 text-white hover:text-white"
                                  >
                                    <Plus className="h-3 w-3" />
                                  </Button>
                                </div>

                                <div className="text-right">
                                  <div className="text-sm text-white/70">₱{formatPrice(itemPrice)} each</div>
                                  <div className="font-semibold text-lg text-white">₱{formatPrice(itemTotal)}</div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            </div>

            <div className="lg:w-96">
              <Card className="sticky top-24 bg-[#4B0000]/70 backdrop-blur-sm border-white/30 rounded-2xl shadow-2xl overflow-hidden p-0">
                <div className="bg-gradient-to-r from-[#8B0000] to-[#6B0000] text-white px-6 py-4">
                  <h2 className="text-xl font-semibold flex items-center gap-2">Order Summary</h2>
                </div>
                <CardContent className="space-y-4 p-6">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-white/70">Subtotal</span>
                      <span className="text-white">₱{formatPrice(total)}</span>
                    </div>
                    <hr className="my-2 border-white/20" />
                    <div className="flex justify-between font-semibold text-lg">
                      <span className="text-white">Total</span>
                      <span className="text-white">₱{formatPrice(total)}</span>
                    </div>
                  </div>

                  <Button
                    asChild
                    className="w-full bg-white hover:bg-white/90 text-[#8B0000] rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 font-bold"
                    size="lg"
                  >
                    <Link href="/checkout">Proceed to Checkout</Link>
                  </Button>

                  <Button
                    asChild
                    variant="outline"
                    className="w-full border-white/30 hover:bg-white/10 hover:border-white/50 rounded-xl bg-transparent text-white hover:text-white"
                    size="lg"
                  >
                    <Link href="/menu">Continue Shopping</Link>
                  </Button>

                  <div className="text-xs text-white/50 text-center bg-white/5 rounded-lg p-2 border border-white/10">
                    Secure checkout • Ipponyari Japanese Restaurant
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Cart