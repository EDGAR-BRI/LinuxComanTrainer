export type NodeType = 'file' | 'directory';

export interface VFSNode {
  type: NodeType;
  name: string;
  path: string;
  content?: string;
  children?: VFSNode[];
  permissions: string;
  modified: Date;
}

export interface CommandResult {
  output: string;
  status: 'success' | 'error';
}

export class VirtualFS {
  private root: VFSNode;
  private _cwd: VFSNode;

  constructor() {
    this.root = {
      type: 'directory',
      name: '/',
      path: '/',
      permissions: 'drwxr-xr-x',
      modified: new Date(),
      children: [
        {
          type: 'directory',
          name: 'home',
          path: '/home',
          permissions: 'drwxr-xr-x',
          modified: new Date(),
          children: [
            {
              type: 'directory',
              name: 'user',
              path: '/home/user',
              permissions: 'drwxr-xr-x',
              modified: new Date(),
              children: [
                { type: 'file', name: 'archivo01.txt', path: '/home/user/archivo01.txt', content: 'Este es el archivo 01', permissions: '-rw-r--r--', modified: new Date() },
                { type: 'file', name: 'notas.txt', path: '/home/user/notas.txt', content: 'Mis notas personales', permissions: '-rw-r--r--', modified: new Date() },
                { type: 'directory', name: 'docs', path: '/home/user/docs', permissions: 'drwxr-xr-x', modified: new Date(), children: [] },
                { type: 'directory', name: 'prueba', path: '/home/user/prueba', permissions: 'drwxr-xr-x', modified: new Date(), children: [] },
              ]
            }
          ]
        },
        {
          type: 'directory',
          name: 'etc',
          path: '/etc',
          permissions: 'drwxr-xr-x',
          modified: new Date(),
          children: [
            { type: 'file', name: 'hostname', path: '/etc/hostname', content: 'linux-trainer', permissions: '-rw-r--r--', modified: new Date() }
          ]
        },
        {
          type: 'directory',
          name: 'var',
          path: '/var',
          permissions: 'drwxr-xr-x',
          modified: new Date(),
          children: [
            {
              type: 'directory',
              name: 'log',
              path: '/var/log',
              permissions: 'drwxr-xr-x',
              modified: new Date(),
              children: [
                { type: 'file', name: 'syslog', path: '/var/log/syslog', content: 'Log entries...', permissions: '-rw-r-----', modified: new Date() }
              ]
            }
          ]
        }
      ]
    };
    this._cwd = this.root;
  }

  get cwd(): string {
    return this._cwd.path;
  }

  get cwdNode(): VFSNode {
    return this._cwd;
  }

  private normalizePath(path: string): string {
    if (!path || path === '.') return this._cwd.path;
    if (path === '..') {
      const parts = this._cwd.path.split('/').filter(Boolean);
      if (parts.length <= 1) return '/';
      return '/' + parts.slice(0, -1).join('/');
    }
    if (path.startsWith('/')) return path;
    return this._cwd.path === '/' ? `/${path}` : `${this._cwd.path}/${path}`;
  }

  private findNode(path: string): VFSNode | null {
    const targetPath = this.normalizePath(path);
    const parts = targetPath.split('/').filter(Boolean);
    let current = this.root;

    for (const part of parts) {
      if (current.type !== 'directory' || !current.children) return null;
      const found = current.children.find(c => c.name === part);
      if (!found) return null;
      current = found;
    }
    return current;
  }

  private findParent(path: string): VFSNode | null {
    const parentPath = this.normalizePath(path).split('/').filter(Boolean);
    parentPath.pop();
    const parentStr = parentPath.length === 0 ? '/' : '/' + parentPath.join('/');
    return parentStr === '/' ? this.root : this.findNode(parentStr);
  }

  pwd(): CommandResult {
    return { output: this._cwd.path, status: 'success' };
  }

  cd(target?: string): CommandResult {
    if (!target || target === '~') {
      const home = this.findNode('/home/user');
      if (home) { this._cwd = home; return { output: '', status: 'success' }; }
      return { output: 'cd: no se pudo cambiar a home', status: 'error' };
    }
    const node = this.findNode(target);
    if (!node) return { output: `cd: ${target}: No existe el archivo o directorio`, status: 'error' };
    if (node.type !== 'directory') return { output: `cd: ${target}: No es un directorio`, status: 'error' };
    this._cwd = node;
    return { output: '', status: 'success' };
  }

  ls(target?: string, flags?: string): CommandResult {
    const node = target ? this.findNode(target) : this._cwd;
    if (!node) return { output: `ls: no se puede acceder a '${target}': No existe`, status: 'error' };
    if (node.type === 'file') return { output: node.name, status: 'success' };
    if (!node.children) return { output: '', status: 'success' };

    const showAll = flags?.includes('a') || false;
    const longFormat = flags?.includes('l') || false;

    let items = node.children;
    if (!showAll) {
      items = items.filter(c => !c.name.startsWith('.'));
    }

    if (longFormat) {
      return {
        output: items.map(c => {
          const prefix = c.type === 'directory' ? 'd' : '-';
          return `${prefix}${c.permissions} 1 user user 4096 ${c.modified.toLocaleDateString()} ${c.name}`;
        }).join('\n'),
        status: 'success'
      };
    }

    return { output: items.map(c => c.name).join('\n'), status: 'success' };
  }

  mkdir(name: string): CommandResult {
    if (!name) return { output: 'mkdir: falta operando', status: 'error' };
    const parent = this._cwd;
    if (parent.type !== 'directory') return { output: 'mkdir: directorio actual no es válido', status: 'error' };
    if (parent.children?.find(c => c.name === name)) {
      return { output: `mkdir: no se puede crear el directorio '${name}': El archivo ya existe`, status: 'error' };
    }
    parent.children = parent.children || [];
    parent.children.push({
      type: 'directory',
      name,
      path: parent.path === '/' ? `/${name}` : `${parent.path}/${name}`,
      permissions: 'drwxr-xr-x',
      modified: new Date(),
      children: []
    });
    return { output: '', status: 'success' };
  }

  rmdir(name: string): CommandResult {
    if (!name) return { output: 'rmdir: falta operando', status: 'error' };
    const parent = this._cwd;
    const node = parent.children?.find(c => c.name === name);
    if (!node) return { output: `rmdir: no se pudo eliminar '${name}': No existe`, status: 'error' };
    if (node.type !== 'directory') return { output: `rmdir: no se pudo eliminar '${name}': No es un directorio`, status: 'error' };
    if (node.children && node.children.length > 0) {
      return { output: `rmdir: no se pudo eliminar '${name}': El directorio no está vacío`, status: 'error' };
    }
    parent.children = parent.children?.filter(c => c.name !== name) || [];
    return { output: '', status: 'success' };
  }

  touch(name: string): CommandResult {
    if (!name) return { output: 'touch: falta operando', status: 'error' };
    const existing = this._cwd.children?.find(c => c.name === name);
    if (existing && existing.type === 'file') {
      existing.modified = new Date();
      return { output: '', status: 'success' };
    }
    this._cwd.children = this._cwd.children || [];
    this._cwd.children.push({
      type: 'file',
      name,
      path: this._cwd.path === '/' ? `/${name}` : `${this._cwd.path}/${name}`,
      content: '',
      permissions: '-rw-r--r--',
      modified: new Date()
    });
    return { output: '', status: 'success' };
  }

  rm(name: string, flags?: string): CommandResult {
    if (!name) return { output: 'rm: falta operando', status: 'error' };
    const node = this._cwd.children?.find(c => c.name === name);
    if (!node) return { output: `rm: no se puede eliminar '${name}': No existe`, status: 'error' };
    if (node.type === 'directory' && (!flags || !flags.includes('r'))) {
      return { output: `rm: no se puede eliminar '${name}': Es un directorio`, status: 'error' };
    }
    this._cwd.children = this._cwd.children?.filter(c => c.name !== name) || [];
    return { output: '', status: 'success' };
  }

  cp(src: string, dest: string): CommandResult {
    if (!src || !dest) return { output: 'cp: falta operando', status: 'error' };
    const srcNode = this.findNode(src);
    if (!srcNode) return { output: `cp: no se puede obtener '${src}': No existe`, status: 'error' };
    const destNode = this.findNode(dest);
    const targetDir = destNode?.type === 'directory' ? destNode : this._cwd;
    if (destNode?.type === 'directory') {
      targetDir.children = targetDir.children || [];
      targetDir.children.push({ ...srcNode, name: srcNode.name, path: `${targetDir.path}/${srcNode.name}`, modified: new Date() });
    } else {
      this._cwd.children = this._cwd.children || [];
      this._cwd.children.push({ ...srcNode, name: dest, path: `${this._cwd.path}/${dest}`, modified: new Date() });
    }
    return { output: '', status: 'success' };
  }

  mv(src: string, dest: string): CommandResult {
    if (!src || !dest) return { output: 'mv: falta operando', status: 'error' };
    const srcNode = this._cwd.children?.find(c => c.name === src);
    if (!srcNode) return { output: `mv: no se puede mover '${src}': No existe`, status: 'error' };
    const destNode = this.findNode(dest);
    if (destNode?.type === 'directory') {
      srcNode.path = `${destNode.path}/${srcNode.name}`;
      destNode.children = destNode.children || [];
      destNode.children.push(srcNode);
      this._cwd.children = this._cwd.children?.filter(c => c.name !== src) || [];
    } else {
      srcNode.name = dest;
      srcNode.path = `${this._cwd.path}/${dest}`;
    }
    return { output: '', status: 'success' };
  }

  cat(name: string): CommandResult {
    if (!name) return { output: 'cat: falta operando', status: 'error' };
    const node = this.findNode(name);
    if (!node) return { output: `cat: ${name}: No existe`, status: 'error' };
    if (node.type === 'directory') return { output: `cat: ${name}: Es un directorio`, status: 'error' };
    return { output: node.content || '', status: 'success' };
  }

  less(name: string): CommandResult {
    return this.cat(name);
  }

  chmod(mode: string, name: string): CommandResult {
    if (!mode || !name) return { output: 'chmod: falta operando', status: 'error' };
    const node = this.findNode(name);
    if (!node) return { output: `chmod: no se puede acceder a '${name}': No existe`, status: 'error' };
    node.permissions = node.type === 'directory' ? `d${mode}` : `-${mode}`;
    return { output: '', status: 'success' };
  }

  find(pattern: string): CommandResult {
    if (!pattern) return { output: 'find: falta patrón', status: 'error' };
    const results: string[] = [];
    const search = (node: VFSNode) => {
      if (node.name.includes(pattern.replace('*', ''))) results.push(node.path);
      if (node.children) node.children.forEach(search);
    };
    search(this.root);
    return { output: results.join('\n') || 'No se encontraron coincidencias', status: 'success' };
  }

  gzip(name: string): CommandResult {
    if (!name) return { output: 'gzip: falta operando', status: 'error' };
    const node = this.findNode(name);
    if (!node) return { output: `gzip: ${name}: No existe`, status: 'error' };
    if (node.type === 'directory') return { output: `gzip: ${name}: Es un directorio`, status: 'error' };
    node.name = `${node.name}.gz`;
    node.path = `${this._cwd.path}/${node.name}`;
    return { output: `Comprimido: ${node.name}`, status: 'success' };
  }

  gunzip(name: string): CommandResult {
    if (!name) return { output: 'gunzip: falta operando', status: 'error' };
    const node = this.findNode(name);
    if (!node) return { output: `gunzip: ${name}: No existe`, status: 'error' };
    if (!name.endsWith('.gz')) return { output: `gunzip: ${name}: no es un archivo gzip`, status: 'error' };
    node.name = node.name.replace(/\.gz$/, '');
    node.path = `${this._cwd.path}/${node.name}`;
    return { output: `Descomprimido: ${node.name}`, status: 'success' };
  }

  hostname(name?: string): CommandResult {
    if (name) return { output: `hostname: establecer hostname no soportado en simulación`, status: 'error' };
    return { output: 'linux-trainer', status: 'success' };
  }

  ipAddr(): CommandResult {
    return { output: `1: lo: <LOOPBACK,UP,LOWER_UP> mtu 65536
    link/loopback 00:00:00:00:00:00 brd 00:00:00:00:00:00
    inet 127.0.0.1/8 scope host lo
       valid_lft forever preferred_lft forever
2: eth0: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500
    link/ether 02:42:ac:11:00:02 brd ff:ff:ff:ff:ff:ff
    inet 172.17.0.2/16 brd 172.17.255.255 scope global eth0
       valid_lft forever preferred_lft forever`, status: 'success' };
  }

  ifconfig(): CommandResult {
    return { output: `eth0: flags=4163<UP,BROADCAST,RUNNING,MULTICAST>  mtu 1500
        inet 172.17.0.2  netmask 255.255.0.0  broadcast 172.17.255.255
        ether 02:42:ac:11:00:02  txqueuelen 0  (Ethernet)
lo: flags=73<UP,LOOPBACK,RUNNING>  mtu 65536
        inet 127.0.0.1  netmask 255.0.0.0
        loop  txqueuelen 1000  (Local Loopback)`, status: 'success' };
  }

  ping(target: string): CommandResult {
    if (!target) return { output: 'ping: falta operando', status: 'error' };
    return { output: `PING ${target} (93.184.216.34) 56(84) bytes of data.
64 bytes from ${target} (93.184.216.34): icmp_seq=1 ttl=56 time=11.2 ms
64 bytes from ${target} (93.184.216.34): icmp_seq=2 ttl=56 time=10.8 ms
64 bytes from ${target} (93.184.216.34): icmp_seq=3 ttl=56 time=11.0 ms

--- ${target} ping statistics ---
3 packets transmitted, 3 received, 0% packet loss, time 2003ms
rtt min/avg/max/mdev = 10.8/11.0/11.2/0.1 ms`, status: 'success' };
  }

  traceroute(target: string): CommandResult {
    if (!target) return { output: 'traceroute: falta operando', status: 'error' };
    return { output: `traceroute to ${target} (93.184.216.34), 30 hops max
 1  gateway (172.17.0.1)  0.5 ms  0.4 ms  0.3 ms
 2  10.0.0.1 (10.0.0.1)  5.2 ms  5.1 ms  5.0 ms
 3  * * *
 4  ${target} (93.184.216.34)  11.2 ms  10.9 ms  10.8 ms`, status: 'success' };
  }

  nslookup(domain: string): CommandResult {
    if (!domain) return { output: 'nslookup: falta operando', status: 'error' };
    return { output: `Server:		8.8.8.8
Address:	8.8.8.8#53

Non-authoritative answer:
Name:	${domain}
Address: 93.184.216.34`, status: 'success' };
  }

  dig(domain: string): CommandResult {
    if (!domain) return { output: 'dig: falta operando', status: 'error' };
    return { output: `; <<>> DiG 9.16.1 <<>> ${domain}
;; global options: +cmd
;; Got answer:
;; ->>HEADER<<- opcode: QUERY, status: NOERROR, id: 12345
;; QUESTION SECTION:
;${domain}.			IN	A

;; ANSWER SECTION:
${domain}.		300	IN	A	93.184.216.34

;; Query time: 10 msec
;; SERVER: 8.8.8.8#53(8.8.8.8)
;; WHEN: Wed May 06 21:50:00 UTC 2026`, status: 'success' };
  }

  ss(): CommandResult {
    return { output: `Netid  State      Recv-Q Send-Q Local Address:Port  Peer Address:Port
tcp    LISTEN     0      128    0.0.0.0:22           0.0.0.0:*
tcp    LISTEN     0      128    0.0.0.0:80           0.0.0.0:*
tcp    ESTAB      0      0      172.17.0.2:22       10.0.0.1:12345`, status: 'success' };
  }

  netstat(): CommandResult {
    return { output: `Active Internet connections (w/o servers)
Proto Recv-Q Send-Q Local Address  Foreign Address  State
tcp        0      0 172.17.0.2:22 10.0.0.1:12345  ESTABLISHED

Active UNIX domain sockets (w/o servers)
Proto RefCnt Flags  Type  State  I-Node Path`, status: 'success' };
  }

  route(): CommandResult {
    return { output: `Kernel IP routing table
Destination  Gateway    Genmask       Flags Metric Ref Use Iface
0.0.0.0      172.17.0.1 0.0.0.0     UG    0      0   0 eth0
172.17.0.0   0.0.0.0    255.255.0.0  U     0      0   0 eth0`, status: 'success' };
  }

  arp(): CommandResult {
    return { output: `Address       HWtype  HWaddress         Flags Mask  Iface
172.17.0.1    ether   02:42:ac:11:00:01 C       eth0`, status: 'success' };
  }

  aptGetUpdate(): CommandResult {
    return { output: `Hit:1 http://archive.ubuntu.com/ubuntu jammy InRelease
Get:2 http://archive.ubuntu.com/ubuntu jammy-updates InRelease [114 kB]
Get:3 http://archive.ubuntu.com/ubuntu jammy-backports InRelease [99 kB]
Fetched 213 kB in 1s (213 kB/s)
Reading package lists... Done`, status: 'success' };
  }

  aptGetInstall(pkg: string): CommandResult {
    if (!pkg) return { output: 'E: Falta el nombre del paquete', status: 'error' };
    return { output: `Leyendo lista de paquetes... Hecho
Construyendo árbol de dependencias... Hecho
El paquete ${pkg} no está instalado, así que se procede a instalar.
Se instalarán los siguientes paquetes:
  ${pkg}
0 actualizados, 1 nuevos se instalarán.
Se han descargado 1,234 kB.
Se han configurado ${pkg}.`, status: 'success' };
  }

  nano(name?: string): CommandResult {
    return { output: `[Simulación] Se abriría el editor nano${name ? ` para editar ${name}` : ''}\nUsa Ctrl+X para salir, Ctrl+O para guardar.`, status: 'success' };
  }

  vim(name?: string): CommandResult {
    return { output: `[Simulación] Se abriría el editor vim${name ? ` para editar ${name}` : ''}\nUsa :q para salir, i para insertar texto.`, status: 'success' };
  }

  head(name: string, lines: number = 5): CommandResult {
    if (!name) return { output: 'head: falta operando', status: 'error' };
    const result = this.cat(name);
    if (result.status === 'error') return result;
    const content = result.output.split('\n').slice(0, lines).join('\n');
    return { output: content, status: 'success' };
  }

  tail(name: string, lines: number = 5): CommandResult {
    if (!name) return { output: 'tail: falta operando', status: 'error' };
    const result = this.cat(name);
    if (result.status === 'error') return result;
    const content = result.output.split('\n').slice(-lines).join('\n');
    return { output: content, status: 'success' };
  }

  getTree(): string {
    const render = (node: VFSNode, prefix: string = ''): string => {
      let result = `${prefix}${node.name}${node.type === 'directory' ? '/' : ''}\n`;
      if (node.children) {
        node.children.forEach((child, i) => {
          const isLast = i === node.children!.length - 1;
          result += render(child, prefix + (isLast ? '└── ' : '├── '));
        });
      }
      return result;
    };
    return render(this.root);
  }

  getFileList(): { name: string; type: NodeType }[] {
    return this._cwd.children?.map(c => ({ name: c.name, type: c.type })) || [];
  }

  exists(path: string): boolean {
    return this.findNode(path) !== null;
  }

  findNodePublic(path: string): VFSNode | null {
    return this.findNode(path);
  }
}
