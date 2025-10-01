'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, authService } from '@/lib/auth';
import axiosInstance from '@/service/api';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  updateProfile: (updates: Partial<User>) => Promise<{ success: boolean; error?: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

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
      const response: any = await axiosInstance.post<any>('auth/sign-in', {
        email,
        password
      });

  
      if(response.status === 200 || response.status === 201){
        const { data } = response;
      
        // Store tokens
        localStorage.setItem('token', data.access_token);
        localStorage.setItem('refresh_token', data.refresh_token);
        
        // Map API response to AuthUser format
        let userData: any = {
          id: data.id.toString(),
          name: `${data.firstName || ''} ${data.lastName || ''}`.trim(),
          email: data.email,
          role: data.role.name
        };
        
      
        localStorage.setItem('baddelha_user', JSON.stringify(userData));
        setUser(userData);
      
        // Return the role for redirection in the Login component
        return { success: true, role: userData.role };
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
