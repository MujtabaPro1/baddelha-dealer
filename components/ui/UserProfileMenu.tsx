'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { LogOut, User, Settings, Table, Receipt } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import axiosInstance from '@/service/api';

export function UserProfileMenu() {
  const { user, logout } = useAuth();
  const router = useRouter();



  const handleLogout = async () => {
    await logout();
    router.push('/auth');
  };

  if (!user) return null;

  // Get initials for avatar fallback
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center space-x-2 rounded-full p-1 hover:bg-[#34495e]/30 transition-colors duration-200">
          <Avatar className="h-8 w-8 border-2 border-[#f39c12] shadow-sm">
            <AvatarImage src={user.avatar} alt={user.name} />
            <AvatarFallback className="bg-[#f39c12]/20 text-[#f39c12] font-medium">
              {getInitials(user.name)}
            </AvatarFallback>
          </Avatar>
          <span className="text-sm font-medium hidden md:inline text-white">{user.name}</span>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56 border-[#e9ecef] bg-white shadow-lg rounded-md overflow-hidden">
        <DropdownMenuLabel>
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium text-[#2c3e50]">{user.name}</p>
            <p className="text-xs text-[#7f8c8d]">{user.email}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-[#e9ecef]" />
        <DropdownMenuItem className="cursor-pointer hover:bg-[#f8f9fa] hover:text-[#3498db] text-[#2c3e50] transition-colors duration-200">
          <User className="mr-2 h-4 w-4 text-[#34495e]" />
          <span onClick={() => router.push('/dealer/profile')} >Profile</span>
        </DropdownMenuItem>
        <DropdownMenuItem className="cursor-pointer hover:bg-[#f8f9fa] hover:text-[#3498db] text-[#2c3e50] transition-colors duration-200">
          <Settings className="mr-2 h-4 w-4 text-[#34495e]" />
          <span onClick={() => router.push('/dealer/settings')} >Settings</span>
        </DropdownMenuItem>
        <DropdownMenuItem className="cursor-pointer hover:bg-[#f8f9fa] hover:text-[#3498db] text-[#2c3e50] transition-colors duration-200">
          <Table className="mr-2 h-4 w-4 text-[#34495e]" />
          <span onClick={() => router.push('/dealer/bids')} >Bids</span>
        </DropdownMenuItem>
        <DropdownMenuItem className="cursor-pointer hover:bg-[#f8f9fa] hover:text-[#3498db] text-[#2c3e50] transition-colors duration-200">
          <Receipt className="mr-2 h-4 w-4 text-[#34495e]" />
          <span onClick={() => router.push('/dealer/invoices')} >Invoices</span>
        </DropdownMenuItem>

    
        <DropdownMenuSeparator className="bg-[#e9ecef]" />
        <DropdownMenuItem className="cursor-pointer text-[#e74c3c] hover:bg-[#f8f9fa] hover:text-[#c0392b] transition-colors duration-200" onClick={handleLogout}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
