import { LoginForm } from "@/components/auth/login-form"
import { AuthCard } from "@/components/auth/auth-card"

export default function LoginPage() {
  return (
    <AuthCard title="Welcome back" description="Sign in to your ShopAI account to continue your shopping journey">
      <LoginForm />
    </AuthCard>
  )
}
