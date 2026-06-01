'use client';
import React, { useState } from 'react';
import { Facebook, Instagram, Linkedin, Mail, Phone, Send, Ghost, Music2 } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import lang from '../locale';
import Image from 'next/image';

const Footer: React.FC = () => {
  const { language } = useLanguage();
  const languageContent = language === 'ar' ? 'ar' : 'en';
  const [email, setEmail] = useState('');

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle newsletter submission
    console.log('Newsletter signup:', email);
    setEmail('');
  };

  return (
    <>
      <footer className="bg-[#3d3d40] text-white pt-16 pb-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
            {/* Company Section */}
            <div className="lg:col-span-2">
              <div className="flex items-center mb-4">
                <Image 
                  width={150}
                  height={70}
                  src="/logo-light.png" 
                  alt="Baddelha Logo" 
                  className="w-[150px] h-[70px] object-cover"
                />
              </div>
              <p className="text-white mb-6 max-w-md">
                {lang[languageContent].footerText}
              </p>
              

   <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            <a 
              href="#" 
              className="bg-primaryBtn  text-white font-semibold py-4 px-6 rounded-lg text-center transition"
            >
              {lang[languageContent].getInstantValuation}
            </a>
            <a 
              href="#" 
              className="bg-transparent border-2 border-white text-white hover:bg-primaryBtn hover:text-white font-semibold py-4 px-6 rounded-lg text-center transition"
            >
             {lang[languageContent].sellYourCarNow}
            </a>
          </div>

          
              
              {/* Social Links */}
              <div className="flex space-x-4">
                {[
                  { Icon: Ghost, href: ' https://snapchat.com/t/UKEQxf7p' },
                  { Icon: Music2, href: 'https://www.tiktok.com/@baddelha.sa' },
                  { Icon: Instagram, href: 'https://www.instagram.com/baddelha.sa?utm_source=qr&igsh=ZTZ0YThoNnZseXVr' },
                  { Icon: Facebook, href: 'https://www.facebook.com/people/Baddelha-%D8%A8%D8%AF%D9%84%D9%87%D8%A7/61585713903480/?rdid=JzqsCqDxaOb4CcFe&share_url=https%3A%2F%2Fwww.facebook.com%2Fshare%2F1CqjQbz6HL%2F%3Fref%3D1' },
                  { Icon: Linkedin, href: 'https://www.linkedin.com/company/baddelha.com.sa' }
                ].map(({ Icon, href }, index) => (
                  <a
                    key={index}
                    href={href}
                    target="_blank"
                    rel="noreferrer"
                    className="bg-gray-700 p-2 rounded-full hover:bg-amber-500 transition"
                  >
                    <Icon className="h-5 w-5" />
                  </a>
                ))}
              </div>
            </div>
            
         
      
            
            {/* Legal Section */}
            <div>
              <h3 className="font-semibold text-lg mb-4">Legal</h3>
              <ul className="space-y-3">
                <li><a href="/about" className="text-white hover:text-amber-500 transition">{lang[languageContent].aboutUs}</a></li>
                <li><a href="/terms" className="text-white hover:text-amber-500 transition">{lang[languageContent].termsOfService}</a></li>
                <li><a href="/privacy" className="text-white hover:text-amber-500 transition">{lang[languageContent].privacyPolicy}</a></li>
              </ul>
            </div>
            
            {/* Contact Section */}
            <div>
              <h3 className="font-semibold text-lg mb-4">{lang[languageContent].contact}</h3>
              <address className="not-italic text-white space-y-3">
                <p>{lang[languageContent].address}</p>
                <p className="flex items-center">
                  <Phone className="h-4 w-4 mr-2" />
                  <a dir="ltr" href="tel:+966920032590" className="hover:text-amber-500 transition">
                    92 00 32590
                  </a>
                </p>
                <p className="flex items-center">
                  <Mail className="h-4 w-4 mr-2" />
                  <a href="mailto:info@baddelha.sa" className="hover:text-amber-500 transition">
                    info@baddelha.sa
                  </a>
                </p>
              </address>
            </div>
          </div>
          
          {/* Primary CTAs */}
       
          
          {/* Bottom Section */}
          <div className="border-t border-gray-700 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-white text-sm mb-4 md:mb-0">
                &copy; {new Date().getFullYear()} BADDELHA | بدلها. All rights reserved.
              </p>
              <div className="flex flex-wrap gap-4 text-sm text-white">
                <a href="/terms" className="hover:text-amber-500 transition">{lang[languageContent].termsOfService}</a>
                <a href="/privacy" className="hover:text-amber-500 transition">{lang[languageContent].privacyPolicy}</a>
              </div>
            </div>
          </div>
        </div>
      </footer>
      
      {/* Mobile Sticky Contact Button */}
      <div className="md:hidden fixed bottom-6 right-6 z-[60]">
        <a 
          href="/contactus" 
          className="bg-amber-500 hover:bg-amber-600 text-white w-14 h-14 rounded-full shadow-xl transition-all duration-300 hover:scale-110 flex items-center justify-center"
        >
          <Phone className="h-6 w-6" />
        </a>
      </div>
    </>
  );
};

export default Footer;