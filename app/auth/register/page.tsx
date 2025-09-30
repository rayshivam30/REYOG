import { RegisterForm } from "@/components/auth/register-form"
import { BackButton } from "@/components/ui/back-button"

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-indigo-100 p-4 relative dark:bg-gradient-to-br dark:from-slate-900 dark:to-slate-800">
      <BackButton />
      <RegisterForm />
    </div>
  )
}
