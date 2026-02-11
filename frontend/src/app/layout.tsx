import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { GameLayout, TopBar } from "@/components/GameLayout";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "The Cheater's Dilemma",
  description: "Multi-agent game-theoretic simulation with mutable governance",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#0a0e27] min-h-screen`}
      >
        <GameLayout
          topBar={<TopBar />}
          centerContent={children}
        />
      </body>
    </html>
  );
}
