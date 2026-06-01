"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { modulesData, Lesson } from "@/data/courseData";
import { quizzesData, Question } from "@/data/quizData";
import { usePreferences } from "../../usePreferences";

const pageTranslations = {
  en: {
    home: "Home",
    learningPaths: "Learning Paths",
    chapter: "Chapter",
    markCompleted: "⬜ Mark as Completed",
    completed: "✅ Completed",
    labFilesTitle: "📁 Related Files in Workspace",
    labFilesDesc: "Open your local workspace folder in VS Code to locate the scripts and run them directly.",
    labInstructionsTitle: "Lab Steps & Setup Instructions",
    labInstructionsDesc: "Follow the instructions in the directory's localized README.md to activate the python virtual environment, install the uv packages, and run the server/client instances.",
    assessmentTitle: "Knowledge Assessment",
    assessmentDesc: "Test your understanding before advancing.",
    explanationHeader: "Explanation:",
    scorePerfect: "🎉 Perfect Score! Lesson unlocked.",
    selectionsText: "Make your selections and hit submit.",
    resetBtn: "Reset Quiz",
    submitBtn: "Submit Quiz",
    prevChapter: "Previous Chapter",
    nextChapter: "Next Chapter",
    finishCourse: "Finish Course",
    dashboardBtn: "Go to Dashboard",
    zoomText: "🔍 Click to Zoom",
    lightboxCaptionPrefix: "Diagram Overlay:",
    notFoundTitle: "Lesson Not Found",
    notFoundDesc: "The requested curriculum chapter does not exist.",
    returnDashboard: "Return to Course Dashboard",
  },
  hi: {
    home: "मुख्य पृष्ठ",
    learningPaths: "लर्निंग पाथ",
    chapter: "अध्याय",
    markCompleted: "⬜ पूर्ण चिह्नित करें",
    completed: "✅ पाठ पूरा हुआ",
    labFilesTitle: "📁 कार्यक्षेत्र में संबंधित फ़ाइलें",
    labFilesDesc: "स्क्रिप्ट खोजने और उन्हें सीधे चलाने के लिए वीएस कोड में अपने स्थानीय कार्यक्षेत्र फ़ोल्डर को खोलें।",
    labInstructionsTitle: "लैब चरण और सेटअप निर्देश",
    labInstructionsDesc: "पायथन वर्चुअल वातावरण को सक्रिय करने, यूवी पैकेज स्थापित करने और सर्वर/क्लाइंट उदाहरणों को चलाने के लिए निर्देशिका के स्थानीय README.md निर्देशों का पालन करें।",
    assessmentTitle: "ज्ञान का मूल्यांकन",
    assessmentDesc: "आगे बढ़ने से पहले अपनी समझ का परीक्षण करें।",
    explanationHeader: "स्पष्टीकरण:",
    scorePerfect: "🎉 उत्तम स्कोर! पाठ पूरा हुआ।",
    selectionsText: "विकल्प चुनें और सबमिट करें।",
    resetBtn: "क्विज रीसेट करें",
    submitBtn: "क्विज सबमिट करें",
    prevChapter: "पिछला अध्याय",
    nextChapter: "अगला अध्याय",
    finishCourse: "कोर्स समाप्त करें",
    dashboardBtn: "डैशबोर्ड पर जाएं",
    zoomText: "🔍 बड़ा करने के लिए क्लिक करें",
    lightboxCaptionPrefix: "आरेख विवरण:",
    notFoundTitle: "अध्याय नहीं मिला",
    notFoundDesc: "अनुरोधित पाठ्यक्रम अध्याय अस्तित्व में नहीं है।",
    returnDashboard: "डैशबोर्ड पर वापस जाएं",
  }
};

export default function LessonPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;

  const { theme, setTheme, lang, setLang, mounted } = usePreferences();

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

  if (!mounted) {
    return <div className="flex-1 bg-white dark:bg-slate-darkest" />;
  }

  const t = pageTranslations[lang];

  if (!activeLesson) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-12 text-center bg-theme-section/20">
        <h2 className="text-2xl font-bold text-theme-text mb-2">{t.notFoundTitle}</h2>
        <p className="text-theme-text-muted mb-6">{t.notFoundDesc}</p>
        <Link href="/" className="btn-primary">
          {t.returnDashboard}
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
    <div className="flex-1 w-full max-w-5xl mx-auto px-6 py-10 md:px-10 lg:px-12 flex flex-col justify-between bg-theme-bg">
      {/* Breadcrumb Navigation */}
      <nav className="mb-6 text-sm text-theme-text-muted flex flex-wrap items-center gap-2">
        <Link href="/" className="hover:text-blue-primary transition-colors">
          {t.home}
        </Link>
        <span className="text-slate-pale">/</span>
        <span className="hover:text-blue-primary transition-colors">
          {t.learningPaths}
        </span>
        {activeModule && (
          <>
            <span className="text-slate-pale">/</span>
            <span className="truncate max-w-[150px] sm:max-w-none text-theme-text-muted">
              {lang === "en" ? activeModule.title.split(":")[0] : `मॉड्यूल ${activeModule.id.split("-")[1]}`}
            </span>
          </>
        )}
        <span className="text-slate-pale">/</span>
        <span className="text-theme-text font-semibold">
          {activeLesson.title}
        </span>
      </nav>

      {/* Lesson Header */}
      <header className="border-b border-theme-border pb-6 mb-8 relative bg-theme-card p-6 sm:p-8 rounded-xl border shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <span className="inline-flex items-center rounded-md bg-blue-primary/10 px-2.5 py-0.5 text-xs font-semibold text-blue-primary border border-blue-primary/20">
              {t.chapter} {activeLesson.id}
            </span>
            <h1 className="font-display font-role-h1 text-theme-text mt-3 leading-tight">
              {activeLesson.title}
            </h1>
            <p className="mt-2 text-theme-text-muted font-role-body-regular max-w-3xl">
              {activeLesson.description}
            </p>
          </div>
          
          <button
            onClick={toggleCompleted}
            className={`self-start md:self-center flex items-center gap-2 btn-secondary ${
              isCompleted
                ? "bg-emerald-50 dark:bg-emerald-500/10 text-success-green border-success-green font-semibold"
                : ""
            }`}
          >
            {isCompleted ? t.completed : t.markCompleted}
          </button>
        </div>
      </header>

      {/* Main Reading Material Container */}
      <article className="flex-1 text-theme-text-muted font-role-body-regular space-y-8 max-w-none">
        {slug === "01-introduction" && (
          lang === "en" ? (
            <div className="space-y-6">
              <h2 className="font-display font-role-h2 text-theme-text border-b border-theme-border pb-2 mt-6">
                The Idea Behind MCP
              </h2>
              <p className="leading-relaxed">
                Large Language Models (LLMs) are like extremely smart brains locked in empty rooms. They possess vast internal knowledge of coding, literature, and science, but they lack physical senses and hands. An LLM on its own cannot read a text file on your hard drive, run a calculation, query a live database, check weather data, or perform actions in web applications.
              </p>

              <div className="bg-blue-primary/[0.03] border-l-4 border-blue-primary p-6 rounded-r-xl my-6 border-y border-r border-theme-border shadow-sm">
                <h4 className="font-display font-role-h3 text-theme-text mb-1">
                  The Goal of Agentic AI
                </h4>
                <p className="text-sm text-theme-text-muted mb-0 leading-relaxed">
                  To turn LLMs from conversational advisors into active, goal-driven agents. This is accomplished by providing models with <strong>Tools</strong> (external calculators, APIs, terminal access) and <strong>Context</strong> (local databases, files, documentation).
                </p>
              </div>

              <h3 className="font-display text-xl font-bold text-theme-text mt-8">
                The Legacy Problem: Integration Fragmentation
              </h3>
              <p className="leading-relaxed">
                Before the introduction of the Model Context Protocol, connecting AI models to external systems was an integration nightmare. If a developer built a specialized search tool, they had to write custom API wrappers for LangChain, custom schemas for LlamaIndex, custom formatters for Claude Desktop, and bespoke routing code for AutoGen.
              </p>
              <p className="leading-relaxed">
                Every client framework had its own way of defining tools, formatting JSON parameters, and executing callbacks. This fragmented approach meant that developers had to rewrite integration code from scratch every time they wanted to use the same tool with a different client.
              </p>

              <div 
                onClick={() => setLightboxImage({
                  src: "/images/image_1.png",
                  caption: "Figure 1.1: The Model Context Protocol (MCP) standardizes data exchange between AI Clients (hosts) and Server integrations."
                })}
                className="bg-theme-card border border-theme-border p-4 rounded-xl cursor-zoom-in group hover:border-blue-primary/45 hover:shadow-l2 transition-all my-8 overflow-hidden"
              >
                <div className="bg-theme-section flex items-center justify-center p-3 rounded-lg overflow-hidden border border-theme-border relative h-64 sm:h-80">
                  <img
                    src="/images/image_1.png"
                    alt="MCP Core Concept"
                    className="max-h-full max-w-full object-contain transition-transform group-hover:scale-[1.02] duration-300"
                  />
                  <div className="absolute inset-0 bg-slate-darkest/5 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                    <span className="bg-theme-card text-blue-primary text-xs font-bold px-3 py-1.5 rounded-lg shadow border border-theme-border">
                      {t.zoomText}
                    </span>
                  </div>
                </div>
                <div className="p-3 text-center text-xs text-theme-text-muted border-t border-theme-border mt-3">
                  Figure 1.1: Standardized session exchange layout. Click to zoom diagram.
                </div>
              </div>

              <h3 className="font-display text-xl font-bold text-theme-text mt-8">
                The MCP Solution: USB-C for AI Systems
              </h3>
              <p className="leading-relaxed">
                The <strong>Model Context Protocol (MCP)</strong> is an open-source client-server communication protocol. Instead of custom integrations, MCP defines a single standardized specification. AI client applications (like VS Code, Claude Desktop, Cursor, or your custom Python clients) establish standardized sessions with MCP Servers.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-8">
                <div className="bg-theme-card border border-theme-border p-5 rounded-xl hover:shadow-l2 transition-all">
                  <h4 className="font-display font-semibold text-theme-text mb-2">🔌 Universal Connection</h4>
                  <p className="text-xs leading-relaxed text-theme-text-muted">
                    Build a database connector or weather API once as an MCP server. Any compatible client can connect and use it immediately.
                  </p>
                </div>
                <div className="bg-theme-card border border-theme-border p-5 rounded-xl hover:shadow-l2 transition-all">
                  <h4 className="font-display font-semibold text-theme-text mb-2">🛡️ Sandboxed Safety</h4>
                  <p className="text-xs leading-relaxed text-theme-text-muted">
                    The client application acts as a secure coordinator, executing tools in isolated subprocesses and passing raw results back.
                  </p>
                </div>
                <div className="bg-theme-card border border-theme-border p-5 rounded-xl hover:shadow-l2 transition-all">
                  <h4 className="font-display font-semibold text-theme-text mb-2">⚡ Simple JSON-RPC</h4>
                  <p className="text-xs leading-relaxed text-theme-text-muted">
                    Communication is powered by standard JSON-RPC 2.0 messages, making it easy to build clients and servers in any language.
                  </p>
                </div>
              </div>

              <h3 className="font-display text-xl font-bold text-theme-text mt-8">
                History of Agentic AI Integration
              </h3>
              <div className="relative border-l border-theme-border pl-6 ml-4 space-y-8 my-8">
                <div className="relative">
                  <span className="absolute -left-[31px] top-1.5 h-2 w-2 rounded-full bg-blue-primary ring-4 ring-blue-primary/20" />
                  <h5 className="font-display text-sm font-bold text-blue-primary">Stage 1: Prompt Engineering (2022)</h5>
                  <p className="text-xs text-theme-text-muted mt-1">Manual context copy-pasting directly into prompt windows.</p>
                </div>
                <div className="relative">
                  <span className="absolute -left-[31px] top-1.5 h-2 w-2 rounded-full bg-blue-primary ring-4 ring-blue-primary/20" />
                  <h5 className="font-display text-sm font-bold text-blue-primary">Stage 2: ReAct Pattern &amp; Agents (Early 2023)</h5>
                  <p className="text-xs text-theme-text-muted mt-1">Parsing text patterns like `Action: Search[...]` to invoke custom scripts dynamically.</p>
                </div>
                <div className="relative">
                  <span className="absolute -left-[31px] top-1.5 h-2 w-2 rounded-full bg-blue-primary ring-4 ring-blue-primary/20" />
                  <h5 className="font-display text-sm font-bold text-blue-primary">Stage 3: Function Calling (Late 2023)</h5>
                  <p className="text-xs text-theme-text-muted mt-1">Fine-tuned models output structured JSON tool calls, but client integration remains custom.</p>
                </div>
                <div className="relative">
                  <span className="absolute -left-[31px] top-1.5 h-2 w-2 rounded-full bg-blue-primary ring-4 ring-blue-primary/20" />
                  <h5 className="font-display text-sm font-bold text-blue-primary">Stage 4: Standardized Protocols (Late 2024 - Present)</h5>
                  <p className="text-xs text-theme-text-muted mt-1">The Model Context Protocol unifies tools and context resources universally.</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <h2 className="font-display font-role-h2 text-theme-text border-b border-theme-border pb-2 mt-6">
                MCP के पीछे का विचार
              </h2>
              <p className="leading-relaxed">
                लार्ज लैंग्वेज मॉडल्स (LLM) खाली कमरों में बंद बेहद समझदार दिमाग की तरह होते हैं। उनके पास कोडिंग, साहित्य और विज्ञान का व्यापक आंतरिक ज्ञान है, लेकिन उनके पास भौतिक इंद्रियां और हाथ नहीं हैं। एक LLM अपने आप आपकी हार्ड ड्राइव पर टेक्स्ट फ़ाइल नहीं पढ़ सकता है, गणना नहीं कर सकता है, डेटाबेस को क्वेरी नहीं कर सकता है, या वेब अनुप्रयोगों में कार्रवाई नहीं कर सकता है।
              </p>

              <div className="bg-blue-primary/[0.03] border-l-4 border-blue-primary p-6 rounded-r-xl my-6 border-y border-r border-theme-border shadow-sm">
                <h4 className="font-display font-role-h3 text-theme-text mb-1">
                  एजेंटिक एआई का लक्ष्य
                </h4>
                <p className="text-sm text-theme-text-muted mb-0 leading-relaxed">
                  LLMs को संवादात्मक सलाहकारों से सक्रिय, लक्ष्य-संचालित एजेंटों में बदलना। यह मॉडलों को <strong>Tools</strong> (बाहरी कैलकुलेटर, एपीआई) और <strong>Context</strong> (स्थानीय डेटाबेस, फाइलें) प्रदान करके पूरा किया जाता है।
                </p>
              </div>

              <h3 className="font-display text-xl font-bold text-theme-text mt-8">
                विरासत समस्या: एकीकरण विखंडन की समस्या
              </h3>
              <p className="leading-relaxed">
                मॉडल कॉन्टेक्स्ट प्रोटोकॉल की शुरुआत से पहले, एआई मॉडल को बाहरी प्रणालियों से जोड़ना एक कठिन काम था। यदि कोई डेवलपर एक खोज टूल बनाता है, तो उसे LangChain, LlamaIndex, Claude Desktop और AutoGen के लिए अलग से एकीकरण कोड लिखना पड़ता था।
              </p>
              <p className="leading-relaxed">
                हर क्लाइंट फ्रेमवर्क का टूल को परिभाषित करने, JSON पैरामीटर स्वरूपित करने और कॉलबैक निष्पादित करने का अपना तरीका था। इस खंडित दृष्टिकोण का मतलब था कि जब भी डेवलपर एक ही टूल को अलग क्लाइंट के साथ उपयोग करना चाहते थे, तो उन्हें स्क्रैच से कोड लिखना पड़ता था।
              </p>

              <div 
                onClick={() => setLightboxImage({
                  src: "/images/image_1.png",
                  caption: "चित्र 1.1: मॉडल संदर्भ प्रोटोकॉल (MCP) एआई क्लाइंट (होस्ट) और सर्वर एकीकरण के बीच डेटा एक्सचेंज को मानकीकृत करता है।"
                })}
                className="bg-theme-card border border-theme-border p-4 rounded-xl cursor-zoom-in group hover:border-blue-primary/45 hover:shadow-l2 transition-all my-8 overflow-hidden"
              >
                <div className="bg-theme-section flex items-center justify-center p-3 rounded-lg overflow-hidden border border-theme-border relative h-64 sm:h-80">
                  <img
                    src="/images/image_1.png"
                    alt="MCP Core Concept"
                    className="max-h-full max-w-full object-contain transition-transform group-hover:scale-[1.02] duration-300"
                  />
                  <div className="absolute inset-0 bg-slate-darkest/5 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                    <span className="bg-theme-card text-blue-primary text-xs font-bold px-3 py-1.5 rounded-lg shadow border border-theme-border">
                      {t.zoomText}
                    </span>
                  </div>
                </div>
                <div className="p-3 text-center text-xs text-theme-text-muted border-t border-theme-border mt-3">
                  चित्र 1.1: मानकीकृत सत्र विनिमय लेआउट। ज़ूम करने के लिए आरेख पर क्लिक करें।
                </div>
              </div>

              <h3 className="font-display text-xl font-bold text-theme-text mt-8">
                एमसीपी समाधान: एआई सिस्टम के लिए यूएसबी-सी
              </h3>
              <p className="leading-relaxed">
                <strong>मॉडल संदर्भ प्रोटोकॉल (MCP)</strong> एक ओपन-सोर्स क्लाइंट-सर्वर संचार प्रोटोकॉल है। कस्टम एकीकरण के बजाय, MCP एक एकल मानकीकृत विनिर्देश को परिभाषित करता है। एआई क्लाइंट अनुप्रयोग (जैसे VS Code, Claude Desktop, Cursor, या आपके कस्टम पायथन क्लाइंट) MCP सर्वर के साथ मानकीकृत सत्र स्थापित करते हैं।
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-8">
                <div className="bg-theme-card border border-theme-border p-5 rounded-xl hover:shadow-l2 transition-all">
                  <h4 className="font-display font-semibold text-theme-text mb-2">🔌 सार्वभौमिक कनेक्शन</h4>
                  <p className="text-xs leading-relaxed text-theme-text-muted">
                    एक डेटाबेस कनेक्टर या मौसम एपीआई को एक बार एमसीपी सर्वर के रूप में बनाएं। कोई भी संगत क्लाइंट इसे तुरंत उपयोग कर सकता है।
                  </p>
                </div>
                <div className="bg-theme-card border border-theme-border p-5 rounded-xl hover:shadow-l2 transition-all">
                  <h4 className="font-display font-semibold text-theme-text mb-2">🛡️ सैंडबॉक्स सुरक्षा</h4>
                  <p className="text-xs leading-relaxed text-theme-text-muted">
                    क्लाइंट एप्लिकेशन सुरक्षित समन्वयक के रूप में कार्य करता है, जो अलग प्रक्रियाओं में टूल चलाता है और परिणाम वापस करता है।
                  </p>
                </div>
                <div className="bg-theme-card border border-theme-border p-5 rounded-xl hover:shadow-l2 transition-all">
                  <h4 className="font-display font-semibold text-theme-text mb-2">⚡ सरल JSON-RPC</h4>
                  <p className="text-xs leading-relaxed text-theme-text-muted">
                    संचार मानक JSON-RPC 2.0 संदेशों द्वारा संचालित होता है, जिससे किसी भी भाषा में क्लाइंट और सर्वर बनाना आसान हो जाता है।
                  </p>
                </div>
              </div>

              <h3 className="font-display text-xl font-bold text-theme-text mt-8">
                एजेंटिक एआई एकीकरण का इतिहास
              </h3>
              <div className="relative border-l border-theme-border pl-6 ml-4 space-y-8 my-8">
                <div className="relative">
                  <span className="absolute -left-[31px] top-1.5 h-2 w-2 rounded-full bg-blue-primary ring-4 ring-blue-primary/20" />
                  <h5 className="font-display text-sm font-bold text-blue-primary">चरण 1: प्रॉम्प्ट इंजीनियरिंग (2022)</h5>
                  <p className="text-xs text-theme-text-muted mt-1">प्रॉम्प्ट विंडो में सीधे संदर्भ को कॉपी-पेस्ट करना।</p>
                </div>
                <div className="relative">
                  <span className="absolute -left-[31px] top-1.5 h-2 w-2 rounded-full bg-blue-primary ring-4 ring-blue-primary/20" />
                  <h5 className="font-display text-sm font-bold text-blue-primary">चरण 2: रीएक्ट पैटर्न और एजेंट (शुरुआती 2023)</h5>
                  <p className="text-xs text-theme-text-muted mt-1">कस्टम स्क्रिप्ट को गतिशील रूप से शुरू करने के लिए `Action: Search[...]` जैसे टेक्स्ट पैटर्न का विश्लेषण।</p>
                </div>
                <div className="relative">
                  <span className="absolute -left-[31px] top-1.5 h-2 w-2 rounded-full bg-blue-primary ring-4 ring-blue-primary/20" />
                  <h5 className="font-display text-sm font-bold text-blue-primary">चरण 3: फ़ंक्शन कॉलिंग (उत्तरार्ध 2023)</h5>
                  <p className="text-xs text-theme-text-muted mt-1">मॉडल संरचित JSON टूल कॉल प्रदान करते हैं, लेकिन क्लाइंट एकीकरण कस्टम रहता है।</p>
                </div>
                <div className="relative">
                  <span className="absolute -left-[31px] top-1.5 h-2 w-2 rounded-full bg-blue-primary ring-4 ring-blue-primary/20" />
                  <h5 className="font-display text-sm font-bold text-blue-primary">चरण 4: मानकीकृत प्रोटोकॉल (उत्तरार्ध 2024 - वर्तमान)</h5>
                  <p className="text-xs text-theme-text-muted mt-1">मॉडल संदर्भ प्रोटोकॉल (MCP) सार्वभौमिक रूप से टूल और संदर्भ संसाधनों को एकीकृत करता है।</p>
                </div>
              </div>
            </div>
          )
        )}

        {slug === "02-architecture-overview" && (
          lang === "en" ? (
            <div className="space-y-6">
              <h2 className="font-display font-role-h2 text-theme-text border-b border-theme-border pb-2 mt-6">
                The Client-Host-Server Triad
              </h2>
              <p className="leading-relaxed">
                MCP breaks AI communication down into three clear roles to maintain security boundaries and allow modular integrations.
              </p>
              
              <ul className="space-y-3 list-disc list-inside leading-relaxed">
                <li><strong>The Host:</strong> The user-facing application (e.g., Claude Desktop, VS Code, Cursor) that coordinates the AI workspace and decides when it is safe to execute a tool.</li>
                <li><strong>The Client:</strong> The protocol implementation module running inside the host that manages connection channels, parses transport sockets, and translates inputs and outputs.</li>
                <li><strong>The Server:</strong> Standalone, local background scripts or remote HTTP endpoints that connect to APIs, write files, or query databases.</li>
              </ul>

              <div 
                onClick={() => setLightboxImage({
                  src: "/images/image_2.png",
                  caption: "Figure 2.1: Division of labor between Host, Client, and Server in the MCP ecosystem."
                })}
                className="bg-theme-card border border-theme-border p-4 rounded-xl cursor-zoom-in group hover:border-blue-primary/45 hover:shadow-l2 transition-all my-8 overflow-hidden"
              >
                <div className="bg-theme-section flex items-center justify-center p-3 rounded-lg overflow-hidden border border-theme-border relative h-64 sm:h-80">
                  <img
                    src="/images/image_2.png"
                    alt="Client Host Server Triad"
                    className="max-h-full max-w-full object-contain transition-transform group-hover:scale-[1.02] duration-300"
                  />
                  <div className="absolute inset-0 bg-slate-darkest/5 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                    <span className="bg-theme-card text-blue-primary text-xs font-bold px-3 py-1.5 rounded-lg shadow border border-theme-border">
                      {t.zoomText}
                    </span>
                  </div>
                </div>
                <div className="p-3 text-center text-xs text-theme-text-muted border-t border-theme-border mt-3">
                  Figure 2.1: Triad architecture. Click to zoom.
                </div>
              </div>

              <h3 className="font-display text-xl font-bold text-theme-text mt-8">
                JSON-RPC 2.0 specs
              </h3>
              <p className="leading-relaxed">
                All message exchanges between MCP clients and servers are formatted using <strong>JSON-RPC 2.0</strong>, specifying requests, responses, and notifications.
              </p>

              <h3 className="font-display text-xl font-bold text-theme-text mt-8">
                Protocol Primitives
              </h3>
              <div className="space-y-4 my-6">
                <div className="bg-theme-card border border-theme-border p-5 rounded-xl hover:shadow-l1 transition-all">
                  <h4 className="font-display text-base font-bold text-theme-text flex items-center gap-2">
                    🛠️ Tools
                  </h4>
                  <p className="text-xs text-theme-text-muted mt-2 leading-relaxed">
                    Executable functions with schemas. The LLM controls *when* and *how* to call them. FastMCP inspects parameters to auto-generate standard JSON schema constraints.
                  </p>
                </div>
                <div className="bg-theme-card border border-theme-border p-5 rounded-xl hover:shadow-l1 transition-all">
                  <h4 className="font-display text-base font-bold text-theme-text flex items-center gap-2">
                    📂 Resources
                  </h4>
                  <p className="text-xs text-theme-text-muted mt-2 leading-relaxed">
                    Read-only context data, identified using custom URI schemes (e.g. <code>inventory://{`{item_id}`}</code>). The client retains read control.
                  </p>
                </div>
                <div className="bg-theme-card border border-theme-border p-5 rounded-xl hover:shadow-l1 transition-all">
                  <h4 className="font-display text-base font-bold text-theme-text flex items-center gap-2">
                    📝 Prompts
                  </h4>
                  <p className="text-xs text-theme-text-muted mt-2 leading-relaxed">
                    Structured prompt templates and system role descriptions exposed directly by servers, facilitating complex LLM workflows.
                  </p>
                </div>
              </div>

              <h3 className="font-display text-xl font-bold text-theme-text mt-8">
                SDK Development Modes: FastMCP vs Low-Level
              </h3>
              <div className="overflow-x-auto my-6 border border-theme-border rounded-xl shadow-sm">
                <table className="min-w-full divide-y divide-theme-border bg-theme-card text-xs">
                  <thead className="bg-theme-section">
                    <tr>
                      <th className="px-4 py-3 text-left font-semibold text-theme-text">Feature</th>
                      <th className="px-4 py-3 text-left font-semibold text-theme-text">FastMCP (High-Level)</th>
                      <th className="px-4 py-3 text-left font-semibold text-theme-text">Server (Low-Level)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-theme-border">
                    <tr>
                      <td className="px-4 py-3 font-semibold text-theme-text">Complexity</td>
                      <td className="px-4 py-3 text-theme-text-muted">Decorator-driven; simple setup.</td>
                      <td className="px-4 py-3 text-theme-text-muted">Requires manual loop management.</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 font-semibold text-theme-text">Schemas</td>
                      <td className="px-4 py-3 text-theme-text-muted">Auto-parsed from type hints & docstrings.</td>
                      <td className="px-4 py-3 text-theme-text-muted">Must write raw JSON schema.</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <h2 className="font-display font-role-h2 text-theme-text border-b border-theme-border pb-2 mt-6">
                क्लाइंट-होस्ट-सर्वर तिकड़ी
              </h2>
              <p className="leading-relaxed">
                सुरक्षा सीमाओं को बनाए रखने और मॉड्यूलर एकीकरण की अनुमति देने के लिए एमसीपी संचार को तीन स्पष्ट भूमिकाओं में विभाजित करता है।
              </p>
              
              <ul className="space-y-3 list-disc list-inside leading-relaxed">
                <li><strong>होस्ट (Host):</strong> उपयोगकर्ता के अनुकूल एप्लिकेशन (जैसे, Claude Desktop, VS Code, Cursor) जो कार्यक्षेत्र का समन्वय करता है और निर्णय लेता है कि कोई टूल चलाना सुरक्षित है या नहीं।</li>
                <li><strong>क्लाइंट (Client):</strong> होस्ट के अंदर चलने वाला प्रोटोकॉल कार्यान्वयन मॉड्यूल जो कनेक्शन चैनलों का प्रबंधन करता है।</li>
                <li><strong>सर्वर (Server):</strong> स्टैंडअलोन पृष्ठभूमि स्क्रिप्ट या रिमोट एपीआई एंडपॉइंट जो डेटाबेस को क्वेरी करते हैं या फाइलें लिखते हैं।</li>
              </ul>

              <div 
                onClick={() => setLightboxImage({
                  src: "/images/image_2.png",
                  caption: "चित्र 2.1: एमसीपी पारिस्थितिकी तंत्र में होस्ट, क्लाइंट और सर्वर के बीच काम का विभाजन।"
                })}
                className="bg-theme-card border border-theme-border p-4 rounded-xl cursor-zoom-in group hover:border-blue-primary/45 hover:shadow-l2 transition-all my-8 overflow-hidden"
              >
                <div className="bg-theme-section flex items-center justify-center p-3 rounded-lg overflow-hidden border border-theme-border relative h-64 sm:h-80">
                  <img
                    src="/images/image_2.png"
                    alt="Client Host Server Triad"
                    className="max-h-full max-w-full object-contain transition-transform group-hover:scale-[1.02] duration-300"
                  />
                  <div className="absolute inset-0 bg-slate-darkest/5 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                    <span className="bg-theme-card text-blue-primary text-xs font-bold px-3 py-1.5 rounded-lg shadow border border-theme-border">
                      {t.zoomText}
                    </span>
                  </div>
                </div>
                <div className="p-3 text-center text-xs text-theme-text-muted border-t border-theme-border mt-3">
                  चित्र 2.1: तिकड़ी वास्तुकला। ज़ूम करने के लिए आरेख पर क्लिक करें।
                </div>
              </div>

              <h3 className="font-display text-xl font-bold text-theme-text mt-8">
                JSON-RPC 2.0 विनिर्देश
              </h3>
              <p className="leading-relaxed">
                क्लाइंट और सर्वर के बीच सभी संदेश विनिमय <strong>JSON-RPC 2.0</strong> नियमों के अनुसार स्वरूपित होते हैं।
              </p>

              <h3 className="font-display text-xl font-bold text-theme-text mt-8">
                प्रोटोकॉल प्रिमिटिव्स
              </h3>
              <div className="space-y-4 my-6">
                <div className="bg-theme-card border border-theme-border p-5 rounded-xl hover:shadow-l1 transition-all">
                  <h4 className="font-display text-base font-bold text-theme-text flex items-center gap-2">
                    🛠️ टूल्स (Tools)
                  </h4>
                  <p className="text-xs text-theme-text-muted mt-2 leading-relaxed">
                    स्कीमा के साथ निष्पादन योग्य फ़ंक्शन। एलएलएम तय करता है कि उन्हें कब और कैसे कॉल करना है। FastMCP स्वचालित रूप से JSON स्कीमा सीमाएं उत्पन्न करता है।
                  </p>
                </div>
                <div className="bg-theme-card border border-theme-border p-5 rounded-xl hover:shadow-l1 transition-all">
                  <h4 className="font-display text-base font-bold text-theme-text flex items-center gap-2">
                    📂 संसाधन (Resources)
                  </h4>
                  <p className="text-xs text-theme-text-muted mt-2 leading-relaxed">
                    केवल-पठनीय डेटा, जिसे कस्टम URI योजना (जैसे <code>inventory://{`{item_id}`}</code>) का उपयोग करके पहचाना जाता है।
                  </p>
                </div>
                <div className="bg-theme-card border border-theme-border p-5 rounded-xl hover:shadow-l1 transition-all">
                  <h4 className="font-display text-base font-bold text-theme-text flex items-center gap-2">
                    📝 संकेत (Prompts)
                  </h4>
                  <p className="text-xs text-theme-text-muted mt-2 leading-relaxed">
                    सर्वर द्वारा सीधे प्रदर्शित संरचित प्रॉम्प्ट टेम्प्लेट और सिस्टम भूमिकाएं, जो जटिल वर्कफ़्लो को आसान बनाती हैं।
                  </p>
                </div>
              </div>

              <h3 className="font-display text-xl font-bold text-theme-text mt-8">
                एसडीके डेवलपमेंट मोड: FastMCP बनाम लो-लेवल
              </h3>
              <div className="overflow-x-auto my-6 border border-theme-border rounded-xl shadow-sm">
                <table className="min-w-full divide-y divide-theme-border bg-theme-card text-xs">
                  <thead className="bg-theme-section">
                    <tr>
                      <th className="px-4 py-3 text-left font-semibold text-theme-text">सुविधा</th>
                      <th className="px-4 py-3 text-left font-semibold text-theme-text">FastMCP (उच्च-स्तरीय)</th>
                      <th className="px-4 py-3 text-left font-semibold text-theme-text">सर्वर (निम्न-स्तरीय)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-theme-border">
                    <tr>
                      <td className="px-4 py-3 font-semibold text-theme-text">जटिलता</td>
                      <td className="px-4 py-3 text-theme-text-muted">डेकोरेटर द्वारा संचालित; सरल सेटअप।</td>
                      <td className="px-4 py-3 text-theme-text-muted">मैनुअल इवेंट लूप प्रबंधन की आवश्यकता।</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 font-semibold text-theme-text">स्कीमा</td>
                      <td className="px-4 py-3 text-theme-text-muted">टाइप हिंट और डॉकस्ट्रिंग से स्वतः पार्स।</td>
                      <td className="px-4 py-3 text-theme-text-muted">मैन्युअल रूप से स्कीमा लिखना पड़ता है।</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )
        )}

        {slug !== "01-introduction" && slug !== "02-architecture-overview" && (
          <div className="space-y-6">
            <h2 className="font-display font-role-h2 text-theme-text border-b border-theme-border pb-2 mt-6">
              {t.labInstructionsTitle}
            </h2>
            <p className="leading-relaxed">
              This chapter represents a hands-on python development section in the course. Inside the local workspace directory, you will find ready-to-run files and exercise scripts.
            </p>

            <div className="bg-theme-card border border-theme-border p-6 rounded-xl my-6 shadow-sm">
              <h4 className="font-display font-semibold text-theme-text text-sm mb-2">{t.labFilesTitle}</h4>
              <p className="text-xs text-theme-text-muted leading-relaxed">
                {t.labFilesDesc}
              </p>
            </div>

            <h3 className="font-display text-xl font-bold text-theme-text mt-8">{t.labInstructionsTitle}</h3>
            <p className="leading-relaxed">
              {t.labInstructionsDesc}
            </p>

            <pre className="p-4 rounded-xl text-xs font-mono text-theme-text overflow-x-auto my-6 bg-theme-section border border-theme-border shadow-inner">
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
        <section className="mt-16 border-t border-theme-border pt-12">
          <div className="bg-theme-card border border-theme-border p-6 sm:p-8 rounded-xl shadow-l3">
            <div className="flex items-center gap-3 mb-6">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-primary/10 text-xs font-bold text-blue-primary border border-blue-primary/20">
                📝
              </span>
              <div>
                <h3 className="font-display text-lg sm:text-xl font-bold text-theme-text">
                  {t.assessmentTitle}
                </h3>
                <p className="text-xs text-theme-text-muted mt-0.5">
                  {t.assessmentDesc}
                </p>
              </div>
            </div>

            <div className="space-y-8">
              {activeQuiz.map((q, qIdx) => (
                <div key={q.id} className="space-y-3">
                  <h4 className="font-display text-sm sm:text-base font-semibold text-theme-text">
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
                          buttonClass += "bg-blue-primary/5 border-blue-primary text-theme-text font-semibold shadow-sm";
                        } else {
                          buttonClass += "bg-theme-card border-theme-border hover:bg-theme-section hover:border-theme-text-muted text-theme-text-muted";
                        }
                      } else {
                        if (isCorrect) {
                          buttonClass += "bg-emerald-50 dark:bg-emerald-500/10 border-success-green text-success-green font-semibold";
                        } else if (isWrongSelection) {
                          buttonClass += "bg-red-50 dark:bg-red-500/10 border-red-vivid text-red-vivid font-semibold";
                        } else {
                          buttonClass += "bg-theme-card border-theme-border opacity-55 text-theme-text-muted cursor-not-allowed";
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
                                : "border-theme-border bg-theme-bg text-theme-text-muted"
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
                    <div className="p-4 rounded-xl bg-theme-section border border-theme-border text-xs leading-relaxed mt-2 text-theme-text-muted">
                      <strong className="text-theme-text block mb-1">{t.explanationHeader}</strong>
                      {q.explanation}
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="mt-8 flex items-center justify-between border-t border-theme-border pt-6 gap-4">
              {quizSubmitted ? (
                <div className="text-xs sm:text-sm">
                  {quizCorrectCount === activeQuiz.length ? (
                    <span className="text-success-green font-semibold">{t.scorePerfect}</span>
                  ) : (
                    <span className="text-theme-text-muted">
                      {lang === "en" ? `Score: ` : `स्कोर: `}
                      <strong className="text-theme-text">{quizCorrectCount}/{activeQuiz.length}</strong>.
                      {lang === "en" ? " Try again by resetting." : " रीसेट करके पुनः प्रयास करें।"}
                    </span>
                  )}
                </div>
              ) : (
                <div className="text-xs text-theme-text-muted">
                  {t.selectionsText}
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
                    {t.resetBtn}
                  </button>
                )}
                <button
                  onClick={handleSubmitQuiz}
                  className="btn-primary h-9 py-1 px-4 text-xs disabled:opacity-40 disabled:cursor-not-allowed"
                  disabled={quizSubmitted || Object.keys(selectedAnswers).length < activeQuiz.length}
                >
                  {t.submitBtn}
                </button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Lesson Navigation Footer */}
      <footer className="mt-16 border-t border-theme-border pt-8 flex items-center justify-between gap-4 pb-8">
        {prevLesson ? (
          <Link
            href={`/lessons/${prevLesson.slug}`}
            className="flex flex-col text-left group max-w-[45%]"
          >
            <span className="text-[10px] uppercase tracking-wider text-theme-text-muted">{t.prevChapter}</span>
            <span className="text-xs sm:text-sm font-semibold text-theme-text group-hover:text-blue-primary truncate mt-1 transition-colors">
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
            <span className="text-[10px] uppercase tracking-wider text-theme-text-muted">{t.nextChapter}</span>
            <span className="text-xs sm:text-sm font-semibold text-theme-text group-hover:text-blue-primary truncate mt-1 transition-colors">
              {nextLesson.title} →
            </span>
          </Link>
        ) : (
          <Link
            href="/"
            className="flex flex-col text-right group max-w-[45%] items-end"
          >
            <span className="text-[10px] uppercase tracking-wider text-theme-text-muted">{t.finishCourse}</span>
            <span className="text-xs sm:text-sm font-semibold text-theme-text group-hover:text-blue-primary truncate mt-1 transition-colors">
              {t.dashboardBtn} →
            </span>
          </Link>
        )}
      </footer>

      {/* Lightbox Overlay Modal */}
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
            <div className="border border-theme-border rounded-2xl overflow-hidden bg-theme-card p-6 sm:p-10 flex items-center justify-center shadow-2xl">
              <img
                src={lightboxImage.src}
                alt={lightboxImage.caption}
                className="max-h-[70vh] max-w-full object-contain"
              />
            </div>
            <p className="text-xs sm:text-sm text-theme-text bg-theme-card px-5 py-2.5 rounded-full border border-theme-border max-w-2xl text-center shadow-lg font-semibold">
              {t.lightboxCaptionPrefix} {lightboxImage.caption}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
