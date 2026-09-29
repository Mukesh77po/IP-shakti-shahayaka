import { useState } from 'react';
import { ActiveTab, Jurisdiction, AppLanguage } from './types';
import { Navbar } from './components/Navbar';
import { HomeHero } from './components/HomeHero';
import { ProductAssessment } from './components/ProductAssessment';
import { PatentSearch } from './components/PatentSearch';
import { CostEstimator } from './components/CostEstimator';
import { KnowledgeBase } from './components/KnowledgeBase';
import { AskAI } from './components/AskAI';
import { ExternalLink, ShieldCheck } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('home');
  const [askContext, setAskContext] = useState<string>('');
  const [jurisdiction, setJurisdiction] = useState<Jurisdiction>('India');
  const [language, setLanguage] = useState<AppLanguage>('en');

  const handleStartAssessment = () => {
    setActiveTab('assessment');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAskAboutAssessment = (context: string) => {
    setAskContext(context);
    setActiveTab('ask');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#F8FAF8] text-[#111827] flex flex-col justify-between selection:bg-[#15803D] selection:text-white font-sans antialiased">
      {/* Top Navbar */}
      <div>
        <Navbar
          activeTab={activeTab}
          setActiveTab={(tab) => {
            setActiveTab(tab);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onStartAssessment={handleStartAssessment}
          jurisdiction={jurisdiction}
          setJurisdiction={setJurisdiction}
          language={language}
          setLanguage={setLanguage}
        />

        {/* Main Content View */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-16">
          {activeTab === 'home' && (
            <HomeHero
              onStartAssessment={handleStartAssessment}
              setActiveTab={(tab) => {
                setActiveTab(tab);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              jurisdiction={jurisdiction}
              language={language}
            />
          )}

          {activeTab === 'assessment' && (
            <ProductAssessment
              onAskAboutAssessment={handleAskAboutAssessment}
              setActiveTab={setActiveTab}
              jurisdiction={jurisdiction}
              setJurisdiction={setJurisdiction}
              language={language}
              setLanguage={setLanguage}
            />
          )}

          {activeTab === 'patents' && <PatentSearch />}

          {activeTab === 'cost' && <CostEstimator />}

          {activeTab === 'knowledge' && <KnowledgeBase />}

          {activeTab === 'ask' && (
            <AskAI
              initialQuestion="Can I patent an Ayurvedic herbal formulation?"
              assessmentContext={askContext}
              jurisdiction={jurisdiction}
              setJurisdiction={setJurisdiction}
              language={language}
              setLanguage={setLanguage}
            />
          )}
        </main>
      </div>

      {/* Clean, Professional Production Footer */}
      <footer className="bg-white border-t border-[#E5E7EB] py-6 text-xs text-[#6B7280]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            {/* Vector leaf icon */}
            <div className="w-5 h-5 rounded-md bg-emerald-700 text-white flex items-center justify-center font-bold text-[10px]">
              IP
            </div>
            <span className="font-extrabold text-[#0D2821] tracking-tight">
              IP-SAKTI Sahayak
            </span>
            <span>&bull;</span>
            <span className="text-[#4B5563]">Ayurvedic Intellectual Property & Regulatory Compliance Platform</span>
          </div>

          <div className="flex items-center gap-5">
            <button
              onClick={() => {
                setActiveTab('knowledge');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="text-[#4B5563] hover:text-[#15803D] font-semibold transition-colors"
            >
              Statutes & Gazette Corpus
            </button>

            <button
              onClick={() => {
                setActiveTab('cost');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="text-[#4B5563] hover:text-[#15803D] font-semibold transition-colors"
            >
              Fee Schedules
            </button>

            <a
              href="https://ipindia.gov.in"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#4B5563] hover:text-[#15803D] flex items-center gap-1 font-semibold transition-colors"
            >
              <span>IP India</span>
              <ExternalLink className="w-3 h-3" />
            </a>

            <a
              href="https://nbaindia.org"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#4B5563] hover:text-[#15803D] flex items-center gap-1 font-semibold transition-colors"
            >
              <span>NBA India</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
