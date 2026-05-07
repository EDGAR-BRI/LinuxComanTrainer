import { VirtualFS } from '../lib/vfs';

export type Difficulty = 'beginner' | 'intermediate' | 'advanced';

export interface Challenge {
  id: number;
  difficulty: Difficulty;
  description: string;
  hint1: string;
  hint2: string;
  points: number;
  validate: (vfs: VirtualFS, history: string[]) => boolean;
}

export const difficultyLabels: Record<Difficulty, string> = {
  beginner: '🟢 Principiante',
  intermediate: '🟡 Intermedio',
  advanced: '🔴 Avanzado'
};

export const difficultyDescriptions: Record<Difficulty, string> = {
  beginner: 'Comandos básicos: pwd, ls, cd, mkdir, touch, cat',
  intermediate: 'Comandos intermedios: cp, mv, rm, chmod, find, head, tail',
  advanced: 'Comandos avanzados: red, compresión, permisos complejos'
};

export const challenges: Challenge[] = [
  // NIVEL PRINCIPIANTE
  {
    id: 1,
    difficulty: 'beginner',
    description: 'Muestra el directorio de trabajo actual usando pwd',
    hint1: 'El comando pwd muestra el directorio actual',
    hint2: 'Escribe simplemente: pwd',
    points: 10,
    validate: (vfs, history) => {
      return history.some(cmd => cmd.trim() === 'pwd');
    }
  },
  {
    id: 2,
    difficulty: 'beginner',
    description: 'Lista los archivos del directorio actual con ls',
    hint1: 'El comando ls lista archivos y directorios',
    hint2: 'Escribe: ls',
    points: 10,
    validate: (vfs, history) => {
      return history.some(cmd => cmd.trim() === 'ls');
    }
  },
  {
    id: 3,
    difficulty: 'beginner',
    description: 'Crea un nuevo directorio llamado "test" usando mkdir',
    hint1: 'mkdir crea directorios nuevos',
    hint2: 'Escribe: mkdir test',
    points: 15,
    validate: (vfs) => {
      return vfs.getFileList().some(f => f.name === 'test' && f.type === 'directory');
    }
  },
  {
    id: 4,
    difficulty: 'beginner',
    description: 'Cambia al directorio /home/user/docs usando cd',
    hint1: 'cd cambia de directorio, puedes usar rutas absolutas',
    hint2: 'Escribe: cd /home/user/docs',
    points: 15,
    validate: (vfs) => {
      return vfs.cwd === '/home/user/docs';
    }
  },
  {
    id: 5,
    difficulty: 'beginner',
    description: 'Crea un archivo vacío llamado "nuevo.txt" con touch',
    hint1: 'touch crea archivos vacíos o actualiza fecha',
    hint2: 'Escribe: touch nuevo.txt',
    points: 15,
    validate: (vfs) => {
      return vfs.getFileList().some(f => f.name === 'nuevo.txt' && f.type === 'file');
    }
  },
  {
    id: 6,
    difficulty: 'beginner',
    description: 'Muestra el contenido de notas.txt usando cat',
    hint1: 'cat muestra el contenido de un archivo',
    hint2: 'Escribe: cat notas.txt',
    points: 15,
    validate: (vfs, history) => {
      return history.some(cmd => cmd.trim() === 'cat notas.txt');
    }
  },
  {
    id: 7,
    difficulty: 'beginner',
    description: 'Vuelve al directorio personal usando cd ~',
    hint1: 'cd ~ te lleva a tu directorio home',
    hint2: 'Escribe: cd ~ o cd /home/user',
    points: 10,
    validate: (vfs) => {
      return vfs.cwd === '/home/user';
    }
  },

  // NIVEL INTERMEDIO
  {
    id: 8,
    difficulty: 'intermediate',
    description: 'Mueve el archivo archivo01.txt al directorio prueba usando mv',
    hint1: 'mv mueve o renombra archivos',
    hint2: 'Escribe: mv archivo01.txt prueba/',
    points: 25,
    validate: (vfs) => {
      return vfs.findNode('/home/user/prueba/archivo01.txt') !== null;
    }
  },
  {
    id: 9,
    difficulty: 'intermediate',
    description: 'Copia el archivo notas.txt a una copia llamada notas_backup.txt con cp',
    hint1: 'cp copia archivos',
    hint2: 'Escribe: cp notas.txt notas_backup.txt',
    points: 20,
    validate: (vfs) => {
      return vfs.getFileList().some(f => f.name === 'notas_backup.txt');
    }
  },
  {
    id: 10,
    difficulty: 'intermediate',
    description: 'Elimina el archivo notas_backup.txt usando rm',
    hint1: 'rm elimina archivos',
    hint2: 'Escribe: rm notas_backup.txt',
    points: 20,
    validate: (vfs) => {
      return !vfs.getFileList().some(f => f.name === 'notas_backup.txt');
    }
  },
  {
    id: 11,
    difficulty: 'intermediate',
    description: 'Elimina el directorio test vacío usando rmdir',
    hint1: 'rmdir elimina directorios vacíos',
    hint2: 'Escribe: rmdir test',
    points: 20,
    validate: (vfs) => {
      return !vfs.getFileList().some(f => f.name === 'test');
    }
  },
  {
    id: 12,
    difficulty: 'intermediate',
    description: 'Muestra las primeras 3 líneas de notas.txt usando head',
    hint1: 'head muestra las primeras líneas de un archivo',
    hint2: 'Escribe: head notas.txt',
    points: 20,
    validate: (vfs, history) => {
      return history.some(cmd => cmd.trim().startsWith('head'));
    }
  },
  {
    id: 13,
    difficulty: 'intermediate',
    description: 'Busca archivos que contengan "txt" usando find',
    hint1: 'find busca archivos en el sistema',
    hint2: 'Escribe: find txt',
    points: 25,
    validate: (vfs, history) => {
      return history.some(cmd => cmd.trim().startsWith('find'));
    }
  },

  // NIVEL AVANZADO
  {
    id: 14,
    difficulty: 'advanced',
    description: 'Comprime archivo01.txt usando gzip en el directorio prueba',
    hint1: 'gzip comprime archivos, asegúrate de estar en el directorio correcto',
    hint2: 'Escribe: gzip archivo01.txt (estando en /home/user/prueba)',
    points: 30,
    validate: (vfs) => {
      return vfs.findNode('/home/user/prueba/archivo01.txt.gz') !== null;
    }
  },
  {
    id: 15,
    difficulty: 'advanced',
    description: 'Cambia los permisos de notas.txt a 755 usando chmod',
    hint1: 'chmod cambia permisos, el formato es: chmod 755 archivo',
    hint2: 'Escribe: chmod 755 notas.txt',
    points: 25,
    validate: (vfs) => {
      const node = vfs.findNode('/home/user/notas.txt');
      return node?.permissions === '-rwxr-xr-x';
    }
  },
  {
    id: 16,
    difficulty: 'advanced',
    description: 'Descomprime el archivo archivo01.txt.gz usando gunzip',
    hint1: 'gunzip descomprime archivos .gz',
    hint2: 'Escribe: gunzip archivo01.txt.gz',
    points: 30,
    validate: (vfs) => {
      return vfs.findNode('/home/user/prueba/archivo01.txt') !== null &&
             vfs.findNode('/home/user/prueba/archivo01.txt.gz') === null;
    }
  },
  {
    id: 17,
    difficulty: 'advanced',
    description: 'Haz ping a google.com para verificar conectividad',
    hint1: 'ping envía paquetes ICMP para verificar conectividad',
    hint2: 'Escribe: ping google.com',
    points: 35,
    validate: (vfs, history) => {
      return history.some(cmd => cmd.trim().startsWith('ping'));
    }
  },
  {
    id: 18,
    difficulty: 'advanced',
    description: 'Muestra información de la interfaz de red con ip addr',
    hint1: 'ip addr muestra información detallada de interfaces de red',
    hint2: 'Escribe: ip addr',
    points: 30,
    validate: (vfs, history) => {
      return history.some(cmd => cmd.trim() === 'ip addr');
    }
  },
  {
    id: 19,
    difficulty: 'advanced',
    description: 'Actualiza la lista de paquetes con apt-get update',
    hint1: 'apt-get update actualiza la lista de paquetes disponibles',
    hint2: 'Escribe: apt-get update',
    points: 35,
    validate: (vfs, history) => {
      return history.some(cmd => cmd.trim() === 'apt-get update');
    }
  }
];
