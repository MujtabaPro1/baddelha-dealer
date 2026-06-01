
'use client';
import React, { useState, useEffect } from 'react';
import { Menu, X, Phone, Globe } from 'lucide-react';
import Image from 'next/image';
import { useLanguage } from '../contexts/LanguageContext';
import lang from '../locale';
import { useRouter } from 'next/navigation';
import { UserProfileMenu } from './ui/UserProfileMenu';
import { NotificationMenu } from './ui/NotificationMenu';
import { useAuth } from '@/contexts/AuthContext';

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { language, setLanguage } = useLanguage();
  const languageContent = language === 'ar' ? 'ar' : 'en';
  const router = useRouter();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 shadow-sm ${
         'bg-white py-4'
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <span
              onClick={() => router.push('/')}
              className="cursor-pointer"
              role="button"
              aria-label="Go to homepage"
            >
              <Image
                src={'/logo.png'} 
                alt="Baddelha Logo" 
                width={150}
                height={50}
                style={{objectFit: 'cover'}}
                className="object-contain w-[120px] h-[40px] md:w-[150px] md:h-[50px]"
              />
            </span>
          </div>
          
          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-6">
            <div 
              onClick={() => router.push('tel:+966920032590')}
              dir="ltr"
              className="flex items-center text-black cursor-pointer hover:text-[#ee3c48] transition"
              role="button"
              aria-label="Call 920032590"
            >
              <Phone className="h-4 w-4 ml-2 mr-2" />
              <span className="font-medium ml-2 mr-2">92 00 32590</span>
            </div>
            {/* <button
              onClick={() => setLanguage(language === 'en' ? 'ar' : 'en')}
              className="flex items-center text-black hover:text-[#ee3c48] transition"
              aria-label={`Switch to ${language === 'en' ? 'Arabic' : 'English'} language`}
            >
              <Globe className="h-4 w-4 mr-1" />&nbsp;
              <span>{language === 'en' ? 'العربية' : 'English'}</span>
            </button> */}
            {!isAuthenticated ? (
              <button
                onClick={() => {
                  window.open('https://www.baddelha.com.sa', '_blank')
                }}
                className="bg-[#ee3c48] hover:bg-[#d4343e] text-white px-5 py-2 rounded-md transition transform hover:scale-105"
              >
                {language === 'en' ? 'Want to Sell?' : 'أريد البيع'}
              </button>
            ) : (
              <div className="flex items-center space-x-3">
                <NotificationMenu />
                <UserProfileMenu />
              </div>
            )}
          </div>
          
          {/* Mobile Menu */}
          <div className="flex md:hidden items-center space-x-2">
            {/* <button
              onClick={() => setLanguage(language === 'en' ? 'ar' : 'en')}
              className="flex items-center text-black hover:text-[#ee3c48] transition p-2"
              aria-label={`Switch to ${language === 'en' ? 'Arabic' : 'English'} language`}
            >
              <Globe className="h-5 w-5" />
            </button>
             */}
            {!isAuthenticated ? (
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-black p-2"
                aria-label={isMenuOpen ? "Close menu" : "Open menu"}
                aria-expanded={isMenuOpen}
              >
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            ) : (
              <div className="flex items-center space-x-2">
                <NotificationMenu />
                <UserProfileMenu />
              </div>
            )}
          </div>
        </div>

        {/* Mobile Dropdown Menu (for non-authenticated users) */}
        {isMenuOpen && !isAuthenticated && (
          <div className="md:hidden mt-4 pb-4 border-t border-gray-200 pt-4">
            <div className="flex flex-col space-y-4">
              <a 
                href="tel:+966920032590"
                dir="ltr"
                className="flex items-center text-black hover:text-[#ee3c48] transition"
              >
                <Phone className="h-4 w-4 mr-2" />
                <span className="font-medium">92 00 32590</span>
              </a>
              <button
                onClick={() => {
                  window.open('https://www.baddelha.com.sa', '_blank')
                  setIsMenuOpen(false)
                }}
                className="bg-[#ee3c48] hover:bg-[#d4343e] text-white px-5 py-3 rounded-md transition w-full text-center"
              >
                {language === 'en' ? 'Want to Sell?' : 'أريد البيع'}
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;