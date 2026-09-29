import { useState, useRef, useEffect } from 'react';
import { ActiveTab, Jurisdiction, AppLanguage } from '../types';
import { Sparkles, Globe, ChevronDown, Check, PlusCircle, ShieldCheck } from 'lucide-react';

interface NavbarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  onStartAssessment: () => void;
  jurisdiction: Jurisdiction;
  setJurisdiction: (j: Jurisdiction) => void;
  language: AppLanguage;
  setLanguage: (l: AppLanguage) => void;
}

export function Navbar({
  activeTab,
  setActiveTab,
  onStartAssessment,
  jurisdiction,
  setJurisdiction,
  language,
  setLanguage
}: NavbarProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const languageLabels: Record<AppLanguage, string> = {
    en: 'English',
    hi: 'हिंदी (Hindi)',
    kn: 'ಕನ್ನಡ (Kannada)'
  };

  const jurisdictionLabels: Record<Jurisdiction, { label: string; flag: string }> = {
    India: { label: 'India', flag: '🇮🇳' },
    International: { label: 'International', flag: '🌐' },
    Both: { label: 'India & Global', flag: '🌍' }
  };

  return (
    <header className="bg-white border-b border-[#E5E7EB] sticky top-0 z-40 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18">
          {/* Brand Logo & Title */}
          <div
            onClick={() => setActiveTab('home')}
            className="flex items-center gap-3 cursor-pointer select-none group"
            id="brand-header-link"
          >
            {/* Bespoke Modern Leaf & Shield Vector Emblem */}
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#064E3B] to-[#047857] text-white flex items-center justify-center shadow-xs transition-all group-hover:scale-105 border border-emerald-700/40">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-5 h-5 text-emerald-200"
              >
                <path d="M12 2a10 10 0 0 1 10 10c0 5.523-4.477 10-10 10S2 17.523 2 12a10 10 0 0 1 10-10z" strokeOpacity="0.3" />
                <path d="M12 2C6.5 6 4 11 4 16c0 3.314 2.686 6 6 6s6-2.686 6-6c0-5-2.5-10-8-14z" fill="currentColor" fillOpacity="0.25" />
                <path d="M12 7v10" />
                <path d="M12 12l4-3" />
                <path d="M12 14l-3-2" />
              </svg>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-extrabold tracking-tight text-[#0F2922]">
                  IP-SAKTI
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded-full border border-emerald-200 font-mono">
                  Sahayak
                </span>
              </div>
              <p className="text-[11px] text-[#6B7280] font-medium hidden sm:block">
                Ayurvedic Intellectual Property & Regulatory Intelligence
              </p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-1">
            <button
              id="nav-tab-assessment"
              onClick={() => setActiveTab('assessment')}
              className={`px-3 py-2 text-xs font-semibold rounded-lg transition-colors ${
                activeTab === 'assessment'
                  ? 'text-[#15803D] bg-green-50 font-bold'
                  : 'text-[#4B5563] hover:text-[#111827] hover:bg-stone-50'
              }`}
            >
              Product Assessment
            </button>

            <button
              id="nav-tab-ask"
              onClick={() => setActiveTab('ask')}
              className={`px-3 py-2 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 ${
                activeTab === 'ask'
                  ? 'text-[#15803D] bg-green-50 font-bold'
                  : 'text-[#4B5563] hover:text-[#111827] hover:bg-stone-50'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span>Ask AI</span>
            </button>

            <button
              id="nav-tab-patents"
              onClick={() => setActiveTab('patents')}
              className={`px-3 py-2 text-xs font-semibold rounded-lg transition-colors ${
                activeTab === 'patents'
                  ? 'text-[#15803D] bg-green-50 font-bold'
                  : 'text-[#4B5563] hover:text-[#111827] hover:bg-stone-50'
              }`}
            >
              Patent Search
            </button>

            <button
              id="nav-tab-cost"
              onClick={() => setActiveTab('cost')}
              className={`px-3 py-2 text-xs font-semibold rounded-lg transition-colors ${
                activeTab === 'cost'
                  ? 'text-[#15803D] bg-green-50 font-bold'
                  : 'text-[#4B5563] hover:text-[#111827] hover:bg-stone-50'
              }`}
            >
              Cost Estimator
            </button>

            <button
              id="nav-tab-knowledge"
              onClick={() => setActiveTab('knowledge')}
              className={`px-3 py-2 text-xs font-semibold rounded-lg transition-colors ${
                activeTab === 'knowledge'
                  ? 'text-[#15803D] bg-green-50 font-bold'
                  : 'text-[#4B5563] hover:text-[#111827] hover:bg-stone-50'
              }`}
            >
              Regulations
            </button>
          </nav>

          {/* Right Action & Active Settings Indicator Button */}
          <div className="flex items-center gap-2.5">
            {/* Quick Start Assessment */}
            <button
              id="cta-start-assessment-nav"
              onClick={onStartAssessment}
              className="bg-[#15803D] hover:bg-[#166534] text-white px-3.5 py-2 rounded-xl text-xs font-bold transition-all shadow-xs hover:shadow-sm flex items-center gap-1.5"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Start Assessment</span>
              <span className="sm:hidden">Assess</span>
            </button>

            {/* UPPERMOST RIGHT BUTTON: Jurisdiction & Language Switcher */}
            <div className="relative" ref={dropdownRef}>
              <button
                id="jurisdiction-language-switcher-btn"
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2 px-3 py-2 rounded-xl border border-[#D1D5DB] bg-white hover:bg-stone-50 text-xs font-medium text-[#374151] shadow-2xs transition-all hover:border-stone-400"
                title="Change Target Jurisdiction & Application Language"
              >
                <span className="text-sm">{jurisdictionLabels[jurisdiction].flag}</span>
                <span className="font-bold text-[#111827]">
                  {jurisdictionLabels[jurisdiction].label}
                </span>
                <span className="text-[#9CA3AF]">|</span>
                <span className="font-semibold text-[#047857]">
                  {language.toUpperCase()}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-[#6B7280]" />
              </button>

              {/* Dropdown Menu */}
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-xl border border-stone-200 p-4 z-50 animate-in fade-in-50 duration-150 space-y-4">
                  <div>
                    <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#6B7280]">
                      Target Jurisdiction
                    </span>
                    <div className="grid grid-cols-1 gap-1.5 mt-2">
                      {(['India', 'International', 'Both'] as Jurisdiction[]).map((j) => (
                        <button
                          key={j}
                          onClick={() => {
                            setJurisdiction(j);
                          }}
                          className={`w-full flex items-center justify-between p-2 rounded-xl text-xs font-medium transition-colors ${
                            jurisdiction === j
                              ? 'bg-emerald-50 text-[#15803D] font-bold border border-emerald-200'
                              : 'hover:bg-stone-50 text-[#374151]'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <span className="text-base">{jurisdictionLabels[j].flag}</span>
                            <span>{jurisdictionLabels[j].label}</span>
                          </div>
                          {jurisdiction === j && <Check className="w-3.5 h-3.5 text-[#15803D]" />}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-stone-100">
                    <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#6B7280]">
                      Application Language
                    </span>
                    <div className="grid grid-cols-1 gap-1.5 mt-2">
                      {([
                        { id: 'en', label: 'English', native: 'English' },
                        { id: 'hi', label: 'Hindi', native: 'हिंदी' },
                        { id: 'kn', label: 'Kannada', native: 'ಕನ್ನಡ' }
                      ] as const).map((l) => (
                        <button
                          key={l.id}
                          onClick={() => {
                            setLanguage(l.id as AppLanguage);
                          }}
                          className={`w-full flex items-center justify-between p-2 rounded-xl text-xs font-medium transition-colors ${
                            language === l.id
                              ? 'bg-emerald-50 text-[#15803D] font-bold border border-emerald-200'
                              : 'hover:bg-stone-50 text-[#374151]'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <span className="font-semibold">{l.native}</span>
                            <span className="text-[11px] text-stone-400">({l.label})</span>
                          </div>
                          {language === l.id && <Check className="w-3.5 h-3.5 text-[#15803D]" />}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Navigation Sub-bar */}
        <div className="lg:hidden flex overflow-x-auto py-2.5 border-t border-[#F3F4F6] space-x-1.5">
          <button
            onClick={() => setActiveTab('assessment')}
            className={`whitespace-nowrap px-3 py-1.5 text-xs rounded-lg ${
              activeTab === 'assessment' ? 'bg-green-50 text-[#15803D] font-bold' : 'text-gray-600'
            }`}
          >
            Assessment
          </button>
          <button
            onClick={() => setActiveTab('ask')}
            className={`whitespace-nowrap px-3 py-1.5 text-xs rounded-lg ${
              activeTab === 'ask' ? 'bg-green-50 text-[#15803D] font-bold' : 'text-gray-600'
            }`}
          >
            Ask AI
          </button>
          <button
            onClick={() => setActiveTab('patents')}
            className={`whitespace-nowrap px-3 py-1.5 text-xs rounded-lg ${
              activeTab === 'patents' ? 'bg-green-50 text-[#15803D] font-bold' : 'text-gray-600'
            }`}
          >
            Patents
          </button>
          <button
            onClick={() => setActiveTab('cost')}
            className={`whitespace-nowrap px-3 py-1.5 text-xs rounded-lg ${
              activeTab === 'cost' ? 'bg-green-50 text-[#15803D] font-bold' : 'text-gray-600'
            }`}
          >
            Fees
          </button>
          <button
            onClick={() => setActiveTab('knowledge')}
            className={`whitespace-nowrap px-3 py-1.5 text-xs rounded-lg ${
              activeTab === 'knowledge' ? 'bg-green-50 text-[#15803D] font-bold' : 'text-gray-600'
            }`}
          >
            Regulations
          </button>
        </div>
      </div>
    </header>
  );
}
