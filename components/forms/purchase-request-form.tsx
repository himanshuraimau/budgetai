"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { useAuthStore, useRequestsStore } from "@/lib/store"

const requestSchema = z.object({
  amount: z
    .string()
    .min(1, "Amount is required")
    .refine((val) => !isNaN(Number.parseFloat(val)) && Number.parseFloat(val) > 0, "Amount must be a positive number"),
  description: z.string().min(3, "Description must be at least 3 characters"),
  category: z.string().min(1, "Category is required"),
  justification: z.string().optional(),
})

type RequestFormValues = z.infer<typeof requestSchema>

export function PurchaseRequestForm() {
  const { toast } = useToast()
  const { user } = useAuthStore()
  const { addRequest } = useRequestsStore()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<RequestFormValues>({
    resolver: zodResolver(requestSchema),
    defaultValues: {
      amount: "",
      description: "",
      category: "",
      justification: "",
    },
  })

  const onSubmit = async (values: RequestFormValues) => {
    if (!user) return

    setIsSubmitting(true)

    try {
      await addRequest({
        employeeId: user.id,
        departmentId: user.departmentId || "1", // Fallback to first department
        amount: Number.parseFloat(values.amount),
        description: values.description,
        category: values.category,
        justification: values.justification || undefined,
      })

      toast({
        title: "Request submitted",
        description: "Your purchase request has been submitted for approval.",
      })

      form.reset()
    } catch (error) {
      toast({
        title: "Error",
        description: "There was an error submitting your request.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>New Purchase Request</CardTitle>
        <CardDescription>Submit a new purchase request for approval</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="amount">Amount ($)</Label>
              <Input id="amount" type="number" step="0.01" placeholder="0.00" {...form.register("amount")} />
              {form.formState.errors.amount && (
                <p className="text-xs text-red-500">{form.formState.errors.amount.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select
                onValueChange={(value) => form.setValue("category", value)}
                defaultValue={form.getValues("category")}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Equipment">Equipment</SelectItem>
                  <SelectItem value="Software">Software</SelectItem>
                  <SelectItem value="Travel">Travel</SelectItem>
                  <SelectItem value="Training">Training</SelectItem>
                  <SelectItem value="Events">Events</SelectItem>
                  <SelectItem value="Advertising">Advertising</SelectItem>
                  <SelectItem value="Office Supplies">Office Supplies</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
              {form.formState.errors.category && (
                <p className="text-xs text-red-500">{form.formState.errors.category.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Input id="description" placeholder="Brief description of the purchase" {...form.register("description")} />
            {form.formState.errors.description && (
              <p className="text-xs text-red-500">{form.formState.errors.description.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="justification">
              Justification <span className="text-xs text-muted-foreground">(Optional)</span>
            </Label>
            <Textarea
              id="justification"
              placeholder="Why is this purchase necessary?"
              rows={3}
              {...form.register("justification")}
            />
          </div>

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Submitting..." : "Submit Request"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
