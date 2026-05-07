export type AppMode = 'menu' | 'learn' | 'test';

export interface Lesson {
  id: number;
  command: string;
  title: string;
  explanation: string;
  syntax: string;
  examples: { cmd: string; description: string }[];
  tryIt: boolean;
}

export const lessons: Lesson[] = [
  {
    id: 1,
    command: 'pwd',
    title: 'Mostrar directorio actual (pwd)',
    explanation: 'El comando pwd (print working directory) muestra la ruta completa del directorio actual.',
    syntax: 'pwd',
    examples: [
      { cmd: 'pwd', description: 'Muestra /home/user' }
    ],
    tryIt: true
  },
  {
    id: 2,
    command: 'ls',
    title: 'Listar archivos (ls)',
    explanation: 'ls lista archivos y directorios. Opciones comunes: -l (detallado), -a (ocultos), -h (tamaños legibles).',
    syntax: 'ls [opciones] [directorio]',
    examples: [
      { cmd: 'ls', description: 'Lista archivos del directorio actual' },
      { cmd: 'ls -la', description: 'Lista con detalles y archivos ocultos' },
      { cmd: 'ls /home', description: 'Lista archivos de /home' }
    ],
    tryIt: true
  },
  {
    id: 3,
    command: 'cd',
    title: 'Cambiar de directorio (cd)',
    explanation: 'cd (change directory) navega entre directorios. Usa ".." para subir, "~" para ir a home.',
    syntax: 'cd [directorio]',
    examples: [
      { cmd: 'cd /home/user/docs', description: 'Directorio absoluto' },
      { cmd: 'cd ..', description: 'Sube un nivel' },
      { cmd: 'cd ~', description: 'Va al directorio personal' }
    ],
    tryIt: true
  },
  {
    id: 4,
    command: 'mkdir',
    title: 'Crear directorios (mkdir)',
    explanation: 'mkdir (make directory) crea nuevos directorios vacíos.',
    syntax: 'mkdir <nombre>',
    examples: [
      { cmd: 'mkdir proyecto', description: 'Crea el directorio "proyecto"' },
      { cmd: 'mkdir test docs', description: 'Crea múltiples directorios' }
    ],
    tryIt: true
  },
  {
    id: 5,
    command: 'rmdir',
    title: 'Eliminar directorios vacíos (rmdir)',
    explanation: 'rmdir elimina directorios vacíos. Si el directorio tiene contenido, usa "rm -r".',
    syntax: 'rmdir <directorio>',
    examples: [
      { cmd: 'rmdir test', description: 'Elimina el directorio test (debe estar vacío)' }
    ],
    tryIt: true
  },
  {
    id: 6,
    command: 'touch',
    title: 'Crear archivos vacíos (touch)',
    explanation: 'touch crea archivos vacíos o actualiza la fecha de modificación.',
    syntax: 'touch <archivo>',
    examples: [
      { cmd: 'touch archivo.txt', description: 'Crea archivo.txt vacío' },
      { cmd: 'touch a.txt b.txt', description: 'Crea múltiples archivos' }
    ],
    tryIt: true
  },
  {
    id: 7,
    command: 'rm',
    title: 'Eliminar archivos (rm)',
    explanation: 'rm (remove) elimina archivos. Con -r elimina directorios y su contenido recursivamente.',
    syntax: 'rm <archivo> | rm -r <directorio>',
    examples: [
      { cmd: 'rm archivo.txt', description: 'Elimina archivo.txt' },
      { cmd: 'rm -r directorio', description: 'Elimina directorio y contenido' }
    ],
    tryIt: true
  },
  {
    id: 8,
    command: 'cp',
    title: 'Copiar archivos (cp)',
    explanation: 'cp (copy) copia archivos o directorios. Con -r copia directorios recursivamente.',
    syntax: 'cp <origen> <destino>',
    examples: [
      { cmd: 'cp archivo.txt copia.txt', description: 'Copia archivo.txt' },
      { cmd: 'cp -r dir1 dir2', description: 'Copia directorio recursivamente' }
    ],
    tryIt: true
  },
  {
    id: 9,
    command: 'mv',
    title: 'Mover o renombrar (mv)',
    explanation: 'mv (move) mueve archivos entre directorios o los renombra.',
    syntax: 'mv <origen> <destino>',
    examples: [
      { cmd: 'mv archivo.txt /home/user/docs/', description: 'Mueve a docs' },
      { cmd: 'mv viejo.txt nuevo.txt', description: 'Renombra archivo' }
    ],
    tryIt: true
  },
  {
    id: 10,
    command: 'cat',
    title: 'Ver contenido (cat)',
    explanation: 'cat muestra el contenido completo de archivos en la terminal.',
    syntax: 'cat <archivo>',
    examples: [
      { cmd: 'cat notas.txt', description: 'Muestra contenido de notas.txt' }
    ],
    tryIt: true
  },
  {
    id: 11,
    command: 'less',
    title: 'Visor de archivos (less)',
    explanation: 'less permite ver archivos página por página. Usa las flechas para navegar, q para salir.',
    syntax: 'less <archivo>',
    examples: [
      { cmd: 'less archivo.txt', description: 'Abre archivo.txt en less' }
    ],
    tryIt: true
  },
  {
    id: 12,
    command: 'head y tail',
    title: 'Ver inicio y fin (head/tail)',
    explanation: 'head muestra las primeras líneas (por defecto 10). tail muestra las últimas.',
    syntax: 'head [n] <archivo> | tail [n] <archivo>',
    examples: [
      { cmd: 'head archivo.txt', description: 'Primeras 10 líneas' },
      { cmd: 'tail -n 5 archivo.txt', description: 'Últimas 5 líneas' }
    ],
    tryIt: true
  },
  {
    id: 13,
    command: 'chmod',
    title: 'Cambiar permisos (chmod)',
    explanation: 'chmod cambia permisos usando formato octal (4=r, 2=w, 1=x). Ej: 755 = rwxr-xr-x.',
    syntax: 'chmod <modo> <archivo>',
    examples: [
      { cmd: 'chmod 755 script.sh', description: 'Ejecutable para todos' },
      { cmd: 'chmod 644 archivo.txt', description: 'Lectura para todos' },
      { cmd: 'chmod 700 privado.txt', description: 'Solo el dueño' }
    ],
    tryIt: true
  },
  {
    id: 14,
    command: 'find',
    title: 'Buscar archivos (find)',
    explanation: 'find busca archivos en una jerarquía de directorios. Muy potente y flexible.',
    syntax: 'find [ruta] -name <patrón>',
    examples: [
      { cmd: 'find . -name "*.txt"', description: 'Busca .txt en actual' },
      { cmd: 'find /home -name "doc*"', description: 'Busca que empiecen con "doc"' }
    ],
    tryIt: true
  },
  {
    id: 15,
    command: 'gzip y gunzip',
    title: 'Comprimir y descomprimir',
    explanation: 'gzip comprime (agrega .gz). gunzip descomprime. Solo comprime archivos, no directorios.',
    syntax: 'gzip <archivo> | gunzip <archivo.gz>',
    examples: [
      { cmd: 'gzip archivo.txt', description: 'Crea archivo.txt.gz' },
      { cmd: 'gunzip archivo.txt.gz', description: 'Recupera archivo.txt' }
    ],
    tryIt: true
  },
  {
    id: 16,
    command: 'ip addr',
    title: 'Configuración de red (ip addr)',
    explanation: 'ip addr muestra información detallada de interfaces de red: IP, máscara, estado.',
    syntax: 'ip addr',
    examples: [
      { cmd: 'ip addr', description: 'Muestra todas las interfaces' },
      { cmd: 'ip addr show eth0', description: 'Muestra interfaz eth0' }
    ],
    tryIt: true
  },
  {
    id: 17,
    command: 'ifconfig',
    title: 'Configuración de red (ifconfig)',
    explanation: 'ifconfig es el comando clásico para ver/configurar interfaces. Siendo reemplazado por "ip".',
    syntax: 'ifconfig [interfaz]',
    examples: [
      { cmd: 'ifconfig', description: 'Muestra todas las interfaces' },
      { cmd: 'ifconfig eth0', description: 'Muestra solo eth0' }
    ],
    tryIt: true
  },
  {
    id: 18,
    command: 'ping',
    title: 'Verificar conectividad (ping)',
    explanation: 'ping envía paquetes ICMP para verificar si un host está accesible.',
    syntax: 'ping [opciones] <host>',
    examples: [
      { cmd: 'ping google.com', description: 'Hace ping a Google' },
      { cmd: 'ping -c 4 8.8.8.8', description: '4 paquetes a DNS de Google' }
    ],
    tryIt: true
  },
  {
    id: 19,
    command: 'traceroute',
    title: 'Ruta de red (traceroute)',
    explanation: 'traceroute muestra la ruta que siguen los paquetes hasta el destino, mostrando cada salto.',
    syntax: 'traceroute <host>',
    examples: [
      { cmd: 'traceroute google.com', description: 'Muestra ruta a Google' }
    ],
    tryIt: true
  },
  {
    id: 20,
    command: 'nslookup y dig',
    title: 'Consultas DNS (nslookup/dig)',
    explanation: 'nslookup y dig resuelven nombres de dominio a IP. dig es más moderno y detallado.',
    syntax: 'nslookup <dominio> | dig <dominio>',
    examples: [
      { cmd: 'nslookup google.com', description: 'Resuelve google.com' },
      { cmd: 'dig google.com', description: 'Consulta DNS detallada' }
    ],
    tryIt: true
  },
  {
    id: 21,
    command: 'ss y netstat',
    title: 'Estadísticas de red (ss/netstat)',
    explanation: 'ss y netstat muestran conexiones de red activas, puertos abiertos, estadísticas.',
    syntax: 'ss [opciones] | netstat [opciones]',
    examples: [
      { cmd: 'ss -tuln', description: 'Puertos abiertos TCP/UDP' },
      { cmd: 'netstat -a', description: 'Todas las conexiones' }
    ],
    tryIt: true
  },
  {
    id: 22,
    command: 'hostname',
    title: 'Nombre del host (hostname)',
    explanation: 'hostname muestra o establece el nombre del host del sistema.',
    syntax: 'hostname [nuevo_nombre]',
    examples: [
      { cmd: 'hostname', description: 'Muestra el nombre actual' }
    ],
    tryIt: true
  },
  {
    id: 23,
    command: 'route y arp',
    title: 'Tablas de red (route/arp)',
    explanation: 'route muestra la tabla de enrutamiento. arp muestra la tabla de resolución de direcciones.',
    syntax: 'route | arp',
    examples: [
      { cmd: 'route -n', description: 'Tabla de rutas numérica' },
      { cmd: 'arp -a', description: 'Tabla ARP completa' }
    ],
    tryIt: true
  },
  {
    id: 24,
    command: 'Editores: nano',
    title: 'Editor de texto nano',
    explanation: 'nano es un editor simple y fácil de usar. Ctrl+O para guardar, Ctrl+X para salir.',
    syntax: 'nano [archivo]',
    examples: [
      { cmd: 'nano archivo.txt', description: 'Edita archivo.txt con nano' }
    ],
    tryIt: false
  },
  {
    id: 25,
    command: 'Editores: vim y vi',
    title: 'Editores vim y vi',
    explanation: 'vim es un editor potente con modos: i para insertar, Esc para comandos, :wq para guardar y salir.',
    syntax: 'vim [archivo] | vi [archivo]',
    examples: [
      { cmd: 'vim archivo.txt', description: 'Edita con vim' },
      { cmd: 'vi archivo.txt', description: 'Edita con vi (versión básica)' }
    ],
    tryIt: false
  },
  {
    id: 26,
    command: 'Editores: emacs y ed',
    title: 'Editores emacs y ed',
    explanation: 'emacs es un editor muy extensible. ed es el editor original de Unix, muy básico.',
    syntax: 'emacs [archivo] | ed [archivo]',
    examples: [
      { cmd: 'emacs archivo.txt', description: 'Edita con emacs' }
    ],
    tryIt: false
  },
  {
    id: 27,
    command: 'apt-get',
    title: 'Gestión de paquetes (apt-get)',
    explanation: 'apt-get gestiona paquetes en Debian/Ubuntu. update actualiza lista, install instala, remove elimina.',
    syntax: 'apt-get <operación> [paquete]',
    examples: [
      { cmd: 'apt-get update', description: 'Actualiza lista de paquetes' },
      { cmd: 'apt-get install nginx', description: 'Instala nginx' },
      { cmd: 'apt-get remove nginx', description: 'Elimina nginx' }
    ],
    tryIt: true
  },
  {
    id: 28,
    command: 'apt-cache',
    title: 'Buscar paquetes (apt-cache)',
    explanation: 'apt-cache busca y muestra información sobre paquetes disponibles.',
    syntax: 'apt-cache search <término> | apt-cache show <paquete>',
    examples: [
      { cmd: 'apt-cache search editor', description: 'Busca editores' },
      { cmd: 'apt-cache show nano', description: 'Info detallada de nano' }
    ],
    tryIt: true
  },
  {
    id: 29,
    command: 'dpkg',
    title: 'Gestión baja de paquetes (dpkg)',
    explanation: 'dpkg es la herramienta base para gestionar paquetes .deb. -i instala, -r elimina, -l lista.',
    syntax: 'dpkg <opción> [paquete]',
    examples: [
      { cmd: 'dpkg -i paquete.deb', description: 'Instala paquete.deb' },
      { cmd: 'dpkg -l', description: 'Lista paquetes instalados' },
      { cmd: 'dpkg -r paquete', description: 'Elimina paquete' }
    ],
    tryIt: true
  },
  {
    id: 30,
    command: 'netplan y nmcli',
    title: 'Configuración de red (netplan/nmcli)',
    explanation: 'netplan configura red declarativamente. nmcli controla NetworkManager.',
    syntax: 'netplan apply | nmcli device status',
    examples: [
      { cmd: 'nmcli device status', description: 'Estado de dispositivos de red' }
    ],
    tryIt: true
  }
];
