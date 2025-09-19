import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Image from "next/image";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Opensauced - Ethereum ecosystem developer metrics",
  description:
    "Comprehensive dashboard showing Ethereum ecosystem statistics and insights",
  keywords: [
    "Ethereum",
    "developer metrics",
    "blockchain",
    "ecosystem",
    "statistics",
    "dashboard",
    "opensauced",
    "cryptocurrency",
    "web3",
    "development analytics"
  ],
  authors: [{ name: "Opensauced" }],
  creator: "Opensauced",
  publisher: "Opensauced",
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
  icons: {
    icon: [
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon.png', sizes: '48x48', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://ethereum-metrics.opensauced.pizza',
    title: 'Opensauced - Ethereum ecosystem developer metrics',
    description: 'Comprehensive dashboard showing Ethereum ecosystem statistics and insights',
    siteName: 'Opensauced Ethereum Metrics',
    images: [
      {
        url: '/social_thumbnail.png',
        width: 1200,
        height: 630,
        alt: 'Opensauced Ethereum ecosystem developer metrics dashboard',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Opensauced - Ethereum ecosystem developer metrics',
    description: 'Comprehensive dashboard showing Ethereum ecosystem statistics and insights',
    site: '@opensauced',
    creator: '@opensauced',
    images: ['/social_thumbnail.png'],
  },
  alternates: {
    canonical: 'https://ethereum-metrics.opensauced.pizza',
  },
  category: 'technology',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <div className="px-4 md:px-6 lg:px-8 flex flex-col gap-4 md:gap-6 lg:gap-8 py-4 md:py-6 lg:py-8 min-h-screen">
          <div className="flex items-start gap-3">
            <Image
              src="/opensauced-logo.png"
              alt="Opensauced Logo"
              width={55}
              height={55}
              className="h-14 w-14 object-contain"
            />
            <div className="flex flex-col">
              <span className={`text-2xl font-semibold -ml-5 ${geistSans.className}`}>
                Opensauced
              </span>
              <span className={`text-sm text-gray-400 -ml-5 ${geistSans.className}`}>
                Ethereum ecosystem developer metrics
              </span>
            </div>
          </div>
          {children}
        </div>
      </body>
    </html>
  );
}
