'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { useNotification } from '@/contexts/NotificationContext';
import { Info, CheckCircle, AlertTriangle, AlertCircle } from 'lucide-react';

export function NotificationDemo() {
  const { addNotification } = useNotification();

  const createInfoNotification = () => {
    addNotification({
      type: 'info',
      title: 'Information',
      message: 'This is an information notification.',
    });
  };

  const createSuccessNotification = () => {
    addNotification({
      type: 'success',
      title: 'Success',
      message: 'Your action was completed successfully!',
    });
  };

  const createWarningNotification = () => {
    addNotification({
      type: 'warning',
      title: 'Warning',
      message: 'Please be careful with this action.',
    });
  };

  const createErrorNotification = () => {
    addNotification({
      type: 'error',
      title: 'Error',
      message: 'Something went wrong. Please try again.',
    });
  };

  const createBidNotification = () => {
    addNotification({
      type: 'success',
      title: 'Bid Placed',
      message: 'Your bid of SAR 120,000 for 2023 Mercedes-Benz S-Class has been placed successfully.',
    });
  };

  const createAuctionNotification = () => {
    addNotification({
      type: 'info',
      title: 'Auction Ending Soon',
      message: 'The auction for 2022 Toyota Land Cruiser ends in 30 minutes.',
    });
  };

  return (
    <div className="p-4 border rounded-lg bg-white shadow-sm">
      <h3 className="text-lg font-medium mb-4">Notification Demo</h3>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        <Button 
          onClick={createInfoNotification}
          className="flex items-center justify-center bg-[#3498db] hover:bg-blue-600"
        >
          <Info className="w-4 h-4 mr-2" />
          Info
        </Button>
        <Button 
          onClick={createSuccessNotification}
          className="flex items-center justify-center bg-[#2ecc71] hover:bg-green-600"
        >
          <CheckCircle className="w-4 h-4 mr-2" />
          Success
        </Button>
        <Button 
          onClick={createWarningNotification}
          className="flex items-center justify-center bg-[#f39c12] hover:bg-amber-600"
        >
          <AlertTriangle className="w-4 h-4 mr-2" />
          Warning
        </Button>
        <Button 
          onClick={createErrorNotification}
          className="flex items-center justify-center bg-[#e74c3c] hover:bg-red-600"
        >
          <AlertCircle className="w-4 h-4 mr-2" />
          Error
        </Button>
        <Button 
          onClick={createBidNotification}
          className="flex items-center justify-center bg-[#2c3e50] hover:bg-slate-800 col-span-2 md:col-span-1"
        >
          Bid Notification
        </Button>
        <Button 
          onClick={createAuctionNotification}
          className="flex items-center justify-center bg-[#34495e] hover:bg-slate-700 col-span-2 md:col-span-2"
        >
          Auction Notification
        </Button>
      </div>
    </div>
  );
}
