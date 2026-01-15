import { type NextRequest, NextResponse } from "next/server"

// PUT - Update an address
export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const token = request.headers.get("Authorization")?.replace("Bearer ", "")

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { id } = await params

    const apiUrl = process.env.NEXT_PUBLIC_API_URL
    if (!apiUrl) {
      return NextResponse.json({ error: "API configuration error" }, { status: 500 })
    }

    // Call your Laravel backend
    const response = await fetch(`${apiUrl}/api/addresses/${id}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    })

    if (!response.ok) {
      const errorData = await response.text()
      console.error("[v0] Laravel error:", response.status, errorData)
      return NextResponse.json({ error: `Failed to update address: ${errorData}` }, { status: response.status })
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error("[API] Error updating address:", error)
    return NextResponse.json(
      { error: `Failed to update address: ${error instanceof Error ? error.message : "Unknown error"}` },
      { status: 500 },
    )
  }
}

// DELETE - Delete an address
export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
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
    const response = await fetch(`${apiUrl}/api/addresses/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      const errorData = await response.text()
      console.error("[v0] Laravel error:", response.status, errorData)
      return NextResponse.json({ error: `Failed to delete address: ${errorData}` }, { status: response.status })
    }

    return NextResponse.json({ message: "Address deleted successfully" })
  } catch (error) {
    console.error("[API] Error deleting address:", error)
    return NextResponse.json(
      { error: `Failed to delete address: ${error instanceof Error ? error.message : "Unknown error"}` },
      { status: 500 },
    )
  }
}
