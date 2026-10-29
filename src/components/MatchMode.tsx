import React, { useState, useEffect } from 'react';
import type { StudySet } from '../types';
import { Timer, Trophy, RotateCcw, Zap } from 'lucide-react';
import confetti from 'canvas-confetti';

interface MatchModeProps {
  set: StudySet;
  onHighScoreUpdate?: (timeInSeconds: number) => void;
}

interface MatchTile {
  id: string; // unique tile id
  termId: string; // original term id
  text: string;
  type: 'term' | 'definition';
}

export const MatchMode: React.FC<MatchModeProps> = ({ set, onHighScoreUpdate }) => {
  const [tiles, setTiles] = useState<MatchTile[]>([]);
  const [selectedTileId, setSelectedTileId] = useState<string | null>(null);
  const [matchedTermIds, setMatchedTermIds] = useState<string[]>([]);
  const [wrongPairIds, setWrongPairIds] = useState<string[]>([]);
  const [time, setTime] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);

  useEffect(() => {
    initGame();
  }, [set]);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;
    if (isActive && !isGameOver) {
      interval = setInterval(() => {
        setTime(prev => prev + 100); // 100ms
      }, 100);
    } else if (interval) {
      clearInterval(interval);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, isGameOver]);

  const initGame = () => {
    // Select up to 6 terms for a 12-tile grid
    const gameTerms = [...set.terms].sort(() => Math.random() - 0.5).slice(0, 6);

    const tileList: MatchTile[] = [];
    gameTerms.forEach(t => {
      tileList.push({
        id: `tile-term-${t.id}`,
        termId: t.id,
        text: t.term,
        type: 'term'
      });
      tileList.push({
        id: `tile-def-${t.id}`,
        termId: t.id,
        text: t.definition,
        type: 'definition'
      });
    });

    setTiles(tileList.sort(() => Math.random() - 0.5));
    setSelectedTileId(null);
    setMatchedTermIds([]);
    setWrongPairIds([]);
    setTime(0);
    setIsActive(true);
    setIsGameOver(false);
  };

  const handleTileClick = (tile: MatchTile) => {
    if (matchedTermIds.includes(tile.termId) || isGameOver) return;

    if (!selectedTileId) {
      setSelectedTileId(tile.id);
      return;
    }

    if (selectedTileId === tile.id) {
      // Unselect if clicked again
      setSelectedTileId(null);
      return;
    }

    const firstTile = tiles.find(t => t.id === selectedTileId);
    if (!firstTile) return;

    if (firstTile.termId === tile.termId) {
      // MATCH!
      const newMatched = [...matchedTermIds, tile.termId];
      setMatchedTermIds(newMatched);
      setSelectedTileId(null);

      // Check win condition
      if (newMatched.length === tiles.length / 2) {
        setIsActive(false);
        setIsGameOver(true);
        confetti({ particleCount: 150, spread: 90, origin: { y: 0.5 } });
        if (onHighScoreUpdate) {
          onHighScoreUpdate(time / 1000);
        }
      }
    } else {
      // WRONG PAIR
      setWrongPairIds([firstTile.id, tile.id]);
      setSelectedTileId(null);
      setTimeout(() => {
        setWrongPairIds([]);
      }, 600);
    }
  };

  const formatTime = (ms: number) => {
    const seconds = (ms / 1000).toFixed(1);
    return `${seconds}s`;
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">

      {/* Header Info Bar */}
      <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-amber-50 text-amber-600 rounded-xl">
            <Zap className="w-5 h-5 fill-amber-400" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">Match Game</h3>
            <p className="text-xs text-slate-500">Match all corresponding terms and definitions as fast as possible!</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 border border-indigo-200 text-indigo-700 rounded-xl font-mono font-bold text-sm">
            <Timer className="w-4 h-4 text-indigo-600" />
            <span>{formatTime(time)}</span>
          </div>

          <button
            onClick={initGame}
            className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors"
            title="Restart Game"
          >
            <RotateCcw className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Game Board Grid */}
      {!isGameOver ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {tiles.map(tile => {
            const isMatched = matchedTermIds.includes(tile.termId);
            const isSelected = selectedTileId === tile.id;
            const isWrong = wrongPairIds.includes(tile.id);

            let style = 'bg-white border-slate-200 text-slate-800 hover:border-indigo-400 hover:shadow-sm';

            if (isMatched) {
              style = 'opacity-0 pointer-events-none scale-90 duration-300';
            } else if (isWrong) {
              style = 'bg-rose-50 border-rose-500 text-rose-900 animate-shake';
            } else if (isSelected) {
              style = 'bg-indigo-50 border-indigo-600 text-indigo-950 font-semibold ring-2 ring-indigo-200 scale-102';
            }

            return (
              <button
                key={tile.id}
                onClick={() => handleTileClick(tile)}
                className={`h-28 p-4 rounded-2xl border text-xs sm:text-sm font-medium flex items-center justify-center text-center transition-all duration-150 select-none ${style}`}
              >
                <span>{tile.text}</span>
              </button>
            );
          })}
        </div>
      ) : (
        /* Victory Screen */
        <div className="bg-white rounded-3xl border border-slate-200 p-8 text-center space-y-6 shadow-md animate-in fade-in">
          <div className="w-16 h-16 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto">
            <Trophy className="w-8 h-8 fill-amber-400" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-slate-900">Lighting Fast!</h2>
            <p className="text-sm text-slate-500 mt-1">You cleared all pairs on the board.</p>
          </div>

          <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 max-w-xs mx-auto">
            <div className="text-3xl font-black text-indigo-600 font-mono">{formatTime(time)}</div>
            <div className="text-xs font-semibold text-slate-400 mt-1">Clear Time</div>
          </div>

          <button
            onClick={initGame}
            className="w-full max-w-xs mx-auto py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm rounded-2xl transition-all shadow-md shadow-indigo-200 flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            Play Again
          </button>
        </div>
      )}

    </div>
  );
};
