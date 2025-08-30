// components/auth/login-form.tsx
"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { loginSchema } from "@/lib/validations"
import { AlertCircle, User } from "lucide-react"
import type { z } from "zod"

type LoginFormData = z.infer<typeof loginSchema>

export function LoginForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true)
    setError("")

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (!response.ok) {
        if (result.error?.code === "ACCOUNT_BANNED") {
          setError("Your account has been banned due to some reason")
        } else {
          setError(result.error?.message || "Login failed")
        }
        return
      }

      const { user } = result
      switch (user.role) {
        case "VOTER":
          router.push("/dashboard/voter")
          break
        case "PANCHAYAT":
          router.push("/dashboard/panchayat")
          break
        case "ADMIN":
          router.push("/dashboard/admin")
          break
        default:
          router.push("/")
      }
    } catch {
      setError("An error occurred. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto shadow-xl rounded-2xl backdrop-blur-sm bg-white/80 border border-gray-200">
      <CardHeader className="text-center space-y-2">
        <div className="mx-auto w-14 h-14 rounded-full bg-indigo-100 flex items-center justify-center">
          <User className="h-7 w-7 text-indigo-600" />
        </div>
        <CardTitle className="text-2xl font-bold text-foreground">Welcome Back</CardTitle>
        <CardDescription className="text-muted-foreground">
          Sign in to continue to <span className="font-semibold text-indigo-600">ReYog</span>
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {error && (
            <Alert variant="destructive" className="rounded-lg">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              {...register("email")}
              className="focus:ring-2 focus:ring-indigo-500"
            />
            {errors.email && (
              <p className="text-sm text-red-500">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="Enter your password"
              {...register("password")}
              className="focus:ring-2 focus:ring-indigo-500"
            />
            {errors.password && (
              <p className="text-sm text-red-500">{errors.password.message}</p>
            )}
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Signing in...
              </span>
            ) : (
              "Sign in"
            )}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-muted-foreground">
            Don’t have an account?{" "}
            <Button
              variant="link"
              className="p-0 h-auto text-indigo-600 hover:underline"
              onClick={() => router.push("/auth/register")}
            >
              Register as Voter
            </Button>
          </p>
        </div>

        <div className="mt-6 p-4 bg-indigo-50 rounded-lg border border-indigo-100">
          <p className="text-sm font-medium mb-2 text-indigo-700">Demo Accounts</p>
          <div className="text-xs space-y-1 text-indigo-600">
            <p><strong>Admin:</strong> admin@reyog.gov.in / password123</p>
            <p><strong>Panchayat:</strong> bhopal.staff@reyog.gov.in / password123</p>
            <p><strong>Voter:</strong> ramesh.voter@gmail.com / password123</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
