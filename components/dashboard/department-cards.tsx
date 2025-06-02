"use client"
import { Building2, Edit, Users } from "lucide-react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { BudgetProgress } from "@/components/ui/budget-progress"
import { Button } from "@/components/ui/button"
import { useAdminAPI } from "@/hooks/use-admin-api"
import Link from "next/link"

export function DepartmentCards() {
  const { departments, isDepartmentsLoading } = useAdminAPI()

  return (
    <>
      {isDepartmentsLoading ? (
        <div className="flex items-center justify-center py-8">
          <div className="text-muted-foreground">Loading departments...</div>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {departments.map((department) => (
        <Card key={department.id} className="overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-lg font-medium">{department.name}</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${department.monthlyBudget.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Monthly budget</p>

            <div className="mt-4">
              <BudgetProgress spent={department.currentSpent} budget={department.monthlyBudget} />
            </div>

            <div className="mt-4 flex items-center">
              <Users className="mr-2 h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                {department.employeeCount} {department.employeeCount === 1 ? "employee" : "employees"}
              </span>
            </div>
          </CardContent>
          <CardFooter>
            <Link href="/admin/departments" className="w-full">
              <Button variant="outline" size="sm" className="w-full">
                <Edit className="mr-2 h-4 w-4" />
                Manage Departments
              </Button>
            </Link>
          </CardFooter>
        </Card>
      ))}

      <Link href="/admin/departments" className="block">
        <Card className="flex h-full flex-col items-center justify-center p-6">
          <div className="rounded-full bg-emerald-100 p-3">
            <Building2 className="h-6 w-6 text-emerald-600" />
          </div>
          <h3 className="mt-4 text-lg font-medium">Add Department</h3>
          <p className="mt-2 text-center text-sm text-muted-foreground">Create a new department and set its budget</p>
          <Button className="mt-4 w-full">Add Department</Button>
        </Card>
      </Link>
    </div>
      )}
    </>
  )
}
