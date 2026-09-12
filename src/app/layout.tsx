import type { Metadata } from "next";
import { Geist, Geist_Mono, Newsreader } from "next/font/google";
import '../globals.css'
import Providers from "@/components/shared/providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const newsreader = Newsreader({
  variable: "--font-newsreader",
  style: "italic",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Executive Mono | Professional Identity",
  description: "Precision-tuned resume architecture for the executive professional",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className={`${geistSans.variable} ${geistMono.variable} ${newsreader.variable} font-sans min-h-full flex flex-col`}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
