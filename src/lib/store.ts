import { create } from "zustand"
import { persist } from "zustand/middleware"
import type {
  User,
  Company,
  Department,
  PurchaseRequest,
  UserRole,
  RequestStatus,
} from "@/src/types"

// Auth Store
interface AuthState {
  user: User | null
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<void>
  signup: (email: string, password: string, name: string, role: UserRole) => Promise<void>
  logout: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      login: async (email, password) => {
        // Mock login - would be replaced with real auth
        const mockUser: User = {
          id: email.includes("admin") ? "1" : "2",
          email,
          name: email.includes("admin") ? "John Admin" : "Sarah Marketing",
          role: email.includes("admin") ? "admin" : "employee",
          companyId: "1",
          departmentId: email.includes("admin") ? undefined : "1",
          hasCompany: true,
        }
        set({ user: mockUser, isAuthenticated: true })
      },
      signup: async (email, password, name, role) => {
        // Mock signup - would be replaced with real auth
        const mockUser: User = {
          id: "1",
          email,
          name,
          role,
          companyId: undefined,
          departmentId: undefined,
          hasCompany: false,
        }
        set({ user: mockUser, isAuthenticated: true })
      },
      logout: () => {
        set({ user: null, isAuthenticated: false })
      },
    }),
    {
      name: "auth-storage",
    },
  ),
)

// Company Store
interface CompanyState {
  company: Company | null
  departments: Department[]
  fetchCompany: () => Promise<void>
  fetchDepartments: () => Promise<void>
  addDepartment: (department: Omit<Department, "id" | "companyId">) => Promise<void>
  updateDepartment: (id: string, data: Partial<Department>) => Promise<void>
  removeDepartment: (id: string) => Promise<void>
}

export const useCompanyStore = create<CompanyState>()((set) => ({
  company: null,
  departments: [],
  fetchCompany: async () => {
    // Mock fetch - would be replaced with real API call
    const mockCompany: Company = {
      id: "1",
      name: "Acme Inc",
      size: "11-50",
      industry: "Tech",
      adminId: "1",
      joinCode: "ABC123",
      createdAt: new Date().toISOString(),
    }
    set({ company: mockCompany })
  },
  fetchDepartments: async () => {
    // Mock fetch - would be replaced with real API call
    const mockDepartments: Department[] = [
      {
        id: "1",
        companyId: "1",
        name: "Marketing",
        monthlyBudget: 10000,
        currentSpent: 4500,
        employeeCount: 5,
      },
      {
        id: "2",
        companyId: "1",
        name: "Engineering",
        monthlyBudget: 20000,
        currentSpent: 12000,
        employeeCount: 12,
      },
      {
        id: "3",
        companyId: "1",
        name: "Sales",
        monthlyBudget: 15000,
        currentSpent: 9000,
        employeeCount: 8,
      },
    ]
    set({ departments: mockDepartments })
  },
  addDepartment: async (department) => {
    set((state) => ({
      departments: [
        ...state.departments,
        {
          id: Math.random().toString(36).substring(2, 9),
          companyId: state.company?.id || "1",
          ...department,
        },
      ],
    }))
  },
  updateDepartment: async (id, data) => {
    set((state) => ({
      departments: state.departments.map((dept) => (dept.id === id ? { ...dept, ...data } : dept)),
    }))
  },
  removeDepartment: async (id) => {
    set((state) => ({
      departments: state.departments.filter((dept) => dept.id !== id),
    }))
  },
}))

// Requests Store
interface RequestsState {
  requests: PurchaseRequest[]
  fetchRequests: () => Promise<void>
  addRequest: (request: Omit<PurchaseRequest, "id" | "status" | "submittedAt">) => Promise<void>
  updateRequestStatus: (id: string, status: RequestStatus, aiDecisionReason?: string) => Promise<void>
}

export const useRequestsStore = create<RequestsState>()((set) => ({
  requests: [],
  fetchRequests: async () => {
    // Mock fetch - would be replaced with real API call
    const mockRequests: PurchaseRequest[] = [
      {
        id: "1",
        employeeId: "2",
        departmentId: "1",
        amount: 250,
        description: "Social media ads",
        category: "Advertising",
        status: "approved",
        aiDecisionReason: "Within budget and aligns with department goals",
        submittedAt: "2023-05-15T10:30:00Z",
        processedAt: "2023-05-15T11:45:00Z",
      },
      {
        id: "2",
        employeeId: "3",
        departmentId: "2",
        amount: 1200,
        description: "New development laptops",
        category: "Equipment",
        status: "pending",
        submittedAt: "2023-05-16T09:15:00Z",
      },
      {
        id: "3",
        employeeId: "4",
        departmentId: "3",
        amount: 3500,
        description: "Conference booth",
        category: "Events",
        justification: "Major industry conference with potential clients",
        status: "denied",
        aiDecisionReason: "Exceeds monthly event budget allocation",
        submittedAt: "2023-05-14T14:20:00Z",
        processedAt: "2023-05-14T16:30:00Z",
      },
    ]
    set({ requests: mockRequests })
  },
  addRequest: async (request) => {
    const newRequest: PurchaseRequest = {
      id: Math.random().toString(36).substring(2, 9),
      status: "pending",
      submittedAt: new Date().toISOString(),
      ...request,
    }
    set((state) => ({
      requests: [...state.requests, newRequest],
    }))
  },
  updateRequestStatus: async (id, status, aiDecisionReason) => {
    set((state) => ({
      requests: state.requests.map((req) =>
        req.id === id
          ? {
              ...req,
              status,
              aiDecisionReason,
              processedAt: new Date().toISOString(),
            }
          : req,
      ),
    }))
  },
}))

// UI Store
interface UIState {
  isAddDepartmentModalOpen: boolean
  setAddDepartmentModalOpen: (isOpen: boolean) => void
}

export const useUIStore = create<UIState>()((set) => ({
  isAddDepartmentModalOpen: false,
  setAddDepartmentModalOpen: (isOpen) => set({ isAddDepartmentModalOpen: isOpen }),
}))
