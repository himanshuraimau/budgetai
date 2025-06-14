import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
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

interface CreateRequestData {
  amount: number;
  description: string;
  category: string;
  justification?: string;
}

// API functions
const fetchEmployeeRequests = async (): Promise<PurchaseRequest[]> => {
  const response = await fetch('/api/employee/requests');
  if (!response.ok) {
    throw new Error('Failed to fetch requests');
  }
  const data = await response.json();
  return data.requests;
};

const fetchDepartments = async (): Promise<Department[]> => {
  const response = await fetch('/api/employee/departments');
  if (!response.ok) {
    throw new Error('Failed to fetch departments');
  }
  const data = await response.json();
  return data.departments;
};

const createRequest = async (requestData: CreateRequestData): Promise<PurchaseRequest> => {
  const response = await fetch('/api/employee/requests', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(requestData),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to create request');
  }

  return response.json();
};

export function useEmployeeAPI() {
  const { data: session } = useSession();
  const queryClient = useQueryClient();

  // Queries
  const {
    data: requests = [],
    isLoading: isRequestsLoading,
    error: requestsError,
  } = useQuery({
    queryKey: ['employee', 'requests'],
    queryFn: fetchEmployeeRequests,
    enabled: !!session?.user,
  });

  const {
    data: departments = [],
    isLoading: isDepartmentsLoading,
    error: departmentsError,
  } = useQuery({
    queryKey: ['departments'],
    queryFn: fetchDepartments,
    enabled: !!session?.user,
  });

  // Mutations
  const {
    mutateAsync: submitRequest,
    isPending: isSubmittingRequest,
  } = useMutation({
    mutationFn: createRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employee', 'requests'] });
      toast.success('Request submitted successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to submit request');
    },
  });

  // Derived data
  const userDepartment = (() => {
    if (!session?.user?.departmentId) {
      return departments[0]; // Fallback to first department
    }
    
    const foundDept = departments.find(dept => dept.id === session.user.departmentId);
    if (!foundDept && departments.length > 0) {
      return departments[0]; // Fallback to first department
    }
    
    return foundDept;
  })();

  const pendingRequestsCount = requests.filter(req => req.status === 'pending').length;
  const approvedRequestsCount = requests.filter(req => req.status === 'approved').length;
  const deniedRequestsCount = requests.filter(req => req.status === 'denied').length;

  // Calculate total amount requested this month
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  const thisMonthRequests = requests.filter(req => {
    const requestDate = new Date(req.submittedAt);
    return requestDate.getMonth() === currentMonth && requestDate.getFullYear() === currentYear;
  });
  const thisMonthAmount = thisMonthRequests.reduce((total, req) => total + req.amount, 0);

  return {
    // Data
    requests,
    departments,
    userDepartment,

    // Loading states
    isRequestsLoading,
    isDepartmentsLoading,
    isSubmittingRequest,

    // Errors
    requestsError,
    departmentsError,

    // Mutations
    submitRequest,

    // Derived data
    pendingRequestsCount,
    approvedRequestsCount,
    deniedRequestsCount,
    thisMonthAmount,
  };
}
