import { type NextRequest, NextResponse } from "next/server"

// POST - Set an address as default
export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const token = request.headers.get("Authorization")?.replace("Bearer ", "")

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params

    const apiUrl = process.env.NEXT_PUBLIC_API_URL
    if (!apiUrl) {
      return NextResponse.json({ error: "API configuration error" }, { status: 500 })
    }

    // Call your Laravel backend
    const response = await fetch(`${apiUrl}/api/addresses/${id}/set-default`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      const errorData = await response.text()
      console.error("[v0] Laravel error:", response.status, errorData)
      return NextResponse.json({ error: `Failed to set default address: ${errorData}` }, { status: response.status })
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error("[API] Error setting default address:", error)
    return NextResponse.json(
      { error: `Failed to set default address: ${error instanceof Error ? error.message : "Unknown error"}` },
      { status: 500 },
    )
  }
}
