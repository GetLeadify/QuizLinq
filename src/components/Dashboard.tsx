import React from 'react';
import type { StudySet, Folder, UserStats } from '../types';
import {
  Sparkles,
  Layers,
  Clock,
  Trophy,
  BookOpen,
  Folder as FolderIcon,
  Plus,
  ChevronRight,
  TrendingUp,
  Brain
} from 'lucide-react';

interface DashboardProps {
  sets: StudySet[];
  folders: Folder[];
  stats: UserStats;
  searchQuery: string;
  onSelectSet: (set: StudySet) => void;
  onOpenCreateSet: () => void;
  onOpenCreateFolder: () => void;
  onNavigateToAI: () => void;
  onSelectCategory: (category: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  sets,
  folders,
  stats,
  searchQuery,
  onSelectSet,
  onOpenCreateSet,
  onNavigateToAI,
  onSelectCategory
}) => {

  const filteredSets = React.useMemo(() => {
    if (!searchQuery.trim()) return sets;
    const q = searchQuery.toLowerCase();
    return sets.filter(s =>
      s.title.toLowerCase().includes(q) ||
      s.description.toLowerCase().includes(q) ||
      s.category.toLowerCase().includes(q) ||
      s.terms.some(t => t.term.toLowerCase().includes(q) || t.definition.toLowerCase().includes(q))
    );
  }, [sets, searchQuery]);

  const categories = React.useMemo(() => {
    const map = new Map<string, number>();
    sets.forEach(s => {
      map.set(s.category, (map.get(s.category) || 0) + 1);
    });
    return Array.from(map.entries()).map(([name, count]) => ({ name, count }));
  }, [sets]);

  return (
    <div className="space-y-8 pb-12">

      {/* Hero Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-700 via-indigo-600 to-sky-600 p-8 md:p-10 text-white shadow-xl">
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        <div className="relative z-10 max-w-2xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-semibold text-indigo-100">
            <Sparkles className="w-3.5 h-3.5 text-amber-300 fill-amber-300" />
            AI-Powered Flashcards & Practice
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight leading-tight">
            Master Any Subject with QuizLinq
          </h1>
          <p className="text-indigo-100 text-sm sm:text-base leading-relaxed">
            Create interactive flashcards, practice with adaptive Learn modes, test your speed in Match games, or auto-generate study materials using AI.
          </p>
          <div className="pt-2 flex flex-wrap gap-3">
            <button
              onClick={onOpenCreateSet}
              className="px-5 py-2.5 bg-white text-indigo-700 hover:bg-slate-100 font-bold text-sm rounded-xl transition-all shadow-md flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Create Study Set
            </button>
            <button
              onClick={onNavigateToAI}
              className="px-5 py-2.5 bg-indigo-900/40 hover:bg-indigo-900/60 text-white font-semibold text-sm rounded-xl border border-white/20 backdrop-blur-md transition-all flex items-center gap-2"
            >
              <Brain className="w-4 h-4 text-amber-300" />
              AI Quiz Generator
            </button>
          </div>
        </div>
      </div>

      {/* Quick Stats Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900">{sets.length}</div>
            <div className="text-xs font-medium text-slate-500">Study Sets</div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <Trophy className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900">{stats.termsMasteredCount}</div>
            <div className="text-xs font-medium text-slate-500">Terms Mastered</div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center font-bold">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900">{stats.setsStudiedCount}</div>
            <div className="text-xs font-medium text-slate-500">Sessions Completed</div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
            <FolderIcon className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900">{folders.length}</div>
            <div className="text-xs font-medium text-slate-500">Folders</div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-indigo-600" />
              {searchQuery ? `Search Results for "${searchQuery}"` : 'Recent & Recommended Study Sets'}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">Pick up where you left off or explore new sets</p>
          </div>
        </div>

        {filteredSets.length === 0 ? (
          <div className="bg-white rounded-2xl p-10 text-center border border-dashed border-slate-300">
            <Layers className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-base font-semibold text-slate-800">No study sets found</h3>
            <p className="text-sm text-slate-500 mt-1 max-w-sm mx-auto">
              Try adjusting your search query or create a brand new set to get started.
            </p>
            <button
              onClick={onOpenCreateSet}
              className="mt-4 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm rounded-xl transition-colors"
            >
              Create New Set
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredSets.map(set => (
              <div
                key={set.id}
                onClick={() => onSelectSet(set)}
                className="group bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs hover:shadow-md hover:border-indigo-300 transition-all duration-200 cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="px-2.5 py-1 rounded-md bg-indigo-50 text-indigo-700 font-semibold text-xs tracking-wide">
                      {set.category}
                    </span>
                    <span className="text-xs font-medium text-slate-400">
                      {set.terms.length} terms
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-1">
                    {set.title}
                  </h3>

                  <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                    {set.description || 'No description provided.'}
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <img
                      src={set.author.avatar}
                      alt={set.author.name}
                      className="w-6 h-6 rounded-full object-cover ring-1 ring-slate-200"
                    />
                    <span className="text-xs font-medium text-slate-600">{set.author.name}</span>
                  </div>

                  <div className="flex items-center text-xs font-bold text-indigo-600 group-hover:translate-x-1 transition-transform">
                    <span>Study</span>
                    <ChevronRight className="w-4 h-4 ml-0.5" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Explore Categories / Subjects */}
      {categories.length > 0 && (
        <div className="pt-4">
          <h2 className="text-lg font-bold text-slate-900 mb-3">Explore Subjects</h2>
          <div className="flex flex-wrap gap-2">
            {categories.map(cat => (
              <button
                key={cat.name}
                onClick={() => onSelectCategory(cat.name)}
                className="px-4 py-2 bg-white hover:bg-slate-100 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 hover:text-indigo-600 transition-all flex items-center gap-2 shadow-2xs"
              >
                <span>{cat.name}</span>
                <span className="px-1.5 py-0.5 rounded-full bg-slate-100 text-slate-500 text-[10px]">
                  {cat.count}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
