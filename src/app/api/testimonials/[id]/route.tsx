import { NextResponse } from "next/server"

export async function PUT(request: Request, { params }: { params: { id: string } }) {
    try {
        const { id } = params
        const body = await request.json()
        const apiUrl = process.env.NEXT_PUBLIC_API_URL
        if (!apiUrl) throw new Error("NEXT_PUBLIC_API_URL is not defined")

        const response = await fetch(`${apiUrl}/api/testimonials/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
        })

        if (!response.ok) throw new Error(`Backend returned ${response.status}`)

        const data = await response.json()
        return NextResponse.json(data)
    } catch (error) {
        console.error("Testimonials PUT Error:", error)
        return NextResponse.json({ error: "Failed to update testimonial" }, { status: 500 })
    }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
    try {
        const { id } = params
        const apiUrl = process.env.NEXT_PUBLIC_API_URL
        if (!apiUrl) throw new Error("NEXT_PUBLIC_API_URL is not defined")

        const response = await fetch(`${apiUrl}/api/testimonials/${id}`, {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
        })

        if (!response.ok) throw new Error(`Backend returned ${response.status}`)

        const data = await response.json()
        return NextResponse.json(data)
    } catch (error) {
        console.error("Testimonials DELETE Error:", error)
        return NextResponse.json({ error: "Failed to delete testimonial" }, { status: 500 })
    }
}
