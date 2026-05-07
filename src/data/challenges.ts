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
  beginner: 'Tareas simples: navegación básica, ver y crear archivos/directorios',
  intermediate: 'Tareas con múltiples pasos: mover, copiar, buscar, visualizar contenido',
  advanced: 'Tareas complejas: permisos, compresión, redes, paquetes'
};

export const challenges: Challenge[] = [
  // NIVEL PRINCIPIANTE - Tareas simples de un paso
  {
    id: 1,
    difficulty: 'beginner',
    description: 'Muestra en qué directorio te encuentras actualmente',
    hint1: 'Hay un comando que muestra el directorio actual',
    hint2: 'Prueba con: pwd',
    points: 10,
    validate: (vfs, history) => {
      return history.some(cmd => cmd.trim() === 'pwd');
    }
  },
  {
    id: 2,
    difficulty: 'beginner',
    description: 'Muestra todos los archivos y directorios en tu ubicación actual',
    hint1: 'Necesitas ver el contenido del directorio',
    hint2: 'Prueba con: ls',
    points: 10,
    validate: (vfs, history) => {
      return history.some(cmd => cmd.trim() === 'ls');
    }
  },
  {
    id: 3,
    difficulty: 'beginner',
    description: 'Crea un nuevo directorio llamado "test"',
    hint1: 'Existe un comando para crear directorios',
    hint2: 'Prueba con: mkdir test',
    points: 15,
    validate: (vfs) => {
      return vfs.getFileList().some(f => f.name === 'test' && f.type === 'directory');
    }
  },
  {
    id: 4,
    difficulty: 'beginner',
    description: 'Crea un archivo vacío llamado "nuevo.txt"',
    hint1: 'Hay un comando para crear archivos vacíos',
    hint2: 'Prueba con: touch nuevo.txt',
    points: 15,
    validate: (vfs) => {
      return vfs.getFileList().some(f => f.name === 'nuevo.txt' && f.type === 'file');
    }
  },
  {
    id: 5,
    difficulty: 'beginner',
    description: 'Ve al directorio personal (/home/user)',
    hint1: 'Usa el comando para cambiar de directorio',
    hint2: 'Prueba con: cd ~ o cd /home/user',
    points: 10,
    validate: (vfs) => {
      return vfs.cwd === '/home/user';
    }
  },
  {
    id: 6,
    difficulty: 'beginner',
    description: 'Ve al directorio /home/user/docs',
    hint1: 'Puedes usar rutas absolutas para navegar',
    hint2: 'Prueba con: cd /home/user/docs',
    points: 15,
    validate: (vfs) => {
      return vfs.cwd === '/home/user/docs';
    }
  },
  {
    id: 7,
    difficulty: 'beginner',
    description: 'Muestra el contenido del archivo notas.txt',
    hint1: 'Necesitas ver el contenido de un archivo',
    hint2: 'Prueba con: cat notas.txt',
    points: 15,
    validate: (vfs, history) => {
      return history.some(cmd => cmd.trim() === 'cat notas.txt');
    }
  },

  // NIVEL INTERMEDIO - Tareas de múltiples pasos
  {
    id: 8,
    difficulty: 'intermediate',
    description: 'Mueve el archivo archivo01.txt al directorio prueba',
    hint1: 'Primero ubícate en /home/user, luego mueve el archivo',
    hint2: 'cd /home/user, luego: mv archivo01.txt prueba/',
    points: 25,
    validate: (vfs) => {
      return vfs['findNodePublic']('/home/user/prueba/archivo01.txt') !== null;
    }
  },
  {
    id: 7,
    difficulty: 'intermediate',
    description: 'Copia el archivo notas.txt a una copia llamada notas_backup.txt',
    hint1: 'Necesitas crear una copia del archivo',
    hint2: 'Prueba con: cp notas.txt notas_backup.txt',
    points: 20,
    validate: (vfs) => {
      const files = vfs.getFileList();
      const found = files.some(f => f.name === 'notas_backup.txt');
      if (!found) {
        const fullNode = vfs.findNodePublic && vfs.findNodePublic('/home/user/notas_backup.txt');
        return fullNode !== null;
      }
      return found;
    }
  },
  {
    id: 10,
    difficulty: 'intermediate',
    description: 'Elimina el archivo notas_backup.txt que acabas de crear',
    hint1: 'Usa el comando para eliminar archivos',
    hint2: 'Prueba con: rm notas_backup.txt',
    points: 20,
    validate: (vfs) => {
      return !vfs.getFileList().some(f => f.name === 'notas_backup.txt');
    }
  },
  {
    id: 11,
    difficulty: 'intermediate',
    description: 'Elimina el directorio test que creaste (debe estar vacío)',
    hint1: 'El directorio debe estar vacío para eliminarlo',
    hint2: 'Prueba con: rmdir test',
    points: 20,
    validate: (vfs) => {
      return !vfs.getFileList().some(f => f.name === 'test');
    }
  },
  {
    id: 12,
    difficulty: 'intermediate',
    description: 'Muestra las primeras líneas de notas.txt',
    hint1: 'Hay un comando para ver el inicio de un archivo',
    hint2: 'Prueba con: head notas.txt',
    points: 20,
    validate: (vfs, history) => {
      return history.some(cmd => cmd.trim().startsWith('head'));
    }
  },
  {
    id: 13,
    difficulty: 'intermediate',
    description: 'Busca todos los archivos que contengan "txt" en el sistema',
    hint1: 'Necesitas un comando de búsqueda',
    hint2: 'Prueba con: find txt',
    points: 25,
    validate: (vfs, history) => {
      return history.some(cmd => cmd.trim().startsWith('find'));
    }
  },
  {
    id: 14,
    difficulty: 'intermediate',
    description: 'Muestra las últimas líneas de notas.txt',
    hint1: 'Hay un comando para ver el final de un archivo',
    hint2: 'Prueba con: tail notas.txt',
    points: 20,
    validate: (vfs, history) => {
      return history.some(cmd => cmd.trim().startsWith('tail'));
    }
  },

  // NIVEL AVANZADO - Tareas complejas
  {
    id: 15,
    difficulty: 'advanced',
    description: 'Comprime archivo01.txt que está en el directorio prueba',
    hint1: 'Primero navega a /home/user/prueba, luego comprime',
    hint2: 'cd /home/user/prueba, luego: gzip archivo01.txt',
    points: 30,
    validate: (vfs) => {
      return vfs['findNodePublic']('/home/user/prueba/archivo01.txt.gz') !== null;
    }
  },
  {
    id: 16,
    difficulty: 'advanced',
    description: 'Cambia los permisos de notas.txt a 755 (rwxr-xr-x)',
    hint1: 'Necesitas modificar los permisos del archivo',
    hint2: 'Prueba con: chmod 755 notas.txt',
    points: 25,
    validate: (vfs) => {
      const node = vfs['findNodePublic']('/home/user/notas.txt');
      return node?.permissions === '-rwxr-xr-x';
    }
  },
  {
    id: 17,
    difficulty: 'advanced',
    description: 'Descomprime el archivo archivo01.txt.gz en prueba',
    hint1: 'Usa la herramienta inversa de compresión',
    hint2: 'gunzip archivo01.txt.gz',
    points: 30,
    validate: (vfs) => {
      return vfs['findNodePublic']('/home/user/prueba/archivo01.txt') !== null &&
             vfs['findNodePublic']('/home/user/prueba/archivo01.txt.gz') === null;
    }
  },
  {
    id: 18,
    difficulty: 'advanced',
    description: 'Verifica la conectividad haciendo ping a google.com',
    hint1: 'Usa el comando para probar conectividad de red',
    hint2: 'Prueba con: ping google.com',
    points: 35,
    validate: (vfs, history) => {
      return history.some(cmd => cmd.trim().startsWith('ping'));
    }
  },
  {
    id: 19,
    difficulty: 'advanced',
    description: 'Muestra información detallada de todas las interfaces de red',
    hint1: 'Es un comando de red que muestra IP y estado',
    hint2: 'Prueba con: ip addr',
    points: 30,
    validate: (vfs, history) => {
      return history.some(cmd => cmd.trim() === 'ip addr');
    }
  },
  {
    id: 20,
    difficulty: 'advanced',
    description: 'Actualiza la lista de paquetes disponibles en los repositorios',
    hint1: 'Es un comando de gestión de paquetes (apt)',
    hint2: 'Prueba con: apt-get update',
    points: 35,
    validate: (vfs, history) => {
      return history.some(cmd => cmd.trim() === 'apt-get update');
    }
  },
  {
    id: 21,
    difficulty: 'advanced',
    description: 'Instala el paquete "nginx" usando apt',
    hint1: 'apt-get puede instalar paquetes',
    hint2: 'Prueba con: apt-get install nginx',
    points: 35,
    validate: (vfs, history) => {
      return history.some(cmd => cmd.trim().startsWith('apt-get install'));
    }
  }
];
