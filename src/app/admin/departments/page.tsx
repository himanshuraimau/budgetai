"use client"

import { useState } from "react"
import { Plus, Edit, Trash2 } from "lucide-react"
import { DashboardHeader } from "@/components/layout/dashboard-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { BudgetProgress } from "@/components/ui/budget-progress"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useAdminAPI } from "@/src/hooks/use-admin-api"
import type { Department } from "@/src/types"

export default function AdminDepartmentsPage() {
  const { 
    departments, 
    createDepartment, 
    updateDepartment, 
    deleteDepartment,
    isDepartmentsLoading,
    isCreatingDepartment,
    isUpdatingDepartment,
    isDeletingDepartment
  } = useAdminAPI()
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [currentDepartment, setCurrentDepartment] = useState<Department | null>(null)
  const [newDepartment, setNewDepartment] = useState({
    name: "",
    monthlyBudget: "",
    employeeCount: "0",
  })

  const handleAddDepartment = async () => {
    try {
      await createDepartment({
        name: newDepartment.name,
        monthlyBudget: Number(newDepartment.monthlyBudget),
        employeeCount: Number(newDepartment.employeeCount),
      })
      setNewDepartment({ name: "", monthlyBudget: "", employeeCount: "0" })
      setIsAddDialogOpen(false)
    } catch (error) {
      // Error handling is done in the hook
    }
  }

  const handleEditDepartment = async () => {
    if (!currentDepartment) return

    try {
      await updateDepartment({
        id: currentDepartment.id,
        name: currentDepartment.name,
        monthlyBudget: currentDepartment.monthlyBudget,
        employeeCount: currentDepartment.employeeCount,
      })
      setIsEditDialogOpen(false)
    } catch (error) {
      // Error handling is done in the hook
    }
  }

  const handleDeleteDepartment = async () => {
    if (!currentDepartment) return

    try {
      await deleteDepartment(currentDepartment.id)
      setIsDeleteDialogOpen(false)
    } catch (error) {
      // Error handling is done in the hook
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      <DashboardHeader />

      <main className="flex-1 space-y-8 p-8">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-3xl font-bold">Departments</h1>
            <p className="text-muted-foreground">Manage your company's departments and budgets</p>
          </div>

          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Department
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Department</DialogTitle>
                <DialogDescription>Create a new department and set its budget.</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Department Name</Label>
                  <Input
                    id="name"
                    value={newDepartment.name}
                    onChange={(e) => setNewDepartment({ ...newDepartment, name: e.target.value })}
                    placeholder="e.g. Marketing"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="budget">Monthly Budget ($)</Label>
                  <Input
                    id="budget"
                    type="number"
                    value={newDepartment.monthlyBudget}
                    onChange={(e) => setNewDepartment({ ...newDepartment, monthlyBudget: e.target.value })}
                    placeholder="e.g. 10000"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="employees">Number of Employees</Label>
                  <Input
                    id="employees"
                    type="number"
                    value={newDepartment.employeeCount}
                    onChange={(e) => setNewDepartment({ ...newDepartment, employeeCount: e.target.value })}
                    placeholder="e.g. 5"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddDepartment} disabled={isCreatingDepartment}>
                  {isCreatingDepartment ? "Adding..." : "Add Department"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {isDepartmentsLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="text-muted-foreground">Loading departments...</div>
          </div>
        ) : (
          <>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {departments.map((department) => (
            <Card key={department.id}>
              <CardHeader className="pb-3">
                <CardTitle>{department.name}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="mb-1 flex justify-between text-sm">
                    <span className="text-muted-foreground">Monthly Budget</span>
                    <span className="font-medium">${department.monthlyBudget.toLocaleString()}</span>
                  </div>
                  <div className="mb-1 flex justify-between text-sm">
                    <span className="text-muted-foreground">Current Spent</span>
                    <span className="font-medium">${department.currentSpent.toLocaleString()}</span>
                  </div>
                  <div className="mb-1 flex justify-between text-sm">
                    <span className="text-muted-foreground">Employees</span>
                    <span className="font-medium">{department.employeeCount}</span>
                  </div>
                </div>

                <BudgetProgress spent={department.currentSpent} budget={department.monthlyBudget} />

                <div className="flex gap-2">
                  <Dialog
                    open={isEditDialogOpen && currentDepartment?.id === department.id}
                    onOpenChange={(open) => {
                      setIsEditDialogOpen(open)
                      if (!open) setCurrentDepartment(null)
                    }}
                  >
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        className="flex-1"
                        onClick={() => {
                          setCurrentDepartment(department)
                          setIsEditDialogOpen(true)
                        }}
                      >
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Edit Department</DialogTitle>
                        <DialogDescription>Update department details and budget.</DialogDescription>
                      </DialogHeader>
                      {currentDepartment && (
                        <div className="space-y-4 py-4">
                          <div className="space-y-2">
                            <Label htmlFor="edit-name">Department Name</Label>
                            <Input
                              id="edit-name"
                              value={currentDepartment.name}
                              onChange={(e) => setCurrentDepartment({ ...currentDepartment, name: e.target.value })}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="edit-budget">Monthly Budget ($)</Label>
                            <Input
                              id="edit-budget"
                              type="number"
                              value={currentDepartment.monthlyBudget}
                              onChange={(e) =>
                                setCurrentDepartment({
                                  ...currentDepartment,
                                  monthlyBudget: Number(e.target.value),
                                })
                              }
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="edit-employees">Number of Employees</Label>
                            <Input
                              id="edit-employees"
                              type="number"
                              value={currentDepartment.employeeCount}
                              onChange={(e) =>
                                setCurrentDepartment({
                                  ...currentDepartment,
                                  employeeCount: Number(e.target.value),
                                })
                              }
                            />
                          </div>
                        </div>
                      )}
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                          Cancel
                        </Button>
                        <Button onClick={handleEditDepartment} disabled={isUpdatingDepartment}>
                          {isUpdatingDepartment ? "Saving..." : "Save Changes"}
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>

                  <Dialog
                    open={isDeleteDialogOpen && currentDepartment?.id === department.id}
                    onOpenChange={(open) => {
                      setIsDeleteDialogOpen(open)
                      if (!open) setCurrentDepartment(null)
                    }}
                  >
                    <DialogTrigger asChild>
                      <Button
                        variant="destructive"
                        size="icon"
                        onClick={() => {
                          setCurrentDepartment(department)
                          setIsDeleteDialogOpen(true)
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Delete</span>
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Delete Department</DialogTitle>
                        <DialogDescription>
                          Are you sure you want to delete this department? This action cannot be undone.
                        </DialogDescription>
                      </DialogHeader>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                          Cancel
                        </Button>
                        <Button variant="destructive" onClick={handleDeleteDepartment} disabled={isDeletingDepartment}>
                          {isDeletingDepartment ? "Deleting..." : "Delete"}
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardContent>
            </Card>
          ))}
            </div>

            {departments.length === 0 && (
              <div className="flex h-40 flex-col items-center justify-center rounded-lg border border-dashed">
                <p className="text-muted-foreground">No departments found.</p>
                <Button variant="outline" className="mt-4" onClick={() => setIsAddDialogOpen(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Your First Department
                </Button>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  )
}
