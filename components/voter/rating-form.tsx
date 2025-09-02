"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Star, CheckCircle2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/lib/auth-context"

interface RatingFormProps {
  officeId: string
  officeName: string
  departmentName: string
  queryId: string
}

export function RatingForm({ officeId, officeName, departmentName, queryId }: RatingFormProps) {
  const [rating, setRating] = useState(0)
  const [hover, setHover] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [hasRated, setHasRated] = useState(false)
  const { toast } = useToast()
  const { user } = useAuth()

  // Check if user has already rated this office for this query
  useEffect(() => {
    const checkRating = async () => {
      try {
        const response = await fetch(`/api/queries/${queryId}/ratings?officeId=${officeId}`)
        if (response.ok) {
          const data = await response.json()
          const userRating = data.ratings?.find((r: any) => r.userId === user?.id)
          if (userRating) {
            setRating(userRating.rating)
            setHasRated(true)
          }
        }
      } catch (error) {
        console.error('Error checking rating:', error)
      }
    }

    if (user?.id) {
      checkRating()
    }
  }, [officeId, queryId, user?.id])

  const handleSubmit = async () => {
    if (rating === 0) {
      toast({
        title: "Please select a rating",
        description: "Click on the stars to rate this office.",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch("/api/ratings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          officeId,
          rating,
          queryId,
          comment: `Rating for ${officeName} (${departmentName})`,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to submit rating")
      }

      setHasRated(true)
      toast({
        title: "Thank you!",
        description: "Your rating has been submitted successfully.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to submit rating. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (hasRated) {
    return (
      <div className="flex items-center gap-2 text-green-600">
        <CheckCircle2 className="h-5 w-5" />
        <span>You rated: </span>
        <div className="flex">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              className={cn(
                "h-5 w-5",
                star <= rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
              )}
            />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            className={cn(
              "p-1 focus:outline-none",
              isSubmitting && "opacity-50 cursor-not-allowed"
            )}
            onClick={() => !isSubmitting && setRating(star)}
            onMouseEnter={() => !isSubmitting && setHover(star)}
            onMouseLeave={() => !isSubmitting && setHover(0)}
            disabled={isSubmitting}
          >
            <Star
              className={cn(
                "h-6 w-6",
                (hover || rating) >= star
                  ? "text-yellow-400 fill-yellow-400"
                  : "text-gray-300"
              )}
            />
          </button>
        ))}
      </div>
      <Button
        variant="outline"
        size="sm"
        onClick={handleSubmit}
        disabled={isSubmitting || rating === 0}
        className="mt-2"
      >
        {isSubmitting ? "Submitting..." : "Submit Rating"}
      </Button>
    </div>
  )
}
