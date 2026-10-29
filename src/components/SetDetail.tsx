import React, { useState } from 'react';
import type { StudySet, Folder } from '../types';
import { FlashcardsMode } from './FlashcardsMode';
import { LearnMode } from './LearnMode';
import { TestMode } from './TestMode';
import { MatchMode } from './MatchMode';
import { GravityMode } from './GravityMode';
import {
  BookOpen,
  BrainCircuit,
  FileCheck2,
  Zap,
  Flame,
  Star,
  ArrowLeft,
  Edit3,
  Share2,
  Printer,
  Volume2
} from 'lucide-react';

interface SetDetailProps {
  set: StudySet;
  folders: Folder[];
  onBack: () => void;
  onEdit: () => void;
  onTermStarToggle: (termId: string) => void;
  onStatsUpdate: (masteredDelta: number) => void;
}

export const SetDetail: React.FC<SetDetailProps> = ({
  set,
  onBack,
  onEdit,
  onTermStarToggle,
  onStatsUpdate
}) => {
  const [activeMode, setActiveMode] = useState<'flashcards' | 'learn' | 'test' | 'match' | 'gravity'>('flashcards');

  const handleTextToSpeech = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.95;
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-8 pb-16 animate-in fade-in duration-200">

      {/* Top Navigation & Action Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors w-fit"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={handleShare}
            className="p-2.5 text-slate-600 dark:text-slate-300 hover:text-slate-900 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 rounded-xl transition-colors shadow-2xs"
            title="Share Study Set"
          >
            <Share2 className="w-4 h-4" />
          </button>

          <button
            onClick={handlePrint}
            className="p-2.5 text-slate-600 dark:text-slate-300 hover:text-slate-900 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 rounded-xl transition-colors shadow-2xs"
            title="Print Flashcards"
          >
            <Printer className="w-4 h-4" />
          </button>

          <button
            onClick={onEdit}
            className="flex items-center gap-1.5 px-4 py-2 bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 dark:hover:bg-slate-700 text-white font-semibold text-xs rounded-xl transition-all shadow-xs border border-transparent dark:border-slate-700"
          >
            <Edit3 className="w-3.5 h-3.5" />
            Edit Set
          </button>
        </div>
      </div>

      {/* Set Header Info */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200/90 dark:border-slate-700 p-6 sm:p-8 shadow-xs space-y-4">
        <div className="flex flex-wrap items-center gap-2 text-xs font-bold text-slate-500 dark:text-slate-400">
          <span className="px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 tracking-wide">
            {set.category}
          </span>
          <span>•</span>
          <span>{set.terms.length} Terms</span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
          {set.title}
        </h1>

        {set.description && (
          <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed max-w-3xl">
            {set.description}
          </p>
        )}

        <div className="pt-2 flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
          <img
            src={set.author.avatar}
            alt={set.author.name}
            className="w-7 h-7 rounded-full object-cover ring-1 ring-slate-200 dark:ring-slate-700"
          />
          <div>
            <span className="font-semibold text-slate-700 dark:text-slate-300">{set.author.name}</span>
            <span className="mx-1 text-slate-300 dark:text-slate-600">•</span>
            <span>Created {new Date(set.createdAt).toLocaleDateString()}</span>
          </div>
        </div>
      </div>

      {/* Mode Selector Tabs */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <button
          onClick={() => setActiveMode('flashcards')}
          className={`p-3.5 rounded-2xl border text-left transition-all flex items-center gap-3 ${
            activeMode === 'flashcards'
              ? 'bg-indigo-600 border-indigo-600 text-white shadow-md shadow-indigo-200 dark:shadow-none'
              : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 shadow-2xs'
          }`}
        >
          <div className={`p-2 rounded-xl ${activeMode === 'flashcards' ? 'bg-indigo-500/50 text-white' : 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400'}`}>
            <BookOpen className="w-4 h-4" />
          </div>
          <div>
            <div className="font-bold text-xs sm:text-sm">Flashcards</div>
            <div className={`text-[11px] ${activeMode === 'flashcards' ? 'text-indigo-100' : 'text-slate-400'}`}>Flip & Learn</div>
          </div>
        </button>

        <button
          onClick={() => setActiveMode('learn')}
          className={`p-3.5 rounded-2xl border text-left transition-all flex items-center gap-3 ${
            activeMode === 'learn'
              ? 'bg-indigo-600 border-indigo-600 text-white shadow-md shadow-indigo-200 dark:shadow-none'
              : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 shadow-2xs'
          }`}
        >
          <div className={`p-2 rounded-xl ${activeMode === 'learn' ? 'bg-indigo-500/50 text-white' : 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400'}`}>
            <BrainCircuit className="w-4 h-4" />
          </div>
          <div>
            <div className="font-bold text-xs sm:text-sm">Learn</div>
            <div className={`text-[11px] ${activeMode === 'learn' ? 'text-indigo-100' : 'text-slate-400'}`}>Adaptive Recall</div>
          </div>
        </button>

        <button
          onClick={() => setActiveMode('test')}
          className={`p-3.5 rounded-2xl border text-left transition-all flex items-center gap-3 ${
            activeMode === 'test'
              ? 'bg-indigo-600 border-indigo-600 text-white shadow-md shadow-indigo-200 dark:shadow-none'
              : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 shadow-2xs'
          }`}
        >
          <div className={`p-2 rounded-xl ${activeMode === 'test' ? 'bg-indigo-500/50 text-white' : 'bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400'}`}>
            <FileCheck2 className="w-4 h-4" />
          </div>
          <div>
            <div className="font-bold text-xs sm:text-sm">Test</div>
            <div className={`text-[11px] ${activeMode === 'test' ? 'text-indigo-100' : 'text-slate-400'}`}>Practice Quiz</div>
          </div>
        </button>

        <button
          onClick={() => setActiveMode('match')}
          className={`p-3.5 rounded-2xl border text-left transition-all flex items-center gap-3 ${
            activeMode === 'match'
              ? 'bg-indigo-600 border-indigo-600 text-white shadow-md shadow-indigo-200 dark:shadow-none'
              : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 shadow-2xs'
          }`}
        >
          <div className={`p-2 rounded-xl ${activeMode === 'match' ? 'bg-indigo-500/50 text-white' : 'bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400'}`}>
            <Zap className="w-4 h-4" />
          </div>
          <div>
            <div className="font-bold text-xs sm:text-sm">Match</div>
            <div className={`text-[11px] ${activeMode === 'match' ? 'text-indigo-100' : 'text-slate-400'}`}>Timed Grid</div>
          </div>
        </button>

        <button
          onClick={() => setActiveMode('gravity')}
          className={`p-3.5 rounded-2xl border text-left transition-all flex items-center gap-3 ${
            activeMode === 'gravity'
              ? 'bg-indigo-600 border-indigo-600 text-white shadow-md shadow-indigo-200 dark:shadow-none'
              : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 shadow-2xs'
          }`}
        >
          <div className={`p-2 rounded-xl ${activeMode === 'gravity' ? 'bg-indigo-500/50 text-white' : 'bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400'}`}>
            <Flame className="w-4 h-4" />
          </div>
          <div>
            <div className="font-bold text-xs sm:text-sm">Gravity</div>
            <div className={`text-[11px] ${activeMode === 'gravity' ? 'text-indigo-100' : 'text-slate-400'}`}>Arcade Speed</div>
          </div>
        </button>
      </div>

      {/* Active Mode Workspace */}
      <div className="pt-2">
        {activeMode === 'flashcards' && (
          <FlashcardsMode set={set} onTermStarToggle={onTermStarToggle} />
        )}
        {activeMode === 'learn' && (
          <LearnMode set={set} onComplete={(score) => onStatsUpdate(score)} />
        )}
        {activeMode === 'test' && (
          <TestMode set={set} onComplete={(score) => onStatsUpdate(score)} />
        )}
        {activeMode === 'match' && (
          <MatchMode set={set} onHighScoreUpdate={() => onStatsUpdate(2)} />
        )}
        {activeMode === 'gravity' && (
          <GravityMode set={set} onHighScoreUpdate={() => onStatsUpdate(3)} />
        )}
      </div>

      {/* Terms List Summary */}
      <div className="space-y-4 pt-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
            Terms in this set ({set.terms.length})
          </h3>
          <span className="text-xs text-slate-400 font-medium">Click audio icon to listen</span>
        </div>

        <div className="space-y-3">
          {set.terms.map((term, index) => (
            <div
              key={term.id}
              className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200/80 dark:border-slate-700 p-5 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4 group hover:border-indigo-200 dark:hover:border-indigo-700 transition-colors"
            >
              <div className="md:w-1/3 text-sm font-bold text-slate-900 dark:text-white flex items-start gap-3">
                <span className="text-xs font-semibold text-slate-400 dark:text-slate-500 mt-0.5">#{index + 1}</span>
                <span>{term.term}</span>
              </div>

              <div className="md:w-1/2 text-sm font-normal text-slate-600 dark:text-slate-300 border-t md:border-t-0 md:border-l border-slate-100 dark:border-slate-700 pt-3 md:pt-0 md:pl-4">
                {term.definition}
              </div>

              <div className="flex items-center justify-end gap-2 shrink-0">
                <button
                  onClick={() => handleTextToSpeech(`${term.term}. Definition: ${term.definition}`)}
                  className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl transition-colors"
                  title="Listen"
                >
                  <Volume2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onTermStarToggle(term.id)}
                  className="p-2 text-slate-400 hover:text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-950/40 rounded-xl transition-colors"
                  title="Star Term"
                >
                  <Star className={`w-4 h-4 ${term.starred ? 'fill-amber-400 text-amber-400' : ''}`} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
