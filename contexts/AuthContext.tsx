'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, authService } from '@/lib/auth';
import axiosInstance from '@/service/api';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isPending: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string; isPending?: boolean }>;
  logout: () => Promise<void>;
  updateProfile: (updates: Partial<User>) => Promise<{ success: boolean; error?: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isPending, setIsPending] = useState(false);

  useEffect(() => {
    // Check if user is already logged in
    const checkAuth = async () => {
      try {
        const currentUser = authService.getCurrentUser();
        setUser(currentUser);
      } catch (error) {
        console.error('Error checking authentication:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);


  const login = async (email: string, password: string) => {
    setIsLoading(true);
    
    try {
      const response: any = await axiosInstance.post<any>('1.0/dealer/sign-in', {
        email,
        password
      });

  
      if(response.status === 200 || response.status === 201){
        const { data } = response;
      
        // Store tokens
        localStorage.setItem('token', data.access_token);
        localStorage.setItem('refresh_token', data.refresh_token);
        
        // Map dealer status to normalized format
        let normalizedStatus = 'Active';
        if(data?.dealer?.status === 'active') {
          normalizedStatus = 'Active';
        }
        else if(data?.dealer?.status === 'pending') {
          normalizedStatus = 'Pending';
        }
        else if(data?.dealer?.status === 'pending_approval') {
          normalizedStatus = 'Pending_Approval';
        }

        // Map API response to AuthUser format
        let userData: any = {
          id: data.id?.toString() || '',
          name: `${data.firstName || ''} ${data.lastName || ''}`.trim(),
          email: data.email || '',
          phone: data.phone || '',
          avatar: data.avatar || null,
          role: data.role?.name || 'Dealer',
          permissions: data.role?.Permission || [],
          dealer: {
            company: data.dealer?.company || '',
            licenseNumber: data.dealer?.licenseNumber || '',
            dealerType: data.dealer?.dealerType || null,
            status: data.dealer?.status || 'pending'
          },
          status: normalizedStatus
        };
        
        // Check if dealer account is pending (either not verified or awaiting approval)
        const isPendingStatus = normalizedStatus === 'Pending' || normalizedStatus === 'Pending_Approval';
        setIsPending(isPendingStatus);
      
        localStorage.setItem('baddelha_user', JSON.stringify(userData));
        setUser(userData);
      
        // Return the role and pending status for redirection in the Login component
        return { success: true, role: userData.role, isPending: isPendingStatus };
      } else {
        // Extract error message from response
        const errorMessage = typeof response.data.message === 'string' 
          ? response.data.message 
          : 'Failed to login. Please check your credentials.';
        
        return { success: false, error: errorMessage };
      }
    } catch (err: any) {
      console.error('Login error:', err);
      
      // Extract error message from error response
      let errorMessage = 'Failed to login. Please check your credentials.';
      
      if (err.response?.data) {
        if (typeof err.response.data.message === 'string') {
          errorMessage = err.response.data.message;
        } else if (err.response.data.message && typeof err.response.data.message === 'object') {
          // If message is an object, try to extract a useful string
          errorMessage = JSON.stringify(err.response.data.message);
        }
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  // Signup is now handled directly by the SignupForm component



  const logout = async () => {
    localStorage.removeItem('baddelha_user');
    localStorage.removeItem('token');
    localStorage.removeItem('refresh_token');
    setUser(null);
    await authService.logout();
    // Navigation will be handled by the protected routes
  };


  const updateProfile = async (updates: Partial<User>) => {
    try {
      const result = await authService.updateProfile(updates);
      if (result.success && result.user) {
        setUser(result.user);
      }
      return result;
    } catch (error) {
      console.error('Profile update error:', error);
      return { success: false, error: 'An unexpected error occurred' };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        isPending,
        login,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
