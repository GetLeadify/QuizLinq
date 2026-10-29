import React, { useState, useEffect, useRef } from 'react';
import type { StudySet, Term } from '../types';
import { ShieldAlert, Trophy, RotateCcw, Flame } from 'lucide-react';
import confetti from 'canvas-confetti';

interface GravityModeProps {
  set: StudySet;
  onHighScoreUpdate?: (score: number) => void;
}

export const GravityMode: React.FC<GravityModeProps> = ({ set, onHighScoreUpdate }) => {
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');

  const [currentTerm, setCurrentTerm] = useState<Term | null>(null);
  const [inputValue, setInputValue] = useState('');
  const [asteroidPosY, setAsteroidPosY] = useState(0); // 0% to 90%
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);

  const animationRef = useRef<number | null>(null);
  const unusedTermsRef = useRef<Term[]>([]);

  const speedMap = {
    easy: 0.15,
    medium: 0.28,
    hard: 0.45
  };

  const startGame = () => {
    unusedTermsRef.current = [...set.terms].sort(() => Math.random() - 0.5);
    setScore(0);
    setLives(3);
    setGameStarted(true);
    setGameOver(false);
    spawnNextAsteroid();
  };

  const spawnNextAsteroid = () => {
    if (unusedTermsRef.current.length === 0) {
      unusedTermsRef.current = [...set.terms].sort(() => Math.random() - 0.5);
    }
    const nextTerm = unusedTermsRef.current.pop() || set.terms[0];
    setCurrentTerm(nextTerm);
    setAsteroidPosY(0);
    setInputValue('');
  };

  // Game loop for falling asteroid
  useEffect(() => {
    if (!gameStarted || gameOver || !currentTerm) return;

    let lastTime = performance.now();

    const loop = (time: number) => {
      const delta = (time - lastTime) / 16.6; // normalized frame delta
      lastTime = time;

      setAsteroidPosY(prevY => {
        const speed = speedMap[difficulty];
        const nextY = prevY + speed * delta;

        if (nextY >= 82) {
          // IMPACT! Player missed the term
          handleImpact();
          return 0;
        }
        return nextY;
      });

      animationRef.current = requestAnimationFrame(loop);
    };

    animationRef.current = requestAnimationFrame(loop);

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [gameStarted, gameOver, currentTerm, difficulty]);

  const handleImpact = () => {
    setLives(prevLives => {
      const newLives = prevLives - 1;
      if (newLives <= 0) {
        setGameOver(true);
        setGameStarted(false);
        if (onHighScoreUpdate) onHighScoreUpdate(score);
      } else {
        setFeedbackMsg(`Impact! Answer was "${currentTerm?.definition}"`);
        setTimeout(() => setFeedbackMsg(null), 2000);
        spawnNextAsteroid();
      }
      return newLives;
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setInputValue(val);

    if (!currentTerm) return;

    const normalizedInput = val.trim().toLowerCase();
    const normalizedCorrect = currentTerm.definition.trim().toLowerCase();

    // Correct hit!
    if (normalizedInput === normalizedCorrect || (normalizedCorrect.length > 4 && normalizedCorrect.includes(normalizedInput) && normalizedInput.length >= normalizedCorrect.length * 0.8)) {
      setScore(prev => prev + (difficulty === 'hard' ? 150 : difficulty === 'medium' ? 100 : 50));
      confetti({ particleCount: 30, spread: 50, origin: { y: 0.8 } });
      spawnNextAsteroid();
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">

      {/* Gravity Header / Stats */}
      <div className="flex items-center justify-between bg-slate-900 text-white p-4 rounded-2xl shadow-md">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-rose-500/20 text-rose-400 rounded-xl">
            <Flame className="w-5 h-5 fill-rose-400" />
          </div>
          <div>
            <h3 className="text-base font-black">Gravity Arcade</h3>
            <p className="text-xs text-slate-400">Protect the planet by typing correct definitions before impact!</p>
          </div>
        </div>

        {gameStarted && (
          <div className="flex items-center gap-6 text-sm font-mono font-bold">
            <div>
              <span className="text-xs text-slate-400 block font-sans">Score</span>
              <span className="text-amber-400">{score}</span>
            </div>
            <div>
              <span className="text-xs text-slate-400 block font-sans">Shields</span>
              <span className="text-rose-400">{'❤️'.repeat(lives)}</span>
            </div>
          </div>
        )}
      </div>

      {/* Main Game Screen */}
      {!gameStarted && !gameOver && (
        <div className="bg-slate-900 text-white rounded-3xl p-8 sm:p-12 text-center space-y-6 border border-slate-800 shadow-xl">
          <div className="w-16 h-16 bg-indigo-500/20 text-indigo-400 rounded-2xl flex items-center justify-center mx-auto">
            <ShieldAlert className="w-8 h-8" />
          </div>

          <div>
            <h2 className="text-2xl font-black">Gravity Mode</h2>
            <p className="text-xs text-slate-400 mt-2 max-w-md mx-auto leading-relaxed">
              Asteroids containing terms are falling towards your planet. Type the correct definition to vaporize them before impact!
            </p>
          </div>

          <div className="flex justify-center gap-3 text-xs font-bold">
            {(['easy', 'medium', 'hard'] as const).map(d => (
              <button
                key={d}
                onClick={() => setDifficulty(d)}
                className={`px-4 py-2 rounded-xl capitalize transition-all ${
                  difficulty === d
                    ? 'bg-indigo-600 text-white ring-2 ring-indigo-400'
                    : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                }`}
              >
                {d}
              </button>
            ))}
          </div>

          <button
            onClick={startGame}
            className="w-full max-w-xs mx-auto py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm rounded-2xl shadow-lg shadow-indigo-600/30 transition-all"
          >
            Start Game
          </button>
        </div>
      )}

      {/* Active Game Stage */}
      {gameStarted && currentTerm && (
        <div className="relative w-full h-[420px] bg-slate-950 border border-slate-800 rounded-3xl overflow-hidden shadow-inner flex flex-col justify-between p-6">

          {/* Falling Asteroid */}
          <div
            className="absolute left-1/2 -translate-x-1/2 transition-all duration-75 flex flex-col items-center"
            style={{ top: `${asteroidPosY}%` }}
          >
            <div className="px-5 py-3 bg-gradient-to-r from-rose-600 to-amber-600 text-white font-extrabold text-sm sm:text-base rounded-2xl shadow-lg border border-amber-300/30 animate-pulse text-center max-w-md">
              {currentTerm.term}
            </div>
            <div className="w-2 h-4 bg-gradient-to-b from-amber-500 to-transparent blur-xs -mt-1" />
          </div>

          {/* Feedback Overlay */}
          {feedbackMsg && (
            <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-rose-950/90 border border-rose-800 text-rose-200 text-xs px-4 py-2 rounded-xl shadow-md z-20">
              {feedbackMsg}
            </div>
          )}

          {/* Planet Defense Line */}
          <div className="mt-auto z-10 space-y-3">
            <div className="w-full h-1 bg-gradient-to-r from-rose-500 via-indigo-500 to-amber-500 rounded-full" />

            <input
              type="text"
              autoFocus
              value={inputValue}
              onChange={handleInputChange}
              placeholder="Type definition here to destroy asteroid..."
              className="w-full px-5 py-3.5 bg-slate-900 border border-slate-700 rounded-2xl text-white font-medium text-sm focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 shadow-md"
            />
          </div>

        </div>
      )}

      {/* Game Over Screen */}
      {gameOver && (
        <div className="bg-slate-900 text-white rounded-3xl p-8 text-center space-y-6 border border-slate-800 shadow-xl animate-in fade-in">
          <div className="w-16 h-16 bg-amber-500/20 text-amber-400 rounded-2xl flex items-center justify-center mx-auto">
            <Trophy className="w-8 h-8" />
          </div>

          <div>
            <h2 className="text-2xl font-black">Shields Depleted!</h2>
            <p className="text-xs text-slate-400 mt-1">Final Score: <span className="font-bold text-amber-400 text-lg">{score}</span></p>
          </div>

          <button
            onClick={startGame}
            className="w-full max-w-xs mx-auto py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm rounded-2xl transition-all shadow-lg flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            Play Again
          </button>
        </div>
      )}

    </div>
  );
};
