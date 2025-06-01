"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useOnboardingStore } from "@/lib/store"

const companySchema = z.object({
  name: z.string().min(2, "Company name must be at least 2 characters"),
  size: z.enum(["1-10", "11-50", "51-200", "200+"]),
  industry: z.enum(["Tech", "Finance", "Healthcare", "Retail", "Other"]),
})

export function CompanySetupStep() {
  const { data, setCompanySetup } = useOnboardingStore()
  const [size, setSize] = useState<string>(data.companySetup?.size || "1-10")
  const [industry, setIndustry] = useState<string>(data.companySetup?.industry || "Tech")

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(companySchema),
    defaultValues: {
      name: data.companySetup?.name || "",
      size: data.companySetup?.size || "1-10",
      industry: data.companySetup?.industry || "Tech",
    },
  })

  const onSubmit = (values: z.infer<typeof companySchema>) => {
    setCompanySetup(values)
  }

  // Auto-save on form changes
  const handleChange = (field: string, value: string) => {
    if (field === "size") setSize(value)
    if (field === "industry") setIndustry(value)

    const updatedData = {
      name: field === "name" ? value : data.companySetup?.name || "",
      size: field === "size" ? (value as any) : (size as any),
      industry: field === "industry" ? (value as any) : (industry as any),
    }

    setCompanySetup(updatedData)
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Company Setup</h2>
        <p className="text-muted-foreground">Tell us about your company to get started.</p>
      </div>

      <Card>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Company Name</Label>
              <Input
                id="name"
                {...register("name")}
                onChange={(e) => handleChange("name", e.target.value)}
                placeholder="Acme Inc."
              />
              {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="size">Company Size</Label>
              <Select value={size} onValueChange={(value) => handleChange("size", value)}>
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
              <Label htmlFor="industry">Industry</Label>
              <Select value={industry} onValueChange={(value) => handleChange("industry", value)}>
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
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
