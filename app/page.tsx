"use client";

import Link from "next/link";
import { 
  Zap, Brain, Target, LineChart, Shield, Database,
  MousePointerClick, Activity, FileCode, TrendingUp,
  ChevronDown, Keyboard
} from "lucide-react";

export default function HomePage() {
  return (
    <div>
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20 bg-[radial-gradient(ellipse_at_top,#0f172a_0%,#020617_100%)]">
        {/* Background Grid */}
        <div 
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)`,
            backgroundSize: '40px 40px'
          }}
        />

        {/* Floating Orbs */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-brand-500/10 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent-500/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '-3s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand-400/5 rounded-full blur-3xl animate-pulse-slow" />

        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-300 text-sm font-medium mb-8">
            <span className="w-2 h-2 rounded-full bg-brand-400 animate-pulse" />
            AI-Powered Typing Intelligence
          </div>

          <h1 className="text-5xl sm:text-6xl md:text-7xl font-black tracking-tight mb-6">
            Type Faster.<br />
            <span className="gradient-text">Think Smarter.</span>
          </h1>

          <p className="text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            KeyCoachAI analyzes every keystroke, identifies your weak spots, and generates 
            <span className="text-slate-200 font-medium"> personalized exercises</span> powered by AI to help you type with confidence.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <Link 
              href="/typing-test"
              className="group px-8 py-4 rounded-xl bg-gradient-to-r from-brand-600 to-brand-500 hover:from-brand-500 hover:to-brand-400 text-white font-semibold text-lg transition-all hover:shadow-xl hover:shadow-brand-500/25 hover:-translate-y-0.5 flex items-center gap-3"
            >
              <Zap className="w-5 h-5 group-hover:animate-pulse" />
              Start Typing Test
            </Link>
            <Link 
              href="/about"
              className="px-8 py-4 rounded-xl border border-slate-700 hover:border-slate-500 text-slate-300 hover:text-white font-semibold text-lg transition-all hover:-translate-y-0.5"
            >
              Learn More
            </Link>
          </div>

          {/* Mini Typing Preview */}
          <div className="max-w-3xl mx-auto">
            <div className="glass-dark rounded-2xl p-6 sm:p-8 border border-slate-700/50 shadow-2xl">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500" />
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                </div>
                <div className="text-xs text-slate-500 font-mono">keycoach.ai/test</div>
              </div>
              <div className="font-mono text-lg sm:text-xl leading-relaxed text-left">
                <span className="text-slate-500">The quick brown fox jumps over the lazy dog.</span>
                <span className="typing-cursor" />
              </div>
              <div className="flex items-center gap-6 mt-6 pt-4 border-t border-slate-700/50">
                <div className="flex items-center gap-2 text-sm text-slate-400">
                  <Activity className="w-4 h-4 text-brand-400" />
                  <span>0 WPM</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-400">
                  <Target className="w-4 h-4 text-green-400" />
                  <span>0%</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-400">
                  <TrendingUp className="w-4 h-4 text-accent-400" />
                  <span>60s</span>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Bar */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-white">50K+</div>
              <div className="text-sm text-slate-500 mt-1">Tests Completed</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white">12K+</div>
              <div className="text-sm text-slate-500 mt-1">Active Users</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white">94%</div>
              <div className="text-sm text-slate-500 mt-1">Avg. Improvement</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white">AI</div>
              <div className="text-sm text-slate-500 mt-1">Personalized Coach</div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <ChevronDown className="w-6 h-6 text-slate-600" />
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 bg-slate-900">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <span className="text-brand-400 text-sm font-semibold tracking-wider uppercase">Process</span>
            <h2 className="text-3xl sm:text-4xl font-bold mt-3">How KeyCoachAI Works</h2>
            <p className="text-slate-400 mt-4 max-w-xl mx-auto">From your first keystroke to personalized AI coaching — here&apos;s the journey.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-6">
            {[
              { icon: MousePointerClick, title: "1. Take Test", desc: "Start a timed typing test with real-time keystroke tracking." },
              { icon: Activity, title: "2. Analyze", desc: "We detect weak keys, patterns, and punctuation struggles." },
              { icon: Brain, title: "3. AI Coach", desc: "An LLM reviews your performance profile and gives advice." },
              { icon: FileCode, title: "4. Exercise", desc: "Get a custom-generated exercise targeting your weak spots." },
              { icon: TrendingUp, title: "5. Improve", desc: "Track progress over time. The AI learns as you improve." },
            ].map((step, i) => (
              <div key={i} className="group relative bg-slate-800/50 rounded-2xl p-6 border border-slate-700/50 hover:border-brand-500/30 transition-all hover:-translate-y-1">
                <div className="w-12 h-12 rounded-xl bg-brand-500/10 flex items-center justify-center mb-4 group-hover:bg-brand-500/20 transition-colors">
                  <step.icon className="w-6 h-6 text-brand-400" />
                </div>
                <h3 className="font-semibold mb-2">{step.title}</h3>
                <p className="text-sm text-slate-400">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-slate-950">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <span className="text-accent-400 text-sm font-semibold tracking-wider uppercase">Features</span>
            <h2 className="text-3xl sm:text-4xl font-bold mt-3">Built for Serious Typists</h2>
            <p className="text-slate-400 mt-4 max-w-xl mx-auto">Every feature designed to make you a faster, more accurate typist.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: Activity, title: "Real-Time Analysis", desc: "Track WPM, accuracy, error rate, and backspace count as you type. Every keystroke matters.", color: "brand" },
              { icon: Brain, title: "AI-Powered Coach", desc: "An LLM analyzes your performance profile and generates personalized feedback and exercises.", color: "accent" },
              { icon: Target, title: "Weak Key Detection", desc: "Automatically identifies which keys and letter combinations slow you down the most.", color: "green" },
              { icon: LineChart, title: "Progress Dashboard", desc: "Visualize your WPM trends, accuracy history, and improvement over time with beautiful charts.", color: "purple" },
              { icon: Shield, title: "Guest Mode", desc: "Practice anonymously with local storage. No account required to start improving.", color: "orange" },
              { icon: Database, title: "Cloud Sync", desc: "Sign in to save results to MongoDB Atlas. Access your history from any device, anywhere.", color: "pink" },
            ].map((feature, i) => (
              <div key={i} className="bg-slate-900 rounded-2xl p-8 border border-slate-800 hover:border-brand-500/30 transition-all group">
                <div className={`w-14 h-14 rounded-2xl bg-${feature.color}-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                  <feature.icon className={`w-7 h-7 text-${feature.color}-400`} />
                </div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-slate-400 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tech Stack */}
      <section className="py-24 bg-slate-900">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <span className="text-brand-400 text-sm font-semibold tracking-wider uppercase">Technology</span>
            <h2 className="text-3xl sm:text-4xl font-bold mt-3">Modern Stack, Maximum Performance</h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {[
              { emoji: "⚛️", name: "Next.js 14", desc: "React Framework" },
              { emoji: "🔷", name: "TypeScript", desc: "Type Safety" },
              { emoji: "🎨", name: "Tailwind CSS", desc: "Styling" },
              { emoji: "🧩", name: "shadcn/ui", desc: "UI Components" },
              { emoji: "🍃", name: "MongoDB Atlas", desc: "Database" },
              { emoji: "🔐", name: "Auth.js", desc: "Authentication" },
              { emoji: "🤖", name: "LLM API", desc: "AI Coach" },
              { emoji: "📊", name: "Recharts", desc: "Analytics" },
              { emoji: "✅", name: "Zod", desc: "Validation" },
              { emoji: "▲", name: "Vercel", desc: "Deployment" },
            ].map((tech, i) => (
              <div key={i} className="bg-slate-800/50 rounded-xl p-4 text-center border border-slate-700/50 hover:border-slate-600 transition-colors">
                <div className="text-2xl mb-2">{tech.emoji}</div>
                <div className="font-semibold text-sm">{tech.name}</div>
                <div className="text-xs text-slate-500 mt-1">{tech.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-b from-slate-950 to-slate-900">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-6">Ready to Type Like a Pro?</h2>
          <p className="text-slate-400 text-lg mb-10 max-w-xl mx-auto">Join thousands of typists who use KeyCoachAI to improve their speed and accuracy every day.</p>
          <Link 
            href="/typing-test"
            className="inline-block px-10 py-5 rounded-xl bg-gradient-to-r from-brand-600 to-accent-500 hover:from-brand-500 hover:to-accent-400 text-white font-bold text-lg transition-all hover:shadow-2xl hover:shadow-brand-500/25 hover:-translate-y-1"
          >
            Start Your First Test — It&apos;s Free
          </Link>
        </div>
      </section>
    </div>
  );
}
