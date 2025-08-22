"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ThumbsUp } from "lucide-react"

interface UpvoteButtonProps {
  queryId: string
  initialUpvoteCount: number
}

export function UpvoteButton({ queryId, initialUpvoteCount }: UpvoteButtonProps) {
  const [upvoteCount, setUpvoteCount] = useState(initialUpvoteCount)
  const [isUpvoting, setIsUpvoting] = useState(false)
  const [upvoted, setUpvoted] = useState(false) // You can add logic here to check if the user has already upvoted

  const handleUpvote = async () => {
    if (isUpvoting || upvoted) return

    setIsUpvoting(true)
    try {
      const response = await fetch(`/api/queries/${queryId}/upvote`, {
        method: "POST",
      })

      if (response.ok) {
        setUpvoteCount((prevCount) => prevCount + 1)
        setUpvoted(true)
      } else {
        const data = await response.json()
        console.error("Failed to upvote:", data.error.message)
        // Optionally, display a user-facing error message
      }
    } catch (error) {
      console.error("Error upvoting:", error)
    } finally {
      setIsUpvoting(false)
    }
  }

  return (
    <div className="flex items-center space-x-2">
      <Button
        variant="ghost"
        onClick={handleUpvote}
        disabled={isUpvoting || upvoted}
        className="px-2"
      >
        <ThumbsUp className={`h-4 w-4 ${upvoted ? "text-green-500 fill-green-500" : "text-gray-500"}`} />
      </Button>
      <span className="text-lg font-semibold text-gray-700">{upvoteCount}</span>
    </div>
  )
}