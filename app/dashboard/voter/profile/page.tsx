"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/lib/auth-context"
import { updateUserSchema } from "@/lib/validations"
import type { z } from "zod"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"

type ProfileFormData = z.infer<typeof updateUserSchema>

interface Panchayat {
  id: string
  name: string
  district: string
  state: string
}

export default function ProfilePage() {
  const { user, refreshUser } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [panchayats, setPanchayats] = useState<Panchayat[]>([])
  const { toast } = useToast()
  const router = useRouter()

  const form = useForm<ProfileFormData>({
    resolver: zodResolver(updateUserSchema),
    defaultValues: {
      name: user?.name || "",
      email: user?.email || "",
      phone: user?.phone || "",
      panchayatId: user?.panchayatId || "",
      wardNumber: user?.wardNumber || 1,
    },
  })

  useEffect(() => {
    // Fetch panchayats for the dropdown
    const fetchPanchayats = async () => {
      try {
        const response = await fetch("/api/panchayats")
        if (response.ok) {
          const data = await response.json()
          // Ensure data is an array before setting it
          if (Array.isArray(data)) {
            setPanchayats(data)
          } else {
            console.error("Expected an array of panchayats but got:", data)
            setPanchayats([])
          }
        } else {
          console.error("Failed to fetch panchayats:", response.statusText)
          setPanchayats([])
        }
      } catch (error) {
        console.error("Error fetching panchayats:", error)
        setPanchayats([])
      }
    }

    fetchPanchayats()
  }, [])

  const onSubmit = async (data: ProfileFormData) => {
    if (!user) return
    
    setIsLoading(true)
    setError("")

    try {
      const response = await fetch(`/api/users/${user.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (!response.ok) {
        setError(result.error?.message || "Failed to update profile")
        return
      }

      // Refresh user data
      await refreshUser()
      
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
      })
    } catch (err) {
      setError("An error occurred. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  if (!user) {
    return <div>Loading...</div>
  }

  return (
    <div className="container mx-auto py-8">
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Your Profile</CardTitle>
            <CardDescription>Update your personal information</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <div className="space-y-2">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter your full name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="space-y-2">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="Enter your email" {...field} disabled />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="space-y-2">
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone Number</FormLabel>
                        <FormControl>
                          <Input type="tel" placeholder="Enter your phone number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="space-y-2">
                  <FormField
                    control={form.control}
                    name="panchayatId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Panchayat</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select your panchayat" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {Array.isArray(panchayats) && panchayats.length > 0 ? (
                              panchayats.map((panchayat) => (
                                <SelectItem key={panchayat.id} value={panchayat.id}>
                                  {panchayat.name}, {panchayat.district}
                                </SelectItem>
                              ))
                            ) : (
                              <div className="p-2 text-sm text-muted-foreground">
                                No panchayats available. Please try again later.
                              </div>
                            )}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="space-y-2">
                  <FormField
                    control={form.control}
                    name="wardNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Ward Number</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min="1"
                            placeholder="Enter your ward number"
                            {...field}
                            onChange={(e) => field.onChange(parseInt(e.target.value, 10))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <Button type="submit" className="mt-4" disabled={isLoading}>
                  {isLoading ? "Updating..." : "Update Profile"}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
