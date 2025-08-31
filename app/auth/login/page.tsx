import { LoginForm } from "@/components/auth/login-form"
import { BackButton } from "@/components/ui/back-button"

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4 relative">
      <BackButton />
      <LoginForm />
    </div>
  )
}
