// app/auth/login/page.tsx
import { LoginForm } from "@/components/auth/login-form"
import { BackButton } from "@/components/ui/back-button"

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 via-white to-blue-50 p-6 relative">
      {/* Floating Back Button */}
      <div className="absolute top-6 left-6">
        <BackButton />
      </div>

      <LoginForm />
    </div>
  )
}
