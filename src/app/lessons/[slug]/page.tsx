"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { modulesData, Lesson } from "@/data/courseData";
import { quizzesData, Question } from "@/data/quizData";

export default function LessonPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;

  // Find active lesson and surrounding lessons
  const allLessons = modulesData.flatMap((m) => m.lessons);
  const activeIndex = allLessons.findIndex((l) => l.slug === slug);
  
  const activeLesson = allLessons[activeIndex];
  const prevLesson = activeIndex > 0 ? allLessons[activeIndex - 1] : null;
  const nextLesson = activeIndex < allLessons.length - 1 ? allLessons[activeIndex + 1] : null;

  // React state for Lightbox modal
  const [lightboxImage, setLightboxImage] = useState<{ src: string; caption: string } | null>(null);

  // React state for Quiz responses
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizCorrectCount, setQuizCorrectCount] = useState(0);

  // Sync completion checklist state
  const [completedLessons, setCompletedLessons] = useState<string[]>([]);
  useEffect(() => {
    const saved = localStorage.getItem("mcp_completed_lessons");
    if (saved) {
      try {
        setCompletedLessons(JSON.parse(saved));
      } catch (e) {}
    }
    
    // Reset quiz state when switching lessons
    setSelectedAnswers({});
    setQuizSubmitted(false);
    setQuizCorrectCount(0);
  }, [slug]);

  if (!activeLesson) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-12 text-center">
        <h2 className="text-2xl font-bold text-white mb-2">Lesson Not Found</h2>
        <p className="text-brand-muted mb-6">The requested curriculum chapter does not exist.</p>
        <Link href="/" className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg text-white font-semibold">
          Return to Course Dashboard
        </Link>
      </div>
    );
  }

  const isCompleted = completedLessons.includes(slug);
  const toggleCompleted = () => {
    const updated = isCompleted
      ? completedLessons.filter((s) => s !== slug)
      : [...completedLessons, slug];
    setCompletedLessons(updated);
    localStorage.setItem("mcp_completed_lessons", JSON.stringify(updated));
    // Trigger global storage update event to sync sidebar
    window.dispatchEvent(new Event("storage"));
  };

  // Handle quiz submissions
  const activeQuiz = quizzesData[slug] || [];
  const handleSelectOption = (questionId: string, optionIdx: number) => {
    if (quizSubmitted) return; // Locked after submit
    setSelectedAnswers((prev) => ({ ...prev, [questionId]: optionIdx }));
  };

  const handleSubmitQuiz = () => {
    if (activeQuiz.length === 0 || quizSubmitted) return;
    let correct = 0;
    activeQuiz.forEach((q) => {
      if (selectedAnswers[q.id] === q.correctAnswer) {
        correct++;
      }
    });
    setQuizCorrectCount(correct);
    setQuizSubmitted(true);

    // Auto mark lesson as completed if they score full marks
    if (correct === activeQuiz.length && !isCompleted) {
      toggleCompleted();
    }
  };

  return (
    <div className="flex-1 w-full max-w-5xl mx-auto px-6 py-10 md:px-10 lg:px-12 flex flex-col justify-between">
      {/* Lesson Header */}
      <header className="border-b border-brand-border pb-6 mb-8 relative">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <span className="inline-flex items-center rounded-md bg-blue-500/10 px-2.5 py-0.5 text-xs font-semibold text-blue-400 border border-blue-500/20">
              Chapter {activeLesson.id}
            </span>
            <h1 className="font-display text-3xl md:text-4xl font-extrabold text-white mt-3 leading-tight">
              {activeLesson.title}
            </h1>
            <p className="mt-2 text-brand-muted text-sm max-w-3xl">
              {activeLesson.description}
            </p>
          </div>
          
          <button
            onClick={toggleCompleted}
            className={`self-start md:self-center flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold border transition-all ${
              isCompleted
                ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                : "glass-panel hover:bg-white/5 border-brand-border text-brand-muted"
            }`}
          >
            {isCompleted ? "✅ Lesson Completed" : "⬜ Mark as Completed"}
          </button>
        </div>
      </header>

      {/* Main Reading Material Container */}
      <article className="flex-1 text-brand-muted leading-relaxed space-y-8 prose prose-invert max-w-none">
        {slug === "01-introduction" && (
          <div className="space-y-6">
            <h2 className="font-display text-2xl font-bold text-white border-b border-brand-border pb-2 mt-6">
              The Idea Behind MCP
            </h2>
            <p>
              Large Language Models (LLMs) are like extremely smart brains locked in empty rooms. They possess vast internal knowledge of coding, literature, and science, but they lack physical senses and hands. An LLM on its own cannot read a text file on your hard drive, run a calculation, query a live database, check weather data, or perform actions in web applications.
            </p>

            <div className="glass-panel border-l-4 border-blue-500 p-6 rounded-r-2xl my-6 bg-blue-500/5">
              <h4 className="font-display font-bold text-white text-sm mb-1">
                The Goal of Agentic AI
              </h4>
              <p className="text-sm text-brand-text mb-0">
                To turn LLMs from conversational advisors into active, goal-driven agents. This is accomplished by providing models with <strong>Tools</strong> (external calculators, APIs, terminal access) and <strong>Context</strong> (local databases, files, documentation).
              </p>
            </div>

            <h3 className="font-display text-xl font-bold text-white mt-8">
              The Legacy Problem: Integration Fragmentation
            </h3>
            <p>
              Before the introduction of the Model Context Protocol, connecting AI models to external systems was an integration nightmare. If a developer built a specialized search tool, they had to write custom API wrappers for LangChain, custom schemas for LlamaIndex, custom formatters for Claude Desktop, and bespoke routing code for AutoGen.
            </p>
            <p>
              Every client framework had its own way of defining tools, formatting JSON parameters, and executing callbacks. This fragmented approach meant that developers had to rewrite integration code from scratch every time they wanted to use the same tool with a different client.
            </p>

            {/* Clickable Image Figure */}
            <div 
              onClick={() => setLightboxImage({
                src: "/images/image_1.png",
                caption: "Figure 1.1: The Model Context Protocol (MCP) standardizes data exchange between AI Clients (hosts) and Server integrations."
              })}
              className="glass-panel p-2 rounded-2xl cursor-zoom-in group hover:border-blue-500/30 transition-all my-8 overflow-hidden"
            >
              <div className="bg-[#090d16] flex items-center justify-center p-6 sm:p-12 rounded-xl">
                <span className="text-blue-400 font-bold border border-blue-500/20 px-4 py-2 rounded-lg bg-blue-500/5 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                  🔍 View Diagram: The Core Concept of MCP
                </span>
              </div>
              <div className="p-3 text-center text-xs text-brand-muted border-t border-brand-border mt-2">
                Figure 1.1: Standardized session exchange layout. Click to zoom diagram.
              </div>
            </div>

            <h3 className="font-display text-xl font-bold text-white mt-8">
              The MCP Solution: USB-C for AI Systems
            </h3>
            <p>
              The <strong>Model Context Protocol (MCP)</strong> is an open-source client-server communication protocol. Instead of custom integrations, MCP defines a single standardized specification. AI client applications (like VS Code, Claude Desktop, Cursor, or your custom Python clients) establish standardized sessions with MCP Servers.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-8">
              <div className="glass-panel p-5 rounded-2xl hover:bg-white/5 transition-all">
                <h4 className="font-display font-semibold text-white mb-2">🔌 Universal Connection</h4>
                <p className="text-xs leading-relaxed text-brand-muted">
                  Build a database connector or weather API once as an MCP server. Any compatible client can connect and use it immediately.
                </p>
              </div>
              <div className="glass-panel p-5 rounded-2xl hover:bg-white/5 transition-all">
                <h4 className="font-display font-semibold text-white mb-2">🛡️ Sandboxed Safety</h4>
                <p className="text-xs leading-relaxed text-brand-muted">
                  The client application acts as a secure coordinator, executing tools in isolated subprocesses and passing raw results back.
                </p>
              </div>
              <div className="glass-panel p-5 rounded-2xl hover:bg-white/5 transition-all">
                <h4 className="font-display font-semibold text-white mb-2">⚡ Simple JSON-RPC</h4>
                <p className="text-xs leading-relaxed text-brand-muted">
                  Communication is powered by standard JSON-RPC 2.0 messages, making it easy to build clients and servers in any language.
                </p>
              </div>
            </div>

            <h3 className="font-display text-xl font-bold text-white mt-8">
              History of Agentic AI Integration
            </h3>
            <div className="relative border-l border-blue-500/20 pl-6 ml-4 space-y-8 my-8">
              <div className="relative">
                <span className="absolute -left-[31px] top-1.5 h-2 w-2 rounded-full bg-blue-500 ring-4 ring-blue-500/20" />
                <h5 className="font-display text-sm font-bold text-blue-400">Stage 1: Prompt Engineering (2022)</h5>
                <p className="text-xs text-brand-muted mt-1">Manual context copy-pasting directly into prompt windows.</p>
              </div>
              <div className="relative">
                <span className="absolute -left-[31px] top-1.5 h-2 w-2 rounded-full bg-blue-500 ring-4 ring-blue-500/20" />
                <h5 className="font-display text-sm font-bold text-blue-400">Stage 2: ReAct Pattern &amp; Agents (Early 2023)</h5>
                <p className="text-xs text-brand-muted mt-1">Parsing text patterns like `Action: Search[...]` to invoke custom scripts dynamically.</p>
              </div>
              <div className="relative">
                <span className="absolute -left-[31px] top-1.5 h-2 w-2 rounded-full bg-blue-500 ring-4 ring-blue-500/20" />
                <h5 className="font-display text-sm font-bold text-blue-400">Stage 3: Function Calling (Late 2023)</h5>
                <p className="text-xs text-brand-muted mt-1">Fine-tuned models output structured JSON tool calls, but client integration remains custom.</p>
              </div>
              <div className="relative">
                <span className="absolute -left-[31px] top-1.5 h-2 w-2 rounded-full bg-blue-500 ring-4 ring-blue-500/20" />
                <h5 className="font-display text-sm font-bold text-blue-400">Stage 4: Standardized Protocols (Late 2024 - Present)</h5>
                <p className="text-xs text-brand-muted mt-1">The Model Context Protocol unifies tools and context resources universally.</p>
              </div>
            </div>
          </div>
        )}

        {slug === "02-architecture-overview" && (
          <div className="space-y-6">
            <h2 className="font-display text-2xl font-bold text-white border-b border-brand-border pb-2 mt-6">
              The Client-Host-Server Triad
            </h2>
            <p>
              MCP breaks AI communication down into three clear roles to maintain security boundaries and allow modular integrations.
            </p>
            
            <ul className="space-y-3 list-disc list-inside">
              <li><strong>The Host:</strong> The user-facing application (e.g., Claude Desktop, VS Code, Cursor) that coordinates the AI workspace and decides when it is safe to execute a tool.</li>
              <li><strong>The Client:</strong> The protocol implementation module running inside the host that manages connection channels, parses transport sockets, and translates inputs and outputs.</li>
              <li><strong>The Server:</strong> Standalone, local background scripts or remote HTTP endpoints that connect to APIs, write files, or query databases.</li>
            </ul>

            {/* Clickable Image Figure */}
            <div 
              onClick={() => setLightboxImage({
                src: "/images/image_2.png",
                caption: "Figure 2.1: Division of labor between Host, Client, and Server in the MCP ecosystem."
              })}
              className="glass-panel p-2 rounded-2xl cursor-zoom-in group hover:border-purple-500/30 transition-all my-8 overflow-hidden"
            >
              <div className="bg-[#090d16] flex items-center justify-center p-6 sm:p-12 rounded-xl">
                <span className="text-purple-400 font-bold border border-purple-500/20 px-4 py-2 rounded-lg bg-purple-500/5 group-hover:bg-purple-600 group-hover:text-white transition-colors">
                  🔍 View Diagram: The Client-Host-Server Triad
                </span>
              </div>
              <div className="p-3 text-center text-xs text-brand-muted border-t border-brand-border mt-2">
                Figure 2.1: Triad architecture. Click to zoom.
              </div>
            </div>

            <h3 className="font-display text-xl font-bold text-white mt-8">
              JSON-RPC 2.0 specs
            </h3>
            <p>
              All message exchanges between MCP clients and servers are formatted using <strong>JSON-RPC 2.0</strong>, specifying requests, responses, and notifications.
            </p>

            <h3 className="font-display text-xl font-bold text-white mt-8">
              Protocol Primitives
            </h3>
            <div className="space-y-4 my-6">
              <div className="glass-panel p-5 rounded-2xl">
                <h4 className="font-display text-base font-bold text-white flex items-center gap-2">
                  🛠️ Tools
                </h4>
                <p className="text-xs text-brand-muted mt-2">
                  Executable functions with schemas. The LLM controls *when* and *how* to call them. FastMCP inspects parameters to auto-generate standard JSON schema constraints.
                </p>
              </div>
              <div className="glass-panel p-5 rounded-2xl">
                <h4 className="font-display text-base font-bold text-white flex items-center gap-2">
                  📂 Resources
                </h4>
                <p className="text-xs text-brand-muted mt-2">
                  Read-only context data, identified using custom URI schemes (e.g. <code>inventory://{`{item_id}`}</code>). The client retains read control.
                </p>
              </div>
              <div className="glass-panel p-5 rounded-2xl">
                <h4 className="font-display text-base font-bold text-white flex items-center gap-2">
                  📝 Prompts
                </h4>
                <p className="text-xs text-brand-muted mt-2">
                  Structured prompt templates and system role descriptions exposed directly by servers, facilitating complex LLM workflows.
                </p>
              </div>
            </div>

            <h3 className="font-display text-xl font-bold text-white mt-8">
              SDK Development Modes: FastMCP vs Low-Level
            </h3>
            <div className="overflow-x-auto my-6">
              <table className="min-w-full divide-y divide-brand-border border border-brand-border rounded-xl overflow-hidden bg-brand-card/25">
                <thead className="bg-white/5">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-white">Feature</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-white">FastMCP (High-Level)</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-white">Server (Low-Level)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-brand-border text-xs">
                  <tr>
                    <td className="px-4 py-3 font-semibold text-white">Complexity</td>
                    <td className="px-4 py-3 text-brand-muted">Decorator-driven; simple setup.</td>
                    <td className="px-4 py-3 text-brand-muted">Requires manual loop management.</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-semibold text-white">Schemas</td>
                    <td className="px-4 py-3 text-brand-muted">Auto-parsed from type hints & docstrings.</td>
                    <td className="px-4 py-3 text-brand-muted">Must write raw JSON schema.</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {slug !== "01-introduction" && slug !== "02-architecture-overview" && (
          <div className="space-y-6">
            <h2 className="font-display text-2xl font-bold text-white border-b border-brand-border pb-2 mt-6">
              Curriculum & Practical Lab
            </h2>
            <p>
              This chapter represents a hands-on python development section in the course. Inside the local workspace directory, you will find ready-to-run files and exercise scripts.
            </p>

            <div className="glass-panel p-6 rounded-2xl bg-blue-500/5 my-6">
              <h4 className="font-display font-semibold text-white text-sm mb-2">📁 Related Files in Workspace</h4>
              <p className="text-xs text-brand-muted leading-relaxed">
                Open your local workspace folder <code>Complete-Guide-to-MCP-in-Python</code> in VS Code to locate the scripts and run them directly.
              </p>
            </div>

            <h3 className="font-display text-xl font-bold text-white mt-8">Lab Steps & Setup Instructions</h3>
            <p>
              Follow the instructions in the directory's localized <code>README.md</code> to activate the python virtual environment, install the uv packages, and run the server/client instances.
            </p>

            <pre className="glass-panel p-4 rounded-xl text-xs font-mono text-blue-300 overflow-x-auto my-6 bg-black/40">
{`# 1. Activate venv
venv\\Scripts\\activate

# 2. Run target server or client
python script_name.py`}
            </pre>
          </div>
        )}
      </article>

      {/* Quiz Section */}
      {activeQuiz.length > 0 && (
        <section className="mt-16 border-t border-brand-border pt-12">
          <div className="glass-panel p-6 sm:p-8 rounded-3xl bg-brand-card/30">
            <div className="flex items-center gap-3 mb-6">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/10 text-xs font-bold text-blue-400 border border-blue-500/20">
                📝
              </span>
              <div>
                <h3 className="font-display text-lg sm:text-xl font-bold text-white">
                  Knowledge Assessment
                </h3>
                <p className="text-xs text-brand-muted mt-0.5">
                  Test your understanding before advancing.
                </p>
              </div>
            </div>

            <div className="space-y-8">
              {activeQuiz.map((q, qIdx) => (
                <div key={q.id} className="space-y-3">
                  <h4 className="font-display text-sm sm:text-base font-semibold text-white">
                    {qIdx + 1}. {q.text}
                  </h4>
                  <div className="grid grid-cols-1 gap-3">
                    {q.options.map((option, oIdx) => {
                      const isSelected = selectedAnswers[q.id] === oIdx;
                      const showFeedback = quizSubmitted;
                      const isCorrect = oIdx === q.correctAnswer;
                      const isWrongSelection = isSelected && !isCorrect;

                      let buttonClass = "glass-panel p-4 rounded-xl text-left text-xs sm:text-sm transition-all hover:bg-white/5";
                      if (isSelected && !showFeedback) {
                        buttonClass = "glass-panel p-4 rounded-xl text-left text-xs sm:text-sm bg-blue-600/20 border-blue-500 text-white font-semibold";
                      } else if (showFeedback) {
                        if (isCorrect) {
                          buttonClass = "glass-panel p-4 rounded-xl text-left text-xs sm:text-sm bg-emerald-500/10 border-emerald-500/50 text-emerald-400 font-semibold";
                        } else if (isWrongSelection) {
                          buttonClass = "glass-panel p-4 rounded-xl text-left text-xs sm:text-sm bg-red-500/10 border-red-500/50 text-red-400 font-semibold";
                        } else {
                          buttonClass = "glass-panel p-4 rounded-xl text-left text-xs sm:text-sm opacity-55 border-brand-border text-brand-muted";
                        }
                      }

                      return (
                        <button
                          key={oIdx}
                          onClick={() => handleSelectOption(q.id, oIdx)}
                          className={buttonClass}
                          disabled={quizSubmitted}
                        >
                          <div className="flex items-center gap-3">
                            <span className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs border ${
                              isSelected
                                ? "bg-blue-500 border-blue-500 text-white"
                                : "border-white/15"
                            }`}>
                              {String.fromCharCode(65 + oIdx)}
                            </span>
                            <span>{option}</span>
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  {quizSubmitted && isCompleted && (
                    <div className="p-4 rounded-xl bg-white/5 border border-brand-border text-xs leading-relaxed mt-2 text-brand-muted">
                      <strong className="text-white block mb-1">Explanation:</strong>
                      {q.explanation}
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="mt-8 flex items-center justify-between border-t border-brand-border pt-6 gap-4">
              {quizSubmitted ? (
                <div className="text-xs sm:text-sm">
                  {quizCorrectCount === activeQuiz.length ? (
                    <span className="text-emerald-400 font-semibold">🎉 Perfect Score! Lesson unlocked.</span>
                  ) : (
                    <span className="text-brand-muted">
                      Score: <strong className="text-white">{quizCorrectCount}/{activeQuiz.length}</strong>. Try again by resetting.
                    </span>
                  )}
                </div>
              ) : (
                <div className="text-xs text-brand-muted">
                  Make your selections and hit submit.
                </div>
              )}

              <div className="flex gap-3">
                {quizSubmitted && (
                  <button
                    onClick={() => {
                      setSelectedAnswers({});
                      setQuizSubmitted(false);
                      setQuizCorrectCount(0);
                    }}
                    className="px-4 py-2 border border-brand-border rounded-xl text-xs font-semibold text-brand-text hover:bg-white/5 transition-all"
                  >
                    Reset Quiz
                  </button>
                )}
                <button
                  onClick={handleSubmitQuiz}
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-40 disabled:cursor-not-allowed rounded-xl text-xs font-bold text-white transition-all"
                  disabled={quizSubmitted || Object.keys(selectedAnswers).length < activeQuiz.length}
                >
                  Submit Quiz
                </button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Lesson Navigation Footer */}
      <footer className="mt-16 border-t border-brand-border pt-8 flex items-center justify-between gap-4">
        {prevLesson ? (
          <Link
            href={`/lessons/${prevLesson.slug}`}
            className="flex flex-col text-left group max-w-[45%]"
          >
            <span className="text-[10px] uppercase tracking-wider text-brand-muted">Previous Chapter</span>
            <span className="text-xs sm:text-sm font-semibold text-white group-hover:text-blue-400 truncate mt-1 transition-colors">
              ← {prevLesson.title}
            </span>
          </Link>
        ) : (
          <div />
        )}

        {nextLesson ? (
          <Link
            href={`/lessons/${nextLesson.slug}`}
            className="flex flex-col text-right group max-w-[45%] items-end"
          >
            <span className="text-[10px] uppercase tracking-wider text-brand-muted">Next Chapter</span>
            <span className="text-xs sm:text-sm font-semibold text-white group-hover:text-blue-400 truncate mt-1 transition-colors">
              {nextLesson.title} →
            </span>
          </Link>
        ) : (
          <Link
            href="/"
            className="flex flex-col text-right group max-w-[45%] items-end"
          >
            <span className="text-[10px] uppercase tracking-wider text-brand-muted">Finish Course</span>
            <span className="text-xs sm:text-sm font-semibold text-white group-hover:text-blue-400 truncate mt-1 transition-colors">
              Go to Dashboard →
            </span>
          </Link>
        )}
      </footer>

      {/* Native React Lightbox Overlay Modal */}
      {lightboxImage && (
        <div
          onClick={() => setLightboxImage(null)}
          className="fixed inset-0 bg-black/90 backdrop-blur-md z-50 flex items-center justify-center p-4 transition-all"
        >
          <button
            onClick={() => setLightboxImage(null)}
            className="absolute top-6 right-6 text-brand-muted hover:text-white text-3xl font-light focus:outline-none"
            aria-label="Close image zoom"
          >
            &times;
          </button>
          <div className="max-w-4xl max-h-[85vh] flex flex-col items-center gap-4">
            <div className="border border-white/10 rounded-2xl overflow-hidden bg-brand-bg-start p-10 flex items-center justify-center">
              <span className="text-blue-400 font-extrabold text-lg border border-blue-500/20 px-6 py-4 rounded-xl bg-blue-500/5">
                Diagram Overlay: {lightboxImage.caption}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-brand-text bg-brand-card px-4 py-2 rounded-full border border-brand-border max-w-xl text-center">
              {lightboxImage.caption}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
