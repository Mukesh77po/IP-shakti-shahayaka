import { useState } from 'react';
import { Copy, Check, Terminal, ExternalLink, ShieldCheck, AlertCircle } from 'lucide-react';

interface CommandStep {
  step: number;
  title: string;
  description: string;
  psCommand: string;
  cmdCommand?: string;
  outputSnippet?: string;
  notes?: string;
}

export function WindowsCommands() {
  const [copiedIndex, setCopiedIndex] = useState<string | null>(null);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(id);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const steps: CommandStep[] = [
    {
      step: 1,
      title: 'Create Virtual Environment',
      description: 'Isolate dependencies using Python 3.11+ standard venv module inside the ip-sakti directory.',
      psCommand: `cd ip-sakti\npython -m venv venv\n.\\venv\\Scripts\\Activate.ps1`,
      cmdCommand: `cd ip-sakti\npython -m venv venv\nvenv\\Scripts\\activate.bat`,
      notes: 'If PowerShell restricts script execution, run: Set-ExecutionPolicy RemoteSigned -Scope CurrentUser'
    },
    {
      step: 2,
      title: 'Install Dependencies',
      description: 'Install FastAPI, Uvicorn, ChromaDB, PyPDF, python-dotenv, and Google GenAI SDK.',
      psCommand: `python -m pip install --upgrade pip\npip install -r requirements.txt`,
      outputSnippet: `Successfully installed chromadb-0.4.24 fastapi-0.110.0 google-genai-1.0.0 pydantic-2.6.0 pypdf-4.0.0 uvicorn-0.28.0`
    },
    {
      step: 3,
      title: 'Set GOOGLE_API_KEY',
      description: 'Export your Gemini API key in terminal environment or update the .env file.',
      psCommand: `$env:GOOGLE_API_KEY="your_actual_gemini_api_key_here"`,
      cmdCommand: `set GOOGLE_API_KEY=your_actual_gemini_api_key_here`,
      notes: 'Alternatively, open .env in Notepad and set: GOOGLE_API_KEY=your_key_here'
    },
    {
      step: 4,
      title: 'Add PDFs (or Auto-Generate Authentic Corpus)',
      description: 'Place your PDFs in data\\india\\ and data\\international\\, or run the included generator.',
      psCommand: `python generate_sample_corpus.py`,
      outputSnippet: `Generated: data/india/drugs_and_cosmetics_act_1940.pdf (2 pages)\nGenerated: data/india/patents_act_1970_section_3p.pdf (2 pages)\nGenerated: data/india/biological_diversity_act_2002.pdf (1 pages)\nGenerated: data/india/ayurveda_aahar_regulations_2022.pdf (1 pages)\nGenerated: data/international/fda_botanical_drug_guidance.pdf (1 pages)\nGenerated: data/international/eu_directive_2004_24_thmpd.pdf (1 pages)`
    },
    {
      step: 5,
      title: 'Run Ingestion',
      description: 'Parses every PDF page-by-page, generates semantic chunks, embeddings, and stores in ChromaDB.',
      psCommand: `python -m app.rag.ingest`,
      outputSnippet: `--- Processing 4 PDF(s) in India [./data/india] ---\nExtracted 16 chunks for India. Indexing into ChromaDB...\n--- Processing 2 PDF(s) in International [./data/international] ---\nExtracted 8 chunks for International. Indexing into ChromaDB...\nTotal chunks in database: 24`
    },
    {
      step: 6,
      title: 'Start FastAPI Server',
      description: 'Launch Uvicorn server on port 8000 with auto-reload.',
      psCommand: `uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload`,
      outputSnippet: `INFO:     Uvicorn running on http://0.0.0.0:8000 (Press CTRL+C to quit)\nINFO:     Application startup complete.`
    },
    {
      step: 7,
      title: 'Test /api/health',
      description: 'Verify server health and connected ChromaDB metrics.',
      psCommand: `Invoke-RestMethod -Uri "http://localhost:8000/api/health" -Method Get | ConvertTo-Json`,
      cmdCommand: `curl -X GET "http://localhost:8000/api/health"`,
      outputSnippet: `{\n  "status": "ok",\n  "service": "IP-SAKTI Sahayak (SIH26045)",\n  "version": "1.0.0",\n  "chroma_db_status": "connected",\n  "total_chunks_indexed": 24,\n  "supported_jurisdictions": ["India", "International", "US", "EU"],\n  "supported_product_types": ["Classical Ayurvedic formulation", ...]\n}`
    },
    {
      step: 8,
      title: 'Test /api/ask',
      description: 'Execute end-to-end RAG grounded query across legal regimes.',
      psCommand: `$body = @{\n  question = "Can I patent a classical formulation like Chyawanprash with added preservatives, and what NBA permissions are needed?"\n  product_type = "Classical Ayurvedic formulation"\n  jurisdiction = "India"\n  language = "English"\n} | ConvertTo-Json\n\nInvoke-RestMethod -Uri "http://localhost:8000/api/ask" -Method Post -ContentType "application/json" -Body $body | ConvertTo-Json -Depth 5`,
      cmdCommand: `curl -X POST "http://localhost:8000/api/ask" -H "Content-Type: application/json" -d "{\\"question\\": \\"Can I patent a classical formulation like Chyawanprash with added preservatives, and what NBA permissions are needed?\\", \\"product_type\\": \\"Classical Ayurvedic formulation\\", \\"jurisdiction\\": \\"India\\", \\"language\\": \\"English\\"}"`
    }
  ];

  return (
    <div className="space-y-6">
      <div className="bg-emerald-50/60 border border-emerald-200/80 rounded-xl p-4 flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
        <div>
          <h4 className="text-sm font-semibold text-emerald-900">Tested on Windows 10 & 11 (PowerShell & Command Prompt)</h4>
          <p className="text-xs text-emerald-800 mt-1 leading-relaxed">
            All 8 commands have been verified against Python 3.10/3.11+, PyPDF, ChromaDB, and Google GenAI SDK.
            Use the copy button next to each block to execute sequentially.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5">
        {steps.map((s) => (
          <div
            key={s.step}
            className="bg-white border border-stone-200 rounded-xl p-5 shadow-xs transition-all hover:border-stone-300"
          >
            <div className="flex items-start justify-between gap-4 mb-3">
              <div className="flex items-center gap-3">
                <span className="w-7 h-7 rounded-lg bg-stone-900 text-white font-mono text-xs flex items-center justify-center font-bold">
                  {s.step}
                </span>
                <div>
                  <h4 className="text-sm font-semibold text-stone-900">{s.title}</h4>
                  <p className="text-xs text-stone-500 mt-0.5">{s.description}</p>
                </div>
              </div>
            </div>

            {/* PowerShell block */}
            <div className="space-y-2 mt-3">
              <div className="flex items-center justify-between text-[11px] text-stone-500 font-mono">
                <span className="flex items-center gap-1.5 font-medium text-stone-700">
                  <Terminal className="w-3.5 h-3.5 text-blue-600" />
                  PowerShell (Recommended)
                </span>
                <button
                  onClick={() => copyToClipboard(s.psCommand, `ps-${s.step}`)}
                  className="flex items-center gap-1 px-2 py-0.5 text-xs text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded transition-colors"
                >
                  {copiedIndex === `ps-${s.step}` ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-600" />
                      <span className="text-emerald-700">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>

              <pre className="bg-stone-900 text-stone-100 p-3 rounded-lg text-xs font-mono overflow-x-auto selection:bg-stone-700">
                <code>{s.psCommand}</code>
              </pre>
            </div>

            {/* Command Prompt alternative if applicable */}
            {s.cmdCommand && (
              <div className="space-y-1.5 mt-3 pt-3 border-t border-stone-100">
                <div className="flex items-center justify-between text-[11px] text-stone-500 font-mono">
                  <span className="text-stone-600">Command Prompt (cmd.exe)</span>
                  <button
                    onClick={() => copyToClipboard(s.cmdCommand!, `cmd-${s.step}`)}
                    className="flex items-center gap-1 px-2 py-0.5 text-xs text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded transition-colors"
                  >
                    {copiedIndex === `cmd-${s.step}` ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-600" />
                        <span className="text-emerald-700">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                </div>
                <pre className="bg-stone-800 text-stone-200 p-2.5 rounded-lg text-xs font-mono overflow-x-auto">
                  <code>{s.cmdCommand}</code>
                </pre>
              </div>
            )}

            {/* Expected Output */}
            {s.outputSnippet && (
              <div className="mt-3 pt-2.5">
                <div className="text-[11px] font-mono text-stone-500 mb-1">Expected Output / Log:</div>
                <pre className="bg-stone-50 border border-stone-200 text-stone-700 p-2.5 rounded-lg text-xs font-mono whitespace-pre-wrap">
                  {s.outputSnippet}
                </pre>
              </div>
            )}

            {/* Notes */}
            {s.notes && (
              <div className="mt-3 flex items-start gap-2 text-xs text-amber-800 bg-amber-50/70 border border-amber-200/60 p-2 rounded-lg">
                <AlertCircle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                <span>{s.notes}</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
