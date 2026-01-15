import { type NextRequest, NextResponse } from "next/server"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

// Helper function to get auth token from request
function getAuthToken(request: NextRequest): string | null {
  const authHeader = request.headers.get("authorization")
  const cookieToken = request.cookies.get("token")?.value
  return authHeader?.replace("Bearer ", "") || cookieToken || null
}

// GET - Fetch single product
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/products/${params.id}`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      cache: "no-cache",
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: "Unknown error" }))
      return NextResponse.json(
        { message: errorData.message || "Failed to fetch product" },
        { status: response.status }
      )
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error("Error fetching product:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}

// POST - Update product (using POST with _method=PUT for FormData)
export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const token = getAuthToken(request)
    
    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const formData = await request.formData()

    // Create a new FormData object to send to Laravel
    const laravelFormData = new FormData()

    // Extract and append all form fields
    const name = formData.get("name") as string
    const description = formData.get("description") as string
    const price = formData.get("price") as string
    const category = formData.get("category") as string
    const isSpicy = formData.get("is_spicy") as string
    const isVegetarian = formData.get("is_vegetarian") as string
    const isFeatured = formData.get("is_featured") as string
    const image = formData.get("image") as File
    const method = formData.get("_method") as string

    laravelFormData.append("name", name)
    laravelFormData.append("description", description)
    laravelFormData.append("price", price)
    laravelFormData.append("category", category)
    laravelFormData.append("is_spicy", isSpicy === "true" ? "1" : "0")
    laravelFormData.append("is_vegetarian", isVegetarian === "true" ? "1" : "0")
    laravelFormData.append("is_featured", isFeatured === "true" ? "1" : "0")
    laravelFormData.append("_method", method || "PUT")

    if (image && image.size > 0) {
      laravelFormData.append("image", image)
    }

    const response = await fetch(`${API_BASE_URL}/api/products/${params.id}`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`, // Add auth token
      },
      body: laravelFormData,
    })

    const responseData = await response.json()

    if (!response.ok) {
      return NextResponse.json(
        {
          message: responseData.message || "Failed to update product",
          errors: responseData.errors || null,
        },
        { status: response.status }
      )
    }

    return NextResponse.json(responseData)
  } catch (error) {
    console.error("Error updating product:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}

// DELETE - Delete product
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const token = getAuthToken(request)
    
    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const response = await fetch(`${API_BASE_URL}/api/products/${params.id}`, {
      method: "DELETE",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // Add auth token
      },
    })

    const responseData = await response.json()

    if (!response.ok) {
      return NextResponse.json(
        { message: responseData.message || "Failed to delete product" },
        { status: response.status }
      )
    }

    return NextResponse.json(responseData)
  } catch (error) {
    console.error("Error deleting product:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
