export type NotificationCategory = 
  | 'queryUpdates' 
  | 'comments' 
  | 'likes' 
  | 'shares' 
  | 'mentions' 
  | 'assignments' 
  | 'statusChanges' 
  | 'weeklyDigest' 
  | 'marketing';

export type NotificationChannel = 'email' | 'push' | 'inApp';

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
  createdAt: Date;
  updatedAt: Date;
}
