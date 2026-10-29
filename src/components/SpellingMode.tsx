import React, { useState } from 'react';
import type { StudySet } from '../types';
import { Volume2, CheckCircle2, XCircle, ArrowRight, RotateCcw } from 'lucide-react';
import confetti from 'canvas-confetti';

interface SpellingModeProps {
  set: StudySet;
}

export const SpellingMode: React.FC<SpellingModeProps> = ({ set }) => {
  const [terms] = useState(set.terms);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userInput, setUserInput] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  const currentTerm = terms[currentIndex];

  const handleSpeak = () => {
    if (!currentTerm || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(currentTerm.term);
    utterance.rate = 0.9;
    window.speechSynthesis.speak(utterance);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userInput.trim() || isSubmitted) return;

    setIsSubmitted(true);
    const correct = userInput.trim().toLowerCase() === currentTerm.term.trim().toLowerCase();
    setIsCorrect(correct);

    if (correct) {
      setScore(prev => prev + 1);
    }
  };

  const handleNext = () => {
    if (currentIndex + 1 < terms.length) {
      setCurrentIndex(prev => prev + 1);
      setUserInput('');
      setIsSubmitted(false);
      setIsCorrect(null);
    } else {
      setIsFinished(true);
      confetti({ particleCount: 100, spread: 70 });
    }
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setUserInput('');
    setIsSubmitted(false);
    setIsCorrect(null);
    setScore(0);
    setIsFinished(false);
  };

  if (isFinished) {
    return (
      <div className="max-w-xl mx-auto bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 p-8 text-center space-y-6 shadow-md">
        <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white">Spelling Mastered!</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Score: {score} / {terms.length}</p>
        </div>
        <button
          onClick={handleRestart}
          className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 shadow-md"
        >
          <RotateCcw className="w-4 h-4" />
          Practice Spelling Again
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto space-y-6">

      {/* Spelling Card */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 p-6 sm:p-8 shadow-xs space-y-6">
        <div className="text-center space-y-3">
          <span className="text-[11px] font-extrabold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-3 py-1 rounded-full">
            Spelling & Audio Dictation
          </span>

          <div className="pt-2">
            <button
              onClick={handleSpeak}
              className="w-16 h-16 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl flex items-center justify-center mx-auto shadow-md shadow-indigo-200 dark:shadow-none hover:scale-105 transition-transform"
              title="Click to Listen to Word"
            >
              <Volume2 className="w-8 h-8" />
            </button>
            <span className="text-xs font-semibold text-slate-400 block mt-2">Click button to hear term</span>
          </div>

          <p className="text-sm font-medium text-slate-600 dark:text-slate-300 italic pt-2">
            Definition hint: "{currentTerm.definition}"
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            disabled={isSubmitted}
            value={userInput}
            onChange={e => setUserInput(e.target.value)}
            placeholder="Type exact term spelling..."
            className="w-full px-4 py-3.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm font-semibold text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
          />

          {!isSubmitted ? (
            <button
              type="submit"
              disabled={!userInput.trim()}
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-md transition-all"
            >
              Check Spelling
            </button>
          ) : (
            <div className="space-y-3">
              <div className={`p-4 rounded-2xl border flex items-center gap-3 text-xs ${
                isCorrect ? 'bg-emerald-50 dark:bg-emerald-950/50 border-emerald-200 text-emerald-900 dark:text-emerald-200' : 'bg-rose-50 dark:bg-rose-950/50 border-rose-200 text-rose-900 dark:text-rose-200'
              }`}>
                {isCorrect ? <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" /> : <XCircle className="w-5 h-5 text-rose-600 shrink-0" />}
                <div>
                  <p className="font-bold">{isCorrect ? 'Correct spelling!' : 'Incorrect.'}</p>
                  {!isCorrect && <p className="mt-0.5">Spelling: <strong>{currentTerm.term}</strong></p>}
                </div>
              </div>

              <button
                type="button"
                onClick={handleNext}
                className="w-full py-3.5 bg-slate-900 dark:bg-slate-700 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 shadow-sm"
              >
                <span>Next Word</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </form>
      </div>

    </div>
  );
};
