import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, query, getDocs, deleteDoc, doc, orderBy } from 'firebase/firestore';
import { ArrowLeft, User, Award, Calendar, BookOpen, Clock, RefreshCw, Search, Trash2, Shield, Download, FileSpreadsheet, CheckCircle2 } from 'lucide-react';
import { motion } from 'motion/react';

interface TeacherDashboardProps {
  onBack: () => void;
}

interface FirestoreLevelDoc {
  id: string;
  playerName: string;
  levelName: string;
  score: number;
  total: number;
  mode: string;
  timeTaken: number;
  timestamp: any;
  levelId: string;
}

interface FirestoreSessionDoc {
  id: string;
  playerName: string;
  overallScore: number;
  overallTotal: number;
  overallPercentage: number;
  completedLevelsCount: number;
  timeTaken: number;
  mode: string;
  timestamp: any;
}

export default function TeacherDashboard({ onBack }: TeacherDashboardProps) {
  const [levelDocs, setLevelDocs] = useState<FirestoreLevelDoc[]>([]);
  const [sessionDocs, setSessionDocs] = useState<FirestoreSessionDoc[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'levels' | 'sessions'>('levels');
  const [passwordInput, setPasswordInput] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authError, setAuthError] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteInputText, setDeleteInputText] = useState('');

  // Password to access Teacher Area
  const CORRECT_PASS = 'CETI2026';

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput === CORRECT_PASS || passwordInput.toUpperCase() === 'MOISANIEL') {
      setIsAuthenticated(true);
      setAuthError('');
      fetchData();
    } else {
      setAuthError('Senha incorreta. Tente novamente');
    }
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch level entries
      const levelsRef = collection(db, 'student_levels');
      const levelsQuery = query(levelsRef, orderBy('timestamp', 'desc'));
      const levelsSnap = await getDocs(levelsQuery);
      
      const levelsData: FirestoreLevelDoc[] = [];
      levelsSnap.forEach((docSnap) => {
        const d = docSnap.data();
        levelsData.push({
          id: docSnap.id,
          playerName: d.playerName || 'Anônimo',
          levelName: d.levelName || 'Nível Geral',
          score: d.score ?? 0,
          total: d.total ?? 0,
          mode: d.mode || 'study',
          timeTaken: d.timeTaken ?? 0,
          timestamp: d.timestamp,
          levelId: d.levelId || '',
        });
      });
      setLevelDocs(levelsData);

      // Fetch consolidated session entries
      const sessionsRef = collection(db, 'student_sessions');
      const sessionsQuery = query(sessionsRef, orderBy('timestamp', 'desc'));
      const sessionsSnap = await getDocs(sessionsQuery);

      const sessionsData: FirestoreSessionDoc[] = [];
      sessionsSnap.forEach((docSnap) => {
        const d = docSnap.data();
        sessionsData.push({
          id: docSnap.id,
          playerName: d.playerName || 'Anônimo',
          overallScore: d.overallScore ?? 0,
          overallTotal: d.overallTotal ?? 0,
          overallPercentage: d.overallPercentage ?? 0,
          completedLevelsCount: d.completedLevelsCount ?? 0,
          timeTaken: d.timeTaken ?? 0,
          mode: d.mode || 'study',
          timestamp: d.timestamp
        });
      });
      setSessionDocs(sessionsData);
    } catch (e) {
      console.error('Error fetching data from Firestore:', e);
    } finally {
      setLoading(false);
    }
  };

  // Wipe Firestore data
  const handleWipeData = async () => {
    if (deleteInputText.toUpperCase() !== 'LIMPAR') {
      alert('Por favor digite LIMPAR para confirmar.');
      return;
    }
    setLoading(true);
    try {
      // delete levels
      const levelPromises = levelDocs.map(item => deleteDoc(doc(db, 'student_levels', item.id)));
      // delete sessions
      const sessionPromises = sessionDocs.map(item => deleteDoc(doc(db, 'student_sessions', item.id)));

      await Promise.all([...levelPromises, ...sessionPromises]);
      setLevelDocs([]);
      setSessionDocs([]);
      setShowDeleteConfirm(false);
      setDeleteInputText('');
      alert('Histórico excluído com sucesso!');
    } catch (error) {
      console.error('Erro ao limpar banco de dados:', error);
      alert('Erro ao excluir dados.');
    } finally {
      setLoading(false);
    }
  };

  const handleExportCSV = () => {
    let csvContent = "data:text/csv;charset=utf-8,";
    
    if (activeTab === 'levels') {
      csvContent += "Aluno,Desafio/Nível,Nota,Total de Questões,Modo,Tempo(s),Data\n";
      levelDocs.forEach(row => {
        const dateStr = row.timestamp?.toDate ? row.timestamp.toDate().toLocaleString('pt-BR') : new Date().toLocaleString('pt-BR');
        csvContent += `"${row.playerName}","${row.levelName}",${row.score},${row.total},"${row.mode === 'study' ? 'Estudo' : 'Desafio'}",${row.timeTaken},"${dateStr}"\n`;
      });
    } else {
      csvContent += "Aluno,Aproveitamento Geral,Acertos Totais,Fez Quantos Níveis,Modo,Tempo Total(s),Data\n";
      sessionDocs.forEach(row => {
        const dateStr = row.timestamp?.toDate ? row.timestamp.toDate().toLocaleString('pt-BR') : new Date().toLocaleString('pt-BR');
        csvContent += `"${row.playerName}",${row.overallPercentage}%,${row.overallScore}/${row.overallTotal},${row.completedLevelsCount},"${row.mode === 'study' ? 'Estudo' : 'Desafio'}",${row.timeTaken},"${dateStr}"\n`;
      });
    }

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Grades_Design_Quest_${activeTab}_export.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredLevels = levelDocs.filter(doc => 
    doc.playerName.toLowerCase().includes(searchQuery.toLowerCase()) || 
    doc.levelName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredSessions = sessionDocs.filter(doc =>
    doc.playerName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Stats calculation
  const uniqueSutdents = Array.from(new Set([
    ...levelDocs.map(d => d.playerName.toLowerCase().trim()),
    ...sessionDocs.map(d => d.playerName.toLowerCase().trim())
  ])).length;

  const averagePercentage = sessionDocs.length > 0 
    ? Math.round(sessionDocs.reduce((acc, current) => acc + current.overallPercentage, 0) / sessionDocs.length)
    : levelDocs.length > 0
    ? Math.round(levelDocs.reduce((acc, current) => acc + (current.score / current.total * 100), 0) / levelDocs.length)
    : 0;

  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto p-4" id="teacher-auth-screen">
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl border-4 border-[#E0E7FF] shadow-2xl p-6 sm:p-8 space-y-6"
        >
          <div className="text-center space-y-2">
            <div className="mx-auto w-12 h-12 rounded-xl bg-indigo-100 flex items-center justify-center text-indigo-600 mb-2">
              <Shield className="w-6 h-6" />
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-800">Painel do Professor</h2>
            <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
              Área de acompanhamento acadêmico. Digite a senha para visualizar as notas e desempenhos da classe.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-black uppercase tracking-widest text-[#6366F1] mb-2">
                Senha de Acesso:
              </label>
              <input
                type="password"
                placeholder="Password"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                className="w-full px-4 py-3 bg-[#F8FAFC] border-2 border-[#E2E8F0] rounded-xl text-slate-800 focus:outline-none focus:border-[#6366F1] focus:bg-[#EEF2FF] font-semibold text-center"
                autoFocus
              />
              {authError && (
                <p className="text-xs font-bold text-red-500 mt-2 text-center">
                  ⚠️ {authError}
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full bg-[#6366F1] hover:bg-[#5053db] cursor-pointer text-white font-extrabold h-12 rounded-xl flex items-center justify-center gap-2 shadow-[0_4px_0_#4338CA] transition-all hover:translate-y-[1px] active:translate-y-1 active:shadow-none"
            >
              Acessar Dados
            </button>
          </form>

          <button
            onClick={onBack}
            className="w-full bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold h-11 rounded-xl flex items-center justify-center gap-2 transition-all"
          >
            <ArrowLeft className="w-4 h-4" /> Voltar ao Início
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4" id="teacher-dashboard-main">
      <motion.div 
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-3xl border-2 sm:border-4 border-[#E0E7FF] shadow-2xl p-4 sm:p-8 space-y-6"
      >
        {/* Header bar within dashboard */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-indigo-50 pb-5">
          <div className="flex items-center gap-3">
            <button
              onClick={onBack}
              className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl transition-all"
              title="Voltar para a Trilha"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-800 flex items-center gap-2">
                📈 Painel de Monitoramento
              </h2>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">
                CETI Moisaniel Alves de Sousa • Relatórios em Tempo Real
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-stretch sm:self-auto">
            <button
              onClick={fetchData}
              className="p-2.5 bg-[#EEF2FF] text-[#6366F1] hover:bg-[#E0E7FF] rounded-xl transition-all font-bold text-xs flex items-center gap-1.5 flex-1 sm:flex-none justify-center"
            >
              <RefreshCw className="w-4 h-4" /> Atualizar
            </button>
            <button
              onClick={handleExportCSV}
              disabled={activeTab === 'levels' ? filteredLevels.length === 0 : filteredSessions.length === 0}
              className="p-2.5 bg-[#22C55E] hover:bg-[#1fbd58] text-white rounded-xl transition-all font-bold text-xs flex items-center gap-1.5 flex-1 sm:flex-none justify-center disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Download className="w-4 h-4" /> Exportar Planilha
            </button>
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="p-2.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-xl transition-all font-bold text-xs flex items-center gap-1.5 justify-center"
              title="Apagar todos os registros de teste"
            >
              <Trash2 className="w-4.5 h-4.5" />
            </button>
          </div>
        </div>

        {/* Stats strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="bg-slate-50 border border-slate-150 p-4 rounded-2xl">
            <span className="block text-[10px] text-slate-400 font-extrabold uppercase tracking-wider">Total de Alunos</span>
            <span className="text-2xl font-black text-slate-850 mt-1 block flex items-center gap-1.5">
              <User className="w-5 h-5 text-[#6366F1]" /> {uniqueSutdents}
            </span>
          </div>
          <div className="bg-slate-50 border border-slate-150 p-4 rounded-2xl">
            <span className="block text-[10px] text-slate-400 font-extrabold uppercase tracking-wider">Aproveitamento Médio</span>
            <span className="text-2xl font-black text-slate-850 mt-1 block flex items-center gap-1.5">
              <Award className="w-5 h-5 text-[#22C55E]" /> {averagePercentage}%
            </span>
          </div>
          <div className="bg-slate-50 border border-slate-150 p-4 rounded-2xl">
            <span className="block text-[10px] text-slate-400 font-extrabold uppercase tracking-wider">Exercícios Resolvidos</span>
            <span className="text-2xl font-black text-slate-850 mt-1 block flex items-center gap-1.5">
              <BookOpen className="w-5 h-5 text-indigo-500" /> {levelDocs.length}
            </span>
          </div>
          <div className="bg-slate-50 border border-slate-150 p-4 rounded-2xl">
            <span className="block text-[10px] text-slate-400 font-extrabold uppercase tracking-wider">Jornadas Completas</span>
            <span className="text-2xl font-black text-slate-850 mt-1 block flex items-center gap-1.5">
              <CheckCircle2 className="w-5 h-5 text-purple-500" /> {sessionDocs.length}
            </span>
          </div>
        </div>

        {/* Search bar & tab filters */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 bg-[#F8FAFC] p-3 rounded-2xl border border-slate-150">
          {/* Swiper tabs */}
          <div className="flex bg-slate-200 p-1 rounded-xl self-start">
            <button
              onClick={() => setActiveTab('levels')}
              className={`px-4 py-2 rounded-lg text-xs font-black transition-all ${
                activeTab === 'levels' ? 'bg-white text-[#6366F1] shadow-sm' : 'text-slate-500 hover:text-slate-850'
              }`}
            >
              🏆 Histórico por Nível ({levelDocs.length})
            </button>
            <button
              onClick={() => setActiveTab('sessions')}
              className={`px-4 py-2 rounded-lg text-xs font-black transition-all ${
                activeTab === 'sessions' ? 'bg-white text-[#6366F1] shadow-sm' : 'text-slate-500 hover:text-slate-850'
              }`}
            >
              🎓 Jornadas Inteiras ({sessionDocs.length})
            </button>
          </div>

          {/* Search box */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Pesquisar por nome do aluno..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-[#6366F1]"
            />
          </div>
        </div>

        {/* Delete confirmation drawer */}
        {showDeleteConfirm && (
          <div className="bg-rose-50 border-2 border-rose-200 p-4 rounded-2xl space-y-3">
            <div className="flex items-start gap-2 text-rose-800">
              <span className="p-1 rounded-lg bg-rose-100 text-rose-700 mt-0.5 font-bold">⚠️</span>
              <div>
                <h4 className="font-extrabold text-sm">Tem certeza absoluta de que deseja limpar os dados?</h4>
                <p className="text-xs text-rose-600">Isso apagará permanentemente todos os registros das planilhas de alunos do Firestore.</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <input
                type="text"
                placeholder="Digite 'LIMPAR' para confirmar"
                value={deleteInputText}
                onChange={(e) => setDeleteInputText(e.target.value)}
                className="px-3 py-1.5 bg-white border border-rose-300 rounded-xl text-xs font-bold text-rose-800 focus:outline-none focus:border-rose-500"
              />
              <button
                onClick={handleWipeData}
                disabled={deleteInputText.toUpperCase() !== 'LIMPAR'}
                className="px-4 py-1.5 bg-rose-600 hover:bg-rose-700 text-white font-black text-xs rounded-lg transition-all disabled:opacity-50 cursor-pointer"
              >
                APAGAR TUDO
              </button>
              <button
                onClick={() => { setShowDeleteConfirm(false); setDeleteInputText(''); }}
                className="px-3 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-600 font-bold text-xs rounded-lg"
              >
                Cancelar
              </button>
            </div>
          </div>
        )}

        {/* Grid or Table display */}
        <div className="overflow-x-auto border border-slate-150 rounded-2xl" id="dashboard-table-container">
          {loading ? (
            <div className="p-20 text-center space-y-3">
              <RefreshCw className="w-8 h-8 text-[#6366F1] animate-spin mx-auto" />
              <p className="text-sm font-bold text-slate-500">Buscando notas do Firestore...</p>
            </div>
          ) : activeTab === 'levels' ? (
            filteredLevels.length === 0 ? (
              <div className="p-10 text-center text-slate-400 text-sm font-semibold">
                Nenhum exercício resolvido encontrado.
              </div>
            ) : (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 text-slate-400 uppercase text-[9px] font-extrabold tracking-wider border-b border-slate-150">
                    <th className="py-3 px-4">Aluno</th>
                    <th className="py-3 px-4">Desafio/Nível</th>
                    <th className="py-3 px-4">Nota</th>
                    <th className="py-3 px-4">Modo</th>
                    <th className="py-3 px-4">Tempo</th>
                    <th className="py-3 px-4">Data/Hora</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs sm:text-sm">
                  {filteredLevels.map((row) => {
                    const dateObj = row.timestamp?.toDate ? row.timestamp.toDate() : new Date();
                    return (
                      <tr key={row.id} className="hover:bg-[#F8FAFC] transition-all">
                        <td className="py-3 px-4 font-black text-slate-800 flex items-center gap-1.5">
                          <div className="w-6 h-6 rounded-full bg-indigo-150 text-[#6366F1] flex items-center justify-center font-bold text-[10px] uppercase">
                            {row.playerName.slice(0, 2)}
                          </div>
                          {row.playerName}
                        </td>
                        <td className="py-3 px-4 font-bold text-slate-600">{row.levelName}</td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-1 rounded-lg font-black text-xs ${
                            row.score === row.total 
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' 
                              : row.score === 0 
                              ? 'bg-rose-100 text-rose-800' 
                              : 'bg-amber-100 text-amber-800'
                          }`}>
                            {row.score} / {row.total}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            row.mode === 'study' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'
                          }`}>
                            {row.mode === 'study' ? 'Estudo' : 'Desafio'}
                          </span>
                        </td>
                        <td className="py-3 px-4 font-semibold text-slate-500 font-mono flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" /> {row.timeTaken}s
                        </td>
                        <td className="py-3 px-4 text-slate-400 font-mono text-[11px]">
                          {dateObj.toLocaleString('pt-BR')}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )
          ) : (
            filteredSessions.length === 0 ? (
              <div className="p-10 text-center text-slate-400 text-sm font-semibold">
                Nenhuma jornada completa enviada ainda.
              </div>
            ) : (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 text-slate-400 uppercase text-[9px] font-extrabold tracking-wider border-b border-slate-150">
                    <th className="py-3 px-4">Aluno</th>
                    <th className="py-3 px-4">Aproveitamento</th>
                    <th className="py-3 px-4">Acertos Consolidados</th>
                    <th className="py-3 px-4">Níveis Feitos</th>
                    <th className="py-3 px-4">Tempo Total</th>
                    <th className="py-3 px-4">Data/Hora</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs sm:text-sm">
                  {filteredSessions.map((row) => {
                    const dateObj = row.timestamp?.toDate ? row.timestamp.toDate() : new Date();
                    return (
                      <tr key={row.id} className="hover:bg-[#F8FAFC] transition-all">
                        <td className="py-3 px-4 font-black text-slate-800 flex items-center gap-1.5">
                          <div className="w-6 h-6 rounded-full bg-purple-150 text-purple-600 flex items-center justify-center font-bold text-[10px] uppercase">
                            {row.playerName.slice(0, 2)}
                          </div>
                          {row.playerName}
                        </td>
                        <td className="py-3 px-4">
                          <span className="text-base font-black text-teal-600 font-mono">{row.overallPercentage}%</span>
                        </td>
                        <td className="py-3 px-4">
                          <span className="px-2 py-1 bg-[#EEF2FF] border border-[#6366F1] font-black text-xs text-[#6366F1] rounded-lg">
                            {row.overallScore} / {row.overallTotal}
                          </span>
                        </td>
                        <td className="py-3 px-4 font-extrabold text-slate-600">{row.completedLevelsCount} de 4 níveis</td>
                        <td className="py-3 px-4 font-semibold text-slate-500 font-mono flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" /> {row.timeTaken}s
                        </td>
                        <td className="py-3 px-4 text-slate-400 font-mono text-[11px]">
                          {dateObj.toLocaleString('pt-BR')}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )
          )}
        </div>
      </motion.div>
    </div>
  );
}
