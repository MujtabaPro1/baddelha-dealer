'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import lang from '@/locale';

interface LoginFormProps {
  onLogin: (email: string, password: string) => Promise<void>;
  onSwitchToSignup: () => void;
  loading: boolean;
  error: string | null;
}

export function LoginForm({ onLogin, onSwitchToSignup, loading, error }: LoginFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const { language } = useLanguage();
  const t = lang[language];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onLogin(email, password);
  };

  return (
    <div className="space-y-8">
      {/* Heading */}
      <div className="space-y-3">
        <h1 className="text-5xl font-black text-gray-900 tracking-tight leading-tight">{t.welcomeBack}</h1>
        <p className="text-lg text-gray-600 font-light">{t.signInToAccount}</p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Error Alert */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-sm text-red-700 font-medium">{error}</p>
          </div>
        )}

        {/* Email Field */}
        <div className="space-y-3">
          <Label htmlFor="email" className="text-sm font-bold text-gray-900">
            {t.email}
          </Label>
          <div className="relative">
            <Mail className="absolute start-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              id="email"
              type="email"
              placeholder="you@badelha.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="ps-11 h-11 rounded-lg border border-gray-300 bg-white hover:border-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
              required
            />
          </div>
        </div>

        {/* Password Field */}
        <div className="space-y-3">
          <Label htmlFor="password" className="text-sm font-bold text-gray-900">
            {t.password}
          </Label>
          <div className="relative">
            <Lock className="absolute start-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              id="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="ps-11 pe-11 h-11 rounded-lg border border-gray-300 bg-white hover:border-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute end-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              tabIndex={-1}
            >
              {showPassword ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* Remember Me */}
        <div className="flex items-center pt-2">
          <input
            id="rememberMe"
            type="checkbox"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
            className="w-4 h-4 text-blue-600 bg-white border-gray-300 rounded cursor-pointer accent-blue-600"
          />
          <label htmlFor="rememberMe" className="ms-2.5 text-sm text-gray-700 cursor-pointer">
            Remember me
          </label>
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          disabled={loading}
          className="w-full h-11  bg-gradient-to-br from-[#001f4d] via-[#003B7E] to-[#0055b3] hover:bg-blue-700 text-white font-semibold rounded-lg transition-all duration-200 shadow-sm hover:shadow-md disabled:opacity-75 disabled:cursor-not-allowed mt-6"
        >
          {loading ? (
            <>
              <Loader2 className="me-2 h-5 w-5 animate-spin" />
              {t.signingIn}
            </>
          ) : (
            t.signIn
          )}
        </Button>
      </form>

      {/* Sign Up Link */}
      <div className="text-center border-t border-gray-200 pt-6">
        <p className="text-gray-700">
          {t.dontHaveAnAccount}{' '}
          <button
            type="button"
            onClick={onSwitchToSignup}
            className="text-blue-600  hover:text-blue-700 font-semibold transition-colors"
          >
            {t.signUp}
          </button>
        </p>
      </div>

      {/* Footer */}
      <div className="text-center pt-2">
        <p className="text-xs text-gray-500">© 2026 Badelha. All rights reserved.</p>
      </div>
    </div>
  );
}
