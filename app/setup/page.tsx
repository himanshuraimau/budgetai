'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

export default function CompanySetupPage() {
  const [loading, setLoading] = useState(false);
  const [loadingPreview, setLoadingPreview] = useState(false);
  const [companyPreview, setCompanyPreview] = useState<any>(null);
  const router = useRouter();

  const [createForm, setCreateForm] = useState({
    name: '',
    size: '',
    industry: '',
  });

  const [joinForm, setJoinForm] = useState({
    joinCode: '',
    departmentId: '',
  });

  const fetchCompanyPreview = async (joinCode: string) => {
    if (joinCode.length !== 6) {
      setCompanyPreview(null);
      return;
    }

    setLoadingPreview(true);
    try {
      const response = await fetch(`/api/company/departments?joinCode=${joinCode}`);
      const data = await response.json();

      if (response.ok) {
        setCompanyPreview(data);
      } else {
        setCompanyPreview(null);
        if (data.error !== 'Invalid join code') {
          toast.error(data.error || 'Failed to fetch company information');
        }
      }
    } catch (error) {
      setCompanyPreview(null);
    } finally {
      setLoadingPreview(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      if (joinForm.joinCode) {
        fetchCompanyPreview(joinForm.joinCode);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [joinForm.joinCode]);

  const handleCreateCompany = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/company', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'create',
          ...createForm,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create company');
      }

      toast.success(`Company created! Join code: ${data.company.joinCode}`);
      router.push('/admin/dashboard');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to create company');
    } finally {
      setLoading(false);
    }
  };

  const handleJoinCompany = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/company', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'join',
          ...joinForm,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to join company');
      }

      toast.success(`Successfully joined ${data.company.name}!`);
      router.push('/employee/dashboard');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to join company');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Company Setup
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Create a new company or join an existing one
          </p>
        </div>

        <Tabs defaultValue="create" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="create">Create Company</TabsTrigger>
            <TabsTrigger value="join">Join Company</TabsTrigger>
          </TabsList>

          <TabsContent value="create">
            <Card>
              <CardHeader>
                <CardTitle>Create New Company</CardTitle>
                <CardDescription>
                  Set up your company and become an admin
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleCreateCompany} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="company-name">Company Name</Label>
                    <Input
                      id="company-name"
                      type="text"
                      placeholder="Enter company name"
                      value={createForm.name}
                      onChange={(e) => setCreateForm(prev => ({ ...prev, name: e.target.value }))}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="company-size">Company Size</Label>
                    <Select
                      value={createForm.size}
                      onValueChange={(value) => setCreateForm(prev => ({ ...prev, size: value }))}
                      required
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select company size" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1-10">1-10 employees</SelectItem>
                        <SelectItem value="11-50">11-50 employees</SelectItem>
                        <SelectItem value="51-200">51-200 employees</SelectItem>
                        <SelectItem value="200+">200+ employees</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="company-industry">Industry</Label>
                    <Select
                      value={createForm.industry}
                      onValueChange={(value) => setCreateForm(prev => ({ ...prev, industry: value }))}
                      required
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select industry" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Tech">Technology</SelectItem>
                        <SelectItem value="Finance">Finance</SelectItem>
                        <SelectItem value="Healthcare">Healthcare</SelectItem>
                        <SelectItem value="Retail">Retail</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? 'Creating...' : 'Create Company'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="join">
            <Card>
              <CardHeader>
                <CardTitle>Join Existing Company</CardTitle>
                <CardDescription>
                  Enter the company join code to become an employee
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleJoinCompany} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="join-code">Company Join Code</Label>
                    <Input
                      id="join-code"
                      type="text"
                      placeholder="Enter 6-character join code"
                      value={joinForm.joinCode}
                      onChange={(e) => {
                        const value = e.target.value.toUpperCase();
                        setJoinForm(prev => ({ ...prev, joinCode: value, departmentId: '' }));
                      }}
                      maxLength={6}
                      required
                    />
                    <p className="text-sm text-gray-500">
                      Ask your company admin for the join code
                    </p>
                  </div>

                  {loadingPreview && (
                    <div className="text-center py-4">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900 mx-auto"></div>
                      <p className="text-sm text-gray-500 mt-2">Loading company information...</p>
                    </div>
                  )}

                  {companyPreview && (
                    <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
                      <div>
                        <h4 className="font-medium text-gray-900">{companyPreview.company.name}</h4>
                        <p className="text-sm text-gray-500">
                          {companyPreview.company.industry} • {companyPreview.company.size} employees
                        </p>
                      </div>

                      {companyPreview.departments.length > 0 && (
                        <div className="space-y-2">
                          <Label htmlFor="department">Select Department (Optional)</Label>
                          <Select
                            value={joinForm.departmentId}
                            onValueChange={(value) => setJoinForm(prev => ({ ...prev, departmentId: value }))}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Choose a department" />
                            </SelectTrigger>
                            <SelectContent>
                              {companyPreview.departments.map((dept: any) => (
                                <SelectItem key={dept.id} value={dept.id}>
                                  {dept.name} ({dept.employeeCount} employees)
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <p className="text-xs text-gray-500">
                            You can be assigned to a department later if you skip this step
                          </p>
                        </div>
                      )}
                    </div>
                  )}

                  <Button 
                    type="submit" 
                    className="w-full" 
                    disabled={loading || !companyPreview}
                  >
                    {loading ? 'Joining...' : 'Join Company'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
