import { NextResponse } from "next/server"
import { updateProjectStatus } from "@/lib/db"

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params
    await updateProjectStatus(id, "reviewed")

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Clarify error:", error)
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 })
  }
}
