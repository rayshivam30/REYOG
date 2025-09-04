"use client"

import { useState, useEffect, useRef } from "react"
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
import { MapPin, Mic, MicOff } from "lucide-react"
import type { z } from "zod"
import { useAuth } from "@/lib/auth-context"
import { FileText, Image as ImageIcon, X } from "lucide-react"
import { useSpeechRecognition } from "@/hooks/use-speech-recognition"

type QueryFormData = z.infer<typeof createQuerySchema>

interface Department {
  id: string
  name: string
  offices?: Office[]
}

interface Panchayat {
  id: string
  name: string
  district: string
  state: string
  _count?: {
    users: number
  }
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
  publicId: string
}

interface QueryFormProps {
  initialData?: any | null;
  resubmitId?: string | null;
}

export function QueryForm({ initialData, resubmitId }: QueryFormProps) {
  const { user } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedDepartment, setSelectedDepartment] = useState("default")
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null)
  const titleRef = useRef<HTMLInputElement | null>(null)
  const descriptionRef = useRef<HTMLTextAreaElement | null>(null)
  const { 
    register, 
    handleSubmit, 
    setValue, 
    watch, 
    reset, 
    formState: { errors } 
  } = useForm<QueryFormData>({
    resolver: zodResolver(createQuerySchema),
    defaultValues: initialData || {
      panchayatId: user?.panchayat?.id || "",
      wardNumber: user?.wardNumber || 1,
    },
  })
  const [attachments, setAttachments] = useState<Array<{
    id: string
    url: string
    filename: string
    type: string
    size: number
    publicId: string
  }>>([])
  const [showLocationPicker, setShowLocationPicker] = useState(false)
  const [departments, setDepartments] = useState<Department[]>([])
  const [offices, setOffices] = useState<Office[]>([])
  const [panchayats, setPanchayats] = useState<Panchayat[]>([])
  const router = useRouter()


  // Speech recognition hooks for title and description
  const {
    isListening: isTitleListening,
    transcript: titleTranscript,
    error: titleError,
    startListening: startTitleListening,
    stopListening: stopTitleListening,
    resetTranscript: resetTitleTranscript,
    hasRecognitionSupport
  } = useSpeechRecognition()

  const {
    isListening: isDescriptionListening,
    transcript: descriptionTranscript,
    error: descriptionError,
    startListening: startDescriptionListening,
    stopListening: stopDescriptionListening,
    resetTranscript: resetDescriptionTranscript
  } = useSpeechRecognition()

  // Handle speech recognition results
  useEffect(() => {
    if (titleTranscript && isTitleListening) {
      setValue('title', titleTranscript, { shouldValidate: true });
    }
  }, [titleTranscript, isTitleListening, setValue])

  useEffect(() => {
    if (descriptionTranscript && isDescriptionListening) {
      setValue('description', descriptionTranscript, { shouldValidate: true });
    }
  }, [descriptionTranscript, isDescriptionListening, setValue])

  // Handle speech recognition errors
  useEffect(() => {
    if (titleError) setError(`Title: ${titleError}`);
    if (descriptionError) setError(`Description: ${descriptionError}`);
  }, [titleError, descriptionError])

  const toggleTitleListening = () => {
    if (isTitleListening) {
      stopTitleListening();
    } else {
      // Stop description if it's listening
      if (isDescriptionListening) {
        stopDescriptionListening();
        resetDescriptionTranscript();
      }
      resetTitleTranscript();
      startTitleListening();
    }
  }

  const toggleDescriptionListening = () => {
    if (isDescriptionListening) {
      stopDescriptionListening();
    } else {
      // Stop title if it's listening
      if (isTitleListening) {
        stopTitleListening();
        resetTitleTranscript();
      }
      resetDescriptionTranscript();
      startDescriptionListening();
    }
  }


  useEffect(() => {
    if (initialData) {
      reset(initialData);
      if (initialData.latitude && initialData.longitude) {
        const loc = { lat: initialData.latitude, lng: initialData.longitude };
        setLocation(loc);
      }
      if (initialData.attachments) {
        setAttachments(initialData.attachments.map((att: any) => ({...att, id: att.publicId || att.id})));
      }
    }
  }, [initialData, reset]);

  const watchedDepartmentId = watch("departmentId")

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/departments');
        if (!response.ok) {
          throw new Error('Failed to fetch departments');
        }
        const data = await response.json();
        setDepartments(data.departments || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load departments');
        console.error('Error fetching departments:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDepartments();
  }, []);

  useEffect(() => {
    if (watchedDepartmentId && departments.length > 0) {
      const selectedDept = departments.find(dept => dept.id === watchedDepartmentId);
      if (selectedDept) {
        setOffices(selectedDept.offices || []);
      }
    } else {
      setOffices([]);
    }
  }, [watchedDepartmentId, departments]);

  useEffect(() => {
    // Fetch panchayats
    const fetchPanchayats = async () => {
      try {
        const response = await fetch("/api/panchayats");
        if (!response.ok) {
          throw new Error('Failed to fetch panchayats');
        }
        const data = await response.json();
        const panchayatList = Array.isArray(data.panchayats) ? data.panchayats : [];
        setPanchayats(panchayatList);

        // If user has a panchayat, set it in the form
        if (user?.panchayat?.id) {
          setValue("panchayatId", user.panchayat.id);
        } else if (panchayatList.length > 0) {
          // Set default panchayat if user doesn't have one
          setValue("panchayatId", panchayatList[0].id);
        }
      } catch (err) {
        console.error("Failed to fetch panchayats:", err);
        setError('Failed to load panchayats. Please try again later.');
      }
    };

    fetchPanchayats();
  }, [user, setValue]);

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

  const handleFilesChange = (files: Array<{
    id: string
    url: string
    filename: string
    type: string
    size: number
    publicId: string
  }>) => {
    setAttachments(files)
  }

  const onSubmit = async (data: QueryFormData) => {
    setIsLoading(true)
    setError(null)

    try {
      // Get the selected panchayat's name
      const selectedPanchayat = panchayats.find(p => p.id === data.panchayatId);
      
      if (!selectedPanchayat) {
        throw new Error('Please select a valid panchayat');
      }

      const queryData = {
        ...data,
        panchayatName: selectedPanchayat.name, // Add panchayatName to the request
        attachments: attachments.map((file) => ({
          url: file.url,
          filename: file.filename,
          type: file.type,
          size: file.size,
          publicId: file.publicId,
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

      // If this was a resubmission, delete the old query
      if (resubmitId) {
        await fetch(`/api/queries/${resubmitId}`, {
          method: 'DELETE',
        });
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
      <CardHeader className="p-4 md:p-6">
        <CardTitle className="text-lg md:text-xl">{initialData ? 'Resubmit Query' : 'Raise a New Query'}</CardTitle>
        <CardDescription>
          {initialData 
            ? 'Review and edit the details of your declined query before submitting again.'
            : 'Submit your concerns, requests, or complaints about government services in your area'}
        </CardDescription>
      </CardHeader>
      <CardContent className="p-4 md:p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 md:space-y-6">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="title">Query Title *</Label>
                {hasRecognitionSupport && (
                  <Button
                    type="button"
                    variant={isTitleListening ? 'destructive' : 'ghost'}
                    size="sm"
                    className="h-8 px-2 text-xs gap-1"
                    onClick={toggleTitleListening}
                  >
                    {isTitleListening ? (
                      <MicOff className="h-4 w-4" />
                    ) : (
                      <Mic className="h-4 w-4" />
                    )}
                    {isTitleListening ? 'Stop' : 'Speak'}
                  </Button>
                )}
              </div>
              <div className="relative">
                <Input 
                  id="title" 
                  placeholder="Brief description of your query"
                  {...register("title")}
                  className={isTitleListening ? 'ring-2 ring-blue-500' : ''}
                  ref={(e) => {
                    titleRef.current = e;
                    return register("title").ref(e);
                  }}
                />
                {isTitleListening && (
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <div className="h-3 w-3 rounded-full bg-red-500 animate-ping"></div>
                  </div>
                )}
              </div>
              {isTitleListening && (
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse"></span>
                  Listening... Speak now
                </p>
              )}
              {errors.title && <p className="text-sm text-destructive">{errors.title.message}</p>}
            </div>
            {errors.title && <p className="text-sm text-destructive">{errors.title.message}</p>}
          </div>

          <div className="space-y-2">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="description">Detailed Description *</Label>
                {hasRecognitionSupport && (
                  <Button
                    type="button"
                    variant={isDescriptionListening ? 'destructive' : 'ghost'}
                    size="sm"
                    className="h-8 px-2 text-xs gap-1"
                    onClick={toggleDescriptionListening}
                  >
                    {isDescriptionListening ? (
                      <MicOff className="h-4 w-4" />
                    ) : (
                      <Mic className="h-4 w-4" />
                    )}
                    {isDescriptionListening ? 'Stop' : 'Dictate'}
                  </Button>
                )}
              </div>
              <div className="relative">
                <Textarea
                  id="description"
                  placeholder="Provide detailed information about your query, including any relevant context"
                  rows={4}
                  className={isDescriptionListening ? 'ring-2 ring-blue-500' : ''}
                  {...register("description")}
                  ref={(e) => {
                    descriptionRef.current = e;
                    return register("description").ref(e);
                  }}
                />
                {isDescriptionListening && (
                  <div className="absolute top-3 right-3">
                    <div className="h-3 w-3 rounded-full bg-red-500 animate-ping"></div>
                  </div>
                )}
              </div>
              {isDescriptionListening && (
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse"></span>
                  Listening... Speak now
                </p>
              )}
              {errors.description && <p className="text-sm text-destructive">{errors.description.message}</p>}
            </div>
            {errors.description && <p className="text-sm text-destructive">{errors.description.message}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="panchayatId">Panchayat</Label>
              <Select 
                value={watch("panchayatId")}
                onValueChange={(value) => setValue("panchayatId", value)}
                disabled={!!user?.panchayat?.id || isLoading}
              >
                <SelectTrigger>
                  <SelectValue placeholder={
                    isLoading ? "Loading panchayats..." : 
                    user?.panchayat?.name || "Select panchayat"
                  } />
                </SelectTrigger>
                <SelectContent>
                  {panchayats.length > 0 ? (
                    panchayats.map((panchayat) => (
                      <SelectItem key={panchayat.id} value={panchayat.id}>
                        {panchayat.name} 
                        {panchayat.district ? `, ${panchayat.district}` : ''}
                      </SelectItem>
                    ))
                  ) : (
                    <div className="relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm text-muted-foreground">
                      {isLoading ? 'Loading...' : 'No panchayats available'}
                    </div>
                  )}
                </SelectContent>
              </Select>
              {user?.panchayat?.id && (
                <p className="text-xs text-muted-foreground">
                  Your panchayat is set based on your profile
                </p>
              )}
              {errors.panchayatId && (
                <p className="text-sm text-destructive">{errors.panchayatId.message}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="wardNumber">Ward Number</Label>
              <Input
                id="wardNumber"
                type="number"
                min="1"
                placeholder="Enter ward number"
                {...register("wardNumber", { valueAsNumber: true })}
                defaultValue={user?.wardNumber || 1}
                disabled={!!user?.wardNumber}
              />
              {user?.wardNumber && (
                <p className="text-xs text-muted-foreground">
                  Your ward number is set based on your profile
                </p>
              )}
              {errors.wardNumber && (
                <p className="text-sm text-destructive">{errors.wardNumber.message}</p>
              )}
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
            <div className="flex flex-col sm:flex-row gap-2">
              <Button type="button" variant="outline" onClick={getCurrentLocation} className="w-full sm:w-auto bg-transparent">
                <MapPin className="h-4 w-4 mr-2" />
                Use Current Location
              </Button>
              <Button type="button" variant="outline" onClick={() => setShowLocationPicker(!showLocationPicker)} className="w-full sm:w-auto">
                Pick on Map
              </Button>
              {location && (
                <div className="flex-1 p-2 bg-muted rounded-md text-sm">
                  Location: {location.lat.toFixed(4)}, {location.lng.toFixed(4)}
                </div>
              )}
            </div>
            <p className="text-xs text-muted-foreground">Adding your location helps us route your query to the nearest office</p>
            
            {/* Location Picker Dialog */}
            {showLocationPicker && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                <div className="bg-white rounded-lg p-4 w-full max-w-3xl max-h-[90vh] flex flex-col">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold">Select a location on the map</h3>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => setShowLocationPicker(false)}
                    >
                      Close
                    </Button>
                  </div>
                  <div className="flex-1 relative">
                    <LocationPicker 
                      initialLocation={location || undefined}
                      onLocationSelect={handleLocationSelect}
                      className="h-full w-full"
                    />
                  </div>
                  <div className="mt-4 flex flex-col sm:flex-row justify-end gap-2">
                    <Button 
                      type="button" 
                      variant="outline"
                      onClick={() => setShowLocationPicker(false)}
                      className="w-full sm:w-auto order-2 sm:order-1"
                    >
                      Cancel
                    </Button>
                    <Button 
                      type="button"
                      onClick={() => {
                        if (location) {
                          setShowLocationPicker(false);
                        } else {
                          alert('Please select a location on the map');
                        }
                      }}
                      className="w-full sm:w-auto order-1 sm:order-2"
                    >
                      Confirm Location
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="space-y-4">
            <div>
              <Label>Attachments (Optional)</Label>
              <p className="text-sm text-muted-foreground mb-2">
                Upload supporting documents or images (max 10MB each)
              </p>
              <FileUpload
                onFilesChange={handleFilesChange}
                maxFiles={5}
                maxSize={10}
                acceptedTypes={["image/*", "application/pdf", ".doc", ".docx", ".xls", ".xlsx"]}
              />
            </div>

            {/* Attachments Preview */}
            {attachments.length > 0 && (
              <div className="space-y-2">
                <p className="text-sm font-medium">Attachments ({attachments.length}/5)</p>
                <div className="space-y-2">
                  {attachments.map((file) => (
                    <div 
                      key={file.id}
                      className="flex items-center justify-between p-3 border rounded-lg bg-gray-50"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="p-2 rounded-md bg-white border">
                          {file.type.startsWith('image/') ? (
                            <ImageIcon className="h-5 w-5 text-blue-500" />
                          ) : (
                            <FileText className="h-5 w-5 text-blue-500" />
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-medium truncate">{file.filename}</p>
                          <p className="text-xs text-muted-foreground">
                            {(file.size / 1024).toFixed(1)} KB
                          </p>
                        </div>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-destructive"
                        onClick={() => {
                          setAttachments(attachments.filter((f) => f.id !== file.id))
                        }}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <Button type="submit" disabled={isLoading} className="flex-1 order-1">
              {isLoading ? "Submitting..." : "Submit Query"}
            </Button>
            <Button type="button" variant="outline" onClick={() => router.back()} className="flex-1 order-2">
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}