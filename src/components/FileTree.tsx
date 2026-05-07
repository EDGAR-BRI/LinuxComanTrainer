import { useState } from 'react';
import { VirtualFS } from '../lib/vfs';

interface FileTreeProps {
  vfs: VirtualFS;
}

export default function FileTree({ vfs }: FileTreeProps) {
  const [showFullTree, setShowFullTree] = useState(false);
  const currentDir = vfs.cwd;
  const files = vfs.getFileList();

  const renderTree = (node: any, depth: number = 0): JSX.Element => {
    const isCurrentDir = node.path === vfs.cwd;
    const indent = '  '.repeat(depth);
    const icon = node.type === 'directory' ? '📁' : '📄';

    return (
      <div key={node.path} className="whitespace-nowrap">
        <span className={`${isCurrentDir ? 'text-yellow-400 font-bold' : 'text-gray-300'}`}>
          {indent}{icon} {node.name}
          {isCurrentDir && <span className="text-xs text-green-400 ml-2">(actual)</span>}
        </span>
        {node.children && (
          <div className="ml-4">
            {node.children.map((child: any) => renderTree(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="bg-gray-800 border border-gray-700 rounded-lg p-3 mb-4 text-sm">
      <div className="flex justify-between items-center mb-2">
        <span className="text-gray-400 truncate">📂 {currentDir}</span>
        <button
          onClick={() => setShowFullTree(!showFullTree)}
          className="text-xs text-blue-400 hover:text-blue-300 whitespace-nowrap ml-2"
        >
          {showFullTree ? 'Ocultar árbol' : 'Ver árbol completo'}
        </button>
      </div>

      {/* Current directory contents */}
      <div className="space-y-1 mb-2">
        {files.map((f, i) => (
          <div key={i} className="flex items-center gap-2 text-gray-300">
            <span>{f.type === 'directory' ? '📁' : '📄'}</span>
            <span className="truncate">{f.name}</span>
          </div>
        ))}
        {files.length === 0 && (
          <p className="text-gray-500 italic text-xs">Directorio vacío</p>
        )}
      </div>

      {/* Optional full tree */}
      {showFullTree && (
        <div className="mt-3 pt-3 border-t border-gray-700 overflow-x-auto">
          <div className="text-xs">
            {renderTree((vfs as any).root)}
          </div>
        </div>
      )}
    </div>
  );
}
