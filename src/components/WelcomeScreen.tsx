import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Play, Sparkles, BookOpen, Clock, User, Award } from 'lucide-react';

interface WelcomeScreenProps {
  onStartGame: (playerName: string, mode: 'study' | 'exam') => void;
  onEnterTeacherPanel: () => void;
}

export default function WelcomeScreen({ onStartGame, onEnterTeacherPanel }: WelcomeScreenProps) {
  const [name, setName] = useState('');
  const [mode, setMode] = useState<'study' | 'exam'>('exam'); // standard exam default
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Por favor, informe seu nome para começar!');
      return;
    }
    setError('');
    onStartGame(name.trim(), mode);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      className="w-full max-w-2xl mx-auto py-4 px-4"
      id="welcome-container"
    >
      {/* Hero Header */}
      <div className="text-center mb-8" id="welcome-heading-block">
        <div className="flex justify-center items-center gap-2 mb-2">
          <span className="px-3 py-1.5 text-xs font-black uppercase tracking-widest text-indigo-700 bg-indigo-100 rounded-full flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" /> QUIZ INTERATIVO
          </span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 mt-2">
          DESIGN QUEST
        </h1>
        <p className="text-sm sm:text-base text-slate-600 mt-2 max-w-md mx-auto">
          Heurísticas de interface, leis autorais e regras C-R-A-P. Divirta-se e aprenda!
        </p>
      </div>      <div className="bg-white rounded-2xl sm:rounded-[32px] border-2 sm:border-4 border-[#E0E7FF] shadow-2xl p-4 sm:p-8 md:p-10 space-y-5 sm:space-y-6" id="welcome-card">
        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6" id="welcome-form">
          <div>
            <label htmlFor="student-name-input" className="block text-[11px] sm:text-xs font-black uppercase tracking-widest text-[#6366F1] mb-2 text-center sm:text-left">
              Seu Nome Completo ou Apelido:
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <User className="w-5 h-5" />
              </span>
              <input
                id="student-name-input"
                type="text"
                placeholder="Ex. Maria Silva, João Santos..."
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (e.target.value) setError('');
                }}
                className="w-full pl-11 pr-4 py-3 bg-[#F8FAFC] border-2 border-[#E2E8F0] rounded-xl text-slate-850 placeholder-slate-400 focus:outline-none focus:border-[#6366F1] focus:bg-[#EEF2FF] transition-all font-semibold text-base h-12"
              />
            </div>
            {error && (
              <p className="text-xs sm:text-sm text-red-500 mt-2 flex items-center gap-1 justify-center sm:justify-start" id="name-error-text">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping" /> {error}
              </p>
            )}
          </div>

          {/* Mode Selector */}
          <div className="space-y-3" id="mode-selector-block">
            <span className="block text-[11px] sm:text-xs font-black uppercase tracking-widest text-[#6366F1] text-center sm:text-left">
              Modo de Jogo:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              {/* Study Mode */}
              <button
                type="button"
                id="mode-study-btn"
                onClick={() => setMode('study')}
                className={`flex flex-col text-left p-4 rounded-xl border-2 transition-all relative overflow-hidden cursor-pointer ${
                  mode === 'study'
                    ? 'border-[#6366F1] bg-[#EEF2FF] shadow-sm'
                    : 'border-[#E2E8F0] bg-[#F8FAFC] hover:border-slate-350 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className={`p-1.5 rounded-lg ${mode === 'study' ? 'bg-[#6366F1] text-white' : 'bg-[#E2E8F0] text-slate-500'}`}>
                    <BookOpen className="w-4 h-4" />
                  </span>
                  <span className="font-extrabold text-slate-800 text-sm">Modo de Estudo</span>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed mt-1">
                  Resolução imediata. Veja a explicação da teoria passo a passo após cada resposta!
                </p>
                {mode === 'study' && (
                  <div className="absolute top-0 right-0 w-3 h-3 bg-[#6366F1]" />
                )}
              </button>

              {/* Exam Mode */}
              <button
                type="button"
                id="mode-exam-btn"
                onClick={() => setMode('exam')}
                className={`flex flex-col text-left p-4 rounded-xl border-2 transition-all relative overflow-hidden cursor-pointer ${
                  mode === 'exam'
                    ? 'border-[#6366F1] bg-[#EEF2FF] shadow-sm'
                    : 'border-[#E2E8F0] bg-[#F8FAFC] hover:border-slate-350 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className={`p-1.5 rounded-lg ${mode === 'exam' ? 'bg-[#6366F1] text-white' : 'bg-[#E2E8F0] text-slate-500'}`}>
                    <Clock className="w-4 h-4" />
                  </span>
                  <span className="font-extrabold text-slate-800 text-sm">Modo Desafio</span>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed mt-1">
                  Resolução corrida. Descubra a sua pontuação e resoluções detalhadas apenas no final!
                </p>
                {mode === 'exam' && (
                  <div className="absolute top-0 right-0 w-3 h-3 bg-[#6366F1]" />
                )}
              </button>
            </div>
          </div>

          <button
            type="submit"
            id="start-quiz-submit-btn"
            className="w-full bg-[#6366F1] hover:bg-[#5053db] cursor-pointer text-white font-extrabold h-12 sm:h-13 rounded-xl flex items-center justify-center gap-2 shadow-[0_4px_0_#4338CA] transition-all hover:translate-y-[1px] active:translate-y-1 active:shadow-none mt-6"
          >
            <Play className="w-5 h-5 fill-current" /> Começar Missão
          </button>
        </form>

        <div className="flex justify-center items-center pt-2">
          <button
            type="button"
            onClick={onEnterTeacherPanel}
            className="text-xs font-black text-[#6366F1] bg-[#EEF2FF] hover:bg-[#E0E7FF] px-4 py-2 rounded-xl transition-all cursor-pointer inline-flex items-center gap-1.5"
          >
            🔒 SOU PROFESSOR (VER NOTAS DA CLASSE)
          </button>
        </div>

        {/* Informative Stats */}
        <div className="border-t border-slate-100 pt-5 mt-4" id="welcome-topics">
          <h4 className="text-[10px] sm:text-xs font-black text-slate-400 uppercase tracking-widest mb-3 text-center sm:text-left">
            Tópicos Avaliados na Quest:
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
            {[
              'Princípios C-R-A-P',
              'Heurísticas de Interface',
              'Direito Autoral Visual',
              'Evolução do Design',
              'Intersecção UI e UX',
              'Elementos Visuais Básicos',
            ].map((topic, i) => (
              <div
                key={i}
                className="flex items-center gap-2 bg-[#F8FAFC] border border-[#E2E8F0] px-3 py-2 rounded-lg text-xs font-bold text-slate-650 shadow-sm"
              >
                <Award className="w-3.5 h-3.5 text-[#6366F1] shrink-0" />
                <span className="truncate">{topic}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
