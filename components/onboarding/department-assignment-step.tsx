"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { useOnboardingStore } from "@/lib/store"

// Mock departments for the employee to select from
const mockDepartments = [
  { id: "1", name: "Marketing", employeeCount: 5 },
  { id: "2", name: "Engineering", employeeCount: 12 },
  { id: "3", name: "Sales", employeeCount: 8 },
  { id: "4", name: "Operations", employeeCount: 4 },
]

export function DepartmentAssignmentStep() {
  const { data } = useOnboardingStore()
  const companyName = data.companySetup?.name || "Your Company"

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Department Assignment</h2>
        <p className="text-muted-foreground">Select your department at {companyName}.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Available Departments</CardTitle>
        </CardHeader>
        <CardContent>
          <RadioGroup defaultValue="1">
            {mockDepartments.map((dept) => (
              <div
                key={dept.id}
                className="flex items-center space-x-2 rounded-lg border p-4 transition-colors hover:bg-gray-50"
              >
                <RadioGroupItem value={dept.id} id={`dept-${dept.id}`} />
                <Label htmlFor={`dept-${dept.id}`} className="flex flex-1 cursor-pointer justify-between">
                  <span>{dept.name}</span>
                  <span className="text-sm text-muted-foreground">
                    {dept.employeeCount} {dept.employeeCount === 1 ? "employee" : "employees"}
                  </span>
                </Label>
              </div>
            ))}
          </RadioGroup>
        </CardContent>
      </Card>
    </div>
  )
}
