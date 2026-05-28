import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

const ADMIN_TOKEN = process.env.ADMIN_TOKEN

export function proxy(request: NextRequest) {
  // Only protect /admin routes
  if (!request.nextUrl.pathname.startsWith("/admin")) {
    return NextResponse.next()
  }

  // Skip auth for the login page and login API
  if (
    request.nextUrl.pathname === "/admin/login" ||
    request.nextUrl.pathname === "/api/admin/login"
  ) {
    return NextResponse.next()
  }

  // If ADMIN_TOKEN is not configured, block admin access entirely
  if (!ADMIN_TOKEN) {
    return new NextResponse("Admin access is not configured. Set ADMIN_TOKEN environment variable.", {
      status: 503,
    })
  }

  const token = request.cookies.get("admin_token")?.value

  if (token !== ADMIN_TOKEN) {
    return NextResponse.redirect(new URL("/admin/login", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/admin/:path*"],
}
