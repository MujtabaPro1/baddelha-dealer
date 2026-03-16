'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { DealerVerificationScreen } from '@/components/dealer/DealerVerificationScreen';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

export default function VerificationPage() {
  const [isPending, setIsPending] = useState(false);
  const [isLoading,setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
     if(localStorage.getItem('baddelha_user')){
     const user = JSON.parse(localStorage?.getItem('baddelha_user') || '{}');
     console.log('User:', user);
     if(user?.status == 'Pending' || user?.status == 'Pending_Approval'){
      setIsPending(true);
     }
     }
     setIsLoading(false);
  }, [isPending]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8f9fa]">
        <div className="text-center">
          <LoadingSpinner size="large" />
          <p className="mt-4 text-[#7f8c8d]">Loading...</p>
        </div>
      </div>
    );
  }


  // Only show verification screen if user is authenticated and pending
  const user = localStorage.getItem('baddelha_user') ? JSON.parse(localStorage?.getItem('baddelha_user') || '{}') : null;
  if (user && isPending) {
    return <DealerVerificationScreen userStatus={(user as any).status} />;
  }

  return null;
}
