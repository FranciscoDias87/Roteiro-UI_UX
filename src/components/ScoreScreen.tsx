import { motion } from 'motion/react';
import { Question } from '../types';
import { Award, RotateCcw, Check, X, Calendar, Clock, BookOpen, ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';

interface ScoreScreenProps {
  playerName: string;
  gameMode: 'study' | 'exam';
  questions: Question[];
  answers: { [questionId: number]: string };
  totalTime: number;
  onRestart: () => void;
}

export default function ScoreScreen({ playerName, gameMode, questions, answers, totalTime, onRestart }: ScoreScreenProps) {
  const [expandedExplanation, setExpandedExplanation] = useState<{ [qId: number]: boolean }>({});

  // Calculations
  const totalQuestions = questions.length;
  let correctCount = 0;
  questions.forEach((q) => {
    if (answers[q.id] === q.correctOption) {
      correctCount++;
    }
  });

  const percentage = (correctCount / totalQuestions) * 100;

  // Format time
  const formatTimeMinutes = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    if (mins === 0) {
      return `${secs}s`;
    }
    return `${mins}m ${secs}s`;
  };

  // Get personalized score badge & encouragement in PT-BR
  const getBadgeAndFeedback = (score: number) => {
    if (score === 10) {
      return {
        title: "Pixel Perfeito! 👑",
        feedback: "Desempenho espetacular, você dominou absolutamente todos os conceitos de Práticas de Interface, Leis de Direitos Autorais e Regras C-R-A-P!",
        color: "text-amber-600 bg-amber-50 border-amber-200",
        ringColor: "stroke-amber-500"
      };
    } else if (score >= 8) {
      return {
        title: "Mestre de UI/UX 🌟",
        feedback: "Excelente! Você demonstrou uma sólida compreensão de design estrutural, jornada do usuário e melhores práticas de acessibilidade nas telas.",
        color: "text-indigo-600 bg-indigo-50 border-indigo-200",
        ringColor: "stroke-indigo-500"
      };
    } else if (score >= 6) {
      return {
        title: "Designer Técnico 📐",
        feedback: "Bom trabalho! Você está no caminho certo. Revise as questões que errou no gabarito abaixo para solidificar este conhecimento e alcançar a maestria.",
        color: "text-emerald-600 bg-emerald-50 border-emerald-200",
        ringColor: "stroke-emerald-500"
      };
    } else {
      return {
        title: "Estudante Iterativo 🔄",
        feedback: "Como diz a heurística: o aprendizado e o design são processos iterativos de constante refinamento! Leia as explicações comentadas abaixo para consolidar as regras visuais.",
        color: "text-slate-600 bg-slate-50 border-slate-200",
        ringColor: "stroke-slate-500"
      };
    }
  };

  const performance = getBadgeAndFeedback(correctCount);

  const toggleExplanation = (qId: number) => {
    setExpandedExplanation((prev) => ({
      ...prev,
      [qId]: !prev[qId]
    }));
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="w-full max-w-3xl mx-auto py-2 px-4 space-y-6"
      id="score-screen-container"
    >
      {/* Top Banner Result Card with Vibrant thick borders */}
      <div className="bg-white border-2 sm:border-4 border-[#E0E7FF] rounded-2xl sm:rounded-[32px] shadow-2xl overflow-hidden" id="result-hero-card">
        <div className="p-4 sm:p-8 md:p-10 text-center space-y-5 sm:space-y-6">
          <div className="flex justify-center" id="score-icon-container">
            {/* Circular progress container */}
            <div className="relative w-28 h-28 sm:w-32 sm:h-32 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="42"
                  className="stroke-slate-105 fill-none"
                  strokeWidth="8"
                />
                <motion.circle
                  cx="50"
                  cy="50"
                  r="42"
                  className="fill-none stroke-[#6366F1]"
                  strokeWidth="8"
                  strokeDasharray="264"
                  initial={{ strokeDashoffset: 264 }}
                  animate={{ strokeDashoffset: 264 - (264 * percentage) / 100 }}
                  transition={{ duration: 1.2, ease: "easeOut" }}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute text-center">
                <span className="block text-2xl sm:text-3xl font-black text-slate-800">{correctCount}</span>
                <span className="block text-[9px] sm:text-[10px] font-black text-slate-400 uppercase tracking-widest">de {totalQuestions}</span>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <h2 className="text-xl sm:text-3xl font-black text-slate-900 mt-2">
              Mandou bem, <span className="text-[#6366F1]">{playerName}</span>!
            </h2>
            <div className={`inline-flex items-center gap-1.5 px-3 sm:px-4 py-1 sm:py-1.5 rounded-full border text-[10px] sm:text-xs font-black uppercase tracking-widest bg-[#EEF2FF] border-[#6366F1] text-[#6366F1]`} id="performance-badge">
              {performance.title}
            </div>
            <p className="text-xs sm:text-sm font-medium text-slate-500 max-w-md mx-auto leading-relaxed mt-2 p-1.5">
              {performance.feedback}
            </p>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-3 gap-2 sm:gap-3 border-t border-b border-indigo-50/60 py-4 sm:py-5 my-2 max-w-md mx-auto" id="score-metrics">
            <div className="text-center">
              <span className="block text-[8px] sm:text-[10px] text-slate-400 font-extrabold uppercase tracking-wide">Aproveitamento</span>
              <span className="text-sm sm:text-lg font-black text-slate-800 font-mono mt-1 block">{percentage}%</span>
            </div>
            <div className="text-center border-l border-slate-100">
              <span className="block text-[8px] sm:text-[10px] text-slate-400 font-extrabold uppercase tracking-wide">Tempo Total</span>
              <span className="text-sm sm:text-lg font-black text-slate-800 font-mono flex items-center justify-center gap-1 mt-1">
                <Clock className="w-3.5 h-3.5 text-slate-450" /> {formatTimeMinutes(totalTime)}
              </span>
            </div>
            <div className="text-center border-l border-slate-100">
              <span className="block text-[8px] sm:text-[10px] text-slate-400 font-extrabold uppercase tracking-wide">Modo</span>
              <span className="text-[9px] sm:text-xs font-black text-[#6366F1] bg-[#EEF2FF] px-2 py-0.5 rounded-full inline-block mt-1">
                {gameMode === 'study' ? 'ESTUDO' : 'DESAFIO'}
              </span>
            </div>
          </div>

          <div className="pt-2">
            <button
              onClick={onRestart}
              id="play-again-btn"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3 bg-[#6366F1] hover:bg-[#5053db] cursor-pointer text-white font-black rounded-xl text-sm transition-all shadow-[0_4px_0_#4338CA] active:translate-y-[2px] active:shadow-[0_2px_0_#4338CA]"
            >
              <RotateCcw className="w-4 h-4" /> RECOMECAR DESAFIO
            </button>
          </div>
        </div>
      </div>

      {/* Review Comentado Section */}
      <div className="space-y-4" id="score-gabarito">
        <h3 className="text-xs font-black uppercase tracking-widest text-[#6366F1] flex items-center justify-center sm:justify-start gap-2">
          <BookOpen className="w-4 h-4 text-[#6366F1]" /> Gabarito Técnico Comentado
        </h3>

        {questions.map((question, index) => {
          const studentAnswer = answers[question.id] || '';
          const isCorrect = studentAnswer === question.correctOption;
          const isExpanded = !!expandedExplanation[question.id];

          return (
            <div
              key={question.id}
              className={`bg-white border-2 rounded-xl sm:rounded-2xl overflow-hidden transition-all duration-200 ${
                isCorrect ? 'border-emerald-250' : 'border-rose-250'
              }`}
              id={`review-question-row-${question.id}`}
            >
              <div
                onClick={() => toggleExplanation(question.id)}
                className="p-4 sm:p-5 flex items-start gap-3 sm:gap-4 cursor-pointer hover:bg-slate-50/50 select-none"
              >
                {/* Result stamp */}
                <span
                  className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center shrink-0 text-white ${
                    isCorrect ? 'bg-emerald-500 shadow-sm' : 'bg-rose-500 shadow-sm'
                  }`}
                >
                  {isCorrect ? <Check className="w-4 h-4 stroke-[3.5px]" /> : <X className="w-4 h-4 stroke-[3.5px]" />}
                </span>

                {/* Question Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className="text-[9px] sm:text-[10px] uppercase font-black tracking-wider text-slate-400 bg-slate-100 px-2 py-0.5 rounded">
                      Questão {index + 1}
                    </span>
                    <span className="text-[9px] sm:text-[10px] uppercase font-black tracking-wider text-[#6366F1] bg-[#EEF2FF] px-2 py-0.5 rounded">
                      {question.topic}
                    </span>
                  </div>
                  <p className="text-xs sm:text-base font-bold text-slate-800 line-clamp-2 md:line-clamp-none pr-1">
                    {question.text.split('\n')[0]} {/* Show first line of text in title */}
                  </p>
                </div>

                <div className="text-slate-400 shrink-0 self-center pl-1">
                  {isExpanded ? <ChevronUp className="w-4 h-4 sm:w-5 sm:h-5" /> : <ChevronDown className="w-4 h-4 sm:w-5 sm:h-5" />}
                </div>
              </div>

              {/* Expansion block */}
              {isExpanded && (
                <div className="px-4 sm:px-5 pb-5 pt-1 border-t border-slate-50 space-y-4 bg-slate-50/30">
                  {/* Entire Question Text for full context */}
                  <div className="text-xs sm:text-sm text-slate-705 leading-relaxed bg-slate-50 p-3.5 sm:p-4 rounded-xl border border-slate-150 whitespace-pre-line">
                    <p className="font-extrabold text-[#6366F1] text-[9px] sm:text-[10px] uppercase tracking-wider mb-1.5">Conceito Completo:</p>
                    {question.text}
                  </div>

                  {/* Answers review list */}
                  <div className="grid grid-cols-1 gap-2">
                    {Object.entries(question.options).map(([key, value]) => {
                      const isCorrectOption = key === question.correctOption;
                      const isStudentOption = key === studentAnswer;

                      return (
                        <div
                          key={key}
                          className={`p-3 rounded-xl border-2 text-xs sm:text-sm flex gap-2.5 sm:gap-3 items-start ${
                            isCorrectOption
                              ? 'bg-emerald-50/60 border-emerald-250 text-emerald-950 font-semibold'
                              : isStudentOption
                              ? 'bg-rose-50/50 border-rose-250 text-rose-950'
                              : 'bg-white border-slate-100 text-slate-500'
                          }`}
                        >
                          <span
                            className={`w-6.5 h-6.5 sm:w-6 sm:h-6 rounded-lg flex items-center justify-center shrink-0 text-[10px] font-black border ${
                              isCorrectOption
                                ? 'bg-emerald-600 border-emerald-605 text-white'
                                : isStudentOption
                                ? 'bg-rose-600 border-rose-605 text-white'
                                : 'bg-slate-100 border-slate-200 text-slate-500'
                            }`}
                          >
                            {key}
                          </span>
                          <span className="flex-1 mt-0.5 text-xs sm:text-sm leading-tight sm:leading-normal">{value}</span>
                          {isCorrectOption && (
                            <span className="text-[8px] sm:text-[9px] font-black bg-emerald-100 text-emerald-800 px-2.5 py-1 rounded shrink-0 uppercase tracking-widest self-center">
                              Gabarito
                            </span>
                          )}
                          {isStudentOption && !isCorrectOption && (
                            <span className="text-[8px] sm:text-[9px] font-black bg-rose-100 text-rose-700 px-2.5 py-1 rounded shrink-0 uppercase tracking-widest self-center">
                              Seu Erro
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* Academic Explanation styled as Vibrant warning yellow box */}
                  <div className="bg-[#FACC15] text-[#854D0E] border border-amber-305 rounded-xl p-4 sm:p-5">
                    <h4 className="font-black text-[#854D0E] text-[11px] sm:text-sm mb-1.5 flex items-center gap-1.5 uppercase tracking-wider">
                      <BookOpen className="w-4 h-4 text-[#854D0E]" />
                      Análise de Resolução:
                    </h4>
                    <p className="font-medium text-xs sm:text-sm leading-relaxed whitespace-pre-line">
                      {question.explanation}
                    </p>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}
