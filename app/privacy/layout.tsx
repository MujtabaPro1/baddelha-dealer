import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description:
    'Read BADDELHA’s privacy policy to understand how we collect, use, and protect your data when you use our car marketplace services.',
  openGraph: {
    title: 'Privacy Policy',
    description:
      'Read BADDELHA’s privacy policy to understand how we collect, use, and protect your data when you use our car marketplace services.',
    url: 'https://baddelha.com.sa/privacy',
    siteName: 'BADDELHA',
    type: 'website',
    images: [
      {
        url: '/logo_whatsapp.png',
        width: 1200,
        height: 630,
        alt: 'BADDELHA',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Privacy Policy',
    description:
      'Read BADDELHA’s privacy policy to understand how we collect, use, and protect your data when you use our car marketplace services.',
    images: ['/logo_whatsapp.png'],
  },
  alternates: {
    canonical: 'https://baddelha.com.sa/privacy',
  },
};

export default function PrivacyLayout({ children }: { children: React.ReactNode }) {
  return children;
}
