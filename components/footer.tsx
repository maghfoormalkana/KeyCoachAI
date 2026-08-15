"use client";

import Link from "next/link";
import { Keyboard, Github, Twitter, Linkedin, Heart } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-slate-950 border-t border-slate-800/50">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              {/* <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-500 to-accent-500 flex items-center justify-center">
                <Keyboard className="w-4 h-4 text-white" />
              </div> */}
              <img
              src="/logo.png"
              alt="Logo"
              className="w-20 h-20 object-contain"
            />
              <span className="font-bold text-lg">
                KeyCoach<span className="text-brand-400">AI</span>
              </span>
            </Link>
            <p className="text-slate-400 text-sm max-w-sm leading-relaxed">
              AI-powered typing coach that analyzes your keystrokes, detects weak spots, 
              and generates personalized exercises to help you type faster and more accurately.
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-sm uppercase tracking-wider text-slate-300">Product</h4>
            <ul className="space-y-2">
              <li><Link href="/typing-test" className="text-sm text-slate-400 hover:text-brand-400 transition-colors">Typing Test</Link></li>
              <li><Link href="/dashboard" className="text-sm text-slate-400 hover:text-brand-400 transition-colors">Dashboard</Link></li>
              <li><Link href="/about" className="text-sm text-slate-400 hover:text-brand-400 transition-colors">About</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-sm uppercase tracking-wider text-slate-300">Connect</h4>
            <div className="flex gap-3">
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-lg bg-slate-800 flex items-center justify-center hover:bg-slate-700 transition-colors">
                <Github className="w-4 h-4" />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-lg bg-slate-800 flex items-center justify-center hover:bg-slate-700 transition-colors">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-lg bg-slate-800 flex items-center justify-center hover:bg-slate-700 transition-colors">
                <Linkedin className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-800/50 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-slate-500">
            &copy; {new Date().getFullYear()} KeyCoachAI. Built with <Heart className="w-3 h-3 inline text-red-400" /> by Maghfoor Ahmad.
          </p>
          <p className="text-xs text-slate-600">
            Powered by Next.js, MongoDB Atlas & LLM APIs
          </p>
        </div>
      </div>
    </footer>
  );
}
