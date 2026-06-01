'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Mail, Lock } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import lang from '@/locale';
import Image from 'next/image';

interface LoginFormProps {
  onLogin: (email: string, password: string) => Promise<void>;
  onSwitchToSignup: () => void;
  loading: boolean;
  error: string | null;
}

export function LoginForm({ onLogin, onSwitchToSignup, loading, error }: LoginFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { language } = useLanguage();
  const t = lang[language];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onLogin(email, password);
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      
      <CardHeader className="space-y-1">
                          <Image 
                    src={"/logo.png"} 
                    alt="Logo" 
                    width={120} 
                    height={120} 
                    className="mx-auto w-[120px] h-[120px] object-cover"
                  />
        <CardTitle className="text-2xl font-bold text-center">{t.welcomeBack}</CardTitle>
        <p className="text-sm text-muted-foreground text-center">
          {t.signInToAccount}
        </p>
      
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="email">{t.email}</Label>
            <div className="relative">
              <Mail className="absolute start-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                id="email"
                type="email"
                placeholder="x@baddelha.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="ps-10"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">{t.password}</Label>
            <div className="relative">
              <Lock className="absolute start-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                id="password"
                type="password"
                placeholder={t.enterYourPassword}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="ps-10"
                required
              />
            </div>
          </div>

          <Button type="submit" className="w-full bg-[#ee3c48]" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="me-2 h-4 w-4 animate-spin" />
                {t.signingIn}
              </>
            ) : (
              t.signIn
            )}
          </Button>

          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              {t.dontHaveAnAccount}{' '}
              <button
                type="button"
                onClick={onSwitchToSignup}
                className="text-[#ee3c48] hover:underline font-medium"
              >
                {t.signUp}
              </button>
            </p>
          </div>

        </form>
      </CardContent>
    </Card>
  );
}
