import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Complete Guide to MCP in Python - Interactive Course Platform",
  description: "Learn Model Context Protocol (MCP) in Python, from beginner foundations to production deployment with hands-on labs, interactive quizzes, and visual guides.",
  keywords: ["MCP", "Model Context Protocol", "Python", "AI Agents", "LLM Integration", "LMS", "Course"],
  authors: [{ name: "Uditya Narayan Tiwari" }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${outfit.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans bg-brand-bg-start text-brand-text">
        {children}
      </body>
    </html>
  );
}
