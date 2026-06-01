'use client';

import React from 'react';
import Link from 'next/link';
import { useLanguage } from '@/contexts/LanguageContext';

export function ContentFooter() {
  const { language } = useLanguage();

  const isArabic = language === 'ar';

  return (
    <footer className="bg-[#2c3e50] text-white mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-bold text-[#f39c12] mb-4">
              {isArabic ? 'بدلها للتجار' : 'Baddelha Dealer'}
            </h3>
            <p className="text-gray-300 text-sm">
              {isArabic 
                ? 'منصة مزادات السيارات الاحترافية للتجار'
                : 'Professional Vehicle Auction Platform for Dealers'}
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-4">
              {isArabic ? 'روابط سريعة' : 'Quick Links'}
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/terms" className="text-gray-300 hover:text-[#f39c12] transition-colors">
                  {isArabic ? 'الشروط والأحكام' : 'Terms & Conditions'}
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-gray-300 hover:text-[#f39c12] transition-colors">
                  {isArabic ? 'سياسة الخصوصية' : 'Privacy Policy'}
                </Link>
              </li>
              <li>
                <Link href="/auth" className="text-gray-300 hover:text-[#f39c12] transition-colors">
                  {isArabic ? 'تسجيل الدخول' : 'Sign In'}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">
              {isArabic ? 'تواصل معنا' : 'Contact Us'}
            </h4>
            <ul className="space-y-2 text-sm text-gray-300">
              <li>{isArabic ? 'البريد الإلكتروني:' : 'Email:'} support@baddelha.com</li>
              <li>{isArabic ? 'الهاتف:' : 'Phone:'} +966 XX XXX XXXX</li>
              <li>{isArabic ? 'الموقع:' : 'Location:'} {isArabic ? 'الرياض، المملكة العربية السعودية' : 'Riyadh, Saudi Arabia'}</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-6 text-center text-sm text-gray-400">
          <p>
            {isArabic 
              ? `© ${new Date().getFullYear()} بدلها. جميع الحقوق محفوظة.`
              : `© ${new Date().getFullYear()} Baddelha. All rights reserved.`}
          </p>
        </div>
      </div>
    </footer>
  );
}
