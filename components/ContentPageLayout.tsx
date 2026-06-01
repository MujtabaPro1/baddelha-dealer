'use client';

import React, { ReactNode } from 'react';
import { Loader2 } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface ContentPageLayoutProps {
  titleEn: string;
  titleAr: string;
  language: 'en' | 'ar';
  isLoading: boolean;
  error: string | null;
  children: ReactNode;
}

const ContentPageLayout: React.FC<ContentPageLayoutProps> = ({
  titleEn,
  titleAr,
  language,
  isLoading,
  error,
  children,
}) => {
  const isArabic = language === 'ar';
  const title = isArabic ? titleAr : titleEn;

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className={`text-3xl font-bold text-[#2c3e50] mb-6 ${isArabic ? 'text-right' : 'text-left'}`}>
            {title}
          </h1>

          {isLoading && (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-[#f39c12]" />
            </div>
          )}

          {error && (
            <Alert variant="default" className="mb-6">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {!isLoading && !error && (
            <div className={`bg-white rounded-lg shadow-sm p-6 prose max-w-none ${isArabic ? 'text-right' : 'text-left'}`}>
              {children}
            </div>
          )}
        </div>
      </main>

    </div>
  );
};

export default ContentPageLayout;
