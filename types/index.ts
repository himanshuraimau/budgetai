// User types
export type UserRole = "admin" | "employee"
export type User = {
  id: string
  email: string
  name: string
  role: UserRole
  companyId?: string
  departmentId?: string
  hasCompany?: boolean
}

// Company types
export type Company = {
  id: string
  name: string
  size: "1-10" | "11-50" | "51-200" | "200+"
  industry: "Tech" | "Finance" | "Healthcare" | "Retail" | "Other"
  adminId: string
  joinCode?: string
  createdAt: string
}

// Department types
export type Department = {
  id: string
  companyId: string
  name: string
  monthlyBudget: number
  currentSpent: number
  employeeCount: number
}

// Request types
export type RequestStatus = "pending" | "approved" | "denied"
export type PurchaseRequest = {
  id: string
  employeeId: string
  departmentId: string
  amount: number
  description: string
  category: string
  justification?: string
  status: RequestStatus
  aiDecisionReason?: string
  submittedAt: string
  processedAt?: string
}

export type CompanySetup = {
  name: string
  size: "1-10" | "11-50" | "51-200" | "200+"
  industry: "Tech" | "Finance" | "Healthcare" | "Retail" | "Other"
}

// Auth types
export type SignInFormValues = {
  email: string
  password: string
}

export type SignUpFormValues = {
  name: string
  email: string
  password: string
  role: UserRole
}
