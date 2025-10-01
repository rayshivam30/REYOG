"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { registerSchema } from "@/lib/validations"
import type { z } from "zod"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { AlertCircle, Loader2, UserPlus, Mail, Phone, Lock, MapPin, Eye, EyeOff, Home } from "lucide-react"
import Link from "next/link"

type RegisterFormData = z.infer<typeof registerSchema>

interface Panchayat {
  id: string
  name: string
  district: string
  state: string
}

export function RegisterForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [panchayats, setPanchayats] = useState<Panchayat[]>([])
  const [showPassword, setShowPassword] = useState(false)
  const router = useRouter()

  const form = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      phone: "",
      panchayatId: "",
      wardNumber: 1,
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

    fetchPanchayats()
  }, [])

  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true)
    setError("")

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (!response.ok) {
        setError(result.error?.message || "Registration failed")
        return
      }

      // Redirect to voter dashboard
      router.push("/dashboard/voter")
    } catch (err) {
      setError("An error occurred. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const togglePasswordVisibility = () => setShowPassword(!showPassword)

  return (
    <Card className="w-full max-w-lg mx-auto shadow-lg border-border/60 animate-fade-in">
      <CardHeader className="text-center space-y-2">
        <CardTitle className="text-xl sm:text-2xl font-bold">Create an Account</CardTitle>
        <CardDescription className="text-sm sm:text-base">
          Register to access government services and raise queries
        </CardDescription>
      </CardHeader>
      <CardContent className="p-4 sm:p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {error && (
              <Alert variant="destructive" className="animate-shake">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Name Field */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <div className="relative">
                      <UserPlus className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <FormControl>
                        <Input 
                          placeholder="Enter your full name" 
                          className="pl-10" 
                          {...field} 
                          disabled={isLoading}
                        />
                      </FormControl>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Email Field */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <FormControl>
                        <Input 
                          type="email" 
                          placeholder="Enter your email" 
                          className="pl-10" 
                          {...field} 
                          disabled={isLoading}
                        />
                      </FormControl>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Phone Field */}
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <FormControl>
                        <Input 
                          placeholder="Enter your phone number" 
                          className="pl-10" 
                          {...field} 
                          disabled={isLoading}
                        />
                      </FormControl>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Password Field */}
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <FormControl>
                        <Input 
                          type={showPassword ? "text" : "password"} 
                          placeholder="Create a password" 
                          className="pl-10" 
                          {...field} 
                          disabled={isLoading}
                        />
                      </FormControl>
                      <button
                        type="button"
                        onClick={togglePasswordVisibility}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        tabIndex={-1}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Panchayat Field */}
              <FormField
                control={form.control}
                name="panchayatId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Panchayat</FormLabel>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground z-10" />
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value} 
                        disabled={isLoading}
                      >
                        <FormControl>
                          <SelectTrigger className="pl-10">
                            <SelectValue placeholder="Select your panchayat" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {panchayats.length > 0 ? (
                            panchayats.map((panchayat) => (
                              <SelectItem key={panchayat.id} value={panchayat.id}>
                                {panchayat.name}, {panchayat.district}
                              </SelectItem>
                            ))
                          ) : (
                            <SelectItem value="loading" disabled>
                              No panchayats available
                            </SelectItem>
                          )}
                        </SelectContent>
                      </Select>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Ward Number Field */}
              <FormField
                control={form.control}
                name="wardNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ward Number</FormLabel>
                    <div className="relative">
                      <Home className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <FormControl>
                        <Input 
                          type="number" 
                          placeholder="Enter your ward number" 
                          className="pl-10" 
                          {...field} 
                          onChange={(e) => field.onChange(parseInt(e.target.value) || 1)}
                          disabled={isLoading}
                        />
                      </FormControl>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Button type="submit" className="w-full mt-6" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating Account...
                </>
              ) : (
                <>
                  <UserPlus className="mr-2 h-4 w-4" />
                  Create Account
                </>
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
      <CardFooter className="flex justify-center p-4 border-t">
        <p className="text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link href="/auth/login" className="text-primary font-medium hover:underline">
            Sign in
          </Link>
        </p>
      </CardFooter>
    </Card>
  )
}
