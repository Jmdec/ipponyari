import { NextResponse } from "next/server"

const LARAVEL_API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

async function fetchDashboardAnalytics() {
  const response = await fetch(`${LARAVEL_API_BASE}/api/dashboard/analytics`, {
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  })

  if (!response.ok) {
    const errorText = await response.text()
    console.error(`Laravel Dashboard API error (${response.status}):`, errorText)
    throw new Error(`Dashboard API error: ${response.status} - ${errorText}`)
  }

  return response.json()
}

export async function GET() {
  try {
    console.log("[v0] Fetching analytics from Laravel DashboardController...")

    const analyticsResponse = await fetchDashboardAnalytics()

    if (analyticsResponse.success) {
      console.log("[v0] Successfully fetched analytics data")
      return NextResponse.json({
        success: true,
        data: analyticsResponse.data,
      })
    } else {
      throw new Error("Laravel API returned success: false")
    }
  } catch (error) {
    console.error("[v0] Dashboard API error:", error)

    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch analytics data from Laravel",
        message: error instanceof Error ? error.message : "Unknown error",
        data: {
          keyMetrics: {
            totalRevenue: 0,
            totalOrders: 0,
            averageOrderValue: 0,
            totalCustomers: 0,
            growthRate: 0,
          },
          revenueData: [],
          orderStatusData: [],
          paymentMethodData: [],
          popularProducts: [],
          categoryData: [],
        },
      },
      { status: 500 },
    )
  }
}
