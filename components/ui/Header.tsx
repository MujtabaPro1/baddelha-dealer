'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Car } from 'lucide-react';
import { UserProfileMenu } from './UserProfileMenu';

interface HeaderProps {
  title?: string;
  rightContent?: React.ReactNode;
}

export function Header({ title = 'Badelha Dealer', rightContent }: HeaderProps) {
  const router = useRouter();

  return (
    <header className="bg-white shadow-lg border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-[#f78f37] rounded-lg flex items-center justify-center">
                <Car className="w-6 h-6 text-white" />
              </div>
              <div onClick={() => router.push('/')} className="cursor-pointer">
                <h1 className="text-2xl font-bold text-slate-900">{title}</h1>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            {rightContent || <UserProfileMenu />}
          </div>
        </div>
      </div>
    </header>
  );
}
