import NextAuth, { DefaultSession } from "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      role: string
      companyId: string
      departmentId?: string
      onboardingCompleted: boolean
    } & DefaultSession["user"]
  }

  interface User {
    role: string
    companyId: string
    departmentId?: string
    onboardingCompleted: boolean
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role: string
    companyId: string
    departmentId?: string
    onboardingCompleted: boolean
  }
}
