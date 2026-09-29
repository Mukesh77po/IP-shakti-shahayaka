import { useState, useRef, useEffect } from 'react';
import { Sparkles, Send, BookOpen, ShieldCheck, Scale, CheckCircle2, AlertCircle, RotateCcw, ExternalLink, Globe, Languages, FileText } from 'lucide-react';
import { Jurisdiction, AppLanguage } from '../types';

interface AskAIProps {
  initialQuestion?: string;
  assessmentContext?: string;
  jurisdiction: Jurisdiction;
  setJurisdiction: (j: Jurisdiction) => void;
  language: AppLanguage;
  setLanguage: (l: AppLanguage) => void;
}

interface AICitationSource {
  title: string;
  organization: string;
  page: string | number;
  url: string;
}

interface AIResponseData {
  classification?: {
    product_type?: string;
    jurisdiction?: string;
    category?: string;
  };
  answer: string;
  reasoning: string;
  next_steps?: string[];
  confidence?: string;
  sources?: AICitationSource[];
  disclaimer?: string;
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text?: string;
  response?: AIResponseData;
  timestamp: string;
}

export function AskAI({
  initialQuestion = '',
  assessmentContext = '',
  jurisdiction,
  setJurisdiction,
  language,
  setLanguage
}: AskAIProps) {
  const [inputQuery, setInputQuery] = useState<string>(initialQuestion);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  const suggestedQuestions = [
    'Can I patent a formulation of Ashwagandha and Piperine?',
    'What are the mandatory requirements for NBA Form III approval under the 2023 Amendment?',
    'How do I overcome a Section 3(p) TKDL objection for an Ayurvedic extract?',
    'Can I register a brand name like "Ashwagandha Gold" in Trademark Class 5?',
    'What are the labeling and heavy metal rules under FSSAI Ayurveda Aahara Regulations 2022?',
    'How does the 2024 WIPO GRATK Treaty affect international PCT patent filings from India?'
  ];

  // If initialQuestion is provided on mount or changes, run it
  useEffect(() => {
    if (initialQuestion && initialQuestion.trim() && messages.length === 0) {
      handleAskQuestion(initialQuestion.trim());
    }
  }, [initialQuestion]);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleAskQuestion = async (queryText?: string) => {
    const query = (queryText || inputQuery).trim();
    if (!query || isLoading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputQuery('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: query,
          jurisdiction,
          language,
          product_type: 'Ayurvedic Formulation',
          product_context: assessmentContext
        })
      });

      if (!res.ok) {
        throw new Error(`Server returned HTTP ${res.status}`);
      }

      const data: AIResponseData = await res.json();

      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        response: data,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (err: any) {
      const errorMsg: ChatMessage = {
        id: `ai-err-${Date.now()}`,
        sender: 'ai',
        response: {
          answer: 'Unable to reach the legal intelligence service at this moment. Please verify server status or try again shortly.',
          reasoning: err?.message || 'Network connection error.',
          next_steps: ['Check network connection', 'Verify server health at /api/health'],
          sources: [
            {
              title: 'Official CGPDTM Patent Portal',
              organization: 'IP India',
              page: 'Section 3(p)',
              url: 'https://ipindia.gov.in'
            }
          ],
          disclaimer: 'An AI-assisted informational guidance, not legal or regulatory advice.'
        },
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-16">
      {/* Header Banner with Dedicated AI indicator */}
      <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 sm:p-8 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#047857] bg-emerald-50 border border-emerald-200/80 px-2.5 py-0.5 rounded-full flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>DEDICATED GEMINI REGULATORY AI</span>
            </span>
            <span className="text-xs text-stone-500 font-medium hidden sm:inline">
              • Ask Any Question Free-form
            </span>
          </div>
          <h2 className="text-2xl font-bold text-[#111827] tracking-tight mt-1">
            Ayurvedic Legal & Regulatory Assistant
          </h2>
          <p className="text-xs text-[#6B7280] mt-1 font-medium max-w-2xl">
            Ask any free-form question on Patents Act exclusions (Sec 3(p)/3(e)), TKDL opposition defense, NBA Form III clearance, FSSAI Ayurveda Aahara standards, or WIPO international treaties.
          </p>
        </div>

        {/* Quick Context Settings */}
        <div className="flex items-center gap-2 self-stretch sm:self-auto justify-end">
          <div className="text-right">
            <span className="text-[10px] font-mono text-stone-500 block uppercase">Regime & Language</span>
            <span className="text-xs font-bold text-[#047857]">
              {jurisdiction} • {language.toUpperCase()}
            </span>
          </div>
          <button
            onClick={() => setMessages([])}
            className="p-2 rounded-xl border border-stone-200 text-stone-600 hover:bg-stone-50 text-xs font-semibold transition-colors"
            title="Clear Chat History"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Assessment Context Banner if linked */}
      {assessmentContext && (
        <div className="p-3.5 rounded-xl bg-emerald-50/70 border border-emerald-200 text-xs text-emerald-900 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-emerald-700 shrink-0" />
            <span className="font-semibold">Context linked from current assessment:</span>
            <span className="italic truncate max-w-md">{assessmentContext}</span>
          </div>
          <span className="text-[10px] font-mono font-bold bg-emerald-200/60 px-2 py-0.5 rounded text-emerald-900">
            Active
          </span>
        </div>
      )}

      {/* Suggested Questions (Chips) */}
      {messages.length === 0 && (
        <div className="bg-white border border-[#E5E7EB] rounded-2xl p-5 shadow-xs space-y-3">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#6B7280] block">
            SUGGESTED INQUIRIES & BENCHMARKS
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {suggestedQuestions.map((sq, idx) => (
              <button
                key={idx}
                onClick={() => handleAskQuestion(sq)}
                className="text-left p-3 rounded-xl border border-stone-200 hover:border-emerald-300 hover:bg-emerald-50/40 text-xs text-stone-800 font-medium transition-colors flex items-center justify-between group"
              >
                <span className="pr-2">{sq}</span>
                <Sparkles className="w-3.5 h-3.5 text-emerald-600 shrink-0 opacity-40 group-hover:opacity-100 transition-opacity" />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Conversation Thread */}
      <div className="space-y-4">
        {messages.map((msg) => (
          <div key={msg.id} className="space-y-2">
            {/* User Message */}
            {msg.sender === 'user' && (
              <div className="flex justify-end">
                <div className="bg-[#15803D] text-white p-4 rounded-2xl rounded-tr-xs max-w-2xl text-xs sm:text-sm font-medium shadow-xs">
                  <p>{msg.text}</p>
                  <span className="text-[10px] text-emerald-200 block text-right mt-1.5 font-mono">
                    {msg.timestamp}
                  </span>
                </div>
              </div>
            )}

            {/* AI Response Card */}
            {msg.sender === 'ai' && msg.response && (
              <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 sm:p-7 shadow-xs space-y-5 animate-in fade-in-50">
                {/* Header Tag */}
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-stone-100 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-600" />
                    <span className="text-xs font-bold text-stone-900">
                      {msg.response.classification?.category || 'Regulatory Guidance'}
                    </span>
                    {msg.response.classification?.product_type && (
                      <span className="text-[10px] font-mono bg-stone-100 text-stone-700 px-2 py-0.5 rounded border border-stone-200">
                        {msg.response.classification.product_type}
                      </span>
                    )}
                  </div>
                  {msg.response.confidence && (
                    <span className="text-[10px] font-mono text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      Confidence: {msg.response.confidence}
                    </span>
                  )}
                </div>

                {/* Direct Answer */}
                <div>
                  <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-stone-500 mb-1">
                    Statutory Determination
                  </h4>
                  <p className="text-sm font-semibold text-stone-900 leading-relaxed">
                    {msg.response.answer}
                  </p>
                </div>

                {/* Statutory Reasoning */}
                {msg.response.reasoning && (
                  <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 space-y-1.5">
                    <h5 className="text-xs font-bold text-stone-800 flex items-center gap-1.5">
                      <Scale className="w-3.5 h-3.5 text-emerald-700" />
                      <span>Legal Analysis & Patent Office Rationale:</span>
                    </h5>
                    <p className="text-xs text-stone-700 leading-relaxed">
                      {msg.response.reasoning}
                    </p>
                  </div>
                )}

                {/* Actionable Next Steps */}
                {msg.response.next_steps && msg.response.next_steps.length > 0 && (
                  <div className="space-y-2">
                    <h5 className="text-xs font-bold text-stone-800 flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#15803D]" />
                      <span>Recommended Actionable Steps:</span>
                    </h5>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      {msg.response.next_steps.map((step, idx) => (
                        <li key={idx} className="p-2.5 rounded-xl border border-stone-200 bg-emerald-50/20 text-stone-800 flex items-start gap-2">
                          <span className="text-xs font-mono font-bold text-[#15803D] shrink-0">{idx + 1}.</span>
                          <span className="leading-snug">{step}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Citations & Official Sources */}
                {msg.response.sources && msg.response.sources.length > 0 && (
                  <div className="pt-3 border-t border-stone-100 space-y-2">
                    <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-stone-500 block">
                      Authoritative Statutory Citations
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {msg.response.sources.map((src, idx) => (
                        <a
                          key={idx}
                          href={src.url || 'https://ipindia.gov.in'}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2.5 rounded-xl border border-stone-200 hover:border-emerald-300 hover:bg-stone-50 text-xs flex items-center justify-between group transition-colors"
                        >
                          <div>
                            <span className="font-bold text-stone-900 block group-hover:text-[#15803D]">
                              {src.title}
                            </span>
                            <span className="text-[10px] text-stone-500">
                              {src.organization} • {src.page}
                            </span>
                          </div>
                          <ExternalLink className="w-3.5 h-3.5 text-stone-400 group-hover:text-[#15803D] shrink-0" />
                        </a>
                      ))}
                    </div>
                  </div>
                )}

                {/* Disclaimer */}
                <div className="pt-2 flex items-center justify-between text-[10px] text-stone-400 border-t border-stone-100">
                  <span>{msg.response.disclaimer || 'An AI-assisted informational guidance, not legal or regulatory advice.'}</span>
                  <span className="font-mono">{msg.timestamp}</span>
                </div>
              </div>
            )}
          </div>
        ))}

        {/* Loading Indicator */}
        {isLoading && (
          <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 shadow-xs flex items-center gap-3">
            <div className="w-5 h-5 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin" />
            <span className="text-xs font-semibold text-stone-700">
              Querying Gemini Legal AI against 14 Ayurvedic Gazette Statutes...
            </span>
          </div>
        )}

        <div ref={chatBottomRef} />
      </div>

      {/* User Input Form */}
      <div className="bg-white border border-[#E5E7EB] rounded-2xl p-4 shadow-xs">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleAskQuestion();
          }}
          className="space-y-3"
        >
          <div className="relative">
            <textarea
              rows={3}
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleAskQuestion();
                }
              }}
              placeholder="Type any question on Ayurvedic patentability, TKDL citations, NBA Form III, Section 3(p) defense, FSSAI licensing... (Press Enter to submit)"
              className="w-full text-xs p-3.5 pr-20 rounded-xl border border-[#D1D5DB] focus:border-[#15803D] focus:ring-1 focus:ring-[#15803D] outline-none text-[#111827] resize-none"
            />
            <button
              type="submit"
              disabled={!inputQuery.trim() || isLoading}
              className="absolute right-3 bottom-4 bg-[#15803D] hover:bg-[#166534] disabled:opacity-40 text-white p-2.5 rounded-xl transition-all shadow-xs"
              title="Submit query"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>

          <div className="flex flex-wrap items-center justify-between text-[11px] text-stone-500 pt-1">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-stone-700">Jurisdiction:</span>
              <select
                value={jurisdiction}
                onChange={(e) => setJurisdiction(e.target.value as Jurisdiction)}
                className="p-1 rounded-lg border border-stone-200 bg-white text-stone-800 font-medium"
              >
                <option value="India">India (Domestic Laws)</option>
                <option value="International">International (Global Treaties)</option>
                <option value="Both">Both (Dual Analysis)</option>
              </select>

              <span className="font-semibold text-stone-700 ml-2">Language:</span>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value as AppLanguage)}
                className="p-1 rounded-lg border border-stone-200 bg-white text-stone-800 font-medium"
              >
                <option value="en">English</option>
                <option value="hi">हिंदी (Hindi)</option>
                <option value="kn">ಕನ್ನಡ (Kannada)</option>
              </select>
            </div>

            <span className="text-[10px] text-stone-400 hidden sm:inline">
              Powered by Google Gemini API & Authoritative Gazette Corpus
            </span>
          </div>
        </form>
      </div>
    </div>
  );
}
