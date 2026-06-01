"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { modulesData, courseInfo } from "@/data/courseData";

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Keyboard shortcut Ctrl+K to focus search input
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Filter modules/lessons based on search query
  const filteredModules = modulesData.map((module) => {
    const matchingLessons = module.lessons.filter(
      (lesson) =>
        lesson.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lesson.description.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const isModuleMatching =
      module.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      module.description.toLowerCase().includes(searchQuery.toLowerCase());

    return {
      ...module,
      lessons: isModuleMatching ? module.lessons : matchingLessons,
      hasMatch: isModuleMatching || matchingLessons.length > 0,
    };
  }).filter((module) => module.hasMatch);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setIsSubscribed(true);
      setEmail("");
      setTimeout(() => setIsSubscribed(false), 5000);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-white text-slate-dark antialiased">
      {/* 64px Main Navigation Bar */}
      <nav className="sticky top-0 z-50 bg-white border-b border-slate-light h-16 flex items-center justify-between px-6 md:px-12">
        <div className="flex items-center gap-3">
          <Link href="/" className="font-sans font-bold text-lg text-slate-dark hover:text-blue-primary transition-colors flex items-center gap-2">
            <span>📚</span>
            <span className="hidden sm:inline">AI Protocol Hub: The Complete MCP Guide</span>
            <span className="sm:hidden font-extrabold text-blue-primary">AI Protocol Hub</span>
          </Link>
        </div>

        {/* Navigation Items (Bilingual) */}
        <div className="hidden md:flex items-center gap-8 h-full">
          <Link
            href="/"
            className="text-red-hot border-b-2 border-red-hot h-full flex items-center px-1 text-sm font-semibold transition-all"
          >
            <div className="flex flex-col items-center">
              <span className="leading-tight">Home</span>
              <span className="text-[10px] text-slate-medium font-normal">मुख्य पृष्ठ</span>
            </div>
          </Link>
          <a
            href="#curriculum"
            className="text-slate-dark hover:text-blue-primary hover:underline h-full flex items-center px-1 text-sm font-normal transition-all"
          >
            <div className="flex flex-col items-center">
              <span className="leading-tight">Learning Paths</span>
              <span className="text-[10px] text-slate-medium font-normal">सीखने के मार्ग</span>
            </div>
          </a>
          <a
            href="#newsletter"
            className="text-slate-dark hover:text-blue-primary hover:underline h-full flex items-center px-1 text-sm font-normal transition-all"
          >
            <div className="flex flex-col items-center">
              <span className="leading-tight">Tutorials</span>
              <span className="text-[10px] text-slate-medium font-normal">ट्यूटोरियल</span>
            </div>
          </a>
          <a
            href="#newsletter"
            className="text-slate-dark hover:text-blue-primary hover:underline h-full flex items-center px-1 text-sm font-normal transition-all"
          >
            <div className="flex flex-col items-center">
              <span className="leading-tight">Book Me</span>
              <span className="text-[10px] text-slate-medium font-normal">मुझे बुक करें</span>
            </div>
          </a>
        </div>

        {/* Search Bar - Header Spec */}
        <div className="relative w-48 sm:w-64">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-medium">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            ref={searchInputRef}
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search... Ctrl K"
            className="w-full bg-white text-slate-dark text-xs sm:text-sm pl-9 pr-3 py-2 border border-slate-light rounded-lg h-[38px] sm:h-[42px] focus:outline-none focus:border-blue-primary focus:ring-3 focus:ring-blue-primary/10 transition-all search-input-field"
          />
        </div>
      </nav>

      {/* Hero Section */}
      <header className="relative bg-white border-b border-slate-light py-20 sm:py-28 overflow-hidden">
        <div className="absolute inset-0 bg-radial-[circle_at_center] from-blue-primary/5 via-transparent to-transparent pointer-events-none" />
        
        <div className="mx-auto max-w-7xl px-6 lg:px-8 relative">
          <div className="mx-auto max-w-4xl text-center">
            <span className="inline-flex items-center rounded-full bg-blue-primary/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-blue-primary border border-blue-primary/20 mb-6">
              Python & AI Infrastructure / पायथन और एआई इन्फ्रास्ट्रक्चर
            </span>
            <h1 className="font-display font-role-display text-slate-dark tracking-tight leading-none mb-6">
              Master Production-Ready AI & Machine Learning
              <span className="block text-2xl sm:text-3xl font-normal text-slate-medium mt-4">
                प्रोडक्शन-रेडी एआई और मशीन लर्निंग में महारत हासिल करें
              </span>
            </h1>
            <p className="mt-8 font-role-body-large text-slate-medium max-w-3xl mx-auto">
              {courseInfo.description}
              <span className="block text-sm font-normal text-slate-medium mt-3 border-t border-dashed border-slate-light pt-3 italic">
                पायथन एसडीके का उपयोग करके एमसीपी (मॉडल कॉन्टेक्स्ट प्रोटोकॉल) के संपूर्ण आर्किटेक्चर, प्रोटोकॉल, डिप्लॉयमेंट और वास्तविक दुनिया के कार्यान्वयन को सीखें।
              </span>
            </p>
            
            <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/lessons/01-introduction" className="btn-primary w-full sm:w-auto">
                🚀 Start Course / कोर्स शुरू करें
              </Link>
              <a href="#curriculum" className="btn-secondary w-full sm:w-auto">
                Explore Learning Paths / मार्ग खोजें
              </a>
            </div>
          </div>

          {/* Stats Bar */}
          <div className="mx-auto mt-16 max-w-4xl">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
              {[
                { label: "Lessons / अध्याय", value: `${courseInfo.totalLessons} Chapters` },
                { label: "Duration / अवधि", value: courseInfo.totalDuration },
                { label: "Difficulty / कठिनाई", value: courseInfo.difficulty },
                { label: "Format / प्रारूप", value: "Interactive LMS" },
              ].map((stat, idx) => (
                <div
                  key={idx}
                  className="bg-gray-light border border-slate-light p-5 rounded-lg text-center flex flex-col justify-center"
                >
                  <dt className="text-[10px] sm:text-xs font-semibold uppercase tracking-wide text-slate-medium mb-1">
                    {stat.label}
                  </dt>
                  <dd className="text-sm sm:text-base font-bold text-slate-dark">
                    {stat.value}
                  </dd>
                </div>
              ))}
            </div>
          </div>
        </div>
      </header>

      {/* Main Syllabus / Curriculum Section */}
      <main id="curriculum" className="mx-auto max-w-7xl px-6 lg:px-8 py-20 flex-1 w-full bg-gray-light/35">
        <div className="mx-auto max-w-5xl">
          <div className="text-center md:text-left mb-16 border-b border-slate-light pb-8">
            <h2 className="font-display font-role-h1 text-slate-dark">
              Structured Learning Pathways / संरचित शिक्षण मार्ग
            </h2>
            <p className="mt-3 text-slate-medium font-role-body-large">
              Master the Model Context Protocol step-by-step with structured modules and labs.
            </p>
          </div>

          {/* Card Grid (Pathway Cards) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {filteredModules.map((module, idx) => {
              // Accent Border Rules
              // Module 1 & 2 -> Foundation (Blue Accent)
              // Module 3 & 4 -> Roadmap (Red Accent)
              const isFoundation = idx < 2;
              const accentClass = isFoundation ? "border-t-4 border-t-blue-primary" : "border-t-4 border-t-red-hot";
              const accentLabel = isFoundation ? "FOUNDATION JOURNEY" : "ROADMAP PATH";
              const accentLabelHindi = isFoundation ? "बुनियादी यात्रा" : "रोडमैप मार्ग";
              const badgeBg = isFoundation ? "bg-blue-primary/10 text-blue-primary" : "bg-red-hot/10 text-red-hot";
              
              // Icon Selection
              const iconEmoji = idx === 0 ? "🔌" : idx === 1 ? "⚙️" : idx === 2 ? "💻" : "🚀";
              
              // Udemy Badge Condition (Modules 2 and 4 are certified)
              const isUdemyCertified = idx === 1 || idx === 3;

              return (
                <div
                  key={module.id}
                  className={`pathway-card flex flex-col justify-between ${accentClass}`}
                >
                  <div>
                    {/* Header line with Pathway Accent Tag & UDEMY Certificate */}
                    <div className="flex items-center justify-between mb-6 flex-wrap gap-2">
                      <span className={`inline-flex items-center rounded-md px-2.5 py-1 text-[10px] font-bold tracking-wider uppercase ${badgeBg}`}>
                        {accentLabel} / {accentLabelHindi}
                      </span>
                      {isUdemyCertified && (
                        <span className="bg-[#fffbeb] text-warning-yellow border border-warning-yellow text-[10px] font-bold px-2.5 py-1 rounded">
                          ★ UDEMY CERTIFIED
                        </span>
                      )}
                    </div>

                    {/* Category Icon Badge & Title */}
                    <div className="flex items-center gap-4 mb-6">
                      <div className="h-16 w-16 shrink-0 flex items-center justify-center rounded-xl bg-gray-light text-2xl p-3 border border-slate-light">
                        {iconEmoji}
                      </div>
                      <div>
                        <h3 className="font-display font-role-h2 text-slate-dark leading-tight">
                          {module.title}
                        </h3>
                        <p className="text-xs text-slate-medium mt-1">
                          {module.description}
                        </p>
                      </div>
                    </div>

                    {/* Topic Tags */}
                    <div className="flex flex-wrap gap-2 mb-6 border-b border-dashed border-slate-light pb-6">
                      {["AI Agents", "LangChain", "LangGraph", "Python SDK", "JSON-RPC 2.0"].map((tag, tIdx) => (
                        <span
                          key={tIdx}
                          className="bg-gray-light text-slate-medium text-[11px] font-semibold px-2.5 py-1 rounded"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    {/* Lesson Links List */}
                    <div className="space-y-3 mb-6">
                      {module.lessons.map((lesson) => (
                        <Link
                          key={lesson.id}
                          href={`/lessons/${lesson.slug}`}
                          className="group flex items-center justify-between p-3 rounded-lg border border-slate-light bg-white hover:bg-gray-light hover:border-slate-pale transition-all"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded bg-blue-primary/10 text-[10px] font-bold text-blue-primary group-hover:bg-blue-primary group-hover:text-white transition-colors">
                              {lesson.id}
                            </span>
                            <span className="text-xs font-semibold text-slate-dark truncate group-hover:text-blue-primary transition-colors">
                              {lesson.title}
                            </span>
                          </div>
                          <span className="text-[10px] text-slate-medium shrink-0">
                            ⏱️ {lesson.duration}
                          </span>
                        </Link>
                      ))}
                    </div>
                  </div>

                  {/* Ghost Action Button at Bottom */}
                  <div className="pt-2">
                    <Link href={`/lessons/${module.lessons[0]?.slug || "#"}`} className="btn-ghost text-xs">
                      View Pathway Timeline / पाथवे टाइमलाइन देखें &rarr;
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </main>

      {/* Subscription Section (Bilingual Form) */}
      <section id="newsletter" className="bg-white border-t border-slate-light py-16 px-6 md:px-12 text-center">
        <div className="max-w-2xl mx-auto">
          <span className="text-2xl">✉️</span>
          <h2 className="font-display font-role-h1 text-slate-dark mt-4">
            Subscribe to Our Newsletter
          </h2>
          <h3 className="text-base text-slate-medium font-normal mt-1 mb-8">
            हमारे न्यूज़लेटर की सदस्यता लें
          </h3>
          <p className="text-sm text-slate-medium max-w-md mx-auto mb-8">
            Get the latest updates, tips, and tutorials about Model Context Protocol and AI integration delivered directly to your inbox.
          </p>

          <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-md mx-auto">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email / अपना ईमेल डालें"
              className="w-full sm:flex-1 bg-white text-slate-dark text-sm px-4 py-2 border border-slate-pale rounded h-[38px] focus:outline-none focus:border-blue-primary transition-all"
              required
            />
            <button type="submit" className="btn-primary w-full sm:w-auto h-[38px] text-xs">
              Subscribe / सदस्यता लें
            </button>
          </form>

          {isSubscribed && (
            <p className="text-success-green font-semibold text-xs sm:text-sm mt-4 animate-pulse">
              🎉 Thank you for subscribing! / सदस्यता लेने के लिए धन्यवाद!
            </p>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-light bg-gray-light py-8 text-center text-xs text-slate-medium px-6">
        <p className="mb-2">
          &copy; {new Date().getFullYear()} AI Protocol Hub: The Complete MCP Guide. Created by Uditya Narayan Tiwari.
        </p>
        <p className="text-[10px] text-slate-medium">
          सभी अधिकार सुरक्षित हैं। All rights reserved.
        </p>
      </footer>
    </div>
  );
}
