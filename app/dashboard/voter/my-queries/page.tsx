"use client";

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';
import { notFound, redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { MapPin, Calendar, Paperclip } from "lucide-react"

interface Attachment {
  id: string;
  url: string;
  filename: string;
  type: string;
  size: number;
}

interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
}

interface Panchayat {
  id: string;
  name: string;
}

interface Query {
  id: string;
  title: string;
  description: string;
  status: string;
  createdAt: string;
  user: User;
  panchayat?: Panchayat;
  attachments: Attachment[];
}

const statusVariant = {
  PENDING_REVIEW: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200',
  ACCEPTED: 'bg-blue-100 text-blue-800 hover:bg-blue-200',
  IN_PROGRESS: 'bg-purple-100 text-purple-800 hover:bg-purple-200',
  RESOLVED: 'bg-green-100 text-green-800 hover:bg-green-200',
  DECLINED: 'bg-red-100 text-red-800 hover:bg-red-200',
  CLOSED: 'bg-gray-100 text-gray-800 hover:bg-gray-200',
  WAITLISTED: 'bg-orange-100 text-orange-800 hover:bg-orange-200',
};

export default function VoterMyQueriesPage() {
  const { user: authUser } = useAuth();
  const router = useRouter();
  const [queries, setQueries] = useState<Query[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    async function fetchQueries() {
      try {
        const url = new URL('/api/queries', window.location.origin);
        url.searchParams.append('scope', 'user');
        if (statusFilter !== 'all') {
          url.searchParams.append('status', statusFilter);
        }
        
        const response = await fetch(url.toString());
        if (!response.ok) {
          throw new Error('Failed to fetch queries');
        }
        const { queries } = await response.json();
        setQueries(queries || []);
      } catch (err: any) {
        setError(err.message || 'An error occurred');
      } finally {
        setLoading(false);
      }
    }

    if (authUser) {
      fetchQueries();
    } else {
      redirect('/auth/login');
    }
  }, [authUser, statusFilter]);

  if (loading) return (
    <div className="container mx-auto p-4 md:p-8 max-w">
      <div className="mb-6">
        <div className="flex flex-col space-y-4 md:space-y-0 md:flex-row md:justify-between md:items-center mb-4">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">My Queries</h1>
          <div className="h-10 w-32 bg-gray-200 rounded animate-pulse"></div>
        </div>
        
        <div className="flex flex-wrap gap-2 mb-6 overflow-x-auto pb-2">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="h-8 w-20 bg-gray-200 rounded-full animate-pulse"></div>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="border border-gray-200 rounded-lg p-6 animate-pulse">
            <div className="flex justify-between items-start mb-4">
              <div className="h-6 bg-gray-200 rounded w-3/4"></div>
              <div className="h-6 w-20 bg-gray-200 rounded"></div>
            </div>
            <div className="flex items-center gap-2 mb-3">
              <div className="h-4 w-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-1/3"></div>
              <div className="h-4 w-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            </div>
            <div className="h-4 bg-gray-200 rounded w-full mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
          </div>
        ))}
      </div>
    </div>
  );
  if (error) return <div>Error: {error}</div>;

  return (
    <div className={`container mx-auto p-4 md:p-8 max-w-4xl ${queries.length === 0 ? 'pb-0' : ''}`}>
      <div className="mb-6">
        <div className="flex flex-col space-y-4 md:space-y-0 md:flex-row md:justify-between md:items-center mb-4">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">My Queries</h1>
          <Link href="/dashboard/voter/queries/new">
            <Button>Raise New Query</Button>
          </Link>
        </div>
        
        <div className="flex flex-wrap gap-2 mb-6 overflow-x-auto pb-2">
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${statusFilter === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
            All
          </button>
          {Object.entries({
            'PENDING_REVIEW': 'Pending Review',
            'ACCEPTED': 'Accepted',
            'IN_PROGRESS': 'In Progress',
            'RESOLVED': 'Resolved',
            'DECLINED': 'Declined',
            'CLOSED': 'Closed',
            'WAITLISTED': 'Waitlisted'
          }).map(([value, label]) => (
            <button
              key={value}
              onClick={() => setStatusFilter(value)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${statusFilter === value ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className={`space-y-4 ${queries.length <= 5 ? 'pb-0' : ''}`}>
        {queries.slice(0, 5).map((query) => (
          <Card key={query.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <CardTitle className="text-xl">
                  <Link href={`/dashboard/voter/queries/details/${query.id}`} className="hover:underline">
                    {query.title}
                  </Link>
                </CardTitle>
                <Badge className={statusVariant[query.status as keyof typeof statusVariant]}>
                  {query.status.replace('_', ' ')}
                </Badge>
              </div>
              <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground mt-1">
                <span className="inline-flex items-center">
                  <Calendar className="h-4 w-4 mr-1" />
                  {format(new Date(query.createdAt), 'MMM d, yyyy')}
                </span>
                {query.panchayat && (
                  <span className="inline-flex items-center">
                    <MapPin className="h-4 w-4 mr-1" />
                    {query.panchayat.name}
                  </span>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 mb-4 line-clamp-2">{query.description}</p>
              {query.attachments && query.attachments.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {query.attachments.map((file) => (
                    <a
                      key={file.id}
                      href={file.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-2.5 py-1.5 border border-gray-300 text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50">
                      <Paperclip className="h-3 w-3 mr-1.5" />
                      {file.filename || 'Attachment'}
                    </a>
                  ))}
                </div>
              )}
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
                <div className="flex items-center gap-2 flex-wrap">
                  {query.status === 'DECLINED' ? (
                    <>
                      <Link href={`/dashboard/voter/complaints/new?queryId=${query.id}`}>
                        <Button variant="destructive" size="sm" className="w-full sm:w-auto">
                          Complain
                        </Button>
                      </Link>
                      <Link href={`/dashboard/voter/queries/new?resubmit=${query.id}`}>
                        <Button variant="secondary" size="sm" className="w-full sm:w-auto">
                          Resubmit
                        </Button>
                      </Link>
                    </>
                  ) : (
                    <Link href={`/dashboard/voter/queries/details/${query.id}`}>
                      <Button variant="outline" size="sm" className="w-full sm:w-auto">
                        View Details
                      </Button>
                    </Link>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        
        {queries.length === 0 && (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium text-gray-900">No queries yet</h3>
            <p className="mt-1 text-sm text-gray-500">
              Get started by raising a new query.
            </p>
          </div>
        )}
        
        {queries.length > 5 && (
          <div className="flex justify-center">
            <Link 
              href="/dashboard/voter/my-queries" 
              className="px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-700"
            >
              View All Queries →
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
