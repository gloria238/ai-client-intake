import { createClient } from "@supabase/supabase-js"

let serviceClient: ReturnType<typeof createClient> | null = null

export function createServiceClient() {
  if (serviceClient) return serviceClient

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!key) {
    throw new Error("SUPABASE_SERVICE_ROLE_KEY is not set")
  }

  serviceClient = createClient(url, key, {
    auth: { persistSession: false },
  })

  return serviceClient
}
