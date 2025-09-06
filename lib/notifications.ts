import { prisma } from "./prisma"
import { getIO } from "./websocket"
import { NotificationCategory, NotificationChannel, NotificationPreferences } from "@/types/notification-preferences";

type NotificationType = 'INFO' | 'SUCCESS' | 'WARNING' | 'ERROR' | 'QUERY_UPDATE' | 'COMMENT' | 'LIKE' | 'SHARE' | 'RETWEET' | 'MENTION' | 'SYSTEM'

export interface CreateNotificationInput {
  userId: string
  title: string
  message: string
  type?: NotificationType
  queryId?: string
  metadata?: Record<string, any>
  relatedUserId?: string
}

/**
 * Get the notification category based on the notification type
 */
function getNotificationCategory(type: string): NotificationCategory | null {
  switch (type) {
    case 'COMMENT':
      return 'comments';
    case 'LIKE':
      return 'likes';
    case 'SHARE':
    case 'RETWEET':
      return 'shares';
    case 'MENTION':
      return 'mentions';
    case 'QUERY_UPDATE':
      return 'queryUpdates';
    case 'ASSIGNMENT':
      return 'assignments';
    default:
      return null;
  }
}

/**
 * Check if a notification should be sent based on user preferences
 */
async function shouldSendNotification(
  userId: string,
  type: string,
  channel: NotificationChannel
): Promise<boolean> {
  try {
    // Get user preferences
    const preferences = await prisma.notificationPreference.findUnique({
      where: { userId },
    });

    // If no preferences exist, use defaults (which would be all true)
    if (!preferences) {
      return true;
    }

    // Type assertion to handle Prisma's generated types
    const typedPrefs = preferences as unknown as NotificationPreferences;

    // Check if the channel is enabled
    const channelEnabled = channel === 'email' ? typedPrefs.emailEnabled :
                         channel === 'push' ? typedPrefs.pushEnabled :
                         typedPrefs.inAppEnabled;
    
    if (!channelEnabled) {
      return false;
    }

    // Get the notification category
    const category = getNotificationCategory(type);
    if (!category) {
      return true; // If we don't recognize the category, allow by default
    }

    // Check if the category is enabled
    return typedPrefs[category] !== false;
  } catch (error) {
    console.error('Error checking notification preferences:', error);
    return true; // Default to sending if there's an error
  }
}

export async function createNotification({
  userId,
  title,
  message,
  type = 'INFO',
  queryId,
  metadata,
  relatedUserId,
  sendRealTime = true
}: CreateNotificationInput & { sendRealTime?: boolean }) {
  try {
    // Check if in-app notifications are enabled for this type
    const inAppEnabled = await shouldSendNotification(userId, type, 'inApp');
    
    // If in-app notifications are disabled for this type, don't create the notification
    if (!inAppEnabled) {
      return null;
    }

    const notificationData: any = {
      userId,
      title,
      message,
      type,
      queryId,
      metadata: metadata ? JSON.parse(JSON.stringify(metadata)) : undefined,
    };

    // Only include relatedUserId if it's provided
    if (relatedUserId) {
      notificationData.relatedUserId = relatedUserId;
    }

    const notification = await prisma.notification.create({
      data: notificationData,
      include: {
        query: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    });

    // Check if push notifications are enabled for this type
    if (sendRealTime) {
      const pushEnabled = await shouldSendNotification(userId, type, 'push');
      if (pushEnabled) {
        try {
          const io = getIO();
          io.to(`user:${userId}`).emit('new-notification', notification);
        } catch (error) {
          console.error('Failed to send real-time notification:', error);
        }
      }
    }

    // TODO: Add email notification logic here if needed
    // const emailEnabled = await shouldSendNotification(userId, type, 'email');
    // if (emailEnabled) {
    //   // Send email notification
    // }

    return notification;
  } catch (error) {
    console.error('Error creating notification:', error)
    return null
  }
}

export async function getUserUnreadCount(userId: string): Promise<number> {
  return prisma.notification.count({
    where: {
      userId,
      isRead: false,
    },
  })
}

export async function markAsRead(notificationId: string, userId: string, sendRealTime = true) {
  const updated = await prisma.notification.updateMany({
    where: {
      id: notificationId,
      userId,
    },
    data: {
      isRead: true,
    },
  })

  // Emit real-time update if needed
  if (sendRealTime && updated.count > 0) {
    try {
      const io = getIO()
      io.to(`user:${userId}`).emit('notification-read', notificationId)
    } catch (error) {
      console.error('Failed to send read status update:', error)
    }
  }

  return updated
}

export async function markAllAsRead(userId: string, sendRealTime = true) {
  const updated = await prisma.notification.updateMany({
    where: {
      userId,
      isRead: false,
    },
    data: {
      isRead: true,
    },
  })

  // Emit real-time update if needed
  if (sendRealTime && updated.count > 0) {
    try {
      const io = getIO()
      io.to(`user:${userId}`).emit('all-notifications-read')
    } catch (error) {
      console.error('Failed to send all-read update:', error)
    }
  }

  return updated
}

// Common notification templates
export const notificationTemplates = {
  queryUpdate: (queryTitle: string, updaterName: string) => ({
    title: 'Query Updated',
    message: `Your query "${queryTitle}" has been updated by ${updaterName}`,
    type: 'QUERY_UPDATE' as const,
  }),
  newComment: (queryTitle: string, commenterName: string) => ({
    title: 'New Comment',
    message: `${commenterName} commented on your query "${queryTitle}"`,
    type: 'COMMENT' as const,
  }),
  queryLiked: (queryTitle: string, likerName: string) => ({
    title: 'Query Liked',
    message: `${likerName} liked your query "${queryTitle}"`,
    type: 'LIKE' as const,
  }),
  queryShared: (queryTitle: string, sharerName: string) => ({
    title: 'Query Shared',
    message: `${sharerName} shared your query "${queryTitle}"`,
    type: 'SHARE' as const,
  }),
  mentionedInComment: (queryTitle: string, commenterName: string) => ({
    title: 'Mentioned in Comment',
    message: `${commenterName} mentioned you in a comment on "${queryTitle}"`,
    type: 'MENTION' as const,
  }),
  statusChange: (queryTitle: string, newStatus: string) => ({
    title: 'Status Updated',
    message: `Status of "${queryTitle}" changed to ${newStatus}`,
    type: 'QUERY_UPDATE' as const,
  }),
  
    // Helper function to send a notification to multiple users
  sendBulk: async (userIds: string[], title: string, message: string, options?: Omit<CreateNotificationInput, 'userId' | 'title' | 'message'>) => {
    // First, get all user preferences in a single query
    const userPreferences = await prisma.notificationPreference.findMany({
      where: {
        userId: { in: userIds },
      },
    });

    // Create a map of userId to preferences
    const preferencesMap = new Map(
      userPreferences.map((pref: any) => [pref.userId, pref as unknown as NotificationPreferences])
    );

    // Process notifications in parallel
    const notifications = await Promise.all(
      userIds.map(async (userId) => {
        const preferences = preferencesMap.get(userId);
        const type = options?.type || 'INFO';
        const category = getNotificationCategory(type);

        // Check if in-app notifications are enabled for this user and type
        const inAppEnabled = !preferences || 
          (preferences.inAppEnabled && 
           (!category || preferences[category as keyof NotificationPreferences] !== false));

        if (!inAppEnabled) {
          return null;
        }

        return createNotification({
          userId,
          title,
          message,
          ...options,
        });
      })
    );

    return (await Promise.all(notifications)).filter(Boolean);
  },
  
  // Helper function to notify all participants of a query
  notifyQueryParticipants: async (queryId: string, title: string, message: string, excludeUserId?: string) => {
    try {
      // Get all users related to this query
      const query = await prisma.query.findUnique({
        where: { id: queryId },
        select: {
          userId: true,
          assignedOffices: {
            select: { office: { select: { users: { select: { id: true } } } } },
          },
          assignedNgos: {
            select: { ngo: { select: { users: { select: { id: true } } } } },
          },
        },
      })

      if (!query) return []

      // Collect all user IDs
      const userIds = new Set<string>()
      
      // Add query creator
      if (query.userId !== excludeUserId) {
        userIds.add(query.userId)
      }
      
      // Add assigned office users
      query.assignedOffices.forEach(({ office }) => {
        office.users.forEach((user: { id: string }) => {
          if (user.id !== excludeUserId) {
            userIds.add(user.id)
          }
        })
      })
      
      // Add assigned NGO users
      query.assignedNgos.forEach(({ ngo }) => {
        ngo.users.forEach((user: { id: string }) => {
          if (user.id !== excludeUserId) {
            userIds.add(user.id)
          }
        })
      })
      
      // Send notifications to all participants
      return notificationTemplates.sendBulk(
        Array.from(userIds),
        title,
        message,
        { queryId, type: 'QUERY_UPDATE' as const }
      )
    } catch (error) {
      console.error('Error notifying query participants:', error)
      return []
    }
  }
}
