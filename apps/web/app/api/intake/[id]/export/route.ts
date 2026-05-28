import { NextResponse } from "next/server"
import { getProject, updateProjectStatus } from "@/lib/db"

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params
    const project = await getProject(id)
    await updateProjectStatus(id, "exported")

    return NextResponse.json(project)
  } catch (error) {
    console.error("Export error:", error)
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 })
  }
}
