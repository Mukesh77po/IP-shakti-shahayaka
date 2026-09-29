export interface SamplePreset {
  id: string;
  title: string;
  tag: string;
  jurisdiction: string;
  product_type: string;
  language: string;
  question: string;
  expectedCategory: string;
  expectedSnippet: string;
}

export const SAMPLE_PRESETS: SamplePreset[] = [
  {
    id: 'patent-classical',
    title: 'Classical Formulation Patent & NBA (India)',
    tag: 'Section 3(p) & NBA',
    jurisdiction: 'India',
    product_type: 'Classical Ayurvedic formulation',
    language: 'English',
    question: 'Can I patent a classical formulation like Chyawanprash with added preservatives, and what NBA permissions are needed?',
    expectedCategory: 'Classical Ayurvedic formulation',
    expectedSnippet: 'Barred under Section 3(p) & 3(e) of Patents Act. Mandatory Form 3 NBA approval required under Section 6 of Biological Diversity Act.'
  },
  {
    id: 'ayurveda-aahar',
    title: 'Ayurveda-Aahar vs Drug Claims (India)',
    tag: 'FSSAI Regulations 2022',
    jurisdiction: 'India',
    product_type: 'Ayurveda-Aahar',
    language: 'English',
    question: 'Can I manufacture an herbal immunity porridge as Ayurveda-Aahar and claim on the label that it cures type-2 diabetes and arthritis?',
    expectedCategory: 'Ayurveda-Aahar',
    expectedSnippet: 'Prohibited. Under FSSAI Ayurveda-Aahar Regulations 2022, therapeutic or disease cure claims are strictly banned. Must carry "NOT FOR MEDICINAL USE".'
  },
  {
    id: 'novel-extract-abs',
    title: 'Novel Phytopharmaceutical & ABS Duty (India)',
    tag: 'Access & Benefit Sharing',
    jurisdiction: 'India',
    product_type: 'New/non-classical formulation',
    language: 'English',
    question: 'We developed a standardized bioactive fraction from Bacopa monnieri using CO2 supercritical extraction. How do we navigate patenting and ABS duties with NBA?',
    expectedCategory: 'New/non-classical formulation',
    expectedSnippet: 'Non-obvious extraction with synergy can overcome Section 3(p). Must file Form 3 with NBA before patent grant and sign Access and Benefit Sharing agreement.'
  },
  {
    id: 'us-fda-botanical',
    title: 'US FDA Dietary Supplement vs Botanical Drug (US)',
    tag: 'US FDA / DSHEA',
    jurisdiction: 'US',
    product_type: 'Proprietary formulation',
    language: 'English',
    question: 'How can an Ayurvedic Ashwagandha blend enter the US market without a full New Drug Application (NDA), and what claims are legal?',
    expectedCategory: 'Proprietary formulation',
    expectedSnippet: 'Market as Dietary Supplement under DSHEA 1994 with structure/function claims. Cannot make disease claims without IND/NDA botanical drug approval.'
  },
  {
    id: 'eu-thmpd-directive',
    title: 'EU Directive 2004/24/EC THMPD 15-Year Rule (EU)',
    tag: 'EMA / THMPD',
    jurisdiction: 'EU',
    product_type: 'Classical Ayurvedic formulation',
    language: 'English',
    question: 'Can an Ayurvedic churnam qualify for simplified registration under European Union Directive 2004/24/EC?',
    expectedCategory: 'Classical Ayurvedic formulation',
    expectedSnippet: 'Requires 30 years medicinal use of which at least 15 years must be demonstrated within the European Community.'
  },
  {
    id: 'out-of-domain-guardrail',
    title: 'Anti-Hallucination Guardrail Check (Out of Scope)',
    tag: 'Guardrail Test',
    jurisdiction: 'India',
    product_type: 'Unknown',
    language: 'English',
    question: 'What are the motor vehicle emission standards and road tax exemptions for lithium-ion commercial buses in Karnataka?',
    expectedCategory: 'Unknown',
    expectedSnippet: 'Insufficient authoritative information available to answer this reliably.'
  }
];
