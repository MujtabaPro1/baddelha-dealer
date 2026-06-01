'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { LoginForm } from '@/components/auth/LoginForm';
import { SignupForm } from '@/components/auth/SignupForm';
import { useAuth } from '@/contexts/AuthContext';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { useLanguage } from '@/contexts/LanguageContext';
import lang from '@/locale';
import { toast } from 'sonner';
import Image from 'next/image';


export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { login, isAuthenticated, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const { language } = useLanguage();
  const t = lang[language];

  // If already authenticated, redirect to main page
  React.useEffect(() => {

    if (isAuthenticated) {
      router.push('/');
    }
  }, [isAuthenticated, router]);

  const handleLogin = async (email: string, password: string) => {
    setError(null);
    setLoading(true);
    try {
      const result: any = await login(email, password);
      console.log('Login result:', result);

      if (!result.success) {
        setError(result.error || 'Login failed');
      } else {
        // Check if dealer account is pending verification
        console.log('Result:', result);
        if (result.isPending) {
          console.log('Account pending verification');
          router.push('/dealer/verification');
        } 
        else if(result.status == 'Rejected') {
          console.log('Account rejected');
          toast.error('Unfortunately, your account has been rejected. Please Contact Support for more information', { duration: 5000 });
        }
        else if(result.status != 'Rejected') {
          console.log('Redirecting to home');
          router.push('/');
        }
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  // We don't need the handleSignup function anymore as the SignupForm now handles the API call directly

  // Show loading spinner while checking authentication
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="text-center">
          <LoadingSpinner size="large" />
          <p className="mt-4 text-slate-600">{t.loading}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex flex-col">
      <div className="flex flex-1 items-center justify-center p-4">
        <div className="w-full max-w-md">
          {isLogin ? (
            <>
                      <LoginForm
              onLogin={handleLogin}
              onSwitchToSignup={() => setIsLogin(false)}
              loading={loading}
              error={error}
            />
            </>

          ) : (
            <SignupForm
              onSwitchToLogin={() => setIsLogin(true)}
            />
          )}
        </div>
      </div>
    </div>
  );
}
