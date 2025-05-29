import { ForgotPasswordForm } from "@/components/auth/forgot-password-form"
import { AuthCard } from "@/components/auth/auth-card"

export default function ForgotPasswordPage() {
  return (
    <AuthCard
      title="Reset your password"
      description="Enter your email address and we'll send you a link to reset your password"
    >
      <ForgotPasswordForm />
    </AuthCard>
  )
}
