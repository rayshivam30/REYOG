import { NotificationList } from '@/components/notifications/notification-list';
import { QueryProvider } from '@/components/providers/query-provider';

export default function PanchayatNotificationsPage() {
  return (
    <QueryProvider>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
          </div>
          
          <div className="bg-white rounded-lg shadow">
            <NotificationList />
          </div>
        </div>
      </div>
    </QueryProvider>
  );
}
