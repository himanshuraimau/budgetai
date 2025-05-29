import { SignupForm } from "@/components/auth/signup-form"
import { AuthCard } from "@/components/auth/auth-card"

export default function SignupPage() {
  return (
    <AuthCard
      title="Create your account"
      description="Join thousands of smart shoppers using AI to find the perfect products"
    >
      <SignupForm />
    </AuthCard>
  )
}
