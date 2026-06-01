"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { modulesData, courseInfo } from "@/data/courseData";
import { usePreferences } from "../usePreferences";

const translations = {
  en: {
    sidebarHeader: "AI Protocol Hub",
    progression: "Your Progression",
    completed: "Completed",
    m1Label: "M1: foundations",
    m2Label: "M2: server dev",
    m3Label: "M3: client dev",
    m4Label: "M4: systems",
  },
  hi: {
    sidebarHeader: "एआई प्रोटोकॉल हब",
    progression: "आपकी प्रगति",
    completed: "पूर्ण",
    m1Label: "मॉड्यूल 1: बुनियादी",
    m2Label: "मॉड्यूल 2: सर्वर देव",
    m3Label: "मॉड्यूल 3: क्लाइंट देव",
    m4Label: "मॉड्यूल 4: सिस्टम",
  }
};

export default function LessonsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const params = useParams();
  const router = useRouter();
  const activeSlug = params.slug as string;

  const { theme, setTheme, lang, setLang, mounted } = usePreferences();

  // Sidebar mobile open state
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  // Lesson completion state (array of completed slugs)
  const [completedLessons, setCompletedLessons] = useState<string[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem("mcp_completed_lessons");
    if (saved) {
      try {
        setCompletedLessons(JSON.parse(saved));
      } catch (e) {
        console.error("Failed parsing completed lessons", e);
      }
    }
  }, []);

  const toggleComplete = (slug: string, event: React.MouseEvent) => {
    event.stopPropagation(); // Prevent navigating when checking box
    const updated = completedLessons.includes(slug)
      ? completedLessons.filter((s) => s !== slug)
      : [...completedLessons, slug];

    setCompletedLessons(updated);
    localStorage.setItem("mcp_completed_lessons", JSON.stringify(updated));
    // Trigger global storage update event to sync slug page
    window.dispatchEvent(new Event("storage"));
  };

  const totalLessons = courseInfo.totalLessons;
  const completedCount = completedLessons.length;
  const progressPercent = Math.round((completedCount / totalLessons) * 100);

  // Close sidebar on navigate (for mobile drawer)
  useEffect(() => {
    setIsSidebarOpen(false);
  }, [activeSlug]);

  if (!mounted) {
    return <div className="flex h-screen bg-white dark:bg-slate-darkest" />;
  }

  const t = translations[lang];

  const getShortModuleLabel = (id: string) => {
    switch (id) {
      case "module-1":
        return t.m1Label;
      case "module-2":
        return t.m2Label;
      case "module-3":
        return t.m3Label;
      case "module-4":
        return t.m4Label;
      default:
        return "";
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-theme-bg text-theme-text antialiased">
      {/* Mobile Header Bar - Light Spec */}
      <div className="absolute top-0 left-0 right-0 h-16 flex items-center justify-between px-4 bg-theme-card border-b border-theme-border md:hidden z-30 shadow-sm">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 text-theme-text-muted hover:text-theme-text focus:outline-none"
            aria-label="Toggle navigation menu"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {isSidebarOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
          <Link href="/" className="font-sans font-bold text-sm text-theme-text hover:text-blue-primary">
            🐍 {t.sidebarHeader}
          </Link>
        </div>

        {/* Mobile Header Toggles */}
        <div className="flex items-center gap-2">
          {/* Language Toggle */}
          <button
            onClick={() => setLang(lang === "en" ? "hi" : "en")}
            className="px-2 py-1 text-[10px] font-bold border border-theme-border rounded bg-theme-section hover:bg-theme-border text-blue-primary"
          >
            {lang === "en" ? "HI" : "EN"}
          </button>
          {/* Theme Toggle */}
          <button
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
            className="p-1.5 text-xs border border-theme-border rounded bg-theme-section hover:bg-theme-border text-theme-text"
          >
            {theme === "light" ? "🌙" : "☀️"}
          </button>
          <div className="text-[10px] font-semibold text-blue-primary shrink-0 ml-1">
            {progressPercent}%
          </div>
        </div>
      </div>

      {/* Sidebar Navigation */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-72 flex flex-col bg-theme-sidebar border-r border-theme-border transform transition-transform duration-300 ease-in-out md:translate-x-0 md:static md:shrink-0 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Sidebar Header */}
        <div className="h-16 flex items-center justify-between px-6 border-b border-theme-border">
          <Link href="/" className="font-sans font-extrabold text-base text-theme-text hover:text-blue-primary transition-colors flex items-center gap-2">
            <span>📚</span>
            <span>{t.sidebarHeader}</span>
          </Link>
          <span className="text-[10px] font-bold text-theme-text-muted bg-theme-section border border-theme-border px-2 py-0.5 rounded">
            Python
          </span>
        </div>

        {/* Desktop Preferences Toggle Widget */}
        <div className="px-6 py-3 border-b border-theme-border bg-theme-section/20 flex items-center justify-between">
          <div className="flex items-center border border-theme-border rounded bg-theme-section p-0.5">
            <button
              onClick={() => setLang("en")}
              className={`px-1.5 py-0.5 text-[10px] font-bold rounded ${
                lang === "en" ? "bg-theme-card text-blue-primary shadow-sm" : "text-theme-text-muted"
              }`}
            >
              EN
            </button>
            <button
              onClick={() => setLang("hi")}
              className={`px-1.5 py-0.5 text-[10px] font-bold rounded ${
                lang === "hi" ? "bg-theme-card text-blue-primary shadow-sm" : "text-theme-text-muted"
              }`}
            >
              हि
            </button>
          </div>
          
          <button
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
            className="p-1 border border-theme-border rounded bg-theme-section hover:bg-theme-border text-xs text-theme-text h-7 w-7 flex items-center justify-center shadow-sm"
          >
            {theme === "light" ? "🌙" : "☀️"}
          </button>
        </div>

        {/* Progress Tracker Widget */}
        <div className="p-6 border-b border-theme-border bg-theme-section/40">
          <div className="flex justify-between text-xs font-semibold mb-2">
            <span className="text-theme-text-muted">{t.progression}</span>
            <span className="text-blue-primary">{completedCount}/{totalLessons} {t.completed}</span>
          </div>
          <div className="w-full bg-theme-border rounded-full h-2">
            <div
              className="bg-blue-primary h-2 rounded-full transition-all duration-500 shadow-[0_0_6px_rgba(37,99,235,0.3)]"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Dynamic Modules & Lessons List */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-6">
          {modulesData.map((module) => (
            <div key={module.id} className="space-y-2">
              <h4 className="font-sans text-[10px] font-extrabold tracking-wider text-theme-text-muted uppercase px-3">
                {getShortModuleLabel(module.id)}
              </h4>
              <ul className="space-y-1">
                {module.lessons.map((lesson) => {
                  const isActive = activeSlug === lesson.slug;
                  const isCompleted = completedLessons.includes(lesson.slug);

                  return (
                    <li key={lesson.id}>
                      <Link
                        href={`/lessons/${lesson.slug}`}
                        className={`group flex items-center justify-between px-3 py-2.5 rounded-lg border-l-4 transition-all ${
                          isActive
                            ? "bg-blue-primary/10 border-l-blue-primary text-blue-primary font-semibold"
                            : "border-l-transparent text-theme-text-muted hover:text-theme-text hover:bg-theme-section"
                        }`}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          {/* Completion Tick */}
                          <button
                            onClick={(e) => toggleComplete(lesson.slug, e)}
                            className={`flex h-5 w-5 shrink-0 items-center justify-center rounded border transition-colors ${
                              isCompleted
                                ? "bg-blue-primary border-blue-primary text-white"
                                : "border-theme-border bg-theme-card hover:border-theme-text-muted"
                            }`}
                            aria-label={isCompleted ? "Mark lesson incomplete" : "Mark lesson complete"}
                          >
                            {isCompleted && (
                              <svg
                                className="h-3.5 w-3.5"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth={3}
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M5 13l4 4L19 7"
                                />
                              </svg>
                            )}
                          </button>
                          <span className="text-xs truncate">{lesson.title}</span>
                        </div>
                        <span className="text-[10px] text-theme-text-muted group-hover:text-theme-text">
                          {lesson.duration}
                        </span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>
      </aside>

      {/* Backdrop overlay for mobile drawer */}
      {isSidebarOpen && (
        <div
          onClick={() => setIsSidebarOpen(false)}
          className="fixed inset-0 bg-slate-darkest/60 backdrop-blur-sm z-30 md:hidden"
        />
      )}

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col overflow-y-auto pt-16 md:pt-0 bg-theme-section/25">
        <div className="flex-1 flex flex-col relative">
          {children}
        </div>
      </main>
    </div>
  );
}
