import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import { toast } from 'sonner';
import type { OnboardingData, UserRole, CompanySetup, DepartmentSetup } from '@/types';

interface OnboardingStep {
  step: 'company' | 'departments' | 'join' | 'department' | 'payman' | 'complete';
  userRole: UserRole;
  companySetup?: CompanySetup;
  departments?: Omit<DepartmentSetup, 'id'>[];
  selectedDepartmentId?: string;
  inviteCode?: string;
  paymanConnected?: boolean;
}

interface OnboardingUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  companyId?: string;
  departmentId?: string;
  onboardingCompleted: boolean;
  company?: {
    id: string;
    name: string;
    size: string;
    industry: string;
  } | null;
}

interface OnboardingDepartment {
  _id: string;
  name: string;
  monthlyBudget: number;
  currentSpent: number;
  employeeCount: number;
}

// API functions
const submitOnboardingStep = async (data: OnboardingStep): Promise<OnboardingUser> => {
  const response = await fetch('/api/onboarding', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.error || 'Failed to update onboarding');
  }

  return result.user;
};

const fetchOnboardingData = async (type: 'departments' | 'user'): Promise<any> => {
  const response = await fetch(`/api/onboarding?type=${type}`);
  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.error || 'Failed to fetch onboarding data');
  }

  return result;
};

export function useOnboardingAPI() {
  const { data: session, update: updateSession } = useSession();
  const queryClient = useQueryClient();

  // Mutations
  const onboardingMutation = useMutation({
    mutationFn: submitOnboardingStep,
    onSuccess: async (data, variables) => {
      // Update the session with new user data
      await updateSession();
      
      // Invalidate and refetch user data
      queryClient.invalidateQueries({ queryKey: ['onboarding', 'user'] });
      queryClient.invalidateQueries({ queryKey: ['onboarding', 'departments'] });

      if (variables.step === 'complete') {
        toast.success('Onboarding completed successfully!');
      }
    },
    onError: (error: Error) => {
      console.error('Onboarding submission error:', error);
      toast.error(error.message);
    },
  });

  // Queries
  const { data: departments = [], isLoading: isLoadingDepartments } = useQuery({
    queryKey: ['onboarding', 'departments'],
    queryFn: () => fetchOnboardingData('departments').then(result => result.departments || []),
    enabled: !!session?.user,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const { data: userData, isLoading: isLoadingUser } = useQuery({
    queryKey: ['onboarding', 'user'],
    queryFn: () => fetchOnboardingData('user').then(result => result.user),
    enabled: !!session?.user,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Helper functions
  const completeCompanySetup = async (companySetup: CompanySetup) => {
    return onboardingMutation.mutateAsync({
      step: 'company',
      userRole: 'admin',
      companySetup,
    });
  };

  const completeDepartmentSetup = async (departments: Omit<DepartmentSetup, 'id'>[]) => {
    return onboardingMutation.mutateAsync({
      step: 'departments',
      userRole: 'admin',
      departments,
    });
  };

  const completeJoinCompany = async (inviteCode: string) => {
    return onboardingMutation.mutateAsync({
      step: 'join',
      userRole: 'employee',
      inviteCode,
    });
  };

  const completeDepartmentAssignment = async (selectedDepartmentId: string) => {
    return onboardingMutation.mutateAsync({
      step: 'department',
      userRole: 'employee',
      selectedDepartmentId,
    });
  };

  const completePaymanIntegration = async (paymanConnected: boolean = true) => {
    return onboardingMutation.mutateAsync({
      step: 'payman',
      userRole: session?.user?.role as UserRole || 'employee',
      paymanConnected,
    });
  };

  const completeOnboarding = async () => {
    return onboardingMutation.mutateAsync({
      step: 'complete',
      userRole: session?.user?.role as UserRole || 'employee',
    });
  };

  const fetchDepartments = async (): Promise<OnboardingDepartment[]> => {
    try {
      const result = await fetchOnboardingData('departments');
      return result?.departments || [];
    } catch (error) {
      console.error('Error fetching departments:', error);
      toast.error('Failed to load departments');
      return [];
    }
  };

  const fetchUserData = async (): Promise<OnboardingUser | null> => {
    try {
      const result = await fetchOnboardingData('user');
      return result?.user || null;
    } catch (error) {
      console.error('Error fetching user data:', error);
      return null;
    }
  };

  return {
    isLoading: onboardingMutation.isPending,
    isLoadingDepartments,
    isLoadingUser,
    departments,
    userData,
    completeCompanySetup,
    completeDepartmentSetup,
    completeJoinCompany,
    completeDepartmentAssignment,
    completePaymanIntegration,
    completeOnboarding,
    fetchDepartments,
    fetchUserData,
  };
}
