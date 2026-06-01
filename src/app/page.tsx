"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { modulesData, courseInfo } from "@/data/courseData";
import { usePreferences } from "./usePreferences";

const translations = {
  en: {
    navHome: "Home",
    navHomeSub: "Home Page",
    navPaths: "Learning Paths",
    navPathsSub: "Modules",
    navTutorials: "Tutorials",
    navTutorialsSub: "Lectures",
    navBookMe: "Book Me",
    navBookMeSub: "Schedule",
    searchPlaceholder: "Search... Ctrl K",
    heroBadge: "Python & AI Infrastructure",
    heroTitle: "Master Production-Ready AI & Machine Learning",
    heroSubtitle: "Learn the complete architecture, protocol, deployment, and real-world implementation of MCP (Model Context Protocol) using the Python SDK.",
    startBtn: "🚀 Start Course (Free)",
    exploreBtn: "Explore Syllabus",
    statLessons: "Lessons",
    statLessonsVal: "Chapters",
    statDuration: "Duration",
    statDifficulty: "Difficulty",
    statFormat: "Format",
    difficultyVal: "Beginner to Adv",
    formatVal: "Interactive LMS",
    pathwaysTitle: "Structured Learning Pathways",
    pathwaysSubtitle: "Master the Model Context Protocol step-by-step with structured modules and labs.",
    timelineBtn: "View Pathway Timeline →",
    subTitle: "Subscribe to Our Newsletter",
    subDesc: "Get the latest updates, tips, and tutorials about Model Context Protocol and AI integration delivered directly to your inbox.",
    emailPlaceholder: "Enter your email",
    subBtn: "Subscribe",
    subSuccess: "🎉 Thank you for subscribing!",
    copyright: "AI Protocol Hub: The Complete MCP Guide. Created by Uditya Narayan Tiwari.",
    rights: "All rights reserved.",
    foundationLabel: "FOUNDATION JOURNEY",
    roadmapLabel: "ROADMAP PATH",
    udemyCertified: "★ UDEMY CERTIFIED",
    m1Title: "Module 1: Protocol Foundations",
    m1Desc: "Understand the core concept, history, and architectural triad of Model Context Protocol.",
    m2Title: "Module 2: Server Development",
    m2Desc: "Learn the fundamentals of creating local MCP Servers to expose tools, resources, and prompts.",
    m3Title: "Module 3: Client Development & Orchestration",
    m3Desc: "Develop custom clients, integrate with LLM APIs, and manage multi-server setups.",
    m4Title: "Module 4: Advanced Systems & Production",
    m4Desc: "Package, deploy, and scale MCP servers for public access and real-world projects.",
  },
  hi: {
    navHome: "मुख्य पृष्ठ",
    navHomeSub: "होम",
    navPaths: "लर्निंग पाथ",
    navPathsSub: "मॉड्यूल",
    navTutorials: "ट्यूटोरियल",
    navTutorialsSub: "लेक्चर्स",
    navBookMe: "बुक करें",
    navBookMeSub: "शेड्यूल",
    searchPlaceholder: "खोजें... Ctrl K",
    heroBadge: "पायथन और एआई इन्फ्रास्ट्रक्चर",
    heroTitle: "प्रोडक्शन-रेडी एआई और मशीन लर्निंग",
    heroSubtitle: "पायथन एसडीके का उपयोग करके एमसीपी (मॉडल कॉन्टेक्स्ट प्रोटोकॉल) के संपूर्ण आर्किटेक्चर, प्रोटोकॉल, डिप्लॉयमेंट और वास्तविक दुनिया के कार्यान्वयन को सीखें।",
    startBtn: "🚀 कोर्स शुरू करें (मुफ़्त)",
    exploreBtn: "पाठ्यक्रम देखें",
    statLessons: "पाठ",
    statLessonsVal: "अध्याय",
    statDuration: "अवधि",
    statDifficulty: "कठिनाई",
    statFormat: "प्रारूप",
    difficultyVal: "शुरुआती से उन्नत",
    formatVal: "इंटरैक्टिव एलएमएस",
    pathwaysTitle: "संरचित शिक्षण मार्ग",
    pathwaysSubtitle: "संरचित मॉड्यूल और प्रयोगशालाओं के साथ मॉडल संदर्भ प्रोटोकॉल को कदम-दर-कदम सीखें।",
    timelineBtn: "पाथवे टाइमलाइन देखें →",
    subTitle: "हमारे न्यूज़लेटर की सदस्यता लें",
    subDesc: "मॉडल संदर्भ प्रोटोकॉल (MCP) और एआई एकीकरण के बारे में सीधे अपने इनबॉक्स में नवीनतम अपडेट, युक्तियां और ट्यूटोरियल प्राप्त करें।",
    emailPlaceholder: "अपना ईमेल दर्ज करें",
    subBtn: "सदस्यता लें",
    subSuccess: "🎉 सदस्यता लेने के लिए धन्यवाद!",
    copyright: "एआई प्रोटोकॉल हब: संपूर्ण एमसीपी गाइड। उदित नारायण तिवारी द्वारा निर्मित।",
    rights: "सर्वाधिकार सुरक्षित।",
    foundationLabel: "बुनियादी यात्रा",
    roadmapLabel: "रोडमैप मार्ग",
    udemyCertified: "★ उडेमी प्रमाणित",
    m1Title: "मॉड्यूल 1: प्रोटोकॉल फाउंडेशन",
    m1Desc: "मॉडल संदर्भ प्रोटोकॉल की मुख्य अवधारणा, इतिहास और वास्तुकला को समझें।",
    m2Title: "मॉड्यूल 2: सर्वर डेवलपमेंट",
    m2Desc: "टूल्स, संसाधनों और प्रॉम्प्ट्स को प्रदर्शित करने के लिए स्थानीय एमसीपी सर्वर बनाने के सिद्धांतों को सीखें।",
    m3Title: "मॉड्यूल 3: क्लाइंट डेवलपमेंट और ऑर्केस्ट्रेशन",
    m3Desc: "कस्टम क्लाइंट विकसित करें, एलएलएम एपीआई के साथ एकीकृत करें और मल्टी-सर्वर सेटिंग्स का प्रबंधन करें।",
    m4Title: "मॉड्यूल 4: उन्नत प्रणाली और उत्पादन",
    m4Desc: "सार्वजनिक पहुंच और वास्तविक दुनिया की परियोजनाओं के लिए एमसीपी सर्वरों को पैकेज, डिप्लॉय और स्केल करें।",
  }
};

export default function Home() {
  const { theme, setTheme, lang, setLang, mounted } = usePreferences();
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

  if (!mounted) {
    return <div className="min-h-screen bg-white dark:bg-slate-darkest" />;
  }

  const t = translations[lang];

  // Map module translations based on dynamic language
  const getModuleMetadata = (id: string) => {
    switch (id) {
      case "module-1":
        return { title: t.m1Title, desc: t.m1Desc };
      case "module-2":
        return { title: t.m2Title, desc: t.m2Desc };
      case "module-3":
        return { title: t.m3Title, desc: t.m3Desc };
      case "module-4":
        return { title: t.m4Title, desc: t.m4Desc };
      default:
        return { title: "", desc: "" };
    }
  };

  // Filter modules/lessons based on search query
  const filteredModules = modulesData.map((module) => {
    const meta = getModuleMetadata(module.id);
    const matchingLessons = module.lessons.filter(
      (lesson) =>
        lesson.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lesson.description.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const isModuleMatching =
      meta.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      meta.desc.toLowerCase().includes(searchQuery.toLowerCase());

    return {
      ...module,
      displayTitle: meta.title,
      displayDesc: meta.desc,
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
    <div className="min-h-screen flex flex-col justify-between bg-theme-bg text-theme-text antialiased">
      {/* 64px Main Navigation Bar */}
      <nav className="sticky top-0 z-50 bg-theme-card border-b border-theme-border h-16 flex items-center justify-between px-6 md:px-12 shadow-sm">
        <div className="flex items-center gap-3">
          <Link href="/" className="font-sans font-bold text-base sm:text-lg text-theme-text hover:text-blue-primary transition-colors flex items-center gap-2">
            <span>📚</span>
            <span className="hidden sm:inline">AI Protocol Hub</span>
            <span className="sm:hidden font-extrabold text-blue-primary">AI Hub</span>
          </Link>
        </div>

        {/* Navigation Items (Bilingual) */}
        <div className="hidden lg:flex items-center gap-8 h-full">
          <Link
            href="/"
            className="text-red-hot border-b-2 border-red-hot h-full flex items-center px-1 text-sm font-semibold transition-all"
          >
            <div className="flex flex-col items-center">
              <span className="leading-tight">{t.navHome}</span>
              <span className="text-[9px] text-theme-text-muted font-normal">{t.navHomeSub}</span>
            </div>
          </Link>
          <a
            href="#curriculum"
            className="text-theme-text hover:text-blue-primary hover:underline h-full flex items-center px-1 text-sm font-normal transition-all"
          >
            <div className="flex flex-col items-center">
              <span className="leading-tight">{t.navPaths}</span>
              <span className="text-[9px] text-theme-text-muted font-normal">{t.navPathsSub}</span>
            </div>
          </a>
          <a
            href="#newsletter"
            className="text-theme-text hover:text-blue-primary hover:underline h-full flex items-center px-1 text-sm font-normal transition-all"
          >
            <div className="flex flex-col items-center">
              <span className="leading-tight">{t.navTutorials}</span>
              <span className="text-[9px] text-theme-text-muted font-normal">{t.navTutorialsSub}</span>
            </div>
          </a>
          <a
            href="#newsletter"
            className="text-theme-text hover:text-blue-primary hover:underline h-full flex items-center px-1 text-sm font-normal transition-all"
          >
            <div className="flex flex-col items-center">
              <span className="leading-tight">{t.navBookMe}</span>
              <span className="text-[9px] text-theme-text-muted font-normal">{t.navBookMeSub}</span>
            </div>
          </a>
        </div>

        {/* Toggles & Search Bar Area */}
        <div className="flex items-center gap-3">
          {/* Language Selector Selector */}
          <div className="flex items-center border border-theme-border rounded-lg p-0.5 bg-theme-section">
            <button
              onClick={() => setLang("en")}
              className={`px-2 py-1 text-[10px] sm:text-xs font-bold rounded ${
                lang === "en" ? "bg-theme-card text-blue-primary shadow-sm" : "text-theme-text-muted hover:text-theme-text"
              }`}
            >
              EN
            </button>
            <button
              onClick={() => setLang("hi")}
              className={`px-2 py-1 text-[10px] sm:text-xs font-bold rounded ${
                lang === "hi" ? "bg-theme-card text-blue-primary shadow-sm" : "text-theme-text-muted hover:text-theme-text"
              }`}
            >
              हिन्दी
            </button>
          </div>

          {/* Theme Toggler Button */}
          <button
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
            className="btn-icon h-9 w-9 text-sm"
            aria-label="Toggle theme mode"
          >
            {theme === "light" ? "🌙" : "☀️"}
          </button>

          {/* Search Input field */}
          <div className="relative w-36 sm:w-48 hidden md:block">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-theme-text-muted">
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t.searchPlaceholder}
              className="w-full bg-theme-input text-theme-text text-xs pl-8 pr-2 py-1.5 border border-theme-border rounded-lg h-9 focus:outline-none focus:border-blue-primary focus:ring-3 focus:ring-blue-primary/10 transition-all search-input-field"
            />
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="relative bg-theme-card border-b border-theme-border py-16 sm:py-24 overflow-hidden">
        <div className="absolute inset-0 bg-radial-[circle_at_center] from-blue-primary/5 via-transparent to-transparent pointer-events-none" />
        
        <div className="mx-auto max-w-7xl px-6 lg:px-8 relative">
          <div className="mx-auto max-w-4xl text-center">
            <span className="inline-flex items-center rounded-full bg-blue-primary/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-blue-primary border border-blue-primary/20 mb-6">
              {t.heroBadge}
            </span>
            <h1 className="font-display font-role-display text-theme-text tracking-tight leading-none mb-6">
              {t.heroTitle}
            </h1>
            <p className="mt-8 font-role-body-large text-theme-text-muted max-w-3xl mx-auto">
              {t.heroSubtitle}
            </p>
            
            <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/lessons/01-introduction" className="btn-primary w-full sm:w-auto">
                {t.startBtn}
              </Link>
              <a href="#curriculum" className="btn-secondary w-full sm:w-auto">
                {t.exploreBtn}
              </a>
            </div>
          </div>

          {/* Stats Bar */}
          <div className="mx-auto mt-16 max-w-4xl">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
              {[
                { label: t.statLessons, value: `${courseInfo.totalLessons} ${t.statLessonsVal}` },
                { label: t.statDuration, value: courseInfo.totalDuration },
                { label: t.statDifficulty, value: t.difficultyVal },
                { label: t.statFormat, value: t.formatVal },
              ].map((stat, idx) => (
                <div
                  key={idx}
                  className="bg-theme-stats border border-theme-border p-5 rounded-lg text-center flex flex-col justify-center"
                >
                  <dt className="text-[10px] sm:text-xs font-semibold uppercase tracking-wide text-theme-text-muted mb-1">
                    {stat.label}
                  </dt>
                  <dd className="text-sm sm:text-base font-bold text-theme-text">
                    {stat.value}
                  </dd>
                </div>
              ))}
            </div>
          </div>
        </div>
      </header>

      {/* Main Syllabus / Curriculum Section */}
      <main id="curriculum" className="mx-auto max-w-7xl px-6 lg:px-8 py-16 flex-1 w-full bg-theme-section/30">
        <div className="mx-auto max-w-5xl">
          <div className="text-center md:text-left mb-12 border-b border-theme-border pb-6">
            <h2 className="font-display font-role-h1 text-theme-text">
              {t.pathwaysTitle}
            </h2>
            <p className="mt-3 text-theme-text-muted font-role-body-large">
              {t.pathwaysSubtitle}
            </p>
          </div>

          {/* Card Grid (Pathway Cards) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {filteredModules.map((module, idx) => {
              const isFoundation = idx < 2;
              const accentClass = isFoundation ? "border-t-4 border-t-blue-primary" : "border-t-4 border-t-red-hot";
              const accentLabel = isFoundation ? t.foundationLabel : t.roadmapLabel;
              const badgeBg = isFoundation ? "bg-blue-primary/10 text-blue-primary" : "bg-red-hot/10 text-red-hot";
              const iconEmoji = idx === 0 ? "🔌" : idx === 1 ? "⚙️" : idx === 2 ? "💻" : "🚀";
              const isUdemyCertified = idx === 1 || idx === 3;

              return (
                <div
                  key={module.id}
                  className={`pathway-card flex flex-col justify-between ${accentClass}`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-6 flex-wrap gap-2">
                      <span className={`inline-flex items-center rounded-md px-2.5 py-1 text-[10px] font-bold tracking-wider uppercase ${badgeBg}`}>
                        {accentLabel}
                      </span>
                      {isUdemyCertified && (
                        <span className="bg-[#fffbeb] dark:bg-[#ffd60a]/10 text-warning-yellow border border-warning-yellow/50 text-[10px] font-bold px-2.5 py-1 rounded">
                          {t.udemyCertified}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-4 mb-6">
                      <div className="h-16 w-16 shrink-0 flex items-center justify-center rounded-xl bg-theme-section text-2xl p-3 border border-theme-border text-theme-text">
                        {iconEmoji}
                      </div>
                      <div>
                        <h3 className="font-display font-role-h2 text-theme-text leading-tight">
                          {module.displayTitle}
                        </h3>
                        <p className="text-xs text-theme-text-muted mt-1">
                          {module.displayDesc}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-6 border-b border-dashed border-theme-border pb-6">
                      {["AI Agents", "LangChain", "LangGraph", "Python SDK", "JSON-RPC 2.0"].map((tag, tIdx) => (
                        <span
                          key={tIdx}
                          className="bg-theme-section text-theme-text-muted text-[11px] font-semibold px-2.5 py-1 rounded border border-theme-border/20"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    <div className="space-y-3 mb-6">
                      {module.lessons.map((lesson) => (
                        <Link
                          key={lesson.id}
                          href={`/lessons/${lesson.slug}`}
                          className="group flex items-center justify-between p-3 rounded-lg border border-theme-border bg-theme-card hover:bg-theme-section hover:border-theme-border transition-all"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded bg-blue-primary/10 text-[10px] font-bold text-blue-primary group-hover:bg-blue-primary group-hover:text-white transition-colors">
                              {lesson.id}
                            </span>
                            <span className="text-xs font-semibold text-theme-text truncate group-hover:text-blue-primary transition-colors">
                              {lesson.title}
                            </span>
                          </div>
                          <span className="text-[10px] text-theme-text-muted shrink-0">
                            ⏱️ {lesson.duration}
                          </span>
                        </Link>
                      ))}
                    </div>
                  </div>

                  <div className="pt-2">
                    <Link href={`/lessons/${module.lessons[0]?.slug || "#"}`} className="btn-ghost text-xs">
                      {t.timelineBtn}
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </main>

      {/* Subscription Section */}
      <section id="newsletter" className="bg-theme-card border-t border-theme-border py-16 px-6 md:px-12 text-center">
        <div className="max-w-2xl mx-auto">
          <span className="text-2xl">✉️</span>
          <h2 className="font-display font-role-h1 text-theme-text mt-4">
            {t.subTitle}
          </h2>
          <p className="text-sm text-theme-text-muted max-w-md mx-auto mt-3 mb-8">
            {t.subDesc}
          </p>

          <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-md mx-auto">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t.emailPlaceholder}
              className="w-full sm:flex-1 bg-theme-input text-theme-text text-sm px-4 py-2 border border-theme-border rounded h-[38px] focus:outline-none focus:border-blue-primary transition-all"
              required
            />
            <button type="submit" className="btn-primary w-full sm:w-auto h-[38px] text-xs">
              {t.subBtn}
            </button>
          </form>

          {isSubscribed && (
            <p className="text-success-green font-semibold text-xs sm:text-sm mt-4 animate-pulse">
              {t.subSuccess}
            </p>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-theme-border bg-theme-section/50 py-8 text-center text-xs text-theme-text-muted px-6">
        <p className="mb-2">
          &copy; {new Date().getFullYear()} {t.copyright}
        </p>
        <p className="text-[10px] text-theme-text-muted">
          {t.rights}
        </p>
      </footer>
    </div>
  );
}
