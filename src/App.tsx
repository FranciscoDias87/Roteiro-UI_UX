/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { GameState, ScoreHistory } from './types';
import { questions } from './questions';
import WelcomeScreen from './components/WelcomeScreen';
import QuizGame from './components/QuizGame';
import ScoreScreen from './components/ScoreScreen';
import { Sparkles, Trophy, BookOpen, AlertCircle } from 'lucide-react';

export default function App() {
  const [gameState, setGameState] = useState<GameState>('WELCOME');
  const [playerName, setPlayerName] = useState('');
  const [gameMode, setGameMode] = useState<'study' | 'exam'>('study');
  const [answers, setAnswers] = useState<{ [questionId: number]: string }>({});
  const [totalTime, setTotalTime] = useState(0);

  // High score tracking
  const [history, setHistory] = useState<ScoreHistory[]>([]);

  // Load history from localStorage on mount
  useEffect(() => {
    try {
      const savedHistory = localStorage.getItem('CETI_QUIZ_HISTORY');
      if (savedHistory) {
        setHistory(JSON.parse(savedHistory));
      }
    } catch (e) {
      console.error('Failed to parse history from localStorage', e);
    }
  }, []);

  const handleStartGame = (name: string, mode: 'study' | 'exam') => {
    setPlayerName(name);
    setGameMode(mode);
    setAnswers({});
    setTotalTime(0);
    setGameState('PLAYING');
  };

  const handleFinishGame = (finalAnswers: { [questionId: number]: string }, timeElapsed: number) => {
    setAnswers(finalAnswers);
    setTotalTime(timeElapsed);
    
    // Calculate correct answers
    let correct = 0;
    questions.forEach((q) => {
      if (finalAnswers[q.id] === q.correctOption) {
        correct++;
      }
    });

    // Save attempt in state & localStorage
    const newAttempt: ScoreHistory = {
      date: new Date().toLocaleDateString('pt-BR'),
      score: correct,
      total: questions.length,
      timeTaken: timeElapsed
    };

    const updatedHistory = [newAttempt, ...history].slice(0, 5); // keep top 5
    setHistory(updatedHistory);
    try {
      localStorage.setItem('CETI_QUIZ_HISTORY', JSON.stringify(updatedHistory));
    } catch (e) {
      console.error('Could not write to localStorage', e);
    }

    setGameState('SUMMARY');
  };

  const handleRestart = () => {
    setGameState('WELCOME');
    // Keep player name for ease of reuse
  };

  // Find personal high score
  const personalBest = history.length > 0 
    ? [...history].sort((a, b) => b.score - a.score || a.timeTaken - b.timeTaken)[0] 
    : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F0F9FF] to-[#E0F2FE] flex flex-col font-sans" id="app-root-container">
      {/* Educational Header with Vibrant Palette */}
      <header className="w-full bg-[#6366F1] text-white py-4 px-6 sticky top-0 z-40 shadow-md" id="global-header">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="bg-white w-10 h-10 rounded-xl flex items-center justify-center font-black text-xl text-[#6366F1] shadow-md shadow-black/10">
              Q
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-black tracking-tight leading-none text-white">CETI Moisaniel Alves de Sousa</h2>
              <p className="text-[10px] text-indigo-100 font-extrabold tracking-widest uppercase mt-1">Ambiente de E-Learning • DESIGN QUEST</p>
            </div>
          </div>

          {/* Local Score Dashboard inside Header with transparent/yellow badge */}
          {personalBest && gameState === 'WELCOME' && (
            <div className="flex items-center gap-2 bg-black/20 border border-white/10 px-3.5 py-1.5 rounded-full text-xs text-white" id="personal-best-header-pill">
              <Trophy className="w-3.5 h-3.5 text-[#FACC15] animate-pulse" />
              <span className="font-bold">
                Recorde Atual: <strong className="text-[#FACC15] font-black">{personalBest.score}/{personalBest.total}</strong> em {personalBest.timeTaken}s
              </span>
            </div>
          )}
        </div>
      </header>

      {/* Main Container Area */}
      <main className="flex-1 flex flex-col justify-center py-6 sm:py-8" id="main-stage">
        {gameState === 'WELCOME' && (
          <WelcomeScreen onStartGame={handleStartGame} />
        )}

        {gameState === 'PLAYING' && (
          <QuizGame
            playerName={playerName}
            gameMode={gameMode}
            questions={questions}
            onFinishGame={handleFinishGame}
          />
        )}

        {gameState === 'SUMMARY' && (
          <ScoreScreen
            playerName={playerName}
            gameMode={gameMode}
            questions={questions}
            answers={answers}
            totalTime={totalTime}
            onRestart={handleRestart}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-100 py-4 px-6 text-center" id="global-footer">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2.5 text-xs text-slate-400 font-medium">
          <p>© {new Date().getFullYear()} CETI Moisaniel Alves de Sousa. Fabricas de Software.</p>
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1"><BookOpen className="w-3.5 h-3.5" /> Metodologia Ativa</span>
            <span className="flex items-center gap-1"><Sparkles className="w-3.5 h-3.5" /> Gamificação de Estudo</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

