'use client';

import React, { useEffect, useState } from 'react';
import { Header } from '@/components/ui/Header';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useNotification, NotificationType } from '@/contexts/NotificationContext';
import { Info, CheckCircle, AlertTriangle, AlertCircle, Trash2, Bell, Check } from 'lucide-react';
import { format } from 'date-fns';
import axiosInstance from '@/service/api';

export default function NotificationsPage() {
  const { markAllAsRead, clearAllNotifications } = useNotification();
  const [activeTab, setActiveTab] = useState<NotificationType | 'all'>('all');
  const [notifications, setNotifications] = useState<any[]>([]);

  useEffect(() => {
    getNotifications();
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

  const getNotifications = async () => {
    try {
      const response = await axiosInstance.get('1.0/notification/find-all');
      console.log(response?.data);
      if (response?.data) {
        // Transform API response to match our enhanced notification format
        const apiNotifications = response?.data?.data || [];
        const transformedNotifications = Array.isArray(apiNotifications) 
          ? apiNotifications.map((item: any) => {
              const originalMessage = item.message || item.content || '';
              const parsedData = parseMessageData(originalMessage);
              const formattedMessage = parsedData ? formatAuctionMessage(parsedData) : null;
              
              return {
                ...item,
                type: mapNotificationType(item.type || item.notificationType || (parsedData ? 'success' : 'info')),
                message: formattedMessage || originalMessage,
                title: item.title || item.subject || (parsedData ? 'Auction Won!' : 'Notification'),
                createdAt: item.createdAt ? new Date(item.createdAt) : new Date(),
                parsedData: parsedData || undefined,
              };
            })
          : [];
        
        setNotifications(transformedNotifications);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  const getNotificationIcon = (type: NotificationType) => {
    switch (type) {
      case 'info':
        return <Info className="w-5 h-5 text-[#3498db]" />;
      case 'success':
        return <CheckCircle className="w-5 h-5 text-[#2ecc71]" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-[#f39c12]" />;
      case 'error':
        return <AlertCircle className="w-5 h-5 text-[#e74c3c]" />;
      default:
        return <Info className="w-5 h-5 text-[#3498db]" />;
    }
  };

  const filteredNotifications = activeTab === 'all' 
    ? notifications 
    : notifications.filter((notification: any) => notification.type === activeTab);

  return (
    <>
      <Header title="Notifications" />
      <div className="p-6 max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-[#2c3e50]">Notifications</h1>
            <p className="text-[#7f8c8d] mt-1">View and manage your notifications</p>
          </div>
          <div className="flex space-x-3 mt-4 md:mt-0">
            <Button 
              variant="outline" 
              className="border-[#e9ecef] text-[#7f8c8d] hover:text-[#2c3e50]"
              onClick={markAllAsRead}
            >
              <Check className="w-4 h-4 mr-2" />
              Mark All Read
            </Button>
            <Button 
              variant="outline" 
              className="border-[#e9ecef] text-[#7f8c8d] hover:text-[#2c3e50]"
              onClick={clearAllNotifications}
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Clear All
            </Button>
          </div>
        </div>

        <Tabs defaultValue="all" className="w-full" onValueChange={(value) => setActiveTab(value as NotificationType | 'all')}>
          <TabsList className="grid grid-cols-5 mb-8">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="info">Info</TabsTrigger>
            <TabsTrigger value="success">Success</TabsTrigger>
            <TabsTrigger value="warning">Warning</TabsTrigger>
            <TabsTrigger value="error">Error</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="mt-0">
            {filteredNotifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-[#7f8c8d]">
                <Bell className="w-16 h-16 mb-4 text-[#e9ecef]" />
                <h3 className="text-xl font-medium mb-2">No notifications</h3>
                <p>You don't have any {activeTab !== 'all' ? activeTab : ''} notifications at the moment.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredNotifications.map((notification:any) => (
                  <Card key={notification.id} className={`overflow-hidden transition-all duration-300 ${!notification.isRead ? 'border-l-4 border-l-[#3498db]' : ''}`}>
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="mt-1">
                          {getNotificationIcon(notification.type)}
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between items-start mb-2">
                            <h3 className="font-semibold text-lg text-[#2c3e50]">
                              {notification.title || 'Notification'}
                            </h3>
                            <span className="text-sm text-[#7f8c8d] bg-[#f8f9fa] px-2 py-1 rounded">
                              {format(new Date(notification.createdAt), 'MMM dd, yyyy HH:mm')}
                            </span>
                          </div>
                          <p className="text-[#7f8c8d] mb-3 leading-relaxed">{notification.message}</p>
                          
                          {notification.parsedData && (
                            <div className="mt-4 p-4 bg-gradient-to-r from-[#f8f9fa] to-[#ffffff] rounded-lg border border-[#e9ecef] shadow-sm">
                              <h4 className="text-sm font-semibold text-[#2c3e50] mb-3 flex items-center">
                                <CheckCircle className="w-4 h-4 text-[#2ecc71] mr-2" />
                                Auction Details
                              </h4>
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {notification.parsedData.winningAmount && (
                                  <div className="bg-white p-3 rounded-md border border-[#e9ecef]">
                                    <div className="text-xs font-medium text-[#7f8c8d] mb-1">Winning Amount</div>
                                    <div className="text-xl font-bold text-[#2ecc71]">
                                      ${notification.parsedData.winningAmount.toLocaleString()}
                                    </div>
                                  </div>
                                )}
                                {notification.parsedData.carId && (
                                  <div className="bg-white p-3 rounded-md border border-[#e9ecef]">
                                    <div className="text-xs font-medium text-[#7f8c8d] mb-1">Car ID</div>
                                    <div className="text-sm font-mono text-[#2c3e50] break-all">
                                      {notification.parsedData.carId}
                                    </div>
                                  </div>
                                )}
                                {notification.parsedData.auctionId && (
                                  <div className="bg-white p-3 rounded-md border border-[#e9ecef]">
                                    <div className="text-xs font-medium text-[#7f8c8d] mb-1">Auction ID</div>
                                    <div className="text-sm font-mono text-[#2c3e50] break-all">
                                      {notification.parsedData.auctionId}
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}
