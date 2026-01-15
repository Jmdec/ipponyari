"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { useCartStore } from "@/store/cartStore"
import type { CheckoutInfo } from "@/types"
import { useRouter } from "next/navigation"
import { toast } from "@/hooks/use-toast"
import { Banknote, Lock, Package, LogIn, Upload, X, Copy, Check } from "lucide-react"
import Link from "next/link"

interface ExtendedCheckoutInfo extends Omit<CheckoutInfo, "paymentMethod"> {
  paymentMethod: "cash" | "gcash" | "security_bank"
  notes?: string
}

interface Address {
  id: number
  street: string
  city: string
  state: string
  postal_code: string
  country: string
  is_default: boolean
}

const formatPrice = (price: number): string => {
  return price.toLocaleString("en-PH", { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

const Checkout = () => {
  const { items, getTotal, clearCart } = useCartStore()
  const total = getTotal()
  const [isProcessing, setIsProcessing] = useState(false)
  const router = useRouter()
  const [isOrderComplete, setIsOrderComplete] = useState(false)
  const [userInfo, setUserInfo] = useState<any | null>(null)
  const [isLoadingUser, setIsLoadingUser] = useState(true)
  const [copiedGcash, setCopiedGcash] = useState(false)
  const [copiedBank, setCopiedBank] = useState(false)

  const [checkoutInfo, setCheckoutInfo] = useState<ExtendedCheckoutInfo>({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    zipCode: "",
    paymentMethod: "cash",
    notes: "",
  })
  const [receiptFile, setReceiptFile] = useState<string | null>(null)

  useEffect(() => {
    const checkAuthAndFillForm = async () => {
      const token = localStorage.getItem("auth_token")
      const userData = localStorage.getItem("user_data")

      if (token && userData) {
        try {
          const response = await fetch("/api/orders?page=1&per_page=1", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })

          if (response.ok) {
            const parsedUserData = JSON.parse(userData)
            setUserInfo(parsedUserData)

            const addressesResponse = await fetch("/api/addresses", {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            })

            if (addressesResponse.ok) {
              const addressesData = await addressesResponse.json()
              const addresses: Address[] = addressesData.addresses || []

              const defaultAddress = addresses.find((addr) => addr.is_default)

              if (defaultAddress) {
                setCheckoutInfo((prev) => ({
                  ...prev,
                  name: parsedUserData.name || "",
                  email: parsedUserData.email || "",
                  phone: parsedUserData.phone || "",
                  address: defaultAddress.street,
                  city: defaultAddress.city,
                  zipCode: defaultAddress.postal_code,
                }))

                toast({
                  title: "Welcome back!",
                  description: "Your default address has been loaded.",
                })
              } else {
                setCheckoutInfo((prev) => ({
                  ...prev,
                  name: parsedUserData.name || "",
                  email: parsedUserData.email || "",
                  phone: parsedUserData.phone || "",
                  address: parsedUserData.address || "",
                  city: parsedUserData.city || "",
                  zipCode: parsedUserData.zip_code || "",
                }))

                toast({
                  title: "Welcome back!",
                  description: "Your information has been automatically filled.",
                })
              }
            } else {
              setCheckoutInfo((prev) => ({
                ...prev,
                name: parsedUserData.name || "",
                email: parsedUserData.email || "",
                phone: parsedUserData.phone || "",
                address: parsedUserData.address || "",
                city: parsedUserData.city || "",
                zipCode: parsedUserData.zip_code || "",
              }))
            }
          } else {
            localStorage.removeItem("auth_token")
            localStorage.removeItem("user_data")
          }
        } catch (error) {
          console.error("Error checking auth:", error)
          localStorage.removeItem("auth_token")
          localStorage.removeItem("user_data")
        }
      }
      setIsLoadingUser(false)
    }

    checkAuthAndFillForm()
  }, [])

  useEffect(() => {
    if (total > 1000 && checkoutInfo.paymentMethod === "cash") {
      setCheckoutInfo((prev) => ({ ...prev, paymentMethod: "gcash" }))
      toast({
        title: "Payment Method Changed",
        description: "Cash on Delivery is not available for orders above ₱1,000. Switched to GCash.",
        variant: "destructive",
      })
    }
  }, [total, checkoutInfo.paymentMethod])

  const handleInputChange = (field: keyof ExtendedCheckoutInfo, value: string) => {
    setCheckoutInfo((prev) => ({ ...prev, [field]: value }))
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Please upload an image smaller than 2MB",
          variant: "destructive",
        })
        e.target.value = ""
        return
      }

      const reader = new FileReader()
      reader.onloadend = () => {
        setReceiptFile(reader.result as string)
        toast({
          title: "Receipt uploaded",
          description: "Your payment receipt has been attached",
        })
      }
      reader.readAsDataURL(file)
    }
  }

  const removeReceipt = () => {
    setReceiptFile(null)
    toast({
      title: "Receipt removed",
      description: "Payment receipt has been removed",
    })
  }

  const copyToClipboard = (text: string, type: "gcash" | "bank") => {
    navigator.clipboard.writeText(text)
    if (type === "gcash") {
      setCopiedGcash(true)
      setTimeout(() => setCopiedGcash(false), 2000)
      toast({
        title: "Copied!",
        description: "GCash number copied to clipboard",
      })
    } else {
      setCopiedBank(true)
      setTimeout(() => setCopiedBank(false), 2000)
      toast({
        title: "Copied!",
        description: "Bank account number copied to clipboard",
      })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!checkoutInfo.name || !checkoutInfo.email || !checkoutInfo.phone || !checkoutInfo.address) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      })
      return
    }

    if ((checkoutInfo.paymentMethod === "gcash" || checkoutInfo.paymentMethod === "security_bank") && !receiptFile) {
      toast({
        title: "Receipt Required",
        description: "Please upload your payment receipt to proceed.",
        variant: "destructive",
      })
      return
    }

    const token = localStorage.getItem("auth_token")
    if (!token) {
      toast({
        title: "Authentication Required",
        description: "Please log in to place an order.",
        variant: "destructive",
      })
      router.push("/login")
      return
    }

    setIsProcessing(true)

    try {
      const orderData = {
        items: items.map((item) => ({
          name: item.name,
          description: item.description || "",
          price: item.price,
          quantity: item.quantity,
          category: item.category || "Japanese Food",
          is_spicy: Boolean(item.isSpicy),
          is_vegetarian: Boolean(item.isVegetarian),
          image_url: typeof item.image === "string" ? item.image : "",
        })),
        payment_method: checkoutInfo.paymentMethod,
        delivery_address: checkoutInfo.address,
        delivery_city: checkoutInfo.city,
        delivery_zip_code: checkoutInfo.zipCode,
        customer_name: checkoutInfo.name,
        customer_email: checkoutInfo.email,
        customer_phone: checkoutInfo.phone,
        notes: checkoutInfo.notes || "",
        receipt_file: receiptFile || null,
      }

      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
      })

      const result = await response.json()

      if (response.ok) {
        const orderNumber =
          result.data?.order?.order_number ||
          result.data?.order_number ||
          result.order?.order_number ||
          result.order_number ||
          "your order"

        clearCart()
        setIsOrderComplete(true)

        toast({
          title: "Order Placed Successfully!",
          description: `Order ${orderNumber} has been created.`,
        })

        setTimeout(() => {
          router.push("/orders")
        }, 1000)
      } else {
        throw new Error(result.message || result.error || "Failed to create order")
      }
    } catch (error) {
      console.error("Error creating order:", error)
      toast({
        title: "Order Failed",
        description: error instanceof Error ? error.message : "Failed to place order. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  if (items.length === 0 && !isOrderComplete) {
    router.push("/cart")
    return null
  }

  if (isLoadingUser) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#8B0000] via-[#6B0000] to-[#2B0000] flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-[#ff6b6b] border-t-white rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white/70">Loading checkout...</p>
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
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-4xl font-bold text-white">Checkout</h1>
            {userInfo && (
              <div className="flex items-center gap-2 bg-[#4B0000]/70 backdrop-blur-sm rounded-lg px-4 py-2 border border-white/30">
                <LogIn className="w-4 h-4 text-[#ff6b6b]" />
                <span className="text-white font-medium">Welcome, {userInfo.name}!</span>
              </div>
            )}
          </div>

          {!userInfo && (
            <Card className="mb-8 bg-[#4B0000]/70 backdrop-blur-sm border-white/30 rounded-2xl shadow-2xl">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">Login for faster checkout!</h3>
                    <p className="text-white/70">Save your information for quick ordering next time.</p>
                  </div>
                  <div className="flex gap-2">
                    <Link href="/login">
                      <Button
                        variant="outline"
                        className="border-white/30 text-white hover:bg-white/10 hover:border-white/50 bg-transparent"
                      >
                        <LogIn className="w-4 h-4 mr-2" />
                        Login
                      </Button>
                    </Link>
                    <Link href="/register">
                      <Button className="bg-white hover:bg-white/90 text-[#8B0000] font-bold shadow-lg">
                        <LogIn className="w-4 h-4 mr-2" />
                        Register
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card className="bg-[#4B0000]/70 backdrop-blur-sm border-white/30 shadow-2xl rounded-2xl overflow-hidden p-0">
              <div className="border-b border-white/20 bg-gradient-to-r from-[#8B0000] to-[#6B0000] text-white px-6 py-4">
                <h2 className="text-xl font-semibold">Delivery & Payment Information</h2>
              </div>
              <CardContent className="p-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="font-semibold text-lg text-white border-b border-white/20 pb-2">
                      Personal Information
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="name" className="text-white">
                          Full Name *
                        </Label>
                        <Input
                          id="name"
                          value={checkoutInfo.name}
                          onChange={(e) => handleInputChange("name", e.target.value)}
                          placeholder="Enter your full name"
                          required
                          className="border-white/30 bg-white/20 text-white placeholder:text-white/60 focus:border-white focus:ring-white/30"
                        />
                      </div>
                      <div>
                        <Label htmlFor="email" className="text-white">
                          Email Address *
                        </Label>
                        <Input
                          id="email"
                          type="email"
                          value={checkoutInfo.email}
                          onChange={(e) => handleInputChange("email", e.target.value)}
                          placeholder="Enter your email"
                          required
                          className="border-white/30 bg-white/20 text-white placeholder:text-white/60 focus:border-white focus:ring-white/30"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="phone" className="text-white">
                        Phone Number *
                      </Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={checkoutInfo.phone}
                        onChange={(e) => handleInputChange("phone", e.target.value)}
                        placeholder="Enter your phone number"
                        required
                        className="border-white/30 bg-white/20 text-white placeholder:text-white/60 focus:border-white focus:ring-white/30"
                      />
                    </div>
                  </div>

                  <Separator className="bg-white/20" />

                  <div className="space-y-4">
                    <h3 className="font-semibold text-lg text-white border-b border-white/20 pb-2">
                      Delivery Address
                    </h3>

                    <div>
                      <Label htmlFor="address" className="text-white">
                        Street Address *
                      </Label>
                      <Input
                        id="address"
                        value={checkoutInfo.address}
                        onChange={(e) => handleInputChange("address", e.target.value)}
                        placeholder="Enter your street address"
                        required
                        className="border-white/30 bg-white/20 text-white placeholder:text-white/60 focus:border-white focus:ring-white/30"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="city" className="text-white">
                          City *
                        </Label>
                        <Input
                          id="city"
                          value={checkoutInfo.city}
                          onChange={(e) => handleInputChange("city", e.target.value)}
                          placeholder="Enter your city"
                          required
                          className="border-white/30 bg-white/20 text-white placeholder:text-white/60 focus:border-white focus:ring-white/30"
                        />
                      </div>
                      <div>
                        <Label htmlFor="zipCode" className="text-white">
                          ZIP Code *
                        </Label>
                        <Input
                          id="zipCode"
                          value={checkoutInfo.zipCode}
                          onChange={(e) => handleInputChange("zipCode", e.target.value)}
                          placeholder="Enter ZIP code"
                          required
                          className="border-white/30 bg-white/20 text-white placeholder:text-white/60 focus:border-white focus:ring-white/30"
                        />
                      </div>
                    </div>
                  </div>

                  <Separator className="bg-white/20" />

                  <div className="space-y-4">
                    <h3 className="font-semibold text-lg text-white border-b border-white/20 pb-2">
                      Payment Method
                    </h3>

                    {total > 1000 && (
                      <div className="p-3 bg-[#ff6b6b]/20 border border-[#ff6b6b]/50 rounded-lg mb-3">
                        <p className="text-sm text-white font-medium">
                          Cash on Delivery is not available for orders above ₱1,000. Please use GCash or Bank Transfer.
                        </p>
                      </div>
                    )}

                    <div className="space-y-3">
                      <div
                        className={`p-4 rounded-lg border-2 transition-all cursor-pointer ${
                          total > 1000
                            ? "bg-white/5 border-white/10 opacity-50 cursor-not-allowed"
                            : checkoutInfo.paymentMethod === "cash"
                              ? "bg-white/10 border-white"
                              : "bg-white/5 border-white/20 hover:border-white/40"
                        }`}
                        onClick={() => total <= 1000 && handleInputChange("paymentMethod", "cash")}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                              checkoutInfo.paymentMethod === "cash" ? "border-white" : "border-white/30"
                            }`}
                          >
                            {checkoutInfo.paymentMethod === "cash" && (
                              <div className="w-3 h-3 rounded-full bg-white"></div>
                            )}
                          </div>
                          <Banknote className="h-5 w-5 text-white/70" />
                          <div>
                            <p className="font-medium text-white">Cash on Delivery</p>
                            <p className="text-sm text-white/70">Pay when you receive your order</p>
                          </div>
                        </div>
                      </div>

                      <div
                        className={`p-4 rounded-lg border-2 transition-all cursor-pointer ${
                          checkoutInfo.paymentMethod === "gcash"
                            ? "bg-white/10 border-white"
                            : "bg-white/5 border-white/20 hover:border-white/40"
                        }`}
                        onClick={() => handleInputChange("paymentMethod", "gcash")}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                              checkoutInfo.paymentMethod === "gcash" ? "border-white" : "border-white/30"
                            }`}
                          >
                            {checkoutInfo.paymentMethod === "gcash" && (
                              <div className="w-3 h-3 rounded-full bg-white"></div>
                            )}
                          </div>
                          <div className="h-5 w-5 bg-blue-500 rounded text-white text-xs flex items-center justify-center font-bold">
                            G
                          </div>
                          <div>
                            <p className="font-medium text-white">GCash</p>
                            <p className="text-sm text-white/70">Pay via GCash mobile wallet</p>
                          </div>
                        </div>
                      </div>

                      <div
                        className={`p-4 rounded-lg border-2 transition-all cursor-pointer ${
                          checkoutInfo.paymentMethod === "security_bank"
                            ? "bg-white/10 border-white"
                            : "bg-white/5 border-white/20 hover:border-white/40"
                        }`}
                        onClick={() => handleInputChange("paymentMethod", "security_bank")}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                              checkoutInfo.paymentMethod === "security_bank" ? "border-white" : "border-white/30"
                            }`}
                          >
                            {checkoutInfo.paymentMethod === "security_bank" && (
                              <div className="w-3 h-3 rounded-full bg-white"></div>
                            )}
                          </div>
                          <Lock className="h-5 w-5 text-white/70" />
                          <div>
                            <p className="font-medium text-white">Bank Transfer</p>
                            <p className="text-sm text-white/70">Transfer to our bank account</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {(checkoutInfo.paymentMethod === "gcash" || checkoutInfo.paymentMethod === "security_bank") && (
                      <div className="mt-4 p-4 bg-white/10 rounded-lg border border-white/20">
                        <p className="text-sm text-white mb-3">
                        
{checkoutInfo.paymentMethod === "gcash"
                            ? "Send payment to: 0945-675-4591"
                            : "Account: 0000-075486-863"}
                        </p>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            copyToClipboard(
                              checkoutInfo.paymentMethod === "gcash" ? "09456754591" : "0000075486863",
                              checkoutInfo.paymentMethod === "gcash" ? "gcash" : "bank",
                            )
                          }
                          className="border-white/30 text-white hover:bg-white/10 bg-transparent"
                        >
                          {(checkoutInfo.paymentMethod === "gcash" ? copiedGcash : copiedBank) ? (
                            <Check className="w-4 h-4 mr-2" />
                          ) : (
                            <Copy className="w-4 h-4 mr-2" />
                          )}
                          Copy
                        </Button>

                        <div className="mt-4">
                          <Label className="text-white">Upload Receipt *</Label>
                          <div className="mt-2">
                            {receiptFile ? (
                              <div className="flex items-center gap-2 p-3 bg-white/10 rounded-lg border border-white/30">
                                <Check className="w-4 h-4 text-[#ff6b6b]" />
                                <span className="text-white text-sm">Receipt uploaded</span>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  onClick={removeReceipt}
                                  className="ml-auto text-[#ff6b6b] hover:bg-white/10"
                                >
                                  <X className="w-4 h-4" />
                                </Button>
                              </div>
                            ) : (
                              <label className="flex items-center justify-center gap-2 p-4 border-2 border-dashed border-white/30 rounded-lg cursor-pointer hover:border-white/50 transition-colors">
                                <Upload className="w-5 h-5 text-white/70" />
                                <span className="text-white/70">Click to upload receipt</span>
                                <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                              </label>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  <Button
                    type="submit"
                    disabled={isProcessing}
                    className="w-full bg-white hover:bg-white/90 text-[#8B0000] py-6 tracking-wider shadow-lg hover:shadow-xl transition-all duration-300 font-bold"
                  >
                    {isProcessing ? "Processing..." : `Place Order • ₱${formatPrice(total)}`}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Order Summary */}
            <Card className="h-fit sticky top-24 bg-[#4B0000]/70 backdrop-blur-sm border-white/30 rounded-2xl shadow-2xl overflow-hidden p-0">
              <div className="bg-gradient-to-r from-[#8B0000] to-[#6B0000] text-white px-6 py-4">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  <Package className="w-5 h-5" />
                  Order Summary
                </h2>
              </div>
              <CardContent className="p-6 space-y-4">
                {items.map((item) => (
                  <div key={item.id} className="flex justify-between items-center py-2 border-b border-white/10">
                    <div>
                      <p className="text-white font-medium">{item.name}</p>
                      <p className="text-white/70 text-sm">Qty: {item.quantity}</p>
                    </div>
                    <p className="text-white">₱{formatPrice(Number(item.price) * item.quantity)}</p>
                  </div>
                ))}

                <Separator className="bg-white/20" />

                <div className="flex justify-between font-bold text-lg">
                  <span className="text-white">Total</span>
                  <span className="text-white">₱{formatPrice(total)}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Checkout