import { useState } from 'react';
import { PROJECT_FILES } from '../data/projectFiles';
import { FileCode, Copy, Check, Folder, FileText } from 'lucide-react';

export function CodeExplorer() {
  const [selectedFile, setSelectedFile] = useState(PROJECT_FILES[0]);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(selectedFile.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-white border border-stone-200 rounded-xl overflow-hidden shadow-xs grid grid-cols-1 md:grid-cols-12 min-h-[580px]">
      {/* File Tree Sidebar */}
      <div className="md:col-span-4 border-r border-stone-200 bg-stone-50/60 p-4 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-3 pb-2 border-b border-stone-200/80">
            <span className="text-xs font-mono font-semibold uppercase tracking-wider text-stone-600 flex items-center gap-1.5">
              <Folder className="w-3.5 h-3.5 text-amber-600" />
              ip-sakti/ tree
            </span>
            <span className="text-[10px] font-mono text-stone-400">{PROJECT_FILES.length} files</span>
          </div>

          <div className="space-y-1">
            {PROJECT_FILES.map((f) => {
              const isSelected = selectedFile.path === f.path;
              return (
                <button
                  key={f.path}
                  onClick={() => setSelectedFile(f)}
                  className={`w-full text-left px-2.5 py-2 rounded-lg text-xs font-mono transition-all flex items-center justify-between ${
                    isSelected
                      ? 'bg-stone-900 text-white font-medium shadow-2xs'
                      : 'text-stone-700 hover:bg-stone-200/60'
                  }`}
                >
                  <span className="flex items-center gap-2 truncate">
                    <FileCode className={`w-3.5 h-3.5 shrink-0 ${isSelected ? 'text-amber-300' : 'text-stone-400'}`} />
                    <span className="truncate">{f.path.replace('ip-sakti/', '')}</span>
                  </span>
                  <span
                    className={`text-[9px] uppercase px-1.5 py-0.5 rounded font-bold shrink-0 ${
                      isSelected ? 'bg-stone-800 text-stone-300' : 'bg-stone-200/70 text-stone-500'
                    }`}
                  >
                    {f.category}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-stone-200 text-[11px] text-stone-500 leading-normal">
          <p>All files are deployed in the local workspace directory <code className="font-mono bg-stone-200/70 px-1 py-0.5 rounded text-stone-800">./ip-sakti/</code>.</p>
        </div>
      </div>

      {/* Code Viewer Panel */}
      <div className="md:col-span-8 flex flex-col bg-stone-950 text-stone-200">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-stone-800 bg-stone-900/90">
          <div>
            <div className="text-xs font-mono text-stone-200 font-semibold">{selectedFile.path}</div>
            <div className="text-[11px] text-stone-400 mt-0.5">{selectedFile.description}</div>
          </div>
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-mono rounded-md transition-colors"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy File</span>
              </>
            )}
          </button>
        </div>

        {/* Code Content */}
        <pre className="p-4 text-xs font-mono leading-relaxed overflow-x-auto overflow-y-auto flex-1 max-h-[580px] text-stone-300 selection:bg-stone-700">
          <code>{selectedFile.content}</code>
        </pre>
      </div>
    </div>
  );
}
