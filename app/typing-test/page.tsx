"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { 
  Timer, Gauge, Target, RotateCcw, CheckCircle,
  ArrowRight, Keyboard, Sparkles, Brain, Zap,
  ChevronRight, Play, Save, X, Settings, BookOpen,
  Clock, SlidersHorizontal, TrendingUp, Activity,
  BarChart3, Hand, Type, AlertTriangle, Lock
} from "lucide-react";
import { VirtualKeyboard } from "@/components/typing/VirtualKeyboard";
import { analyzeDetailedPerformance } from "@/lib/performanceAnalyzer";
import type { KeystrokeEvent, DetailedPerformance, AICoachResponse } from "@/types/performance";

const CATEGORIES = [
  { value: "all", label: "All Categories" },
  { value: "general", label: "General" },
  { value: "books", label: "Books" },
  { value: "poems", label: "Poems" },
  { value: "quotes", label: "Quotes" },
  { value: "code", label: "Code" },
  { value: "science", label: "Science" },
  { value: "history", label: "History" },
  { value: "technology", label: "Technology" },
  { value: "movies", label: "Movies" },
  { value: "sports", label: "Sports" },
];

const TIME_OPTIONS = [
  { value: 15, label: "15 sec" },
  { value: 30, label: "30 sec" },
  { value: 60, label: "1 min" },
  { value: 120, label: "2 min" },
  { value: 300, label: "5 min" },
  { value: 600, label: "10 min" },
];

const DIFFICULTIES = [
  { value: "all", label: "All" },
  { value: "easy", label: "Easy" },
  { value: "medium", label: "Medium" },
  { value: "hard", label: "Hard" },
];

const FALLBACK_PASSAGES = [
  "The quick brown fox jumps over the lazy dog. Programming is the art of telling another human what one wants the computer to do. Good code is like a good joke — it needs no explanation. Innovation distinguishes between a leader and a follower. The real problem is not whether machines think but whether men do. Any sufficiently advanced technology is indistinguishable from magic. In the middle of difficulty lies opportunity. The only way to do great work is to love what you do. Technology is best when it brings people together. Pack my box with five dozen liquor jugs. How vexingly quick daft zebras jump! Sphinx of black quartz, judge my vow. Two driven jocks help fax my big quiz. The five boxing wizards jump quickly. Jackdaws love my big sphinx of quartz. Show me a hero and I will write you a tragedy. The only impossible journey is the one you never begin. Life is what happens when you're busy making other plans. The future belongs to those who believe in the beauty of their dreams. It is during our darkest moments that we must focus to see the light.",
  "Technology is best when it brings people together. The real problem is not whether machines think but whether men do. Any sufficiently advanced technology is indistinguishable from magic. The quick brown fox jumps over the lazy dog. Programming is the art of telling another human what one wants the computer to do. Good code is like a good joke — it needs no explanation. Innovation distinguishes between a leader and a follower. In the middle of difficulty lies opportunity. The only way to do great work is to love what you do. Pack my box with five dozen liquor jugs. How vexingly quick daft zebras jump! Sphinx of black quartz, judge my vow. Two driven jocks help fax my big quiz. The five boxing wizards jump quickly. Jackdaws love my big sphinx of quartz. Show me a hero and I will write you a tragedy. The only impossible journey is the one you never begin. Life is what happens when you're busy making other plans. The future belongs to those who believe in the beauty of their dreams. It is during our darkest moments that we must focus to see the light. The greatest glory in living lies not in never falling, but in rising every time we fall.",
];

export default function TypingTestPage() {
  const { data: session } = useSession();

  // Settings state
  const [duration, setDuration] = useState(60);
  const [category, setCategory] = useState("all");
  const [difficulty, setDifficulty] = useState("all");
  const [showSettings, setShowSettings] = useState(false);
  const [isLoadingPassage, setIsLoadingPassage] = useState(false);

  // AI Passage Modal state
  const [showAiModal, setShowAiModal] = useState(false);
  const [aiCategory, setAiCategory] = useState("general");
  const [aiDifficulty, setAiDifficulty] = useState("medium");
  const [aiDuration, setAiDuration] = useState(300);
  const [isAiGenerating, setIsAiGenerating] = useState(false);

  // Test state
  const [text, setText] = useState(FALLBACK_PASSAGES[0]);
  const [input, setInput] = useState("");
  const [isActive, setIsActive] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const [wpm, setWpm] = useState(0);
  const [accuracy, setAccuracy] = useState(100);
  const [errors, setErrors] = useState(0);
  const [backspaces, setBackspaces] = useState(0);
  const [currentKey, setCurrentKey] = useState("");

  // Detailed tracking
  const [keystrokes, setKeystrokes] = useState<KeystrokeEvent[]>([]);
  const [startTime, setStartTime] = useState<number>(0);

  // AI Coach state
  const [detailedPerf, setDetailedPerf] = useState<DetailedPerformance | null>(null);
  const [aiAdvice, setAiAdvice] = useState<AICoachResponse | null>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [showAiPanel, setShowAiPanel] = useState(false);

  // Scroll state for 4-line display
  const [scrollOffset, setScrollOffset] = useState(0);
  const textContainerRef = useRef<HTMLDivElement>(null);

  const inputRef = useRef<HTMLTextAreaElement>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Fetch passage from database
  const fetchPassage = async () => {
    setIsLoadingPassage(true);
    try {
      const params = new URLSearchParams();
      if (category !== "all") params.append("category", category);
      if (difficulty !== "all") params.append("difficulty", difficulty);
      params.append("limit", "50");

      const res = await fetch(`/api/passages?${params.toString()}`);
      const data = await res.json();

      if (data.passages && data.passages.length > 0) {
        const randomPassage = data.passages[Math.floor(Math.random() * data.passages.length)];
        setText(randomPassage.content);
      } else {
        setText(FALLBACK_PASSAGES[Math.floor(Math.random() * FALLBACK_PASSAGES.length)]);
      }
    } catch (error) {
      console.error("Failed to fetch passage:", error);
      setText(FALLBACK_PASSAGES[Math.floor(Math.random() * FALLBACK_PASSAGES.length)]);
    } finally {
      setIsLoadingPassage(false);
    }
  };

  // Generate AI passage with settings
  const generateAiPassage = async () => {
    setIsAiGenerating(true);
    try {
      const res = await fetch("/api/passages/quick-generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          category: aiCategory,
          difficulty: aiDifficulty,
          wordCount: aiDuration <= 30 ? 80 : aiDuration <= 120 ? 150 : aiDuration <= 300 ? 300 : 500,
        }),
      });

      const data = await res.json();
      if (data.content) {
        setText(data.content);
        setShowAiModal(false);
      }
    } catch (error) {
      console.error("AI passage generation failed:", error);
    } finally {
      setIsAiGenerating(false);
    }
  };

  // Load passage on mount and when category/difficulty changes
  useEffect(() => {
    fetchPassage();
  }, [category, difficulty]);

  // Update timer when duration changes
  useEffect(() => {
    if (!isActive && !isFinished) {
      setTimeLeft(duration);
    }
  }, [duration, isActive, isFinished]);

  // Scroll text as user types
  useEffect(() => {
    if (textContainerRef.current && input.length > 0) {
      const charsPerLine = 60; // Approximate chars per line
      const linesTyped = Math.floor(input.length / charsPerLine);
      if (linesTyped > 2) {
        setScrollOffset((linesTyped - 2) * 2.5); // rem units
      } else {
        setScrollOffset(0);
      }
    }
  }, [input.length]);

  const startTest = useCallback(() => {
    if (!isActive && !isFinished) {
      setIsActive(true);
      setStartTime(Date.now());
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            finishTest();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
  }, [isActive, isFinished]);

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    const now = Date.now();

    if (isFinished) return;

    if (!isActive && value.length > 0) {
      startTest();
    }

    // Track keystrokes
    if (value.length > input.length) {
      const newChar = value[value.length - 1];
      const targetChar = text[value.length - 1] || "";
      const isCorrect = newChar === targetChar;

      setKeystrokes((prev) => [...prev, {
        key: newChar,
        timestamp: now,
        correct: isCorrect,
        isBackspace: false,
        targetChar,
        charIndex: value.length - 1,
      }]);
    }

    if (value.length < input.length) {
      setBackspaces((prev) => prev + 1);
      setKeystrokes((prev) => [...prev, {
        key: "Backspace",
        timestamp: now,
        correct: false,
        isBackspace: true,
        targetChar: "",
        charIndex: value.length,
      }]);
    }

    setInput(value);

    // Calculate stats
    let errorCount = 0;
    for (let i = 0; i < value.length; i++) {
      if (value[i] !== text[i]) errorCount++;
    }
    setErrors(errorCount);

    const totalChars = value.length;
    const acc = totalChars === 0 ? 100 : Math.round(((totalChars - errorCount) / totalChars) * 1000) / 10;
    setAccuracy(acc);

    const elapsed = now - startTime;
    if (elapsed > 0 && isActive) {
      const minutes = elapsed / 60000;
      const grossWPM = (totalChars / 5) / minutes;
      const netWPM = Math.max(0, Math.round(grossWPM - (errorCount / minutes)));
      setWpm(netWPM);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    setCurrentKey(e.key);
    setTimeout(() => setCurrentKey(""), 150);
  };

  const finishTest = useCallback(() => {
    setIsFinished(true);
    setIsActive(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const analyzePerformance = async () => {
    if (keystrokes.length === 0) return;

    const actualDuration = startTime > 0 ? Math.round((Date.now() - startTime) / 1000) : duration;
    
    // FIX: Passing the expected stats object instead of just the number
    const perf = analyzeDetailedPerformance(keystrokes, text, input, actualDuration, {
      prevWpm: 0,
      prevAccuracy: 0,
      prevConsistency: 0,
      prevErrorRate: 0
    });
    
    setDetailedPerf(perf);
  };

  const getAiAdvice = async () => {
    if (!detailedPerf) {
      console.log("[AI Coach] No detailedPerf available, cannot get advice");
      return;
    }
    setIsAiLoading(true);
    setAiAdvice(null);
    console.log("[AI Coach] Starting AI analysis...");
    console.log("[AI Coach] Performance data:", detailedPerf);

    try {
      const payload = {
        ...detailedPerf,
        duration: startTime > 0 ? Math.round((Date.now() - startTime) / 1000) : duration,
        targetText: text,
        difficulty: difficulty === "all" ? "medium" : difficulty,
      };
      console.log("[AI Coach] Sending payload:", payload);

      const res = await fetch("/api/ai-coach", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      console.log("[AI Coach] Response status:", res.status);

      if (!res.ok) {
        const errorText = await res.text();
        console.error("[AI Coach] API error:", errorText);
        throw new Error(`Failed to get AI advice: ${res.status}`);
      }

      const data = await res.json();
      console.log("[AI Coach] Received advice:", data);

      if (data.summary || data.feedback) {
        setAiAdvice(data);
        setShowAiPanel(true);
      } else {
        console.warn("[AI Coach] Response missing summary/feedback:", data);
        setAiAdvice({
          summary: "AI analysis complete but no detailed feedback was returned.",
          tips: ["Try again later", "Check your connection"],
          focusArea: "general",
          focusDescription: "General practice recommended.",
          exerciseDescription: "Practice with a standard passage.",
          exerciseContent: "The quick brown fox jumps over the lazy dog.",
          exerciseTitle: "General Practice",
        });
        setShowAiPanel(true);
      }
    } catch (err) {
      console.error("[AI Coach] Error:", err);
      setAiAdvice({
        summary: "Sorry, I couldn't analyze your performance right now. Please try again.",
        tips: ["Check your internet connection", "Try again in a moment", "Make sure the AI service is running"],
        focusArea: "general",
        focusDescription: "Unable to generate personalized advice.",
        exerciseDescription: "Practice with a standard passage.",
        exerciseContent: "The quick brown fox jumps over the lazy dog.",
        exerciseTitle: "General Practice",
      });
      setShowAiPanel(true);
    } finally {
      setIsAiLoading(false);
      console.log("[AI Coach] Analysis complete.");
    }
  };

  const usePersonalizedExercise = () => {
    if (aiAdvice?.exerciseContent) {
      setText(aiAdvice.exerciseContent);
      setShowAiPanel(false);
      resetTest(aiAdvice.exerciseContent);
    }
  };

  const resetTest = (newText?: string) => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setInput("");
    setIsActive(false);
    setIsFinished(false);
    setTimeLeft(duration);
    setWpm(0);
    setAccuracy(100);
    setErrors(0);
    setBackspaces(0);
    setCurrentKey("");
    setKeystrokes([]);
    setStartTime(0);
    setDetailedPerf(null);
    setAiAdvice(null);
    setShowAiPanel(false);
    setScrollOffset(0);

    if (newText) {
      setText(newText);
    } else {
      fetchPassage();
    }

    inputRef.current?.focus();
  };

  // Auto-analyze when test finishes
  useEffect(() => {
    if (isFinished && keystrokes.length > 0 && !detailedPerf) {
      analyzePerformance();
    }
  }, [isFinished]);

  // Render text for 4-line display
  const renderTextLines = () => {
    return text.split("").map((char, index) => {
      let className = "text-slate-500";
      if (index < input.length) {
        className = input[index] === char ? "text-emerald-400" : "text-red-400 bg-red-500/10 rounded";
      } else if (index === input.length) {
        className = "bg-brand-500/20 text-brand-400 rounded";
      }
      return (
        <span key={index} className={className}>
          {char}
        </span>
      );
    });
  };

  // Detect weak keys
  const getWeakKeys = () => {
    const weak = new Set<string>();
    for (let i = 0; i < Math.min(input.length, text.length); i++) {
      if (input[i] !== text[i]) {
        weak.add(text[i].toLowerCase());
      }
    }
    return Array.from(weak).slice(0, 5);
  };

  if (isFinished) {
    return (
      <div className="min-h-screen pt-24 pb-12 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-sm font-medium mb-4">
              <CheckCircle className="w-4 h-4" />
              Test Complete
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold">Your Results</h1>
            <p className="text-slate-400 mt-2">
              {Math.round((Date.now() - startTime) / 1000)}s elapsed • {difficulty !== "all" ? difficulty : "mixed"} difficulty • {category !== "all" ? category : "all categories"}
            </p>
            <p className="text-slate-500 text-sm mt-1">
              {input.length} of {text.length} characters typed ({Math.round((input.length / text.length) * 100)}%)
            </p>
          </div>

          {/* Main Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800 text-center">
              <div className="text-4xl font-bold text-brand-400 mb-1">{wpm}</div>
              <div className="text-sm text-slate-500">WPM</div>
            </div>
            <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800 text-center">
              <div className="text-4xl font-bold text-green-400 mb-1">{accuracy}%</div>
              <div className="text-sm text-slate-500">Accuracy</div>
            </div>
            <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800 text-center">
              <div className="text-4xl font-bold text-red-400 mb-1">{errors}</div>
              <div className="text-sm text-slate-500">Errors</div>
            </div>
            <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800 text-center">
              <div className="text-4xl font-bold text-accent-400 mb-1">{backspaces}</div>
              <div className="text-sm text-slate-500">Backspaces</div>
            </div>
          </div>

          {/* Detailed Performance Metrics */}
          {detailedPerf && (
            <div className="mb-8">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-brand-400" />
                Detailed Performance Analysis
              </h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Speed Card */}
                <div className="bg-slate-900 rounded-2xl p-5 border border-slate-800">
                  <div className="flex items-center gap-2 mb-4">
                    <TrendingUp className="w-5 h-5 text-brand-400" />
                    <h3 className="font-semibold text-brand-400">Speed</h3>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Average</span>
                      <span className="font-mono font-bold">{detailedPerf.speed.averageWpm.toFixed(1)} WPM</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Peak</span>
                      <span className="font-mono font-bold">{detailedPerf.speed.peakWpm.toFixed(1)} WPM</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Raw</span>
                      <span className="font-mono font-bold">{detailedPerf.speed.rawWpm.toFixed(1)} WPM</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Consistency</span>
                      <span className="font-mono font-bold">{detailedPerf.speed.consistency.toFixed(1)}%</span>
                    </div>
                  </div>
                </div>

                {/* Rhythm Card */}
                <div className="bg-slate-900 rounded-2xl p-5 border border-slate-800">
                  <div className="flex items-center gap-2 mb-4">
                    <Activity className="w-5 h-5 text-purple-400" />
                    <h3 className="font-semibold text-purple-400">Rhythm</h3>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Avg Interval</span>
                      <span className="font-mono font-bold">{detailedPerf.rhythm.avgKeystrokeInterval.toFixed(1)}ms</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Variability</span>
                      <span className="font-mono font-bold">{detailedPerf.rhythm.keystrokeIntervalVariability.toFixed(1)}ms</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Consistency</span>
                      <span className="font-mono font-bold">{detailedPerf.rhythm.consistency.toFixed(1)}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Long Pauses</span>
                      <span className="font-mono font-bold">{detailedPerf.rhythm.longPauses}</span>
                    </div>
                  </div>
                </div>

                {/* Errors Card */}
                <div className="bg-slate-900 rounded-2xl p-5 border border-slate-800">
                  <div className="flex items-center gap-2 mb-4">
                    <AlertTriangle className="w-5 h-5 text-red-400" />
                    <h3 className="font-semibold text-red-400">Errors</h3>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Total</span>
                      <span className="font-mono font-bold">{detailedPerf.errors.totalErrors}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Substitutions</span>
                      <span className="font-mono font-bold">{detailedPerf.errors.substitutions}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Spacing</span>
                      <span className="font-mono font-bold">{detailedPerf.errors.spacingErrors}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Capitalization</span>
                      <span className="font-mono font-bold">{detailedPerf.errors.capitalizationErrors}</span>
                    </div>
                  </div>
                </div>

                {/* Hand Balance Card */}
                <div className="bg-slate-900 rounded-2xl p-5 border border-slate-800">
                  <div className="flex items-center gap-2 mb-4">
                    <Hand className="w-5 h-5 text-orange-400" />
                    <h3 className="font-semibold text-orange-400">Hand Balance</h3>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Left Acc</span>
                      <span className="font-mono font-bold">{detailedPerf.hands.left.accuracy.toFixed(1)}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Left Speed</span>
                      <span className="font-mono font-bold">{detailedPerf.hands.left.speed.toFixed(1)} WPM</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Right Acc</span>
                      <span className="font-mono font-bold">{detailedPerf.hands.right.accuracy.toFixed(1)}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Right Speed</span>
                      <span className="font-mono font-bold">{detailedPerf.hands.right.speed.toFixed(1)} WPM</span>
                    </div>
                  </div>
                </div>

                {/* Correction Card */}
                <div className="bg-slate-900 rounded-2xl p-5 border border-slate-800">
                  <div className="flex items-center gap-2 mb-4">
                    <RotateCcw className="w-5 h-5 text-yellow-400" />
                    <h3 className="font-semibold text-yellow-400">Correction</h3>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Rate</span>
                      <span className="font-mono font-bold">{detailedPerf.correction.correctionRate.toFixed(1)}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Avg Time</span>
                      <span className="font-mono font-bold">{detailedPerf.correction.avgCorrectionTime.toFixed(1)}ms</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Backspaces</span>
                      <span className="font-mono font-bold">{detailedPerf.correction.totalBackspaces}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Backspace Rate</span>
                      <span className="font-mono font-bold">{detailedPerf.correction.backspaceRate.toFixed(1)}%</span>
                    </div>
                  </div>
                </div>

                {/* Speed-Accuracy Card */}
                <div className="bg-slate-900 rounded-2xl p-5 border border-slate-800">
                  <div className="flex items-center gap-2 mb-4">
                    <Gauge className="w-5 h-5 text-green-400" />
                    <h3 className="font-semibold text-green-400">Speed-Accuracy</h3>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Acc at Avg</span>
                      <span className="font-mono font-bold">{detailedPerf.speedAccuracy.accuracyAtAverageSpeed.toFixed(1)}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Speed at 90%</span>
                      <span className="font-mono font-bold">{detailedPerf.speedAccuracy.speedAt90Accuracy.toFixed(1)} WPM</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Speed at 95%</span>
                      <span className="font-mono font-bold">{detailedPerf.speedAccuracy.speedAt95Accuracy.toFixed(1)} WPM</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">WPM Change</span>
                      <span className={`font-mono font-bold ${detailedPerf.trend.wpmChange >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {detailedPerf.trend.wpmChange >= 0 ? '+' : ''}{detailedPerf.trend.wpmChange.toFixed(1)}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* AI Coach Panel - ONLY for logged in users */}
          {session?.user && detailedPerf && !showAiPanel && (
            <div className="text-center mb-8">
              <button
                onClick={getAiAdvice}
                disabled={isAiLoading}
                className="px-8 py-4 rounded-xl bg-gradient-to-r from-brand-600 to-accent-500 hover:from-brand-500 hover:to-accent-400 text-white font-semibold transition-all hover:shadow-xl hover:shadow-brand-500/25 flex items-center gap-3 mx-auto disabled:opacity-50"
              >
                <Sparkles className="w-5 h-5" />
                {isAiLoading ? "Analyzing..." : "Get AI Personalized Advice"}
              </button>
            </div>
          )}

          {/* Not logged in message */}
          {!session?.user && detailedPerf && (
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-800 border border-slate-700 text-slate-400">
                <Lock className="w-4 h-4" />
                <span className="text-sm">Sign in to get AI Personalized Advice</span>
              </div>
            </div>
          )}

          {/* AI Advice Panel */}
          {showAiPanel && aiAdvice && (
            <div className="bg-gradient-to-br from-brand-900/50 to-slate-900 rounded-2xl p-8 border border-brand-500/20 mb-8 animate-fade-in">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-brand-500 to-accent-500 flex items-center justify-center flex-shrink-0">
                  <Brain className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-bold text-lg">AI Coach Feedback</h3>
                    <button 
                      onClick={() => setShowAiPanel(false)}
                      className="text-slate-500 hover:text-white transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  {aiAdvice.summary && (
                    <p className="text-slate-300 leading-relaxed mb-4">{aiAdvice.summary}</p>
                  )}

                  {aiAdvice.focusArea && (
                    <div className="bg-slate-800/50 rounded-xl p-4 mb-4">
                      <span className="font-semibold text-yellow-400">Focus Area: {aiAdvice.focusArea}</span>
                      {aiAdvice.focusDescription && (
                        <p className="text-slate-300 text-sm mt-1">{aiAdvice.focusDescription}</p>
                      )}
                    </div>
                  )}

                  {aiAdvice.tips && aiAdvice.tips.length > 0 && (
                    <div className="space-y-2 mb-6">
                      <h4 className="font-semibold text-sm text-slate-400 uppercase tracking-wider mb-2">Tips</h4>
                      {aiAdvice.tips.map((tip, i) => (
                        <div key={i} className="flex items-start gap-2">
                          <Zap className="w-4 h-4 text-brand-400 mt-0.5 flex-shrink-0" />
                          <p className="text-slate-300 text-sm">{tip}</p>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Personalized Exercise */}
                  {aiAdvice.exerciseContent && (
                    <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
                      {aiAdvice.exerciseTitle && (
                        <div className="flex items-center gap-2 mb-3">
                          <Target className="w-5 h-5 text-accent-400" />
                          <h4 className="font-bold text-lg">{aiAdvice.exerciseTitle}</h4>
                        </div>
                      )}
                      {aiAdvice.exerciseDescription && (
                        <p className="text-slate-300 text-sm mb-4">{aiAdvice.exerciseDescription}</p>
                      )}
                      <div className="bg-slate-900 rounded-lg p-4 font-mono text-sm text-slate-400 mb-4 border border-slate-700 max-h-32 overflow-y-auto">
                        {aiAdvice.exerciseContent}
                      </div>
                      <button
                        onClick={usePersonalizedExercise}
                        className="w-full px-6 py-3 rounded-xl bg-accent-600 hover:bg-accent-500 text-white font-semibold transition-all flex items-center justify-center gap-2"
                      >
                        <Play className="w-4 h-4" />
                        Practice This Exercise
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button 
              onClick={() => resetTest()}
              className="px-8 py-4 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-semibold transition-all flex items-center justify-center gap-2"
            >
              <RotateCcw className="w-5 h-5" />
              New Test
            </button>
            <button 
              onClick={() => setShowSettings(true)}
              className="px-8 py-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold transition-all flex items-center justify-center gap-2"
            >
              <SlidersHorizontal className="w-5 h-5" />
              Change Settings
            </button>
            <Link 
              href="/dashboard"
              className="px-8 py-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold transition-all flex items-center justify-center gap-2"
            >
              <Gauge className="w-5 h-5" />
              View Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-12 px-6">
      <div className="max-w-4xl mx-auto">
        {/* Header - Centered Title, Metrics & Options side by side */}
        <div className="flex flex-col items-center mb-8 gap-6">
          {/* Title centered */}
          <div className="text-center">
            <h1 className="text-2xl font-bold">Typing Test</h1>
            <p className="text-slate-400 text-sm mt-1">
              Type as much as you can before time runs out.
            </p>
          </div>

          {/* Two groups side by side */}
          <div className="flex flex-col sm:flex-row items-center justify-between w-full gap-4">
            {/* Left: Metrics */}
            <div className="flex items-center gap-3">
              <div className="text-center px-4 py-2 bg-slate-800 rounded-lg">
                <div className="text-xs text-slate-500 uppercase tracking-wider">Time</div>
                <div className="text-2xl font-mono font-bold text-brand-400">{timeLeft}</div>
              </div>
              <div className="text-center px-4 py-2 bg-slate-800 rounded-lg">
                <div className="text-xs text-slate-500 uppercase tracking-wider">WPM</div>
                <div className="text-2xl font-mono font-bold text-white">{wpm || 0}</div>
              </div>
              <div className="text-center px-4 py-2 bg-slate-800 rounded-lg">
                <div className="text-xs text-slate-500 uppercase tracking-wider">Accuracy</div>
                <div className="text-2xl font-mono font-bold text-green-400">{accuracy || 100}%</div>
              </div>
            </div>

            {/* Right: Options */}
            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={() => setShowSettings(!showSettings)}
                className={`px-4 py-2 rounded-lg border transition-all flex items-center gap-2 ${
                  showSettings 
                    ? "bg-brand-600 border-brand-500 text-white" 
                    : "border-slate-700 hover:border-slate-500 text-slate-300"
                }`}
              >
                <Settings className="w-4 h-4" />
                Settings
              </button>

              <button
                onClick={() => {
                  setShowSettings(false);
                  fetchPassage();
                }}
                disabled={isLoadingPassage || isAiGenerating}
                className="px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-sm font-medium transition-all flex items-center gap-2 disabled:opacity-50"
              >
                <RotateCcw className="w-4 h-4" />
                {isLoadingPassage ? "Loading..." : "New Passage"}
              </button>

              <button
                onClick={() => {
                  setShowAiModal(true);
                  setShowSettings(false);
                }}
                disabled={isAiGenerating || isLoadingPassage}
                className="px-4 py-2 rounded-lg bg-gradient-to-r from-brand-600 to-accent-500 hover:from-brand-500 hover:to-accent-400 text-white text-sm font-medium transition-all flex items-center gap-2 disabled:opacity-50"
              >
                <Sparkles className="w-4 h-4" />
                AI Passage
              </button>
            </div>
          </div>
        </div>

        {/* Settings Panel */}
        {showSettings && (
          <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800 mb-8">
            <div className="flex items-center gap-2 mb-6">
              <SlidersHorizontal className="w-5 h-5 text-brand-400" />
              <h3 className="font-semibold">Test Settings</h3>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {/* Time Duration */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-3">
                  <Clock className="w-4 h-4 text-brand-400" />
                  Duration
                </label>
                <div className="flex flex-wrap gap-2">
                  {TIME_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => {
                        setDuration(opt.value);
                        setTimeLeft(opt.value);
                      }}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                        duration === opt.value
                          ? "bg-brand-600 text-white"
                          : "bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white"
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
                <p className="text-xs text-slate-500 mt-2">
                  The passage is always long — the timer determines when the test ends.
                </p>
              </div>

              {/* Category */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-3">
                  <BookOpen className="w-4 h-4 text-accent-400" />
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg bg-slate-800 border border-slate-700 text-white text-sm focus:outline-none focus:border-brand-500"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat.value} value={cat.value}>{cat.label}</option>
                  ))}
                </select>
              </div>

              {/* Difficulty */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-3">
                  <Gauge className="w-4 h-4 text-green-400" />
                  Difficulty
                </label>
                <div className="flex gap-2">
                  {DIFFICULTIES.map((diff) => (
                    <button
                      key={diff.value}
                      onClick={() => setDifficulty(diff.value)}
                      className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                        difficulty === diff.value
                          ? "bg-green-600 text-white"
                          : "bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white"
                      }`}
                    >
                      {diff.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-end mt-6 pt-4 border-t border-slate-800">
              <button
                onClick={() => {
                  setShowSettings(false);
                  fetchPassage();
                }}
                className="px-6 py-2.5 rounded-lg bg-brand-600 hover:bg-brand-500 text-white text-sm font-medium transition-all flex items-center gap-2"
              >
                <CheckCircle className="w-4 h-4" />
                Apply & New Passage
              </button>
            </div>
          </div>
        )}

        {/* AI Passage Modal */}
        {showAiModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
            <div className="bg-slate-900 rounded-2xl p-8 border border-slate-700 max-w-md w-full mx-4 shadow-2xl">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold flex items-center gap-2">
                  <Brain className="w-5 h-5 text-brand-400" />
                  Generate AI Passage
                </h3>
                <button 
                  onClick={() => setShowAiModal(false)}
                  className="p-2 rounded-lg hover:bg-slate-800 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4 mb-6">
                {/* AI Category */}
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Category</label>
                  <select
                    value={aiCategory}
                    onChange={(e) => setAiCategory(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-lg bg-slate-800 border border-slate-700 text-white text-sm focus:outline-none focus:border-brand-500"
                  >
                    {CATEGORIES.filter(c => c.value !== "all").map((cat) => (
                      <option key={cat.value} value={cat.value}>{cat.label}</option>
                    ))}
                  </select>
                </div>

                {/* AI Difficulty */}
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Difficulty</label>
                  <div className="flex gap-2">
                    {DIFFICULTIES.filter(d => d.value !== "all").map((diff) => (
                      <button
                        key={diff.value}
                        onClick={() => setAiDifficulty(diff.value)}
                        className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                          aiDifficulty === diff.value
                            ? "bg-green-600 text-white"
                            : "bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white"
                        }`}
                      >
                        {diff.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* AI Duration */}
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Target Duration
                    <span className="text-slate-500 text-xs ml-1">(affects passage length)</span>
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {TIME_OPTIONS.map((opt) => (
                      <button
                        key={opt.value}
                        onClick={() => setAiDuration(opt.value)}
                        className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                          aiDuration === opt.value
                            ? "bg-brand-600 text-white"
                            : "bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white"
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                  <p className="text-xs text-slate-500 mt-2">
                    {aiDuration <= 30 ? "~80 words — short burst" : 
                     aiDuration <= 120 ? "~150 words — quick test" : 
                     aiDuration <= 300 ? "~300 words — standard" : 
                     "~500 words — extended"}
                  </p>
                </div>
              </div>

              <button
                onClick={generateAiPassage}
                disabled={isAiGenerating}
                className="w-full px-6 py-3 rounded-xl bg-gradient-to-r from-brand-600 to-accent-500 hover:from-brand-500 hover:to-accent-400 text-white font-semibold transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <Sparkles className="w-5 h-5" />
                {isAiGenerating ? "Generating..." : "Generate AI Passage"}
              </button>
            </div>
          </div>
        )}

        {/* 4-Line Scrolling Typing Area */}
        <div 
          className="bg-slate-900 rounded-2xl p-8 border border-slate-800 mb-8 relative cursor-text overflow-hidden"
          onClick={() => inputRef.current?.focus()}
          style={{ height: "10rem" }}
        >
          <div 
            ref={textContainerRef}
            className="font-mono text-xl sm:text-2xl leading-relaxed select-none transition-transform duration-200"
            style={{ transform: `translateY(-${scrollOffset}rem)` }}
          >
            {renderTextLines()}
          </div>
          <textarea
            ref={inputRef}
            value={input}
            onChange={handleInput}
            onKeyDown={handleKeyDown}
            className="absolute inset-0 w-full h-full opacity-0 cursor-text resize-none"
            spellCheck={false}
            autoComplete="off"
            autoCapitalize="off"
            autoFocus
          />
        </div>

        {/* Virtual Keyboard */}
        <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800 mb-8">
          <div className="text-xs text-slate-500 uppercase tracking-wider mb-4 text-center">Virtual Keyboard</div>
          <VirtualKeyboard activeKey={currentKey} weakKeys={getWeakKeys()} />
        </div>

        {/* Controls */}
        <div className="flex justify-center gap-4">
          <button 
            onClick={() => resetTest()}
            className="px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-medium transition-colors flex items-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            Restart
          </button>
          <button 
            onClick={finishTest}
            className="px-6 py-3 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-medium transition-colors flex items-center gap-2"
          >
            <CheckCircle className="w-4 h-4" />
            Finish & See Results
          </button>
        </div>
      </div>
    </div>
  );
}