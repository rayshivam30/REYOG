"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { FileUpload } from "@/components/ui/file-upload"
import { LocationPicker } from "@/components/maps/location-picker"
import { createQuerySchema } from "@/lib/validations"
import { MapPin } from "lucide-react"
import type { z } from "zod"

type QueryFormData = z.infer<typeof createQuerySchema>

interface Department {
  id: string
  name: string
}

interface Panchayat {
  id: string
  name: string
}

interface Office {
  id: string
  name: string
  address: string
  department: {
    name: string
  }
}

interface UploadedFile {
  id: string
  name: string
  size: number
  type: string
  url: string
}

export function QueryForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [departments, setDepartments] = useState<Department[]>([])
  const [panchayats, setPanchayats] = useState<Panchayat[]>([])
  const [offices, setOffices] = useState<Office[]>([])
  const [selectedDepartment, setSelectedDepartment] = useState("default")
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null)
  const [attachments, setAttachments] = useState<UploadedFile[]>([])
  const [showLocationPicker, setShowLocationPicker] = useState(false)
  const router = useRouter()

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<QueryFormData>({
    resolver: zodResolver(createQuerySchema),
  })

  const watchedDepartmentId = watch("departmentId")

  useEffect(() => {
    // Fetch departments
    fetch("/api/departments")
      .then((res) => res.json())
      .then((data) => setDepartments(data.departments || []))
      .catch((err) => console.error("Failed to fetch departments:", err))

    // Fetch panchayats
    fetch("/api/panchayats")
      .then((res) => res.json())
      .then((data) => setPanchayats(data.panchayats || []))
      .catch((err) => console.error("Failed to fetch panchayats:", err))
  }, [])

  useEffect(() => {
    // Fetch offices when department changes
    if (watchedDepartmentId) {
      const dept = departments.find((d) => d.id === watchedDepartmentId)
      if (dept) {
        fetch(`/api/offices?dept=${encodeURIComponent(dept.name)}`)
          .then((res) => res.json())
          .then((data) => setOffices(data.offices || []))
          .catch((err) => console.error("Failed to fetch offices:", err))
      }
    } else {
      setOffices([])
    }
  }, [watchedDepartmentId, departments])

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const newLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          }
          setLocation(newLocation)
          setValue("latitude", newLocation.lat)
          setValue("longitude", newLocation.lng)
        },
        (error) => {
          console.error("Error getting location:", error)
          alert("Unable to get your location. Please check your browser settings.")
        }
      )
    } else {
      alert("Geolocation is not supported by this browser.")
    }
  }

  const handleLocationSelect = (selectedLocation: { lat: number; lng: number }) => {
    setLocation(selectedLocation)
    setValue("latitude", selectedLocation.lat)
    setValue("longitude", selectedLocation.lng)
  }

  const onSubmit = async (data: QueryFormData) => {
    setIsLoading(true)
    setError("")

    try {
      const queryData = {
        ...data,
        attachments: attachments.map((file) => ({
          filename: file.name,
          url: file.url,
          size: file.size,
          type: file.type,
        })),
      }

      const response = await fetch("/api/queries", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(queryData),
      })

      const result = await response.json()

      if (!response.ok) {
        setError(result.error?.message || "Failed to create query")
        return
      }

      router.push("/dashboard/voter/queries")
    } catch (err) {
      setError("An error occurred. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Raise a New Query</CardTitle>
        <CardDescription>
          Submit your concerns, requests, or complaints about government services in your area
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="title">Query Title *</Label>
            <Input id="title" placeholder="Brief description of your query" {...register("title")} />
            {errors.title && <p className="text-sm text-destructive">{errors.title.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Detailed Description *</Label>
            <Textarea
              id="description"
              placeholder="Provide detailed information about your query, including any relevant context"
              rows={4}
              {...register("description")}
            />
            {errors.description && <p className="text-sm text-destructive">{errors.description.message}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="panchayatId">Panchayat *</Label>
              <Select onValueChange={(value) => setValue("panchayatId", value)} value={watch("panchayatId")}>
                <SelectTrigger>
                  <SelectValue placeholder="Select your Panchayat" />
                </SelectTrigger>
                <SelectContent>
                  {panchayats.map((panchayat) => (
                    <SelectItem key={panchayat.id} value={panchayat.id}>
                      {panchayat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.panchayatId && <p className="text-sm text-destructive">{errors.panchayatId.message}</p>}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="wardNumber">Ward Number *</Label>
              <Input
                id="wardNumber"
                type="number"
                placeholder="Enter your ward number"
                {...register("wardNumber", { valueAsNumber: true })}
              />
              {errors.wardNumber && <p className="text-sm text-destructive">{errors.wardNumber.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Department (Optional)</Label>
              <Select
                value={selectedDepartment}
                onValueChange={(value) => {
                  setSelectedDepartment(value)
                  setValue("departmentId", value === "default" ? undefined : value)
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select department" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="default">Let app suggest</SelectItem>
                  {departments.map((dept) => (
                    <SelectItem key={dept.id} value={dept.id}>
                      {dept.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Specific Office (Optional)</Label>
              <Select
                value={watch("officeId") || "default"}
                onValueChange={(value) => setValue("officeId", value === "default" ? undefined : value)}
                disabled={!watchedDepartmentId || watchedDepartmentId === "default"}
              >
                <SelectTrigger>
                  <SelectValue placeholder={watchedDepartmentId && watchedDepartmentId !== "default" ? "Select office" : "Select department first"} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="default">Any office in department</SelectItem>
                  {offices.map((office) => (
                    <SelectItem key={office.id} value={office.id}>
                      {office.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Location (Optional)</Label>
            <div className="flex gap-2">
              <Button type="button" variant="outline" onClick={getCurrentLocation} className="flex-shrink-0 bg-transparent">
                <MapPin className="h-4 w-4 mr-2" />
                Use Current Location
              </Button>
              <Button type="button" variant="outline" onClick={() => setShowLocationPicker(!showLocationPicker)} className="flex-shrink-0">
                Pick on Map
              </Button>
              {location && (
                <div className="flex-1 p-2 bg-muted rounded-md text-sm">
                  Location: {location.lat.toFixed(4)}, {location.lng.toFixed(4)}
                </div>
              )}
            </div>
            <p className="text-xs text-muted-foreground">Adding your location helps us route your query to the nearest office</p>
          </div>

          <div className="space-y-2">
            <Label>Attachments (Optional)</Label>
            <FileUpload
              onFilesChange={setAttachments}
              maxFiles={5}
              maxSize={10}
              acceptedTypes={["image/*", "application/pdf", ".doc", ".docx"]}
            />
          </div>

          <div className="flex gap-4">
            <Button type="submit" disabled={isLoading} className="flex-1">
              {isLoading ? "Submitting..." : "Submit Query"}
            </Button>
            <Button type="button" variant="outline" onClick={() => router.back()} className="flex-1">
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}