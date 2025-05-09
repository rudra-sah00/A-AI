"use client"

import { useState, useEffect } from 'react';
import { Notification } from '@/lib/types';

// Mock notifications
const initialNotifications: Notification[] = [];

export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications);

  const clearNotification = (id: string) => {
    setNotifications(notifications.filter(notification => notification.id !== id));
  };

  const markAsRead = (id: string) => {
    setNotifications(notifications.map(notification => 
      notification.id === id ? { ...notification, read: true } : notification
    ));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(notification => ({ ...notification, read: true })));
  };

  const addNotification = (notification: Omit<Notification, 'id' | 'read'>) => {
    const newNotification: Notification = {
      ...notification,
      id: `notif-${Math.random().toString(36).substr(2, 9)}`,
      read: false
    };
    setNotifications([newNotification, ...notifications]);
  };

  return {
    notifications,
    clearNotification,
    markAsRead,
    markAllAsRead,
    addNotification
  };
}