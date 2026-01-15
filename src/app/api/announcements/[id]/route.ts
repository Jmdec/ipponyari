import { type NextRequest, NextResponse } from "next/server"

const API_URL = process.env.NEXT_PUBLIC_API_URL

// PUT - Update an announcement
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    if (!API_URL) {
      return NextResponse.json({ error: "API URL not configured" }, { status: 500 })
    }

    const body = await request.json()

    const response = await fetch(`${API_URL}/api/announcements/${params.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        title: body.title,
        content: body.content,
        is_active: body.isActive,
      }),
    })

    if (!response.ok) {
      throw new Error(`Failed to update announcement: ${response.statusText}`)
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error("Error updating announcement:", error)
    return NextResponse.json({ error: "Failed to update announcement" }, { status: 500 })
  }
}

// DELETE - Delete an announcement
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    if (!API_URL) {
      return NextResponse.json({ error: "API URL not configured" }, { status: 500 })
    }

    const response = await fetch(`${API_URL}/api/announcements/${params.id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    })

    if (!response.ok) {
      throw new Error(`Failed to delete announcement: ${response.statusText}`)
    }

    return NextResponse.json({ message: "Announcement deleted" })
  } catch (error) {
    console.error("Error deleting announcement:", error)
    return NextResponse.json({ error: "Failed to delete announcement" }, { status: 500 })
  }
}
