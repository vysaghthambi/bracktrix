import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import Header from "@/components/Header/Header";
import { getServerAuthSession } from "@/lib/auth";
import AuthProvider from "@/providers/AuthProvider";
import LocalizationProvider from "@/providers/LocalizationProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Bracktrix",
  description: "Make your tournaments easier",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerAuthSession();

  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <AuthProvider session={session}>
          <LocalizationProvider>
            <Header />
            {children}
          </LocalizationProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
