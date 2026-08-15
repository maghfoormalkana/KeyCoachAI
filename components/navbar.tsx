"use client";

import Link from "next/link";
import { useState } from "react";
import { Keyboard, Menu, X, Shield } from "lucide-react";
import { UserButton } from "@/components/auth/UserButton";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/typing-test", label: "Typing Test" },
  { href: "/dashboard", label: "Dashboard" },
];

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-950/80 backdrop-blur-xl border-b border-slate-800/50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          {/* <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-brand-500 to-accent-500 flex items-center justify-center">
            <Keyboard className="w-5 h-5 text-white" />
          </div> */}
          
            <img
              src="/logo.png"
              alt="Logo"
              className="w-20 h-20 object-contain"
            />
          
          <span className="font-bold text-xl tracking-tight">
            KeyCoach<span className="text-brand-400">AI</span>
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-slate-300 hover:text-white transition-colors"
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/admin"
            className="text-sm font-medium text-slate-400 hover:text-brand-400 transition-colors flex items-center gap-1"
          >
            <Shield className="w-3.5 h-3.5" />
            Admin
          </Link>
        </div>

        <div className="flex items-center gap-3">
          <UserButton />
          <button
            className="md:hidden p-2 rounded-lg hover:bg-slate-800 transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden glass-dark border-t border-slate-800">
          <div className="px-6 py-4 flex flex-col gap-3">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium py-2 hover:text-brand-400 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/admin"
              className="text-sm font-medium py-2 hover:text-brand-400 transition-colors flex items-center gap-1"
              onClick={() => setMobileMenuOpen(false)}
            >
              <Shield className="w-3.5 h-3.5" />
              Admin
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
