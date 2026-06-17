import { useState } from 'react';
import { DuolingoLevel, StudentSessionResult } from '../types';
import { Shield, Crop, Sparkles, Brain, Trophy, ChevronRight, Play, BookOpen, Star, HelpCircle, CheckCircle2, Award, LogOut } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// Define our 4 Duolingo-style levels 
export const levels: DuolingoLevel[] = [
  {
    id: 'level_1',
    title: 'Propriedade Intelectual & Marcas',
    topicTag: 'Proteção Visual',
    description: 'Aprenda leis de direitos autorais, plágio (como o caso Tóquio 2020), proteção visual por marca d\'água e originalidade no branding.',
    iconName: 'Shield',
    colorClass: 'bg-[#FF9F1C]', // bright orange
    borderClass: 'border-[#CC7E16] text-[#6A4105]',
    textColor: 'text-amber-900',
    badgeColor: 'bg-amber-100 text-amber-800',
    questionIds: [1, 2, 3]
  },
  {
    id: 'level_2',
    title: 'Princípios de Design C-R-A-P',
    topicTag: 'Princípios C-R-A-P',
    description: 'Aprofunde-se nos quatro pilares do design visual básico: Contraste para destaque de leituras e Repetição para coesão de telas.',
    iconName: 'Crop',
    colorClass: 'bg-[#38BDF8]', // bright blue
    borderClass: 'border-[#0284C7] text-[#035A88]',
    textColor: 'text-indigo-900',
    badgeColor: 'bg-sky-100 text-sky-800',
    questionIds: [4, 8, 10]
  },
  {
    id: 'level_3',
    title: 'Heurísticas de Visibilidade & Familiaridade',
    topicTag: 'Usabilidade',
    description: 'Aprenda sobre design intuitivo, ícones coesos (como a engrenagem no Duolingo) e consistência para redução de erros cognitivos.',
    iconName: 'Sparkles',
    colorClass: 'bg-[#22C55E]', // vibrant green
    borderClass: 'border-[#15803D] text-[#0F5D2C]',
    textColor: 'text-green-905',
    badgeColor: 'bg-green-100 text-green-800',
    questionIds: [5, 7, 9]
  },
  {
    id: 'level_4',
    title: 'Evolução e Psicologia Cognitiva',
    topicTag: 'História & Mídia',
    description: 'Estudo do layout, redução de sobrecarga mental, uso estrutural de linhas divisórias e evolução temporal de web design.',
    iconName: 'Brain',
    colorClass: 'bg-[#A855F7]', // nice purple
    borderClass: 'border-[#7E22CE] text-[#5C11A1]',
    textColor: 'text-purple-900',
    badgeColor: 'bg-purple-100 text-purple-800',
    questionIds: [6]
  }
];

interface TrailScreenProps {
  playerName: string;
  savedScores: { [levelId: string]: { score: number; total: number; mode: 'study' | 'exam' } };
  onStartLevel: (level: DuolingoLevel, mode: 'study' | 'exam') => void;
  onEnterTeacherPanel: () => void;
  onFinishCourse: () => void;
  overallTime: number;
}

export default function TrailScreen({
  playerName,
  savedScores,
  onStartLevel,
  onEnterTeacherPanel,
  onFinishCourse,
  overallTime
}: TrailScreenProps) {
  const [selectedLevel, setSelectedLevel] = useState<DuolingoLevel | null>(null);
  const [modeSelection, setModeSelection] = useState<'study' | 'exam'>('exam');

  const getIcon = (name: string, sizeClass = "w-6 h-6") => {
    switch (name) {
      case 'Shield': return <Shield className={sizeClass} />;
      case 'Crop': return <Crop className={sizeClass} />;
      case 'Sparkles': return <Sparkles className={sizeClass} />;
      case 'Brain': return <Brain className={sizeClass} />;
      default: return <HelpCircle className={sizeClass} />;
    }
  };

  // Calculating overall progress
  const answeredCount = Object.values(savedScores).reduce((acc, curr) => acc + curr.score, 0);
  const totalInSaved = Object.values(savedScores).reduce((acc, curr) => acc + curr.total, 0);
  const levelsCount = Object.keys(savedScores).length;
  
  // Custom Duolingo-style Mascot phrases based on user completions
  const getMascotMessage = () => {
    if (levelsCount === 0) {
      return `Oi **${playerName}**! Eu sou o Corujinha do CETI. Clique na primeira lição ali embaixo para iniciarmos nossa aventura em UI/UX! 🦉💚`;
    }
    if (levelsCount === 4) {
      return `Incrível, **${playerName}**! Você concluiu todos os 4 níveis! Clique em "Finalizar e Enviar Notas" para registrar sua grande nota na classe! 🎉🎓`;
    }
    return `Mandou bem! Você já completou **${levelsCount} de 4** áreas. Que tal avançar para a próxima lição para virar um profissional de design? 🚀`;
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-2" id="trail-screen-container">
      {/* Mini Profile Status bar */}
      <div className="bg-white border-2 border-[#E0E7FF] rounded-2xl p-4 shadow-md flex flex-wrap items-center justify-between gap-3 mb-6" id="student-profile-bar">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-[#6366F1] to-[#4F46E5] flex items-center justify-center font-black text-white text-lg border-2 border-white shadow-md">
            {playerName.slice(0, 2).toUpperCase()}
          </div>
          <div>
            <span className="block text-[10px] text-slate-400 font-extrabold uppercase tracking-wide">Cadastrado como</span>
            <h3 className="text-sm font-black text-slate-800">{playerName}</h3>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-center">
            <span className="block text-[9px] text-slate-400 font-extrabold uppercase tracking-widest">Estrelas</span>
            <div className="flex items-center gap-1.5 justify-center">
              <Star className="w-4.5 h-4.5 text-amber-500 fill-amber-400" />
              <span className="text-sm font-black text-slate-700 font-mono">{answeredCount}</span>
            </div>
          </div>

          <div className="text-center border-l border-indigo-50 pl-4">
            <span className="block text-[9px] text-slate-400 font-extrabold uppercase tracking-widest">Progresso</span>
            <span className="text-xs font-black text-[#6366F1] block mt-1 bg-[#EEF2FF] px-2 py-0.5 rounded-full">
              {levelsCount} / 4 Níveis
            </span>
          </div>
        </div>
      </div>

      {/* Duo supportive box at CETI */}
      <div className="bg-[#E8F5E9] border-2 border-[#A5D6A7] rounded-2xl p-4 flex gap-4 items-center mb-8" id="duo-mascot-tip">
        {/* Cute Mascot vector placeholder */}
        <div className="w-14 h-14 bg-[#4CAF50] rounded-2xl flex-shrink-0 flex items-center justify-center text-4xl border-b-4 border-[#2E7D32]">
          🦉
        </div>
        <div>
          <p 
            className="text-xs sm:text-sm font-bold text-green-950 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: getMascotMessage() }}
          />
        </div>
      </div>

      {/* Vertical Map Path */}
      <div className="relative flex flex-col items-center py-6 select-none" id="duolingo-zigzag-map">
        
        {/* SVG connection path */}
        <svg className="absolute left-1/2 -translate-x-1/2 w-48 h-[520px] pointer-events-none stroke-slate-200 fill-none" style={{ zIndex: 0 }}>
          <path d="M 96,25 Q 160,110 96,160 T 96,300 T 96,440" strokeWidth="12" strokeLinecap="round" strokeDasharray="3 15" />
          {/* Completed overlay path highlighted in green */}
          {levelsCount > 0 && (
            <path 
              d={
                levelsCount === 1 ? "M 96,25 Q 160,110 96,160" :
                levelsCount === 2 ? "M 96,25 Q 160,110 96,160 T 96,300" :
                "M 96,25 Q 160,110 96,160 T 96,300 T 96,440"
              } 
              stroke="#4CAF50" 
              strokeWidth="12" 
              strokeLinecap="round" 
              strokeDasharray="3 15" 
            />
          )}
        </svg>

        {/* Level steps */}
        <div className="w-full relative space-y-20" style={{ zIndex: 10 }}>
          {levels.map((level, idx) => {
            const progress = savedScores[level.id];
            const isCompleted = !!progress;
            
            // Zigzag alignment classes: 
            // 0 -> leftish, 1 -> rightish, 2 -> leftish, 3 -> rightish
            const alignmentClass = 
              idx % 4 === 0 ? 'justify-center sm:-translate-x-12' : 
              idx % 4 === 1 ? 'justify-center sm:translate-x-12' :
              idx % 4 === 2 ? 'justify-center sm:-translate-x-8' :
              'justify-center sm:translate-x-8';

            return (
              <div key={level.id} className={`flex ${alignmentClass}`}>
                <div className="flex flex-col items-center gap-1.5 text-center">
                  
                  {/* Circular Level Node */}
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      setSelectedLevel(level);
                      // Default mode based on what has been saved or selected
                      setModeSelection(progress?.mode || 'exam');
                    }}
                    id={`map-node-${level.id}`}
                    className={`relative w-20 h-20 rounded-full flex items-center justify-center cursor-pointer transition-all border-b-6 shadow-md ${
                      isCompleted 
                        ? 'bg-[#58CC02] border-[#46A302] text-white hover:bg-[#61E002]' // Bright golden Duolingo Green
                        : `${level.colorClass} ${level.borderClass}`
                    }`}
                  >
                    {/* Ring for locked or active nodes */}
                    <span className="absolute -inset-1 rounded-full border-2 border-dashed border-slate-300 animate-none pointer-events-none opacity-40"></span>
                    
                    {/* Inner icon */}
                    {getIcon(level.iconName, "w-8 h-8")}

                    {/* Completion Mini Crown Badge */}
                    {isCompleted && (
                      <div className="absolute -top-1.5 -right-1.5 bg-[#FFD700] text-[#8B6508] p-1 rounded-full border-2 border-white shadow-md animate-bounce">
                        <Trophy className="w-3.5 h-3.5" />
                      </div>
                    )}
                  </motion.button>

                  {/* Node text tooltip wrapper */}
                  <div className="bg-white/90 backdrop-blur-sm border border-slate-200 px-3.5 py-1 rounded-xl shadow-sm max-w-[170px]">
                    <span className="block text-[8px] text-slate-400 font-extrabold uppercase tracking-widest leading-none">
                      Nível {idx + 1}
                    </span>
                    <strong className="block text-[11px] font-black text-slate-800 tracking-tight mt-0.5 line-clamp-1">
                      {level.title.split(' ')[0]} {level.title.split(' ')[1] || ''}
                    </strong>
                    {isCompleted ? (
                      <span className="text-[10px] text-[#4CAF50] font-black flex items-center justify-center gap-0.5 mt-0.5 font-mono">
                        ⭐ {progress.score}/{progress.total}
                      </span>
                    ) : (
                      <span className="text-[9px] text-[#FF9F1C] font-extrabold uppercase mt-0.5 inline-block">
                        Liberado
                      </span>
                    )}
                  </div>

                </div>
              </div>
            );
          })}

          {/* Grand Trophy at the very end of paths */}
          <div className="flex justify-center pt-8">
            <div className="flex flex-col items-center gap-2">
              <motion.div
                animate={levelsCount === 4 ? { rotate: [0, -10, 10, -10, 0] } : {}}
                transition={{ repeat: Infinity, duration: 2.5 }}
                className={`w-24 h-24 rounded-3xl flex flex-col items-center justify-center border-b-6 ${
                  levelsCount === 4 
                    ? 'bg-[#FFD700] border-[#C59B27] text-[#8B6508] shadow-lg shadow-amber-300/30' 
                    : 'bg-slate-200 border-slate-350 text-slate-400 opacity-60'
                }`}
              >
                <Trophy className="w-11 h-11" />
                <span className="text-[9px] font-black tracking-widest mt-0.5">MAESTRIA</span>
              </motion.div>
              <div className="text-center max-w-[180px]">
                <h4 className="text-sm font-black text-slate-800">Troféu Moisaniel UI/UX</h4>
                <p className="text-[10px] text-slate-400 font-medium">Conclua todas as 4 trilhas com sucesso!</p>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Floating Panel / Complete course actions */}
      <div className="mt-12 bg-white rounded-3xl border-2 border-slate-150 p-4 sm:p-6 text-center space-y-4" id="submit-grades-panel">
        <h3 className="text-sm font-black text-slate-800">Pronto para arquivar seu resultado?</h3>
        <p className="text-xs text-slate-500 max-w-sm mx-auto">
          Ao completar, você pode enviar suas conquistas acumuladas para o banco de dados oficial para o professor avaliar!
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
          <button
            onClick={onFinishCourse}
            disabled={levelsCount === 0}
            className="w-full sm:w-auto px-6 py-3 bg-[#4CAF50] hover:bg-[#43a047] disabled:bg-slate-200 disabled:text-slate-400 cursor-pointer disabled:cursor-not-allowed text-white font-black rounded-xl text-sm transition-all border-b-4 border-[#2E7D32] shadow-md flex items-center justify-center gap-2"
          >
            <CheckCircle2 className="w-4 h-4" /> ENVIAR NOTAS AO PROFESSOR
          </button>
        </div>
      </div>

      {/* Educational context guidelines message */}
      <div className="text-center mt-6 text-[10px] text-slate-400 font-extrabold uppercase tracking-wider">
        CETI Moisaniel Alves de Sousa • Ensino Integrado de Computação e Artes
      </div>

      {/* Popover Level Details Modal Dialog (AnimatePresence) */}
      <AnimatePresence>
        {selectedLevel && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedLevel(null)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs"
            ></motion.div>

            {/* Modal Body Dialog */}
            <motion.div
              initial={{ scale: 0.95, y: 15, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.95, y: 15, opacity: 0 }}
              className="bg-white pointer-events-auto rounded-3xl border-4 border-[#E0E7FF] shadow-2xl relative max-w-md w-full p-6 sm:p-8 space-y-6 z-10"
              id="level-selector-modal"
            >
              {/* Colored header card inside modal */}
              <div className={`${selectedLevel.colorClass} ${selectedLevel.textColor} p-5 rounded-2xl relative border-b-4 border-black/10`}>
                <span className="block text-[9px] uppercase font-black tracking-widest opacity-60">Conteúdo do Desafio</span>
                <h3 className="text-lg sm:text-xl font-black mt-1 flex items-center gap-2">
                  {getIcon(selectedLevel.iconName, "w-6 h-6")} {selectedLevel.title}
                </h3>
                <span className={`absolute top-4 right-4 text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full ${selectedLevel.badgeColor}`}>
                  {selectedLevel.topicTag}
                </span>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-semibold">
                  {selectedLevel.description}
                </p>
                <div className="bg-slate-50 border border-slate-150 p-3 rounded-xl text-xs font-bold text-slate-500 flex items-center gap-2">
                  <Play className="w-4 h-4 text-slate-405" />
                  <span>Esse nível possui <strong className="text-slate-700">{selectedLevel.questionIds.length} questões técnicas</strong> selecionadas por especialistas.</span>
                </div>
              </div>

              {/* Mode Selection */}
              <div className="space-y-3">
                <span className="block text-[10px] font-black uppercase tracking-widest text-[#6366F1]">Escolha o modo de estudo:</span>
                
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setModeSelection('study')}
                    className={`p-3 border-2 rounded-xl text-left cursor-pointer transition-all ${
                      modeSelection === 'study'
                        ? 'border-[#6366F1] bg-[#EEF2FF] text-[#6366F1]'
                        : 'border-slate-200 hover:border-slate-300 text-slate-500 bg-white'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 font-black text-xs uppercase tracking-wide">
                      <BookOpen className="w-4 h-4" /> Modo Estudo
                    </div>
                    <span className="block text-[10px] font-medium leading-normal mt-1 opacity-80">
                      Gabarito comentado liberado na hora! Legal para aprender.
                    </span>
                  </button>

                  <button
                    onClick={() => setModeSelection('exam')}
                    className={`p-3 border-2 rounded-xl text-left cursor-pointer transition-all ${
                      modeSelection === 'exam'
                        ? 'border-[#6366F1] bg-[#EEF2FF] text-[#6366F1]'
                        : 'border-slate-200 hover:border-slate-300 text-slate-500 bg-white'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 font-black text-xs uppercase tracking-wide">
                      <Trophy className="w-4 h-4" /> Modo Desafio
                    </div>
                    <span className="block text-[10px] font-medium leading-normal mt-1 opacity-80">
                      Avaliação pura sem respostas prévias. Ótimo para testar.
                    </span>
                  </button>
                </div>
              </div>

              {/* Complete launch actions */}
              <div className="flex items-center gap-3 pt-2">
                <button
                  onClick={() => setSelectedLevel(null)}
                  className="px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-600 font-extrabold text-sm rounded-xl"
                >
                  Cancelar
                </button>
                <button
                  onClick={() => {
                    onStartLevel(selectedLevel, modeSelection);
                    setSelectedLevel(null);
                  }}
                  id="confirm-start-level-btn"
                  className="flex-1 py-3.5 bg-[#58CC02] hover:bg-[#4ea80b] cursor-pointer text-white font-black text-sm rounded-xl border-b-4 border-[#3c8e03] shadow-md flex items-center justify-center gap-1.5"
                >
                  <Play className="w-4.5 h-4.5 fill-white" /> INICIAR LIÇÃO
                </button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
