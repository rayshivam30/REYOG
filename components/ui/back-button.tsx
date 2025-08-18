"use client"

import { Button } from "@/components/ui/button"
import { ChevronLeft } from "lucide-react"
import { useRouter } from "next/navigation"

export function BackButton() {
  const router = useRouter()
  
  return (
    <Button 
      variant="ghost" 
      onClick={() => router.back()}
      className="absolute left-4 top-4 md:left-8 md:top-8"
    >
      <ChevronLeft className="h-4 w-4 mr-1" />
      Back
    </Button>
  )
}
