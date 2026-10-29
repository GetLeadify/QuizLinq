import React, { useState, useEffect } from 'react';
import type { StudySet, Term } from '../types';
import { CheckCircle2, XCircle, RotateCcw, Award } from 'lucide-react';
import confetti from 'canvas-confetti';

interface TestModeProps {
  set: StudySet;
  onComplete: (score: number) => void;
}

interface Question {
  id: string;
  type: 'mc' | 'tf' | 'written';
  term: Term;
  prompt: string;
  correctAnswer: string;
  options?: string[]; // For MC
  isTrueStatement?: boolean; // For TF
}

export const TestMode: React.FC<TestModeProps> = ({ set, onComplete }) => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  useEffect(() => {
    generateTest();
  }, [set]);

  const generateTest = () => {
    const allTerms = set.terms;
    if (allTerms.length === 0) return;

    const generated: Question[] = [];

    allTerms.forEach((term, idx) => {
      const typeChoice = idx % 3;

      if (typeChoice === 0) {
        // Multiple Choice
        const otherDefs = allTerms.filter(t => t.id !== term.id).map(t => t.definition);
        const distractors = [...otherDefs].sort(() => Math.random() - 0.5).slice(0, 3);
        const options = [...distractors, term.definition].sort(() => Math.random() - 0.5);

        generated.push({
          id: `q-${idx}-${term.id}`,
          type: 'mc',
          term,
          prompt: term.term,
          correctAnswer: term.definition,
          options
        });
      } else if (typeChoice === 1) {
        // True / False
        const isTrue = Math.random() > 0.5;
        let statementDef = term.definition;

        if (!isTrue && allTerms.length > 1) {
          const falseTerm = allTerms.find(t => t.id !== term.id);
          if (falseTerm) statementDef = falseTerm.definition;
        }

        generated.push({
          id: `q-${idx}-${term.id}`,
          type: 'tf',
          term,
          prompt: `Term: "${term.term}" means "${statementDef}"`,
          correctAnswer: isTrue ? 'True' : 'False',
          isTrueStatement: isTrue
        });
      } else {
        // Written
        generated.push({
          id: `q-${idx}-${term.id}`,
          type: 'written',
          term,
          prompt: term.term,
          correctAnswer: term.definition
        });
      }
    });

    setQuestions(generated);
    setAnswers({});
    setIsSubmitted(false);
    setScore(0);
  };

  const handleAnswer = (questionId: string, answer: string) => {
    if (isSubmitted) return;
    setAnswers(prev => ({ ...prev, [questionId]: answer }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitted) return;

    let correctCount = 0;
    questions.forEach(q => {
      const userAns = (answers[q.id] || '').trim().toLowerCase();
      const correctAns = q.correctAnswer.trim().toLowerCase();

      if (q.type === 'written') {
        if (userAns === correctAns || (correctAns.includes(userAns) && userAns.length > 2)) {
          correctCount++;
        }
      } else {
        if (userAns === correctAns) {
          correctCount++;
        }
      }
    });

    setScore(correctCount);
    setIsSubmitted(true);
    confetti({ particleCount: 120, spread: 80, origin: { y: 0.5 } });
    onComplete(correctCount);
  };

  if (questions.length === 0) {
    return <div className="text-center py-10 text-slate-500">Generating test...</div>;
  }

  const scorePercentage = Math.round((score / questions.length) * 100);

  return (
    <div className="max-w-3xl mx-auto space-y-8 pb-12">

      {/* Test Header */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 md:p-8 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-extrabold uppercase tracking-widest text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">
            Practice Test
          </span>
          <h2 className="text-2xl font-black text-slate-900 mt-2">{set.title}</h2>
          <p className="text-xs text-slate-500 mt-0.5">{questions.length} Questions (Multiple Choice, True/False & Written)</p>
        </div>

        {isSubmitted && (
          <div className="bg-indigo-50 border border-indigo-200 p-4 rounded-2xl flex items-center gap-4">
            <Award className="w-8 h-8 text-indigo-600" />
            <div>
              <div className="text-2xl font-black text-indigo-900">{score} / {questions.length} ({scorePercentage}%)</div>
              <div className="text-xs font-semibold text-indigo-700">Test Score</div>
            </div>
          </div>
        )}
      </div>

      {/* Questions Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {questions.map((q, index) => {
          const userAns = answers[q.id] || '';
          let isCorrect = false;

          if (isSubmitted) {
            const u = userAns.trim().toLowerCase();
            const c = q.correctAnswer.trim().toLowerCase();
            isCorrect = q.type === 'written' ? (u === c || (c.includes(u) && u.length > 2)) : u === c;
          }

          return (
            <div
              key={q.id}
              className={`bg-white rounded-3xl border p-6 shadow-xs transition-all ${
                isSubmitted
                  ? isCorrect
                    ? 'border-emerald-300 bg-emerald-50/20'
                    : 'border-rose-300 bg-rose-50/20'
                  : 'border-slate-200'
              }`}
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
                <span className="text-xs font-bold text-slate-400">
                  Question {index + 1} of {questions.length}
                </span>
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-md">
                  {q.type === 'mc' ? 'Multiple Choice' : q.type === 'tf' ? 'True / False' : 'Written Answer'}
                </span>
              </div>

              <h4 className="text-lg font-bold text-slate-900 mb-4">
                {q.prompt}
              </h4>

              {/* MC Input */}
              {q.type === 'mc' && (
                <div className="space-y-2">
                  {q.options?.map((opt, oIdx) => (
                    <label
                      key={oIdx}
                      className={`flex items-center gap-3 p-3.5 rounded-2xl border text-sm font-medium cursor-pointer transition-all ${
                        userAns === opt
                          ? 'border-indigo-600 bg-indigo-50 text-indigo-900 font-semibold'
                          : 'border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-800'
                      }`}
                    >
                      <input
                        type="radio"
                        name={q.id}
                        disabled={isSubmitted}
                        checked={userAns === opt}
                        onChange={() => handleAnswer(q.id, opt)}
                        className="text-indigo-600 focus:ring-indigo-500"
                      />
                      <span>{opt}</span>
                    </label>
                  ))}
                </div>
              )}

              {/* True/False Input */}
              {q.type === 'tf' && (
                <div className="flex gap-3">
                  {['True', 'False'].map(val => (
                    <button
                      key={val}
                      type="button"
                      disabled={isSubmitted}
                      onClick={() => handleAnswer(q.id, val)}
                      className={`flex-1 py-3 rounded-2xl border text-sm font-bold transition-all ${
                        userAns === val
                          ? 'border-indigo-600 bg-indigo-600 text-white shadow-xs'
                          : 'border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700'
                      }`}
                    >
                      {val}
                    </button>
                  ))}
                </div>
              )}

              {/* Written Input */}
              {q.type === 'written' && (
                <div>
                  <input
                    type="text"
                    disabled={isSubmitted}
                    value={userAns}
                    onChange={e => handleAnswer(q.id, e.target.value)}
                    placeholder="Type definition here..."
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium text-slate-900 focus:bg-white focus:border-indigo-500 focus:outline-none transition-all"
                  />
                </div>
              )}

              {/* Results Feedback */}
              {isSubmitted && (
                <div className="mt-4 pt-4 border-t border-slate-100 flex items-start gap-2.5 text-xs">
                  {isCorrect ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  ) : (
                    <XCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  )}
                  <div>
                    <span className="font-bold text-slate-800">
                      {isCorrect ? 'Correct!' : 'Incorrect.'}
                    </span>
                    {!isCorrect && (
                      <p className="text-slate-600 mt-0.5">
                        <span className="font-bold">Correct Answer:</span> {q.correctAnswer}
                      </p>
                    )}
                  </div>
                </div>
              )}

            </div>
          );
        })}

        {/* Submit or Restart Bar */}
        <div className="pt-2">
          {!isSubmitted ? (
            <button
              type="submit"
              className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-bold text-base rounded-2xl transition-all shadow-md shadow-indigo-200"
            >
              Submit Test & Score
            </button>
          ) : (
            <button
              type="button"
              onClick={generateTest}
              className="w-full py-4 bg-slate-900 hover:bg-slate-800 text-white font-bold text-base rounded-2xl transition-all flex items-center justify-center gap-2 shadow-sm"
            >
              <RotateCcw className="w-5 h-5" />
              Retake Test
            </button>
          )}
        </div>
      </form>

    </div>
  );
};
