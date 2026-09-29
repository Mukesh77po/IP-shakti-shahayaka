import { CheckCircle2, Database, FileText, Cpu, ArrowRight, ShieldCheck, Layers, Sparkles } from 'lucide-react';

export function ArchitectureDiagram() {
  const steps = [
    {
      id: 'step-1',
      title: '1. User Request',
      subtitle: 'POST /api/ask',
      desc: 'Question, product type, jurisdiction, and target language',
      icon: FileText,
      color: 'bg-emerald-50 text-emerald-700 border-emerald-200'
    },
    {
      id: 'step-2',
      title: '2. Product Classifier',
      subtitle: '6 Statutory Classes',
      desc: 'Classical, Proprietary, Non-classical, Ayurveda-Aahar, Cosmetic, Unknown',
      icon: Layers,
      color: 'bg-blue-50 text-blue-700 border-blue-200'
    },
    {
      id: 'step-3',
      title: '3. RAG Retriever',
      subtitle: 'Jurisdiction-First',
      desc: 'Prioritizes India vs International statutory gazettes & rules',
      icon: Database,
      color: 'bg-indigo-50 text-indigo-700 border-indigo-200'
    },
    {
      id: 'step-4',
      title: '4. ChromaDB Store',
      subtitle: 'Persistent Vector KB',
      desc: 'PyPDF chunks with page, organization, statute, & official URLs',
      icon: CheckCircle2,
      color: 'bg-amber-50 text-amber-700 border-amber-200'
    },
    {
      id: 'step-5',
      title: '5. Google Gemini',
      subtitle: 'Zero Hallucination',
      desc: 'Strictly answers using retrieved text; returns standard fallback if insufficient',
      icon: Sparkles,
      color: 'bg-purple-50 text-purple-700 border-purple-200'
    },
    {
      id: 'step-6',
      title: '6. Structured Output',
      subtitle: 'Verified Citations',
      desc: 'Classification, legal reasoning, next steps, confidence & citations',
      icon: ShieldCheck,
      color: 'bg-teal-50 text-teal-700 border-teal-200'
    }
  ];

  return (
    <div className="bg-white border border-stone-200 rounded-xl p-5 shadow-xs">
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-stone-100">
        <div>
          <h3 className="text-base font-semibold text-stone-900 tracking-tight">IP-SAKTI Execution Pipeline Architecture</h3>
          <p className="text-xs text-stone-500 mt-0.5">Strict linear flow from HTTP ingress to grounded legal reasoning</p>
        </div>
        <span className="text-xs font-mono px-2.5 py-1 bg-stone-100 text-stone-700 rounded-md border border-stone-200">
          FastAPI + ChromaDB + Gemini
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3">
        {steps.map((st, idx) => {
          const IconComponent = st.icon;
          return (
            <div
              key={st.id}
              className={`p-3.5 rounded-lg border flex flex-col justify-between relative ${st.color}`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <IconComponent className="w-5 h-5 opacity-90" />
                  <span className="text-[10px] font-mono uppercase tracking-wider font-semibold opacity-75">
                    Step {idx + 1}
                  </span>
                </div>
                <div className="font-semibold text-xs text-stone-900">{st.title}</div>
                <div className="text-[11px] font-medium opacity-90 mt-0.5">{st.subtitle}</div>
                <p className="text-[11px] opacity-80 mt-1.5 leading-snug">{st.desc}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
