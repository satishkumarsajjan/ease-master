import { ThemeProvider } from '@/components/theme-provider';
import type { Metadata, Viewport } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { Analytics } from '@vercel/analytics/next';

import { GoogleAnalytics } from '@next/third-parties/google';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

const SITE_URL =
  process.env.NEXT_PUBLIC_APP_URL || 'https://easemaster.satisui.xyz';

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: 'white' },
    { media: '(prefers-color-scheme: dark)', color: '#0a0a0a' },
  ],
  width: 'device-width',
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'EaseMaster | CSS & Spring Easing Generator',
    template: '%s | EaseMaster',
  },
  description:
    'Design motion that feels real. The ultimate easing visualization tool for generating Cubic Bezier curves and Spring physics for CSS, Tailwind, Framer Motion, and GSAP.',
  keywords: [
    'css cubic-bezier generator',
    'spring physics visualizer',
    'framer motion easing',
    'tailwind transition generator',
    'gsap custom ease',
    'web animation tool',
    'frontend development',
    'ui motion design',
  ],
  authors: [
    { name: 'Satish Kumar', url: 'https://github.com/satishkumarsajjan' },
  ],
  creator: 'Satish Kumar',
  publisher: 'EaseMaster',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: SITE_URL,
    title: 'EaseMaster | Design Motion That Feels Real',
    description:
      'Generate production-ready code for CSS, Tailwind, Framer Motion, and GSAP. Visualize Bezier curves and Spring physics side-by-side.',
    siteName: 'EaseMaster',
    images: [
      {
        url: '/og-image.png', // Ensure you add this image to your public folder
        width: 1200,
        height: 630,
        alt: 'EaseMaster Dashboard Preview',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'EaseMaster | CSS & Spring Easing Generator',
    description:
      'Visualize and generate standard CSS curves and complex Spring physics for modern web animation.',
    images: ['/og-image.png'],
    creator: '@iamsatish4564',
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/site.webmanifest',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en' suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        <ThemeProvider
          attribute='class'
          defaultTheme='dark'
          enableSystem
          disableTransitionOnChange
        >
          <Analytics />

          <GoogleAnalytics gaId='G-67PPL66ZKC' />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
