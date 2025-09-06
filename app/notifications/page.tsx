'use client';

import { Suspense, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { NotificationList } from '@/components/notifications/notification-list';
import { NotificationPreferences } from '@/components/notifications/notification-preferences';
import { useToast } from '@/components/ui/use-toast';
import { Loader2 } from 'lucide-react';

type TabValue = 'notifications' | 'preferences';

export default function NotificationsPage() {
  const [activeTab, setActiveTab] = useState<TabValue>('notifications');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { toast } = useToast();

  // Check if user is authenticated
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth/session');
        if (!response.ok) {
          throw new Error('Not authenticated');
        }
        const data = await response.json();
        if (!data.user) {
          router.push('/auth/login?callbackUrl=/notifications');
          return;
        }
      } catch (err) {
        setError('You need to be logged in to view notifications');
        router.push('/auth/login?callbackUrl=/notifications');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container max-w-4xl py-6 lg:py-10">
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold text-destructive">{error}</h2>
          <p className="mt-2 text-muted-foreground">Redirecting to login page...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container max-w-4xl py-6 lg:py-10">
      <div className="flex flex-col items-start gap-4 md:flex-row md:justify-between md:gap-8">
        <div className="flex-1 space-y-4">
          <h1 className="inline-block text-2xl font-bold tracking-tight sm:text-3xl">
            Notifications
          </h1>
          <p className="text-muted-foreground">
            View and manage your notifications and preferences
          </p>
        </div>
      </div>
      
      <Tabs 
        value={activeTab}
        onValueChange={(value) => setActiveTab(value as TabValue)}
        className="mt-8"
      >
        <TabsList className="grid w-full grid-cols-2 max-w-xs">
          <TabsTrigger value="notifications">My Notifications</TabsTrigger>
          <TabsTrigger value="preferences">Preferences</TabsTrigger>
        </TabsList>
        
        <div className="mt-6">
          <TabsContent value="notifications" className="mt-6">
            <Suspense fallback={<NotificationsLoading />}>
              <NotificationList />
            </Suspense>
          </TabsContent>
          
          <TabsContent value="preferences" className="mt-6">
            <Suspense fallback={<PreferencesLoading />}>
              <NotificationPreferences 
                onSaved={() => {
                  toast({
                    title: 'Preferences saved',
                    description: 'Your notification preferences have been updated.',
                  });
                }}
                onError={(error) => {
                  toast({
                    title: 'Error',
                    description: error || 'Failed to update preferences',
                    variant: 'destructive',
                  });
                }}
              />
            </Suspense>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}

function NotificationsLoading() {
  return (
    <div className="space-y-4">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="animate-pulse space-y-2">
          <div className="h-4 w-3/4 rounded bg-gray-200"></div>
          <div className="h-3 w-1/2 rounded bg-gray-100"></div>
        </div>
      ))}
    </div>
  );
}

function PreferencesLoading() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <div className="h-8 w-64 bg-gray-200 rounded"></div>
        <div className="h-4 w-80 bg-gray-100 rounded"></div>
      </div>
      
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex items-center justify-between p-4 border rounded-lg">
            <div className="space-y-2">
              <div className="h-4 w-48 bg-gray-200 rounded"></div>
              <div className="h-3 w-64 bg-gray-100 rounded"></div>
            </div>
            <div className="h-6 w-10 bg-gray-200 rounded-full"></div>
          </div>
        ))}
      </div>
    </div>
  );
}
