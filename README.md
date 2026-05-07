# Linux Command Trainer

Simulador interactivo de terminal Linux para aprender comandos de forma gamificada.

## 🎮 Características

- **Terminal simulada** con soporte para más de 30 comandos Linux
- **Sistema de desafíos** con puntos y pistas
- **Interfaz visual atractiva** con tema oscuro tipo terminal
- **Árbol de directorios** visual en tiempo real
- **Animaciones** con GSAP
- **Desarrollado con** Astro + React (Islands) + Tailwind CSS

## 📦 Comandos Soportados

### Archivos y Directorios
- `pwd` - Mostrar directorio actual
- `cd [dir]` - Cambiar directorio
- `ls [dir]` - Listar archivos
- `mkdir <nombre>` - Crear directorio
- `rmdir <nombre>` - Eliminar directorio vacío
- `touch <nombre>` - Crear archivo vacío
- `rm <nombre>` - Eliminar archivo
- `cp <origen> <dest>` - Copiar archivos
- `mv <origen> <dest>` - Mover/renombrar
- `cat <archivo>` - Ver contenido
- `less <archivo>` - Ver archivo (página por página)
- `chmod <modo> <archivo>` - Cambiar permisos
- `find <patrón>` - Buscar archivos
- `gzip <archivo>` - Comprimir
- `gunzip <archivo>` - Descomprimir
- `head <archivo>` - Primeras líneas
- `tail <archivo>` - Últimas líneas

### Red y Sistema
- `ip addr` - Información de interfaces
- `ifconfig` - Configuración de red
- `ping <host>` - Probar conectividad
- `traceroute <host>` - Ruta a destino
- `nslookup <domain>` - Resolución DNS
- `dig <domain>` - Consulta DNS avanzada
- `ss` - Conexiones de red
- `netstat` - Estadísticas de red
- `hostname` - Nombre del host
- `route` - Tabla de rutas
- `arp` - Tabla ARP

### Editores (Simulados)
- `nano [archivo]` - Editor nano
- `vim [archivo]` - Editor vim

### Paquetes (Simulados)
- `apt-get update` - Actualizar repositorios
- `apt-get install <pkg>` - Instalar paquete

### Otros
- `clear` - Limpiar terminal
- `help` - Ver ayuda

## 🚀 Instalación y Uso

```bash
# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev

# Construir para producción
npm run build

# Previsualizar build
npm run preview
```

Abre http://localhost:4321 en tu navegador.

## 🎯 Cómo Jugar

1. Lee el desafío mostrado en la tarjeta superior
2. Escribe el comando Linux correcto en la terminal
3. Usa el botón "Pista" si necesitas ayuda (cuesta 5 puntos)
4. Completa todos los desafíos para ganar puntos
5. Usa flechas ↑↓ para navegar por el historial de comandos

## 🏗️ Estructura del Proyecto

```
src/
├── lib/
│   └── vfs.ts              # Sistema de archivos virtual
├── components/
│   ├── Terminal.tsx        # Componente principal (React Island)
│   └── FileTree.tsx        # Árbol de directorios visual
├── data/
│   └── challenges.ts       # Definición de desafíos
├── pages/
│   └── index.astro         # Página principal
└── styles/
    └── global.css          # Estilos globales (Tailwind)
```

## 🛠️ Tecnologías

- **Astro** - Framework web estático con islands architecture
- **React** - Para componentes interactivos
- **Tailwind CSS** - Para estilos utilitarios
- **GSAP** - Para animaciones fluidas
- **TypeScript** - Tipado estático

## 📝 Notas

- El sistema de archivos es una simulación en memoria (no afecta tu sistema real)
- Los comandos de red y paquetes están simulados con respuestas predefinidas
- El progreso se pierde al recargar la página (se puede agregar localStorage para persistencia)
