import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms and Conditions',
  description:
    'Review BADDELHA terms and conditions for using our website and services, including car inspection, valuation, and marketplace processes.',
  openGraph: {
    title: 'Terms and Conditions',
    description:
      'Review BADDELHA terms and conditions for using our website and services, including car inspection, valuation, and marketplace processes.',
    url: 'https://baddelha.com.sa/terms',
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
    title: 'Terms and Conditions',
    description:
      'Review BADDELHA terms and conditions for using our website and services, including car inspection, valuation, and marketplace processes.',
    images: ['/logo_whatsapp.png'],
  },
  alternates: {
    canonical: 'https://baddelha.com.sa/terms',
  },
};

export default function TermsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
