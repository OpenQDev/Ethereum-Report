import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
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
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <div className="px-4 md:px-6 lg:px-8 flex flex-col gap-4 md:gap-6 lg:gap-8 py-4 md:py-6 lg:py-8 min-h-screen">
          <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 sm:truncate sm:tracking-tight">
            Ethereum Ecosystem
          </h1>
          {children}
        </div>
      </body>
    </html>
  );
}
