"use client";

import React from 'react';
import { Notification } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Check, Info, AlertTriangle, XCircle, AlertOctagon } from 'lucide-react';

interface NotificationItemProps {
  notification: Notification;
  onMarkAsRead: (id: string) => void;
  className?: string;
}

const NotificationIcon = ({ type }: { type: Notification['type'] }) => {
  switch (type) {
    case 'success':
      return <Check className="w-5 h-5 text-green-500" />;
    case 'info':
      return <Info className="w-5 h-5 text-blue-500" />;
    case 'warning':
      return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
    case 'error':
      return <XCircle className="w-5 h-5 text-red-500" />;
    case 'alert':
      return <AlertOctagon className="w-5 h-5 text-orange-500" />;
    default:
      return <Info className="w-5 h-5 text-gray-500" />;
  }
};

const NotificationItem: React.FC<NotificationItemProps> = ({ notification, onMarkAsRead, className }) => {
  const handleItemClick = () => {
    if (!notification.read) {
      onMarkAsRead(notification.id);
    }
    if (notification.link) {
      // Potentially use Next Router here if it's an internal link
      window.location.href = notification.link;
    }
  };

  return (
    <Card
      className={cn(
        'mb-2 transition-all hover:shadow-md',
        notification.read ? 'bg-gray-50 dark:bg-gray-800/50' : 'bg-background dark:bg-gray-700/50',
        notification.link ? 'cursor-pointer' : 'cursor-default',
        className
      )}
      onClick={handleItemClick}
    >
      <CardContent className="p-3">
        <div className="flex items-start space-x-3">
          <div className="pt-1">
            <NotificationIcon type={notification.type} />
          </div>
          <div className="flex-1">
            <div className="flex justify-between items-center">
              <h4 className={cn(
                'font-semibold text-sm',
                notification.read ? 'text-gray-600 dark:text-gray-400' : 'text-gray-900 dark:text-white'
              )}>
                {notification.title}
              </h4>
              {!notification.read && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-auto p-1 text-xs"
                  onClick={(e) => { 
                    e.stopPropagation(); // Prevent card click event
                    onMarkAsRead(notification.id); 
                  }}
                >
                  Mark as read
                </Button>
              )}
            </div>
            <p className={cn(
              'text-xs',
              notification.read ? 'text-gray-500 dark:text-gray-400' : 'text-gray-700 dark:text-gray-300'
            )}>
              {notification.message}
            </p>
            <p className={cn(
              'text-xs mt-1',
              notification.read ? 'text-gray-400 dark:text-gray-500' : 'text-gray-500 dark:text-gray-400'
            )}>
              {new Date(notification.timestamp).toLocaleString()}
            </p>
            {notification.imageUrl && (
              <img 
                src={notification.imageUrl} 
                alt="Notification image" 
                className="mt-2 rounded-md max-h-32 object-cover"
              />
            )}
          </div>
          {!notification.read && (
            <div className="w-2 h-2 bg-primary rounded-full mt-1.5 shrink-0"></div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default NotificationItem;
