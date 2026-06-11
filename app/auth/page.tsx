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
        console.log('Result:', result);
        if (result.isPending) {
          console.log('Account pending verification');
          router.push('/dealer/verification');
        } else if (result.status == 'Rejected') {
          console.log('Account rejected');
          toast.error('Unfortunately, your account has been rejected. Please Contact Support for more information', { duration: 5000 });
        } else if (result.status != 'Rejected') {
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

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-white">
        <div className="text-center">
          <LoadingSpinner size="large" />
          <p className="mt-4 text-slate-600">{t.loading}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex">
      {/* Left Hero Section */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-[#001f4d] via-[#003B7E] to-[#0055b3] relative overflow-hidden flex-col justify-between p-12">

               {/* Background decoration circles */}
        <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-white/5" />
        <div className="absolute -bottom-24 -right-24 w-80 h-80 rounded-full bg-white/5" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-white/[0.03]" />


        <div className="relative z-10 flex flex-col items-start justify-center pt-[120px] text-left px-4">
          <div className="mb-8">
            <h2 className="text-white text-5xl font-black leading-tight tracking-tight">
              Dealer Portal
            </h2>
            <h2 className="text-white/80 text-3xl font-bold leading-tight tracking-tight mt-2" dir="rtl">
              بوابة الوكيل
            </h2>
          </div>
          <div className="mb-12 max-w-md">
            <p className="text-blue-50 text-lg leading-relaxed font-light">
              Streamline your dealer workflow, manage vehicles, and generate reports — all in one seamless platform.
            </p>
            <p className="text-blue-100/70 text-base leading-relaxed font-light mt-3" dir="rtl">
              بسّط سير عمل الوكالة، وأدر المركبات، وأنشئ التقارير — كل ذلك في منصة واحدة متكاملة.
            </p>
          </div>

          {/* Feature pills */}
          <div className="flex flex-wrap gap-3">
            {['Vehicles', 'Reports', 'Analytics'].map((f) => (
              <span key={f} className="bg-white/15 backdrop-blur-sm text-white text-sm font-semibold px-5 py-2.5 rounded-full border border-white/25 hover:bg-white/25 transition-all duration-300">
                {f}
              </span>
            ))}
          </div>
        </div>



        {/* Footer */}
        <div className="relative z-10">
          <p className="text-blue-200 text-sm">© 2026 Badelha. All rights reserved.</p>
        </div>
      </div>

      {/* Right Form Section */}
      <div className="w-full lg:w-1/2 bg-white flex flex-col items-center justify-center p-6 lg:p-12">
        {/* Mobile Logo - Only visible when hero section is hidden */}
        <div className="lg:hidden mb-8 flex flex-col items-center">
          <Image
            src="/logo.png"
            alt="Badelha Logo"
            width={180}
            height={60}
            className="object-contain"
            priority
          />
          <p className="text-slate-500 text-sm mt-2">Dealer Portal</p>
        </div>

        <div className="w-full max-w-md">
          {isLogin ? (
            <LoginForm
              onLogin={handleLogin}
              onSwitchToSignup={() => setIsLogin(false)}
              loading={loading}
              error={error}
            />
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
