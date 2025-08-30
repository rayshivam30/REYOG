"use client"

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { toast } from '@/components/ui/use-toast';

interface Query {
  id: string;
  title: string;
  createdAt: string;
}

function NewComplaintContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryId = searchParams.get('queryId');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [query, setQuery] = useState<Query | null>(null);
  const [loadingQuery, setLoadingQuery] = useState(!!queryId);
  const [formData, setFormData] = useState({
    subject: '',
    description: '',
  });

  useEffect(() => {
    if (queryId) {
      setLoadingQuery(true);
      fetch(`/api/queries/${queryId}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.query) {
            setQuery(data.query);
            setFormData((prev) => ({
              ...prev,
              subject: `Complaint regarding Query: "${data.query.title}"`,
            }));
          }
        })
        .finally(() => setLoadingQuery(false));
    }
  }, [queryId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const payload = { ...formData, queryId: queryId || undefined };
      const response = await fetch('/api/complaints', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error?.message || 'Failed to submit complaint');
      }

      toast({ title: 'Complaint submitted successfully' });
      router.push('/dashboard/voter/complaints');
    } catch (error) {
      toast({ title: 'Error', description: error instanceof Error ? error.message : 'Failed to submit', variant: 'destructive' });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loadingQuery) {
    return <div className="p-6">Loading query details...</div>;
  }

  return (
    <div className="container mx-auto p-6 max-w-3xl">
      <div className="mb-6">
        <Link href="/dashboard/voter/my-queries" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to My Queries
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>File a Complaint</CardTitle>
          <CardDescription>
            {queryId ? 'You are filing a complaint for a declined query.' : 'Please provide details about your complaint.'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {query && (
            <div className="mb-6 p-4 border rounded-lg bg-muted/50">
              <h4 className="font-semibold mb-2">Regarding Query:</h4>
              <p className="font-medium text-sm">{query.title}</p>
              <p className="text-xs text-muted-foreground">Submitted on: {new Date(query.createdAt).toLocaleDateString()}</p>
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="subject">Subject *</Label>
              <Input id="subject" name="subject" value={formData.subject} onChange={handleChange} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea id="description" name="description" value={formData.description} onChange={handleChange} required rows={8} />
            </div>
            <div className="flex justify-end space-x-4 pt-4">
              <Button type="button" variant="outline" onClick={() => router.back()} disabled={isSubmitting}>Cancel</Button>
              <Button type="submit" disabled={isSubmitting}>{isSubmitting ? 'Submitting...' : 'Submit Complaint'}</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export default function NewComplaintPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <NewComplaintContent />
    </Suspense>
  );
}
