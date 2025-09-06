import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { get, put } from '@/lib/api';

export interface NotificationPreferences {
  id: string;
  userId: string;
  emailEnabled: boolean;
  pushEnabled: boolean;
  inAppEnabled: boolean;
  queryUpdates: boolean;
  comments: boolean;
  likes: boolean;
  shares: boolean;
  mentions: boolean;
  assignments: boolean;
  statusChanges: boolean;
  weeklyDigest: boolean;
  marketing: boolean;
  createdAt: string;
  updatedAt: string;
}

export function useNotificationPreferences() {
  const queryClient = useQueryClient();

  const { data: preferences, isLoading, error } = useQuery<NotificationPreferences>({
    queryKey: ['notificationPreferences'],
    queryFn: async () => {
      try {
        return await get<NotificationPreferences>('/api/notifications/preferences');
      } catch (error) {
        console.error('Failed to fetch notification preferences:', error);
        // Return default preferences if the request fails
        return {
          id: '',
          userId: '',
          emailEnabled: true,
          pushEnabled: true,
          inAppEnabled: true,
          queryUpdates: true,
          comments: true,
          likes: true,
          shares: true,
          mentions: true,
          assignments: true,
          statusChanges: true,
          weeklyDigest: true,
          marketing: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
      }
    },
    retry: 2, // Retry failed requests twice
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false, // Don't refetch when window regains focus
  });

  const updatePreferences = useMutation({
    mutationFn: async (data: Partial<NotificationPreferences>) => {
      try {
        return await put<NotificationPreferences>('/api/notifications/preferences', data);
      } catch (error) {
        console.error('Failed to update notification preferences:', error);
        throw new Error('Failed to update preferences. Please try again.');
      }
    },
    onSuccess: (updatedPreferences) => {
      // Update the query data with the new preferences
      queryClient.setQueryData(['notificationPreferences'], (old: NotificationPreferences | undefined) => 
        old ? { ...old, ...updatedPreferences } : updatedPreferences
      );
    },
    onError: (error) => {
      console.error('Error updating notification preferences:', error);
    },
    retry: 1, // Retry once on failure
  });

  return {
    preferences,
    isLoading,
    error,
    updatePreferences: updatePreferences.mutateAsync,
    isUpdating: updatePreferences.isPending,
  };
}
