"use client"

import { useQuery } from "@tanstack/react-query"

interface CompanyInfo {
  user: {
    id: string
    email: string
    name: string
    role: string
    hasCompany: boolean
    companyId?: string
    departmentId?: string
  }
  company?: {
    id: string
    name: string
    size: string
    industry: string
    joinCode?: string
  }
}

export function useCompany() {
  const { data, isLoading, error, refetch } = useQuery<CompanyInfo>({
    queryKey: ['company'],
    queryFn: async () => {
      const response = await fetch('/api/company')
      if (!response.ok) {
        throw new Error('Failed to fetch company information')
      }
      return response.json()
    },
  })

  return {
    company: data?.company,
    user: data?.user,
    isLoading,
    error,
    refetch,
  }
}
