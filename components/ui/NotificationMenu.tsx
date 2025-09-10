'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Bell, Check, Trash2, X, Info, AlertCircle, CheckCircle, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNotification, NotificationType } from '@/contexts/NotificationContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { format } from 'date-fns';

export function NotificationMenu() {
  const { notifications, unreadCount, markAsRead, markAllAsRead, removeNotification, clearAllNotifications } = useNotification();
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const handleOpen = (open: boolean) => {
    setIsOpen(open);
    // Mark all as read when opening the menu
    if (open) {
      markAllAsRead();
    }
  };

  const getNotificationIcon = (type: NotificationType) => {
    switch (type) {
      case 'info':
        return <Info className="w-4 h-4 text-[#3498db]" />;
      case 'success':
        return <CheckCircle className="w-4 h-4 text-[#2ecc71]" />;
      case 'warning':
        return <AlertCircle className="w-4 h-4 text-[#f39c12]" />;
      case 'error':
        return <X className="w-4 h-4 text-[#e74c3c]" />;
      default:
        return <Info className="w-4 h-4 text-[#3498db]" />;
    }
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={handleOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative p-2 rounded-full hover:bg-[#34495e] transition-colors">
          <Bell className="w-5 h-5 text-white" />
          {unreadCount > 0 && (
            <span className="absolute top-0 right-0 inline-flex items-center justify-center w-4 h-4 text-xs font-bold text-white bg-[#e74c3c] rounded-full">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-80" align="end">
        <DropdownMenuLabel className="flex items-center justify-between">
          <span>Notifications</span>
          {notifications.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="h-8 px-2 text-xs text-[#7f8c8d] hover:text-[#2c3e50]"
              onClick={clearAllNotifications}
            >
              <Trash2 className="w-3 h-3 mr-1" />
              Clear All
            </Button>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <div className="max-h-[300px] overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="py-6 text-center text-[#7f8c8d]">
              <p>No notifications</p>
            </div>
          ) : (
            <DropdownMenuGroup>
              {notifications.slice(0, 5).map((notification) => (
                <DropdownMenuItem
                  key={notification.id}
                  className={`flex flex-col items-start p-3 cursor-default ${
                    !notification.isRead ? 'bg-[#f8f9fa]' : ''
                  }`}
                >
                  <div className="flex w-full justify-between">
                    <div className="flex items-center">
                      {getNotificationIcon(notification.type)}
                      <span className="ml-2 font-medium">{notification.title || 'Notification'}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0 text-[#7f8c8d] hover:text-[#2c3e50] hover:bg-transparent"
                        onClick={() => removeNotification(notification.id)}
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                  <p className="text-sm text-[#7f8c8d] mt-1">{notification.message}</p>
                  <div className="flex justify-between w-full mt-2 text-xs text-[#7f8c8d]">
                    <span>{format(notification.createdAt, 'MMM dd, yyyy HH:mm')}</span>
                  </div>
                </DropdownMenuItem>
              ))}
              {notifications.length > 5 && (
                <div className="py-2 px-3 text-center text-[#7f8c8d] text-sm">
                  <span>+ {notifications.length - 5} more notifications</span>
                </div>
              )}
            </DropdownMenuGroup>
          )}
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem 
          className="p-3 cursor-pointer flex items-center justify-center text-[#3498db]" 
          onClick={() => router.push('/notifications')}
        >
          <ExternalLink className="w-4 h-4 mr-2" />
          View All Notifications
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
