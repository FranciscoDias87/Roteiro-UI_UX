import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Question } from '../types';
import { ArrowRight, CheckCircle2, XCircle, Timer, Award, MessageSquare, Zap } from 'lucide-react';

interface QuizGameProps {
  playerName: string;
  gameMode: 'study' | 'exam';
  questions: Question[];
  onFinishGame: (answers: { [questionId: number]: string }, totalTime: number) => void;
}

export default function QuizGame({ playerName, gameMode, questions, onFinishGame }: QuizGameProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [confirmed, setConfirmed] = useState(false);
  const [answers, setAnswers] = useState<{ [questionId: number]: string }>({});
  
  // Timer state
  const [secondsElapsed, setSecondsElapsed] = useState(0);
  
  // Feedback state (only for 'study' mode)
  const [correctStreak, setCorrectStreak] = useState(0);

  const currentQuestion = questions[currentIndex];

  // Start general timer
  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsElapsed((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Format timer text
  const formatTime = (totalSeconds: number) => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleOptionSelect = (optionKey: string) => {
    if (confirmed) return; // Prevent changing after confirmation in study mode
    setSelectedOption(optionKey);
  };

  const handleConfirm = () => {
    if (!selectedOption) return;

    if (gameMode === 'study') {
      setConfirmed(true);
      // Update streaks
      const isCorrect = selectedOption === currentQuestion.correctOption;
      if (isCorrect) {
        setCorrectStreak((prev) => prev + 1);
      } else {
        setCorrectStreak(0);
      }
    } else {
      // In exam mode, save and immediately move on or let them confirm
      const updatedAnswers = { ...answers, [currentQuestion.id]: selectedOption };
      setAnswers(updatedAnswers);
      setSelectedOption(null);
      
      if (currentIndex < questions.length - 1) {
        setCurrentIndex((prev) => prev + 1);
      } else {
        onFinishGame(updatedAnswers, secondsElapsed);
      }
    }
  };

  const handleNextQuestion = () => {
    if (selectedOption) {
      const updatedAnswers = { ...answers, [currentQuestion.id]: selectedOption };
      setAnswers(updatedAnswers);
    }
    
    setSelectedOption(null);
    setConfirmed(false);

    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      // Submit with final current answer included
      onFinishGame({ ...answers, [currentQuestion.id]: selectedOption || '' }, secondsElapsed);
    }
  };

  const progressPercentage = ((currentIndex + 1) / questions.length) * 100;

  // Render question text with nice formatting (especially handles vertical list formatting such as V/F brackets)
  const renderFormattedText = (text: string) => {
    return text.split('\n').map((line, idx) => (
      <p key={idx} className={`${line.trim().startsWith('(') ? 'mt-2 pl-4 border-l-2 border-indigo-100 font-medium' : ''}`}>
        {line}
      </p>
    ));
  };

  return (
    <div className="w-full max-w-3xl mx-auto py-2 px-4" id="quiz-game-wrapper">
      {/* Quiz Top bar info */}
      <div className="bg-white border border-slate-100 rounded-2xl shadow-md p-4 mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between" id="game-info-bar">
        {/* Progress Section */}
        <div className="flex-1 space-y-1.5" id="game-progress-wrapper">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
            <span className="flex items-center gap-1.5">
              <Award className="w-4 h-4 text-indigo-500" />
              Progresso do Estudante: <strong className="text-slate-800">{currentIndex + 1}/{questions.length}</strong>
            </span>
            <span id="active-tracker-ratio" className="text-indigo-600 font-bold">{Math.round(progressPercentage)}%</span>
          </div>
          <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden relative">
            <motion.div
              className="h-full bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-full"
              initial={{ width: '0%' }}
              animate={{ width: `${progressPercentage}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>

        {/* Stats indicators */}
        <div className="flex items-center gap-3 self-center sm:self-start shrink-0" id="game-header-indicators">
          {/* Streak Indicator (Only in Study Mode) */}
          {gameMode === 'study' && correctStreak > 0 && (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              key={correctStreak}
              className="flex items-center gap-1 px-2.5 py-1.5 bg-amber-50 border border-amber-200 rounded-full text-amber-700 text-xs font-black uppercase tracking-wider"
              id="streak-badge"
            >
              <Zap className="w-4 h-4 text-amber-500 fill-amber-500 animate-bounce" />
              Combo x{correctStreak}
            </motion.div>
          )}

          {/* Time Counter */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-full text-slate-600 text-xs font-bold" id="timer-badge">
            <Timer className="w-4 h-4 text-slate-500" />
            <span>{formatTime(secondsElapsed)}</span>
          </div>
        </div>
      </div>

      {/* Main Question Interface Card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentQuestion.id}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.25 }}
          className="bg-white border-2 sm:border-4 border-[#E0E7FF] rounded-2xl sm:rounded-[32px] shadow-2xl overflow-hidden"
          id={`question-card-${currentQuestion.id}`}
        >
          {/* Header Theme tag with Vibrant Palette colors (Responsive Padding) */}
          <div className="px-4 sm:px-6 py-3 sm:py-4 bg-slate-50 border-b border-slate-100 flex items-center justify-between" id="question-topic-bar">
            <span className="text-[10px] sm:text-xs font-extrabold uppercase tracking-widest text-[#6366F1] truncate max-w-[70%]">
              DESAFIO: {currentQuestion.topic}
            </span>
            <span className="text-[10px] sm:text-xs font-black text-slate-400 font-mono bg-slate-200/60 px-2 py-0.5 rounded shrink-0">
              QUESTÃO {currentQuestion.id}
            </span>
          </div>

          <div className="p-4 sm:p-10 space-y-5 sm:space-y-6" id="question-body">
            {/* Question Text (Responsive Text Sizes & Spacing) */}
            <div className="text-slate-800 font-bold text-base sm:text-2xl leading-snug space-y-3" id="question-text-field">
              {renderFormattedText(currentQuestion.text)}
            </div>

            {/* Answer Options */}
            <div className="space-y-2.5 sm:space-y-3" id="options-block">
              {Object.entries(currentQuestion.options).map(([key, value]) => {
                const isSelected = selectedOption === key;
                let optionStyle = 'border-[#E2E8F0] bg-[#F8FAFC] text-[#475569] hover:border-[#6366F1] hover:bg-[#EEF2FF] hover:-translate-y-0.5 shadow-sm';
                let labelStyle = 'bg-[#6366F1] text-white';
                let iconToRender = null;

                if (confirmed && gameMode === 'study') {
                  const isCorrect = key === currentQuestion.correctOption;
                  const isWrongSelection = isSelected && !isCorrect;

                  if (isCorrect) {
                     optionStyle = 'border-emerald-500 bg-emerald-50 text-emerald-950 ring-2 ring-emerald-500/25';
                     labelStyle = 'bg-emerald-600 text-white';
                     iconToRender = <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />;
                  } else if (isWrongSelection) {
                     optionStyle = 'border-rose-500 bg-rose-50 text-rose-950 ring-2 ring-rose-500/25';
                     labelStyle = 'bg-rose-600 text-white';
                     iconToRender = <XCircle className="w-5 h-5 text-rose-600 shrink-0" />;
                  } else {
                     optionStyle = 'border-slate-100 bg-slate-50 text-slate-400 opacity-50';
                     labelStyle = 'bg-slate-300 text-slate-100';
                  }
                } else if (isSelected) {
                  optionStyle = 'border-[#6366F1] bg-[#EEF2FF] text-[#1E293B] ring-2 ring-[#6366F1]/30';
                }

                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => handleOptionSelect(key)}
                    id={`option-btn-${currentQuestion.id}-${key}`}
                    disabled={confirmed}
                    className={`w-full text-left p-3.5 sm:p-5 rounded-xl sm:rounded-2xl border-2 transition-all flex items-start gap-3 sm:gap-4 group cursor-pointer ${optionStyle}`}
                  >
                    {/* Square layout for Option label, mimicking Design HTML's .option-label */}
                    <span
                      className={`text-xs sm:text-sm font-black w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center shrink-0 shadow-sm transition-all ${labelStyle}`}
                    >
                      {key}
                    </span>

                    {/* Option Text with responsive layout */}
                    <span className="text-xs sm:text-base font-semibold leading-relaxed flex-1 pt-0.5">
                      {value}
                    </span>

                    {/* Feedback Icon */}
                    {iconToRender}
                  </button>
                );
              })}
            </div>

            {/* Academic Explanation Slide in (Responsive Spacing) */}
            <AnimatePresence>
              {confirmed && gameMode === 'study' && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="bg-[#FACC15] text-[#854D0E] rounded-xl sm:rounded-2xl p-4 sm:p-5 overflow-hidden border border-amber-300/45 shadow-md"
                  id="explanation-block"
                >
                  <div className="flex items-start gap-2.5 sm:gap-3">
                    <span className="p-1 sm:p-1.5 rounded-lg bg-[#854D0E]/10 shrink-0 mt-0.5">
                      <MessageSquare className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#854D0E]" />
                    </span>
                    <div className="space-y-1">
                      <h4 className="font-extrabold text-[11px] sm:text-sm uppercase tracking-wider">💡 Dica Coesa de Estudo:</h4>
                      <p className="leading-relaxed text-xs sm:text-sm font-medium whitespace-pre-line">
                        {currentQuestion.explanation}
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Controls panel - Flex wrap column on mobile to save horizontal space, row on desktop */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4 border-t border-slate-100 pt-5 sm:pt-6 mt-4" id="controls-panel">
              <span className="text-[10px] sm:text-xs text-slate-500 font-extrabold uppercase tracking-wider text-center sm:text-left">
                {gameMode === 'study' ? 'Modo de Estudo' : 'Modo Desafio'}
              </span>

              {/* Show Confirmation for Study or Next buttons accordingly */}
              {gameMode === 'study' ? (
                !confirmed ? (
                  <button
                    type="button"
                    id="confirm-answer-btn"
                    disabled={!selectedOption}
                    onClick={handleConfirm}
                    className={`w-full sm:w-auto px-6 sm:px-8 h-12 rounded-xl text-xs sm:text-sm font-black flex items-center justify-center gap-2 transition-all outline-none ${
                      selectedOption
                        ? 'bg-[#6366F1] hover:bg-[#5053db] cursor-pointer text-white shadow-[0_4px_0_#4338CA] active:translate-y-[2px] active:shadow-[0_2px_0_#4338CA]'
                        : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                    }`}
                  >
                    CONFIRMAR RESPOSTA
                  </button>
                ) : (
                  <button
                    type="button"
                    id="next-question-btn"
                    onClick={handleNextQuestion}
                    className="w-full sm:w-auto px-6 sm:px-8 h-12 bg-[#6366F1] hover:bg-[#5053db] cursor-pointer text-white font-black rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-[0_4px_0_#4338CA] active:translate-y-[2px] active:shadow-[0_2px_0_#4338CA]"
                  >
                    {currentIndex < questions.length - 1 ? 'SEGUINTE' : 'VER VEREDITO'}
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )
              ) : (
                /* In Exam mode, directly let the student submit the question */
                <button
                  type="button"
                  id="confirm-exam-answer-btn"
                  disabled={!selectedOption}
                  onClick={handleConfirm}
                  className={`w-full sm:w-auto px-6 sm:px-8 h-12 rounded-xl text-xs sm:text-sm font-black flex items-center justify-center gap-2 transition-all outline-none ${
                    selectedOption
                      ? 'bg-[#6366F1] hover:bg-[#5053db] cursor-pointer text-white shadow-[0_4px_0_#4338CA] active:translate-y-[2px] active:shadow-[0_2px_0_#4338CA]'
                      : 'bg-slate-105 text-slate-400 cursor-not-allowed'
                  }`}
                >
                  {currentIndex < questions.length - 1 ? 'PRÓXIMA QUESTÃO' : 'FINALIZAR DESAFIO'}
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
