import React, { useState } from 'react';
import type { StudySet } from '../types';
import { Target, CheckCircle2, RotateCcw, Image as ImageIcon } from 'lucide-react';
import confetti from 'canvas-confetti';

interface DiagramHotspot {
  id: string;
  label: string;
  x: number; // percentage 0-100
  y: number; // percentage 0-100
}

interface DiagramModeProps {
  set: StudySet;
}

const SAMPLE_HOTSPOTS: DiagramHotspot[] = [
  { id: 'h1', label: 'Frontal Lobe', x: 28, y: 32 },
  { id: 'h2', label: 'Parietal Lobe', x: 58, y: 25 },
  { id: 'h3', label: 'Occipital Lobe', x: 78, y: 45 },
  { id: 'h4', label: 'Temporal Lobe', x: 42, y: 55 },
  { id: 'h5', label: 'Cerebellum', x: 72, y: 72 },
  { id: 'h6', label: 'Brain Stem', x: 50, y: 80 }
];

export const DiagramMode: React.FC<DiagramModeProps> = ({ set }) => {
  const [activeHotspots, setActiveHotspots] = useState<DiagramHotspot[]>(SAMPLE_HOTSPOTS);
  const [targetIndex, setTargetIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [isCompleted, setIsCompleted] = useState(false);

  const currentTarget = activeHotspots[targetIndex];

  const handleHotspotClick = (spot: DiagramHotspot) => {
    if (isCompleted) return;

    if (spot.id === currentTarget.id) {
      setFeedback('Correct spot identified!');
      setScore(prev => prev + 1);

      if (targetIndex + 1 < activeHotspots.length) {
        setTargetIndex(prev => prev + 1);
      } else {
        setIsCompleted(true);
        confetti({ particleCount: 100, spread: 70 });
      }
    } else {
      setFeedback(`Incorrect. Look for "${currentTarget.label}"`);
    }

    setTimeout(() => setFeedback(null), 1500);
  };

  const handleRestart = () => {
    setActiveHotspots([...SAMPLE_HOTSPOTS].sort(() => Math.random() - 0.5));
    setTargetIndex(0);
    setScore(0);
    setIsCompleted(false);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">

      {/* Header Info */}
      <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-2xs flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 rounded-xl">
            <Target className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Diagram & Visual Practice</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Identify anatomical and structure locations on visual diagrams.</p>
          </div>
        </div>

        {!isCompleted && currentTarget && (
          <div className="bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 px-4 py-2 rounded-xl text-xs font-bold text-indigo-900 dark:text-indigo-200">
            Click location for: <span className="text-indigo-600 dark:text-indigo-400 underline">{currentTarget.label}</span>
          </div>
        )}
      </div>

      {/* Interactive Diagram Canvas */}
      {!isCompleted ? (
        <div className="relative w-full h-[420px] bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-md flex items-center justify-center">
          {/* Mock Diagram Background */}
          <div className="text-center text-slate-500 space-y-2 pointer-events-none select-none">
            <ImageIcon className="w-16 h-16 mx-auto opacity-30" />
            <span className="text-xs font-semibold block uppercase tracking-widest opacity-60">
              {set.title} Diagram
            </span>
          </div>

          {/* Hotspot Pins */}
          {activeHotspots.map((spot, idx) => (
            <button
              key={spot.id}
              onClick={() => handleHotspotClick(spot)}
              style={{ left: `${spot.x}%`, top: `${spot.y}%` }}
              className="absolute -translate-x-1/2 -translate-y-1/2 group focus:outline-none"
            >
              <div className="w-8 h-8 rounded-full bg-indigo-600 text-white font-bold text-xs flex items-center justify-center ring-4 ring-indigo-400/40 shadow-lg hover:scale-110 transition-transform">
                {idx + 1}
              </div>
            </button>
          ))}

          {/* Feedback Toast */}
          {feedback && (
            <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-slate-900/90 border border-slate-700 text-white text-xs px-4 py-2 rounded-xl shadow-lg animate-in fade-in">
              {feedback}
            </div>
          )}
        </div>
      ) : (
        /* Victory Screen */
        <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 p-8 text-center space-y-6 shadow-md">
          <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-slate-900 dark:text-white">Diagram Mastered!</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">You accurately identified all diagram locations.</p>
          </div>

          <button
            onClick={handleRestart}
            className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md transition-all inline-flex items-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            Practice Diagram Again
          </button>
        </div>
      )}

    </div>
  );
};
