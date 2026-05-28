import { createClient } from "@/lib/supabase/client"
import { createServiceClient } from "@/lib/supabase/service"
import type { IntakeResult, Project } from "@ai-delivery/schemas"

const SCHEMA = "clientintake"

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function client() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (createClient() as any).schema(SCHEMA)
}

function service() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (createServiceClient() as any).schema(SCHEMA)
}

export async function createProject(rawInput: string): Promise<string> {
  const { data, error } = await service()
    .from("projects")
    .insert({ raw_input: rawInput, status: "pending" })
    .select("id")
    .single()

  if (error) throw new Error("Failed to create project")
  return data.id
}

export async function updateProjectParsed(
  projectId: string,
  parsed: IntakeResult,
): Promise<void> {
  const { error } = await service()
    .from("projects")
    .update({
      parsed_output: parsed as unknown as Record<string, unknown>,
      status: "parsed",
      updated_at: new Date().toISOString(),
    })
    .eq("id", projectId)

  if (error) throw new Error("Failed to update project")
}

export async function getProject(projectId: string): Promise<Project> {
  const { data, error } = await client()
    .from("projects")
    .select("*")
    .eq("id", projectId)
    .single()

  if (error) throw new Error("Project not found")
  return data as Project
}

export async function updateProjectStatus(
  projectId: string,
  status: string,
): Promise<void> {
  const { error } = await service()
    .from("projects")
    .update({ status, updated_at: new Date().toISOString() })
    .eq("id", projectId)

  if (error) throw new Error("Failed to update status")
}
