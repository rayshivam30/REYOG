"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Star, Building, Users, CheckCircle, AlertCircle, Loader2, ThumbsUp } from "lucide-react"

interface Office {
  id: string
  name: string
  department: {
    name: string
  }
}

interface NGO {
  id: string
  name: string
  focusArea: string
}

interface QueryRatingProps {
  queryId: string
  queryTitle: string
  queryStatus: string
  onRatingComplete?: () => void
}

interface RatingData {
  officeId?: string
  ngoId?: string
  rating: number
  comment?: string
}

export function QueryRating({ queryId, queryTitle, queryStatus, onRatingComplete }: QueryRatingProps) {
  const [assignedOffices, setAssignedOffices] = useState<Office[]>([])
  const [assignedNgos, setAssignedNgos] = useState<NGO[]>([])
  const [ratings, setRatings] = useState<Map<string, RatingData>>(new Map())
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [existingRatings, setExistingRatings] = useState<any[]>([])

  // Check if query can be rated (must be RESOLVED status)
  const canRate = queryStatus === "RESOLVED"

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)
        const [assignmentsRes, ratingsRes] = await Promise.all([
          fetch(`/api/queries/${queryId}/assignments`),
          fetch(`/api/queries/${queryId}/ratings`)
        ])

        if (assignmentsRes.ok) {
          const assignmentsData = await assignmentsRes.json()
          const offices = assignmentsData.offices?.map((a: any) => ({
            id: a.office.id,
            name: a.office.name,
            department: a.office.department
          })) || []
          const ngos = assignmentsData.ngos?.map((a: any) => ({
            id: a.ngo.id,
            name: a.ngo.name,
            focusArea: a.ngo.focusArea
          })) || []
          
          setAssignedOffices(offices)
          setAssignedNgos(ngos)

          // Initialize ratings map
          const initialRatings = new Map<string, RatingData>()
          offices.forEach((office: Office) => {
            initialRatings.set(`office-${office.id}`, {
              officeId: office.id,
              rating: 0,
              comment: ""
            })
          })
          ngos.forEach((ngo: NGO) => {
            initialRatings.set(`ngo-${ngo.id}`, {
              ngoId: ngo.id,
              rating: 0,
              comment: ""
            })
          })
          setRatings(initialRatings)
        }

        if (ratingsRes.ok) {
          const ratingsData = await ratingsRes.json()
          setExistingRatings(ratingsData.ratings || [])

          // If ratings exist, populate the form
          if (ratingsData.ratings && ratingsData.ratings.length > 0) {
            const existingRatingsMap = new Map<string, RatingData>()
            ratingsData.ratings.forEach((rating: any) => {
              if (rating.officeId) {
                existingRatingsMap.set(`office-${rating.officeId}`, {
                  officeId: rating.officeId,
                  rating: rating.rating,
                  comment: rating.comment || ""
                })
              }
              if (rating.ngoId) {
                existingRatingsMap.set(`ngo-${rating.ngoId}`, {
                  ngoId: rating.ngoId,
                  rating: rating.rating,
                  comment: rating.comment || ""
                })
              }
            })
            setRatings(existingRatingsMap)
          }
        }
      } catch (err) {
        setError("Failed to load rating data")
        console.error("Error fetching rating data:", err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [queryId])

  const handleRatingChange = (key: string, rating: number) => {
    const currentRating = ratings.get(key) || { rating: 0, comment: "" }
    setRatings(new Map(ratings.set(key, { ...currentRating, rating })))
  }

  const handleCommentChange = (key: string, comment: string) => {
    const currentRating = ratings.get(key) || { rating: 0, comment: "" }
    setRatings(new Map(ratings.set(key, { ...currentRating, comment })))
  }

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true)
      setError(null)
      setSuccess(null)

      // Filter out ratings that haven't been set (rating > 0)
      const validRatings = Array.from(ratings.values()).filter(r => r.rating > 0)

      if (validRatings.length === 0) {
        setError("Please rate at least one office or NGO")
        return
      }

      const response = await fetch(`/api/queries/${queryId}/ratings`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ratings: validRatings
        }),
      })

      const result = await response.json()

      if (response.ok) {
        setSuccess(result.message)
        setExistingRatings(result.ratings)
        if (onRatingComplete) {
          onRatingComplete()
        }
      } else {
        setError(result.error?.message || "Failed to submit ratings")
      }
    } catch (err) {
      setError("An error occurred while submitting ratings")
    } finally {
      setIsSubmitting(false)
    }
  }

  const renderStarRating = (currentRating: number, onRatingSelect: (rating: number) => void, disabled = false) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            disabled={disabled}
            className={`${
              disabled ? "cursor-not-allowed" : "cursor-pointer hover:scale-110"
            } transition-transform`}
            onClick={() => !disabled && onRatingSelect(star)}
          >
            <Star
              className={`h-6 w-6 ${
                star <= currentRating
                  ? "text-yellow-400 fill-yellow-400"
                  : "text-gray-300 hover:text-yellow-200"
              }`}
            />
          </button>
        ))}
        <span className="ml-2 text-sm font-medium">
          {currentRating > 0 ? `${currentRating}/5` : "Not rated"}
        </span>
      </div>
    )
  }

  if (!canRate) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Rate Query Resolution</CardTitle>
          <CardDescription>Rate the offices and NGOs that handled your query</CardDescription>
        </CardHeader>
        <CardContent>
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Queries can only be rated after they have been resolved. 
              Current status: <Badge>{queryStatus}</Badge>
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    )
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Rate Query Resolution</CardTitle>
          <CardDescription>Loading rating form...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        </CardContent>
      </Card>
    )
  }

  const hasAssignments = assignedOffices.length > 0 || assignedNgos.length > 0
  const hasExistingRatings = existingRatings.length > 0

  if (!hasAssignments) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Rate Query Resolution</CardTitle>
          <CardDescription>No offices or NGOs were assigned to this query</CardDescription>
        </CardHeader>
        <CardContent>
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              This query was resolved without specific office or NGO assignments. 
              No ratings are available for this query.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ThumbsUp className="h-5 w-5" />
          Rate Query Resolution
        </CardTitle>
        <CardDescription>
          How satisfied were you with the resolution of "{queryTitle}"?
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert>
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>{success}</AlertDescription>
          </Alert>
        )}

        {hasExistingRatings && (
          <Alert>
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>
              You have already rated this query. You can update your ratings below.
            </AlertDescription>
          </Alert>
        )}

        {/* Rate Offices */}
        {assignedOffices.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Building className="h-5 w-5 text-blue-600" />
              <h3 className="text-lg font-semibold">Rate Government Offices</h3>
            </div>
            
            <div className="space-y-4">
              {assignedOffices.map((office) => {
                const key = `office-${office.id}`
                const currentRating = ratings.get(key)
                
                return (
                  <div key={office.id} className="p-4 border rounded-lg space-y-3">
                    <div>
                      <h4 className="font-medium">{office.name}</h4>
                      <p className="text-sm text-muted-foreground">{office.department.name}</p>
                    </div>
                    
                    <div>
                      <p className="text-sm font-medium mb-2">Your Rating:</p>
                      {renderStarRating(
                        currentRating?.rating || 0,
                        (rating) => handleRatingChange(key, rating)
                      )}
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium">
                        Comments (optional):
                      </label>
                      <Textarea
                        placeholder="Share your experience with this office..."
                        value={currentRating?.comment || ""}
                        onChange={(e) => handleCommentChange(key, e.target.value)}
                        className="mt-1"
                        rows={3}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {assignedOffices.length > 0 && assignedNgos.length > 0 && <Separator />}

        {/* Rate NGOs */}
        {assignedNgos.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Users className="h-5 w-5 text-green-600" />
              <h3 className="text-lg font-semibold">Rate Partner NGOs</h3>
            </div>
            
            <div className="space-y-4">
              {assignedNgos.map((ngo) => {
                const key = `ngo-${ngo.id}`
                const currentRating = ratings.get(key)
                
                return (
                  <div key={ngo.id} className="p-4 border rounded-lg space-y-3">
                    <div>
                      <h4 className="font-medium">{ngo.name}</h4>
                      <p className="text-sm text-muted-foreground">{ngo.focusArea}</p>
                    </div>
                    
                    <div>
                      <p className="text-sm font-medium mb-2">Your Rating:</p>
                      {renderStarRating(
                        currentRating?.rating || 0,
                        (rating) => handleRatingChange(key, rating)
                      )}
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium">
                        Comments (optional):
                      </label>
                      <Textarea
                        placeholder="Share your experience with this NGO..."
                        value={currentRating?.comment || ""}
                        onChange={(e) => handleCommentChange(key, e.target.value)}
                        className="mt-1"
                        rows={3}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Submit Button */}
        <div className="flex items-center justify-between pt-4 border-t">
          <div className="text-sm text-muted-foreground">
            Your feedback helps improve government services
          </div>
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="min-w-[120px]"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Submitting...
              </>
            ) : hasExistingRatings ? (
              "Update Ratings"
            ) : (
              "Submit Ratings"
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
