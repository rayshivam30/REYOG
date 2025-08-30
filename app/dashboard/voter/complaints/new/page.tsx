"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { toast } from "@/components/ui/use-toast"

export default function NewComplaintPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    subject: '',
    description: '',
    attachments: [] as string[]
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSelectChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      category: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch('/api/complaints', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error?.message || 'Failed to submit complaint')
      }

      toast({
        title: "Complaint submitted successfully",
        description: "Your complaint has been received and is under review.",
      })
      
      router.push(`/dashboard/voter/complaints`)
      router.refresh()
    } catch (error) {
      console.error('Error submitting complaint:', error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : 'Failed to submit complaint',
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="container mx-auto p-6 max-w-3xl">
      <div className="mb-6">
        <Link href="/dashboard/voter/complaints" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Complaints
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>File a New Complaint</CardTitle>
          <CardDescription>
            Please provide details about your complaint. Our team will review it and get back to you soon.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="subject">Subject *</Label>
              <Input
                id="subject"
                name="subject"
                placeholder="Briefly describe your complaint"
                value={formData.subject}
                onChange={handleChange}
                required
                minLength={5}
                maxLength={100}
              />
              <p className="text-sm text-muted-foreground">
                A clear, concise title for your complaint (5-100 characters)
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Please provide detailed information about your complaint..."
                rows={8}
                value={formData.description}
                onChange={handleChange}
                required
                minLength={20}
                maxLength={2000}
                className="min-h-[200px]"
              />
              <p className="text-sm text-muted-foreground">
                Be as detailed as possible (20-2000 characters). Include relevant dates, locations, and any reference numbers if applicable.
              </p>
            </div>

            <div className="flex justify-end space-x-4 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push('/dashboard/voter/complaints')}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Submitting...' : 'Submit Complaint'}
                {isSubmitting && <span className="ml-2">Please wait...</span>}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
