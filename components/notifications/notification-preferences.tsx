'use client';

import { useState, useCallback } from 'react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useNotificationPreferences } from '@/hooks/use-notification-preferences';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Save } from 'lucide-react';

interface NotificationPreferencesProps {
  onSaved?: () => void;
  onError?: (error: string) => void;
}

export function NotificationPreferences({ onSaved, onError }: NotificationPreferencesProps) {
  const { preferences, updatePreferences, isUpdating } = useNotificationPreferences();
  const [pendingChanges, setPendingChanges] = useState<Record<string, boolean>>({});
  const [isSaving, setIsSaving] = useState(false);

  const handleToggle = useCallback((key: keyof NonNullable<typeof preferences>, value: boolean) => {
    if (!preferences) return;
    
    setPendingChanges((prev: Record<string, boolean>) => ({ ...prev, [key]: value }));
  }, [preferences]);

  const handleSave = async () => {
    if (!preferences || Object.keys(pendingChanges).length === 0) return;
    
    setIsSaving(true);
    try {
      await updatePreferences(pendingChanges);
      setPendingChanges({});
      onSaved?.();
    } catch (error) {
      console.error('Failed to update notification preferences:', error);
      onError?.(error instanceof Error ? error.message : 'Failed to update preferences');
    } finally {
      setIsSaving(false);
    }
  };

  if (!preferences) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-64" />
        <div className="space-y-2">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center justify-between p-4 border rounded-lg">
              <Skeleton className="h-4 w-48" />
              <Skeleton className="h-6 w-10 rounded-full" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  const notificationTypes = [
    {
      id: 'emailEnabled',
      label: 'Email Notifications',
      description: 'Receive notifications via email',
    },
    {
      id: 'pushEnabled',
      label: 'Push Notifications',
      description: 'Receive push notifications on your device',
    },
    {
      id: 'inAppEnabled',
      label: 'In-App Notifications',
      description: 'See notifications in the application',
    },
  ];

  const notificationCategories = [
    {
      id: 'queryUpdates',
      label: 'Query Updates',
      description: 'Updates on queries you created or are assigned to',
    },
    {
      id: 'comments',
      label: 'Comments',
      description: 'When someone comments on your queries',
    },
    {
      id: 'likes',
      label: 'Likes',
      description: 'When someone likes your queries',
    },
    {
      id: 'shares',
      label: 'Shares',
      description: 'When someone shares your queries',
    },
    {
      id: 'mentions',
      label: 'Mentions',
      description: 'When someone mentions you',
    },
    {
      id: 'assignments',
      label: 'Assignments',
      description: 'When you are assigned to a query',
    },
    {
      id: 'statusChanges',
      label: 'Status Changes',
      description: 'When query status changes',
    },
    {
      id: 'weeklyDigest',
      label: 'Weekly Digest',
      description: 'A weekly summary of your activity',
    },
    {
      id: 'marketing',
      label: 'Marketing Communications',
      description: 'Promotional emails and updates',
    },
  ];

  const hasChanges = Object.keys(pendingChanges).length > 0;

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Notification Preferences</h2>
          <p className="text-muted-foreground">
            Manage how you receive notifications
          </p>
        </div>
        <Button 
          onClick={handleSave}
          disabled={!hasChanges || isSaving || isUpdating}
          className="w-full sm:w-auto"
        >
          <Save className="mr-2 h-4 w-4" />
          {isSaving ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Notification Channels</CardTitle>
          <CardDescription>Choose how you want to receive notifications</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {notificationTypes.map((type) => (
            <div key={type.id} className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor={type.id} className="text-base">
                  {type.label}
                </Label>
                <p className="text-sm text-muted-foreground">
                  {type.description}
                </p>
              </div>
              <Switch
                id={type.id}
                checked={
                  pendingChanges[type.id] !== undefined 
                    ? pendingChanges[type.id] 
                    : preferences[type.id as keyof typeof preferences] as boolean
                }
                onCheckedChange={(checked) => 
                  handleToggle(type.id as keyof typeof preferences, checked)
                }
                disabled={isUpdating || isSaving}
              />
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Notification Types</CardTitle>
          <CardDescription>Choose which types of notifications you want to receive</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {notificationCategories.map((category) => (
            <div key={category.id} className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor={category.id} className="text-base">
                  {category.label}
                </Label>
                <p className="text-sm text-muted-foreground">
                  {category.description}
                </p>
              </div>
              <Switch
                id={category.id}
                checked={
                  pendingChanges[category.id] !== undefined
                    ? pendingChanges[category.id]
                    : preferences[category.id as keyof typeof preferences] as boolean
                }
                onCheckedChange={(checked) => 
                  handleToggle(category.id as keyof typeof preferences, checked)
                }
                disabled={
                  isUpdating || 
                  isSaving ||
                  (!preferences.emailEnabled && 
                   !preferences.pushEnabled && 
                   !preferences.inAppEnabled)
                }
              />
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
