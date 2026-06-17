/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { GameState, ScoreHistory, DuolingoLevel } from './types';
import { questions } from './questions';
import WelcomeScreen from './components/WelcomeScreen';
import QuizGame from './components/QuizGame';
import ScoreScreen from './components/ScoreScreen';
import TrailScreen, { levels } from './components/TrailScreen';
import TeacherDashboard from './components/TeacherDashboard';
import { db } from './firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { Sparkles, Trophy, BookOpen, AlertCircle, LogOut, ArrowRight } from 'lucide-react';

export default function App() {
  const [gameState, setGameState] = useState<GameState>('WELCOME');
  const [playerName, setPlayerName] = useState('');
  const [gameMode, setGameMode] = useState<'study' | 'exam'>('exam');
  const [answers, setAnswers] = useState<{ [questionId: number]: string }>({});
  const [totalTime, setTotalTime] = useState(0);

  // Completed levels tracking: levelId -> score, total, mode, answers, timeTaken
  const [savedScores, setSavedScores] = useState<{
    [levelId: string]: { score: number; total: number; mode: 'study' | 'exam'; answers: { [qId: number]: string }; timeTaken: number }
  }>({});

  // Active level selected to play
  const [activeLevel, setActiveLevel] = useState<DuolingoLevel | null>(null);

  // High score tracking (local history for browser profile)
  const [history, setHistory] = useState<ScoreHistory[]>([]);

  // Load history from localStorage on mount
  useEffect(() => {
    try {
      const savedHistory = localStorage.getItem('CETI_QUIZ_HISTORY');
      if (savedHistory) {
        setHistory(JSON.parse(savedHistory));
      }
      const savedScoresLocal = localStorage.getItem('CETI_QUIZ_COMPLETED_LEVELS_V1');
      if (savedScoresLocal) {
        setSavedScores(JSON.parse(savedScoresLocal));
      }
      const savedName = localStorage.getItem('CETI_NAME_PERSIST');
      if (savedName) {
        setPlayerName(savedName);
      }
    } catch (e) {
      console.error('Failed to parse history or states from localStorage', e);
    }
  }, []);

  // Set participant name and enter Duolingo map
  const handleStartGame = (name: string, mode: 'study' | 'exam') => {
    setPlayerName(name);
    setGameMode(mode);
    setAnswers({});
    setTotalTime(0);
    setGameState('TRAIL');
    try {
      localStorage.setItem('CETI_NAME_PERSIST', name);
    } catch (e) {}
  };

  // Launch a level challenge
  const handleStartLevel = (level: DuolingoLevel, levelMode: 'study' | 'exam') => {
    setActiveLevel(level);
    setGameMode(levelMode);
    setAnswers({});
    setTotalTime(0);
    setGameState('PLAYING');
  };

  // Student finished answering active level questions
  const handleFinishGame = (finalAnswers: { [questionId: number]: string }, timeElapsed: number) => {
    setAnswers(finalAnswers);
    setTotalTime(timeElapsed);
    setGameState('SUMMARY');
  };

  // Persist level submission to LocalStorage & Firestore `/student_levels`
  const handleSaveAndReturnToTrail = async (correct: number, total: number) => {
    if (!activeLevel) return;

    const newCompletes = {
      ...savedScores,
      [activeLevel.id]: {
        score: correct,
        total,
        mode: gameMode,
        answers,
        timeTaken: totalTime
      }
    };

    setSavedScores(newCompletes);
    try {
      localStorage.setItem('CETI_QUIZ_COMPLETED_LEVELS_V1', JSON.stringify(newCompletes));
    } catch (e) {}

    // Save level performance to Cloud Firestore!
    try {
      await addDoc(collection(db, 'student_levels'), {
        playerName,
        levelId: activeLevel.id,
        levelName: activeLevel.title,
        score: correct,
        total,
        mode: gameMode,
        timeTaken: totalTime,
        timestamp: serverTimestamp()
      });
    } catch (err) {
      console.error('Could not save to Firestore student_levels:', err);
    }

    // Reset active level and direct back to Duolingo Trail map
    setGameState('TRAIL');
  };

  // Finalize overall trail and submit master logs to Firestore `/student_sessions`
  const handleFinishCourse = async () => {
    // Collect all unique questions played
    let totalCorrect = 0;
    let totalQs = 0;
    let accumulatedTime = 0;
    const breakdown: { [key: string]: number } = {};

    Object.entries(savedScores).forEach(([lvlId, summary]) => {
      const typedSummary = summary as { score: number; total: number; mode: 'study' | 'exam'; answers: { [qId: number]: string }; timeTaken: number };
      totalCorrect += typedSummary.score;
      totalQs += typedSummary.total;
      accumulatedTime += typedSummary.timeTaken;
      breakdown[lvlId] = typedSummary.score;
    });

    if (totalQs === 0) {
      alert('Por favor, conclua pelo menos um nível para enviar suas notas!');
      return;
    }

    const percentage = Math.round((totalCorrect / totalQs) * 100);

    // Save final master session log to Firestore!
    try {
      await addDoc(collection(db, 'student_sessions'), {
        playerName,
        overallScore: totalCorrect,
        overallTotal: totalQs,
        overallPercentage: percentage,
        completedLevelsCount: Object.keys(savedScores).length,
        timeTaken: accumulatedTime,
        mode: gameMode,
        timestamp: serverTimestamp()
      });

      alert(`✅ Notas enviadas com sucesso, ${playerName}!\n\nNota geral: ${totalCorrect}/${totalQs} (${percentage}%)\nAproveitamento Registrado no Painel do Professor.`);
    } catch (err) {
      console.error('Error uploading master session:', err);
      alert('⚠️ Suas notas foram arquivadas localmente, mas não puderam ser transmitidas à rede. Verifique sua conexão.');
    }

    // Reconstruct consolidated answers sheet for overall score review
    const combinedAnswers: { [qId: number]: string } = {};
    Object.values(savedScores).forEach(lvlSummary => {
      const typedSummary = lvlSummary as { score: number; total: number; mode: 'study' | 'exam'; answers: { [qId: number]: string }; timeTaken: number };
      Object.assign(combinedAnswers, typedSummary.answers);
    });
    setAnswers(combinedAnswers);
    setTotalTime(accumulatedTime);

    // Keep history tracking
    const newAttempt: ScoreHistory = {
      date: new Date().toLocaleDateString('pt-BR'),
      score: totalCorrect,
      total: totalQs,
      timeTaken: accumulatedTime
    };
    const updatedHistory = [newAttempt, ...history].slice(0, 5);
    setHistory(updatedHistory);
    try {
      localStorage.setItem('CETI_QUIZ_HISTORY', JSON.stringify(updatedHistory));
    } catch (e) {}

    // Disable active level context to show overall consolidated questions in ScoreScreen
    setActiveLevel(null);
    setGameState('SUMMARY');
  };

  const handleRestart = () => {
    setGameState('WELCOME');
    setPlayerName('');
    setSavedScores({});
    try {
      localStorage.removeItem('CETI_QUIZ_COMPLETED_LEVELS_V1');
      localStorage.removeItem('CETI_NAME_PERSIST');
    } catch (e) {}
  };

  // Find personal high score
  const personalBest = history.length > 0 
    ? [...history].sort((a, b) => b.score - a.score || a.timeTaken - b.timeTaken)[0] 
    : null;

  // Filter questions dynamically based on active level (e.g. Duolingo lesson)
  const activeQuestions = activeLevel 
    ? questions.filter(q => activeLevel.questionIds.includes(q.id))
    : questions;

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
              <h1 className="text-sm sm:text-base font-black tracking-tight leading-none text-white">CETI Moisaniel Alves de Sousa</h1>
              <p className="text-[10px] text-indigo-100 font-extrabold tracking-widest uppercase mt-1">Ambiente de E-Learning • DESIGN QUEST</p>
            </div>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            {/* Local Score Dashboard inside Header with transparent/yellow badge */}
            {personalBest && gameState === 'WELCOME' && (
              <div className="flex items-center gap-2 bg-black/20 border border-white/10 px-3.5 py-1.5 rounded-full text-xs text-white" id="personal-best-header-pill">
                <Trophy className="w-3.5 h-3.5 text-[#FACC15] animate-pulse" />
                <span className="font-bold">
                  Melhor Nota: <strong className="text-[#FACC15] font-black">{personalBest.score}/{personalBest.total}</strong>
                </span>
              </div>
            )}

            {/* Quick exit student session to change participant */}
            {playerName && gameState !== 'WELCOME' && gameState !== 'TEACHER' && (
              <button
                onClick={() => {
                  if (confirm('Deseja realmente sair da sessão de ' + playerName + '? Seus níveis concluídos serão zerados para o próximo aluno.')) {
                    handleRestart();
                  }
                }}
                className="text-xs bg-red-500/10 hover:bg-red-500/20 text-indigo-100 font-bold px-2.5 py-1.5 rounded-lg flex items-center gap-1 cursor-pointer transition-all border border-indigo-400/20"
                title="Trocar de Aluno"
              >
                <LogOut className="w-3.5 h-3.5 text-indigo-200" /> Sair ({playerName})
              </button>
            )}

            {/* Admin shortcut button - only shown on initial landing screen, completely hidden from students on the map or game */}
            {gameState === 'WELCOME' && (
              <button
                onClick={() => setGameState('TEACHER')}
                className="text-xs bg-white/15 hover:bg-white/25 border border-white/10 text-white font-black px-3.5 py-1.5 rounded-xl transition-all flex items-center gap-1 cursor-pointer"
                id="admin-shortcut-header-button"
              >
                🔒 Área do Professor
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Container Area */}
      <main className="flex-1 flex flex-col justify-center py-6 sm:py-8" id="main-stage">
        {gameState === 'WELCOME' && (
          <WelcomeScreen 
            onStartGame={handleStartGame} 
            onEnterTeacherPanel={() => setGameState('TEACHER')}
          />
        )}

        {gameState === 'TRAIL' && (
          <TrailScreen
            playerName={playerName}
            savedScores={savedScores}
            onStartLevel={handleStartLevel}
            onEnterTeacherPanel={() => setGameState('TEACHER')}
            onFinishCourse={handleFinishCourse}
            overallTime={totalTime}
          />
        )}

        {gameState === 'PLAYING' && (
          <QuizGame
            playerName={playerName}
            gameMode={gameMode}
            questions={activeQuestions}
            onFinishGame={handleFinishGame}
          />
        )}

        {gameState === 'SUMMARY' && (
          <ScoreScreen
            playerName={playerName}
            gameMode={gameMode}
            questions={activeQuestions}
            answers={answers}
            totalTime={totalTime}
            onRestart={handleRestart}
            activeLevelTitle={activeLevel ? activeLevel.title : undefined}
            onSaveAndReturnToTrail={activeLevel ? handleSaveAndReturnToTrail : undefined}
          />
        )}

        {gameState === 'TEACHER' && (
          <TeacherDashboard
            onBack={() => {
              setGameState(playerName ? 'TRAIL' : 'WELCOME');
            }}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-100 py-4 px-6 text-center" id="global-footer">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2.5 text-xs text-slate-400 font-medium">
          <p>© {new Date().getFullYear()} CETI Moisaniel Alves de Sousa. Fábricas de Software.</p>
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1"><BookOpen className="w-3.5 h-3.5" /> Metodologia Ativa</span>
            <span className="flex items-center gap-1"><Sparkles className="w-3.5 h-3.5" /> Gamificação de Estudo</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

