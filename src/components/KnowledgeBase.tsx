import { useState } from 'react';
import { BookOpen, ExternalLink, Search, ShieldCheck, Scale, CheckCircle2, ChevronDown, ChevronUp } from 'lucide-react';
import { LEGAL_CORPUS, TKDL_CASES } from '../data/portalData';
import { LegalStatute } from '../types';

export function KnowledgeBase() {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedStatute, setSelectedStatute] = useState<string | null>(null);

  const filteredStatutes = LEGAL_CORPUS.filter((statute) => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      statute.title.toLowerCase().includes(q) ||
      statute.sections.toLowerCase().includes(q) ||
      statute.authority.toLowerCase().includes(q) ||
      statute.summary.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-16">
      {/* Header Banner */}
      <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 sm:p-8 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#047857] bg-emerald-50 border border-emerald-200/80 px-2.5 py-0.5 rounded-full">
              STATUTORY LEGAL CORPUS & GAZETTE REPOSITORY
            </span>
            <span className="text-xs text-stone-500 font-medium">
              14 Official Frameworks
            </span>
          </div>
          <h2 className="text-2xl font-bold text-[#111827] tracking-tight mt-1">
            Ayurvedic Regulations & Legal Corpus
          </h2>
          <p className="text-xs text-[#6B7280] mt-1 font-medium max-w-3xl">
            Authoritative statutory texts governing Patents, Biodiversity, Trade Marks, Ayurveda Aahara, and International Treaties. All external links point to verified official government portals.
          </p>
        </div>

        <div className="relative w-full sm:w-72">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search statute, section (3(p)), or authority..."
            className="w-full text-xs p-3 pl-9 rounded-xl border border-[#D1D5DB] focus:border-[#15803D] focus:ring-1 focus:ring-[#15803D] outline-none text-[#111827]"
          />
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-3.5" />
        </div>
      </div>

      {/* Grid of Verified Statutes */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredStatutes.map((statute) => {
          const isExpanded = selectedStatute === statute.id;
          return (
            <div
              key={statute.id}
              className="bg-white border border-[#E5E7EB] hover:border-[#15803D] rounded-2xl p-6 shadow-xs flex flex-col justify-between transition-all hover:shadow-sm"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#047857] bg-emerald-50 px-2.5 py-0.5 rounded border border-emerald-200">
                    {statute.badge}
                  </span>
                  <span className="text-[10px] text-stone-400 font-mono">
                    {statute.lastVerified}
                  </span>
                </div>

                <h3 className="text-base font-bold text-[#111827] leading-snug">
                  {statute.title}
                </h3>

                <div className="text-xs text-[#4B5563] space-y-1">
                  <div>
                    <span className="font-semibold text-stone-700">Authority:</span>{' '}
                    <span>{statute.authority}</span>
                  </div>
                  <div>
                    <span className="font-semibold text-stone-700">Key Sections:</span>{' '}
                    <span className="font-mono text-emerald-800 font-semibold">{statute.sections}</span>
                  </div>
                </div>

                <p className="text-xs text-[#4B5563] leading-relaxed pt-1">
                  {statute.summary}
                </p>

                {/* Expanded Key Provisions inside App */}
                {isExpanded && statute.keyProvisions && (
                  <div className="pt-3 border-t border-stone-100 space-y-2 animate-in fade-in-50">
                    <span className="text-[11px] font-bold text-stone-900 block">
                      Core Statutory Provisions:
                    </span>
                    <ul className="space-y-1.5 text-[11px] text-stone-600">
                      {statute.keyProvisions.map((prov, idx) => (
                        <li key={idx} className="flex items-start gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#15803D] shrink-0 mt-0.5" />
                          <span>{prov}</span>
                        </li>
                      ))}
                    </ul>
                    {statute.gazetteReference && (
                      <div className="text-[10px] font-mono text-stone-500 pt-1">
                        Gazette Ref: {statute.gazetteReference}
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="mt-5 pt-3 border-t border-stone-100 flex items-center justify-between text-xs">
                {statute.keyProvisions ? (
                  <button
                    onClick={() => setSelectedStatute(isExpanded ? null : statute.id)}
                    className="font-semibold text-stone-700 hover:text-[#15803D] flex items-center gap-1"
                  >
                    <span>{isExpanded ? 'Hide Provisions' : 'Read Key Provisions'}</span>
                    {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                  </button>
                ) : (
                  <div />
                )}

                {/* Working Official Government Website Link */}
                <a
                  href={statute.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-bold text-[#15803D] hover:text-[#166534] flex items-center gap-1 hover:underline"
                  title={`Open official portal: ${statute.link}`}
                >
                  <span>Official Website</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          );
        })}
      </div>

      {/* Classical TKDL Cases & Rulings Section */}
      <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 sm:p-8 shadow-xs space-y-6">
        <div className="border-b border-stone-100 pb-4">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#6B7280]">
            TRADITIONAL KNOWLEDGE DIGITAL LIBRARY (TKDL) PRECEDENTS
          </span>
          <h3 className="text-xl font-bold text-[#111827] mt-1">
            Landmark Traditional Knowledge Revocation Cases
          </h3>
          <p className="text-xs text-[#6B7280] mt-1">
            Official cases where the TKDL successfully opposed or caused revocation of patents attempting to monopolize known Ayurvedic preparations.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {TKDL_CASES.map((item) => (
            <div
              key={item.id}
              className="p-4 rounded-xl border border-stone-200 bg-stone-50/50 flex flex-col justify-between space-y-3"
            >
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-mono font-bold text-stone-900">{item.caseNumber}</span>
                  <span className="text-[10px] font-mono text-emerald-800 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                    {item.jurisdiction}
                  </span>
                </div>
                <div className="text-xs font-semibold text-stone-800">
                  {item.ingredients}
                </div>
                <p className="text-[11px] text-stone-600 leading-snug">
                  {item.ruling}
                </p>
              </div>

              <div className="pt-2 border-t border-stone-200/60 flex items-center justify-between text-xs">
                <span className="text-[11px] font-mono text-stone-500">Confidence: {item.confidence}%</span>
                <a
                  href={item.officialLink || 'https://ipindia.gov.in'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-bold text-[#15803D] hover:underline flex items-center gap-1"
                >
                  <span>Verify</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
