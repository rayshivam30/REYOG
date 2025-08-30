"use client"

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { QueryForm } from '@/components/voter/query-form';

function NewQueryContent() {
  const searchParams = useSearchParams();
  const resubmitQueryId = searchParams.get('resubmit');
  const [initialData, setInitialData] = useState(null);
  const [loading, setLoading] = useState(!!resubmitQueryId);

  useEffect(() => {
    if (resubmitQueryId) {
      fetch(`/api/queries/${resubmitQueryId}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.query) {
            setInitialData(data.query);
          }
        })
        .finally(() => setLoading(false));
    }
  }, [resubmitQueryId]);

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">
          {resubmitQueryId ? 'Resubmit Query' : 'Raise a New Query'}
        </h1>
        <p className="text-muted-foreground">
          {resubmitQueryId
            ? 'Review and edit the details of your declined query before submitting again.'
            : 'Submit your concerns or requests to the appropriate government department'}
        </p>
      </div>
      {loading ? (
        <div className="space-y-6">
          <div className="border border-gray-200 rounded-lg p-6 animate-pulse">
            <div className="mb-6">
              <div className="h-6 bg-gray-200 rounded w-1/4 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </div>
            
            <div className="space-y-6">
              {/* Title field skeleton */}
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-16"></div>
                <div className="h-10 bg-gray-200 rounded"></div>
              </div>
              
              {/* Description field skeleton */}
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-24"></div>
                <div className="h-24 bg-gray-200 rounded"></div>
              </div>
              
              {/* Department field skeleton */}
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-20"></div>
                <div className="h-10 bg-gray-200 rounded"></div>
              </div>
              
              {/* Panchayat field skeleton */}
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-20"></div>
                <div className="h-10 bg-gray-200 rounded"></div>
              </div>
              
              {/* Submit button skeleton */}
              <div className="h-10 bg-gray-200 rounded w-32 mt-6"></div>
            </div>
          </div>
        </div>
      ) : (
        <QueryForm initialData={initialData} resubmitId={resubmitQueryId} />
      )}
    </div>
  );
}

export default function NewQueryPage() {
  return (
    <Suspense fallback={
      <div className="p-8">
        <div className="mb-8">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-2 animate-pulse"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3 animate-pulse"></div>
        </div>
        <div className="border border-gray-200 rounded-lg p-6 animate-pulse">
          <div className="space-y-6">
            <div className="h-10 bg-gray-200 rounded"></div>
            <div className="h-24 bg-gray-200 rounded"></div>
            <div className="h-10 bg-gray-200 rounded"></div>
            <div className="h-10 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    }>
      <NewQueryContent />
    </Suspense>
  );
}
