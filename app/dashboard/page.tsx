"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  TrendingUp, Zap, Target, ClipboardCheck,
  Plus, Activity, BarChart3, History,
  ArrowUp, Calendar
} from "lucide-react";

// Sample data for demo
const WPM_DATA = [32, 38, 35, 42, 40, 48, 45, 47];
const ACCURACY_DATA = [82, 85, 80, 88, 86, 91, 89, 94];
const WEEKS = ["W1", "W2", "W3", "W4", "W5", "W6", "W7", "W8"];

const RECENT_TESTS = [
  { date: "2024-01-15", wpm: 47, accuracy: 94.2, errors: 12, difficulty: "Medium" },
  { date: "2024-01-14", wpm: 45, accuracy: 93.1, errors: 15, difficulty: "Medium" },
  { date: "2024-01-13", wpm: 43, accuracy: 91.5, errors: 18, difficulty: "Easy" },
  { date: "2024-01-12", wpm: 48, accuracy: 95.0, errors: 10, difficulty: "Medium" },
  { date: "2024-01-11", wpm: 41, accuracy: 89.3, errors: 22, difficulty: "Hard" },
];

export default function DashboardPage() {
  const [timeRange, setTimeRange] = useState<"week" | "month" | "all">("month");

  const maxWPM = Math.max(...WPM_DATA);
  const maxAcc = 100;

  return (
    <div className="min-h-screen pt-24 pb-12 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-2xl font-bold">Dashboard</h1>
            <p className="text-slate-400 text-sm mt-1">Track your typing progress over time.</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex bg-slate-800 rounded-lg p-1">
              {(["week", "month", "all"] as const).map((range) => (
                <button
                  key={range}
                  onClick={() => setTimeRange(range)}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                    timeRange === range 
                      ? "bg-slate-700 text-white" 
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  {range.charAt(0).toUpperCase() + range.slice(1)}
                </button>
              ))}
            </div>
            <Link 
              href="/typing-test"
              className="px-4 py-2 rounded-lg bg-brand-600 hover:bg-brand-500 text-white text-sm font-medium transition-colors flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              New Test
            </Link>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg bg-brand-500/10 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-brand-400" />
              </div>
              <div className="text-sm text-slate-500">Avg WPM</div>
            </div>
            <div className="text-3xl font-bold">45.8</div>
            <div className="text-xs text-green-400 mt-1 flex items-center gap-1">
              <ArrowUp className="w-3 h-3" />
              +12% this month
            </div>
          </div>
          <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center">
                <Zap className="w-5 h-5 text-green-400" />
              </div>
              <div className="text-sm text-slate-500">Best WPM</div>
            </div>
            <div className="text-3xl font-bold">53.2</div>
            <div className="text-xs text-slate-500 mt-1">Achieved 3 days ago</div>
          </div>
          <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg bg-accent-500/10 flex items-center justify-center">
                <Target className="w-5 h-5 text-accent-400" />
              </div>
              <div className="text-sm text-slate-500">Avg Accuracy</div>
            </div>
            <div className="text-3xl font-bold">94.8%</div>
            <div className="text-xs text-green-400 mt-1 flex items-center gap-1">
              <ArrowUp className="w-3 h-3" />
              +2.1% this month
            </div>
          </div>
          <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
                <ClipboardCheck className="w-5 h-5 text-purple-400" />
              </div>
              <div className="text-sm text-slate-500">Tests Done</div>
            </div>
            <div className="text-3xl font-bold">27</div>
            <div className="text-xs text-slate-500 mt-1">This month: 12</div>
          </div>
        </div>

        {/* Charts */}
        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          {/* WPM Chart */}
          <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800">
            <h3 className="font-semibold mb-6 flex items-center gap-2">
              <Activity className="w-5 h-5 text-brand-400" />
              WPM Over Time
            </h3>
            <div className="h-64 flex items-end justify-between gap-2 px-2">
              {WPM_DATA.map((wpm, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-2">
                  <div className="w-full bg-brand-500/10 rounded-t-lg relative" style={{ height: `${(wpm / maxWPM) * 100}%`, minHeight: '20px' }}>
                    <div 
                      className="absolute bottom-0 left-0 right-0 bg-brand-500 rounded-t-lg transition-all duration-500"
                      style={{ height: '100%' }}
                    />
                  </div>
                  <span className="text-xs text-slate-500">{WEEKS[i]}</span>
                  <span className="text-xs text-brand-400 font-mono">{wpm}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Accuracy Chart */}
          <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800">
            <h3 className="font-semibold mb-6 flex items-center gap-2">
              <Target className="w-5 h-5 text-green-400" />
              Accuracy Trend
            </h3>
            <div className="h-64 flex items-end justify-between gap-2 px-2">
              {ACCURACY_DATA.map((acc, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-2">
                  <div className="w-full bg-green-500/10 rounded-t-lg relative" style={{ height: `${(acc / maxAcc) * 100}%`, minHeight: '20px' }}>
                    <div 
                      className="absolute bottom-0 left-0 right-0 bg-green-500 rounded-t-lg transition-all duration-500"
                      style={{ height: '100%' }}
                    />
                  </div>
                  <span className="text-xs text-slate-500">{WEEKS[i]}</span>
                  <span className="text-xs text-green-400 font-mono">{acc}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Tests */}
        <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden">
          <div className="p-6 border-b border-slate-800">
            <h3 className="font-semibold flex items-center gap-2">
              <History className="w-5 h-5 text-purple-400" />
              Recent Tests
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-xs text-slate-500 uppercase tracking-wider">
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4">WPM</th>
                  <th className="px-6 py-4">Accuracy</th>
                  <th className="px-6 py-4">Errors</th>
                  <th className="px-6 py-4">Difficulty</th>
                  <th className="px-6 py-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {RECENT_TESTS.map((test, i) => (
                  <tr key={i} className="hover:bg-slate-800/50 transition-colors">
                    <td className="px-6 py-4 text-sm text-slate-300">{test.date}</td>
                    <td className="px-6 py-4 text-sm font-mono font-bold text-brand-400">{test.wpm}</td>
                    <td className="px-6 py-4 text-sm font-mono text-green-400">{test.accuracy}%</td>
                    <td className="px-6 py-4 text-sm text-red-400">{test.errors}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        test.difficulty === "Easy" ? "bg-green-500/10 text-green-400" :
                        test.difficulty === "Medium" ? "bg-yellow-500/10 text-yellow-400" :
                        "bg-red-500/10 text-red-400"
                      }`}>
                        {test.difficulty}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 rounded text-xs font-medium bg-green-500/10 text-green-400">
                        Completed
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Goals Section */}
        <div className="mt-8 bg-gradient-to-br from-brand-900/30 to-slate-900 rounded-2xl p-8 border border-brand-500/20">
          <div className="flex items-center gap-3 mb-6">
            <Target className="w-6 h-6 text-brand-400" />
            <h3 className="text-xl font-bold">Your Goals</h3>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-slate-400">Target WPM</span>
                <span className="text-sm font-bold text-brand-400">55</span>
              </div>
              <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-brand-500 rounded-full" style={{ width: '83%' }} />
              </div>
              <p className="text-xs text-slate-500 mt-1">Current: 45.8 WPM — 83% of goal</p>
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-slate-400">Target Accuracy</span>
                <span className="text-sm font-bold text-green-400">96%</span>
              </div>
              <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-green-500 rounded-full" style={{ width: '98.7%' }} />
              </div>
              <p className="text-xs text-slate-500 mt-1">Current: 94.8% — almost there!</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
