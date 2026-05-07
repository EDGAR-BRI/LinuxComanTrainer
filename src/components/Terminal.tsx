import { useState, useRef, useEffect } from 'react';
import gsap from 'gsap';
import { VirtualFS, CommandResult } from '../lib/vfs';
import { challenges, Challenge, Difficulty, difficultyLabels, difficultyDescriptions } from '../data/challenges';
import { lessons, Lesson, AppMode } from '../data/lessons';
import FileTree from './FileTree';

interface HistoryEntry {
  input: string;
  output: string;
  status: 'success' | 'error';
  cwd: string;
}

export default function Terminal() {
  const [vfs] = useState(() => new VirtualFS());
  const [updateTrigger, setUpdateTrigger] = useState(0);
  const forceUpdate = () => setUpdateTrigger(prev => prev + 1);

  const [history, setHistory] = useState<HistoryEntry[]>([
    { input: '', output: 'Bienvenido al Linux Command Trainer', status: 'success', cwd: '/' }
  ]);
  const [input, setInput] = useState('');
  const [mode, setMode] = useState<AppMode>('menu');
  const [points, setPoints] = useState(0);
  const [currentChallenge, setCurrentChallenge] = useState<Challenge | null>(null);
  const [completedChallenges, setCompletedChallenges] = useState<number[]>([]);
  const [hintUsed, setHintUsed] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const terminalRef = useRef<HTMLDivElement>(null);
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [difficulty, setDifficulty] = useState<Difficulty | null>(null);
  const [currentLesson, setCurrentLesson] = useState<Lesson | null>(lessons[0]);
  const [lessonIndex, setLessonIndex] = useState(0);
  const [testScore, setTestScore] = useState(0);
  const [testTotal, setTestTotal] = useState(0);

  useEffect(() => {
    if (mode !== 'menu') {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [mode]);

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [history, updateTrigger]);

  useEffect(() => {
    const saved = localStorage.getItem('linux-trainer-points');
    if (saved) setPoints(parseInt(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem('linux-trainer-points', points.toString());
  }, [points]);

  const executeCommand = (cmd: string): CommandResult => {
    const parts = cmd.trim().split(/\s+/);
    const command = parts[0].toLowerCase();
    const args = parts.slice(1);

    if (command === 'help') {
      return {
        output: `Comandos disponibles:
  Archivos: pwd, cd [dir], ls [opciones] [dir], mkdir <nombre>, rmdir <nombre>
  Archivos: touch <nombre>, rm <nombre>, cp <origen> <dest>, mv <origen> <dest>
  Archivos: cat <archivo>, less <archivo>, chmod <modo> <archivo>
  Archivos: find <patrón>, gzip <archivo>, gunzip <archivo>
  Archivos: head [n] <archivo>, tail [n] <archivo>
  Red: ip addr, ifconfig, ping <host>, traceroute <host>
  Red: nslookup <domain>, dig <domain>, ss, netstat
  Red: hostname, route, arp
  Paquetes: apt-get update, apt-get install <pkg>
  Editores: nano [archivo], vim [archivo]
  Otros: clear, help`,
        status: 'success'
      };
    }

    if (command === 'clear') {
      setHistory([]);
      return { output: '', status: 'success' };
    }

    if (command === 'ip' && args[0] === 'addr') return vfs.ipAddr();
    if (command === 'ifconfig') return vfs.ifconfig();
    if (command === 'ping') return vfs.ping(args[0]);
    if (command === 'traceroute') return vfs.traceroute(args[0]);
    if (command === 'nslookup') return vfs.nslookup(args[0]);
    if (command === 'dig') return vfs.dig(args[0]);
    if (command === 'ss') return vfs.ss();
    if (command === 'netstat') return vfs.netstat();
    if (command === 'route') return vfs.route();
    if (command === 'arp') return vfs.arp();
    if (command === 'hostname') return vfs.hostname(args[0]);
    if (command === 'nano') return vfs.nano(args[0]);
    if (command === 'vim') return vfs.vim(args[0]);

    if (command === 'apt-get') {
      if (args[0] === 'update') return vfs.aptGetUpdate();
      if (args[0] === 'install') return vfs.aptGetInstall(args[1]);
      return { output: `apt-get: operación '${args[0]}' no soportada`, status: 'error' };
    }

    switch (command) {
      case 'pwd': return vfs.pwd();
      case 'cd': {
        const result = vfs.cd(args[0]);
        if (result.status === 'success') forceUpdate();
        return result;
      }
      case 'ls': {
        const flags = args.filter(a => a.startsWith('-')).join(' ');
        const target = args.find(a => !a.startsWith('-'));
        return vfs.ls(target, flags);
      }
      case 'mkdir': return vfs.mkdir(args[0]);
      case 'rmdir': return vfs.rmdir(args[0]);
      case 'touch': return vfs.touch(args[0]);
      case 'rm': return vfs.rm(args[0], args[1]);
      case 'cp': return vfs.cp(args[0], args[1]);
      case 'mv': {
        const result = vfs.mv(args[0], args[1]);
        if (result.status === 'success') forceUpdate();
        return result;
      }
      case 'cat': return vfs.cat(args[0]);
      case 'less': return vfs.less(args[0]);
      case 'chmod': return vfs.chmod(args[0], args[1]);
      case 'find': return vfs.find(args[0]);
      case 'gzip': return vfs.gzip(args[0]);
      case 'gunzip': return vfs.gunzip(args[0]);
      case 'head': return vfs.head(args[0], parseInt(args[1]) || 5);
      case 'tail': return vfs.tail(args[0], parseInt(args[1]) || 5);
      default: return { output: `bash: ${command}: comando no encontrado`, status: 'error' };
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const cmd = input.trim();
    const result = executeCommand(cmd);

    const newEntry: HistoryEntry = {
      input: cmd,
      output: result.output,
      status: result.status,
      cwd: vfs.cwd
    };

    setHistory(prev => [...prev, newEntry]);
    setCommandHistory(prev => [...prev, cmd]);
    setHistoryIndex(-1);
    setInput('');

    if (result.status === 'success') {
      gsap.fromTo('.terminal-body', { boxShadow: '0 0 20px #00ff00' }, { boxShadow: 'none', duration: 0.5 });
    } else {
      gsap.fromTo('.terminal-body', { boxShadow: '0 0 20px #ff0000' }, { boxShadow: 'none', duration: 0.5 });
    }

    if (mode === 'test' && difficulty) {
      const baseCmd = cmd.split(/\s+/)[0].toLowerCase();
      const navigationCommands = ['pwd', 'ls', 'cd', 'clear', 'help', 'cat', 'less', 'head', 'tail'];
      if (!navigationCommands.includes(baseCmd)) {
        checkChallenge(cmd);
      }
    }
  };

  const startLearnMode = () => {
    setMode('learn');
    setLessonIndex(0);
    setCurrentLesson(lessons[0]);
    setHistory([
      { input: '', output: 'MODO APRENDIZAJE - Aprende comandos paso a paso\n\nUsa "next" para avanzar, "prev" para retroceder, "menu" para volver', status: 'success' }
    ]);
  };

  const startTestMode = (selectedDifficulty: Difficulty) => {
    setDifficulty(selectedDifficulty);
    setMode('test');

    if (selectedDifficulty === 'advanced') {
      vfs.cd('/home/user');
      vfs.mv('archivo01.txt', 'prueba/');
      forceUpdate();
    }

    const firstChallenge = challenges.find(c => c.difficulty === selectedDifficulty);
    if (firstChallenge) {
      setCurrentChallenge(firstChallenge);
      setHistory([
        { input: '', output: `MODO TEST - ${difficultyLabels[selectedDifficulty]}\n${difficultyDescriptions[selectedDifficulty]}\n\nDesafío #${firstChallenge.id}: ${firstChallenge.description}`, status: 'success' }
      ]);
    }
    setPoints(0);
    setCompletedChallenges([]);
    setCommandHistory([]);
    setTestScore(0);
    setTestTotal(challenges.filter(c => c.difficulty === selectedDifficulty).length);
  };

  const checkChallenge = (lastCmd: string) => {
    if (!currentChallenge || completedChallenges.includes(currentChallenge.id)) return;

    const allCommands = [...commandHistory, lastCmd];
    if (currentChallenge.validate(vfs, allCommands)) {
      const newPoints = points + currentChallenge.points;
      const newCompleted = [...completedChallenges, currentChallenge.id];
      setPoints(newPoints);
      setCompletedChallenges(newCompleted);
      setTestScore(prev => prev + 1);

      const nextChallenge = challenges.find(c => c.difficulty === difficulty && !newCompleted.includes(c.id)) || null;
      if (nextChallenge) {
        setCurrentChallenge(nextChallenge);
        setHintUsed(0);
        setShowHint(false);
        setHistory(prev => [...prev, {
          input: '',
          output: `¡Correcto! +${currentChallenge.points} pts.\nSiguiente desafío #${nextChallenge.id}: ${nextChallenge.description}`,
          status: 'success'
        }]);
      } else {
        const score = Math.round((testScore + 1) / testTotal * 100);
        setHistory(prev => [...prev, {
          input: '',
          output: `¡Test completado! Puntuación: ${score}% (${testScore + 1}/${testTotal})\nTotal puntos: ${newPoints}\nEscribe "menu" para volver`,
          status: 'success'
        }]);
        setCurrentChallenge(null);
      }
    } else {
      setHistory(prev => [...prev, {
        input: '',
        output: 'Incorrecto. Intenta de nuevo o usa "pista"',
        status: 'error'
      }]);
    }
  };

  const handleHint = () => {
    if (hintUsed < 2 && currentChallenge) {
      setHintUsed(prev => prev + 1);
      setShowHint(true);
      setPoints(prev => Math.max(0, prev - 5));
    }
  };

  const nextLesson = () => {
    if (lessonIndex < lessons.length - 1) {
      const next = lessonIndex + 1;
      setLessonIndex(next);
      setCurrentLesson(lessons[next]);
    }
  };

  const prevLesson = () => {
    if (lessonIndex > 0) {
      const prev = lessonIndex - 1;
      setLessonIndex(prev);
      setCurrentLesson(lessons[prev]);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (commandHistory.length > 0) {
        const newIndex = historyIndex < commandHistory.length - 1 ? historyIndex + 1 : historyIndex;
        setHistoryIndex(newIndex);
        setInput(commandHistory[commandHistory.length - 1 - newIndex] || '');
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1;
        setHistoryIndex(newIndex);
        setInput(commandHistory[commandHistory.length - 1 - newIndex] || '');
      } else if (historyIndex === 0) {
        setHistoryIndex(-1);
        setInput('');
      }
    } else if (e.key === 'Enter') {
      if (mode === 'learn') {
        if (input.trim() === 'next') { nextLesson(); setInput(''); }
        else if (input.trim() === 'prev') { prevLesson(); setInput(''); }
        else if (input.trim() === 'menu') { setMode('menu'); setInput(''); }
      } else if (mode === 'test') {
        if (input.trim() === 'menu') { setMode('menu'); setInput(''); }
      }
    }
  };

  const renderLearnMode = () => (
    <div className="w-full max-w-6xl mx-auto px-4">
      <div className="terminal-window">
        <div className="terminal-header">
        <div className="terminal-dot bg-red-500"></div>
        <div className="terminal-dot bg-yellow-500"></div>
        <div className="terminal-dot bg-green-500"></div>
        <span className="text-gray-300 text-sm ml-2">Modo Aprendizaje</span>
        <div className="ml-auto flex items-center gap-2 md:gap-4 flex-wrap">
          <span className="text-gray-400 text-xs md:text-sm">Lección {lessonIndex + 1}/{lessons.length}</span>
          <button onClick={() => setMode('menu')} className="text-xs bg-gray-700 hover:bg-gray-600 px-2 py-1 rounded text-gray-300">
            Menú
          </button>
        </div>
      </div>

        <div className="p-4 md:p-6">
          {currentLesson && (
            <div className="bg-gray-800 rounded-lg p-4 md:p-6 mb-4">
              <h3 className="text-lg md:text-xl font-bold text-blue-400 mb-4">{currentLesson.title}</h3>
              <p className="text-gray-300 mb-4 text-sm md:text-base">{currentLesson.explanation}</p>
              <div className="bg-gray-900 rounded p-3 mb-4">
                <code className="text-green-400 text-sm md:text-base">Sintaxis: {currentLesson.syntax}</code>
              </div>
              <div className="mb-4">
                <h4 className="text-yellow-400 mb-2 text-sm md:text-base">Ejemplos:</h4>
                {currentLesson.examples.map((ex, i) => (
                  <div key={i} className="bg-gray-700 rounded p-2 mb-2">
                    <code className="text-green-300 text-sm">{ex.cmd}</code>
                    <p className="text-gray-400 text-xs md:text-sm mt-1">{ex.description}</p>
                  </div>
                ))}
              </div>
              {currentLesson.tryIt && (
                <p className="text-gray-500 text-sm text-center">⬇ Puedes probar los comandos en la terminal de abajo</p>
              )}
            </div>
          )}

          <div className="flex gap-4 justify-center flex-wrap">
            <button onClick={prevLesson} disabled={lessonIndex === 0} className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded disabled:opacity-50 text-sm md:text-base">
              ← Anterior
            </button>
            <button onClick={nextLesson} disabled={lessonIndex === lessons.length - 1} className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded disabled:opacity-50 text-sm md:text-base">
              Siguiente →
            </button>
          </div>
        </div>
      </div>

      <div className="terminal-window mt-4">
        <div className="terminal-header">
          <div className="terminal-dot bg-red-500"></div>
          <div className="terminal-dot bg-yellow-500"></div>
          <div className="terminal-dot bg-green-500"></div>
          <span className="text-gray-300 text-sm ml-2">Terminal - Prueba los comandos</span>
        </div>
        <div ref={terminalRef} className="terminal-body" onClick={() => inputRef.current?.focus()}>
          <FileTree vfs={vfs} />
          {history.map((entry, i) => (
            <div key={i} className="mb-2">
              {entry.input && (
                <div className="terminal-input-line">
                  <span className="terminal-prompt">user@trainer:{vfs.cwd}$</span>
                  <span className="text-white break-all">{entry.input}</span>
                </div>
              )}
              {entry.output && entry.output !== 'MODO APRENDIZAJE - Aprende comandos paso a paso\n\nUsa "next" para avanzar, "prev" para retroceder, "menu" para volver' && (
                <pre className={`whitespace-pre-wrap text-sm ${entry.status === 'error' ? 'cmd-error' : 'cmd-success'}`}>
                  {entry.output}
                </pre>
              )}
            </div>
          ))}
          <form onSubmit={handleSubmit} className="terminal-input-line">
            <span className="terminal-prompt whitespace-nowrap">user@trainer:{vfs.cwd}$</span>
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-1 bg-transparent border-none outline-none text-white font-mono text-sm min-w-0"
              autoComplete="off"
            />
            <span className="terminal-cursor"></span>
          </form>
        </div>
      </div>
    </div>
  );

  const renderTestMode = () => (
    <div className="terminal-window w-full max-w-6xl mx-auto">
      <div className="terminal-header flex-wrap">
        <div className="terminal-dot bg-red-500"></div>
        <div className="terminal-dot bg-yellow-500"></div>
        <div className="terminal-dot bg-green-500"></div>
        <span className="text-gray-300 text-sm ml-2">Linux Command Trainer - Test</span>
        <div className="ml-auto flex items-center gap-2 md:gap-4 flex-wrap">
          <span className="points-badge text-xs md:text-sm">{points} pts</span>
          <span className="text-gray-400 text-xs md:text-sm">
            Desafío {currentChallenge?.id || ''}
          </span>
          <button onClick={() => setMode('menu')} className="text-xs bg-gray-700 hover:bg-gray-600 px-2 py-1 rounded text-gray-300">
            Menú
          </button>
        </div>
      </div>

      {currentChallenge && (
        <div className="challenge-card mx-2 md:mx-4 mt-4 p-3 md:p-4">
          <div className="flex flex-col md:flex-row justify-between items-start gap-2">
            <div className="flex-1">
              <h3 className="text-sm md:text-base text-blue-400 font-bold mb-2">
                {difficultyLabels[difficulty!]} - Desafío #{currentChallenge.id}
              </h3>
              <p className="text-white text-sm md:text-base">{currentChallenge.description}</p>
            </div>
            <button onClick={handleHint} className="hint-btn whitespace-nowrap" disabled={hintUsed >= 2}>
              {hintUsed >= 2 ? 'Sin pistas' : `Pista (-5 pts)`}
            </button>
          </div>
          {showHint && (
            <div className="mt-2 p-2 bg-yellow-900 bg-opacity-50 rounded text-yellow-300 text-sm">
              {hintUsed === 1 ? currentChallenge.hint1 : currentChallenge.hint2}
            </div>
          )}
          <div className="mt-2 bg-gray-700 rounded-full h-2">
            <div
              className="bg-blue-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(completedChallenges.length / testTotal) * 100}%` }}
            ></div>
          </div>
          <div className="mt-1 text-xs text-gray-400 text-right">
            {completedChallenges.length}/{testTotal} completados
          </div>
        </div>
      )}

      <div ref={terminalRef} className="terminal-body" onClick={() => inputRef.current?.focus()}>
        <FileTree vfs={vfs} />
          {history.map((entry, i) => (
            <div key={i} className="mb-2">
              {entry.input && (
                <div className="terminal-input-line">
                  <span className="terminal-prompt whitespace-nowrap">user@trainer:{entry.cwd}$</span>
                  <span className="text-white break-all">{entry.input}</span>
                </div>
              )}
              {entry.output && (
                <pre className={`whitespace-pre-wrap text-sm ${entry.status === 'error' ? 'cmd-error' : 'cmd-success'}`}>
                  {entry.output}
                </pre>
              )}
            </div>
          ))}
        <form onSubmit={handleSubmit} className="terminal-input-line">
          <span className="terminal-prompt whitespace-nowrap">user@trainer:{vfs.cwd}$</span>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 bg-transparent border-none outline-none text-white font-mono text-sm min-w-0"
            autoComplete="off"
          />
          <span className="terminal-cursor"></span>
        </form>
      </div>
    </div>
  );

  const renderMenu = () => (
    <div className="terminal-window w-full max-w-6xl mx-auto">
      <div className="terminal-header">
        <div className="terminal-dot bg-red-500"></div>
        <div className="terminal-dot bg-yellow-500"></div>
        <div className="terminal-dot bg-green-500"></div>
        <span className="text-gray-300 text-sm ml-2">Linux Command Trainer</span>
        <div className="ml-auto flex items-center gap-4">
          <span className="points-badge">{points} pts</span>
          <span className="text-gray-400 text-sm">
            {mode === 'learn' ? `Aprendizaje (${lessonIndex + 1}/${lessons.length})` :
             mode === 'test' ? `${difficultyLabels[difficulty!].split(' ')[0]} ${testScore}/${testTotal}` :
             'Menú principal'}
          </span>
        </div>
      </div>

      <div className="p-4 md:p-6">
        <h2 className="text-2xl md:text-3xl font-bold text-green-400 mb-6 md:mb-8 text-center">Selecciona un Modo</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-6 md:mb-8">
          <button
            onClick={startLearnMode}
            className="p-6 md:p-8 rounded-lg border-2 border-blue-500 hover:bg-blue-900 hover:bg-opacity-30 transition-all hover:scale-105"
          >
            <div className="text-4xl md:text-5xl mb-4">📚</div>
            <h3 className="text-xl md:text-2xl font-bold text-white mb-2">Modo Aprendizaje</h3>
            <p className="text-gray-400 text-sm md:text-base">Aprende comandos paso a paso con explicaciones y ejemplos</p>
            <div className="mt-4 text-sm text-gray-500">{lessons.length} lecciones disponibles</div>
          </button>

          <div
            onClick={() => {}}
            className="p-6 md:p-8 rounded-lg border-2 border-purple-500 hover:bg-purple-900 hover:bg-opacity-30 transition-all hover:scale-105 cursor-pointer"
          >
            <div className="text-4xl md:text-5xl mb-4">🧪</div>
            <h3 className="text-xl md:text-2xl font-bold text-white mb-2">Modo Test</h3>
            <p className="text-gray-400 text-sm md:text-base">Pon a prueba tus conocimientos resolviendo desafíos</p>
            <div className="mt-4 grid grid-cols-3 gap-2">
              {(['beginner', 'intermediate', 'advanced'] as Difficulty[]).map((diff) => (
                <button
                  key={diff}
                  onClick={(e) => { e.stopPropagation(); startTestMode(diff); }}
                  className={`text-xs p-2 rounded ${
                    diff === 'beginner' ? 'bg-green-900 text-green-300' :
                    diff === 'intermediate' ? 'bg-yellow-900 text-yellow-300' :
                    'bg-red-900 text-red-300'
                  }`}
                >
                  {difficultyLabels[diff].split(' ').slice(1).join(' ')}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div ref={terminalRef} className="terminal-body h-32 md:h-48 overflow-y-auto">
          {history.map((entry, i) => (
            <div key={i} className="mb-2">
              {entry.input && (
                <div className="terminal-input-line">
                  <span className="terminal-prompt whitespace-nowrap">user@trainer:{entry.cwd}$</span>
                  <span className="text-white break-all">{entry.input}</span>
                </div>
              )}
              {entry.output && (
                <pre className={`whitespace-pre-wrap text-sm ${entry.status === 'error' ? 'cmd-error' : 'cmd-success'}`}>
                  {entry.output}
                </pre>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  if (mode === 'learn') return renderLearnMode();
  if (mode === 'test') return renderTestMode();
  return renderMenu();
}
