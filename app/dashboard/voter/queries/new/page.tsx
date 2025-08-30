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
      {loading ? <div>Loading query data...</div> : <QueryForm initialData={initialData} resubmitId={resubmitQueryId} />}
    </div>
  );
}

export default function NewQueryPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <NewQueryContent />
    </Suspense>
  );
}
