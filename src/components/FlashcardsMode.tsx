import React, { useState, useEffect } from 'react';
import type { StudySet, Term } from '../types';
import {
  Volume2,
  RotateCw,
  Shuffle,
  Star,
  ChevronLeft,
  ChevronRight,
  ArrowLeftRight,
  Gauge
} from 'lucide-react';

interface FlashcardsModeProps {
  set: StudySet;
  onTermStarToggle: (termId: string) => void;
}

export const FlashcardsMode: React.FC<FlashcardsModeProps> = ({ set, onTermStarToggle }) => {
  const [terms, setTerms] = useState<Term[]>(set.terms);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isShuffled, setIsShuffled] = useState(false);
  const [filterStarred, setFilterStarred] = useState(false);

  // Quizlet Feature: Answer with Term or Definition first
  const [startWithDefinition, setStartWithDefinition] = useState(false);

  // Quizlet Feature: Audio Speech Rate (1.0x or 0.7x slow)
  const [slowAudio, setSlowAudio] = useState(false);

  useEffect(() => {
    let activeTerms = set.terms;
    if (filterStarred) {
      activeTerms = set.terms.filter(t => t.starred);
      if (activeTerms.length === 0) {
        activeTerms = set.terms;
      }
    }
    setTerms(activeTerms);
    setCurrentIndex(0);
    setIsFlipped(false);
  }, [set, filterStarred]);

  const currentTerm = terms[currentIndex] || terms[0];

  const handleNext = () => {
    setIsFlipped(false);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % terms.length);
    }, 150);
  };

  const handlePrev = () => {
    setIsFlipped(false);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev - 1 + terms.length) % terms.length);
    }, 150);
  };

  const handleShuffle = () => {
    const shuffled = [...terms].sort(() => Math.random() - 0.5);
    setTerms(shuffled);
    setCurrentIndex(0);
    setIsFlipped(false);
    setIsShuffled(true);
  };

  const handleTextToSpeech = (e: React.MouseEvent, text: string) => {
    e.stopPropagation();
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = slowAudio ? 0.65 : 0.95;
      window.speechSynthesis.speak(utterance);
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault();
        setIsFlipped(prev => !prev);
      } else if (e.code === 'ArrowRight') {
        handleNext();
      } else if (e.code === 'ArrowLeft') {
        handlePrev();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [terms]);

  if (!currentTerm) {
    return <div className="text-center py-10 text-slate-500">No flashcards available.</div>;
  }

  // Front vs Back content based on orientation preference
  const frontContent = startWithDefinition ? currentTerm.definition : currentTerm.term;
  const backContent = startWithDefinition ? currentTerm.term : currentTerm.definition;
  const frontLabel = startWithDefinition ? 'Definition' : 'Term';
  const backLabel = startWithDefinition ? 'Term' : 'Definition';

  return (
    <div className="max-w-3xl mx-auto space-y-6">

      {/* Controls Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-semibold text-slate-600 bg-white dark:bg-slate-800 p-3 rounded-2xl border border-slate-200/80 dark:border-slate-700 shadow-2xs">
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleShuffle}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-colors ${
              isShuffled ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/60 dark:text-indigo-300' : 'hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300'
            }`}
          >
            <Shuffle className="w-3.5 h-3.5" />
            Shuffle
          </button>

          <button
            onClick={() => setFilterStarred(!filterStarred)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-colors ${
              filterStarred ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-300' : 'hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300'
            }`}
          >
            <Star className={`w-3.5 h-3.5 ${filterStarred ? 'fill-amber-500 text-amber-500' : ''}`} />
            Starred ({set.terms.filter(t => t.starred).length})
          </button>

          <button
            onClick={() => setStartWithDefinition(!startWithDefinition)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors"
            title="Switch front/back orientation"
          >
            <ArrowLeftRight className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
            <span>Show {startWithDefinition ? 'Definition First' : 'Term First'}</span>
          </button>

          <button
            onClick={() => setSlowAudio(!slowAudio)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-colors ${
              slowAudio ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/60 dark:text-indigo-300' : 'hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300'
            }`}
            title="Toggle Audio Speed"
          >
            <Gauge className="w-3.5 h-3.5" />
            <span>{slowAudio ? 'Audio: 0.7x (Slow)' : 'Audio: 1.0x'}</span>
          </button>
        </div>

        <div className="text-slate-400 dark:text-slate-500 font-medium hidden md:block">
          <kbd className="px-1.5 py-0.5 bg-slate-100 dark:bg-slate-700 border rounded text-[10px]">Space</kbd> flip
        </div>
      </div>

      {/* 3D Flip Card Container */}
      <div
        onClick={() => setIsFlipped(!isFlipped)}
        className="perspective-1000 w-full h-[360px] sm:h-[420px] cursor-pointer group"
      >
        <div
          className={`relative w-full h-full duration-500 transform-style-3d transition-transform ${
            isFlipped ? 'rotate-y-180' : ''
          }`}
        >
          {/* Front Side */}
          <div className="absolute inset-0 w-full h-full bg-white dark:bg-slate-800 border border-slate-200/90 dark:border-slate-700 rounded-3xl p-8 sm:p-12 shadow-md flex flex-col justify-between backface-hidden group-hover:border-indigo-300 transition-colors">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold uppercase tracking-widest text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-3 py-1 rounded-full">
                {frontLabel}
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={(e) => handleTextToSpeech(e, frontContent)}
                  className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full transition-colors"
                  title="Listen"
                >
                  <Volume2 className="w-5 h-5" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onTermStarToggle(currentTerm.id);
                  }}
                  className="p-2 text-slate-400 hover:text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-950/40 rounded-full transition-colors"
                  title="Star Term"
                >
                  <Star className={`w-5 h-5 ${currentTerm.starred ? 'fill-amber-400 text-amber-400' : ''}`} />
                </button>
              </div>
            </div>

            <div className="my-auto text-center px-4">
              <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white leading-relaxed">
                {frontContent}
              </p>
            </div>

            <div className="text-center text-xs font-semibold text-slate-400 dark:text-slate-500 flex items-center justify-center gap-1">
              <RotateCw className="w-3.5 h-3.5" />
              Click or press Space to flip
            </div>
          </div>

          {/* Back Side */}
          <div className="absolute inset-0 w-full h-full bg-indigo-900 dark:bg-indigo-950 text-white border border-indigo-800 dark:border-indigo-900 rounded-3xl p-8 sm:p-12 shadow-md flex flex-col justify-between backface-hidden rotate-y-180">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold uppercase tracking-widest text-indigo-200 bg-indigo-800/80 dark:bg-indigo-900/80 px-3 py-1 rounded-full">
                {backLabel}
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={(e) => handleTextToSpeech(e, backContent)}
                  className="p-2 text-indigo-300 hover:text-white hover:bg-indigo-800/60 rounded-full transition-colors"
                  title="Listen"
                >
                  <Volume2 className="w-5 h-5" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onTermStarToggle(currentTerm.id);
                  }}
                  className="p-2 text-indigo-300 hover:text-amber-400 hover:bg-indigo-800/60 rounded-full transition-colors"
                  title="Star Term"
                >
                  <Star className={`w-5 h-5 ${currentTerm.starred ? 'fill-amber-400 text-amber-400' : ''}`} />
                </button>
              </div>
            </div>

            <div className="my-auto text-center px-4">
              <p className="text-xl sm:text-2xl font-medium text-indigo-50 leading-relaxed">
                {backContent}
              </p>
            </div>

            <div className="text-center text-xs font-semibold text-indigo-300 flex items-center justify-center gap-1">
              <RotateCw className="w-3.5 h-3.5" />
              Click or press Space to flip back
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Controls */}
      <div className="flex items-center justify-between pt-2">
        <button
          onClick={handlePrev}
          className="p-3 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 rounded-2xl transition-all shadow-xs"
          title="Previous Card"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        <span className="text-sm font-bold text-slate-600 dark:text-slate-400">
          {currentIndex + 1} / {terms.length}
        </span>

        <button
          onClick={handleNext}
          className="p-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl transition-all shadow-md shadow-indigo-200 dark:shadow-none"
          title="Next Card"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>

    </div>
  );
};
