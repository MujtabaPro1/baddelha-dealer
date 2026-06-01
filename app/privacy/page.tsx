'use client';
import React, { useEffect, useState } from 'react';
import { fetchPageContent } from '../../service/pageContentService';
import { useLanguage } from '../../contexts/LanguageContext';
import ContentPageLayout from '../../components/ContentPageLayout';

const Privacy: React.FC = () => {
  const [contentEn, setContentEn] = useState<string>('');
  const [contentAr, setContentAr] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { language } = useLanguage();

  useEffect(() => {
    const getPrivacyPolicy = async () => {
      try {
        setIsLoading(true);
        const response: any = await fetchPageContent('privacy-policy');

        if (response) {
          setContentEn(response.content_en || '');
          setContentAr(response.content_ar || '');
        } else {
          setError(response.message || 'Failed to load Privacy Policy content');
        }
      } catch (err) {
        setError('An error occurred while fetching the Privacy Policy');
        console.error('Privacy Policy fetch error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    getPrivacyPolicy();
  }, []);

  return (
    <ContentPageLayout
      titleEn="Privacy Policy"
      titleAr="سياسة الخصوصية"
      language={language as 'en' | 'ar'}
      isLoading={isLoading}
      error={error}
    >
      <div dangerouslySetInnerHTML={{ __html: language === 'ar' ? contentAr : contentEn }} />
    </ContentPageLayout>
  );
};

export default Privacy;