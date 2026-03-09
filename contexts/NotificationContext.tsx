'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { fetchNotifications } from '@/services/api';

export type NotificationType = 'info' | 'success' | 'warning' | 'error';

export interface Notification {
  id: string;
  type: NotificationType;
  message: string;
  title?: string;
  isRead: boolean;
  createdAt: Date;
  parsedData?: {
    carId?: string;
    auctionId?: string;
    winningAmount?: number;
  };
}

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  loading: boolean;
  addNotification: (notification: Omit<Notification, 'id' | 'isRead' | 'createdAt'>) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  removeNotification: (id: string) => void;
  clearAllNotifications: () => void;
  refreshNotifications: () => Promise<void>;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);

  // Update unread count whenever notifications change
  useEffect(() => {
    const count = notifications.filter(notification => !notification.isRead).length;
    setUnreadCount(count);
  }, [notifications]);

  // Fetch notifications from API
  const refreshNotifications = async () => {
    setLoading(true);
    try {
      const response = await fetchNotifications();
      
      // Transform API response to match our Notification interface
      const apiNotifications = response.data || response;
      const transformedNotifications: Notification[] = Array.isArray(apiNotifications) 
        ? apiNotifications.map((item: any) => {
            const originalMessage = item.message || item.content || '';
            const parsedData = parseMessageData(originalMessage);
            const formattedMessage = parsedData ? formatAuctionMessage(parsedData) : null;
            
            return {
              id: item.id || generateId(),
              type: mapNotificationType(item.type || item.notificationType || (parsedData ? 'success' : 'info')),
              message: formattedMessage || originalMessage,
              title: item.title || item.subject || (parsedData ? 'Auction Won!' : 'Notification'),
              isRead: item.isRead || item.read || false,
              createdAt: item.createdAt ? new Date(item.createdAt) : new Date(),
              parsedData: parsedData || undefined,
            };
          })
        : [];
      
      setNotifications(transformedNotifications);
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
      // Keep existing notifications on error
    } finally {
      setLoading(false);
    }
  };

  // Load notifications on mount
  useEffect(() => {
    refreshNotifications();
  }, []);

  // Helper function to parse JSON message data
  const parseMessageData = (message: string) => {
    try {
      const parsed = JSON.parse(message);
      if (parsed.carId || parsed.auctionId || parsed.winningAmount) {
        return {
          carId: parsed.carId,
          auctionId: parsed.auctionId,
          winningAmount: parsed.winningAmount,
        };
      }
    } catch (error) {
      // Not JSON or invalid JSON, return null
    }
    return null;
  };

  // Helper function to format auction message
  const formatAuctionMessage = (parsedData: any) => {
    if (parsedData?.winningAmount && parsedData?.carId) {
      return `Congratulations! You won the auction with a bid of $${parsedData.winningAmount.toLocaleString()}`;
    }
    return null;
  };

  // Helper function to map API notification types to our types
  const mapNotificationType = (type: string): NotificationType => {
    switch (type?.toLowerCase()) {
      case 'success':
        return 'success';
      case 'warning':
        return 'warning';
      case 'error':
      case 'danger':
        return 'error';
      case 'info':
      default:
        return 'info';
    }
  };

  // Add a new notification
  const addNotification = (notification: Omit<Notification, 'id' | 'isRead' | 'createdAt'>) => {
    const newNotification: Notification = {
      ...notification,
      id: generateId(),
      isRead: false,
      createdAt: new Date(),
    };
    
    setNotifications(prev => [newNotification, ...prev]);
  };

  // Mark a notification as read
  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === id ? { ...notification, isRead: true } : notification
      )
    );
  };

  // Mark all notifications as read
  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notification => ({ ...notification, isRead: true }))
    );
  };

  // Remove a notification
  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  };

  // Clear all notifications
  const clearAllNotifications = () => {
    setNotifications([]);
  };

  // Generate a unique ID for notifications
  const generateId = () => {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        loading,
        addNotification,
        markAsRead,
        markAllAsRead,
        removeNotification,
        clearAllNotifications,
        refreshNotifications,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotification() {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
}
