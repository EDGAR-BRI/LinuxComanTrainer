import { useState, useRef, useEffect } from 'react';
import gsap from 'gsap';
import { VirtualFS, CommandResult } from '../lib/vfs';
import { challenges, Challenge, Difficulty, difficultyLabels, difficultyDescriptions } from '../data/challenges';
import FileTree from './FileTree';

interface HistoryEntry {
  input: string;
  output: string;
  status: 'success' | 'error';
}

export default function Terminal() {
  const [vfs] = useState(() => new VirtualFS());
  const [history, setHistory] = useState<HistoryEntry[]>([
    { input: '', output: 'Bienvenido al Linux Command Trainer. Selecciona una dificultad para comenzar.', status: 'success' }
  ]);
  const [input, setInput] = useState('');
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
  const [gameStarted, setGameStarted] = useState(false);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [history]);

  const executeCommand = (cmd: string): CommandResult => {
    const parts = cmd.trim().split(/\s+/);
    const command = parts[0].toLowerCase();
    const args = parts.slice(1);

    if (command === 'help') {
      return {
        output: `Comandos disponibles:
  Archivos: pwd, cd [dir], ls [dir], mkdir <nombre>, rmdir <nombre>
  Archivos: touch <nombre>, rm <nombre>, cp <origen> <dest>, mv <origen> <dest>
  Archivos: cat <archivo>, less <archivo>, chmod <modo> <archivo>
  Archivos: find <patrón>, gzip <archivo>, gunzip <archivo>
  Archivos: head <archivo>, tail <archivo>
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
      return { output: `apt-get: operación '${args[0]}' no soportada en simulación`, status: 'error' };
    }

    switch (command) {
      case 'pwd': return vfs.pwd();
      case 'cd': return vfs.cd(args[0]);
      case 'ls': return vfs.ls(args[0]);
      case 'mkdir': return vfs.mkdir(args[0]);
      case 'rmdir': return vfs.rmdir(args[0]);
      case 'touch': return vfs.touch(args[0]);
      case 'rm': return vfs.rm(args[0], args[1]);
      case 'cp': return vfs.cp(args[0], args[1]);
      case 'mv': return vfs.mv(args[0], args[1]);
      case 'cat': return vfs.cat(args[0]);
      case 'less': return vfs.less(args[0]);
      case 'chmod': return vfs.chmod(args[0], args[1]);
      case 'find': return vfs.find(args[0]);
      case 'gzip': return vfs.gzip(args[0]);
      case 'gunzip': return vfs.gunzip(args[0]);
      case 'head': return vfs.head(args[0]);
      case 'tail': return vfs.tail(args[0]);
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
      status: result.status
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

    checkChallenge(cmd);
  };

  const startGame = (selectedDifficulty: Difficulty) => {
    setDifficulty(selectedDifficulty);
    setGameStarted(true);
    const firstChallenge = challenges.find(c => c.difficulty === selectedDifficulty);
    if (firstChallenge) {
      setCurrentChallenge(firstChallenge);
      setHistory([
        { input: '', output: `¡Bienvenido! Has seleccionado: ${difficultyLabels[selectedDifficulty]}\n${difficultyDescriptions[selectedDifficulty]}\n\nDesafío #${firstChallenge.id}: ${firstChallenge.description}`, status: 'success' }
      ]);
    }
    setPoints(0);
    setCompletedChallenges([]);
    setCommandHistory([]);
  };

  const handleHint = () => {
    if (hintUsed < 2) {
      setHintUsed(prev => prev + 1);
      setShowHint(true);
      setPoints(prev => Math.max(0, prev - 5));
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
    }
  };

  return (
    <div className="terminal-window w-full max-w-6xl mx-auto">
      <div className="terminal-header">
        <div className="terminal-dot bg-red-500"></div>
        <div className="terminal-dot bg-yellow-500"></div>
        <div className="terminal-dot bg-green-500"></div>
        <span className="text-gray-300 text-sm ml-2">Linux Command Trainer</span>
        <div className="ml-auto flex items-center gap-4">
          <span className="points-badge">{points} pts</span>
          <span className="text-gray-400 text-sm">Desafío {currentChallenge.id}/{challenges.length}</span>
        </div>
      </div>

      <div className="challenge-card mx-4 mt-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-blue-400 font-bold mb-2">Desafío #{currentChallenge.id}</h3>
            <p className="text-white">{currentChallenge.description}</p>
          </div>
          <button onClick={handleHint} className="hint-btn" disabled={hintUsed >= 2}>
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
            style={{ width: `${(completedChallenges.length / challenges.length) * 100}%` }}
          ></div>
        </div>
      </div>

      <div ref={terminalRef} className="terminal-body" onClick={() => inputRef.current?.focus()}>
        <FileTree vfs={vfs} />

        {history.map((entry, i) => (
          <div key={i} className="mb-2">
            {entry.input && (
              <div className="terminal-input-line">
                <span className="terminal-prompt">user@trainer:{vfs.cwd}$</span>
                <span className="text-white">{entry.input}</span>
              </div>
            )}
            {entry.output && (
              <pre className={`whitespace-pre-wrap ${entry.status === 'error' ? 'cmd-error' : 'cmd-success'}`}>
                {entry.output}
              </pre>
            )}
          </div>
        ))}
        <form onSubmit={handleSubmit} className="terminal-input-line">
          <span className="terminal-prompt">user@trainer:{vfs.cwd}$</span>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 bg-transparent border-none outline-none text-white font-mono"
            autoComplete="off"
          />
          <span className="terminal-cursor"></span>
        </form>
      </div>
    </div>
  );
}
