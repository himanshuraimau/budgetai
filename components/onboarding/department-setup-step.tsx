"use client"

import { useState, useEffect } from "react"
import { PlusCircle, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useOnboardingStore } from "@/lib/store"
import { useOnboardingAPI } from "@/hooks/use-onboarding-api"
import { toast } from "sonner"
import type { DepartmentSetup } from "@/types"

export function DepartmentSetupStep() {
  const { data, addDepartment, removeDepartment, updateDepartment } = useOnboardingStore()
  const { completeDepartmentSetup, isLoading } = useOnboardingAPI()
  const [newDepartment, setNewDepartment] = useState({ name: "", monthlyBudget: "" })
  const [isSaving, setIsSaving] = useState(false)

  const handleAddDepartment = () => {
    if (newDepartment.name && newDepartment.monthlyBudget) {
      addDepartment({
        name: newDepartment.name,
        monthlyBudget: Number.parseFloat(newDepartment.monthlyBudget),
      })
      setNewDepartment({ name: "", monthlyBudget: "" })
    }
  }

  const handleUpdateDepartment = (id: string, field: keyof DepartmentSetup, value: string) => {
    if (field === "monthlyBudget") {
      updateDepartment(id, { [field]: Number.parseFloat(value) })
    } else {
      updateDepartment(id, { [field]: value })
    }
  }

  const saveDepartments = async () => {
    if (data.departments.length === 0) {
      toast.error("Please add at least one department")
      return
    }

    setIsSaving(true)
    try {
      const departmentsToSave = data.departments.map(dept => ({
        name: dept.name,
        monthlyBudget: dept.monthlyBudget,
      }))
      
      const result = await completeDepartmentSetup(departmentsToSave)
      if (result) {
        toast.success("Departments saved successfully!")
      }
    } catch (error) {
      console.error('Error saving departments:', error)
      toast.error("Failed to save departments")
    } finally {
      setIsSaving(false)
    }
  }

  // Default department suggestions
  const suggestedDepartments = [
    { name: "Marketing", budget: 10000 },
    { name: "Engineering", budget: 20000 },
    { name: "Sales", budget: 15000 },
    { name: "Operations", budget: 8000 },
  ]

  const handleAddSuggested = (name: string, budget: number) => {
    addDepartment({ name, monthlyBudget: budget })
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Department Setup</h2>
        <p className="text-muted-foreground">Create departments and set their monthly budgets.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Add Department</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4 sm:flex-row">
            <div className="flex-1 space-y-2">
              <Label htmlFor="departmentName">Department Name</Label>
              <Input
                id="departmentName"
                value={newDepartment.name}
                onChange={(e) => setNewDepartment({ ...newDepartment, name: e.target.value })}
                placeholder="e.g. Marketing"
              />
            </div>
            <div className="flex-1 space-y-2">
              <Label htmlFor="monthlyBudget">Monthly Budget ($)</Label>
              <Input
                id="monthlyBudget"
                type="number"
                value={newDepartment.monthlyBudget}
                onChange={(e) => setNewDepartment({ ...newDepartment, monthlyBudget: e.target.value })}
                placeholder="e.g. 10000"
              />
            </div>
            <div className="flex items-end">
              <Button
                onClick={handleAddDepartment}
                disabled={!newDepartment.name || !newDepartment.monthlyBudget}
                className="w-full sm:w-auto"
              >
                <PlusCircle className="mr-2 h-4 w-4" />
                Add
              </Button>
            </div>
          </div>

          {data.departments.length === 0 && (
            <div className="mt-6">
              <h3 className="mb-2 text-sm font-medium">Suggested Departments</h3>
              <div className="grid gap-2 sm:grid-cols-2">
                {suggestedDepartments.map((dept) => (
                  <Button
                    key={dept.name}
                    variant="outline"
                    className="justify-start"
                    onClick={() => handleAddSuggested(dept.name, dept.budget)}
                  >
                    <PlusCircle className="mr-2 h-4 w-4" />
                    {dept.name} (${dept.budget.toLocaleString()})
                  </Button>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {data.departments.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Your Departments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data.departments.map((dept) => (
                <div key={dept.id} className="flex flex-col gap-4 rounded-lg border p-4 sm:flex-row">
                  <div className="flex-1 space-y-2">
                    <Label htmlFor={`name-${dept.id}`}>Department Name</Label>
                    <Input
                      id={`name-${dept.id}`}
                      value={dept.name}
                      onChange={(e) => handleUpdateDepartment(dept.id, "name", e.target.value)}
                    />
                  </div>
                  <div className="flex-1 space-y-2">
                    <Label htmlFor={`budget-${dept.id}`}>Monthly Budget ($)</Label>
                    <Input
                      id={`budget-${dept.id}`}
                      type="number"
                      value={dept.monthlyBudget}
                      onChange={(e) => handleUpdateDepartment(dept.id, "monthlyBudget", e.target.value)}
                    />
                  </div>
                  <div className="flex items-end">
                    <Button
                      variant="destructive"
                      size="icon"
                      onClick={() => removeDepartment(dept.id)}
                      className="w-full sm:w-auto"
                    >
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Remove</span>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {data.departments.length > 0 && (
        <div className="flex justify-end">
          <Button 
            onClick={saveDepartments}
            disabled={isSaving || isLoading}
          >
            {isSaving ? "Saving..." : "Save Departments"}
          </Button>
        </div>
      )}
    </div>
  )
}
