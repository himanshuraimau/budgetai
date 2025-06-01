import { useState } from 'react';
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

export function useOnboardingAPI() {
  const { data: session, update: updateSession } = useSession();
  const [isLoading, setIsLoading] = useState(false);

  const submitOnboardingStep = async (data: OnboardingStep): Promise<OnboardingUser | null> => {
    if (!session?.user) {
      toast.error('Not authenticated');
      return null;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/onboarding', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        toast.error(result.error || 'Failed to update onboarding');
        return null;
      }

      // Update the session with new user data
      await updateSession();

      if (data.step === 'complete') {
        toast.success('Onboarding completed successfully!');
      }

      return result.user;
    } catch (error) {
      console.error('Onboarding submission error:', error);
      toast.error('Failed to update onboarding');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const fetchOnboardingData = async (type: 'departments' | 'user'): Promise<any> => {
    if (!session?.user) {
      return null;
    }

    try {
      const response = await fetch(`/api/onboarding?type=${type}`);
      const result = await response.json();

      if (!response.ok) {
        console.error('Failed to fetch onboarding data:', result.error);
        return null;
      }

      return result;
    } catch (error) {
      console.error('Onboarding fetch error:', error);
      return null;
    }
  };

  const completeCompanySetup = async (companySetup: CompanySetup) => {
    return await submitOnboardingStep({
      step: 'company',
      userRole: 'admin',
      companySetup,
    });
  };

  const completeDepartmentSetup = async (departments: Omit<DepartmentSetup, 'id'>[]) => {
    return await submitOnboardingStep({
      step: 'departments',
      userRole: 'admin',
      departments,
    });
  };

  const completeJoinCompany = async (inviteCode: string) => {
    return await submitOnboardingStep({
      step: 'join',
      userRole: 'employee',
      inviteCode,
    });
  };

  const completeDepartmentAssignment = async (selectedDepartmentId: string) => {
    return await submitOnboardingStep({
      step: 'department',
      userRole: 'employee',
      selectedDepartmentId,
    });
  };

  const completePaymanIntegration = async (paymanConnected: boolean = true) => {
    return await submitOnboardingStep({
      step: 'payman',
      userRole: session?.user?.role as UserRole || 'employee',
      paymanConnected,
    });
  };

  const completeOnboarding = async () => {
    return await submitOnboardingStep({
      step: 'complete',
      userRole: session?.user?.role as UserRole || 'employee',
    });
  };

  const fetchDepartments = async (): Promise<OnboardingDepartment[]> => {
    const result = await fetchOnboardingData('departments');
    return result?.departments || [];
  };

  const fetchUserData = async (): Promise<OnboardingUser | null> => {
    const result = await fetchOnboardingData('user');
    return result?.user || null;
  };

  return {
    isLoading,
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
