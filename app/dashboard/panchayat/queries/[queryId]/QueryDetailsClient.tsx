// app/dashboard/panchayat/queries/[queryId]/QueryDetailsClient.tsx

"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Calendar, Loader2, Mail, MapPin, Phone, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import type { QueryWithDetails } from "./page";
import { QueryStatus } from "@prisma/client";
import { Input } from "@/components/ui/input";

// Status color mapping
const statusVariant = {
  PENDING_REVIEW: "bg-yellow-100 text-yellow-800",
  ACCEPTED: "bg-blue-100 text-blue-800",
  IN_PROGRESS: "bg-cyan-100 text-cyan-800",
  RESOLVED: "bg-green-100 text-green-800",
  CLOSED: "bg-gray-100 text-gray-800",
  DECLINED: "bg-red-100 text-red-800",
  WAITLISTED: "bg-purple-100 text-purple-800",
};

interface QueryDetailsClientProps {
  query: QueryWithDetails;
}

export default function QueryDetailsClient({ query }: QueryDetailsClientProps) {
  const router = useRouter();
  const [status, setStatus] = useState<QueryStatus | "">("");
  const [note, setNote] = useState("");
  const [updating, setUpdating] = useState(false);
  const [budgetSpentDelta, setBudgetSpentDelta] = useState("");

  const handleStatusUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!status || !note) {
      toast.error("Please select a status and provide a note.");
      return;
    }
    setUpdating(true);

    try {
      const body: { status: QueryStatus; note: string; budgetSpentDelta?: number } = {
        status: status as QueryStatus,
        note,
      };

      const budgetValue = parseFloat(budgetSpentDelta);
      if (!isNaN(budgetValue) && budgetValue > 0) {
        body.budgetSpentDelta = budgetValue;
      }

      const response = await fetch(`/api/queries/${query.id}/update`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update status.");
      }

      toast.success("Query updated successfully!");
      setNote("");
      setStatus("");
      setBudgetSpentDelta("");
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "An unknown error occurred.");
    } finally {
      setUpdating(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(amount);
  };

  // **MODIFICATION 1: Create variables for safer calculations and rendering**
  const allocatedBudget = query.budget || 0;
  const spentBudget = query.budgetSpent || 0;
  const hasBudgetData = allocatedBudget > 0 || spentBudget > 0;
  const percentageSpent = allocatedBudget > 0 ? (spentBudget / allocatedBudget) * 100 : 0;


  return (
    <div className="container mx-auto p-4 md:p-8 max-w-5xl">
      <div className="mb-6">
        <Button variant="outline" asChild>
          <Link href="/dashboard/panchayat/queries" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Queries
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-none shadow-sm">
            <CardHeader className="pb-4 border-b">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                <div>
                  <Badge className={`mb-3 ${statusVariant[query.status as keyof typeof statusVariant] || 'bg-gray-100 text-gray-800'} text-sm font-medium`}>
                    {query.status.replace(/_/g, ' ')}
                  </Badge>
                  <CardTitle className="text-2xl md:text-3xl font-bold">{query.title}</CardTitle>
                  <CardDescription className="mt-2 flex items-center">
                    <Calendar className="mr-2 h-4 w-4" />
                    {new Date(query.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric', month: 'long', day: 'numeric',
                    })}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="prose max-w-none">
                  <h3 className="text-sm font-medium text-muted-foreground mb-2">Query Details</h3>
                  <p className="text-foreground">{query.description}</p>
                </div>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-2">Location</h3>
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span>{query.panchayat?.name || 'N/A'}</span>
                      </div>
                      <div className="pl-6">
                        <p className="text-sm">Ward: {query.wardNumber || 'N/A'}</p>
                      </div>
                    </div>
                  </div>
                  
                  {/* **MODIFICATION 2: Use the new `hasBudgetData` variable for rendering** */}
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-2">Budget</h3>
                    {hasBudgetData ? (
                      <div className="space-y-2">
                        <div className="flex justify-between items-center text-sm">
                          <span>Spent:</span>
                          <span className="font-medium">{formatCurrency(spentBudget)}</span>
                        </div>
                         <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                          {/* **MODIFICATION 3: Use the safe `percentageSpent` variable** */}
                          <div
                            className="bg-primary h-2.5 rounded-full"
                            style={{ width: `${Math.min(percentageSpent, 100)}%` }}
                          ></div>
                        </div>
                        <div className="flex justify-between items-center text-xs text-muted-foreground">
                          <span>Allocated:</span>
                          <span>{formatCurrency(allocatedBudget)}</span>
                        </div>
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground">Not specified.</p>
                    )}
                  </div>

                  {query.department && (
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-2">Department</h3>
                      <Badge variant="secondary">{query.department.name}</Badge>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-none shadow-sm">
            <CardHeader className="pb-4 border-b">
              <CardTitle className="text-lg font-semibold">Updates & Activity</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              {query.updates && query.updates.length > 0 ? (
                <div className="space-y-6">
                  {query.updates.map((update) => (
                    <div key={update.id} className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className="h-2 w-2 rounded-full bg-primary mt-1.5" />
                        <div className="w-px h-full bg-border my-1" />
                      </div>
                      <div className="flex-1 pb-6">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{update.user.name}</span>
                            <Badge variant="outline" className="text-xs">{update.user.role}</Badge>
                            {update.status && <Badge variant={update.status === 'RESOLVED' ? 'default' : 'secondary'} className="text-xs">{update.status.replace(/_/g, ' ')}</Badge>}
                          </div>
                          <span className="text-xs text-muted-foreground">{new Date(update.createdAt).toLocaleString()}</span>
                        </div>
                        <p className="mt-1 text-sm text-foreground">{update.note}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">No updates available for this query.</div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="border-none shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg">Update Status</CardTitle>
              <CardDescription>Update the status of this query and add a note.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleStatusUpdate} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select value={status} onValueChange={(value) => setStatus(value as QueryStatus)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                      <SelectItem value="RESOLVED">Resolved</SelectItem>
                      <SelectItem value="WAITLISTED">Waitlisted</SelectItem>
                      <SelectItem value="DECLINED">Declined</SelectItem>
                      <SelectItem value="CLOSED">Closed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="note">Note</Label>
                  <Textarea id="note" placeholder="Add an update note..." value={note} onChange={(e) => setNote(e.target.value)} rows={4} required/>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="budget">Add to Budget Spent (Optional)</Label>
                  <Input
                    id="budget"
                    type="number"
                    placeholder="e.g., 5000"
                    value={budgetSpentDelta}
                    onChange={(e) => setBudgetSpentDelta(e.target.value)}
                  />
                </div>
                <Button type="submit" className="w-full" disabled={updating || !status || !note}>
                  {updating ? (<><Loader2 className="mr-2 h-4 w-4 animate-spin" />Updating...</>) : ('Update Status')}
                </Button>
              </form>
            </CardContent>
          </Card>
          
          <Card className="border-none shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg">Query Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Status</span>
                <Badge className={statusVariant[query.status as keyof typeof statusVariant] || 'bg-gray-100 text-gray-800'}>{query.status.replace(/_/g, ' ')}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Created</span>
                <span className="text-sm font-medium">{new Date(query.createdAt).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Upvotes</span>
                <span className="text-sm font-medium">{query.upvoteCount}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Updates</span>
                <span className="text-sm font-medium">{query.updates?.length || 0}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}