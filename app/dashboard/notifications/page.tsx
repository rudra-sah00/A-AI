"use client";

import React, { useEffect, useState } from 'react';
import { useNotifications } from '@/lib/hooks/use-notifications';
import NotificationItem from '@/components/notifications/notification-item'; // Import the actual component
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BellRing, Trash2 } from 'lucide-react';

export default function NotificationsPage() {
  const { notifications, markAsRead, markAllAsRead, clearAllNotifications } = useNotifications();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    // You could return a skeleton loader here for better UX
    return (
      <div className="container mx-auto p-4 md:p-6 lg:p-8">
        <Card className="max-w-2xl mx-auto">
          <CardHeader className="flex flex-row items-center justify-between">
            <div className="flex items-center">
              <BellRing className="w-6 h-6 mr-2 text-primary" />
              <CardTitle>Notifications</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-center text-gray-500 py-8">Loading notifications...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="container mx-auto p-4 md:p-6 lg:p-8">
      <Card className="max-w-2xl mx-auto">
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="flex items-center">
            <BellRing className="w-6 h-6 mr-2 text-primary" />
            <CardTitle>Notifications</CardTitle>
          </div>
          {notifications.length > 0 && (
            <div className="space-x-2">
              {unreadCount > 0 && (
                <Button variant="outline" size="sm" onClick={markAllAsRead}>
                  Mark All as Read
                </Button>
              )}
              <Button variant="destructive" size="sm" onClick={clearAllNotifications}>
                <Trash2 className="w-4 h-4 mr-1" /> Clear All
              </Button>
            </div>
          )}
        </CardHeader>
        <CardContent>
          {notifications.length === 0 ? (
            <p className="text-center text-gray-500 py-8">You have no new notifications.</p>
          ) : (
            <div className="space-y-0">
              {notifications.map((notification) => (
                <NotificationItem
                  key={notification.id}
                  notification={notification}
                  onMarkAsRead={markAsRead}
                  className="border-b last:border-b-0 rounded-none mb-0"
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
