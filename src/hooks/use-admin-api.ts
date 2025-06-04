import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

// Types
interface Department {
  id: string;
  companyId: string;
  name: string;
  monthlyBudget: number;
  currentSpent: number;
  employeeCount: number;
}

interface PurchaseRequest {
  id: string;
  employeeId: string;
  departmentId: string;
  amount: number;
  description: string;
  category: string;
  status: 'pending' | 'approved' | 'denied';
  submittedAt: string;
  processedAt?: string;
  justification?: string;
  aiDecisionReason?: string;
}

interface Company {
  id: string;
  name: string;
  size: string;
  industry: string;
  totalBudget: number;
  totalSpent: number;
  employeeCount: number;
  departmentCount: number;
}

// API functions
const fetchDepartments = async (): Promise<Department[]> => {
  const response = await fetch('/api/admin/departments');
  if (!response.ok) {
    throw new Error('Failed to fetch departments');
  }
  const data = await response.json();
  return data.departments;
};

const createDepartment = async (department: Omit<Department, 'id' | 'companyId' | 'currentSpent'>): Promise<Department> => {
  const response = await fetch('/api/admin/departments', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(department),
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to create department');
  }
  
  const data = await response.json();
  return data.department;
};

const updateDepartment = async ({ id, ...department }: { id: string } & Partial<Department>): Promise<Department> => {
  const response = await fetch(`/api/admin/departments/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(department),
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to update department');
  }
  
  const data = await response.json();
  return data.department;
};

const deleteDepartment = async (id: string): Promise<void> => {
  const response = await fetch(`/api/admin/departments/${id}`, {
    method: 'DELETE',
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to delete department');
  }
};

const fetchRequests = async (filters?: { departmentId?: string; status?: string }): Promise<PurchaseRequest[]> => {
  const url = new URL('/api/admin/requests', window.location.origin);
  if (filters?.departmentId && filters.departmentId !== 'all') {
    url.searchParams.set('departmentId', filters.departmentId);
  }
  if (filters?.status && filters.status !== 'all') {
    url.searchParams.set('status', filters.status);
  }
  
  const response = await fetch(url.toString());
  if (!response.ok) {
    throw new Error('Failed to fetch requests');
  }
  const data = await response.json();
  return data.requests;
};

const updateRequestStatus = async ({ id, status, aiDecisionReason }: { 
  id: string; 
  status: 'approved' | 'denied' | 'pending'; 
  aiDecisionReason?: string; 
}): Promise<PurchaseRequest> => {
  const response = await fetch(`/api/admin/requests/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ status, aiDecisionReason }),
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to update request status');
  }
  
  const data = await response.json();
  return data.request;
};

const fetchCompany = async (): Promise<Company> => {
  const response = await fetch('/api/admin/company');
  if (!response.ok) {
    throw new Error('Failed to fetch company');
  }
  const data = await response.json();
  return data.company;
};

// Hook
export function useAdminAPI() {
  const queryClient = useQueryClient();

  // Departments
  const {
    data: departments = [],
    isLoading: isDepartmentsLoading,
    error: departmentsError,
  } = useQuery({
    queryKey: ['departments'],
    queryFn: fetchDepartments,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const createDepartmentMutation = useMutation({
    mutationFn: createDepartment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['departments'] });
      toast.success('Department created successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  const updateDepartmentMutation = useMutation({
    mutationFn: updateDepartment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['departments'] });
      toast.success('Department updated successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  const deleteDepartmentMutation = useMutation({
    mutationFn: deleteDepartment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['departments'] });
      toast.success('Department deleted successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  // Requests
  const {
    data: requests = [],
    isLoading: isRequestsLoading,
    error: requestsError,
  } = useQuery({
    queryKey: ['requests'],
    queryFn: () => fetchRequests(),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });

  const updateRequestStatusMutation = useMutation({
    mutationFn: updateRequestStatus,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['requests'] });
      toast.success('Request status updated successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  // Company
  const {
    data: company,
    isLoading: isCompanyLoading,
    error: companyError,
  } = useQuery({
    queryKey: ['company'],
    queryFn: fetchCompany,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });

  return {
    // Departments
    departments,
    isDepartmentsLoading,
    departmentsError,
    createDepartment: createDepartmentMutation.mutateAsync,
    updateDepartment: updateDepartmentMutation.mutateAsync,
    deleteDepartment: deleteDepartmentMutation.mutateAsync,
    isCreatingDepartment: createDepartmentMutation.isPending,
    isUpdatingDepartment: updateDepartmentMutation.isPending,
    isDeletingDepartment: deleteDepartmentMutation.isPending,

    // Requests
    requests,
    isRequestsLoading,
    requestsError,
    updateRequestStatus: updateRequestStatusMutation.mutateAsync,
    isUpdatingRequestStatus: updateRequestStatusMutation.isPending,

    // Company
    company,
    isCompanyLoading,
    companyError,
  };
}
