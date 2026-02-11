"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Loader2, Package } from "lucide-react"
import Image from "next/image"
import { useToast } from "@/hooks/use-toast"

interface OrderItem {
  id: number
  order_id: number
  name: string
  description: string
  price: number
  quantity: number
  category: string
  is_spicy: boolean
  is_vegetarian: boolean
  image_url: string
  subtotal: number
  created_at: string
  order: {
    id: number
    order_number: string
    created_at: string
    order_status: string
  }
}

interface OrderItemsResponse {
  success: boolean
  message: string
  data: {
    items: OrderItem[]
    pagination: {
      current_page: number
      last_page: number
      per_page: number
      total: number
    }
  }
}

export default function OrderItemsFetcher() {
  const [orderItems, setOrderItems] = useState<OrderItem[]>([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const { toast } = useToast()

  const fetchOrderItems = async (page: number = 1) => {
    try {
      setLoading(true)
      const token = localStorage.getItem("auth_token")

      if (!token) {
        toast({
          variant: "destructive",
          title: "Authentication Required",
          description: "Please log in to view order items.",
        })
        return
      }

      const response = await fetch(`/api/orders/items?page=${page}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`)
      }

      const result: OrderItemsResponse = await response.json()

      if (result.success) {
        setOrderItems(result.data.items)
        setCurrentPage(result.data.pagination.current_page)
        setTotalPages(result.data.pagination.last_page)
      } else {
        throw new Error(result.message || "Failed to fetch order items")
      }
    } catch (error) {
      console.error("Failed to fetch order items:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to load order items.",
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchOrderItems()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex items-center gap-2">
          <Loader2 className="h-6 w-6 animate-spin text-orange-500" />
          <span className="text-gray-700 font-medium">Loading order items...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Order Items</h2>
          <p className="text-gray-600 mt-1">View all items from your orders</p>
        </div>
        <Badge variant="outline" className="text-lg px-4 py-2">
          {orderItems.length} Items
        </Badge>
      </div>

      {orderItems.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <div className="bg-gradient-to-r from-orange-100 to-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Package className="w-8 h-8 text-orange-500" />
            </div>
            <p className="text-lg font-medium text-gray-700">No order items found</p>
            <p className="text-sm mt-1 text-gray-500">Your order items will appear here</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {orderItems.map((item) => (
            <Card key={item.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <CardHeader className="p-0">
                <div className="relative h-48 w-full">
                  <Image
                    src={
                      item.image_url ||
                      "https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg"
                    }
                    alt={item.name}
                    fill
                    className="object-cover"
                  />
                </div>
              </CardHeader>
              <CardContent className="p-4 space-y-3">
                <div>
                  <h3 className="font-semibold text-lg">{item.name}</h3>
                  <p className="text-xs text-gray-500 line-clamp-2">{item.description}</p>
                </div>

                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline">{item.category}</Badge>
                  {item.is_spicy && <Badge variant="destructive">Spicy</Badge>}
                  {item.is_vegetarian && (
                    <Badge className="bg-green-100 text-green-700">Vegetarian</Badge>
                  )}
                </div>

                <div className="flex items-center justify-between pt-2 border-t">
                  <div>
                    <p className="text-sm text-gray-600">Price</p>
                    <p className="font-semibold">₱{item.price.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Quantity</p>
                    <p className="font-semibold">{item.quantity}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Subtotal</p>
                    <p className="font-semibold text-green-600">₱{item.subtotal.toFixed(2)}</p>
                  </div>
                </div>

                <div className="pt-2 border-t">
                  <p className="text-xs text-gray-500">
                    Order #{item.order.order_number}
                  </p>
                  <p className="text-xs text-gray-500">
                    {new Date(item.created_at).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-6">
          <button
            onClick={() => fetchOrderItems(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-4 py-2 border rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            Previous
          </button>
          <span className="text-sm text-gray-600">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => fetchOrderItems(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-4 py-2 border rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  )
}