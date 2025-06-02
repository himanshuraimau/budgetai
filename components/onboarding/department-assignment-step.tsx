"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { useOnboardingStore } from "@/lib/store"
import { useOnboardingAPI } from "@/hooks/use-onboarding-api"
import { toast } from "sonner"

interface Department {
  _id: string;
  name: string;
  monthlyBudget: number;
  currentSpent: number;
  employeeCount: number;
}

export function DepartmentAssignmentStep() {
  const { data } = useOnboardingStore()
  const { completeDepartmentAssignment, isLoading, departments, isLoadingDepartments } = useOnboardingAPI()
  const [selectedDepartment, setSelectedDepartment] = useState<string>("")
  const [isAssigning, setIsAssigning] = useState(false)

  // Set initial selected department when departments load
  useEffect(() => {
    if (departments.length > 0 && !selectedDepartment) {
      setSelectedDepartment(departments[0]._id)
    }
  }, [departments, selectedDepartment])

  const handleAssignDepartment = async () => {
    if (!selectedDepartment) {
      toast.error("Please select a department")
      return
    }

    setIsAssigning(true)
    try {
      const result = await completeDepartmentAssignment(selectedDepartment)
      if (result) {
        toast.success("Successfully assigned to department!")
      }
    } catch (error) {
      console.error('Error assigning department:', error)
      toast.error("Failed to assign department")
    } finally {
      setIsAssigning(false)
    }
  }
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Department Assignment</h2>
        <p className="text-muted-foreground">Select your department to get started.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Available Departments</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoadingDepartments ? (
            <div className="flex items-center justify-center py-8">
              <div className="text-muted-foreground">Loading departments...</div>
            </div>
          ) : departments.length === 0 ? (
            <div className="flex items-center justify-center py-8">
              <div className="text-muted-foreground">No departments available</div>
            </div>
          ) : (
            <div className="space-y-4">
              <RadioGroup 
                value={selectedDepartment} 
                onValueChange={setSelectedDepartment}
              >
                {departments.map((dept: Department) => (
                  <div
                    key={dept._id}
                    className="flex items-center space-x-2 rounded-lg border p-4 transition-colors hover:bg-gray-50"
                  >
                    <RadioGroupItem value={dept._id} id={`dept-${dept._id}`} />
                    <Label htmlFor={`dept-${dept._id}`} className="flex flex-1 cursor-pointer justify-between">
                      <span>{dept.name}</span>
                      <span className="text-sm text-muted-foreground">
                        ${dept.monthlyBudget.toLocaleString()} monthly budget
                      </span>
                    </Label>
                  </div>
                ))}
              </RadioGroup>
              
              <Button 
                onClick={handleAssignDepartment}
                disabled={!selectedDepartment || isAssigning || isLoading}
                className="w-full mt-4"
              >
                {isAssigning ? "Assigning..." : "Join Department"}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
