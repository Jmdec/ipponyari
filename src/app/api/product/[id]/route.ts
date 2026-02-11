import { type NextRequest, NextResponse } from "next/server"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

// Helper to get auth token
function getAuthToken(request: NextRequest): string | null {
  const authHeader = request.headers.get("authorization")
  const cookieToken = request.cookies.get("token")?.value
  return authHeader?.replace("Bearer ", "") || cookieToken || null
}

// GET - fetch a single product
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const resolvedParams = await params
    const { id } = resolvedParams

    const response = await fetch(`${API_BASE_URL}/api/products/${id}`, {
      method: "GET",
      headers: { Accept: "application/json", "Content-Type": "application/json" },
      cache: "no-cache",
    })

    let data: any
    const text = await response.text()
    try {
      data = text ? JSON.parse(text) : {}
    } catch {
      data = { message: text }
    }

    if (!response.ok) {
      return NextResponse.json({ message: data.message || "Failed to fetch product" }, { status: response.status })
    }

    return NextResponse.json(data)
  } catch (error: any) {
    console.error("Error fetching product:", error)
    return NextResponse.json({ message: error.message || "Internal server error" }, { status: 500 })
  }
}

// POST - update product via FormData (_method=PUT)
export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const resolvedParams = await params
    const { id } = resolvedParams
    const token = getAuthToken(request)

    if (!token) return NextResponse.json({ message: "Unauthorized" }, { status: 401 })

    const formData = await request.formData()
    const laravelFormData = new FormData()

    // Append fields
    laravelFormData.append("name", formData.get("name") as string)
    laravelFormData.append("description", formData.get("description") as string)
    laravelFormData.append("price", formData.get("price") as string)
    laravelFormData.append("category", formData.get("category") as string)
    laravelFormData.append("is_spicy", (formData.get("is_spicy") === "true" ? "1" : "0"))
    laravelFormData.append("is_vegetarian", (formData.get("is_vegetarian") === "true" ? "1" : "0"))
    laravelFormData.append("is_featured", (formData.get("is_featured") === "true" ? "1" : "0"))
    laravelFormData.append("_method", (formData.get("_method") as string) || "PUT")

    const image = formData.get("image") as File
    if (image && image.size > 0) laravelFormData.append("image", image)

    const response = await fetch(`${API_BASE_URL}/api/products/${id}`, {
      method: "POST",
      headers: { Accept: "application/json", Authorization: `Bearer ${token}` },
      body: laravelFormData,
    })

    let responseData: any
    const text = await response.text()
    try {
      responseData = text ? JSON.parse(text) : {}
    } catch {
      responseData = { message: text }
    }

    if (!response.ok) {
      return NextResponse.json(
        { message: responseData.message || "Failed to update product", errors: responseData.errors || null },
        { status: response.status }
      )
    }

    return NextResponse.json(responseData)
  } catch (error: any) {
    console.error("Error updating product:", error)
    return NextResponse.json({ message: error.message || "Internal server error" }, { status: 500 })
  }
}

// DELETE - delete product
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const resolvedParams = await params
    const { id } = resolvedParams
    const token = getAuthToken(request)

    if (!token) return NextResponse.json({ message: "Unauthorized" }, { status: 401 })

    const response = await fetch(`${API_BASE_URL}/api/products/${id}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    })

    let responseData: any
    const text = await response.text()
    try {
      responseData = text ? JSON.parse(text) : {}
    } catch {
      responseData = { message: text || "Failed to delete product" }
    }

    if (!response.ok) {
      return NextResponse.json({ message: responseData.message || "Failed to delete product" }, { status: response.status })
    }

    return NextResponse.json(responseData)
  } catch (error: any) {
    console.error("Error deleting product:", error)
    return NextResponse.json({ message: error.message || "Internal server error" }, { status: 500 })
  }
}
