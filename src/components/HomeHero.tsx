import { ArrowRight, ShieldCheck, Search, Calculator, BookOpen, Layers, Sparkles, Scale, CheckCircle2, Globe, FileText } from 'lucide-react';
import { ActiveTab, Jurisdiction, AppLanguage } from '../types';

interface HomeHeroProps {
  onStartAssessment: () => void;
  setActiveTab: (tab: ActiveTab) => void;
  jurisdiction: Jurisdiction;
  language: AppLanguage;
}

export function HomeHero({ onStartAssessment, setActiveTab, jurisdiction, language }: HomeHeroProps) {
  const pillars = [
    {
      id: 'pillar-1',
      title: 'Patent & Traditional Knowledge',
      desc: 'Screen formulations against Section 3(p) TKDL prohibitions, Section 3(e) synergistic combinations, and biological source disclosure rules.',
      icon: Scale,
      tab: 'assessment' as ActiveTab,
      tag: 'Patents Act, 1970'
    },
    {
      id: 'pillar-2',
      title: 'Biological Diversity & ABS',
      desc: 'Verify NBA Form III prior statutory approval requirements under Section 6 and evaluate Access & Benefit Sharing obligations.',
      icon: ShieldCheck,
      tab: 'assessment' as ActiveTab,
      tag: 'BD Act 2002 & 2023'
    },
    {
      id: 'pillar-3',
      title: 'Trade Marks & Design IP',
      desc: 'Overcome Section 9(1)(b) descriptive generic botanical refusals and protect novel applicator nozzles under the Designs Act, 2000.',
      icon: Layers,
      tab: 'patents' as ActiveTab,
      tag: 'TM Act 1999 & Designs'
    },
    {
      id: 'pillar-4',
      title: 'FSSAI Ayurveda Aahara',
      desc: 'Check Schedule A classical compendia compliance, heavy metal safety limits, wellness-only packaging claims, and mandatory logo rules.',
      icon: BookOpen,
      tab: 'knowledge' as ActiveTab,
      tag: 'FSSAI Reg. 2022'
    },
    {
      id: 'pillar-5',
      title: 'Official Statutory Fees',
      desc: 'Calculate exact government filing fees across Patents, Trade Marks, Designs, and NBA without speculative numbers.',
      icon: Calculator,
      tab: 'cost' as ActiveTab,
      tag: 'Official Fee Schedule'
    },
    {
      id: 'pillar-6',
      title: 'Dedicated Gemini AI Assistant',
      desc: 'Ask free-form legal, regulatory, and patent prosecution questions grounded in verified statutory texts with instant citations.',
      icon: Sparkles,
      tab: 'ask' as ActiveTab,
      tag: 'Multilingual RAG'
    }
  ];

  return (
    <div className="space-y-12 pb-12">
      {/* Modern Main Hero Card */}
      <section className="bg-white border border-[#E5E7EB] rounded-3xl p-8 sm:p-12 shadow-xs relative overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-8 space-y-5">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#047857] bg-emerald-50 border border-emerald-200/90 px-3 py-1 rounded-full font-mono">
                AYURVEDIC INTELLECTUAL PROPERTY & REGULATORY NAVIGATOR
              </span>
              <span className="text-xs text-[#6B7280] font-medium hidden sm:inline">
                • 14 Gazette Frameworks
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#0D2821] tracking-tight leading-[1.15]">
              Accelerate Ayurvedic Innovation. Secure Patents & Stay Compliant.
            </h1>

            <p className="text-sm sm:text-base text-[#4B5563] leading-relaxed max-w-3xl">
              An authoritative platform for Ayurvedic researchers, startups, and manufacturers. Evaluate patentability exclusions under Section 3(p) and TKDL prior art, fulfill National Biodiversity Authority (NBA) requirements, align with FSSAI Ayurveda Aahara standards, and estimate official government fees with statutory certainty.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-3">
              <button
                id="hero-start-assessment-btn"
                onClick={onStartAssessment}
                className="bg-[#15803D] hover:bg-[#166534] text-white px-6 py-3.5 rounded-xl text-sm font-bold flex items-center gap-2 shadow-xs transition-all hover:gap-3"
              >
                <span>Start Product Assessment</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => setActiveTab('ask')}
                className="bg-white hover:bg-stone-50 text-[#1F2937] border border-[#D1D5DB] px-5 py-3.5 rounded-xl text-sm font-semibold transition-colors flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4 text-emerald-600" />
                <span>Ask AI Intelligence</span>
              </button>

              <button
                onClick={() => setActiveTab('patents')}
                className="text-xs font-semibold text-[#047857] hover:text-[#064E3B] px-3 py-2 transition-colors"
              >
                View Patent Database →
              </button>
            </div>
          </div>

          {/* Right Column: Executive Regulatory Health & Framework Summary */}
          <div className="lg:col-span-4 bg-[#F8FAF8] border border-emerald-900/10 rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-stone-200/80 pb-3">
              <span className="text-xs font-mono font-bold tracking-wider text-[#064E3B] uppercase">
                Active Assessment Mode
              </span>
              <span className="flex items-center gap-1.5 text-xs font-semibold text-[#15803D]">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>Active</span>
              </span>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-[#6B7280]">Target Regime:</span>
                <span className="font-bold text-[#111827]">{jurisdiction} Framework</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-[#6B7280]">Language Mode:</span>
                <span className="font-bold text-[#111827]">
                  {language === 'hi' ? 'हिंदी (Hindi)' : language === 'kn' ? 'ಕನ್ನಡ (Kannada)' : 'English'}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-[#6B7280]">Statutory Datasets:</span>
                <span className="font-mono font-bold text-[#047857]">14 Ingested Gazette Laws</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-[#6B7280]">Classical References:</span>
                <span className="font-mono font-bold text-[#111827]">54 First Schedule Compendia</span>
              </div>
            </div>

            <div className="pt-3 border-t border-stone-200/80">
              <p className="text-[11px] text-[#6B7280] leading-snug">
                Step 1 of the assessment configures jurisdiction and language, followed by a clean typing form for your custom formulation.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Core Regulatory & IP Pillars */}
      <section className="space-y-6">
        <div>
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#6B7280]">
            INTEGRATED COMPLIANCE MODULES
          </span>
          <h2 className="text-2xl font-bold text-[#111827] tracking-tight mt-1">
            End-to-End Ayurvedic IP Lifecycle
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {pillars.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.id}
                onClick={() => setActiveTab(item.tab)}
                className="bg-white border border-[#E5E7EB] hover:border-[#15803D] rounded-2xl p-6 shadow-xs transition-all hover:shadow-sm cursor-pointer group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3.5">
                    <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#15803D] flex items-center justify-center group-hover:scale-105 transition-transform border border-emerald-100">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-mono font-semibold text-[#047857] bg-emerald-50/80 px-2 py-0.5 rounded border border-emerald-200/60">
                      {item.tag}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-[#111827] group-hover:text-[#15803D] transition-colors">
                    {item.title}
                  </h3>

                  <p className="text-xs text-[#6B7280] mt-2 leading-relaxed">
                    {item.desc}
                  </p>
                </div>

                <div className="mt-5 pt-3 border-t border-stone-100 flex items-center justify-between text-xs font-semibold text-[#15803D]">
                  <span>Explore Module</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Verified Statutory Corpus Section */}
      <section className="bg-white border border-[#E5E7EB] rounded-2xl p-6 sm:p-8 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#6B7280]">
              OFFICIAL STATUTORY SOURCES
            </span>
            <h3 className="text-lg font-bold text-[#111827] mt-0.5">
              Governed by Authoritative Government & International Treaties
            </h3>
          </div>
          <button
            onClick={() => setActiveTab('knowledge')}
            className="text-xs font-bold text-[#15803D] hover:underline"
          >
            Open Legal Corpus & Gazette Reader →
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 pt-2">
          {[
            { name: 'Patents Act 1970', entity: 'IP India' },
            { name: 'BD Act 2023', entity: 'NBA India' },
            { name: 'TM Act 1999', entity: 'TM Registry' },
            { name: 'Ayurveda Aahara', entity: 'FSSAI' },
            { name: 'D&C Act 1940', entity: 'Min of Ayush' },
            { name: 'GRATK Treaty', entity: 'WIPO (2024)' },
            { name: 'THMPD 2004/24', entity: 'EMA (Europe)' }
          ].map((item, idx) => (
            <div key={idx} className="bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl p-3 text-center">
              <span className="text-xs font-bold text-[#111827] block truncate">{item.name}</span>
              <span className="text-[11px] text-[#6B7280] font-medium mt-0.5 block">{item.entity}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
