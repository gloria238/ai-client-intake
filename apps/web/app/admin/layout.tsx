import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Admin — Blueprint",
  description: "Project pipeline and delivery management",
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-muted/30">
      <header className="border-b bg-background px-6 py-4 flex items-center justify-between">
        <a href="/admin" className="font-bold text-lg tracking-tight">
          Blueprint <span className="text-muted-foreground font-normal text-sm">Admin</span>
        </a>
        <a href="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
          Public site →
        </a>
      </header>
      {children}
    </div>
  )
}
