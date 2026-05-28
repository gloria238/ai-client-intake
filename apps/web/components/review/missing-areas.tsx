"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { HelpCircle } from "lucide-react"

export function MissingAreas({ unclearAreas }: { unclearAreas: string[] }) {
  if (!unclearAreas || unclearAreas.length === 0) return null

  return (
    <Card className="border-amber-200 bg-amber-50/50">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2 text-amber-800">
          <HelpCircle className="h-5 w-5" />
          We still don&apos;t fully understand
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          {unclearAreas.map((area) => (
            <li key={area} className="flex items-start gap-3 text-sm text-amber-900">
              <span className="mt-1 h-2 w-2 rounded-full bg-amber-400 shrink-0" />
              {area}
            </li>
          ))}
        </ul>
        <p className="mt-4 text-xs text-amber-600">
          These are completely optional — you can skip or answer. No pressure.
        </p>
      </CardContent>
    </Card>
  )
}
