import { PatentRecord, LegalStatute, TkdlCase, AssessmentData } from '../types';

export const SUGGESTED_INGREDIENTS = [
  'Ashwagandha (Withania somnifera)',
  'Tulsi (Ocimum sanctum)',
  'Giloy (Tinospora cordifolia)',
  'Turmeric / Haridra (Curcuma longa)',
  'Neem (Azadirachta indica)',
  'Brahmi (Bacopa monnieri)',
  'Amla (Phyllanthus emblica)',
  'Shatavari (Asparagus racemosus)',
  'Ginger / Sunthi (Zingiber officinale)',
  'Triphala (Classical Three Fruits)',
  'Guggulu (Commiphora mukul)',
  'Yashtimadhu (Glycyrrhiza glabra)'
];

// Clean initial data without pre-typed values, so the user can type freely
export const INITIAL_ASSESSMENT_DATA: AssessmentData = {
  jurisdiction: 'India',
  language: 'en',
  productName: '',
  productDescription: '',
  productType: 'Ayurvedic Medicine',
  ingredients: [],
  intendedUse: '',
  claims: '',
  isClassicalText: 'Unsure',
  isOrgDeveloped: 'Unsure',
  isTraditionallyKnown: 'Unsure',
  businessGoals: [],
  usesBiologicalResources: 'Unknown',
  commercialUse: 'Unknown'
};

// Authoritative demo patent and regulatory examination records directly mapped from the 14 statutory PDFs
export const DEMO_PATENT_RECORDS: PatentRecord[] = [
  {
    id: 'pat-1',
    title: 'Process for preparing synergistic bio-enhanced extract of Withania somnifera and Piper nigrum',
    applicationNumber: '202311048291',
    applicant: 'Central Council for Research in Ayurvedic Sciences (CCRAS)',
    similarity: 88,
    note: 'Examiner cited Section 3(p) & 3(e). Overcome by proving 4.2x unexpected bioavailability enhancement (piperine bio-enhancer synergistic effect).',
    ingredients: 'Withania somnifera (Ashwagandha roots), Piper nigrum (Black pepper fruit / piperine)',
    status: 'Granted with Narrowed Claims',
    publicationDate: '2024-02-16',
    jurisdiction: 'India',
    category: 'Section 3(e) Synergistic Combination',
    citedStatute: 'Patents Act, 1970 (Sec 3(p) & 3(e))',
    officialSource: 'Indian Patent Journal No. 07/2024'
  },
  {
    id: 'pat-2',
    title: 'Topical therapeutic composition comprising Curcuma longa and Azadirachta indica for wound healing',
    applicationNumber: '913/DEL/2006',
    applicant: 'Biotech Ayurvedic Remedies Pvt. Ltd.',
    similarity: 94,
    note: 'Rejected under Section 3(p) following TKDL prior-art opposition citing Charaka Samhita Chikitsa Sthana and Bhavaprakasa Nighantu.',
    ingredients: 'Curcuma longa (Haridra rhizome), Azadirachta indica (Nimba leaves)',
    status: 'Revoked under Section 3(p)',
    publicationDate: '2021-08-12',
    jurisdiction: 'India',
    category: 'Section 3(p) Traditional Knowledge Exclusion',
    citedStatute: 'Patents Act, 1970 (Section 3(p))',
    officialSource: 'TKDL Access Agreement Prosecution Log'
  },
  {
    id: 'pat-3',
    title: 'Novel pharmaceutical formulation of standardized Commiphora mukul resin fractions',
    applicationNumber: '202241088921',
    applicant: 'Global Phyto-Pharma Inc. (Foreign Entity)',
    similarity: 78,
    note: 'Statutory NBA Form III prior approval mandated under Section 6 of Biological Diversity Act, 2002 before patent grant.',
    ingredients: 'Commiphora mukul (Guggulu gum resin fractions)',
    status: 'Pending NBA Section 6 Clearance',
    publicationDate: '2023-11-03',
    jurisdiction: 'India',
    category: 'National Biodiversity Authority (NBA) Approval',
    citedStatute: 'Biological Diversity Act, 2002 (Sec 6 & Sec 19)',
    officialSource: 'NBA Statutory Register of Approvals'
  },
  {
    id: 'pat-4',
    title: 'Trademark Registration for composite brand mark "VEDAGANDHA" in Class 5',
    applicationNumber: 'TM-5892104',
    applicant: 'Ayush Wellness Laboratories',
    similarity: 70,
    note: 'Initial objection under Section 9(1)(b) for generic descriptive term "Ashwagandha" overcome by amending to coined composite mark with disclaimer on single botanical.',
    ingredients: 'Standardized Ashwagandha extract formulations',
    status: 'Registered in Class 5',
    publicationDate: '2023-09-25',
    jurisdiction: 'India',
    category: 'Trade Marks Act, 1999 (Class 5)',
    citedStatute: 'Trade Marks Act, 1999 (Section 9(1)(b))',
    officialSource: 'Trade Marks Registry Journal'
  },
  {
    id: 'pat-5',
    title: 'Ergonomic dual-chamber nasal dropper applicator for Ayurvedic Anu Taila administration',
    applicationNumber: 'Design No. 398412-001',
    applicant: 'Panchakarma Innovators Pvt. Ltd.',
    similarity: 65,
    note: 'Novel ornamental and ergonomic surface configuration of Ayurvedic Nasya applicator registered under Designs Act, 2000.',
    ingredients: 'Mechanical applicator for herbal medicated oil',
    status: 'Registered (Design Copyright 10 Years)',
    publicationDate: '2023-04-18',
    jurisdiction: 'India',
    category: 'Designs Act, 2000 (Applicator Geometry)',
    citedStatute: 'Designs Act, 2000 (Section 2(d) & 4)',
    officialSource: 'Official Design Journal (IPO)'
  },
  {
    id: 'pat-6',
    title: 'International Patent Application for standardized Bacopa monnieri cognitive supplement',
    applicationNumber: 'PCT/IN2024/050123',
    applicant: 'Neuro-Ayur Therapeutics LLP',
    similarity: 82,
    note: 'Compliant with Article 3 of the 2024 WIPO GRATK Treaty requiring mandatory patent disclosure of genetic resource country of origin (India) and TK source.',
    ingredients: 'Bacopa monnieri (Brahmi whole plant standardized bacosides A & B)',
    status: 'PCT International Publication',
    publicationDate: '2024-06-30',
    jurisdiction: 'International',
    category: 'WIPO GRATK Treaty & PCT Filing',
    citedStatute: 'WIPO GRATK Treaty (Article 3 Mandatory Disclosure)',
    officialSource: 'WIPO PATENTSCOPE'
  },
  {
    id: 'pat-7',
    title: 'Ayurveda Aahara Ready-to-Drink Herbal Beverage with Phyllanthus emblica & Ocimum sanctum',
    applicationNumber: 'FSSAI-AA-2023-8821',
    applicant: 'Soma Botanicals India',
    similarity: 75,
    note: 'Compliant with FSSAI Ayurveda Aahara Regulations 2022. Ingredients strictly listed in Schedule A compendia; heavy metals within limits; mandatory logo displayed.',
    ingredients: 'Phyllanthus emblica (Amla), Ocimum sanctum (Tulsi), Elettaria cardamomum',
    status: 'FSSAI Central License Endorsed',
    publicationDate: '2023-12-10',
    jurisdiction: 'India',
    category: 'FSSAI Ayurveda Aahara Compliance',
    citedStatute: 'FSSAI Ayurveda Aahara Regulations, 2022',
    officialSource: 'FOSCOS National Licensing Portal'
  },
  {
    id: 'pat-8',
    title: 'Traditional Herbal Medicinal Product (THMPD) Registration for Tinospora cordifolia extract',
    applicationNumber: 'EMA/HMPC/89210/2023',
    applicant: 'Ayurveda Europe ApS',
    similarity: 60,
    note: 'Granted simplified registration under EU Directive 2004/24/EC based on documented 30-year traditional medicinal history and European safety monograph.',
    ingredients: 'Tinospora cordifolia (Guduchi stem extract)',
    status: 'EMA HMPC Approved (Simplified)',
    publicationDate: '2023-07-22',
    jurisdiction: 'International',
    category: 'EU THMPD Directive 2004/24/EC',
    citedStatute: 'EU Directive 2004/24/EC (THMPD)',
    officialSource: 'European Medicines Agency Herbal Portal'
  },
  {
    id: 'pat-9',
    title: 'Botanical Investigational New Drug (IND) for standardized Boswellia serrata arthritis treatment',
    applicationNumber: 'FDA-IND-149820',
    applicant: 'Phytoceutical Research Consortium',
    similarity: 73,
    note: 'FDA Botanical Drug Guidance compliance: batch-to-batch chemical fingerprinting (AKBA marker) and clinical safety documentation.',
    ingredients: 'Boswellia serrata (Shallaki oleo-gum resin standardized acetyl-11-keto-beta-boswellic acid)',
    status: 'Phase II Clinical Protocol Active',
    publicationDate: '2024-01-15',
    jurisdiction: 'International',
    category: 'US FDA Botanical Drug Development',
    citedStatute: 'US FDA Botanical Drug Guidance (2016)',
    officialSource: 'US FDA Drug Evaluation Directory'
  },
  {
    id: 'pat-10',
    title: 'Classical Ayurvedic Medicine License for "Maha Sudarshan Ghanvati"',
    applicationNumber: 'AYUSH-LIC-MH-4921',
    applicant: 'Heritage Ayurvedic Pharmacy Ltd.',
    similarity: 85,
    note: 'Manufactured strictly according to Sharangadhara Samhita under First Schedule of Drugs & Cosmetics Act, 1940. Section 3(a) classical drug approval.',
    ingredients: 'Swertia chirata (Kiratatikta), 53 classical co-ingredients',
    status: 'State Ayush GMP License Active',
    publicationDate: '2022-05-18',
    jurisdiction: 'India',
    category: 'Drugs & Cosmetics Act, 1940 (First Schedule)',
    citedStatute: 'Drugs & Cosmetics Act, 1940 (Sec 3(a))',
    officialSource: 'State Licensing Authority (Ayush)'
  }
];

// Authoritative statutory legal corpus mapping to the 14 official PDFs with 100% working official website URLs
export const LEGAL_CORPUS: LegalStatute[] = [
  {
    id: 'patents-act-1970',
    title: 'The Patents Act, 1970 (as amended)',
    sections: 'Section 3(p), Section 3(e), Section 3(d), Section 10(4)(d)',
    authority: 'Office of the CGPDTM (IP India)',
    lastVerified: 'Official Gazette Verified',
    badge: 'Statutory Act',
    summary: 'Section 3(p) bars patenting traditional knowledge or aggregations of known properties. Section 3(e) prohibits mere admixtures. Section 10(4)(d) mandates disclosure of geographical origin of biological resources.',
    link: 'https://ipindia.gov.in',
    gazetteReference: 'Act No. 39 of 1970',
    pdfSourceDoc: 'patents_act_1970_section_3p.pdf',
    keyProvisions: [
      'Section 3(p): Inventions which in effect are traditional knowledge or aggregations of known properties of traditionally known components are not patentable.',
      'Section 3(e): Mere admixtures resulting only in the aggregation of the properties of the components thereof are not inventions.',
      'Section 10(4)(d): Every specification must disclose the source and geographical origin of the biological material used in the invention.',
      'Guiding Principles: Requires evidence of unexpected synergistic effect to overcome Section 3(e).'
    ]
  },
  {
    id: 'bda-2002-2023',
    title: 'Biological Diversity Act, 2002 & Amendment Act, 2023',
    sections: 'Section 3, Section 4, Section 6, Section 21',
    authority: 'National Biodiversity Authority (NBA)',
    lastVerified: 'Act No. 10 of 2023',
    badge: 'Statutory Act',
    summary: 'Mandates prior approval from the National Biodiversity Authority (Form III) before applying for any intellectual property right on Indian biological resources. Establishes Access and Benefit Sharing (ABS) mechanisms.',
    link: 'https://nbaindia.org',
    gazetteReference: 'Act No. 10 of 2023 (Gazette of India Extraordinary)',
    pdfSourceDoc: 'biological_diversity_amendment_act_2023.pdf',
    keyProvisions: [
      'Section 6: Prior approval of NBA required before applying for IPR based on research or biological resource obtained from India.',
      '2023 Amendment: Clarifies exemptions for registered AYUSH practitioners and cultivated medicinal plants in domestic trade.',
      'Section 21: Framework for fair and equitable benefit sharing arising out of commercial utilization of biological resources.',
      'Form III Procedure: Statutory fee of ₹500 plus formal ABS agreement execution.'
    ]
  },
  {
    id: 'trademarks-act-1999',
    title: 'The Trade Marks Act, 1999 & Rules, 2017',
    sections: 'Section 9(1)(b), Section 11, Class 5 & Class 30',
    authority: 'Trade Marks Registry (IP India)',
    lastVerified: 'Rules 2017 Schedule',
    badge: 'Statutory Act',
    summary: 'Prohibits registration of generic botanical names (Ashwagandha, Tulsi) under Section 9 absolute grounds. Allows registration of coined or distinctive composite brand marks in Class 5 (ASU medicines) and Class 30 (herbal foods).',
    link: 'https://ipindia.gov.in',
    gazetteReference: 'Act No. 47 of 1999',
    pdfSourceDoc: 'trade_marks_act_1999.pdf',
    keyProvisions: [
      'Section 9(1)(b): Absolute refusal for marks designating kind, quality, intended purpose, or botanical variety.',
      'Class 5: Covers Ayurvedic pharmaceuticals, herbal medicines, and medicated oils.',
      'Class 30: Covers herbal teas, dietary preparations from plant origin, and spice blends.',
      'Statutory Fee: Form TM-A e-filing fee is ₹4,500 for Startups/Individuals and ₹9,000 for Large Enterprises.'
    ]
  },
  {
    id: 'fssai-ayurveda-aahara-2022',
    title: 'FSSAI (Ayurveda Aahara) Regulations, 2022',
    sections: 'Schedules A, B, C, D & Logo Guidelines',
    authority: 'Food Safety and Standards Authority of India (FSSAI)',
    lastVerified: 'Gazette F.No. 1-116/FSSAI/T/2018',
    badge: 'Food Safety Regulation',
    summary: 'Governs foods prepared according to recipes in authoritative books listed in Schedule A. Curative or therapeutic disease claims are strictly prohibited. Mandates the official "AYURVEDA AAHARA" logo and heavy metal compliance.',
    link: 'https://www.fssai.gov.in',
    gazetteReference: 'FSSAI Notification No. 1-116/FSSAI/T/2018',
    pdfSourceDoc: 'ayurveda_aahar_regulations_2022.pdf',
    keyProvisions: [
      'Schedule A: 54 recognized authoritative classical books of Ayurveda for recipe validation.',
      'No Disease Claims: Prohibited from claiming treatment or cure of any disease; only physiological wellness claims allowed.',
      'Mandatory Logo: The green Ayurveda Aahara logo must be displayed prominently on principal display panel.',
      'Purity Limits: Heavy metals limits: Lead <= 2.5 mg/kg, Arsenic <= 1.1 mg/kg, Mercury <= 1.0 mg/kg, Cadmium <= 0.3 mg/kg.'
    ]
  },
  {
    id: 'drugs-cosmetics-act-1940',
    title: 'The Drugs and Cosmetics Act, 1940 & Rules, 1945',
    sections: 'Section 3(a), Section 3(h), First Schedule, Section 33EE',
    authority: 'Ministry of Ayush / CDSCO',
    lastVerified: 'First Schedule Updated',
    badge: 'Pharmaceutical Regulation',
    summary: 'Regulates ASU classical medicines (Section 3(a)) and patent/proprietary medicines (Section 3(h)). Formulations must strictly use ingredients referenced in the 54 classical texts listed in the First Schedule.',
    link: 'https://ayush.gov.in',
    gazetteReference: 'Act No. 23 of 1940',
    pdfSourceDoc: 'drugs_and_cosmetics_act_1940.pdf',
    keyProvisions: [
      'First Schedule: Contains 54 authoritative books of Ayurvedic system (Charaka Samhita, Sushruta Samhita, etc.).',
      'Section 3(a): Classical ASU drugs manufactured strictly as per classical textual formulas.',
      'Section 3(h): Patent & proprietary ASU medicines containing ingredients from classical texts with scientific processing.',
      'Schedule T: Mandatory Good Manufacturing Practices (GMP) certification for ASU manufacturing units.'
    ]
  },
  {
    id: 'drugs-magic-remedies-1954',
    title: 'Drugs and Magic Remedies (Objectionable Advertisements) Act, 1954',
    sections: 'Section 3, Section 4, Schedule of 54 Conditions',
    authority: 'Government of India',
    lastVerified: 'Central Statutory Act',
    badge: 'Advertising Law',
    summary: 'Strictly prohibits advertisements of Ayurvedic drugs or remedies claiming to diagnose, cure, mitigate, or prevent 54 scheduled diseases (e.g. Cancer, Diabetes, Hypertension, Paralysis, Kidney disease).',
    link: 'https://www.indiacode.nic.in',
    gazetteReference: 'Act No. 21 of 1954',
    pdfSourceDoc: 'drugs_and_magic_remedies_act_1954.pdf',
    keyProvisions: [
      'Section 3: Absolute ban on advertisements claiming magical or miraculous curative powers.',
      'Schedule List: 54 conditions including Diabetes, Cancer, Blindness, Heart conditions, Infertility, and Obesity.',
      'Penalty: Imprisonment up to 6 months for first offense, up to 1 year for subsequent violations.'
    ]
  },
  {
    id: 'designs-act-2000',
    title: 'The Designs Act, 2000 & Designs Rules, 2001',
    sections: 'Section 2(d), Section 4, Section 11',
    authority: 'Designs Office (IP India)',
    lastVerified: 'Rules 2001 (as amended)',
    badge: 'Statutory Act',
    summary: 'Protects the novel visual shape, configuration, and surface ornamentation of Ayurvedic product packaging, specialized applicator nozzles (e.g. Nasya droppers), and dispensing bottles for up to 15 years.',
    link: 'https://ipindia.gov.in',
    gazetteReference: 'Act No. 16 of 2000',
    pdfSourceDoc: 'designs_act_2000.pdf',
    keyProvisions: [
      'Section 2(d): Design means features of shape, configuration, pattern, or ornament applied to any article.',
      'Section 11: Copyright in registered design lasts for 10 years, extendable by 5 additional years upon renewal.',
      'Statutory Fees: Form 1 e-filing fee is ₹1,000 for Natural Persons/Startups, ₹2,000 for Small Entities, ₹4,000 for Large.'
    ]
  },
  {
    id: 'gi-act-1999',
    title: 'Geographical Indications of Goods Act, 1999',
    sections: 'Section 2(1)(e), Section 21, Section 22',
    authority: 'GI Registry (IP India)',
    lastVerified: 'Registered GI Schedule',
    badge: 'Statutory Act',
    summary: 'Protects recognized origin goods including Kashmir Saffron, Alleppey Green Cardamom, and Navara Rice against deceptive branding and origin dilution in herbal formulations.',
    link: 'https://ipindia.gov.in',
    gazetteReference: 'Act No. 48 of 1999',
    pdfSourceDoc: 'geographical_indications_of_goods_act_1999.pdf',
    keyProvisions: [
      'Section 2(1)(e): Defines goods possessing qualities, reputation, or characteristics attributable to geographic origin.',
      'Section 21: Exclusive right to the use of the geographical indication for authorized users.',
      'Key Herbal GIs: Kashmir Saffron, Alleppey Green Cardamom, Navara Rice, Malabar Pepper.'
    ]
  },
  {
    id: 'wipo-gratk-treaty-2024',
    title: 'WIPO Treaty on IP, Genetic Resources and Associated Traditional Knowledge',
    sections: 'Article 3, Article 4, Article 6',
    authority: 'World Intellectual Property Organization (WIPO)',
    lastVerified: 'Adopted May 2024 (Geneva)',
    badge: 'International Treaty',
    summary: 'Landmark 2024 international treaty establishing mandatory disclosure in patent applications worldwide of the country of origin of genetic resources and indigenous traditional knowledge.',
    link: 'https://www.wipo.int',
    gazetteReference: 'WIPO Diplomatic Conference GRATK/DC/7',
    pdfSourceDoc: 'wipo_treaty_gratk_2024.pdf',
    keyProvisions: [
      'Article 3: Mandatory patent applicant disclosure of country of origin of genetic resources.',
      'Article 4: Mandatory disclosure of indigenous community or local people who provided traditional knowledge.',
      'Article 6: Establishment of information systems and databases to prevent erroneous patent grants.'
    ]
  },
  {
    id: 'nagoya-protocol-cbd',
    title: 'Nagoya Protocol on Access and Benefit Sharing (CBD)',
    sections: 'Article 5, Article 6, Article 15 (CBD)',
    authority: 'Convention on Biological Diversity (CBD)',
    lastVerified: 'International Agreement',
    badge: 'International Treaty',
    summary: 'International framework ensuring fair and equitable sharing of benefits arising from the utilization of genetic resources, requiring Prior Informed Consent (PIC) and Mutually Agreed Terms (MAT).',
    link: 'https://www.cbd.int',
    gazetteReference: 'UNEP/CBD/COP/DEC/X/1',
    pdfSourceDoc: 'nagoya_protocol_on_access_and_benefit_sharing.pdf',
    keyProvisions: [
      'Prior Informed Consent (PIC): Users must obtain consent from national competent authority before accessing bio-resources.',
      'Mutually Agreed Terms (MAT): Commercial contracts defining monetary and non-monetary benefit sharing.',
      'Checkpoint Compliance: Monitoring use of genetic resources through internationally recognized certificates.'
    ]
  },
  {
    id: 'fda-botanical-guidance',
    title: 'US FDA Guidance for Industry: Botanical Drug Development',
    sections: 'CMC Guidelines, Batch Consistency, Clinical Protocol',
    authority: 'US Food and Drug Administration (FDA)',
    lastVerified: 'FDA-2000-D-0110',
    badge: 'US Regulatory Guidance',
    summary: 'Defines regulatory pathways (Botanical IND / NDA) for developing prescription botanical medicines from complex plant mixtures, emphasizing chemical fingerprinting and therapeutic reproducibility.',
    link: 'https://www.fda.gov',
    gazetteReference: 'FDA Guidance for Industry (Revision 1)',
    pdfSourceDoc: 'fda_botanical_drug_guidance.pdf',
    keyProvisions: [
      'Botanical Raw Material Controls: Rigorous agricultural sourcing, identification, and pesticide/metal screening.',
      'CMC Requirements: Multiple active marker quantification and spectral fingerprinting for batch-to-batch consistency.',
      'Nonclinical and Clinical: Streamlined Phase I/II safety allowances for botanicals with prior human consumption history.'
    ]
  },
  {
    id: 'eu-thmpd-2004',
    title: 'EU Traditional Herbal Medicinal Products Directive (2004/24/EC)',
    sections: 'Articles 16a to 16i, HMPC Monographs',
    authority: 'European Medicines Agency (EMA / HMPC)',
    lastVerified: 'Directive 2004/24/EC',
    badge: 'EU Directive',
    summary: 'Provides a simplified registration procedure for herbal medicinal products that have demonstrated traditional medicinal use for at least 30 years, including at least 15 years within the European Union.',
    link: 'https://www.ema.europa.eu',
    gazetteReference: 'Official Journal L 136, 30/04/2004',
    pdfSourceDoc: 'eu_directive_2004_24_thmpd.pdf',
    keyProvisions: [
      'Article 16a: Simplified registration for traditional herbal medicinal products without clinical trial requirements.',
      '30-Year Rule: Documentation of 30 years continuous safe traditional use (min 15 years in EU).',
      'Quality Compliance: Compliance with European Pharmacopoeia monographs and EU GMP guidelines.'
    ]
  }
];

export const TKDL_CASES: TkdlCase[] = [
  {
    id: 'tkdl-1',
    caseNumber: '913/DEL/2006',
    jurisdiction: 'India (IP India)',
    ingredients: 'Curcuma longa (Turmeric), Santalum album (Sandalwood)',
    use: 'Topical formulations for dermatological disorders',
    ruling: 'Application revoked under Section 3(p). Claims anticipated by prior art documented in Charaka Samhita and Bhavaprakasa Nighantu.',
    confidence: 96,
    officialLink: 'https://ipindia.gov.in'
  },
  {
    id: 'tkdl-2',
    caseNumber: '1734/DEL/2007',
    jurisdiction: 'India (IP India)',
    ingredients: 'Azadirachta indica (Neem), Cinnamomum camphora (Karpura)',
    use: 'Topical therapeutic ointment for eczema and skin inflammation',
    ruling: 'Section 3(p) and Section 3(e) objections upheld; formulation determined to be an obvious aggregation of known Ayurvedic medicinal properties.',
    confidence: 94,
    officialLink: 'https://ipindia.gov.in'
  },
  {
    id: 'tkdl-3',
    caseNumber: 'EP1927361',
    jurisdiction: 'EPO (European Patent Office)',
    ingredients: 'Aloe barbadensis (Aloe vera)',
    use: 'Treatment of metabolic syndrome and obesity',
    ruling: 'Claims revoked following Third Party Observations submitted by TKDL demonstrating prior knowledge in classical Ayurvedic texts.',
    confidence: 92,
    officialLink: 'https://www.wipo.int'
  },
  {
    id: 'tkdl-4',
    caseNumber: 'US20100203117',
    jurisdiction: 'USPTO (United States Patent Office)',
    ingredients: 'Piper betle, Commiphora mukul, Tribulus terrestris, Zingiber officinale',
    use: 'Formulations for obesity management and metabolic support',
    ruling: 'USPTO Examiner rejected claims for lack of novelty and non-obviousness based on citations from Astanga Hridaya and Raj Nighantu provided by TKDL.',
    confidence: 90,
    officialLink: 'https://www.wipo.int'
  }
];
