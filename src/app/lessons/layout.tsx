"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { modulesData, courseInfo, Lesson } from "@/data/courseData";

export default function LessonsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const params = useParams();
  const router = useRouter();
  const activeSlug = params.slug as string;

  // Sidebar mobile open state
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  // Lesson completion state (array of completed slugs)
  const [completedLessons, setCompletedLessons] = useState<string[]>([]);
  // Mounted status to prevent SSR mismatch for localStorage
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
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
  };

  const totalLessons = courseInfo.totalLessons;
  const completedCount = completedLessons.length;
  const progressPercent = Math.round((completedCount / totalLessons) * 100);

  // Close sidebar on navigate (for mobile drawer)
  useEffect(() => {
    setIsSidebarOpen(false);
  }, [activeSlug]);

  return (
    <div className="flex h-screen overflow-hidden bg-brand-bg-start">
      {/* Mobile Header Bar */}
      <div className="absolute top-0 left-0 right-0 h-16 flex items-center justify-between px-4 glass-panel border-b border-brand-border md:hidden z-30">
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-2 text-brand-text hover:text-white focus:outline-none"
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
        <Link href="/" className="font-display font-bold text-sm text-white">
          🐍 MCP Course Hub
        </Link>
        <div className="text-xs font-semibold text-blue-400">
          {progressPercent}% Complete
        </div>
      </div>

      {/* Sidebar Navigation */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-72 flex flex-col glass-panel border-r border-brand-border transform transition-transform duration-300 ease-in-out md:translate-x-0 md:static md:shrink-0 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Sidebar Header */}
        <div className="h-16 flex items-center justify-between px-6 border-b border-brand-border">
          <Link href="/" className="font-display font-extrabold text-lg text-white hover:text-blue-400 transition-colors">
            📚 MCP LMS
          </Link>
          <span className="text-xs font-medium text-brand-muted bg-white/5 px-2 py-1 rounded-md">
            Python
          </span>
        </div>

        {/* Progress Tracker Widget */}
        {mounted && (
          <div className="p-6 border-b border-brand-border bg-brand-card/30">
            <div className="flex justify-between text-xs font-semibold mb-2">
              <span className="text-brand-muted">Your Progression</span>
              <span className="text-blue-400">{completedCount}/{totalLessons} Completed</span>
            </div>
            <div className="w-full bg-white/10 rounded-full h-2">
              <div
                className="bg-blue-500 h-2 rounded-full transition-all duration-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        )}

        {/* Dynamic Modules & Lessons List */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-6">
          {modulesData.map((module) => (
            <div key={module.id} className="space-y-2">
              <h4 className="font-display text-xs font-extrabold tracking-wider text-brand-muted uppercase px-3">
                {module.title.split(":")[0]} {/* Render short Module label */}
              </h4>
              <ul className="space-y-1">
                {module.lessons.map((lesson) => {
                  const isActive = activeSlug === lesson.slug;
                  const isCompleted = completedLessons.includes(lesson.slug);

                  return (
                    <li key={lesson.id}>
                      <Link
                        href={`/lessons/${lesson.slug}`}
                        className={`group flex items-center justify-between px-3 py-2.5 rounded-xl transition-all ${
                          isActive
                            ? "bg-blue-600/20 text-white border-l-4 border-blue-500 font-semibold"
                            : "text-brand-muted hover:text-white hover:bg-white/5"
                        }`}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          {/* Completion Tick */}
                          {mounted ? (
                            <button
                              onClick={(e) => toggleComplete(lesson.slug, e)}
                              className={`flex h-5 w-5 shrink-0 items-center justify-center rounded border transition-colors ${
                                isCompleted
                                  ? "bg-blue-500 border-blue-500 text-white"
                                  : "border-white/20 hover:border-white/40"
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
                          ) : (
                            <div className="h-5 w-5 rounded border border-white/10" />
                          )}
                          <span className="text-xs truncate">{lesson.title}</span>
                        </div>
                        <span className="text-[10px] text-brand-muted group-hover:text-brand-text">
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
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 md:hidden"
        />
      )}

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col overflow-y-auto pt-16 md:pt-0">
        <div className="flex-1 flex flex-col relative">
          {children}
        </div>
      </main>
    </div>
  );
}
