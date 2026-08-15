"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { 
  Settings, Shield, Eye, EyeOff, TestTube, 
  Save, CheckCircle, XCircle, Server, KeyRound,
  Bot, ArrowLeft, Loader2, BookOpen, ArrowRight
} from "lucide-react";

interface AISettings {
  omnirouteBaseUrl: string;
  omnirouteApiKey: string;
  omnirouteModel: string;
  isConfigured: boolean;
  lastTested: string | null;
  testStatus: string;
}

export default function AdminPage() {
  const [settings, setSettings] = useState<AISettings>({
    omnirouteBaseUrl: "http://192.168.1.7:20128/v1",
    omnirouteApiKey: "",
    omnirouteModel: "gpt-4o-mini",
    isConfigured: false,
    lastTested: null,
    testStatus: "untested",
  });

  const [showApiKey, setShowApiKey] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string; latency?: number } | null>(null);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await fetch("/api/admin/settings");
      if (res.ok) {
        const data = await res.json();
        setSettings(prev => ({
          ...prev,
          ...data,
          omnirouteApiKey: data.omnirouteApiKey?.includes("•") ? prev.omnirouteApiKey : data.omnirouteApiKey,
        }));
      }
    } catch (error) {
      console.error("Failed to load settings:", error);
    }
  };

  const handleSave = async () => {
    setIsLoading(true);
    setMessage(null);

    try {
      const res = await fetch("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          omnirouteBaseUrl: settings.omnirouteBaseUrl,
          omnirouteApiKey: settings.omnirouteApiKey,
          omnirouteModel: settings.omnirouteModel,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage({ type: "success", text: "Settings saved successfully!" });
        setSettings(prev => ({ ...prev, isConfigured: true }));
      } else {
        setMessage({ type: "error", text: data.error || "Failed to save settings" });
      }
    } catch (error) {
      setMessage({ type: "error", text: "Network error. Please try again." });
    } finally {
      setIsLoading(false);
    }
  };

  const handleTest = async () => {
    setIsTesting(true);
    setTestResult(null);
    setMessage(null);

    try {
      const res = await fetch("/api/admin/test-connection", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          omnirouteBaseUrl: settings.omnirouteBaseUrl,
          omnirouteApiKey: settings.omnirouteApiKey,
          omnirouteModel: settings.omnirouteModel,
        }),
      });

      const data = await res.json();
      setTestResult(data);

      if (data.success) {
        setMessage({ type: "success", text: `Connection successful! ${data.message}` });
      } else {
        setMessage({ type: "error", text: data.message });
      }
    } catch (error) {
      setTestResult({ success: false, message: "Network error during test" });
      setMessage({ type: "error", text: "Failed to test connection. Check your network." });
    } finally {
      setIsTesting(false);
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-12 px-6">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/" className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-3">
              <Shield className="w-6 h-6 text-brand-400" />
              Admin — AI Settings
            </h1>
            <p className="text-slate-400 text-sm mt-1">
              Configure OmniRoute AI Gateway settings. These are stored securely on the server.
            </p>
          </div>
        </div>

        {/* Passage Manager Link */}
        <Link 
          href="/admin/passages"
          className="block mb-8 bg-gradient-to-r from-amber-900/30 to-slate-900 rounded-2xl p-6 border border-amber-500/20 hover:border-amber-500/40 transition-colors group"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-amber-400" />
              </div>
              <div>
                <h3 className="font-bold text-lg">Passage Manager</h3>
                <p className="text-slate-400 text-sm">Manage typing passages, add custom content, or generate with AI</p>
              </div>
            </div>
            <ArrowRight className="w-5 h-5 text-slate-500 group-hover:text-amber-400 transition-colors" />
          </div>
        </Link>

        {/* Status Banner */}
        <div className={`rounded-xl p-4 mb-8 border ${
          settings.isConfigured 
            ? "bg-green-500/10 border-green-500/20" 
            : "bg-yellow-500/10 border-yellow-500/20"
        }`}>
          <div className="flex items-center gap-3">
            {settings.isConfigured ? (
              <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
            ) : (
              <XCircle className="w-5 h-5 text-yellow-400 flex-shrink-0" />
            )}
            <div>
              <p className={`font-medium ${settings.isConfigured ? "text-green-400" : "text-yellow-400"}`}>
                {settings.isConfigured ? "OmniRoute is configured" : "OmniRoute is not configured"}
              </p>
              <p className="text-sm text-slate-400">
                {settings.lastTested 
                  ? `Last tested: ${new Date(settings.lastTested).toLocaleString()} — ${settings.testStatus}`
                  : "Connection has not been tested yet"}
              </p>
            </div>
          </div>
        </div>

        {/* Settings Form */}
        <div className="bg-slate-900 rounded-2xl p-8 border border-slate-800 space-y-6">
          <div className="flex items-center gap-3 mb-6">
            <Server className="w-5 h-5 text-brand-400" />
            <h2 className="text-lg font-semibold">OmniRoute Configuration</h2>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              OmniRoute Base URL
            </label>
            <div className="relative">
              <Server className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="url"
                value={settings.omnirouteBaseUrl}
                onChange={(e) => setSettings(prev => ({ ...prev, omnirouteBaseUrl: e.target.value }))}
                placeholder="http://192.168.1.7:20128/v1"
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-brand-500 transition-colors"
              />
            </div>
            <p className="text-xs text-slate-500 mt-1">
              The OpenAI-compatible API endpoint of your OmniRoute server.
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              OmniRoute API Key
            </label>
            <div className="relative">
              <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type={showApiKey ? "text" : "password"}
                value={settings.omnirouteApiKey}
                onChange={(e) => setSettings(prev => ({ ...prev, omnirouteApiKey: e.target.value }))}
                placeholder="sk-omniroute-..."
                className="w-full pl-10 pr-12 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-brand-500 transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowApiKey(!showApiKey)}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded hover:bg-slate-700 transition-colors"
              >
                {showApiKey ? <EyeOff className="w-4 h-4 text-slate-400" /> : <Eye className="w-4 h-4 text-slate-400" />}
              </button>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Generate this from OmniRoute&apos;s API Keys section. Stored securely — never exposed to users.
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              AI Model
            </label>
            <div className="relative">
              <Bot className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="text"
                value={settings.omnirouteModel}
                onChange={(e) => setSettings(prev => ({ ...prev, omnirouteModel: e.target.value }))}
                placeholder="gpt-4o-mini"
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-brand-500 transition-colors"
              />
            </div>
            <p className="text-xs text-slate-500 mt-1">
              The model to use via OmniRoute (e.g., gpt-4o-mini, gpt-4, claude-3-haiku, gemini-pro)
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <button
              onClick={handleTest}
              disabled={isTesting || !settings.omnirouteApiKey}
              className="flex-1 px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium transition-all flex items-center justify-center gap-2"
            >
              {isTesting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Testing...
                </>
              ) : (
                <>
                  <TestTube className="w-4 h-4" />
                  Test Connection
                </>
              )}
            </button>
            <button
              onClick={handleSave}
              disabled={isLoading || !settings.omnirouteApiKey}
              className="flex-1 px-6 py-3 rounded-xl bg-brand-600 hover:bg-brand-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium transition-all flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Save Settings
                </>
              )}
            </button>
          </div>

          {message && (
            <div className={`rounded-xl p-4 flex items-center gap-3 ${
              message.type === "success" 
                ? "bg-green-500/10 border border-green-500/20" 
                : "bg-red-500/10 border border-red-500/20"
            }`}>
              {message.type === "success" ? (
                <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
              ) : (
                <XCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
              )}
              <p className={message.type === "success" ? "text-green-400" : "text-red-400"}>
                {message.text}
              </p>
            </div>
          )}
        </div>

        {/* Architecture Info */}
        <div className="mt-8 bg-slate-900 rounded-2xl p-8 border border-slate-800">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <Settings className="w-5 h-5 text-brand-400" />
            Request Architecture
          </h3>
          <div className="font-mono text-sm bg-slate-950 rounded-xl p-6 overflow-x-auto border border-slate-800">
            <pre className="text-slate-300">
{`User Browser
    │
    ▼ (HTTPS)
Application Backend (Next.js API Routes)
    │
    ▼ (HTTP/HTTPS)
OmniRoute Gateway (192.168.1.7:20128)
    │
    ▼ (API Key secured in OmniRoute)
AI Provider (OpenAI / Gemini / Claude)`}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}
