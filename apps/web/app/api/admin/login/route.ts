import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { token } = await request.json()

    if (!token || typeof token !== "string") {
      return NextResponse.json({ error: "Token is required" }, { status: 400 })
    }

    const adminToken = process.env.ADMIN_TOKEN

    if (!adminToken) {
      return NextResponse.json({ error: "Admin access not configured" }, { status: 503 })
    }

    if (token !== adminToken) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 })
    }

    const response = NextResponse.json({ success: true })

    response.cookies.set("admin_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24, // 24 hours
    })

    return response
  } catch {
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 })
  }
}
