"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { 
  BookOpen, Plus, Trash2, Edit3, Sparkles, Loader2,
  Search, Filter, ArrowLeft, Save, X, Wand2,
  Type, Hash, Tag, AlertCircle, CheckCircle,
  ChevronDown, RefreshCw
} from "lucide-react";

interface Passage {
  _id: string;
  title: string;
  content: string;
  category: string;
  difficulty: string;
  wordCount: number;
  createdAt: string;
}

const CATEGORIES = [
  "general", "books", "poems", "quotes", "code", 
  "science", "history", "technology", "movies", "sports"
];

const DIFFICULTIES = ["easy", "medium", "hard"];

export default function AdminPassagesPage() {
  const [passages, setPassages] = useState<Passage[]>([]);
  const [filteredPassages, setFilteredPassages] = useState<Passage[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(true);

  // Add/Edit modal state
  const [showModal, setShowModal] = useState(false);
  const [editingPassage, setEditingPassage] = useState<Passage | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    category: "general",
    difficulty: "medium",
  });

  // AI Generate state
  const [showAIGenerate, setShowAIGenerate] = useState(false);
  const [aiPrompt, setAiPrompt] = useState("");
  const [aiCategory, setAiCategory] = useState("general");
  const [aiDifficulty, setAiDifficulty] = useState("medium");
  const [aiWordCount, setAiWordCount] = useState(300);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedPreview, setGeneratedPreview] = useState<any>(null);

  // Load passages
  useEffect(() => {
    fetchPassages();
  }, []);

  // Filter passages
  useEffect(() => {
    let filtered = passages;

    if (searchQuery) {
      filtered = filtered.filter(p => 
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.content.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (categoryFilter !== "all") {
      filtered = filtered.filter(p => p.category === categoryFilter);
    }

    setFilteredPassages(filtered);
  }, [passages, searchQuery, categoryFilter]);

  const fetchPassages = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/passages");
      const data = await res.json();
      setPassages(data.passages || []);
    } catch (error) {
      console.error("Failed to load passages:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      const url = editingPassage 
        ? `/api/passages/${editingPassage._id}` 
        : "/api/passages";
      const method = editingPassage ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setShowModal(false);
        setEditingPassage(null);
        setFormData({ title: "", content: "", category: "general", difficulty: "medium" });
        fetchPassages();
      }
    } catch (error) {
      console.error("Save error:", error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this passage?")) return;

    try {
      const res = await fetch(`/api/passages/${id}`, { method: "DELETE" });
      if (res.ok) fetchPassages();
    } catch (error) {
      console.error("Delete error:", error);
    }
  };

  const handleEdit = (passage: Passage) => {
    setEditingPassage(passage);
    setFormData({
      title: passage.title,
      content: passage.content,
      category: passage.category,
      difficulty: passage.difficulty,
    });
    setShowModal(true);
  };

  const handleAddNew = () => {
    setEditingPassage(null);
    setFormData({ title: "", content: "", category: "general", difficulty: "medium" });
    setShowModal(true);
  };

  const handleAIGenerate = async () => {
    if (!aiPrompt.trim()) return;

    setIsGenerating(true);
    setGeneratedPreview(null);

    try {
      const res = await fetch("/api/passages/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: aiPrompt,
          category: aiCategory,
          difficulty: aiDifficulty,
          wordCount: aiWordCount,
        }),
      });

      const data = await res.json();

      if (data.error) {
        alert(data.error);
      } else {
        setGeneratedPreview(data);
      }
    } catch (error) {
      console.error("AI generation error:", error);
      alert("Failed to generate passage");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSaveGenerated = async () => {
    if (!generatedPreview) return;

    try {
      const res = await fetch("/api/passages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: generatedPreview.title,
          content: generatedPreview.content,
          category: aiCategory,
          difficulty: aiDifficulty,
        }),
      });

      if (res.ok) {
        setShowAIGenerate(false);
        setGeneratedPreview(null);
        setAiPrompt("");
        fetchPassages();
      }
    } catch (error) {
      console.error("Save generated error:", error);
    }
  };

  const getCategoryColor = (cat: string) => {
    const colors: Record<string, string> = {
      books: "bg-amber-500/10 text-amber-400",
      poems: "bg-purple-500/10 text-purple-400",
      quotes: "bg-blue-500/10 text-blue-400",
      code: "bg-green-500/10 text-green-400",
      science: "bg-cyan-500/10 text-cyan-400",
      history: "bg-orange-500/10 text-orange-400",
      technology: "bg-indigo-500/10 text-indigo-400",
      movies: "bg-pink-500/10 text-pink-400",
      sports: "bg-red-500/10 text-red-400",
      general: "bg-slate-500/10 text-slate-400",
    };
    return colors[cat] || colors.general;
  };

  const getDifficultyColor = (diff: string) => {
    const colors: Record<string, string> = {
      easy: "bg-green-500/10 text-green-400",
      medium: "bg-yellow-500/10 text-yellow-400",
      hard: "bg-red-500/10 text-red-400",
    };
    return colors[diff] || colors.medium;
  };

  return (
    <div className="min-h-screen pt-24 pb-12 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link href="/admin" className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold flex items-center gap-2">
                <BookOpen className="w-6 h-6 text-brand-400" />
                Passage Manager
              </h1>
              <p className="text-slate-400 text-sm">Manage typing passages — {passages.length} total</p>
            </div>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setShowAIGenerate(true)}
              className="px-4 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-brand-600 hover:from-purple-500 hover:to-brand-500 text-white text-sm font-medium transition-all flex items-center gap-2"
            >
              <Wand2 className="w-4 h-4" />
              AI Generate
            </button>
            <button
              onClick={handleAddNew}
              className="px-4 py-2 rounded-lg bg-brand-600 hover:bg-brand-500 text-white text-sm font-medium transition-colors flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add Passage
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search passages..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-brand-500 transition-colors"
            />
          </div>
          <div className="flex gap-2">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-brand-500"
            >
              <option value="all">All Categories</option>
              {CATEGORIES.map(cat => (
                <option key={cat} value={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</option>
              ))}
            </select>
            <button
              onClick={fetchPassages}
              className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Passages Grid */}
        {isLoading ? (
          <div className="text-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-brand-400 mx-auto" />
          </div>
        ) : filteredPassages.length === 0 ? (
          <div className="text-center py-12 bg-slate-900 rounded-2xl border border-slate-800">
            <BookOpen className="w-12 h-12 text-slate-600 mx-auto mb-4" />
            <p className="text-slate-400">No passages found</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {filteredPassages.map((passage) => (
              <div
                key={passage._id}
                className="bg-slate-900 rounded-xl p-5 border border-slate-800 hover:border-slate-700 transition-colors group"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold text-white truncate">{passage.title}</h3>
                      <span className={`px-2 py-0.5 rounded text-xs font-medium ${getCategoryColor(passage.category)}`}>
                        {passage.category}
                      </span>
                      <span className={`px-2 py-0.5 rounded text-xs font-medium ${getDifficultyColor(passage.difficulty)}`}>
                        {passage.difficulty}
                      </span>
                    </div>
                    <p className="text-sm text-slate-400 line-clamp-2 mb-2">{passage.content}</p>
                    <div className="flex items-center gap-4 text-xs text-slate-500">
                      <span className="flex items-center gap-1">
                        <Hash className="w-3 h-3" />
                        {passage.wordCount} words
                      </span>
                      <span className="flex items-center gap-1">
                        <Type className="w-3 h-3" />
                        {passage.content.length} chars
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => handleEdit(passage)}
                      className="p-2 rounded-lg bg-slate-800 hover:bg-brand-600 text-slate-400 hover:text-white transition-colors"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(passage._id)}
                      className="p-2 rounded-lg bg-slate-800 hover:bg-red-600 text-slate-400 hover:text-white transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-slate-900 rounded-2xl p-6 w-full max-w-2xl border border-slate-800 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">
                {editingPassage ? "Edit Passage" : "Add New Passage"}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 rounded-lg hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g., The Great Gatsby - Opening"
                  className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-brand-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-brand-500"
                  >
                    {CATEGORIES.map(cat => (
                      <option key={cat} value={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Difficulty</label>
                  <select
                    value={formData.difficulty}
                    onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-brand-500"
                  >
                    {DIFFICULTIES.map(diff => (
                      <option key={diff} value={diff}>{diff.charAt(0).toUpperCase() + diff.slice(1)}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Content</label>
                <textarea
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  placeholder="Type or paste the passage content here..."
                  rows={8}
                  className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-brand-500 resize-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={!formData.title || !formData.content}
                  className="px-6 py-3 rounded-xl bg-brand-600 hover:bg-brand-500 disabled:opacity-50 text-white font-medium transition-colors flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  {editingPassage ? "Update" : "Save"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* AI Generate Modal */}
      {showAIGenerate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-slate-900 rounded-2xl p-6 w-full max-w-2xl border border-slate-800 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-purple-400" />
                AI Generate Long Passage
              </h2>
              <button
                onClick={() => {
                  setShowAIGenerate(false);
                  setGeneratedPreview(null);
                }}
                className="p-2 rounded-lg hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {!generatedPreview ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    What should the passage be about?
                  </label>
                  <textarea
                    value={aiPrompt}
                    onChange={(e) => setAiPrompt(e.target.value)}
                    placeholder="e.g., A passage about space exploration, or a dialogue from a mystery novel, or a technical explanation of how databases work..."
                    rows={3}
                    className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-brand-500 resize-none"
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Category</label>
                    <select
                      value={aiCategory}
                      onChange={(e) => setAiCategory(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-brand-500"
                    >
                      {CATEGORIES.map(cat => (
                        <option key={cat} value={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Difficulty</label>
                    <select
                      value={aiDifficulty}
                      onChange={(e) => setAiDifficulty(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-brand-500"
                    >
                      {DIFFICULTIES.map(diff => (
                        <option key={diff} value={diff}>{diff.charAt(0).toUpperCase() + diff.slice(1)}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Word Count 
                      <span className="text-slate-500 text-xs ml-1">(150-800, default 300 for long passages)</span>
                    </label>
                    <input
                      type="number"
                      value={aiWordCount}
                      onChange={(e) => setAiWordCount(Number(e.target.value))}
                      min={150}
                      max={800}
                      className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-brand-500"
                    />
                    <p className="text-xs text-slate-500 mt-1">
                      {aiWordCount < 200 ? "Short — good for 1-2 min tests" : 
                       aiWordCount < 400 ? "Medium — good for 3-5 min tests" : 
                       aiWordCount < 600 ? "Long — good for 5-8 min tests" : 
                       "Extra Long — good for 10+ min tests"}
                    </p>
                  </div>
                </div>

                <button
                  onClick={handleAIGenerate}
                  disabled={!aiPrompt.trim() || isGenerating}
                  className="w-full px-6 py-4 rounded-xl bg-gradient-to-r from-purple-600 to-brand-600 hover:from-purple-500 hover:to-brand-500 disabled:opacity-50 text-white font-semibold transition-all flex items-center justify-center gap-2"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Generating via AI...
                    </>
                  ) : (
                    <>
                      <Wand2 className="w-5 h-5" />
                      Generate Passage
                    </>
                  )}
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-green-400 mb-4">
                  <CheckCircle className="w-5 h-5" />
                  <span className="font-medium">Passage Generated!</span>
                </div>

                <div className="bg-slate-800 rounded-xl p-4 border border-slate-700">
                  <h3 className="font-semibold text-white mb-2">{generatedPreview.title}</h3>
                  <p className="text-sm text-slate-300 leading-relaxed">{generatedPreview.content}</p>
                  <div className="flex items-center gap-4 mt-3 text-xs text-slate-500">
                    <span className={getCategoryColor(aiCategory)}>
                      {aiCategory}
                    </span>
                    <span className={getDifficultyColor(aiDifficulty)}>
                      {aiDifficulty}
                    </span>
                    <span>{generatedPreview.content.split(/\s+/).length} words</span>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setGeneratedPreview(null)}
                    className="flex-1 px-4 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-medium transition-colors"
                  >
                    Regenerate
                  </button>
                  <button
                    onClick={handleSaveGenerated}
                    className="flex-1 px-4 py-3 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-medium transition-colors flex items-center justify-center gap-2"
                  >
                    <Save className="w-4 h-4" />
                    Save to Database
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
