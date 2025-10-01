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
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { FileUpload } from "@/components/ui/file-upload"
import { LocationPicker } from "@/components/maps/location-picker"
import { createQuerySchema } from "@/lib/validations"
import { MapPin, Mic, MicOff, AlertCircle, CheckCircle2, Info, Loader2, ArrowRight } from "lucide-react"
import type { z } from "zod"
import { useAuth } from "@/lib/auth-context"
import { FileText, Image as ImageIcon, X, Upload, Camera, Send } from "lucide-react"
import { useSpeechRecognition } from "@/hooks/use-speech-recognition"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

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
  const [success, setSuccess] = useState<string | null>(null)
  const [selectedDepartment, setSelectedDepartment] = useState("default")
  const [formStep, setFormStep] = useState(0)
  const [uploadProgress, setUploadProgress] = useState(0)
  const titleRef = useRef<HTMLInputElement | null>(null)
  const descriptionRef = useRef<HTMLTextAreaElement | null>(null)
  
  // Initialize form with useForm
  const form = useForm<QueryFormData>({
    resolver: zodResolver(createQuerySchema),
    defaultValues: {
      title: initialData?.title || "",
      description: initialData?.description || "",
      departmentId: initialData?.departmentId || "",
      officeId: initialData?.officeId || "",
      panchayatId: initialData?.panchayatId || user?.panchayat?.id || "",
      wardNumber: initialData?.wardNumber || user?.wardNumber || 1,
      latitude: initialData?.latitude || null,
      longitude: initialData?.longitude || null,
      attachments: initialData?.attachments || []
    },
    mode: "onChange"
  });

  const { 
    register, 
    handleSubmit, 
    setValue, 
    watch, 
    reset,
    trigger,
    formState: { errors, isValid },
    getValues,
    control
  } = form;
  
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
  const [location, setLocation] = useState<{lat: number; lng: number} | null>(null)
  const router = useRouter()

  // Speech recognition hooks for title and description with explicit language support
  const {
    isListening: isTitleListening,
    transcript: titleTranscript,
    error: titleError,
    startListening: startTitleListening,
    stopListening: stopTitleListening,
    resetTranscript: resetTitleTranscript,
    hasRecognitionSupport
  } = useSpeechRecognition({
    continuous: true,
    interimResults: true,
    lang: 'en-IN' // Using Indian English for better recognition
  })

  const {
    isListening: isDescriptionListening,
    transcript: descriptionTranscript,
    error: descriptionError,
    startListening: startDescriptionListening,
    stopListening: stopDescriptionListening,
    resetTranscript: resetDescriptionTranscript
  } = useSpeechRecognition({
    continuous: true,
    interimResults: true,
    lang: 'en-US' // Using English for description
  })

  // Track if this is the first run to prevent initial empty state updates
  const isInitialMount = useRef(true);
  
  // Handle speech recognition results for title
  useEffect(() => {
    if (!isInitialMount.current && titleTranscript) {
      setValue('title', titleTranscript, { 
        shouldValidate: true,
        shouldDirty: true,
        shouldTouch: true
      });
    }
  }, [titleTranscript, setValue]);

  // Handle speech recognition results for description
  useEffect(() => {
    if (!isInitialMount.current && descriptionTranscript) {
      setValue('description', descriptionTranscript, { 
        shouldValidate: true,
        shouldDirty: true,
        shouldTouch: true
      });
    }
  }, [descriptionTranscript, setValue]);

  // Set initial mount to false after first render
  useEffect(() => {
    isInitialMount.current = false;
  }, []);

  // Handle speech recognition errors
  useEffect(() => {
    if (titleError) {
      console.error('Title recognition error:', titleError);
      setError(`Title recognition error: ${titleError}`);
    }
    if (descriptionError) {
      console.error('Description recognition error:', descriptionError);
      setError(`Description recognition error: ${descriptionError}`);
    }
  }, [titleError, descriptionError]);

  const toggleTitleListening = async () => {
    try {
      if (isTitleListening) {
        stopTitleListening();
      } else {
        // Stop description if it's listening
        if (isDescriptionListening) {
          stopDescriptionListening();
          resetDescriptionTranscript();
        }
        resetTitleTranscript();
        await startTitleListening();
      }
    } catch (error) {
      console.error('Error in title speech recognition:', error);
      setError('Error accessing microphone. Please ensure you have granted microphone permissions and try again.');
    }
  };

  const toggleDescriptionListening = async () => {
    try {
      if (isDescriptionListening) {
        stopDescriptionListening();
      } else {
        // Stop title if it's listening
        if (isTitleListening) {
          stopTitleListening();
          resetTitleTranscript();
        }
        resetDescriptionTranscript();
        await startDescriptionListening();
      }
    } catch (error) {
      console.error('Error in description speech recognition:', error);
      setError('Error accessing microphone. Please ensure you have granted microphone permissions and try again.');
    }
  };

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

  // Watch all form values
  const formValues = watch()
  const watchedDepartmentId = watch("departmentId")
  const watchedTitle = watch("title")
  const watchedDescription = watch("description")
  const watchedPanchayatId = watch("panchayatId")
  const watchedWardNumber = watch("wardNumber")
  const watchedLatitude = watch("latitude")
  const watchedLongitude = watch("longitude")

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
          setError("Unable to get your location. Please check your browser settings.")
        }
      )
    } else {
      setError("Geolocation is not supported by this browser.")
    }
  }

  const handleLocationSelect = (selectedLocation: { lat: number; lng: number }) => {
    setLocation(selectedLocation)
    setValue("latitude", selectedLocation.lat)
    setValue("longitude", selectedLocation.lng)
  }

  const handleFileUpload = (files: UploadedFile[]) => {
    // Simulate upload progress
    setUploadProgress(0)
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval)
          return 100
        }
        return prev + 10
      })
    }, 200)

    // Add files to attachments
    setAttachments(prev => [
      ...prev,
      ...files.map(file => ({
        id: file.publicId,
        url: file.url,
        filename: file.name,
        type: file.type,
        size: file.size,
        publicId: file.publicId
      }))
    ])
  }

  const removeAttachment = (id: string) => {
    setAttachments(prev => prev.filter(att => att.id !== id))
  }

  const onSubmit = async (data: QueryFormData) => {
    try {
      setIsLoading(true);
      setError(null);
      setSuccess(null);
      
      // Prepare form data
      const formData = {
        ...data,
        // Convert empty strings to null for optional fields
        officeId: data.officeId || null,
        // Add attachments
        attachments: attachments.map(att => ({
          url: att.url,
          filename: att.filename,
          type: att.type,
          size: att.size,
          publicId: att.publicId
        })),
        // Add location if available
        ...(location && {
          latitude: location.lat,
          longitude: location.lng
        })
      };
      
      // Determine the API endpoint based on whether this is a new query or resubmission
      const endpoint = resubmitId 
        ? `/api/queries/resubmit/${resubmitId}` 
        : "/api/queries"
      
      console.log('Submitting form data:', formData);
      
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Failed to submit query")
      }
      
      setSuccess("Your query has been submitted successfully!")
      
      // Reset form after successful submission
      reset()
      setAttachments([])
      setLocation(null)
      setFormStep(0)
      
      // Redirect to dashboard after a short delay
      setTimeout(() => {
        router.push("/dashboard/voter")
        router.refresh()
      }, 2000)
      
    } catch (err) {
      console.error("Error submitting query:", err)
      setError(err instanceof Error ? err.message : "Failed to submit query. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  // Handle moving to the step with validation
  const nextStep = async (e: React.MouseEvent) => {
    e.preventDefault();
    console.log('Next button clicked, current step:', formStep);
    
    try {
      console.log('Starting validation for step:', formStep);
      let isValid = false;
      
      // Get current form values
      const currentValues = getValues();
      console.log('Current form values:', currentValues);
      
      if (formStep === 0) {
        console.log('Validating step 1 fields...');
        // Manually validate required fields for step 1
        const titleValid = !!currentValues.title?.trim();
        const descriptionValid = !!currentValues.description?.trim();
        
        console.log('Title valid:', titleValid);
        console.log('Description valid:', descriptionValid);
        
        if (!titleValid) {
          setError('Please enter a title for your query');
        } else if (!descriptionValid) {
          setError('Please enter a description for your query');
        }
        
        isValid = titleValid && descriptionValid;
      } else if (formStep === 1) {
        console.log('Validating step 2 fields...');
        // Manually validate required fields for step 2
        const deptValid = !!currentValues.departmentId;
        const panchayatValid = !!currentValues.panchayatId;
        
        console.log('Department valid:', deptValid);
        console.log('Panchayat valid:', panchayatValid);
        
        if (!deptValid) {
          setError('Please select a department');
        } else if (!panchayatValid) {
          setError('Please select a panchayat');
        }
        
        isValid = deptValid && panchayatValid;
      }
      
      console.log('Validation result:', isValid);
      
      if (isValid) {
        // Get current form state
        const values = getValues();
        console.log('Form values before next step:', values);
        
        setFormStep(prev => {
          const nextStep = Math.min(prev + 1, 2); // Ensure we don't go beyond step 2
          console.log('Moving to step:', nextStep);
          
          // Scroll to top when step changes
          requestAnimationFrame(() => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
          });
          
          return nextStep;
        });
      } else {
        console.log('Validation failed. Current errors:', errors);
        setError('Please fill in all required fields correctly.');
      }
    } catch (error) {
      console.error('Error in nextStep:', error);
      setError('Failed to proceed to the next step. Please check your inputs and try again.');
    }
  }

  const prevStep = () => {
    setFormStep(prev => prev - 1)
  }

  const getFormProgress = () => {
    if (formStep === 0) return 33
    if (formStep === 1) return 66
    return 100
  }

  return (
    <div>
    <Card className="w-full max-w-4xl mx-auto shadow-lg border-border/60 overflow-hidden">
      <CardHeader className="bg-muted/30 border-b border-border/60 pb-3">
        <CardTitle className="text-xl font-bold">
          {resubmitId ? "Resubmit Query" : "Submit New Query"}
        </CardTitle>
        <CardDescription>
          Fill out the form below to submit your query to the panchayat office
        </CardDescription>
        <Progress value={getFormProgress()} className="h-2 mt-2" />
      </CardHeader>
      
      <CardContent className="p-6">
        {error && (
          <Alert variant="destructive" className="mb-4 animate-in fade-in-50">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        {success && (
          <Alert className="mb-6 border-green-500 bg-green-50 dark:bg-green-950/20">
            <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
            <AlertTitle className="text-green-800 dark:text-green-200">Success!</AlertTitle>
            <AlertDescription className="text-green-700 dark:text-green-300">
              {success} You will be redirected to the dashboard shortly...
            </AlertDescription>
          </Alert>
        )}
        
        <form id="query-form" onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
          {formStep === 0 && (
            <div className="space-y-4 animate-in slide-in-from-left">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="title" className="text-base font-medium">
                    Query Title
                  </Label>
                  {hasRecognitionSupport && (
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={toggleTitleListening}
                            className={`${isTitleListening ? 'text-primary' : 'text-muted-foreground'}`}
                          >
                            {isTitleListening ? <Mic className="h-4 w-4" /> : <MicOff className="h-4 w-4" />}
                            {isTitleListening ? 'Stop' : 'Speak'}
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          {isTitleListening ? 'Stop voice input' : 'Use voice input for title'}
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  )}
                </div>
                <Input
                  id="title"
                  placeholder="Enter a clear title for your query"
                  {...register("title", { required: true })}
                  ref={(e) => {
                    titleRef.current = e;
                    register("title").ref(e);
                  }}
                  className={`${errors.title ? 'border-red-300 focus-visible:ring-red-200' : ''}`}
                />
                {errors.title && (
                  <p className="text-sm text-red-500 mt-1">{errors.title.message}</p>
                )}
                {isTitleListening && (
                  <div className="text-xs text-primary animate-pulse mt-1">
                    Listening... Speak clearly
                  </div>
                )}
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="description" className="text-base font-medium">
                    Query Description
                  </Label>
                  {hasRecognitionSupport && (
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={toggleDescriptionListening}
                            className={`${isDescriptionListening ? 'text-primary' : 'text-muted-foreground'}`}
                          >
                            {isDescriptionListening ? <Mic className="h-4 w-4" /> : <MicOff className="h-4 w-4" />}
                            {isDescriptionListening ? 'Stop' : 'Speak'}
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          {isDescriptionListening ? 'Stop voice input' : 'Use voice input for description'}
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  )}
                </div>
                <Textarea
                  id="description"
                  placeholder="Provide a detailed description of your query or issue"
                  {...register("description", { required: true })}
                  ref={(e) => {
                    descriptionRef.current = e;
                    register("description").ref(e);
                  }}
                  className={`min-h-[150px] ${errors.description ? 'border-red-300 focus-visible:ring-red-200' : ''}`}
                />
                {errors.description && (
                  <p className="text-sm text-red-500 mt-1">{errors.description.message}</p>
                )}
                {isDescriptionListening && (
                  <div className="text-xs text-primary animate-pulse mt-1">
                    Listening... Speak clearly
                  </div>
                )}
              </div>
            </div>
          )}
          
          {formStep === 1 && (
            <div className="space-y-4 animate-in slide-in-from-left">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="departmentId" className="text-base font-medium">
                    Department
                  </Label>
                  <Select
                    value={watchedDepartmentId}
                    onValueChange={(value) => setValue("departmentId", value, { shouldValidate: true })}
                  >
                    <SelectTrigger className={`${errors.departmentId ? 'border-red-300 focus-visible:ring-red-200' : ''}`}>
                      <SelectValue placeholder="Select a department" />
                    </SelectTrigger>
                    <SelectContent>
                      {departments.map((department) => (
                        <SelectItem key={department.id} value={department.id}>
                          {department.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.departmentId && (
                    <p className="text-sm text-red-500 mt-1">{errors.departmentId.message}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="officeId" className="text-base font-medium">
                    Office (Optional)
                  </Label>
                  <Select
                    value={watch("officeId") || ""}
                    onValueChange={(value) => setValue("officeId", value, { shouldValidate: true })}
                    disabled={!watchedDepartmentId || offices.length === 0}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={offices.length === 0 ? "No offices available" : "Select an office"} />
                    </SelectTrigger>
                    <SelectContent>
                      {offices.map((office) => (
                        <SelectItem key={office.id} value={office.id}>
                          {office.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="panchayatId" className="text-base font-medium">
                    Panchayat
                  </Label>
                  <Select
                    value={watchedPanchayatId}
                    onValueChange={(value) => setValue("panchayatId", value, { shouldValidate: true })}
                  >
                    <SelectTrigger className={`${errors.panchayatId ? 'border-red-300 focus-visible:ring-red-200' : ''}`}>
                      <SelectValue placeholder="Select a panchayat" />
                    </SelectTrigger>
                    <SelectContent>
                      {panchayats.map((panchayat) => (
                        <SelectItem key={panchayat.id} value={panchayat.id}>
                          {panchayat.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.panchayatId && (
                    <p className="text-sm text-red-500 mt-1">{errors.panchayatId.message}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="wardNumber" className="text-base font-medium">
                    Ward Number
                  </Label>
                  <Input
                    id="wardNumber"
                    type="number"
                    min={1}
                    {...register("wardNumber", { valueAsNumber: true })}
                    className={`${errors.wardNumber ? 'border-red-300 focus-visible:ring-red-200' : ''}`}
                  />
                  {errors.wardNumber && (
                    <p className="text-sm text-red-500 mt-1">{errors.wardNumber.message}</p>
                  )}
                </div>
              </div>
            </div>
          )}
          
          {formStep === 2 && (
            <div className="space-y-6 animate-in slide-in-from-left">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-base font-medium">Location</Label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={getCurrentLocation}
                    className="flex items-center gap-1"
                  >
                    <MapPin className="h-4 w-4" />
                    Use Current Location
                  </Button>
                </div>
                
                <div className="border rounded-md p-4 bg-muted/30">
                  {location ? (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="text-sm">
                          <span className="font-medium">Latitude:</span> {location.lat.toFixed(6)}
                          <br />
                          <span className="font-medium">Longitude:</span> {location.lng.toFixed(6)}
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => setShowLocationPicker(!showLocationPicker)}
                        >
                          {showLocationPicker ? "Hide Map" : "Show Map"}
                        </Button>
                      </div>
                      
                      {showLocationPicker && (
                        <div className="h-[300px] w-full rounded-md overflow-hidden border">
                          <LocationPicker
                            initialLocation={location}
                            onLocationSelect={handleLocationSelect}
                          />
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-6">
                      <MapPin className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                      <p className="text-muted-foreground">No location selected</p>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => setShowLocationPicker(!showLocationPicker)}
                        className="mt-2"
                      >
                        {showLocationPicker ? "Hide Map" : "Select on Map"}
                      </Button>
                      
                      {showLocationPicker && (
                        <div className="h-[300px] w-full rounded-md overflow-hidden border mt-4">
                          <LocationPicker
                            initialLocation={undefined}
                            onLocationSelect={handleLocationSelect}
                          />
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
              
              <div className="space-y-2">
                <Label className="text-base font-medium">Attachments</Label>
                <FileUpload onFilesChange={handleFileUpload} maxFiles={5} maxSize={5} />
                
                {uploadProgress > 0 && uploadProgress < 100 && (
                  <div className="space-y-1 mt-2">
                    <div className="flex items-center justify-between text-xs">
                      <span>Uploading...</span>
                      <span>{uploadProgress}%</span>
                    </div>
                    <Progress value={uploadProgress} className="h-1" />
                  </div>
                )}
                
                {attachments.length > 0 && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
                    {attachments.map((file) => (
                      <div
                        key={file.id}
                        className="flex items-center justify-between p-2 border rounded-md bg-muted/30"
                      >
                        <div className="flex items-center space-x-2 overflow-hidden">
                          {file.type.startsWith("image/") ? (
                            <ImageIcon className="h-4 w-4 text-blue-500" />
                          ) : (
                            <FileText className="h-4 w-4 text-orange-500" />
                          )}
                          <span className="text-sm truncate max-w-[180px]">
                            {file.filename}
                          </span>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeAttachment(file.id)}
                          className="h-6 w-6 p-0 text-muted-foreground hover:text-destructive"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
                <div className="space-y-4">
                  <Label className="text-lg font-semibold">Review Submission</Label>
                  <div className="border rounded-lg p-6 space-y-6 bg-card">
                    {/* Query Details */}
                    <div className="space-y-4">
                      <h3 className="font-medium text-foreground/80">Query Details</h3>
                      <div className="space-y-4">
                        <div>
                          <p className="text-sm font-medium text-muted-foreground mb-1">Title</p>
                          <div className="p-3 bg-background rounded-md border">
                            <p className="text-foreground">
                              {formValues.title ? (
                                formValues.title
                              ) : (
                                <span className="text-muted-foreground">No title provided</span>
                              )}
                            </p>
                          </div>
                        </div>
                        
                        <div>
                          <p className="text-sm font-medium text-muted-foreground mb-1">Description</p>
                          <div className="p-3 bg-background rounded-md border min-h-[80px]">
                            <p className="text-foreground whitespace-pre-wrap">
                              {formValues.description ? (
                                formValues.description
                              ) : (
                                <span className="text-muted-foreground">No description provided</span>
                              )}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Department & Location */}
                    <div className="space-y-4">
                      <h3 className="font-medium text-foreground/80">Department & Location</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm font-medium text-muted-foreground mb-1">Department</p>
                          <div className="p-3 bg-background rounded-md border">
                            <p className="text-foreground">
                              {departments.find(d => d.id === watchedDepartmentId)?.name || 
                               <span className="text-muted-foreground">Not selected</span>}
                            </p>
                          </div>
                        </div>
                        
                        <div>
                          <p className="text-sm font-medium text-muted-foreground mb-1">Panchayat</p>
                          <div className="p-3 bg-background rounded-md border">
                            <p className="text-foreground">
                              {panchayats.find(p => p.id === watchedPanchayatId)?.name || 
                               <span className="text-muted-foreground">Not selected</span>}
                            </p>
                          </div>
                        </div>
                        
                        <div>
                          <p className="text-sm font-medium text-muted-foreground mb-1">Ward Number</p>
                          <div className="p-3 bg-background rounded-md border">
                            <p className="text-foreground">
                              {watchedWardNumber || <span className="text-muted-foreground">Not specified</span>}
                            </p>
                          </div>
                        </div>
                        
                        {(location || (watchedLatitude && watchedLongitude)) && (
                          <div>
                            <p className="text-sm font-medium text-muted-foreground mb-1">Location</p>
                            <div className="p-3 bg-background rounded-md border space-y-1">
                              <p className="text-foreground">
                                <span className="font-mono">
                                  Lat: {(location?.lat || watchedLatitude)?.toFixed(6)}
                                </span>
                              </p>
                              <p className="text-foreground">
                                <span className="font-mono">
                                  Lng: {(location?.lng || watchedLongitude)?.toFixed(6)}
                                </span>
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Attachments */}
                    <div>
                      <h3 className="font-medium text-foreground/80 mb-2">Attachments</h3>
                      {attachments.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {attachments.map((file) => (
                            <div key={file.id} className="flex items-center justify-between p-3 bg-background rounded-md border">
                              <div className="flex items-center space-x-2 overflow-hidden">
                                {file.type.startsWith("image/") ? (
                                  <ImageIcon className="h-4 w-4 flex-shrink-0 text-blue-500" />
                                ) : (
                                  <FileText className="h-4 w-4 flex-shrink-0 text-orange-500" />
                                )}
                                <span className="text-sm truncate">
                                  {file.filename}
                                </span>
                              </div>
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                onClick={() => removeAttachment(file.id)}
                                className="h-6 w-6 p-0 text-muted-foreground hover:text-destructive"
                              >
                                <X className="h-3.5 w-3.5" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="p-4 bg-background rounded-md border text-center">
                          <p className="text-sm text-muted-foreground">No attachments</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </form>
      </CardContent>
      
      <CardFooter className="flex justify-between p-6 border-t border-border/60 bg-muted/30">
        {formStep > 0 ? (
          <Button
            type="button"
            variant="outline"
            onClick={prevStep}
            disabled={isLoading}
          >
            Previous
          </Button>
        ) : (
          <div></div>
        )}
        
        {formStep < 2 ? (
          <Button
            type="button"
            onClick={(e) => {
              console.log('Button onClick triggered');
              nextStep(e);
            }}
            disabled={isLoading}
            className="min-w-[120px] bg-blue-600 hover:bg-blue-700"
          >
            Next
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        ) : (
          <Button
            type="submit"
            form="query-form"
            disabled={isLoading}
            className="flex items-center gap-1"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Submitting...
              </>
            ) : (
              <>
                <Send className="h-4 w-4" />
                Submit Query
              </>
            )}
          </Button>
        )}
      </CardFooter>
    </Card>
  </div>
  )
}