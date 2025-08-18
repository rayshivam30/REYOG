import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { QueryForm } from "@/components/voter/query-form"

export default function NewQueryPage() {
  return (
    <DashboardLayout>
      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Raise a New Query</h1>
          <p className="text-muted-foreground">
            Submit your concerns or requests to the appropriate government department
          </p>
        </div>
        <QueryForm />
      </div>
    </DashboardLayout>
  )
}
