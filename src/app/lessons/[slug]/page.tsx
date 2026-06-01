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

  // Find active module for breadcrumbs
  const activeModule = modulesData.find((m) =>
    m.lessons.some((l) => l.slug === slug)
  );

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
      <div className="flex-1 flex flex-col items-center justify-center p-12 text-center bg-gray-light/35">
        <h2 className="text-2xl font-bold text-slate-dark mb-2">Lesson Not Found / पाठ नहीं मिला</h2>
        <p className="text-slate-medium mb-6">The requested curriculum chapter does not exist.</p>
        <Link href="/" className="btn-primary">
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
    <div className="flex-1 w-full max-w-5xl mx-auto px-6 py-10 md:px-10 lg:px-12 flex flex-col justify-between bg-gray-light/10">
      {/* Breadcrumb Navigation - Light Spec */}
      <nav className="mb-6 text-sm text-slate-medium flex flex-wrap items-center gap-2">
        <Link href="/" className="hover:text-blue-primary transition-colors">
          Home / गृह
        </Link>
        <span className="text-slate-pale">/</span>
        <span className="hover:text-blue-primary transition-colors">
          Learning Paths / शिक्षण मार्ग
        </span>
        {activeModule && (
          <>
            <span className="text-slate-pale">/</span>
            <span className="truncate max-w-[150px] sm:max-w-none text-slate-medium">
              {activeModule.title.split(":")[0]}
            </span>
          </>
        )}
        <span className="text-slate-pale">/</span>
        <span className="text-slate-dark font-semibold">
          {activeLesson.title}
        </span>
      </nav>

      {/* Lesson Header */}
      <header className="border-b border-slate-light pb-6 mb-8 relative bg-white p-6 sm:p-8 rounded-xl border shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <span className="inline-flex items-center rounded-md bg-blue-primary/10 px-2.5 py-0.5 text-xs font-semibold text-blue-primary border border-blue-primary/20">
              Chapter / अध्याय {activeLesson.id}
            </span>
            <h1 className="font-display font-role-h1 text-slate-dark mt-3 leading-tight">
              {activeLesson.title}
            </h1>
            <p className="mt-2 text-slate-medium font-role-body-regular max-w-3xl">
              {activeLesson.description}
            </p>
          </div>
          
          <button
            onClick={toggleCompleted}
            className={`self-start md:self-center flex items-center gap-2 btn-secondary ${
              isCompleted
                ? "bg-emerald-50 text-success-green border-success-green font-semibold"
                : ""
            }`}
          >
            {isCompleted ? "✅ Completed / पूरा हुआ" : "⬜ Mark as Completed / पूर्ण चिह्नित करें"}
          </button>
        </div>
      </header>

      {/* Main Reading Material Container */}
      <article className="flex-1 text-slate-medium font-role-body-regular space-y-8 max-w-none">
        {slug === "01-introduction" && (
          <div className="space-y-6">
            <h2 className="font-display font-role-h2 text-slate-dark border-b border-slate-light pb-2 mt-6">
              The Idea Behind MCP / एमसीपी के पीछे का विचार
            </h2>
            <p className="leading-relaxed">
              Large Language Models (LLMs) are like extremely smart brains locked in empty rooms. They possess vast internal knowledge of coding, literature, and science, but they lack physical senses and hands. An LLM on its own cannot read a text file on your hard drive, run a calculation, query a live database, check weather data, or perform actions in web applications.
            </p>

            <div className="bg-blue-primary/[0.03] border-l-4 border-blue-primary p-6 rounded-r-xl my-6 border-y border-r border-slate-light shadow-sm">
              <h4 className="font-display font-role-h3 text-slate-dark mb-1">
                The Goal of Agentic AI / एजेंटिक एआई का लक्ष्य
              </h4>
              <p className="text-sm text-slate-medium mb-0 leading-relaxed">
                To turn LLMs from conversational advisors into active, goal-driven agents. This is accomplished by providing models with <strong>Tools</strong> (external calculators, APIs, terminal access) and <strong>Context</strong> (local databases, files, documentation).
              </p>
            </div>

            <h3 className="font-display text-xl font-bold text-slate-dark mt-8">
              The Legacy Problem: Integration Fragmentation / एकीकरण विखंडन की समस्या
            </h3>
            <p className="leading-relaxed">
              Before the introduction of the Model Context Protocol, connecting AI models to external systems was an integration nightmare. If a developer built a specialized search tool, they had to write custom API wrappers for LangChain, custom schemas for LlamaIndex, custom formatters for Claude Desktop, and bespoke routing code for AutoGen.
            </p>
            <p className="leading-relaxed">
              Every client framework had its own way of defining tools, formatting JSON parameters, and executing callbacks. This fragmented approach meant that developers had to rewrite integration code from scratch every time they wanted to use the same tool with a different client.
            </p>

            {/* Clickable Image Figure (Now renders a real diagram thumbnail) */}
            <div 
              onClick={() => setLightboxImage({
                src: "/images/image_1.png",
                caption: "Figure 1.1: The Model Context Protocol (MCP) standardizes data exchange between AI Clients (hosts) and Server integrations."
              })}
              className="bg-white border border-slate-light p-4 rounded-xl cursor-zoom-in group hover:border-blue-primary/45 hover:shadow-l2 transition-all my-8 overflow-hidden"
            >
              <div className="bg-gray-light flex items-center justify-center p-3 rounded-lg overflow-hidden border border-slate-light relative h-64 sm:h-80">
                <img
                  src="/images/image_1.png"
                  alt="MCP Core Concept"
                  className="max-h-full max-w-full object-contain transition-transform group-hover:scale-[1.02] duration-300"
                />
                <div className="absolute inset-0 bg-slate-darkest/5 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                  <span className="bg-white/95 text-blue-primary text-xs font-bold px-3 py-1.5 rounded-lg shadow border border-slate-light">
                    🔍 Click to Zoom / बड़ा करने के लिए क्लिक करें
                  </span>
                </div>
              </div>
              <div className="p-3 text-center text-xs text-slate-medium border-t border-slate-light mt-3">
                Figure 1.1: Standardized session exchange layout. Click to zoom diagram.
              </div>
            </div>

            <h3 className="font-display text-xl font-bold text-slate-dark mt-8">
              The MCP Solution: USB-C for AI Systems / एआई सिस्टम के लिए यूएसबी-सी
            </h3>
            <p className="leading-relaxed">
              The <strong>Model Context Protocol (MCP)</strong> is an open-source client-server communication protocol. Instead of custom integrations, MCP defines a single standardized specification. AI client applications (like VS Code, Claude Desktop, Cursor, or your custom Python clients) establish standardized sessions with MCP Servers.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-8">
              <div className="bg-white border border-slate-light p-5 rounded-xl hover:shadow-l2 transition-all">
                <h4 className="font-display font-semibold text-slate-dark mb-2">🔌 Universal Connection</h4>
                <p className="text-xs leading-relaxed text-slate-medium">
                  Build a database connector or weather API once as an MCP server. Any compatible client can connect and use it immediately.
                </p>
              </div>
              <div className="bg-white border border-slate-light p-5 rounded-xl hover:shadow-l2 transition-all">
                <h4 className="font-display font-semibold text-slate-dark mb-2">🛡️ Sandboxed Safety</h4>
                <p className="text-xs leading-relaxed text-slate-medium">
                  The client application acts as a secure coordinator, executing tools in isolated subprocesses and passing raw results back.
                </p>
              </div>
              <div className="bg-white border border-slate-light p-5 rounded-xl hover:shadow-l2 transition-all">
                <h4 className="font-display font-semibold text-slate-dark mb-2">⚡ Simple JSON-RPC</h4>
                <p className="text-xs leading-relaxed text-slate-medium">
                  Communication is powered by standard JSON-RPC 2.0 messages, making it easy to build clients and servers in any language.
                </p>
              </div>
            </div>

            <h3 className="font-display text-xl font-bold text-slate-dark mt-8">
              History of Agentic AI Integration / एजेंटिक एआई एकीकरण का इतिहास
            </h3>
            <div className="relative border-l border-slate-pale pl-6 ml-4 space-y-8 my-8">
              <div className="relative">
                <span className="absolute -left-[31px] top-1.5 h-2 w-2 rounded-full bg-blue-primary ring-4 ring-blue-primary/20" />
                <h5 className="font-display text-sm font-bold text-blue-primary">Stage 1: Prompt Engineering (2022)</h5>
                <p className="text-xs text-slate-medium mt-1">Manual context copy-pasting directly into prompt windows.</p>
              </div>
              <div className="relative">
                <span className="absolute -left-[31px] top-1.5 h-2 w-2 rounded-full bg-blue-primary ring-4 ring-blue-primary/20" />
                <h5 className="font-display text-sm font-bold text-blue-primary">Stage 2: ReAct Pattern &amp; Agents (Early 2023)</h5>
                <p className="text-xs text-slate-medium mt-1">Parsing text patterns like `Action: Search[...]` to invoke custom scripts dynamically.</p>
              </div>
              <div className="relative">
                <span className="absolute -left-[31px] top-1.5 h-2 w-2 rounded-full bg-blue-primary ring-4 ring-blue-primary/20" />
                <h5 className="font-display text-sm font-bold text-blue-primary">Stage 3: Function Calling (Late 2023)</h5>
                <p className="text-xs text-slate-medium mt-1">Fine-tuned models output structured JSON tool calls, but client integration remains custom.</p>
              </div>
              <div className="relative">
                <span className="absolute -left-[31px] top-1.5 h-2 w-2 rounded-full bg-blue-primary ring-4 ring-blue-primary/20" />
                <h5 className="font-display text-sm font-bold text-blue-primary">Stage 4: Standardized Protocols (Late 2024 - Present)</h5>
                <p className="text-xs text-slate-medium mt-1">The Model Context Protocol unifies tools and context resources universally.</p>
              </div>
            </div>
          </div>
        )}

        {slug === "02-architecture-overview" && (
          <div className="space-y-6">
            <h2 className="font-display font-role-h2 text-slate-dark border-b border-slate-light pb-2 mt-6">
              The Client-Host-Server Triad / क्लाइंट-होस्ट-सर्वर ट्रायड
            </h2>
            <p className="leading-relaxed">
              MCP breaks AI communication down into three clear roles to maintain security boundaries and allow modular integrations.
            </p>
            
            <ul className="space-y-3 list-disc list-inside leading-relaxed">
              <li><strong>The Host:</strong> The user-facing application (e.g., Claude Desktop, VS Code, Cursor) that coordinates the AI workspace and decides when it is safe to execute a tool.</li>
              <li><strong>The Client:</strong> The protocol implementation module running inside the host that manages connection channels, parses transport sockets, and translates inputs and outputs.</li>
              <li><strong>The Server:</strong> Standalone, local background scripts or remote HTTP endpoints that connect to APIs, write files, or query databases.</li>
            </ul>

            {/* Clickable Image Figure 2.1 */}
            <div 
              onClick={() => setLightboxImage({
                src: "/images/image_2.png",
                caption: "Figure 2.1: Division of labor between Host, Client, and Server in the MCP ecosystem."
              })}
              className="bg-white border border-slate-light p-4 rounded-xl cursor-zoom-in group hover:border-blue-primary/45 hover:shadow-l2 transition-all my-8 overflow-hidden"
            >
              <div className="bg-gray-light flex items-center justify-center p-3 rounded-lg overflow-hidden border border-slate-light relative h-64 sm:h-80">
                <img
                  src="/images/image_2.png"
                  alt="Client Host Server Triad"
                  className="max-h-full max-w-full object-contain transition-transform group-hover:scale-[1.02] duration-300"
                />
                <div className="absolute inset-0 bg-slate-darkest/5 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                  <span className="bg-white/95 text-blue-primary text-xs font-bold px-3 py-1.5 rounded-lg shadow border border-slate-light">
                    🔍 Click to Zoom / बड़ा करने के लिए क्लिक करें
                  </span>
                </div>
              </div>
              <div className="p-3 text-center text-xs text-slate-medium border-t border-slate-light mt-3">
                Figure 2.1: Triad architecture. Click to zoom.
              </div>
            </div>

            <h3 className="font-display text-xl font-bold text-slate-dark mt-8">
              JSON-RPC 2.0 specs / जेएसओएन-आरपीसी 2.0 विनिर्देश
            </h3>
            <p className="leading-relaxed">
              All message exchanges between MCP clients and servers are formatted using <strong>JSON-RPC 2.0</strong>, specifying requests, responses, and notifications.
            </p>

            <h3 className="font-display text-xl font-bold text-slate-dark mt-8">
              Protocol Primitives / प्रोटोकॉल प्रिमिटिव्स
            </h3>
            <div className="space-y-4 my-6">
              <div className="bg-white border border-slate-light p-5 rounded-xl hover:shadow-l1 transition-all">
                <h4 className="font-display text-base font-bold text-slate-dark flex items-center gap-2">
                  🛠️ Tools
                </h4>
                <p className="text-xs text-slate-medium mt-2 leading-relaxed">
                  Executable functions with schemas. The LLM controls *when* and *how* to call them. FastMCP inspects parameters to auto-generate standard JSON schema constraints.
                </p>
              </div>
              <div className="bg-white border border-slate-light p-5 rounded-xl hover:shadow-l1 transition-all">
                <h4 className="font-display text-base font-bold text-slate-dark flex items-center gap-2">
                  📂 Resources
                </h4>
                <p className="text-xs text-slate-medium mt-2 leading-relaxed">
                  Read-only context data, identified using custom URI schemes (e.g. <code>inventory://{`{item_id}`}</code>). The client retains read control.
                </p>
              </div>
              <div className="bg-white border border-slate-light p-5 rounded-xl hover:shadow-l1 transition-all">
                <h4 className="font-display text-base font-bold text-slate-dark flex items-center gap-2">
                  📝 Prompts
                </h4>
                <p className="text-xs text-slate-medium mt-2 leading-relaxed">
                  Structured prompt templates and system role descriptions exposed directly by servers, facilitating complex LLM workflows.
                </p>
              </div>
            </div>

            <h3 className="font-display text-xl font-bold text-slate-dark mt-8">
              SDK Development Modes: FastMCP vs Low-Level
            </h3>
            <div className="overflow-x-auto my-6 border border-slate-light rounded-xl shadow-sm">
              <table className="min-w-full divide-y divide-slate-light bg-white text-xs">
                <thead className="bg-gray-light">
                  <tr>
                    <th className="px-4 py-3 text-left font-semibold text-slate-dark">Feature</th>
                    <th className="px-4 py-3 text-left font-semibold text-slate-dark">FastMCP (High-Level)</th>
                    <th className="px-4 py-3 text-left font-semibold text-slate-dark">Server (Low-Level)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-light">
                  <tr>
                    <td className="px-4 py-3 font-semibold text-slate-dark">Complexity</td>
                    <td className="px-4 py-3 text-slate-medium">Decorator-driven; simple setup.</td>
                    <td className="px-4 py-3 text-slate-medium">Requires manual loop management.</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-semibold text-slate-dark">Schemas</td>
                    <td className="px-4 py-3 text-slate-medium">Auto-parsed from type hints & docstrings.</td>
                    <td className="px-4 py-3 text-slate-medium">Must write raw JSON schema.</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {slug !== "01-introduction" && slug !== "02-architecture-overview" && (
          <div className="space-y-6">
            <h2 className="font-display font-role-h2 text-slate-dark border-b border-slate-light pb-2 mt-6">
              Curriculum & Practical Lab / पाठ्यक्रम और व्यावहारिक प्रयोगशाला
            </h2>
            <p className="leading-relaxed">
              This chapter represents a hands-on python development section in the course. Inside the local workspace directory, you will find ready-to-run files and exercise scripts.
            </p>

            <div className="bg-white border border-slate-light p-6 rounded-xl my-6 shadow-sm">
              <h4 className="font-display font-semibold text-slate-dark text-sm mb-2">📁 Related Files in Workspace</h4>
              <p className="text-xs text-slate-medium leading-relaxed">
                Open your local workspace folder <code>Complete-Guide-to-MCP-in-Python</code> in VS Code to locate the scripts and run them directly.
              </p>
            </div>

            <h3 className="font-display text-xl font-bold text-slate-dark mt-8">Lab Steps & Setup Instructions</h3>
            <p className="leading-relaxed">
              Follow the instructions in the directory's localized <code>README.md</code> to activate the python virtual environment, install the uv packages, and run the server/client instances.
            </p>

            <pre className="p-4 rounded-xl text-xs font-mono text-slate-dark overflow-x-auto my-6 bg-slate-light border border-slate-pale shadow-inner">
{`# 1. Activate venv
venv\\Scripts\\activate

# 2. Run target server or client
python script_name.py`}
            </pre>
          </div>
        )}
      </article>

      {/* Quiz Section - Re-skinned to premium light theme container */}
      {activeQuiz.length > 0 && (
        <section className="mt-16 border-t border-slate-light pt-12">
          <div className="bg-white border border-slate-light p-6 sm:p-8 rounded-xl shadow-l3">
            <div className="flex items-center gap-3 mb-6">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-primary/10 text-xs font-bold text-blue-primary border border-blue-primary/20">
                📝
              </span>
              <div>
                <h3 className="font-display text-lg sm:text-xl font-bold text-slate-dark">
                  Knowledge Assessment / ज्ञान का मूल्यांकन
                </h3>
                <p className="text-xs text-slate-medium mt-0.5">
                  Test your understanding before advancing / आगे बढ़ने से पहले अपनी समझ का परीक्षण करें।
                </p>
              </div>
            </div>

            <div className="space-y-8">
              {activeQuiz.map((q, qIdx) => (
                <div key={q.id} className="space-y-3">
                  <h4 className="font-display text-sm sm:text-base font-semibold text-slate-dark">
                    {qIdx + 1}. {q.text}
                  </h4>
                  <div className="grid grid-cols-1 gap-3">
                    {q.options.map((option, oIdx) => {
                      const isSelected = selectedAnswers[q.id] === oIdx;
                      const showFeedback = quizSubmitted;
                      const isCorrect = oIdx === q.correctAnswer;
                      const isWrongSelection = isSelected && !isCorrect;

                      let buttonClass = "w-full text-left p-4 rounded-xl text-xs sm:text-sm border transition-all duration-250 flex items-center justify-between ";
                      
                      if (!showFeedback) {
                        if (isSelected) {
                          buttonClass += "bg-blue-primary/5 border-blue-primary text-slate-dark font-semibold shadow-sm";
                        } else {
                          buttonClass += "bg-white border-slate-light hover:bg-gray-light hover:border-slate-medium text-slate-medium";
                        }
                      } else {
                        // Submitted feedback states
                        if (isCorrect) {
                          buttonClass += "bg-emerald-50 border-success-green text-success-green font-semibold";
                        } else if (isWrongSelection) {
                          buttonClass += "bg-red-50 border-red-vivid text-red-vivid font-semibold";
                        } else {
                          buttonClass += "bg-white border-slate-light opacity-55 text-slate-medium cursor-not-allowed";
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
                                ? "bg-blue-primary border-blue-primary text-white"
                                : "border-slate-pale bg-white text-slate-medium"
                            }`}>
                              {String.fromCharCode(65 + oIdx)}
                            </span>
                            <span>{option}</span>
                          </div>
                          {showFeedback && isCorrect && <span className="text-success-green">✓</span>}
                          {showFeedback && isWrongSelection && <span className="text-red-vivid">✗</span>}
                        </button>
                      );
                    })}
                  </div>

                  {quizSubmitted && isCompleted && (
                    <div className="p-4 rounded-xl bg-gray-light border border-slate-light text-xs leading-relaxed mt-2 text-slate-medium">
                      <strong className="text-slate-dark block mb-1">Explanation / स्पष्टीकरण:</strong>
                      {q.explanation}
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="mt-8 flex items-center justify-between border-t border-slate-light pt-6 gap-4">
              {quizSubmitted ? (
                <div className="text-xs sm:text-sm">
                  {quizCorrectCount === activeQuiz.length ? (
                    <span className="text-success-green font-semibold">🎉 Perfect Score! / उत्तम स्कोर!</span>
                  ) : (
                    <span className="text-slate-medium">
                      Score: <strong className="text-slate-dark">{quizCorrectCount}/{activeQuiz.length}</strong>. Try again by resetting.
                    </span>
                  )}
                </div>
              ) : (
                <div className="text-xs text-slate-medium">
                  Make your selections and hit submit. / विकल्प चुनें और सबमिट करें।
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
                    className="btn-secondary h-9 py-1 px-3 text-xs"
                  >
                    Reset Quiz
                  </button>
                )}
                <button
                  onClick={handleSubmitQuiz}
                  className="btn-primary h-9 py-1 px-4 text-xs disabled:opacity-40 disabled:cursor-not-allowed"
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
      <footer className="mt-16 border-t border-slate-light pt-8 flex items-center justify-between gap-4 pb-8">
        {prevLesson ? (
          <Link
            href={`/lessons/${prevLesson.slug}`}
            className="flex flex-col text-left group max-w-[45%]"
          >
            <span className="text-[10px] uppercase tracking-wider text-slate-medium">Previous Chapter / पिछला</span>
            <span className="text-xs sm:text-sm font-semibold text-slate-dark group-hover:text-blue-primary truncate mt-1 transition-colors">
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
            <span className="text-[10px] uppercase tracking-wider text-slate-medium">Next Chapter / अगला</span>
            <span className="text-xs sm:text-sm font-semibold text-slate-dark group-hover:text-blue-primary truncate mt-1 transition-colors">
              {nextLesson.title} →
            </span>
          </Link>
        ) : (
          <Link
            href="/"
            className="flex flex-col text-right group max-w-[45%] items-end"
          >
            <span className="text-[10px] uppercase tracking-wider text-slate-medium">Finish Course / समाप्त</span>
            <span className="text-xs sm:text-sm font-semibold text-slate-dark group-hover:text-blue-primary truncate mt-1 transition-colors">
              Go to Dashboard →
            </span>
          </Link>
        )}
      </footer>

      {/* Lightbox Overlay Modal - Light Spec */}
      {lightboxImage && (
        <div
          onClick={() => setLightboxImage(null)}
          className="fixed inset-0 bg-slate-darkest/90 backdrop-blur-md z-50 flex items-center justify-center p-4 transition-all"
        >
          <button
            onClick={() => setLightboxImage(null)}
            className="absolute top-6 right-6 text-white hover:text-red-hot text-4xl font-light focus:outline-none"
            aria-label="Close image zoom"
          >
            &times;
          </button>
          <div className="max-w-4xl max-h-[85vh] flex flex-col items-center gap-4">
            <div className="border border-slate-light rounded-2xl overflow-hidden bg-white p-6 sm:p-10 flex items-center justify-center shadow-2xl">
              <img
                src={lightboxImage.src}
                alt={lightboxImage.caption}
                className="max-h-[70vh] max-w-full object-contain"
              />
            </div>
            <p className="text-xs sm:text-sm text-slate-dark bg-white px-5 py-2.5 rounded-full border border-slate-light max-w-2xl text-center shadow-lg font-semibold">
              {lightboxImage.caption}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
