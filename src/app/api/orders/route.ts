import { type NextRequest, NextResponse } from "next/server"

const LARAVEL_API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

export async function GET(request: NextRequest) {
  try {
    const authToken = request.headers.get("Authorization")

    if (!authToken) {
      return NextResponse.json({ success: false, message: "Authorization token required" }, { status: 401 })
    }

    const url = new URL(request.url)
    const searchParams = url.searchParams

    const laravelUrl = new URL(`${LARAVEL_API_BASE}/api/orders`)
    searchParams.forEach((value, key) => {
      laravelUrl.searchParams.append(key, value)
    })

    console.log("[API] Fetching orders from:", laravelUrl.toString())

    const response = await fetch(laravelUrl.toString(), {
      method: "GET",
      headers: {
        Authorization: authToken,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    })

    const data = await response.json()

    if (!response.ok) {
      console.error("[API] Laravel API error:", data)
      return NextResponse.json(
        { success: false, message: data.message || "Failed to fetch orders" },
        { status: response.status },
      )
    }

    return NextResponse.json(data, { status: 200 })
  } catch (error) {
    console.error("[API] Error fetching orders:", error)
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const authToken = request.headers.get("Authorization")

    if (!authToken) {
      return NextResponse.json({ success: false, message: "Authorization token required" }, { status: 401 })
    }

    const body = await request.json()

    console.log("[API] Order request received")
    console.log("[API] Has receipt_file:", !!body.receipt_file)
    console.log("[v0] Receipt file size:", body.receipt_file?.length || 0)

    // The Laravel OrderController::store method handles base64 images directly
    const orderData = {
      items: body.items,
      payment_method: body.payment_method,
      delivery_address: body.delivery_address,
      delivery_city: body.delivery_city,
      delivery_zip_code: body.delivery_zip_code,
      customer_name: body.customer_name,
      customer_email: body.customer_email,
      customer_phone: body.customer_phone,
      notes: body.notes || "",
      receipt_file: body.receipt_file || null,
    }

    console.log("[API] Sending order to Laravel with receipt_file:", !!orderData.receipt_file)

    const response = await fetch(`${LARAVEL_API_BASE}/api/orders`, {
      method: "POST",
      headers: {
        Authorization: authToken,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(orderData),
    })

    const data = await response.json()

    if (!response.ok) {
      console.error("[API] Laravel API error:", data)
      return NextResponse.json(
        { success: false, message: data.message || "Failed to create order", errors: data.errors },
        { status: response.status },
      )
    }

    console.log("[API] Order created successfully")
    return NextResponse.json(data, { status: 201 })
  } catch (error) {
    console.error("[API] Error creating order:", error)
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 })
  }
}
