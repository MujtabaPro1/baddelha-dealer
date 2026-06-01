import './globals.css';
import type { Metadata } from 'next';
import { Poppins, Noto_Sans_Arabic } from 'next/font/google';
import { AuthProvider } from '@/contexts/AuthContext';
import { NotificationProvider } from '@/contexts/NotificationContext';
import Footer from '@/components/Footer';
import { LanguageProvider } from '@/contexts/LanguageContext';
import Navbar from '@/components/Navbar';
import { DirectionWrapper } from '@/components/DirectionWrapper';
import { Toaster } from '@/components/ui/sonner';

const poppins = Poppins({
  weight: ['300', '400', '500', '600', '700'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-poppins',
});

const notoSansArabic = Noto_Sans_Arabic({
  weight: ['300', '400', '500', '600', '700'],
  subsets: ['arabic'],
  display: 'swap',
  variable: '--font-arabic',
});

export const metadata: Metadata = {
  title: 'Badelha Dealer - Professional Vehicle Auction Platform',
  description: 'Professional car auction platform for dealers with real-time bidding and comprehensive vehicle information.',
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png' },
    ],
  },
  manifest: '/site.webmanifest',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${poppins.className} ${poppins.variable} ${notoSansArabic.variable} [&[dir=rtl]]:font-arabic`}>
        <LanguageProvider>
          <DirectionWrapper>
            <AuthProvider>
              <NotificationProvider>
                <Navbar/>
                <div className="min-h-screen pt-[80px]">
                  {children}
                </div>
                <Footer />
                <Toaster />
              </NotificationProvider>
            </AuthProvider>
          </DirectionWrapper>
        </LanguageProvider>
      </body>
    </html>
  );
}
