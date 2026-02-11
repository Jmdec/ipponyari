import { NextResponse } from "next/server"

export async function GET(request: Request) {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL
    if (!apiUrl) throw new Error("NEXT_PUBLIC_API_URL is not defined")

    const { searchParams } = new URL(request.url)
    const status = searchParams.get("status")

    const backendUrl = status
      ? `${apiUrl}/api/testimonials?status=${status}`
      : `${apiUrl}/api/testimonials`

    const response = await fetch(backendUrl, {
      headers: { "Content-Type": "application/json" },
      cache: "no-store",
    })

    if (!response.ok) throw new Error(`Backend returned ${response.status}`)

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error("Testimonials GET Error:", error)
    return NextResponse.json({ error: "Failed to fetch testimonials" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const apiUrl = process.env.NEXT_PUBLIC_API_URL
    if (!apiUrl) throw new Error("NEXT_PUBLIC_API_URL is not defined")

    const response = await fetch(`${apiUrl}/api/testimonials`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    })

    if (!response.ok) throw new Error(`Backend returned ${response.status}`)

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error("Testimonials POST Error:", error)
    return NextResponse.json({ error: "Failed to submit testimonial" }, { status: 500 })
  }
}
