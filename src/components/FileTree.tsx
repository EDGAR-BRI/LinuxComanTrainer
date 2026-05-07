import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { VirtualFS } from '../lib/vfs';

interface FileTreeProps {
  vfs: VirtualFS;
}

export default function FileTree({ vfs }: FileTreeProps) {
  const treeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (treeRef.current) {
      gsap.fromTo(treeRef.current,
        { opacity: 0, x: -20 },
        { opacity: 1, x: 0, duration: 0.3 }
      );
    }
  }, [vfs.cwd]);

  const renderTree = (node: any, depth: number = 0): JSX.Element => {
    const isCurrentDir = node.path === vfs.cwd;
    const indent = '  '.repeat(depth);

    return (
      <div key={node.path}>
        <div class={`flex items-center gap-1 ${isCurrentDir ? 'text-yellow-400 font-bold' : 'text-gray-300'}`}>
          <span class="text-gray-600">{indent}</span>
          {node.type === 'directory' ? '📁' : '📄'}
          <span>{node.name}</span>
          {isCurrentDir && <span class="text-xs text-green-400 ml-2">(actual)</span>}
        </div>
        {node.children && node.children.map((child: any) => renderTree(child, depth + 1))}
      </div>
    );
  };

  const root = (vfs as any).root;

  return (
    <div ref={treeRef} class="bg-gray-800 border border-gray-700 rounded-lg p-4 mb-4 overflow-auto max-h-48">
      <h3 class="text-sm text-gray-400 mb-2 font-bold">ÁRBOL DE DIRECTORIOS</h3>
      <div class="font-mono text-sm">
        {renderTree(root)}
      </div>
    </div>
  );
}
