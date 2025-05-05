"use client"

import { useState, useEffect } from 'react';
import { Notification } from '@/lib/types';

// Mock notifications
const initialNotifications: Notification[] = [
  {
    id: 'notif-001',
    title: 'Unauthorized Access',
    message: 'Attempt detected at Entrance Gate',
    time: '10 minutes ago',
    type: 'alert',
    read: false
  },
  {
    id: 'notif-002',
    title: 'Camera Offline',
    message: 'Hallway West camera disconnected',
    time: '2 hours ago',
    type: 'warning',
    read: false
  },
  {
    id: 'notif-003',
    title: 'Storage Warning',
    message: 'Primary storage at 68% capacity',
    time: '3 hours ago',
    type: 'warning',
    read: true
  },
  {
    id: 'notif-004',
    title: 'System Update',
    message: 'AI engine update available (v3.3.0)',
    time: '1 day ago',
    type: 'info',
    read: true
  }
];

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