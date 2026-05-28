"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Shield, Loader2 } from "lucide-react"

export default function AdminLoginPage() {
  const router = useRouter()
  const [token, setToken] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      })

      if (!res.ok) {
        setError("Invalid token")
        return
      }

      router.push("/admin")
      router.refresh()
    } catch {
      setError("Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-muted/30">
      <motion.form
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        onSubmit={handleSubmit}
        className="w-full max-w-sm space-y-6 rounded-2xl border-2 border-[#D1D5DB] bg-white p-8"
      >
        <div className="text-center space-y-2">
          <div className="flex justify-center">
            <Shield className="h-10 w-10 text-[#002FA7]" />
          </div>
          <h1 className="text-xl font-bold">Admin Access</h1>
          <p className="text-sm text-[#5A5F6B]">Enter the admin token to continue.</p>
        </div>

        <div className="space-y-3">
          <input
            type="password"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            placeholder="Admin token"
            className="w-full h-12 px-4 rounded-xl border-2 border-[#D1D5DB] text-base focus:border-[#002FA7] focus:outline-none focus:shadow-[0_0_0_4px_rgba(0,47,167,0.08)]"
            autoFocus
          />
          {error && (
            <p className="text-sm text-red-500 text-center">{error}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={loading || !token}
          className="w-full h-12 bg-[#002FA7] text-white font-semibold rounded-xl hover:bg-[#0028A0] active:scale-[0.98] disabled:opacity-30 disabled:pointer-events-none transition-all"
        >
          {loading ? <Loader2 className="h-5 w-5 animate-spin mx-auto" /> : "Sign in"}
        </button>
      </motion.form>
    </main>
  )
}
