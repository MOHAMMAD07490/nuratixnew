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
  title: "Nuratix - Advanced AI Models & Multi-Agent Systems",
  description: "Nuratix is the parent company of NoxyAI, an advanced multi-agent AI platform combining chat, image generation, voice AI, real-time web search, coding, and an OpenAI-compatible API. Our mission is to build and scale advanced proprietary AI models.",
  keywords: ["Nuratix", "NoxyAI", "AI Platform", "AI Chat", "AI Image Generation", "Voice AI", "Real-time AI Search", "OpenAI API alternative", "Multi-Agent System", "Custom AI Avatars"],
  openGraph: {
    title: "Nuratix - Engineering the Future of AI",
    description: "Discover Nuratix, the parent company of NoxyAI. Experience a multi-agent system offering search, reasoning, and synthesis with access to world-class AI models.",
    url: "https://nuratix.com",
    siteName: "Nuratix",
    images: [
      {
        url: "/logo.png",
        width: 1200,
        height: 630,
      }
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Nuratix - Advanced AI Models & Multi-Agent Systems",
    description: "Nuratix is the parent company of NoxyAI, an advanced multi-agent AI platform combining chat, image generation, voice AI, real-time web search, coding, and an OpenAI-compatible API.",
    images: ["/logo.png"],
  },
  robots: {
    index: true,
    follow: true,
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
