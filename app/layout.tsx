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
  title: "Ethereum Ecosystem Dashboard",
  description:
    "Comprehensive dashboard showing Ethereum ecosystem statistics and insights",
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
