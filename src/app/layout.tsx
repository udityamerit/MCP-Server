import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI Protocol Hub: The Complete MCP Guide - Interactive Course Platform",
  description: "Learn Model Context Protocol (MCP) in Python, from beginner foundations to production deployment with hands-on labs, interactive quizzes, and visual guides.",
  keywords: ["MCP", "Model Context Protocol", "Python", "AI Agents", "LLM Integration", "LMS", "Course", "AI Protocol Hub"],
  authors: [{ name: "Uditya Narayan Tiwari" }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col font-sans bg-white text-slate-dark">
        {children}
      </body>
    </html>
  );
}
