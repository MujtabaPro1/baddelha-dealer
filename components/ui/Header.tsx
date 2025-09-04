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
    <header className="bg-[#2c3e50] shadow-lg border-b border-[#34495e] sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-[#f39c12] rounded-lg flex items-center justify-center shadow-md hover:bg-[#e67e22] transition-colors duration-200">
                <Car className="w-6 h-6 text-white" />
              </div>
              <div onClick={() => router.push('/')} className="cursor-pointer group">
                <h1 className="text-2xl font-bold text-white group-hover:text-[#f8f9fa] transition-colors duration-200">{title}</h1>
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
