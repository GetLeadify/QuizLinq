import React, { useState, useEffect } from 'react';
import type { StudySet, Term } from '../types';
import { CheckCircle2, XCircle, ArrowRight, RefreshCw, Trophy } from 'lucide-react';
import confetti from 'canvas-confetti';

interface LearnModeProps {
  set: StudySet;
  onComplete: (score: number) => void;
}

interface Question {
  id: string;
  term: Term;
  type: 'mc' | 'written';
  options?: string[]; // for multiple choice
  correctAnswer: string;
}

export const LearnMode: React.FC<LearnModeProps> = ({ set, onComplete }) => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [writtenInput, setWrittenInput] = useState('');
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    generateQuestions();
  }, [set]);

  const generateQuestions = () => {
    const allTerms = set.terms;
    if (allTerms.length === 0) return;

    const generated: Question[] = allTerms.map((term, index) => {
      const type: 'mc' | 'written' = index % 2 === 0 || allTerms.length < 3 ? 'mc' : 'written';
      const correctAnswer = term.definition;

      if (type === 'mc') {
        const otherDefs = allTerms
          .filter(t => t.id !== term.id)
          .map(t => t.definition);

        const distractors = [...otherDefs].sort(() => Math.random() - 0.5).slice(0, 3);
        const options = [...distractors, correctAnswer].sort(() => Math.random() - 0.5);

        return {
          id: term.id,
          term,
          type: 'mc',
          options,
          correctAnswer
        };
      } else {
        return {
          id: term.id,
          term,
          type: 'written',
          correctAnswer
        };
      }
    });

    setQuestions(generated.sort(() => Math.random() - 0.5));
    setCurrentIndex(0);
    setScore(0);
    setIsFinished(false);
    setIsAnswered(false);
    setSelectedOption(null);
    setWrittenInput('');
  };

  const currentQ = questions[currentIndex];

  const handleSelectOption = (option: string) => {
    if (isAnswered) return;
    setSelectedOption(option);
    setIsAnswered(true);

    const correct = option === currentQ.correctAnswer;
    setIsCorrect(correct);
    if (correct) {
      setScore(prev => prev + 1);
    }
  };

  const handleCheckWritten = (e: React.FormEvent) => {
    e.preventDefault();
    if (isAnswered || !writtenInput.trim()) return;

    setIsAnswered(true);
    const normalizedInput = writtenInput.trim().toLowerCase();
    const normalizedCorrect = currentQ.correctAnswer.trim().toLowerCase();

    const correct = normalizedInput === normalizedCorrect ||
      (normalizedCorrect.includes(normalizedInput) && normalizedInput.length > 3);

    setIsCorrect(correct);
    if (correct) {
      setScore(prev => prev + 1);
    }
  };

  const handleNext = () => {
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex(prev => prev + 1);
      setIsAnswered(false);
      setIsCorrect(null);
      setSelectedOption(null);
      setWrittenInput('');
    } else {
      setIsFinished(true);
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
      onComplete(score + (isCorrect ? 0 : 0));
    }
  };

  if (!currentQ && !isFinished) {
    return <div className="text-center py-10 text-slate-500">Preparing study questions...</div>;
  }

  if (isFinished) {
    const percentage = Math.round((score / questions.length) * 100);
    return (
      <div className="max-w-xl mx-auto bg-white rounded-3xl border border-slate-200 p-8 text-center space-y-6 shadow-md animate-in fade-in">
        <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
          <Trophy className="w-8 h-8" />
        </div>
        <div>
          <h2 className="text-2xl font-black text-slate-900">Session Complete!</h2>
          <p className="text-sm text-slate-500 mt-1">Great job practicing this study set.</p>
        </div>

        <div className="p-6 bg-slate-50 rounded-2xl flex items-center justify-around border border-slate-100">
          <div>
            <div className="text-3xl font-black text-indigo-600">{score} / {questions.length}</div>
            <div className="text-xs font-semibold text-slate-400 mt-1">Correct Answers</div>
          </div>
          <div className="w-px h-12 bg-slate-200" />
          <div>
            <div className="text-3xl font-black text-emerald-600">{percentage}%</div>
            <div className="text-xs font-semibold text-slate-400 mt-1">Mastery Score</div>
          </div>
        </div>

        <button
          onClick={generateQuestions}
          className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm rounded-xl transition-all shadow-md shadow-indigo-200 flex items-center justify-center gap-2"
        >
          <RefreshCw className="w-4 h-4" />
          Practice Again
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">

      {/* Progress Bar */}
      <div className="space-y-2">
        <div className="flex justify-between text-xs font-bold text-slate-500">
          <span>Question {currentIndex + 1} of {questions.length}</span>
          <span>{Math.round(((currentIndex + 1) / questions.length) * 100)}% Complete</span>
        </div>
        <div className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-indigo-500 to-sky-500 transition-all duration-300"
            style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Main Question Card */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-sm space-y-6">
        <div>
          <span className="text-[11px] font-extrabold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full">
            {currentQ.type === 'mc' ? 'Multiple Choice' : 'Written Practice'}
          </span>
          <h3 className="text-xl sm:text-2xl font-bold text-slate-900 mt-3">
            {currentQ.term.term}
          </h3>
        </div>

        {/* Options / Input Form */}
        {currentQ.type === 'mc' ? (
          <div className="space-y-3">
            {currentQ.options?.map((option, idx) => {
              let optionStyle = 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-800';

              if (isAnswered) {
                if (option === currentQ.correctAnswer) {
                  optionStyle = 'bg-emerald-50 border-emerald-500 text-emerald-900 font-semibold';
                } else if (option === selectedOption) {
                  optionStyle = 'bg-rose-50 border-rose-500 text-rose-900 line-through';
                } else {
                  optionStyle = 'bg-slate-50 border-slate-200 opacity-50';
                }
              }

              return (
                <button
                  key={idx}
                  disabled={isAnswered}
                  onClick={() => handleSelectOption(option)}
                  className={`w-full text-left p-4 rounded-2xl border transition-all text-sm font-medium flex items-center justify-between ${optionStyle}`}
                >
                  <span>{option}</span>
                  {isAnswered && option === currentQ.correctAnswer && (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 ml-2" />
                  )}
                  {isAnswered && option === selectedOption && option !== currentQ.correctAnswer && (
                    <XCircle className="w-5 h-5 text-rose-500 shrink-0 ml-2" />
                  )}
                </button>
              );
            })}
          </div>
        ) : (
          <form onSubmit={handleCheckWritten} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">
                Type the definition or answer:
              </label>
              <textarea
                rows={3}
                disabled={isAnswered}
                value={writtenInput}
                onChange={e => setWrittenInput(e.target.value)}
                placeholder="Type your answer here..."
                className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium text-slate-900 focus:bg-white focus:border-indigo-500 focus:outline-none transition-all resize-none"
              />
            </div>

            {!isAnswered && (
              <button
                type="submit"
                disabled={!writtenInput.trim()}
                className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold text-sm rounded-xl transition-all"
              >
                Submit Answer
              </button>
            )}
          </form>
        )}

        {/* Feedback Banner */}
        {isAnswered && (
          <div className={`p-4 rounded-2xl border flex items-start gap-3 animate-in fade-in duration-150 ${
            isCorrect ? 'bg-emerald-50 border-emerald-200 text-emerald-950' : 'bg-rose-50 border-rose-200 text-rose-950'
          }`}>
            {isCorrect ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            ) : (
              <XCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            )}
            <div className="text-sm">
              <p className="font-bold">
                {isCorrect ? 'Nice job! That is correct.' : 'Not quite right.'}
              </p>
              {!isCorrect && (
                <p className="mt-1 font-medium text-xs opacity-90">
                  <span className="font-bold uppercase tracking-wider">Correct definition:</span> {currentQ.correctAnswer}
                </p>
              )}
            </div>
          </div>
        )}

        {/* Next Question Action */}
        {isAnswered && (
          <button
            onClick={handleNext}
            className="w-full py-3.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm rounded-2xl transition-all flex items-center justify-center gap-2 shadow-sm"
          >
            <span>Next Question</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        )}

      </div>

    </div>
  );
};
