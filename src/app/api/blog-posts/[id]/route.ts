const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const formData = await request.formData()

    formData.append("_method", "PUT")

    const response = await fetch(`${API_URL}/api/blog-posts/${params.id}`, {
      method: "POST", // Laravel uses POST with _method=PUT for FormData
      body: formData,
    })

    if (!response.ok) {
      throw new Error("Failed to update blog post")
    }

    const data = await response.json()
    return Response.json(data)
  } catch (error) {
    console.error("Blog API Error:", error)
    return Response.json({ error: "Failed to update blog post" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const response = await fetch(`${API_URL}/api/blog-posts/${params.id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      throw new Error("Failed to delete blog post")
    }

    const data = await response.json()
    return Response.json(data)
  } catch (error) {
    console.error("Blog API Error:", error)
    return Response.json({ error: "Failed to delete blog post" }, { status: 500 })
  }
}
