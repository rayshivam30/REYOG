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
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Building, 
  Hash, 
  Shield, 
  Calendar,
  Edit3,
  Save,
  CheckCircle,
  AlertCircle,
  Clock,
  FileText,
  MessageSquare
} from "lucide-react"

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
  const [profileStats, setProfileStats] = useState({
    totalQueries: 0,
    pendingQueries: 0,
    resolvedQueries: 0,
    totalComplaints: 0,
    memberSince: ""
  })
  const { toast } = useToast()
  const router = useRouter()

  const form = useForm<ProfileFormData>({
    resolver: zodResolver(updateUserSchema),
    defaultValues: {
      name: user?.name || "",
      email: user?.email || "",
      phone: user?.phone || "",
      panchayatId: user?.panchayat?.id || "",
      wardNumber: user?.wardNumber || 1,
    },
  })

  // Keep form values in sync with the latest user data
  useEffect(() => {
    if (user) {
      form.reset({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        panchayatId: user.panchayat?.id || "",
        wardNumber: user.wardNumber || 1,
      })
    }
  }, [user, form])

  useEffect(() => {
    // Fetch panchayats for the dropdown
    const fetchPanchayats = async () => {
      try {
        const response = await fetch("/api/panchayats")
        if (response.ok) {
          const data = await response.json()
          if (Array.isArray(data)) {
            setPanchayats(data)
          } else if (data && Array.isArray((data as any).panchayats)) {
            setPanchayats((data as any).panchayats)
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

    // Fetch user statistics
    const fetchUserStats = async () => {
      try {
        const [queriesRes, complaintsRes] = await Promise.all([
          fetch("/api/queries?scope=user"),
          fetch("/api/complaints")
        ])

        if (queriesRes.ok) {
          const queriesData = await queriesRes.json()
          const queries = queriesData.queries || []
          setProfileStats(prev => ({
            ...prev,
            totalQueries: queries.length,
            pendingQueries: queries.filter((q: any) =>
              ["PENDING_REVIEW", "ACCEPTED", "IN_PROGRESS"].includes(q.status),
            ).length,
            resolvedQueries: queries.filter((q: any) => ["RESOLVED", "CLOSED"].includes(q.status)).length,
          }))
        }

        if (complaintsRes.ok) {
          const complaintsData = await complaintsRes.json()
          const complaints = complaintsData.complaints || []
          setProfileStats(prev => ({
            ...prev,
            totalComplaints: complaints.length,
          }))
        }
      } catch (error) {
        console.error("Failed to fetch user stats:", error)
      }
    }

    fetchPanchayats()
    fetchUserStats()
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
        title: "Profile updated successfully!",
        description: "Your profile information has been updated.",
      })
    } catch (err) {
      setError("An error occurred. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  if (!user) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Profile Header Skeleton */}
            <div className="lg:col-span-3">
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-8 animate-pulse">
                <div className="flex items-center space-x-4">
                  <div className="w-20 h-20 bg-gray-200 rounded-full"></div>
                  <div className="space-y-2">
                    <div className="h-6 bg-gray-200 rounded w-48"></div>
                    <div className="h-4 bg-gray-200 rounded w-32"></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Stats Cards Skeleton */}
            <div className="lg:col-span-2">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="bg-white rounded-lg p-4 border animate-pulse">
                    <div className="h-4 bg-gray-200 rounded w-16 mb-2"></div>
                    <div className="h-6 bg-gray-200 rounded w-8"></div>
                  </div>
                ))}
              </div>
            </div>

            {/* Form Skeleton */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl border p-6 animate-pulse">
                <div className="space-y-6">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-20"></div>
                      <div className="h-10 bg-gray-200 rounded"></div>
                    </div>
                  ))}
                  <div className="h-10 bg-gray-200 rounded w-32 mt-6"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const selectedPanchayat = panchayats.find(p => p.id === user.panchayat?.id)

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Profile Header */}
        <div className="mb-8">
          <div className="bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 rounded-xl p-8 border border-blue-100">
            <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-6">
              <div className="relative">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                  {user.name?.charAt(0).toUpperCase() || 'U'}
                </div>
                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                  <CheckCircle className="w-3 h-3 text-white" />
                </div>
              </div>
              
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{user.name}</h1>
                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <Mail className="w-4 h-4" />
                    <span>{user.email}</span>
                  </div>
                  {user.phone && (
                    <div className="flex items-center gap-1">
                      <Phone className="w-4 h-4" />
                      <span>{user.phone}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-1">
                    <Shield className="w-4 h-4" />
                    <span>Voter</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                  <Calendar className="w-3 h-3 mr-1" />
                  Member since {new Date().getFullYear()}
                </Badge>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Statistics */}
          <div className="lg:col-span-1">
            <Card className="h-fit">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-blue-600" />
                  Your Activity
                </CardTitle>
                <CardDescription>Overview of your engagement</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">{profileStats.totalQueries}</div>
                    <div className="text-sm text-gray-600">Total Queries</div>
                  </div>
                  <div className="text-center p-4 bg-yellow-50 rounded-lg">
                    <div className="text-2xl font-bold text-yellow-600">{profileStats.pendingQueries}</div>
                    <div className="text-sm text-gray-600">Pending</div>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">{profileStats.resolvedQueries}</div>
                    <div className="text-sm text-gray-600">Resolved</div>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">{profileStats.totalComplaints}</div>
                    <div className="text-sm text-gray-600">Complaints</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Location Information */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-green-600" />
                  Location Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {selectedPanchayat ? (
                  <>
                    <div className="flex items-center gap-2">
                      <Building className="w-4 h-4 text-gray-500" />
                      <span className="font-medium">{selectedPanchayat.name}</span>
                    </div>
                    <div className="text-sm text-gray-600 ml-6">
                      {selectedPanchayat.district}, {selectedPanchayat.state}
                    </div>
                    <Separator />
                    <div className="flex items-center gap-2">
                      <Hash className="w-4 h-4 text-gray-500" />
                      <span className="font-medium">Ward {user.wardNumber}</span>
                    </div>
                  </>
                ) : (
                  <div className="text-sm text-gray-500">No panchayat assigned</div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Profile Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Edit3 className="w-5 h-5 text-indigo-600" />
                  Edit Profile
                </CardTitle>
                <CardDescription>Update your personal information and preferences</CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    {error && (
                      <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>{error}</AlertDescription>
                      </Alert>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center gap-2">
                              <User className="w-4 h-4" />
                              Full Name
                            </FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="Enter your full name" 
                                {...field}
                                className="focus:ring-2 focus:ring-blue-500"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center gap-2">
                              <Mail className="w-4 h-4" />
                              Email Address
                            </FormLabel>
                            <FormControl>
                              <Input 
                                type="email" 
                                placeholder="Enter your email" 
                                {...field} 
                                disabled
                                className="bg-gray-50"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center gap-2">
                              <Phone className="w-4 h-4" />
                              Phone Number
                            </FormLabel>
                            <FormControl>
                              <Input 
                                type="tel" 
                                placeholder="Enter your phone number" 
                                {...field}
                                className="focus:ring-2 focus:ring-blue-500"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="wardNumber"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center gap-2">
                              <Hash className="w-4 h-4" />
                              Ward Number
                            </FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                min="1"
                                placeholder="Enter your ward number"
                                {...field}
                                onChange={(e) => field.onChange(parseInt(e.target.value, 10))}
                                className="focus:ring-2 focus:ring-blue-500"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="panchayatId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2">
                            <Building className="w-4 h-4" />
                            Panchayat
                          </FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger className="focus:ring-2 focus:ring-blue-500">
                                <SelectValue placeholder="Select your panchayat" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <div className="p-2 text-xs text-muted-foreground">
                                {selectedPanchayat ? (
                                  <span>Current: {selectedPanchayat.name}, {selectedPanchayat.district}</span>
                                ) : (
                                  <span>No panchayat set</span>
                                )}
                              </div>
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

                    <div className="flex items-center gap-4 pt-4">
                      <Button 
                        type="submit" 
                        disabled={isLoading}
                        className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8"
                      >
                        {isLoading ? (
                          <>
                            <Clock className="w-4 h-4 mr-2 animate-spin" />
                            Updating...
                          </>
                        ) : (
                          <>
                            <Save className="w-4 h-4 mr-2" />
                            Update Profile
                          </>
                        )}
                      </Button>
                      
                      <Button 
                        type="button" 
                        variant="outline"
                        onClick={() => router.push('/dashboard/voter')}
                      >
                        Cancel
                      </Button>
                    </div>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
