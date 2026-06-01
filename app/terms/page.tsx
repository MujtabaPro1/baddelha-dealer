'use client';
import React, { useEffect, useState } from 'react';
import { fetchPageContent } from '../../service/pageContentService';
import { useLanguage } from '../../contexts/LanguageContext';
import ContentPageLayout from '../../components/ContentPageLayout';

const Terms: React.FC = () => {
  const [contentEn, setContentEn] = useState<string>('');
  const [contentAr, setContentAr] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { language } = useLanguage();

  useEffect(() => {
    const getTermsAndConditions = async () => {
      try {
        setIsLoading(true);
        const response: any = await fetchPageContent('terms');

        if (response) {
          setContentEn(response.content_en || '');
          setContentAr(response.content_ar || '');
        } else {
          setError(response.message || 'Failed to load Terms and Conditions content');
        }
      } catch (err) {
        setError('An error occurred while fetching the Terms and Conditions');
        console.error('Terms and Conditions fetch error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    getTermsAndConditions();
  }, []);

  return (
    <ContentPageLayout
      titleEn="Terms and Conditions"
      titleAr="شروط الاستخدام"
      language={language as 'en' | 'ar'}
      isLoading={isLoading}
      error={error}
    >
      <div dangerouslySetInnerHTML={{ __html: language === 'ar' ? contentAr : contentEn }} />
    </ContentPageLayout>
  );
};

export default Terms;