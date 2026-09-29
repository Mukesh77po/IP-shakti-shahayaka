import { useState } from 'react';
import { BookOpen, ExternalLink, ShieldAlert, CheckCircle, Scale } from 'lucide-react';

interface CorpusItem {
  id: string;
  title: string;
  organization: string;
  jurisdiction: 'India' | 'International';
  statute: string;
  keySections: string;
  summary: string;
  url: string;
  localFile: string;
}

export function CorpusViewer() {
  const corpusList: CorpusItem[] = [
    {
      id: 'dca-1940',
      title: 'Drugs and Cosmetics Act, 1940 & Rules 1945',
      organization: 'Ministry of Ayush / CDSCO',
      jurisdiction: 'India',
      statute: 'Chapter IVA: Ayurvedic, Siddha & Unani Drugs',
      keySections: 'Section 3(a) (Classical), Section 3(h) (Proprietary), Rule 158B (Safety Data)',
      summary: 'Distinguishes Classical Ayurvedic medicines (codified in 54 First Schedule texts like Charaka, Sushruta, Sahasrayogam) from ASU Proprietary medicines. Prohibits non-classical synthetic ingredients in Ayurvedic drugs.',
      url: 'https://indiacode.nic.in/handle/123456789/2384',
      localFile: 'data/india/drugs_and_cosmetics_act_1940.pdf'
    },
    {
      id: 'patents-1970',
      title: 'The Patents Act, 1970',
      organization: 'Office of CGPDTM (Indian Patent Office)',
      jurisdiction: 'India',
      statute: 'Section 3: Inventions Not Patentable',
      keySections: 'Section 3(p) (Traditional Knowledge bar), Section 3(d), Section 3(e) (Mere admixture), TKDL Guidelines',
      summary: 'Section 3(p) categorically excludes codified traditional Ayurvedic knowledge from patenting. To obtain patent protection, an innovation must prove unexpected synergistic bio-enhancement or novel extraction exceeding simple aggregation.',
      url: 'https://ipindia.gov.in/patents.htm',
      localFile: 'data/india/patents_act_1970_section_3p.pdf'
    },
    {
      id: 'bda-2002',
      title: 'Biological Diversity Act, 2002 & Amendment Act 2023',
      organization: 'National Biodiversity Authority (NBA)',
      jurisdiction: 'India',
      statute: 'Access and Benefit Sharing (ABS) & IPR Approval',
      keySections: 'Section 6 (Mandatory NBA approval for IPR), Form 3, Section 3, Section 55 (Penalties)',
      summary: 'Mandates prior statutory approval of the National Biodiversity Authority (NBA) via Form 3 before applying for or obtaining grant of any IPR in or outside India for inventions based on Indian biological resources.',
      url: 'https://nbaindia.org/act/',
      localFile: 'data/india/biological_diversity_act_2002.pdf'
    },
    {
      id: 'aahar-2022',
      title: 'Food Safety and Standards (Ayurveda Aahar) Regulations, 2022',
      organization: 'Food Safety and Standards Authority of India (FSSAI)',
      jurisdiction: 'India',
      statute: 'Ayurveda Aahar Standards & Labeling',
      keySections: 'Regulation 3, Schedule A Authoritative texts, Mandatory Logo, "NOT FOR MEDICINAL USE"',
      summary: 'Regulates foods prepared per Ayurvedic classical recipes. Strictly bans disease treatment or therapeutic cure claims on food packaging. Therapeutic claims trigger reclassification into drugs.',
      url: 'https://fssai.gov.in',
      localFile: 'data/india/ayurveda_aahar_regulations_2022.pdf'
    },
    {
      id: 'fda-botanical',
      title: 'US FDA Guidance: Botanical Drug Development',
      organization: 'US Food and Drug Administration (CDER)',
      jurisdiction: 'International',
      statute: 'Dietary Supplement vs Botanical Drug (IND/NDA)',
      keySections: 'DSHEA 1994, 21 CFR Part 111 cGMP, Structure/Function Claims, 75-Day NDI Notice',
      summary: 'Details dual US pathways: Dietary Supplements (nutritional support without disease claims, 75-day NDI for new botanicals) vs Botanical Drugs requiring full clinical trials under IND/NDA.',
      url: 'https://www.fda.gov/regulatory-information/search-fda-guidance-documents/botanical-drug-development-guidance-industry',
      localFile: 'data/international/fda_botanical_drug_guidance.pdf'
    },
    {
      id: 'eu-thmpd',
      title: 'EU Directive 2004/24/EC (THMPD)',
      organization: 'European Medicines Agency (EMA) / HMPC',
      jurisdiction: 'International',
      statute: 'Traditional Herbal Medicinal Products Directive',
      keySections: 'Article 16a (Simplified Registration), 30-Year Usage Rule (15 years in EU), Well-Established Use',
      summary: 'Simplified registration requires 30 years of continuous traditional medicinal use, including at least 15 years demonstrated within the European Union. Classical Indian formulations often need alternative routes like Well-Established Use or Food Supplements.',
      url: 'https://www.ema.europa.eu/en/human-regulatory/herbal-products',
      localFile: 'data/international/eu_directive_2004_24_thmpd.pdf'
    }
  ];

  return (
    <div className="space-y-4">
      <div className="bg-stone-50 border border-stone-200 rounded-xl p-4 flex items-center justify-between">
        <div>
          <h4 className="text-sm font-semibold text-stone-900">Authoritative Statutory Knowledge Base</h4>
          <p className="text-xs text-stone-500 mt-0.5">
            The 6 core legislative gazettes ingested into ChromaDB for zero-hallucination RAG
          </p>
        </div>
        <span className="text-xs font-mono px-2.5 py-1 bg-white border border-stone-200 rounded-md text-stone-700 font-medium">
          6 Authoritative PDFs Indexed
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {corpusList.map((doc) => (
          <div
            key={doc.id}
            className="bg-white border border-stone-200 rounded-xl p-4.5 shadow-xs flex flex-col justify-between hover:border-stone-300 transition-colors"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <span
                  className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold uppercase tracking-wider ${
                    doc.jurisdiction === 'India'
                      ? 'bg-orange-50 text-orange-700 border border-orange-200'
                      : 'bg-blue-50 text-blue-700 border border-blue-200'
                  }`}
                >
                  {doc.jurisdiction} Regime
                </span>
                <span className="text-[11px] font-mono text-stone-400 truncate max-w-[200px]">
                  {doc.localFile}
                </span>
              </div>

              <h4 className="text-sm font-semibold text-stone-900">{doc.title}</h4>
              <div className="text-xs font-medium text-stone-600 mt-0.5 flex items-center gap-1.5">
                <Scale className="w-3.5 h-3.5 text-stone-500" />
                <span>{doc.organization}</span>
              </div>

              <div className="mt-2.5 bg-stone-50 p-2.5 rounded-lg border border-stone-100 text-xs">
                <div className="font-semibold text-stone-800 text-[11px] mb-0.5 font-mono">
                  {doc.statute}
                </div>
                <div className="text-stone-500 text-[11px] font-mono">
                  Key Clauses: {doc.keySections}
                </div>
              </div>

              <p className="text-xs text-stone-600 mt-2.5 leading-relaxed">
                {doc.summary}
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between">
              <span className="text-[11px] font-mono text-emerald-700 flex items-center gap-1">
                <CheckCircle className="w-3 h-3 text-emerald-600" />
                ChromaDB Ingestion Ready
              </span>
              <a
                href={doc.url}
                target="_blank"
                rel="noreferrer"
                className="text-xs font-mono text-blue-600 hover:text-blue-800 flex items-center gap-1 hover:underline"
              >
                <span>Statute Portal</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
