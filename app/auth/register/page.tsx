import { RegisterForm } from "@/components/auth/register-form"
import { BackButton } from "@/components/ui/back-button"

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-100 p-4 relative">
      <BackButton />
      <RegisterForm />
    </div>
  )
}
