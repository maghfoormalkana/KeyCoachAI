"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { 
  Timer, RotateCcw, CheckCircle, ArrowRight, Keyboard,
  BrainCircuit, Sparkles, Loader2, Zap, Target, TrendingUp,
  BookOpen, AlertCircle
} from "lucide-react";
import { VirtualKeyboard } from "@/components/typing/VirtualKeyboard";

interface UserStats {
  averageWpm: number;
  bestWpm: number;
  averageAccuracy: number;
  testsCompleted: number;
  weakKeys: string[];
  weakPatterns: string[];
}

export default function PracticePage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [practiceText, setPracticeText] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  // Test state
  const [input, setInput] = useState("");
  const [isActive, setIsActive] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const [wpm, setWpm] = useState(0);
  const [accuracy, setAccuracy] = useState(100);
  const [errors, setErrors] = useState(0);
  const [backspaces, setBackspaces] = useState(0);
  const [currentKey, setCurrentKey] = useState("");
  const [aiFeedback, setAiFeedback] = useState<any>(null);
  const [isLoadingAI, setIsLoadingAI] = useState(false);

  const inputRef = useRef<HTMLTextAreaElement>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Redirect if not logged in
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin?callbackUrl=/practice");
    }
  }, [status, router]);

  // Load user stats and generate practice
  useEffect(() => {
    if (session?.user) {
      loadUserStats();
    }
  }, [session]);

  const loadUserStats = async () => {
    try {
      const res = await fetch("/api/user/stats");
      const data = await res.json();
      if (data.stats) {
        setUserStats(data.stats);
        generatePractice(data.stats);
      }
    } catch (error) {
      console.error("Failed to load stats:", error);
    }
  };

  const generatePractice = async (stats: UserStats) => {
    setIsGenerating(true);
    try {
      const res = await fetch("/api/ai-coach/practice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          weakKeys: stats.weakKeys,
          weakPatterns: stats.weakPatterns,
          averageWpm: stats.averageWpm,
          targetWpm: stats.averageWpm + 10,
        }),
      });

      const data = await res.json();
      if (data.exercise) {
        setPracticeText(data.exercise);
      } else {
        // Fallback exercise targeting weak keys
        const weakKeyStr = stats.weakKeys.join("");
        const fallbackText = `Practice these keys: ${weakKeyStr.repeat(5)} ${stats.weakPatterns.join(" ")} The quick brown fox jumps over the lazy dog. Programming is the art of telling another human what one wants the computer to do.`;
        setPracticeText(fallbackText);
      }
    } catch (error) {
      console.error("Practice generation error:", error);
      setPracticeText("The quick brown fox jumps over the lazy dog. Pack my box with five dozen liquor jugs.");
    } finally {
      setIsGenerating(false);
    }
  };

  const startTest = useCallback(() => {
    if (!isActive && !isFinished) {
      setIsActive(true);
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setIsFinished(true);
            setIsActive(false);
            if (intervalRef.current) clearInterval(intervalRef.current);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
  }, [isActive, isFinished]);

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    if (!isActive && !isFinished && value.length > 0) startTest();
    if (isFinished) return;

    if (value.length < input.length) setBackspaces((prev) => prev + 1);
    setInput(value);

    let errorCount = 0;
    for (let i = 0; i < value.length; i++) {
      if (value[i] !== practiceText[i]) errorCount++;
    }
    setErrors(errorCount);

    const totalChars = value.length;
    const acc = totalChars === 0 ? 100 : Math.round(((totalChars - errorCount) / totalChars) * 1000) / 10;
    setAccuracy(acc);

    const timeElapsed = 60 - timeLeft;
    if (timeElapsed > 0) {
      const minutes = timeElapsed / 60;
      const grossWPM = (totalChars / 5) / minutes;
      const netWPM = Math.max(0, Math.round(grossWPM - (errorCount / minutes)));
      setWpm(netWPM);
    }

    if (value.length >= practiceText.length) {
      setIsFinished(true);
      setIsActive(false);
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    setCurrentKey(e.key);
    setTimeout(() => setCurrentKey(""), 150);
  };

  const resetPractice = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setInput("");
    setIsActive(false);
    setIsFinished(false);
    setTimeLeft(60);
    setWpm(0);
    setAccuracy(100);
    setErrors(0);
    setBackspaces(0);
    setCurrentKey("");
    setAiFeedback(null);
    if (userStats) generatePractice(userStats);
    inputRef.current?.focus();
  };

  // Save result and get AI feedback
  useEffect(() => {
    if (isFinished) {
      saveResult();
    }
  }, [isFinished]);

  const saveResult = async () => {
    try {
      const weakKeys = getWeakKeys();
      const weakPatterns = getWeakPatterns();

      // Save to MongoDB
      await fetch("/api/save-result", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: session?.user?.id,
          wpm,
          accuracy,
          errors,
          backspaces,
          duration: 60,
          weakKeys,
          weakPatterns,
          punctuationAccuracy: calculatePunctuationAccuracy(),
          difficulty: "medium",
        }),
      });

      // Get AI feedback
      setIsLoadingAI(true);
      const res = await fetch("/api/ai-coach", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          wpm,
          accuracy,
          errors,
          backspaces,
          duration: 60,
          weakKeys,
          weakPatterns,
          punctuationAccuracy: calculatePunctuationAccuracy(),
          difficulty: "medium",
        }),
      });

      const data = await res.json();
      setAiFeedback(data.fallback || data);
    } catch (error) {
      console.error("Save/AI error:", error);
    } finally {
      setIsLoadingAI(false);
    }
  };

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const renderText = () => {
    return practiceText.split("").map((char, index) => {
      let className = "char-pending";
      if (index < input.length) {
        className = input[index] === char ? "char-correct" : "char-wrong";
      } else if (index === input.length) {
        className = "char-current";
      }
      return <span key={index} className={className}>{char}</span>;
    });
  };

  const getWeakKeys = () => {
    const weak = new Set<string>();
    for (let i = 0; i < Math.min(input.length, practiceText.length); i++) {
      if (input[i] !== practiceText[i]) weak.add(practiceText[i].toLowerCase());
    }
    return Array.from(weak).slice(0, 5);
  };

  const getWeakPatterns = () => {
    const weak = new Set<string>();
    for (let i = 0; i < Math.min(input.length, practiceText.length) - 1; i++) {
      if (input[i] !== practiceText[i] || input[i + 1] !== practiceText[i + 1]) {
        const pattern = practiceText.substring(i, i + 2).toLowerCase();
        if (pattern.length === 2 && /^[a-z]{2}$/.test(pattern)) weak.add(pattern);
      }
    }
    return Array.from(weak).slice(0, 5);
  };

  const calculatePunctuationAccuracy = () => {
    const punctRegex = /[.,!?;:'"()-]/g;
    const targetPunct = practiceText.match(punctRegex) || [];
    if (targetPunct.length === 0) return 100;
    let correct = 0;
    const minLen = Math.min(input.length, practiceText.length);
    for (let i = 0; i < minLen; i++) {
      if (punctRegex.test(practiceText[i]) && input[i] === practiceText[i]) correct++;
    }
    return Math.round((correct / targetPunct.length) * 100);
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-brand-400" />
      </div>
    );
  }

  if (!session?.user) return null;

  // Results screen
  if (isFinished) {
    return (
      <div className="min-h-screen pt-24 pb-12 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-400 text-sm font-medium mb-4">
              <BrainCircuit className="w-4 h-4" />
              AI Practice Complete
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold">Practice Results</h1>
          </div>

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

          {/* AI Feedback */}
          <div className="bg-gradient-to-br from-brand-900/50 to-slate-900 rounded-2xl p-8 border border-brand-500/20 mb-8">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-brand-500 to-accent-500 flex items-center justify-center flex-shrink-0">
                {isLoadingAI ? <Loader2 className="w-6 h-6 text-white animate-spin" /> : <Sparkles className="w-6 h-6 text-white" />}
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-lg mb-2">AI Coach Analysis</h3>
                {isLoadingAI ? (
                  <p className="text-slate-400">Analyzing your practice session...</p>
                ) : aiFeedback ? (
                  <div className="text-slate-300 leading-relaxed space-y-3">
                    <p>{aiFeedback.feedback}</p>
                    {aiFeedback.exercise && (
                      <div className="mt-4 p-4 bg-slate-800/50 rounded-lg border border-slate-700">
                        <p className="text-sm text-brand-400 font-medium mb-2">Next Practice Exercise:</p>
                        <p className="font-mono text-sm">{aiFeedback.exercise}</p>
                      </div>
                    )}
                    {aiFeedback.tips && (
                      <ul className="mt-3 space-y-1">
                        {aiFeedback.tips.map((tip: string, i: number) => (
                          <li key={i} className="text-sm text-slate-400 flex items-start gap-2">
                            <Zap className="w-4 h-4 text-yellow-400 mt-0.5 flex-shrink-0" />
                            {tip}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ) : (
                  <p className="text-slate-400">AI feedback loading...</p>
                )}
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button onClick={resetPractice} className="px-8 py-4 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-semibold transition-all flex items-center justify-center gap-2">
              <RotateCcw className="w-5 h-5" />
              Practice Again
            </button>
            <Link href="/dashboard" className="px-8 py-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold transition-all flex items-center justify-center gap-2">
              <TrendingUp className="w-5 h-5" />
              View Progress
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-12 px-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <BrainCircuit className="w-6 h-6 text-brand-400" />
              AI-Powered Practice
            </h1>
            <p className="text-slate-400 text-sm mt-1">
              Personalized exercise based on your weak keys and patterns
            </p>
          </div>
          {userStats && (
            <div className="hidden sm:flex items-center gap-4 text-sm">
              <div className="flex items-center gap-1.5 text-slate-400">
                <Target className="w-4 h-4 text-brand-400" />
                Avg: {userStats.averageWpm} WPM
              </div>
              <div className="flex items-center gap-1.5 text-slate-400">
                <TrendingUp className="w-4 h-4 text-green-400" />
                Best: {userStats.bestWpm} WPM
              </div>
            </div>
          )}
        </div>

        {/* Weak Areas Display */}
        {userStats && (userStats.weakKeys.length > 0 || userStats.weakPatterns.length > 0) && (
          <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800 mb-6">
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-yellow-400" />
              Focus Areas for This Practice
            </h3>
            <div className="flex flex-wrap gap-3">
              {userStats.weakKeys.map((key) => (
                <span key={key} className="px-3 py-1.5 rounded-lg bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 font-mono font-bold">
                  {key}
                </span>
              ))}
              {userStats.weakPatterns.map((pattern) => (
                <span key={pattern} className="px-3 py-1.5 rounded-lg bg-orange-500/10 border border-orange-500/20 text-orange-400 font-mono font-bold">
                  {pattern}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Generating State */}
        {isGenerating && (
          <div className="bg-slate-900 rounded-2xl p-12 border border-slate-800 mb-6 text-center">
            <Loader2 className="w-8 h-8 animate-spin text-brand-400 mx-auto mb-4" />
            <p className="text-slate-400">AI is generating your personalized practice exercise...</p>
          </div>
        )}

        {/* Test Area */}
        {!isGenerating && (
          <>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
              <div className="bg-slate-900 rounded-xl p-4 border border-slate-800 text-center">
                <div className="text-xs text-slate-500 uppercase tracking-wider mb-1">Time</div>
                <div className="text-2xl font-mono font-bold text-brand-400">{timeLeft}</div>
              </div>
              <div className="bg-slate-900 rounded-xl p-4 border border-slate-800 text-center">
                <div className="text-xs text-slate-500 uppercase tracking-wider mb-1">WPM</div>
                <div className="text-2xl font-mono font-bold text-white">{wpm}</div>
              </div>
              <div className="bg-slate-900 rounded-xl p-4 border border-slate-800 text-center">
                <div className="text-xs text-slate-500 uppercase tracking-wider mb-1">Accuracy</div>
                <div className="text-2xl font-mono font-bold text-green-400">{accuracy}%</div>
              </div>
              <div className="bg-slate-900 rounded-xl p-4 border border-slate-800 text-center">
                <div className="text-xs text-slate-500 uppercase tracking-wider mb-1">Progress</div>
                <div className="text-2xl font-mono font-bold text-accent-400">
                  {practiceText ? Math.round((input.length / practiceText.length) * 100) : 0}%
                </div>
              </div>
            </div>

            <div 
              className="bg-slate-900 rounded-2xl p-8 border border-slate-800 mb-6 relative cursor-text min-h-[180px]"
              onClick={() => inputRef.current?.focus()}
            >
              <div className="font-mono text-lg sm:text-xl leading-relaxed select-none">
                {renderText()}
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

            <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800 mb-6">
              <div className="text-xs text-slate-500 uppercase tracking-wider mb-4 text-center">Virtual Keyboard</div>
              <VirtualKeyboard activeKey={currentKey} weakKeys={getWeakKeys()} />
            </div>

            <div className="flex justify-center gap-4">
              <button 
                onClick={resetPractice}
                className="px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-medium transition-colors flex items-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                New Exercise
              </button>
              <button 
                onClick={() => {
                  setIsFinished(true);
                  setIsActive(false);
                  if (intervalRef.current) clearInterval(intervalRef.current);
                }}
                className="px-6 py-3 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-medium transition-colors flex items-center gap-2"
              >
                <CheckCircle className="w-4 h-4" />
                Finish & Analyze
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
