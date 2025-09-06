export interface Notification {
  id: string;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: Date;
  type: 'INFO' | 'SUCCESS' | 'WARNING' | 'ERROR' | 'QUERY_UPDATE' | 'COMMENT' | 'LIKE' | 'SHARE' | 'RETWEET' | 'MENTION' | 'SYSTEM';
  queryId?: string;
  relatedUserId?: string;
  metadata?: Record<string, any>;
}
