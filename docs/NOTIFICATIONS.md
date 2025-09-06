# Notification System

## Overview
Real-time notification system with user-configurable preferences.

## Components

### 1. Backend
- **API Endpoints**: Handle notifications and preferences
- **WebSocket Server**: Real-time delivery
- **Notification Service**: Processes and dispatches events

### 2. Frontend
- **Notification Context**: Manages state and WebSocket
- **UI Components**: Display and manage notifications
- **Preferences UI**: User settings interface

## Data Models

### Notification
```typescript
{
  id: string;
  userId: string;
  title: string;
  message: string;
  type: string; // 'COMMENT' | 'LIKE' | 'MENTION' | etc.
  isRead: boolean;
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}
```

### NotificationPreferences
```typescript
{
  id: string;
  userId: string;
  emailEnabled: boolean;
  pushEnabled: boolean;
  inAppEnabled: boolean;
  // ... other notification type preferences
}
```

## API Reference

### Endpoints
- `GET /api/notifications` - List notifications
- `GET /api/notifications/count` - Unread count
- `PATCH /api/notifications/:id/read` - Mark as read
- `GET|PUT /api/notifications/preferences` - Get/update preferences

### WebSocket
- Connect to `/api/ws/notifications`
- Events: `new-notification`, `notification-read`, `preferences-updated`

## Development

### Adding New Notification Types
1. Add to `NotificationType` enum in Prisma schema
2. Update notification triggers
3. Add to preferences UI if needed

### Testing
Run tests with:
```bash
npm test
```

See `TESTING-NOTIFICATIONS.md` for detailed test cases.
