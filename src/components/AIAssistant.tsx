import React, { useState } from 'react';
import type { StudySet, Term } from '../types';
import { Sparkles, Brain, Save, Check } from 'lucide-react';

interface AIAssistantProps {
  onSaveNewSet: (set: StudySet) => void;
}

export const AIAssistant: React.FC<AIAssistantProps> = ({ onSaveNewSet }) => {
  const [topicInput, setTopicInput] = useState('');
  const [subject, setSubject] = useState('General');
  const [cardCount, setCardCount] = useState(5);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedSet, setGeneratedSet] = useState<StudySet | null>(null);
  const [isSaved, setIsSaved] = useState(false);

  const samplePrompts = [
    'Photosynthesis light and dark reactions',
    'Quantum computing fundamentals & qubit states',
    'French beginner conversational verbs',
    'Machine Learning supervised vs unsupervised algorithms',
    'World War II key timeline & treaties'
  ];

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!topicInput.trim()) return;

    setIsGenerating(true);
    setIsSaved(false);

    setTimeout(() => {
      const generatedTerms = generateMockAITerms(topicInput, cardCount);

      const newSet: StudySet = {
        id: 'ai-set-' + Date.now(),
        title: topicInput.trim().charAt(0).toUpperCase() + topicInput.trim().slice(1),
        description: `AI-generated flashcard study set focusing on key principles and concepts of ${topicInput.trim()}.`,
        category: subject || 'General',
        createdAt: Date.now(),
        updatedAt: Date.now(),
        author: {
          name: 'QuizLinq AI Assistant',
          avatar: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=80',
        },
        terms: generatedTerms
      };

      setGeneratedSet(newSet);
      setIsGenerating(false);
    }, 1200);
  };

  const handleSaveSet = () => {
    if (!generatedSet) return;
    onSaveNewSet(generatedSet);
    setIsSaved(true);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-16 animate-in fade-in duration-200">

      {/* Header Banner */}
      <div className="bg-gradient-to-r from-amber-500 via-amber-600 to-indigo-600 rounded-3xl p-8 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-bold text-amber-100">
            <Sparkles className="w-4 h-4 text-amber-200 fill-amber-200" />
            AI Study Suite
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            AI Quiz & Flashcard Generator
          </h1>
          <p className="text-amber-100 text-xs sm:text-sm leading-relaxed">
            Type any topic, textbook chapter, or concept name and QuizLinq AI will instantly formulate structured terms and concise definitions.
          </p>
        </div>

        <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center shrink-0">
          <Brain className="w-8 h-8 text-amber-200" />
        </div>
      </div>

      {/* Generator Input Form */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-xs space-y-6">
        <form onSubmit={handleGenerate} className="space-y-5">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
              What topic or subject do you want to learn?
            </label>
            <input
              type="text"
              value={topicInput}
              onChange={e => setTopicInput(e.target.value)}
              placeholder="e.g. Constitutional Law Amendments, JavaScript Promises & Async/Await"
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-900 focus:bg-white focus:border-indigo-500 focus:outline-none transition-all"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                Category Tag
              </label>
              <input
                type="text"
                value={subject}
                onChange={e => setSubject(e.target.value)}
                placeholder="e.g. Science, Tech, Law"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:bg-white focus:border-indigo-500 focus:outline-none transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                Number of Cards
              </label>
              <select
                value={cardCount}
                onChange={e => setCardCount(Number(e.target.value))}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:bg-white focus:border-indigo-500 focus:outline-none transition-all"
              >
                <option value={5}>5 Flashcards</option>
                <option value={8}>8 Flashcards</option>
                <option value={10}>10 Flashcards</option>
              </select>
            </div>
          </div>

          {/* Quick Prompts */}
          <div className="space-y-1.5">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Try a popular topic:</span>
            <div className="flex flex-wrap gap-2">
              {samplePrompts.map((promptText, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setTopicInput(promptText)}
                  className="px-3 py-1 bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 text-slate-600 text-xs font-medium rounded-lg transition-colors"
                >
                  {promptText}
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={isGenerating || !topicInput.trim()}
            className="w-full py-3.5 bg-amber-500 hover:bg-amber-600 active:bg-amber-700 disabled:opacity-50 text-white font-bold text-sm rounded-xl transition-all shadow-md shadow-amber-200 flex items-center justify-center gap-2"
          >
            {isGenerating ? (
              <>
                <Brain className="w-5 h-5 animate-pulse" />
                <span>AI is formulating flashcards...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                <span>Generate Study Set with AI</span>
              </>
            )}
          </button>
        </form>
      </div>

      {/* Generated Preview */}
      {generatedSet && (
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-sm space-y-6 animate-in fade-in duration-300">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <span className="px-2.5 py-1 rounded-md bg-amber-100 text-amber-800 font-bold text-xs">
                Generated Preview ({generatedSet.terms.length} Cards)
              </span>
              <h3 className="text-xl font-bold text-slate-900 mt-2">{generatedSet.title}</h3>
              <p className="text-xs text-slate-500 mt-1">{generatedSet.description}</p>
            </div>

            <button
              onClick={handleSaveSet}
              disabled={isSaved}
              className={`px-5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all shrink-0 ${
                isSaved
                  ? 'bg-emerald-100 text-emerald-800 cursor-default'
                  : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-200'
              }`}
            >
              {isSaved ? (
                <>
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span>Saved to Library</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Save Set to Library</span>
                </>
              )}
            </button>
          </div>

          <div className="space-y-3">
            {generatedSet.terms.map((term: Term, index: number) => (
              <div
                key={term.id}
                className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs"
              >
                <div className="md:w-1/3 font-bold text-slate-900 flex items-start gap-2">
                  <span className="text-slate-400 font-mono">#{index + 1}</span>
                  <span>{term.term}</span>
                </div>
                <div className="md:w-2/3 text-slate-600 font-normal border-t md:border-t-0 md:border-l border-slate-200 pt-2 md:pt-0 md:pl-4">
                  {term.definition}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};

// Helper mock AI term generator
function generateMockAITerms(prompt: string, count: number): Term[] {
  const templates = [
    {
      term: `Primary Concept of ${prompt}`,
      definition: `The foundational principle behind ${prompt}, outlining its main characteristics and operational scope.`
    },
    {
      term: `Key Mechanism`,
      definition: `The structured procedure or technique used to process, transform, or analyze elements in ${prompt}.`
    },
    {
      term: `Standard Classification`,
      definition: `Categorization framework dividing ${prompt} into core taxonomies or operational types.`
    },
    {
      term: `Practical Application`,
      definition: `Real-world use cases and industry implementation strategies for ${prompt}.`
    },
    {
      term: `Key Advantage / Benefit`,
      definition: `Significant efficiencies, improvements, or accuracy gains introduced when utilizing ${prompt}.`
    },
    {
      term: `Common Challenge`,
      definition: `Potential edge cases, performance bottlenecks, or limitations encountered with ${prompt}.`
    },
    {
      term: `Core Vocabulary Term`,
      definition: `Essential terminology required to communicate effectively about ${prompt}.`
    },
    {
      term: `Future Direction & Evolution`,
      definition: `Upcoming trends and modern advancements expanding the horizon of ${prompt}.`
    },
    {
      term: `Key Evaluation Metric`,
      definition: `Standard benchmark used to measure accuracy, speed, or performance in ${prompt}.`
    },
    {
      term: `Historical Precedent`,
      definition: `The landmark discovery or milestone event that established the principles of ${prompt}.`
    }
  ];

  return templates.slice(0, count).map((t, idx) => ({
    id: `ai-t-${Date.now()}-${idx}`,
    term: t.term,
    definition: t.definition
  }));
}
