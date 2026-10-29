import React, { useState } from 'react';
import { Search, BookCheck, ChevronRight, CheckCircle2, Sparkles, HelpCircle } from 'lucide-react';

interface Solution {
  id: string;
  bookTitle: string;
  subject: string;
  chapter: string;
  problem: string;
  steps: string[];
  explanation: string;
}

const SAMPLE_SOLUTIONS: Solution[] = [
  {
    id: 'sol-1',
    bookTitle: 'Calculus: Early Transcendentals (8th Ed)',
    subject: 'Mathematics',
    chapter: 'Chapter 3 - Differentiation Rules',
    problem: 'Find the derivative of f(x) = x³ · sin(x) using the product rule.',
    steps: [
      'Identify functions u(x) and v(x): Let u(x) = x³ and v(x) = sin(x).',
      'Apply the product rule formula: d/dx [u · v] = u\'v + uv\'.',
      'Calculate individual derivatives: u\'(x) = 3x² and v\'(x) = cos(x).',
      'Substitute into formula: f\'(x) = (3x²)(sin(x)) + (x³)(cos(x)).',
      'Simplify expression: f\'(x) = x² (3 sin(x) + x cos(x)).'
    ],
    explanation: 'The product rule requires taking derivative of the first term times second, plus first term times derivative of second.'
  },
  {
    id: 'sol-2',
    bookTitle: 'University Physics with Modern Physics',
    subject: 'Physics',
    chapter: 'Chapter 5 - Newton\'s Laws of Motion',
    problem: 'Calculate the acceleration of a 10 kg mass pulled by a 50 N horizontal force on a frictionless surface.',
    steps: [
      'Identify given parameters: Mass (m) = 10 kg, Force (F) = 50 N.',
      'State Newton\'s Second Law: F_net = m · a.',
      'Rearrange for acceleration: a = F_net / m.',
      'Substitute values: a = 50 N / 10 kg = 5 m/s².'
    ],
    explanation: 'Net force accelerates mass proportionally according to F = ma.'
  },
  {
    id: 'sol-3',
    bookTitle: 'Organic Chemistry (3rd Ed)',
    subject: 'Chemistry',
    chapter: 'Chapter 7 - Nucleophilic Substitution (SN1 vs SN2)',
    problem: 'Predict whether 2-bromo-2-methylpropane undergoes SN1 or SN2 in water.',
    steps: [
      'Analyze substrate structure: 2-bromo-2-methylpropane is a tertiary alkyl halide (3°).',
      'Consider steric hindrance: Tertiary substrates cannot undergo SN2 due to steric crowding.',
      'Evaluate nucleophile/solvent: Water is a polar protic solvent, favoring carbocation stabilization.',
      'Conclusion: The reaction proceeds exclusively via the SN1 mechanism.'
    ],
    explanation: 'Tertiary alkyl halides form stable carbocations, favoring unimolecular SN1 reactions.'
  }
];

export const ExpertSolutions: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSolution, setSelectedSolution] = useState<Solution | null>(SAMPLE_SOLUTIONS[0]);

  const filteredSolutions = SAMPLE_SOLUTIONS.filter(s =>
    s.bookTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.problem.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8 pb-16 animate-in fade-in duration-200">

      {/* Banner */}
      <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-indigo-600 text-white rounded-3xl p-8 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-bold text-emerald-100">
            <BookCheck className="w-4 h-4 text-emerald-200" />
            Verified Textbook Solutions
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            Expert Solutions & Q&A Solver
          </h1>
          <p className="text-emerald-100 text-xs sm:text-sm leading-relaxed">
            Step-by-step verified explanations and worked solutions for STEM, Humanities, and Business textbook exercises.
          </p>
        </div>

        <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center shrink-0">
          <Sparkles className="w-8 h-8 text-emerald-200" />
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-xl">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          placeholder="Search textbook name, subject, or question phrase..."
          className="w-full pl-11 pr-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm font-medium text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500 shadow-2xs"
        />
      </div>

      {/* Solutions Grid / Inspector Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Solution List */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Available Textbooks</h3>
          {filteredSolutions.map(sol => (
            <div
              key={sol.id}
              onClick={() => setSelectedSolution(sol)}
              className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                selectedSolution?.id === sol.id
                  ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-500 text-emerald-950 dark:text-emerald-200 font-semibold shadow-xs'
                  : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 hover:border-slate-300'
              }`}
            >
              <span className="px-2 py-0.5 bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300 text-[10px] font-extrabold rounded-md uppercase">
                {sol.subject}
              </span>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white mt-2 line-clamp-1">{sol.bookTitle}</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">{sol.problem}</p>
            </div>
          ))}
        </div>

        {/* Selected Solution Breakdown */}
        {selectedSolution && (
          <div className="lg:col-span-2 bg-white dark:bg-slate-800 rounded-3xl border border-slate-200/90 dark:border-slate-700 p-6 sm:p-8 shadow-xs space-y-6">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-600 dark:text-emerald-400 mb-1">
                <BookCheck className="w-4 h-4" />
                <span>{selectedSolution.chapter}</span>
              </div>
              <h2 className="text-xl font-black text-slate-900 dark:text-white">{selectedSolution.bookTitle}</h2>

              <div className="mt-4 p-4 bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 rounded-2xl">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">Problem Statement</span>
                <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">{selectedSolution.problem}</p>
              </div>
            </div>

            {/* Step by Step Walkthrough */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                Step-by-Step Explanation
              </h3>

              <div className="space-y-3">
                {selectedSolution.steps.map((step, idx) => (
                  <div key={idx} className="flex items-start gap-3 p-3.5 bg-slate-50 dark:bg-slate-900/40 rounded-2xl text-xs text-slate-700 dark:text-slate-300">
                    <span className="w-5 h-5 rounded-full bg-emerald-500 text-white font-mono font-bold flex items-center justify-center shrink-0 text-[10px]">
                      {idx + 1}
                    </span>
                    <span className="leading-relaxed mt-0.5">{step}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Key Takeaway */}
            <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-2xl text-xs text-emerald-900 dark:text-emerald-200 flex items-start gap-2.5">
              <HelpCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold block">Key Concept Note:</span>
                <span>{selectedSolution.explanation}</span>
              </div>
            </div>
          </div>
        )}

      </div>

    </div>
  );
};
