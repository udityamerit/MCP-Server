import Link from "next/link";
import { modulesData, courseInfo } from "@/data/courseData";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col justify-between">
      {/* Hero Section */}
      <header className="relative overflow-hidden py-24 sm:py-32">
        <div className="absolute inset-0 bg-radial-[circle_at_center] from-blue-900/20 via-transparent to-transparent pointer-events-none" />
        
        <div className="mx-auto max-w-7xl px-6 lg:px-8 relative">
          <div className="mx-auto max-w-3xl text-center">
            <span className="inline-flex items-center rounded-full bg-blue-500/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-blue-400 border border-blue-500/20 mb-6">
              Python & AI Infrastructure
            </span>
            <h1 className="font-display text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-tight">
              {courseInfo.title}
            </h1>
            <p className="mt-6 text-lg sm:text-xl leading-8 text-brand-muted max-w-2xl mx-auto">
              {courseInfo.description}
            </p>
            
            <div className="mt-10 flex flex-wrap items-center justify-center gap-6">
              <Link
                href="/lessons/01-introduction"
                className="rounded-xl bg-blue-600 px-6 py-3.5 text-sm font-bold text-white shadow-lg hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all transform hover:-translate-y-0.5"
              >
                🚀 Start Course (Free)
              </Link>
              <a
                href="#curriculum"
                className="rounded-xl glass-panel px-6 py-3.5 text-sm font-semibold text-white hover:bg-white/5 transition-all"
              >
                Explore Syllabus
              </a>
            </div>
          </div>

          {/* Stats Bar */}
          <div className="mx-auto mt-16 max-w-4xl sm:mt-20">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
              {[
                { label: "Lessons", value: `${courseInfo.totalLessons} Chapters` },
                { label: "Duration", value: courseInfo.totalDuration },
                { label: "Difficulty", value: "Beginner to Adv" },
                { label: "Format", value: "Interactive LMS" },
              ].map((stat, idx) => (
                <div
                  key={idx}
                  className="glass-panel p-5 rounded-2xl text-center flex flex-col justify-center"
                >
                  <dt className="text-xs font-semibold uppercase tracking-wide text-brand-muted">
                    {stat.label}
                  </dt>
                  <dd className="mt-1 text-base sm:text-lg font-bold text-white">
                    {stat.value}
                  </dd>
                </div>
              ))}
            </div>
          </div>
        </div>
      </header>

      {/* Main Syllabus / Curriculum Section */}
      <main id="curriculum" className="mx-auto max-w-7xl px-6 lg:px-8 py-12 flex-1 w-full">
        <div className="mx-auto max-w-4xl">
          <div className="text-center md:text-left mb-12 border-b border-brand-border pb-6">
            <h2 className="font-display text-3xl font-bold tracking-tight text-white">
              Course Syllabus
            </h2>
            <p className="mt-2 text-brand-muted">
              Master the Model Context Protocol step-by-step with structured modules and labs.
            </p>
          </div>

          <div className="space-y-12">
            {modulesData.map((module, mIdx) => (
              <div key={module.id} className="relative">
                <div className="mb-6">
                  <h3 className="font-display text-xl font-bold text-blue-400">
                    {module.title}
                  </h3>
                  <p className="mt-1 text-sm text-brand-muted">
                    {module.description}
                  </p>
                </div>

                <div className="space-y-4">
                  {module.lessons.map((lesson, lIdx) => (
                    <Link
                      key={lesson.id}
                      href={`/lessons/${lesson.slug}`}
                      className="group block glass-panel glass-panel-hover p-6 rounded-2xl transition-all"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div className="flex items-start gap-4">
                          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-500/10 text-xs font-bold text-blue-400 border border-blue-500/20 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                            {lesson.id}
                          </span>
                          <div>
                            <h4 className="font-display text-base sm:text-lg font-semibold text-white group-hover:text-blue-400 transition-colors">
                              {lesson.title}
                            </h4>
                            <p className="mt-1 text-sm text-brand-muted line-clamp-2">
                              {lesson.description}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 self-end sm:self-center">
                          <span className="inline-flex items-center rounded-md bg-white/5 px-2.5 py-1 text-xs font-medium text-brand-muted ring-1 ring-inset ring-white/10">
                            ⏱️ {lesson.duration}
                          </span>
                          <span className="text-blue-400 text-sm group-hover:translate-x-1 transition-transform">
                            →
                          </span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-brand-border py-8 text-center text-xs text-brand-muted mt-20">
        <p>&copy; {new Date().getFullYear()} Complete Guide to MCP in Python. Created by Uditya Narayan Tiwari.</p>
      </footer>
    </div>
  );
}
