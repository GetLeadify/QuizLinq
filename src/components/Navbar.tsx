import React from 'react';
import type { UserStats } from '../types';
import {
  Sparkles,
  Search,
  Plus,
  FolderPlus,
  BookOpen,
  Flame,
  BrainCircuit,
  LayoutGrid
} from 'lucide-react';

interface NavbarProps {
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  activeView: string;
  setActiveView: (view: string) => void;
  onOpenCreateSet: () => void;
  onOpenCreateFolder: () => void;
  stats: UserStats;
}

export const Navbar: React.FC<NavbarProps> = ({
  searchQuery,
  setSearchQuery,
  activeView,
  setActiveView,
  onOpenCreateSet,
  onOpenCreateFolder,
  stats
}) => {
  const [showCreateMenu, setShowCreateMenu] = React.useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">

        {/* Brand Logo */}
        <div className="flex items-center gap-6">
          <button
            onClick={() => setActiveView('dashboard')}
            className="flex items-center gap-2 group text-left focus:outline-none"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-sky-400 flex items-center justify-center text-white shadow-md shadow-indigo-200 group-hover:scale-105 transition-transform">
              <BrainCircuit className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xl font-black bg-gradient-to-r from-indigo-600 to-sky-600 bg-clip-text text-transparent">
                QuizLinq
              </span>
              <span className="block text-[10px] font-semibold tracking-wider text-slate-400 uppercase -mt-1">
                Study Smart
              </span>
            </div>
          </button>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-1">
            <button
              onClick={() => setActiveView('dashboard')}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${
                activeView === 'dashboard'
                  ? 'bg-indigo-50 text-indigo-600'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <LayoutGrid className="w-4 h-4" />
              Dashboard
            </button>
            <button
              onClick={() => setActiveView('library')}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${
                activeView === 'library'
                  ? 'bg-indigo-50 text-indigo-600'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              Your Library
            </button>
            <button
              onClick={() => setActiveView('ai-assistant')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${
                activeView === 'ai-assistant'
                  ? 'bg-indigo-50 text-indigo-600'
                  : 'text-amber-700 bg-amber-50 hover:bg-amber-100'
              }`}
            >
              <Sparkles className="w-4 h-4 text-amber-500 fill-amber-400" />
              AI Assistant
            </button>
          </nav>
        </div>

        {/* Search Bar */}
        <div className="flex-1 max-w-md hidden sm:block">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search terms, subjects, or sets..."
              className="w-full pl-9 pr-4 py-2 bg-slate-100 hover:bg-slate-200/70 focus:bg-white text-sm text-slate-900 rounded-xl border border-transparent focus:border-indigo-500 focus:outline-none transition-all shadow-inner"
            />
          </div>
        </div>

        {/* Right Section / Actions & Stats */}
        <div className="flex items-center gap-3">
          {/* Daily Streak Indicator */}
          <div
            className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 border border-amber-200 text-amber-700 rounded-full text-xs font-bold shadow-xs cursor-default"
            title={`${stats.streakDays} day streak! Keep practicing daily.`}
          >
            <Flame className="w-4 h-4 text-amber-500 fill-amber-500 animate-pulse" />
            <span>{stats.streakDays} Day Streak</span>
          </div>

          {/* Create Button Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowCreateMenu(!showCreateMenu)}
              className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-semibold text-sm px-4 py-2 rounded-xl transition-all shadow-sm shadow-indigo-200"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Create</span>
            </button>

            {showCreateMenu && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setShowCreateMenu(false)}
                />
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-slate-100 py-1.5 z-20 animate-in fade-in slide-in-from-top-2 duration-150">
                  <button
                    onClick={() => {
                      setShowCreateMenu(false);
                      onOpenCreateSet();
                    }}
                    className="w-full text-left px-4 py-2 text-sm font-medium text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4 text-indigo-500" />
                    Study Set
                  </button>
                  <button
                    onClick={() => {
                      setShowCreateMenu(false);
                      onOpenCreateFolder();
                    }}
                    className="w-full text-left px-4 py-2 text-sm font-medium text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 flex items-center gap-2"
                  >
                    <FolderPlus className="w-4 h-4 text-emerald-500" />
                    Folder
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

      </div>
    </header>
  );
};
