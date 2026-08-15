"use client";

import Image from "next/image";
import Link from "next/link";
import { 
  Lightbulb, Code2, Rocket, Heart, 
  ExternalLink, Github, Linkedin, Twitter,
  ArrowRight, Target, Zap, Brain
} from "lucide-react";

export default function AboutPage() {
  return (
    <div className="min-h-screen pt-24 pb-12">
      {/* Hero */}
      <section className="max-w-4xl mx-auto px-6 py-16 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-300 text-sm font-medium mb-8">
          <Heart className="w-4 h-4" />
          The Story Behind KeyCoachAI
        </div>
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight mb-6">
          Why I Built <span className="gradient-text">KeyCoachAI</span>
        </h1>
        <p className="text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
          A personal journey from frustration to innovation — how one developer turned a daily annoyance into an AI-powered typing revolution.
        </p>
      </section>

      {/* The Problem */}
      <section className="max-w-4xl mx-auto px-6 py-12">
        <div className="bg-slate-900 rounded-2xl p-8 sm:p-10 border border-slate-800">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center">
              <Lightbulb className="w-5 h-5 text-red-400" />
            </div>
            <h2 className="text-2xl font-bold">The Problem</h2>
          </div>
          <div className="space-y-4 text-slate-300 leading-relaxed">
            <p>
              Like many developers, I spend hours every day at the keyboard. I used to practice on traditional typing websites — the ones that tell you your WPM and accuracy, then show you a leaderboard. But something always felt missing.
            </p>
            <p>
              Every time I finished a test, I&apos;d see the same generic result: <em>&quot;You typed 47 WPM with 94% accuracy.&quot;</em> Okay, great. But <strong>why</strong> was I stuck at 47? Which keys were slowing me down? What specific patterns should I practice? The answer was always the same: nothing. Just try again.
            </p>
            <p>
              I realized that existing typing tools were essentially <strong>scoreboards</strong>, not <strong>coaches</strong>. They measured performance but never explained it. They never adapted to my weaknesses. They never told me <em>&quot;You struggle with the &apos;r&apos; and &apos;t&apos; keys — here&apos;s an exercise just for that.&quot;</em>
            </p>
          </div>
        </div>
      </section>

      {/* The Idea */}
      <section className="max-w-4xl mx-auto px-6 py-12">
        <div className="bg-gradient-to-br from-brand-900/30 to-slate-900 rounded-2xl p-8 sm:p-10 border border-brand-500/20">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-brand-500/10 flex items-center justify-center">
              <Brain className="w-5 h-5 text-brand-400" />
            </div>
            <h2 className="text-2xl font-bold">The Idea</h2>
          </div>
          <div className="space-y-4 text-slate-300 leading-relaxed">
            <p>
              In early 2024, while experimenting with LLMs, I had a thought: <em>What if an AI could analyze not just what I typed wrong, but <strong>why</strong> I typed it wrong?</em>
            </p>
            <p>
              I started sketching out a system that would:
            </p>
            <ul className="space-y-3 ml-6">
              <li className="flex items-start gap-3">
                <Target className="w-5 h-5 text-brand-400 mt-0.5 flex-shrink-0" />
                <span>Track every keystroke in real-time — not just speed, but <strong>which keys</strong> caused errors</span>
              </li>
              <li className="flex items-start gap-3">
                <Target className="w-5 h-5 text-brand-400 mt-0.5 flex-shrink-0" />
                <span>Detect weak <strong>patterns</strong> (like &quot;th&quot;, &quot;tr&quot;, &quot;gr&quot;) that slow me down</span>
              </li>
              <li className="flex items-start gap-3">
                <Target className="w-5 h-5 text-brand-400 mt-0.5 flex-shrink-0" />
                <span>Send a structured performance profile to an LLM for <strong>personalized coaching</strong></span>
              </li>
              <li className="flex items-start gap-3">
                <Target className="w-5 h-5 text-brand-400 mt-0.5 flex-shrink-0" />
                <span>Generate <strong>custom exercises</strong> targeting only my weak spots</span>
              </li>
              <li className="flex items-start gap-3">
                <Target className="w-5 h-5 text-brand-400 mt-0.5 flex-shrink-0" />
                <span>Track progress over time with <strong>beautiful analytics</strong></span>
              </li>
            </ul>
            <p>
              That&apos;s how <strong>KeyCoachAI</strong> was born — not as another typing test, but as a <strong>typing coach</strong> that actually understands you.
            </p>
          </div>
        </div>
      </section>

      {/* The Build */}
      <section className="max-w-4xl mx-auto px-6 py-12">
        <div className="bg-slate-900 rounded-2xl p-8 sm:p-10 border border-slate-800">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center">
              <Code2 className="w-5 h-5 text-green-400" />
            </div>
            <h2 className="text-2xl font-bold">The Build</h2>
          </div>
          <div className="space-y-4 text-slate-300 leading-relaxed">
            <p>
              I built KeyCoachAI using <strong>Next.js 14</strong> with the App Router, <strong>TypeScript</strong> for type safety, and <strong>Tailwind CSS</strong> for rapid UI development. The typing engine is a custom React component that processes keystrokes in real-time — no external libraries, just pure performance.
            </p>
            <p>
              For the AI coach, I designed a structured performance profile that gets sent to an LLM API. Instead of dumping raw keystroke data, the system sends a clean JSON object with WPM, accuracy, weak keys, weak patterns, and historical context. The AI then returns personalized feedback and a custom exercise.
            </p>
            <p>
              User data is stored in <strong>MongoDB Atlas</strong> with <strong>Mongoose</strong> schemas. Authentication is handled by <strong>Auth.js</strong> supporting both email/password and Google OAuth. Guest users can practice with <strong>localStorage</strong> — no account needed.
            </p>
          </div>
        </div>
      </section>

      {/* About Maghfoor */}
      <section className="max-w-4xl mx-auto px-6 py-12">
        <div className="bg-gradient-to-br from-slate-900 to-slate-800/50 rounded-2xl p-8 sm:p-10 border border-slate-700/50">
          <div className="flex flex-col md:flex-row gap-8 items-start">
            <div className="flex-shrink-0">
              <div className="w-32 h-32 rounded-2xl bg-gradient-to-br from-brand-500 to-accent-500 flex items-center justify-center text-4xl font-bold text-white">
                MA
              </div>
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-4">
                <Rocket className="w-6 h-6 text-brand-400" />
                <h2 className="text-2xl font-bold">About Maghfoor Ahmad</h2>
              </div>

              <div className="space-y-4 text-slate-300 leading-relaxed">
                <p>
                  Hi, I&apos;m <strong className="text-white">Maghfoor Ahmad</strong> — a software engineer with over 4 years of experience building products at both big tech companies and fast-paced startups. I&apos;m passionate about creating tools that combine utility with intelligent automation.
                </p>
                <p>
                  Before KeyCoachAI, I built <strong>Three Cells</strong> — a productivity app that combines journaling, habits, and tasks into one seamless experience. It gained <strong>6,000+ downloads</strong> and a <strong>4.5★ rating</strong> on app stores, which taught me a lot about building products people actually love to use.
                </p>
                <p>
                  I believe the best software doesn&apos;t just solve problems — it <strong>understands</strong> you. That&apos;s the philosophy behind everything I build. Whether it&apos;s a productivity app or a typing coach, I aim to create experiences that feel personal, intelligent, and genuinely helpful.
                </p>
                <p>
                  When I&apos;m not coding, you&apos;ll find me exploring new AI tools, contributing to open-source projects, or sharing what I learn with the developer community.
                </p>
              </div>

              <div className="flex gap-3 mt-6">
                <a 
                  href="https://github.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-sm font-medium transition-colors"
                >
                  <Github className="w-4 h-4" />
                  GitHub
                </a>
                <a 
                  href="https://linkedin.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-sm font-medium transition-colors"
                >
                  <Linkedin className="w-4 h-4" />
                  LinkedIn
                </a>
                <a 
                  href="https://twitter.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-sm font-medium transition-colors"
                >
                  <Twitter className="w-4 h-4" />
                  Twitter
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tech Architecture */}
      <section className="max-w-4xl mx-auto px-6 py-12">
        <div className="bg-slate-900 rounded-2xl p-8 sm:p-10 border border-slate-800">
          <h2 className="text-2xl font-bold mb-6">Architecture Overview</h2>
          <div className="font-mono text-sm bg-slate-950 rounded-xl p-6 overflow-x-auto border border-slate-800">
            <pre className="text-slate-300">
{`KEYCOACHAI
    │
    ▼
┌──────────────────┐
│     NEXT.JS      │
│  React + TS      │
└────────┬─────────┘
         │
┌────────┴────────┐
│                 │
▼                 ▼
Homepage    Typing Engine
│                 │
│           CLIENT-SIDE
│                 │
│                 ▼
│      Performance Analyzer
│                 │
└────────┬────────┘
         │
  Test completed
         │
         ▼
┌────────────────┐
│  AI COACH API  │
│ Next.js Server │
└───────┬────────┘
        │
        ▼
   AI MODEL
        │
        ▼
┌────────────────────┐
│ Personalized       │
│ Exercise Generator │
└─────────┬──────────┘
          │
          ▼
   New Typing Exercise

                       ▼
                MongoDB Atlas`}
            </pre>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-4xl mx-auto px-6 py-16 text-center">
        <h2 className="text-3xl font-bold mb-6">Ready to Experience It?</h2>
        <p className="text-slate-400 mb-8 max-w-xl mx-auto">
          Try KeyCoachAI yourself and see how AI-powered coaching can transform your typing speed and accuracy.
        </p>
        <Link 
          href="/typing-test"
          className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-brand-600 to-accent-500 hover:from-brand-500 hover:to-accent-400 text-white font-semibold text-lg transition-all hover:shadow-xl hover:shadow-brand-500/25 hover:-translate-y-0.5"
        >
          <Zap className="w-5 h-5" />
          Start Typing Test
          <ArrowRight className="w-5 h-5" />
        </Link>
      </section>
    </div>
  );
}
