import { type NextRequest, NextResponse } from "next/server"

// GET - Fetch all addresses for the logged-in user
export async function GET(request: NextRequest) {
  try {
    const token = request.headers.get("Authorization")?.replace("Bearer ", "")

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const apiUrl = process.env.NEXT_PUBLIC_API_URL
    console.log("[v0] GET /api/addresses - API URL:", apiUrl)

    if (!apiUrl) {
      console.error("[v0] NEXT_PUBLIC_API_URL is not set")
      return NextResponse.json({ error: "API configuration error" }, { status: 500 })
    }

    // Call your Laravel backend
    const response = await fetch(`${apiUrl}/api/addresses`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error("[v0] Laravel error:", response.status, errorText)
      throw new Error("Failed to fetch addresses from Laravel")
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error("[API] Error fetching addresses:", error)
    return NextResponse.json({ error: "Failed to fetch addresses" }, { status: 500 })
  }
}

// POST - Create a new address
export async function POST(request: NextRequest) {
  try {
    const token = request.headers.get("Authorization")?.replace("Bearer ", "")

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()

    const apiUrl = process.env.NEXT_PUBLIC_API_URL
    console.log("[v0] POST /api/addresses - API URL:", apiUrl)
    console.log("[v0] POST /api/addresses - Request body:", body)

    if (!apiUrl) {
      console.error("[v0] NEXT_PUBLIC_API_URL is not set")
      return NextResponse.json({ error: "API configuration error" }, { status: 500 })
    }

    // Call your Laravel backend
    const response = await fetch(`${apiUrl}/api/addresses`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    })

    console.log("[v0] Laravel response status:", response.status)

    if (!response.ok) {
      const errorData = await response.text()
      console.error("[v0] Laravel error response:", response.status, errorData)
      return NextResponse.json({ error: `Laravel error: ${errorData}` }, { status: response.status })
    }

    const data = await response.json()
    console.log("[v0] Laravel response data:", data)
    return NextResponse.json(data, { status: 201 })
  } catch (error) {
    console.error("[API] Error creating address:", error)
    return NextResponse.json(
      { error: `Failed to create address: ${error instanceof Error ? error.message : "Unknown error"}` },
      { status: 500 },
    )
  }
}
