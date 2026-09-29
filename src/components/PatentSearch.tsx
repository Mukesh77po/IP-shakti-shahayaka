import { useState } from 'react';
import { Search, AlertTriangle, ExternalLink, Filter, Scale, CheckCircle2, ShieldCheck, BookOpen, Layers } from 'lucide-react';
import { DEMO_PATENT_RECORDS } from '../data/portalData';
import { PatentRecord, Jurisdiction } from '../types';

export function PatentSearch() {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedJurisdiction, setSelectedJurisdiction] = useState<string>('All');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedRecord, setSelectedRecord] = useState<PatentRecord | null>(null);

  const categories = [
    'All',
    'Section 3(p) Traditional Knowledge Exclusion',
    'Section 3(e) Synergistic Combination',
    'National Biodiversity Authority (NBA) Approval',
    'Trade Marks Act, 1999 (Class 5)',
    'Designs Act, 2000 (Applicator Geometry)',
    'FSSAI Ayurveda Aahara Compliance',
    'WIPO GRATK Treaty & PCT Filing',
    'EU THMPD Directive 2004/24/EC',
    'US FDA Botanical Drug Development'
  ];

  const filteredRecords = DEMO_PATENT_RECORDS.filter((rec) => {
    const q = searchQuery.toLowerCase().trim();
    const matchesQuery = !q || (
      rec.title.toLowerCase().includes(q) ||
      rec.ingredients.toLowerCase().includes(q) ||
      rec.applicant.toLowerCase().includes(q) ||
      rec.applicationNumber.toLowerCase().includes(q) ||
      (rec.citedStatute && rec.citedStatute.toLowerCase().includes(q))
    );

    const matchesJurisdiction = selectedJurisdiction === 'All' || rec.jurisdiction === selectedJurisdiction;
    const matchesCategory = selectedCategory === 'All' || rec.category === selectedCategory;

    return matchesQuery && matchesJurisdiction && matchesCategory;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      {/* Header Banner */}
      <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 sm:p-8 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#047857] bg-emerald-50 border border-emerald-200/80 px-2.5 py-0.5 rounded-full">
              STATUTORY PATENT & PRIOR ART REPOSITORY
            </span>
            <span className="text-xs font-mono font-bold text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
              DEMO DATA
            </span>
          </div>
          <h2 className="text-2xl font-bold text-[#111827] tracking-tight mt-1">
            Patent & Regulatory Prosecution Search
          </h2>
          <p className="text-xs text-[#6B7280] mt-1 font-medium">
            Demonstration prosecution and examination records derived directly from the 14 official Ayurvedic IP, Biodiversity, and Food Safety statutes.
          </p>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white border border-[#E5E7EB] rounded-2xl p-5 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search botanical ingredients (Withania, Curcuma), applicants (CCRAS), section (3(p), NBA), or patent numbers..."
              className="w-full text-xs p-3.5 pl-4 rounded-xl border border-[#D1D5DB] focus:border-[#15803D] focus:ring-1 focus:ring-[#15803D] outline-none text-[#111827] font-medium"
            />
          </div>

          <button
            type="button"
            onClick={() => {}}
            className="bg-[#15803D] hover:bg-[#166534] text-white px-6 py-3.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-xs transition-colors shrink-0"
          >
            <Search className="w-4 h-4" />
            <span>Search Database ({filteredRecords.length})</span>
          </button>
        </div>

        {/* Filter Chips */}
        <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-stone-100 text-xs">
          <div className="flex items-center gap-1.5 text-stone-500 font-semibold">
            <Filter className="w-3.5 h-3.5" />
            <span>Jurisdiction:</span>
          </div>
          {['All', 'India', 'International'].map((j) => (
            <button
              key={j}
              onClick={() => setSelectedJurisdiction(j)}
              className={`px-3 py-1 rounded-lg font-medium transition-colors ${
                selectedJurisdiction === j
                  ? 'bg-emerald-800 text-white font-bold'
                  : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
              }`}
            >
              {j}
            </button>
          ))}

          <div className="h-4 w-px bg-stone-200 mx-1 hidden sm:block" />

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <span className="text-stone-500 font-semibold">Category:</span>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="text-xs p-1.5 rounded-lg border border-stone-200 bg-white text-stone-700 outline-none flex-1 sm:flex-none"
            >
              {categories.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Disclaimer Banner */}
      <div className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-200/90 text-xs text-amber-900 flex items-center gap-2.5">
        <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0" />
        <span>
          Every demonstration record is constructed from authoritative statutory provisions (Patents Act Section 3(p)/3(e), NBA Section 6, WIPO GRATK Treaty). These demonstrate real-world prosecution outcomes and are labelled Demo Data.
        </span>
      </div>

      {/* Results Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredRecords.map((rec) => (
          <div
            key={rec.id}
            onClick={() => setSelectedRecord(rec)}
            className="bg-white border border-[#E5E7EB] hover:border-[#15803D] rounded-2xl p-5 shadow-xs flex flex-col justify-between transition-all hover:shadow-sm cursor-pointer group"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                    DEMO DATA
                  </span>
                  <span className="text-[10px] font-mono font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    {rec.jurisdiction}
                  </span>
                </div>
                <span className="text-xs font-mono font-bold text-[#15803D]">
                  {rec.similarity}% match
                </span>
              </div>

              <h3 className="text-sm font-bold text-[#111827] leading-snug group-hover:text-[#15803D] transition-colors">
                {rec.title}
              </h3>

              <div className="text-xs text-[#4B5563] space-y-0.5">
                <div>
                  <span className="font-semibold text-stone-700">App No:</span>{' '}
                  <span className="font-mono">{rec.applicationNumber}</span>
                </div>
                <div>
                  <span className="font-semibold text-stone-700">Applicant:</span>{' '}
                  <span>{rec.applicant}</span>
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-stone-50 border border-stone-200 text-xs text-[#4B5563] leading-relaxed">
                <strong className="text-stone-800 font-semibold block mb-0.5">Examination Note:</strong>
                {rec.note}
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-stone-100 text-xs space-y-1.5">
              <div className="text-[11px] text-stone-600">
                <strong className="text-stone-900 font-semibold">Ingredients:</strong> {rec.ingredients}
              </div>
              <div className="flex items-center justify-between text-[11px] pt-1">
                <span className="font-mono text-emerald-700 font-semibold">{rec.citedStatute}</span>
                <span className="text-[#15803D] font-bold group-hover:underline">Inspect Details →</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Record Inspection Modal */}
      {selectedRecord && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4 backdrop-blur-xs animate-in fade-in-50">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-stone-200 overflow-hidden">
            <div className="p-5 border-b border-stone-200 flex items-center justify-between bg-stone-50">
              <div className="flex items-center gap-2">
                <Scale className="w-5 h-5 text-[#15803D]" />
                <span className="font-bold text-sm text-[#111827]">
                  Statutory Prosecution Detail (Demo Record)
                </span>
              </div>
              <button
                onClick={() => setSelectedRecord(null)}
                className="text-stone-400 hover:text-stone-700 text-sm font-bold px-2 py-1"
              >
                ✕
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-4 text-xs text-stone-700 flex-1">
              <div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  {selectedRecord.category}
                </span>
                <h3 className="text-base font-bold text-stone-900 mt-2">
                  {selectedRecord.title}
                </h3>
              </div>

              <div className="grid grid-cols-2 gap-3 p-3.5 rounded-xl bg-stone-50 border border-stone-200 text-xs">
                <div>
                  <span className="text-stone-500 block">Application Number:</span>
                  <span className="font-mono font-bold text-stone-900">{selectedRecord.applicationNumber}</span>
                </div>
                <div>
                  <span className="text-stone-500 block">Status:</span>
                  <span className="font-bold text-emerald-700">{selectedRecord.status}</span>
                </div>
                <div>
                  <span className="text-stone-500 block">Applicant:</span>
                  <span className="font-bold text-stone-900">{selectedRecord.applicant}</span>
                </div>
                <div>
                  <span className="text-stone-500 block">Official Gazette Source:</span>
                  <span className="font-bold text-stone-900">{selectedRecord.officialSource}</span>
                </div>
              </div>

              <div>
                <strong className="text-stone-900 font-bold block mb-1">Botanical Ingredients Covered:</strong>
                <p className="p-3 rounded-xl bg-stone-50 border border-stone-200">{selectedRecord.ingredients}</p>
              </div>

              <div>
                <strong className="text-stone-900 font-bold block mb-1">Prosecution History & Examiner Rationale:</strong>
                <p className="p-3.5 rounded-xl bg-amber-50/60 border border-amber-200/80 leading-relaxed text-stone-800">
                  {selectedRecord.note}
                </p>
              </div>

              <div>
                <strong className="text-stone-900 font-bold block mb-1">Applicable Statutory Grounding:</strong>
                <p className="p-3 rounded-xl bg-emerald-50/60 border border-emerald-200/80 leading-relaxed text-stone-800 font-mono">
                  {selectedRecord.citedStatute}
                </p>
              </div>
            </div>

            <div className="p-4 border-t border-stone-200 bg-stone-50 flex justify-end">
              <button
                onClick={() => setSelectedRecord(null)}
                className="bg-[#15803D] hover:bg-[#166534] text-white px-5 py-2 rounded-xl text-xs font-bold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
