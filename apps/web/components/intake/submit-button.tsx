"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight, Loader2 } from "lucide-react"

interface SubmitButtonProps {
  loading: boolean
  disabled: boolean
}

export function SubmitButton({ loading, disabled }: SubmitButtonProps) {
  return (
    <Button
      type="submit"
      size="lg"
      disabled={disabled || loading}
      className="group text-base px-8 h-14 rounded-2xl transition-all duration-300 hover:shadow-lg"
    >
      {loading ? (
        <>
          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
          Understanding your project...
        </>
      ) : (
        <>
          Let&apos;s understand your project
          <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
        </>
      )}
    </Button>
  )
}
