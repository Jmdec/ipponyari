import { NextResponse, NextRequest } from "next/server"

const LARAVEL_API_BASE =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

/* ==============================
   GET /api/orders/[id]
   ============================== */
export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params // ✅ MUST await params

    const authHeader = request.headers.get("authorization")

    const response = await fetch(
      `${LARAVEL_API_BASE}/api/orders/${id}`,
      {
        method: "GET",
        headers: {
          Authorization: authHeader ?? "",
          Accept: "application/json",
        },
        cache: "no-store",
      }
    )

    const laravel = await response.json()

    return NextResponse.json(
      {
        success: true,
        data: {
          items: laravel.data?.items ?? [],
        },
      },
      { status: response.status }
    )
  } catch (error) {
    console.error("Order items fetch error:", error)

    return NextResponse.json(
      { success: false, message: "Failed to fetch order items" },
      { status: 500 }
    )
  }
}

/* ==============================
   PATCH /api/orders/[id]
   ============================== */
export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params // ✅ MUST await params

    const authToken = request.headers.get("Authorization")
    if (!authToken) {
      return NextResponse.json(
        { success: false, message: "Authorization token required" },
        { status: 401 }
      )
    }

    let body: { order_status?: string }
    try {
      body = await request.json()
    } catch {
      return NextResponse.json(
        { success: false, message: "Invalid JSON in request body" },
        { status: 400 }
      )
    }

    const validStatuses = [
      "pending",
      "confirmed",
      "preparing",
      "ready",
      "out_for_delivery",
      "delivered",
      "cancelled",
    ]

    if (!body.order_status) {
      return NextResponse.json(
        { success: false, message: "Order status is required" },
        { status: 400 }
      )
    }

    if (!validStatuses.includes(body.order_status)) {
      return NextResponse.json(
        { success: false, message: "Invalid status value" },
        { status: 400 }
      )
    }

    console.log("Updating order:", id, "→", body.order_status)

    const response = await fetch(
      `${LARAVEL_API_BASE}/api/orders/${id}`,
      {
        method: "PATCH",
        headers: {
          Authorization: authToken,
          "Content-Type": "application/json",
          Accept: "application/json",
          "X-Admin-Request": "true",
        },
        body: JSON.stringify({
          order_status: body.order_status, // ✅ FIXED
        }),
      }
    )

    const text = await response.text()
    const data = text ? JSON.parse(text) : {}

    return NextResponse.json(data, { status: response.status })
  } catch (error) {
    console.error("PATCH /api/orders/[id] error:", error)

    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    )
  }
}

// DELETE - delete order
export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {

  try {
    const { id } = await context.params // ✅ MUST await params

    const authToken = request.headers.get("Authorization")
    if (!authToken) {
      return NextResponse.json(
        { success: false, message: "Authorization token required" },
        { status: 401 }
      )
    }

    const response = await fetch(`${LARAVEL_API_BASE}/api/orders/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: authToken,
        "Content-Type": "application/json",
        Accept: "application/json",
        "X-Admin-Request": "true",
      },
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

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  return PATCH(request, context)
}
