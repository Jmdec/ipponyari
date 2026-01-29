import { type NextRequest, NextResponse } from "next/server"

const LARAVEL_API_BASE =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

export async function GET(request: NextRequest) {
  try {
    const authToken = request.headers.get("Authorization")

    if (!authToken) {
      return NextResponse.json(
        { success: false, message: "Authorization token required" },
        { status: 401 }
      )
    }

    const url = new URL(request.url)

    // 🔥 DETECT STATISTICS REQUEST
    if (url.pathname.endsWith("/statistics")) {
      const response = await fetch(
        `${LARAVEL_API_BASE}/api/orders/statistics`,
        {
          method: "GET",
          headers: {
            Authorization: authToken,
            Accept: "application/json",
          },
        }
      )

      const data = await response.json()

      if (!response.ok) {
        return NextResponse.json(
          { success: false, message: data.message || "Failed to fetch statistics" },
          { status: response.status }
        )
      }

      return NextResponse.json(data, { status: 200 })
    }

    // 🔹 NORMAL ORDERS FETCH
    const laravelUrl = new URL(`${LARAVEL_API_BASE}/api/orders`)
    url.searchParams.forEach((value, key) => {
      laravelUrl.searchParams.append(key, value)
    })

    const response = await fetch(laravelUrl.toString(), {
      method: "GET",
      headers: {
        Authorization: authToken,
        Accept: "application/json",
      },
    })

    const data = await response.json()

    if (!response.ok) {
      return NextResponse.json(
        { success: false, message: data.message || "Failed to fetch orders" },
        { status: response.status }
      )
    }

    return NextResponse.json(data, { status: 200 })
  } catch (error) {
    console.error("[API] Error:", error)
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    )
  }
}
