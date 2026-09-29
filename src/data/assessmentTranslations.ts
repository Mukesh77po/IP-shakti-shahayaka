import { AppLanguage } from '../types';

export interface AssessmentDictionary {
  badge: string;
  stepIndicator: (current: number, total: number) => string;
  title: string;
  subtitle: string;
  resetBtn: string;
  steps: {
    1: string;
    2: string;
    3: string;
    4: string;
    5: string;
    6: string;
  };
  step1: {
    title: string;
    description: string;
    targetJurisdiction: string;
    jurisdictions: {
      indiaTitle: string;
      indiaDesc: string;
      intlTitle: string;
      intlDesc: string;
      bothTitle: string;
      bothDesc: string;
    };
    appLanguage: string;
    languages: {
      enTitle: string;
      enDesc: string;
      hiTitle: string;
      hiDesc: string;
      knTitle: string;
      knDesc: string;
    };
    continueBtn: string;
  };
  step2: {
    title: string;
    description: string;
    productNameLabel: string;
    productNamePlaceholder: string;
    productTypeLabel: string;
    productTypes: {
      classical: string;
      proprietary: string;
      food: string;
      cosmetic: string;
      supplement: string;
      other: string;
    };
    classicalTextLabel: string;
    classicalTextHelp: string;
    yes: string;
    no: string;
    unsure: string;
    deliveryMethodLabel: string;
    deliveryMethods: string[];
    backBtn: string;
    continueBtn: string;
  };
  step3: {
    title: string;
    description: string;
    ingredientsListLabel: string;
    emptyIngredients: string;
    ingredientNamePlaceholder: string;
    sourceIndia: string;
    sourceOutside: string;
    addCustomPlaceholder: string;
    addBtn: string;
    quickAddTitle: string;
    bioResourcesQuestion: string;
    bioResourcesHelp: string;
    backBtn: string;
    continueBtn: string;
  };
  step4: {
    title: string;
    description: string;
    intendedUseLabel: string;
    intendedUses: string[];
    rdQuestion: string;
    rdHelp: string;
    claimsLabel: string;
    claimsPlaceholder: string;
    backBtn: string;
    continueBtn: string;
  };
  step5: {
    title: string;
    description: string;
    goalsLabel: string;
    goals: string[];
    analyzingBtn: string;
    generateBtn: string;
    backBtn: string;
  };
  step6: {
    badge: string;
    defaultProduct: string;
    regimeLabel: string;
    categoryLabel: string;
    ingredientsLabel: string;
    consultAiBtn: string;
    statusCards: {
      sec3pTitle: string;
      sec3pClassicalStatus: string;
      sec3pClassicalDesc: string;
      sec3pNovelStatus: string;
      sec3pNovelDesc: string;
      nbaTitle: string;
      nbaMandatoryStatus: string;
      nbaMandatoryDesc: string;
      nbaVerifyStatus: string;
      nbaVerifyDesc: string;
      tmTitle: string;
      tmStatus: string;
      tmDesc: string;
      regRouteTitle: string;
      foodRouteStatus: string;
      foodRouteDesc: string;
      medRouteStatus: string;
      medRouteDesc: string;
    };
    statutoryCard1: {
      title: string;
      sec3pTitle: string;
      sec3pBody: string;
      sec3eTitle: string;
      sec3eBody: string;
      sec10Title: string;
      sec10Body: string;
    };
    statutoryCard2: {
      title: string;
      nbaTitle: string;
      nbaBody: string;
      amendmentTitle: string;
      amendmentBody: string;
      magicTitle: string;
      magicBody: string;
    };
    nextSteps: {
      title: string;
      step1Title: string;
      step1Desc: string;
      step1Btn: string;
      step2Title: string;
      step2Desc: string;
      step2Btn: string;
      step3Title: string;
      step3Desc: string;
      step3Btn: string;
    };
    backToGoals: string;
    startNew: string;
  };
}

export const ASSESSMENT_TRANSLATIONS: Record<AppLanguage, AssessmentDictionary> = {
  en: {
    badge: 'STATUTORY COMPLIANCE & IP AUDIT',
    stepIndicator: (cur, tot) => `Step ${cur} of ${tot}`,
    title: 'Product Assessment Flow',
    subtitle: 'Configure jurisdiction and language, enter your custom formulation, and evaluate patentability and regulatory pathways.',
    resetBtn: 'Reset Form',
    steps: {
      1: 'Jurisdiction & Language',
      2: 'Product Profile',
      3: 'Ingredients',
      4: 'Claims & Use',
      5: 'IP Goals',
      6: 'Audit Report'
    },
    step1: {
      title: 'Select Jurisdiction & Application Language',
      description: 'This configures the statutory frameworks evaluated and updates the live selector across the application.',
      targetJurisdiction: 'Target Jurisdiction',
      jurisdictions: {
        indiaTitle: 'India (Domestic Regime)',
        indiaDesc: 'Patents Act 1970 (Sec 3(p), 3(e)), Biological Diversity Act 2023, FSSAI Ayurveda Aahara, Drugs & Cosmetics Act 1940.',
        intlTitle: 'International (Global Treaties)',
        intlDesc: 'WIPO GRATK Treaty 2024, PCT patent filing, US FDA Botanical Guidance, EU Directive 2004/24/EC.',
        bothTitle: 'Both (Dual Compliance)',
        bothDesc: 'Simultaneous domestic prosecution analysis and global PCT entry requirements.'
      },
      appLanguage: 'Application Language',
      languages: {
        enTitle: 'English',
        enDesc: 'Official statutory text & standard legal nomenclature.',
        hiTitle: 'हिंदी (Hindi)',
        hiDesc: 'संपूर्ण मूल्यांकन और वैधानिक रिपोर्ट हिंदी में।',
        knTitle: 'ಕನ್ನಡ (Kannada)',
        knDesc: 'ಸಂಪೂರ್ಣ ಮೌಲ್ಯಮಾಪನ ಮತ್ತು ಶಾಸನಬದ್ಧ ವರದಿ ಕನ್ನಡದಲ್ಲಿ.'
      },
      continueBtn: 'Continue to Product Profile'
    },
    step2: {
      title: 'Product Identity & Formulation Classification',
      description: 'Enter your brand or working product title and classify its statutory legal category.',
      productNameLabel: 'Product Name / Working Title *',
      productNamePlaceholder: 'e.g. Ashwagandha Bio-Enhanced Drops',
      productTypeLabel: 'Product Legal Classification *',
      productTypes: {
        classical: 'Ayurvedic Classical Medicine (ASU - First Schedule)',
        proprietary: 'Ayurvedic Patent or Proprietary Medicine (Section 3(h))',
        food: 'Herbal Food / FSSAI Ayurveda Aahara',
        cosmetic: 'Ayurvedic Cosmetic / Topical Formulation',
        supplement: 'Dietary Supplement / Nutraceutical',
        other: 'Other / Unsure'
      },
      classicalTextLabel: 'Is this formulation directly cited in an authoritative classical text? (e.g. Charaka Samhita, Sushruta Samhita, AFI)',
      classicalTextHelp: 'Formulations matching classical texts are protected from monopolization under Section 3(p) of the Patents Act.',
      yes: 'Yes - Classical Text',
      no: 'No - Modern / Proprietary',
      unsure: 'Unsure / Under Research',
      deliveryMethodLabel: 'Formulation Delivery Method / Dosage Form',
      deliveryMethods: ['Powder / Churna', 'Tablet / Vati', 'Liquid Extract / Asava-Arishta', 'Oil / Taila / Ghrita', 'Capsule', 'Topical Cream / Lepa', 'Syrup / Kwatha', 'Other'],
      backBtn: 'Back to Jurisdiction',
      continueBtn: 'Continue to Ingredients'
    },
    step3: {
      title: 'Botanical & Mineral Ingredients List',
      description: 'Add the herbal extracts or biological components used. Source location determines National Biodiversity Authority (NBA) approval requirements.',
      ingredientsListLabel: 'Active Ingredients / Botanicals',
      emptyIngredients: 'No ingredients added yet. Type below or pick from quick-add suggestions.',
      ingredientNamePlaceholder: 'Botanical / Ingredient name',
      sourceIndia: 'Source: India',
      sourceOutside: 'Source: Outside India',
      addCustomPlaceholder: 'Type botanical name (e.g. Curcuma longa, Tulsi, Shankhpushpi)...',
      addBtn: 'Add Herb',
      quickAddTitle: 'Quick-Add Common Ayurvedic Botanicals:',
      bioResourcesQuestion: 'Does this product use biological resources procured from India?',
      bioResourcesHelp: 'Section 6 of the Biological Diversity Act mandates prior NBA Form III approval before patent sealing for Indian biological resources.',
      backBtn: 'Back to Profile',
      continueBtn: 'Continue to Claims & Use'
    },
    step4: {
      title: 'Intended Use, Novelty & Functional Claims',
      description: 'Define the therapeutic or wellness purpose. Documenting synergistic efficacy is essential to overcome Section 3(e) mere admixture objections.',
      intendedUseLabel: 'Primary Intended Purpose',
      intendedUses: [
        'General wellness and physiological balance (Dosha samya)',
        'Therapeutic management of a specific condition',
        'Food nutrition / Dietary sustenance',
        'Dermatological & cosmetic enhancement',
        'Immunity / Rasayana rejuvenation',
        'Other'
      ],
      rdQuestion: 'Was this formulation developed through novel laboratory R&D, inventive extraction, or synergistic ratios?',
      rdHelp: 'Section 3(e) requires demonstrating synergistic enhancement beyond the mere aggregation of properties of individual components.',
      claimsLabel: 'Specific Functional Claims / Therapeutic Scope',
      claimsPlaceholder: 'Describe your claims (e.g., "3x higher bioavailability of Withanolides achieved via micro-emulsification with standardized piperine")...',
      backBtn: 'Back to Ingredients',
      continueBtn: 'Continue to IP Goals'
    },
    step5: {
      title: 'IP Strategy & Regulatory Objectives',
      description: 'Select all intellectual property protections, commercial approvals, and statutory milestones you wish to achieve.',
      goalsLabel: 'Select Business & Legal Targets:',
      goals: [
        'Obtain Patent Protection (Indian Patent Office)',
        'International Patent via PCT / WIPO',
        'Register Trademark Brand Name (Class 5 or Class 30)',
        'National Biodiversity Authority (NBA Form III) Approval',
        'State Ayush Manufacturing License',
        'FSSAI Ayurveda Aahara Certification',
        'Verify TKDL & Prior-Art Exclusions'
      ],
      analyzingBtn: 'Evaluating 14 Gazette Statutes...',
      generateBtn: 'Generate Comprehensive Audit Report',
      backBtn: 'Back to Claims'
    },
    step6: {
      badge: 'REGULATORY & IP AUDIT REPORT',
      defaultProduct: 'Custom Ayurvedic Formulation',
      regimeLabel: 'Regime',
      categoryLabel: 'Category',
      ingredientsLabel: 'Ingredients',
      consultAiBtn: 'Consult Ask AI on this',
      statusCards: {
        sec3pTitle: 'Section 3(p) Patentability',
        sec3pClassicalStatus: 'High Exclusion Risk',
        sec3pClassicalDesc: 'Classical recipe barred from patenting under Section 3(p)',
        sec3pNovelStatus: 'Synergistic Validation Req.',
        sec3pNovelDesc: 'Must demonstrate unexpected synergistic effect under Section 3(e)',
        nbaTitle: 'NBA Form III (ABS)',
        nbaMandatoryStatus: 'Mandatory Prior Approval',
        nbaMandatoryDesc: 'Section 6 requires NBA approval before patent grant on Indian bio-resources',
        nbaVerifyStatus: 'Verification Required',
        nbaVerifyDesc: 'Non-Indian biological resources require proof of import and origin',
        tmTitle: 'Brand / Trademark Route',
        tmStatus: 'Class 5 / Class 30',
        tmDesc: 'Botanical names excluded under Sec 9(1)(b); coined mark recommended',
        regRouteTitle: 'FSSAI vs. Ayush Route',
        foodRouteStatus: 'Ayurveda Aahara',
        foodRouteDesc: 'Heavy metal limits (Lead <= 2.5mg/kg) & Schedule A adherence',
        medRouteStatus: 'ASU Licensing',
        medRouteDesc: 'State Ayush licensing under Drugs & Cosmetics Act Form 24D / 25D'
      },
      statutoryCard1: {
        title: 'Patents Act 1970 & TKDL Examination Roadmap',
        sec3pTitle: 'Section 3(p) Traditional Knowledge Prohibition:',
        sec3pBody: 'The Indian Patent Office (CGPDTM) cross-references all patent applications containing Ayurvedic botanicals with the Traditional Knowledge Digital Library (TKDL) and 54 First Schedule texts. Any claim directly mirroring classical use is rejected.',
        sec3eTitle: 'Section 3(e) Overcoming Mere Admixture:',
        sec3eBody: 'To secure a patent for a combination of herbs, you must furnish experimental data showing a non-obvious synergistic effect or bio-enhancement (e.g. 3x bioavailability increase using piperine fractions).',
        sec10Title: 'Section 10(4)(d) Biological Origin Disclosure:',
        sec10Body: 'The complete specification must formally disclose the exact geographical origin where the biological materials were collected in India.'
      },
      statutoryCard2: {
        title: 'Biodiversity (NBA) & Regulatory Compliance',
        nbaTitle: 'National Biodiversity Authority Form III:',
        nbaBody: 'Under Section 6 of the Biological Diversity Act, submitting Form III with the statutory fee of ₹500 is mandatory before patent grant for inventions utilizing Indian biological resources.',
        amendmentTitle: '2023 Biodiversity Amendment Exemption Check:',
        amendmentBody: 'Registered AYUSH practitioners and cultivated domestic herbs enjoy exemptions for domestic medicine manufacture, but commercial IPR filings still require NBA oversight.',
        magicTitle: 'Drugs & Magic Remedies Act 1954:',
        magicBody: 'Packaging and promotion must strictly avoid claiming cure or prevention of the 54 scheduled diseases (such as Diabetes, Cancer, Hypertension, Kidney ailments).'
      },
      nextSteps: {
        title: 'Recommended Statutory Next Steps',
        step1Title: '01. Prior-Art Search',
        step1Desc: 'Query the demo patent database and TKDL public prosecution histories for matching botanical combinations.',
        step1Btn: 'Open Patent Search →',
        step2Title: '02. Government Fee Calc',
        step2Desc: 'Calculate exact official statutory fees for Form 1, Form 9, and Form 18 based on your entity type.',
        step2Btn: 'Open Fee Estimator →',
        step3Title: '03. Consult Ask AI',
        step3Desc: 'Ask free-form legal and prosecution questions powered by Gemini AI with grounded citations.',
        step3Btn: 'Launch Dedicated AI →'
      },
      backToGoals: 'Back to Goals',
      startNew: 'Start New Assessment'
    }
  },
  hi: {
    badge: 'वैधानिक अनुपालन और बौद्धिक संपदा ऑडिट',
    stepIndicator: (cur, tot) => `चरण ${cur} / ${tot}`,
    title: 'आयुर्वेदिक उत्पाद मूल्यांकन प्रवाह',
    subtitle: 'अधिकार क्षेत्र और भाषा चुनें, अपना कस्टम फॉर्मूलेशन दर्ज करें और पेटेंट योग्यता व नियामक मार्गों का मूल्यांकन करें।',
    resetBtn: 'फॉर्म रीसेट करें',
    steps: {
      1: 'अधिकार क्षेत्र और भाषा',
      2: 'उत्पाद प्रोफ़ाइल',
      3: 'सामग्री (जड़ी-बूटियाँ)',
      4: 'दावे और इच्छित उपयोग',
      5: 'बौद्धिक संपदा लक्ष्य',
      6: 'ऑडिट रिपोर्ट'
    },
    step1: {
      title: 'अधिकार क्षेत्र एवं आवेदन भाषा चुनें',
      description: 'यह मूल्यांकन किए जाने वाले वैधानिक ढांचों को निर्धारित करता है और शीर्ष-दाएं कोने में चयनकर्ता को अपडेट करता है।',
      targetJurisdiction: 'लक्षित अधिकार क्षेत्र (Jurisdiction)',
      jurisdictions: {
        indiaTitle: 'भारत (घरेलू विनियामक ढांचा)',
        indiaDesc: 'पेटेंट अधिनियम 1970 (धारा 3(p), 3(e)), जैविक विविधता अधिनियम 2023, FSSAI आयुर्वेद आहार, औषधि एवं प्रसाधन सामग्री अधिनियम 1940।',
        intlTitle: 'अंतर्राष्ट्रीय (वैश्विक संधियाँ)',
        intlDesc: 'WIPO GRATK संधि 2024, PCT पेटेंट फाइलिंग, US FDA वानस्पतिक दिशानिर्देश, EU निर्देश 2004/24/EC।',
        bothTitle: 'दोनों (संयुक्त अनुपालन)',
        bothDesc: 'एक साथ घरेलू अभियोजन विश्लेषण और वैश्विक PCT प्रवेश आवश्यकताओं का ऑडिट।'
      },
      appLanguage: 'आवेदन भाषा (Application Language)',
      languages: {
        enTitle: 'English',
        enDesc: 'आधिकारिक कानूनी शब्दावली और मानक वैधानिक पाठ।',
        hiTitle: 'हिंदी (Hindi)',
        hiDesc: 'संपूर्ण मूल्यांकन और वैधानिक रिपोर्ट हिंदी में।',
        knTitle: 'ಕನ್ನಡ (Kannada)',
        knDesc: 'ಸಂಪೂರ್ಣ ಮೌಲ್ಯಮಾಪನ ಮತ್ತು ಶಾಸನಬದ್ಧ ವರದಿ ಕನ್ನಡದಲ್ಲಿ.'
      },
      continueBtn: 'उत्पाद प्रोफ़ाइल पर आगे बढ़ें'
    },
    step2: {
      title: 'उत्पाद पहचान एवं वैधानिक वर्गीकरण',
      description: 'अपने उत्पाद का नाम या कार्यकारी शीर्षक दर्ज करें और इसकी आधिकारिक कानूनी श्रेणी का चयन करें।',
      productNameLabel: 'उत्पाद का नाम / कार्यकारी शीर्षक *',
      productNamePlaceholder: 'उदा. अश्वगंधा बायो-एन्हांस्ड ड्रॉप्स',
      productTypeLabel: 'उत्पाद का कानूनी वर्गीकरण *',
      productTypes: {
        classical: 'आयुर्वेदिक शास्त्रीय औषधि (ASU - प्रथम अनुसूची)',
        proprietary: 'आयुर्वेदिक पेटेंट या प्रोप्राइटरी औषधि (धारा 3(h))',
        food: 'हर्बल खाद्य / FSSAI आयुर्वेद आहार',
        cosmetic: 'आयुर्वेदिक प्रसाधन सामग्री / टॉपिकल फॉर्मूलेशन',
        supplement: 'आहार पूरक / न्यूट्रास्युटिकल',
        other: 'अन्य / अनिश्चित'
      },
      classicalTextLabel: 'क्या यह फॉर्मूलेशन किसी शास्त्रीय आयुर्वेदिक ग्रंथ में सीधे उद्धृत है? (उदा. चरक संहिता, सुश्रुत संहिता, AFI)',
      classicalTextHelp: 'शास्त्रीय ग्रंथों से मेल खाने वाले फॉर्मूलेशन पेटेंट अधिनियम की धारा 3(p) के तहत एकाधिकार से वर्जित हैं।',
      yes: 'हाँ - शास्त्रीय ग्रंथ आधारित',
      no: 'नहीं - आधुनिक / प्रोप्राइटरी',
      unsure: 'अनिश्चित / अनुसंधानरत',
      deliveryMethodLabel: 'फॉर्मूलेशन वितरण विधि / खुराक का प्रकार (Dosage Form)',
      deliveryMethods: ['चूर्ण / पाउडर', 'वटी / टैबलेट', 'आसव-अरिष्ट / तरल अर्क', 'तैल / घृत', 'कैप्सूल', 'लेप / टॉपिकल क्रीम', 'क्वाथ / सिरप', 'अन्य'],
      backBtn: 'अधिकार क्षेत्र पर वापस',
      continueBtn: 'सामग्री पर आगे बढ़ें'
    },
    step3: {
      title: 'वानस्पतिक और खनिज सामग्री सूची',
      description: 'प्रयुक्त हर्बल अर्क या जैविक घटक जोड़ें। स्रोत का स्थान राष्ट्रीय जैव विविधता प्राधिकरण (NBA) अनुमोदन आवश्यकताओं को तय करता है।',
      ingredientsListLabel: 'सक्रिय तत्व / जड़ी-बूटियाँ',
      emptyIngredients: 'अभी तक कोई सामग्री नहीं जोड़ी गई है। नीचे टाइप करें या त्वरित सुझावों में से चुनें।',
      ingredientNamePlaceholder: 'वानस्पतिक नाम / सामग्री',
      sourceIndia: 'स्रोत: भारत',
      sourceOutside: 'स्रोत: भारत से बाहर',
      addCustomPlaceholder: 'वानस्पतिक नाम लिखें (उदा. Curcuma longa, Tulsi, Shankhpushpi)...',
      addBtn: 'जड़ी-बूटी जोड़ें',
      quickAddTitle: 'त्वरित-जोड़ें सामान्य आयुर्वेदिक जड़ी-बूटियाँ:',
      bioResourcesQuestion: 'क्या यह उत्पाद भारत से प्राप्त जैविक संसाधनों का उपयोग करता है?',
      bioResourcesHelp: 'जैविक विविधता अधिनियम की धारा 6 के तहत भारतीय जैविक संसाधनों पर पेटेंट सील करने से पहले NBA प्रपत्र III अनुमोदन अनिवार्य है।',
      backBtn: 'प्रोफ़ाइल पर वापस',
      continueBtn: 'दावे और उपयोग पर आगे बढ़ें'
    },
    step4: {
      title: 'इच्छित उपयोग, नवीनता और चिकित्सीय दावे',
      description: 'चिकित्सीय या स्वास्थ्य लाभ का उद्देश्य परिभाषित करें। धारा 3(e) मात्र मिश्रण आपत्तियों को दूर करने के लिए सहक्रियात्मक प्रभाव (Synergy) का प्रमाण आवश्यक है।',
      intendedUseLabel: 'प्राथमिक इच्छित उद्देश्य',
      intendedUses: [
        'सामान्य स्वास्थ्य और दोष साम्यता (Dosha balance)',
        'किसी विशिष्ट रोग या स्थिति का चिकित्सीय प्रबंधन',
        'खाद्य पोषण / आहार संतुलन',
        'त्वचा और सौंदर्य संवर्धन',
        'प्रतिरक्षा / रसायन पुनर्जीवन',
        'अन्य'
      ],
      rdQuestion: 'क्या यह फॉर्मूलेशन नवीन प्रयोगशाला अनुसंधान, अर्क विधि, या सहक्रियात्मक अनुपात द्वारा विकसित किया गया था?',
      rdHelp: 'धारा 3(e) के अनुसार घटकों के केवल गुणों के योग से परे अप्रत्याशित सहक्रियात्मक संवर्धन सिद्ध करना अनिवार्य है।',
      claimsLabel: 'विशिष्ट कार्यात्मक दावे / चिकित्सीय दायरा',
      claimsPlaceholder: 'अपने दावों का विवरण दें (उदा. "मानकीकृत पिपेरिन के साथ सूक्ष्म-पायसीकरण द्वारा विथेनोलाइड्स की 3 गुना उच्च जैवउपलब्धता")...',
      backBtn: 'सामग्री पर वापस',
      continueBtn: 'आईपी लक्ष्यों पर आगे बढ़ें'
    },
    step5: {
      title: 'बौद्धिक संपदा रणनीति और विनियामक उद्देश्य',
      description: 'उन सभी बौद्धिक संपदा सुरक्षा और वैधानिक लक्ष्यों का चयन करें जिन्हें आप हासिल करना चाहते हैं।',
      goalsLabel: 'व्यावसायिक एवं कानूनी लक्ष्य चुनें:',
      goals: [
        'पेटेंट संरक्षण प्राप्त करें (भारतीय पेटेंट कार्यालय)',
        'PCT / WIPO के माध्यम से अंतर्राष्ट्रीय पेटेंट',
        'ट्रेडमार्क ब्रांड नाम पंजीकृत करें (वर्ग 5 या वर्ग 30)',
        'राष्ट्रीय जैव विविधता प्राधिकरण (NBA Form III) अनुमोदन',
        'राज्य आयुष निर्माण लाइसेंस',
        'FSSAI आयुर्वेद आहार प्रमाणन',
        'TKDL और पूर्व-कला अपवादों की पुष्टि'
      ],
      analyzingBtn: '14 वैधानिक राजपत्रों का विश्लेषण किया जा रहा है...',
      generateBtn: 'व्यापक ऑडिट रिपोर्ट तैयार करें',
      backBtn: 'दावों पर वापस'
    },
    step6: {
      badge: 'नियामक एवं बौद्धिक संपदा ऑडिट रिपोर्ट',
      defaultProduct: 'कस्टम आयुर्वेदिक फॉर्मूलेशन',
      regimeLabel: 'अधिकार क्षेत्र',
      categoryLabel: 'श्रेणी',
      ingredientsLabel: 'सामग्री संख्या',
      consultAiBtn: 'इस पर AI से परामर्श लें',
      statusCards: {
        sec3pTitle: 'धारा 3(p) पेटेंट योग्यता',
        sec3pClassicalStatus: 'उच्च अपवर्जन जोखिम (High Risk)',
        sec3pClassicalDesc: 'शास्त्रीय नुस्खे धारा 3(p) के तहत पेटेंट से वर्जित हैं',
        sec3pNovelStatus: 'सहक्रियात्मक सत्यापन आवश्यक',
        sec3pNovelDesc: 'धारा 3(e) के तहत अप्रत्याशित सहक्रियात्मक प्रभाव (Synergy) सिद्ध करना होगा',
        nbaTitle: 'NBA प्रपत्र III (जैव विविधता)',
        nbaMandatoryStatus: 'अनिवार्य पूर्व अनुमोदन',
        nbaMandatoryDesc: 'भारतीय जैविक संसाधनों पर पेटेंट अनुदान से पहले NBA अनुमोदन धारा 6 के तहत अनिवार्य है',
        nbaVerifyStatus: 'सत्यापन आवश्यक',
        nbaVerifyDesc: 'गैर-भारतीय जैविक संसाधनों के लिए आयात और स्रोत का प्रमाण आवश्यक है',
        tmTitle: 'ब्रांड / ट्रेडमार्क मार्ग',
        tmStatus: 'वर्ग 5 / वर्ग 30',
        tmDesc: 'वानस्पतिक नाम धारा 9(1)(b) में वर्जित हैं; नया गढ़ा गया नाम अनुशंसित है',
        regRouteTitle: 'FSSAI बनाम आयुष मार्ग',
        foodRouteStatus: 'आयुर्वेद आहार (FSSAI)',
        foodRouteDesc: 'भारी धातु सीमा (सीसा <= 2.5mg/kg) और अनुसूची A का अनुपालन',
        medRouteStatus: 'आयुष निर्माण लाइसेंस (ASU)',
        medRouteDesc: 'औषधि एवं प्रसाधन सामग्री अधिनियम प्रपत्र 24D / 25D के तहत अनुमोदन'
      },
      statutoryCard1: {
        title: 'पेटेंट अधिनियम 1970 और TKDL परीक्षण रोडमैप',
        sec3pTitle: 'धारा 3(p) पारंपरिक ज्ञान निषेध:',
        sec3pBody: 'भारतीय पेटेंट कार्यालय (CGPDTM) आयुर्वेदिक जड़ी-बूटियों वाले सभी पेटेंट आवेदनों का पारंपरिक ज्ञान डिजिटल लाइब्रेरी (TKDL) और प्रथम अनुसूची के 54 ग्रंथों से मिलान करता है। शास्त्रीय उपयोग से मेल खाने वाले किसी भी दावे को खारिज कर दिया जाता है।',
        sec3eTitle: 'धारा 3(e) मात्र मिश्रण (Mere Admixture) आपत्ति का समाधान:',
        sec3eBody: 'जड़ी-बूटियों के संयोजन के लिए पेटेंट सुरक्षित करने हेतु, आपको प्रयोगात्मक डेटा प्रस्तुत करना होगा जो अप्रत्याशित सहक्रियात्मक प्रभाव या जैव-संवर्धन (उदा. पिपेरिन अंशों द्वारा जैवउपलब्धता में 3 गुना वृद्धि) सिद्ध करे।',
        sec10Title: 'धारा 10(4)(d) जैविक मूल का प्रकटीकरण:',
        sec10Body: 'पूर्ण विवरण विनिर्देश में भारत में उस सटीक भौगोलिक स्थान का खुलासा करना अनिवार्य है जहाँ से जैविक सामग्री एकत्र की गई थी।'
      },
      statutoryCard2: {
        title: 'जैव विविधता (NBA) और नियामक अनुपालन',
        nbaTitle: 'राष्ट्रीय जैव विविधता प्राधिकरण प्रपत्र III:',
        nbaBody: 'जैविक विविधता अधिनियम की धारा 6 के तहत, भारतीय जैविक संसाधनों का उपयोग करने वाले आविष्कारों के लिए पेटेंट अनुदान से पहले ₹500 के वैधानिक शुल्क के साथ प्रपत्र III जमा करना अनिवार्य है।',
        amendmentTitle: '2023 जैव विविधता संशोधन छूट समीक्षा:',
        amendmentBody: 'पंजीकृत आयुष चिकित्सकों और खेती की गई घरेलू जड़ी-बूटियों को घरेलू दवा निर्माण के लिए छूट प्राप्त है, लेकिन वाणिज्यिक बौद्धिक संपदा (IPR) फाइलिंग के लिए अभी भी NBA निरीक्षण अनिवार्य है।',
        magicTitle: 'औषधि एवं चमत्कारिक उपचार अधिनियम 1954:',
        magicBody: 'पैकेजिंग और प्रचार में 54 अनुसूचित रोगों (जैसे मधुमेह, कैंसर, उच्च रक्तचाप, गुर्दे के रोग) के इलाज या रोकथाम का दावा करने से पूरी तरह बचना चाहिए।'
      },
      nextSteps: {
        title: 'अनुशंसित वैधानिक अगले कदम',
        step1Title: '01. पूर्व-कला (Prior-Art) खोज',
        step1Desc: 'समान वानस्पतिक संयोजनों के लिए पेटेंट डेटाबेस और TKDL अभियोजन इतिहास की खोज करें।',
        step1Btn: 'पेटेंट खोज खोलें →',
        step2Title: '02. सरकारी शुल्क कैलकुलेटर',
        step2Desc: 'अपनी इकाई प्रकार के आधार पर प्रपत्र 1, प्रपत्र 9 और प्रपत्र 18 के सटीक आधिकारिक वैधानिक शुल्क की गणना करें।',
        step2Btn: 'शुल्क कैलकुलेटर खोलें →',
        step3Title: '03. AI कानूनी सहायक से पूछें',
        step3Desc: 'राजपत्र विधियों पर आधारित उद्धरणों के साथ पेटेंट और नियामक प्रश्नों के उत्तर प्राप्त करें।',
        step3Btn: 'AI सहायक प्रारंभ करें →'
      },
      backToGoals: 'लक्ष्यों पर वापस',
      startNew: 'नया मूल्यांकन शुरू करें'
    }
  },
  kn: {
    badge: 'ಶಾಸನಬದ್ಧ ಅನುಸರಣೆ ಮತ್ತು ಐಪಿ ಆಡಿಟ್',
    stepIndicator: (cur, tot) => `ಹಂತ ${cur} / ${tot}`,
    title: 'ಆಯುರ್ವೇದ ಉತ್ಪನ್ನ ಮೌಲ್ಯಮಾಪನ ಪ್ರಕ್ರಿಯೆ',
    subtitle: 'ನ್ಯಾಯವ್ಯಾಪ್ತಿ ಮತ್ತು ಭಾಷೆಯನ್ನು ಕಾನ್ಫಿಗರ್ ಮಾಡಿ, ನಿಮ್ಮ ಸೂತ್ರೀಕರಣವನ್ನು ನಮೂದಿಸಿ ಮತ್ತು ಪೇಟೆಂಟ್ ಸಾಮರ್ಥ್ಯ ಹಾಗೂ ನಿಯಂತ್ರಕ ಮಾರ್ಗಗಳನ್ನು ಮೌಲ್ಯಮಾಪನ ಮಾಡಿ.',
    resetBtn: 'ಫಾರ್ಮ್ ಮರುಹೊಂದಿಸಿ',
    steps: {
      1: 'ನ್ಯಾಯವ್ಯಾಪ್ತಿ ಮತ್ತು ಭಾಷೆ',
      2: 'ಉತ್ಪನ್ನ ವಿವರ',
      3: 'ಸಸ್ಯಶಾಸ್ತ್ರೀಯ ಪದಾರ್ಥಗಳು',
      4: 'ಹಕ್ಕುಗಳು ಮತ್ತು ಬಳಕೆ',
      5: 'ಐಪಿ ಗುರಿಗಳು',
      6: 'ಆಡಿಟ್ ವರದಿ'
    },
    step1: {
      title: 'ನ್ಯಾಯವ್ಯಾಪ್ತಿ ಮತ್ತು ಅಪ್ಲಿಕೇಶನ್ ಭಾಷೆಯನ್ನು ಆಯ್ಕೆಮಾಡಿ',
      description: 'ಇದು ಮೌಲ್ಯಮಾಪನ ಮಾಡಲಾದ ಶಾಸನಬದ್ಧ ಚೌಕಟ್ಟುಗಳನ್ನು ನಿರ್ಧರಿಸುತ್ತದೆ ಮತ್ತು ಅಪ್ಲಿಕೇಶನ್‌ನ ಲೈವ್ ಸೆಲೆಕ್ಟರ್ ಅನ್ನು ನವೀಕರಿಸುತ್ತದೆ.',
      targetJurisdiction: 'ಗುರಿ ನ್ಯಾಯವ್ಯಾಪ್ತಿ (Target Jurisdiction)',
      jurisdictions: {
        indiaTitle: 'ಭಾರತ (ದೇಶೀಯ ನಿಯಮಗಳು)',
        indiaDesc: 'ಪೇಟೆಂಟ್ ಕಾಯ್ದೆ 1970 (ಸೆಕ್ಷನ್ 3(p), 3(e)), ಜೈವಿಕ ವೈವಿಧ್ಯತೆ ಕಾಯ್ದೆ 2023, FSSAI ಆಯುರ್ವೇದ ಆಹಾರ, ಔಷಧ ಮತ್ತು ಸೌಂದರ್ಯವರ್ಧಕ ಕಾಯ್ದೆ 1940.',
        intlTitle: 'ಅಂತರರಾಷ್ಟ್ರೀಯ (ಜಾಗತಿಕ ಒಪ್ಪಂದಗಳು)',
        intlDesc: 'WIPO GRATK ಒಪ್ಪಂದ 2024, PCT ಪೇಟೆಂಟ್ ಸಲ್ಲಿಕೆ, US FDA ಬೊಟಾನಿಕಲ್ ಮಾರ್ಗಸೂಚಿಗಳು, EU ನಿರ್ದೇಶನ 2004/24/EC.',
        bothTitle: 'ಎರಡೂ (ದ್ವಿಮುಖ ಅನುಸರಣೆ)',
        bothDesc: 'ದೇಶೀಯ ಮತ್ತು ಜಾಗತಿಕ PCT ಪೇಟೆಂಟ್ ಪ್ರವೇಶದ ಅವಶ್ಯಕತೆಗಳ ಏಕಕಾಲಿಕ ವಿಶ್ಲೇಷಣೆ.'
      },
      appLanguage: 'ಅಪ್ಲಿಕೇಶನ್ ಭಾಷೆ (Application Language)',
      languages: {
        enTitle: 'English',
        enDesc: 'ಅಧಿಕೃತ ಕಾನೂನು ಪರಿಭಾಷೆ ಮತ್ತು ಪ್ರಮಾಣಿತ ಶಾಸನಬದ್ಧ ಪಠ್ಯ.',
        hiTitle: 'हिंदी (Hindi)',
        hiDesc: 'संपूर्ण मूल्यांकन और वैधानिक रिपोर्ट हिंदी में।',
        knTitle: 'ಕನ್ನಡ (Kannada)',
        knDesc: 'ಸಂಪೂರ್ಣ ಮೌಲ್ಯಮಾಪನ ಮತ್ತು ಶಾಸನಬದ್ಧ ವರದಿ ಕನ್ನಡದಲ್ಲಿ.'
      },
      continueBtn: 'ಉತ್ಪನ್ನ ವಿವರಕ್ಕೆ ಮುಂದುವರಿಯಿರಿ'
    },
    step2: {
      title: 'ಉತ್ಪನ್ನದ ಗುರುತು ಮತ್ತು ಕಾನೂನು ವರ್ಗೀಕರಣ',
      description: 'ನಿಮ್ಮ ಉತ್ಪನ್ನದ ಹೆಸರು ಅಥವಾ ಕಾರ್ಯಕಾರಿ ಶೀರ್ಷಿಕೆಯನ್ನು ನಮೂದಿಸಿ ಮತ್ತು ಅದರ ಕಾನೂನು ವರ್ಗವನ್ನು ಆಯ್ಕೆಮಾಡಿ.',
      productNameLabel: 'ಉತ್ಪನ್ನದ ಹೆಸರು / ಕಾರ್ಯಕಾರಿ ಶೀರ್ಷಿಕೆ *',
      productNamePlaceholder: 'ಉದಾ. ಅಶ್ವಗಂಧ ಬಯೋ-ಎನ್‌ಹ್ಯಾನ್ಸ್ಡ್ ಡ್ರಾಪ್ಸ್',
      productTypeLabel: 'ಉತ್ಪನ್ನದ ಕಾನೂನು ವರ್ಗೀಕರಣ *',
      productTypes: {
        classical: 'ಆಯುರ್ವೇದ ಶಾಸ್ತ್ರೀಯ ಔಷಧ (ASU - ಮೊದಲ ವೇಳಾಪಟ್ಟಿ)',
        proprietary: 'ಆಯುರ್ವೇದ ಪೇಟೆಂಟ್ ಅಥವಾ ಪ್ರೊಪ್ರೈಟರಿ ಔಷಧ (ಸೆಕ್ಷನ್ 3(h))',
        food: 'ಗಿಡಮೂಲಿಕೆ ಆಹಾರ / FSSAI ಆಯುರ್ವೇದ ಆಹಾರ',
        cosmetic: 'ಆಯುರ್ವೇದ ಸೌಂದರ್ಯವರ್ಧಕ / ಲೇಪನ ಸೂತ್ರೀಕರಣ',
        supplement: 'ಆಹಾರ ಪೂರಕ / ನ್ಯೂಟ್ರಾಸ್ಯುಟಿಕಲ್',
        other: 'ಇತರ / ಅನಿಶ್ಚಿತ'
      },
      classicalTextLabel: 'ಈ ಸೂತ್ರೀಕರಣವನ್ನು ಅಧಿಕೃತ ಶಾಸ್ತ್ರೀಯ ಗ್ರಂಥದಲ್ಲಿ ನೇರವಾಗಿ ಉಲ್ಲೇಖಿಸಲಾಗಿದೆಯೇ? (ಉದಾ. ಚರಕ ಸಂಹಿತೆ, ಸುಶ್ರುತ ಸಂಹಿತೆ, AFI)',
      classicalTextHelp: 'ಶಾಸ್ತ್ರೀಯ ಗ್ರಂಥಗಳಲ್ಲಿರುವ ಸೂತ್ರೀಕರಣಗಳನ್ನು ಪೇಟೆಂಟ್ ಕಾಯ್ದೆಯ ಸೆಕ್ಷನ್ 3(p) ಅಡಿಯಲ್ಲಿ ಏಕಸ್ವಾಮ್ಯದಿಂದ ನಿರ್ಬಂಧಿಸಲಾಗಿದೆ.',
      yes: 'ಹೌದು - ಶಾಸ್ತ್ರೀಯ ಗ್ರಂಥ ಆಧಾರಿತ',
      no: 'ಇಲ್ಲ - ಆಧುನಿಕ / ಪ್ರೊಪ್ರೈಟರಿ',
      unsure: 'ಅನಿಶ್ಚಿತ / ಸಂಶೋಧನೆಯಲ್ಲಿದೆ',
      deliveryMethodLabel: 'ಸೂತ್ರೀಕರಣ ವಿತರಣಾ ವಿಧಾನ / ಡೋಸೇಜ್ ರೂಪ (Dosage Form)',
      deliveryMethods: ['ಚೂರ್ಣ / ಪುಡಿ', 'ವಟಿ / ಮಾತ್ರೆ', 'ಆಸವ-ಅರಿಷ್ಟ / ದ್ರವ ಸಾರ', 'ತೈಲ / ಘೃತ', 'ಕ್ಯಾಪ್ಸುಲ್', 'ಲೇಪ / ಕ್ರೀಮ್', 'ಕಷಾಯ / ಸಿರಪ್', 'ಇತರ'],
      backBtn: 'ನ್ಯಾಯವ್ಯಾಪ್ತಿಗೆ ಹಿಂತಿರುಗಿ',
      continueBtn: 'ಪದಾರ್ಥಗಳಿಗೆ ಮುಂದುವರಿಯಿರಿ'
    },
    step3: {
      title: 'ಸಸ್ಯಶಾಸ್ತ್ರೀಯ ಮತ್ತು ಖನಿಜ ಪದಾರ್ಥಗಳ ಪಟ್ಟಿ',
      description: 'ಬಳಸಿದ ಗಿಡಮೂಲಿಕೆ ಸಾರಗಳನ್ನು ಸೇರಿಸಿ. ಮೂಲ ಸ್ಥಳವು ರಾಷ್ಟ್ರೀಯ ಜೈವಿಕ ವೈವಿಧ್ಯ ಪ್ರಾಧಿಕಾರದ (NBA) ಅನುಮೋದನೆಯ ಅಗತ್ಯವನ್ನು ನಿರ್ಧರಿಸುತ್ತದೆ.',
      ingredientsListLabel: 'ಸಕ್ರಿಯ ಪದಾರ್ಥಗಳು / ಗಿಡಮೂಲಿಕೆಗಳು',
      emptyIngredients: 'ಇನ್ನೂ ಯಾವುದೇ ಪದಾರ್ಥಗಳನ್ನು ಸೇರಿಸಲಾಗಿಲ್ಲ. ಕೆಳಗೆ ಟೈಪ್ ಮಾಡಿ ಅಥವಾ ತ್ವರಿತ ಸಲಹೆಗಳಿಂದ ಆಯ್ಕೆಮಾಡಿ.',
      ingredientNamePlaceholder: 'ಸಸ್ಯಶಾಸ್ತ್ರೀಯ / ಪದಾರ್ಥದ ಹೆಸರು',
      sourceIndia: 'ಮೂಲ: ಭಾರತ',
      sourceOutside: 'ಮೂಲ: ಭಾರತದ ಹೊರಗೆ',
      addCustomPlaceholder: 'ಗಿಡಮೂಲಿಕೆ ಹೆಸರು ಬರೆಯಿರಿ (ಉದಾ. Curcuma longa, ತುಳಸಿ, ಶಂಖಪುಷ್ಪಿ)...',
      addBtn: 'ಗಿಡಮೂಲಿಕೆ ಸೇರಿಸಿ',
      quickAddTitle: 'ಸಾಮಾನ್ಯ ಆಯುರ್ವೇದ ಗಿಡಮೂಲಿಕೆಗಳನ್ನು ತ್ವರಿತವಾಗಿ ಸೇರಿಸಿ:',
      bioResourcesQuestion: 'ಈ ಉತ್ಪನ್ನವು ಭಾರತದಿಂದ ಪಡೆದ ಜೈವಿಕ ಸಂಪನ್ಮೂಲಗಳನ್ನು ಬಳಸುತ್ತದೆಯೇ?',
      bioResourcesHelp: 'ಜೈವಿಕ ವೈವಿಧ್ಯತೆ ಕಾಯ್ದೆಯ ಸೆಕ್ಷನ್ 6 ರ ಪ್ರಕಾರ ಭಾರತೀಯ ಜೈವಿಕ ಸಂಪನ್ಮೂಲಗಳ ಮೇಲಿನ ಪೇಟೆಂಟ್‌ಗೆ NBA ಫಾರ್ಮ್ III ಅನುಮೋದನೆ ಕಡ್ಡಾಯವಾಗಿದೆ.',
      backBtn: 'ವಿವರಕ್ಕೆ ಹಿಂತಿರುಗಿ',
      continueBtn: 'ಹಕ್ಕುಗಳು ಮತ್ತು ಬಳಕೆಗೆ ಮುಂದುವರಿಯಿರಿ'
    },
    step4: {
      title: 'ಉದ್ದೇಶಿತ ಬಳಕೆ, ನಾವೀನ್ಯತೆ ಮತ್ತು ಕ್ರಿಯಾತ್ಮಕ ಹಕ್ಕುಗಳು',
      description: 'ಚಿಕಿತ್ಸಕ ಅಥವಾ ಕ್ಷೇಮದ ಉದ್ದೇಶವನ್ನು ವಿವರಿಸಿ. ಸೆಕ್ಷನ್ 3(e) ಆಕ್ಷೇಪಣೆಗಳನ್ನು ನಿವಾರಿಸಲು ಸಿನರ್ಜಿಸ್ಟಿಕ್ ಪರಿಣಾಮದ (Synergy) ಪುರಾವೆ ಅಗತ್ಯವಿದೆ.',
      intendedUseLabel: 'ಪ್ರಾಥಮಿಕ ಉದ್ದೇಶಿತ ಬಳಕೆ',
      intendedUses: [
        'ಸಾಮಾನ್ಯ ಕ್ಷೇಮ ಮತ್ತು ದೋಷ ಸಮತೋಲನ (Dosha balance)',
        'ನಿರ್ದಿಷ್ಟ ಆರೋಗ್ಯ ಸ್ಥಿತಿಯ ಚಿಕಿತ್ಸಕ ನಿರ್ವಹಣೆ',
        'ಆಹಾರ ಪೋಷಣೆ / ದೈನಂದಿನ ಪೂರಕ',
        'ಚರ್ಮರೋಗ ಮತ್ತು ಸೌಂದರ್ಯ ವರ್ಧನೆ',
        'ರೋಗನಿರೋಧಕ ಶಕ್ತಿ / ರಸಾಯನ ಪುನರುಜ್ಜೀವನ',
        'ಇತರ'
      ],
      rdQuestion: 'ಈ ಸೂತ್ರೀಕರಣವನ್ನು ನವೀನ ಪ್ರಯೋಗಾಲಯ R&D ಅಥವಾ ಸಿನರ್ಜಿಸ್ಟಿಕ್ ಅನುಪಾತಗಳ ಮೂಲಕ ಅಭಿವೃದ್ಧಿಪಡಿಸಲಾಗಿದೆಯೇ?',
      rdHelp: 'ಸೆಕ್ಷನ್ 3(e) ಪ್ರಕಾರ ಪ್ರತ್ಯೇಕ ಘಟಕಗಳ ಸರಳ ಗುಣಲಕ್ಷಣಗಳ ಒಟ್ಟುಗೂಡಿಸುವಿಕೆಯನ್ನು ಮೀರಿದ ಸಿನರ್ಜಿಸ್ಟಿಕ್ ಪರಿಣಾಮವನ್ನು ಸಾಬೀತುಪಡಿಸಬೇಕು.',
      claimsLabel: 'ನಿರ್ದಿಷ್ಟ ಕ್ರಿಯಾತ್ಮಕ ಹಕ್ಕುಗಳು / ಚಿಕಿತ್ಸಕ ವ್ಯಾಪ್ತಿ',
      claimsPlaceholder: 'ನಿಮ್ಮ ಹಕ್ಕುಗಳನ್ನು ವಿವರಿಸಿ (ಉದಾ. "ಪ್ರಮಾಣಿತ ಪೈಪರಿನ್ ಜೊತೆ ಮೈಕ್ರೋ-ಎಮಲ್ಸಿಫಿಕೇಶನ್ ಮೂಲಕ ವಿಥನೋಲೈಡ್‌ಗಳ 3 ಪಟ್ಟು ಹೆಚ್ಚಿನ ಜೈವಿಕ ಲಭ್ಯತೆ")...',
      backBtn: 'ಪದಾರ್ಥಗಳಿಗೆ ಹಿಂತಿರುಗಿ',
      continueBtn: 'ಐಪಿ ಗುರಿಗಳಿಗೆ ಮುಂದುವರಿಯಿರಿ'
    },
    step5: {
      title: 'ಬೌದ್ಧಿಕ ಆಸ್ತಿ ತಂತ್ರ ಮತ್ತು ನಿಯಂತ್ರಕ ಉದ್ದೇಶಗಳು',
      description: 'ನೀವು ಸಾಧಿಸಲು ಬಯಸುವ ಎಲ್ಲಾ ಬೌದ್ಧಿಕ ಆಸ್ತಿ ರಕ್ಷಣೆಗಳು ಮತ್ತು ಶಾಸನಬದ್ಧ ಗುರಿಗಳನ್ನು ಆಯ್ಕೆಮಾಡಿ.',
      goalsLabel: 'ವ್ಯಾಪಾರ ಮತ್ತು ಕಾನೂನು ಗುರಿಗಳನ್ನು ಆಯ್ಕೆಮಾಡಿ:',
      goals: [
        'ಪೇಟೆಂಟ್ ರಕ್ಷಣೆ ಪಡೆಯಿರಿ (ಭಾರತೀಯ ಪೇಟೆಂಟ್ ಕಚೇರಿ)',
        'PCT / WIPO ಮೂಲಕ ಅಂತರರಾಷ್ಟ್ರೀಯ ಪೇಟೆಂಟ್',
        'ಟ್ರೇಡ್‌ಮಾರ್ಕ್ ಬ್ರ್ಯಾಂಡ್ ಹೆಸರು ನೋಂದಾಯಿಸಿ (ವರ್ಗ 5 ಅಥವಾ 30)',
        'ರಾಷ್ಟ್ರೀಯ ಜೈವಿಕ ವೈವಿಧ್ಯ ಪ್ರಾಧಿಕಾರ (NBA Form III) ಅನುಮೋದನೆ',
        'ರಾಜ್ಯ ಆಯುಷ್ ಉತ್ಪಾದನಾ ಪರವಾನಗಿ',
        'FSSAI ಆಯುರ್ವೇದ ಆಹಾರ ಪ್ರಮಾಣೀಕರಣ',
        'TKDL ಮತ್ತು ಹಿಂದಿನ ಕಲೆಯ ಹೊರಗಿಡುವಿಕೆಗಳ ಪರಿಶೀಲನೆ'
      ],
      analyzingBtn: '14 ಶಾಸನಬದ್ಧ ಗೆಜೆಟ್‌ಗಳ ವಿಶ್ಲೇಷಣೆ ನಡೆಯುತ್ತಿದೆ...',
      generateBtn: 'ಸಮಗ್ರ ಆಡಿಟ್ ವರದಿ ತಯಾರಿಸಿ',
      backBtn: 'ಹಕ್ಕುಗಳಿಗೆ ಹಿಂತಿರುಗಿ'
    },
    step6: {
      badge: 'ನಿಯಂತ್ರಕ ಮತ್ತು ಬೌದ್ಧಿಕ ಆಸ್ತಿ ಆಡಿಟ್ ವರದಿ',
      defaultProduct: 'ಕಸ್ಟಮ್ ಆಯುರ್ವೇದ ಸೂತ್ರೀಕರಣ',
      regimeLabel: 'ನ್ಯಾಯವ್ಯಾಪ್ತಿ',
      categoryLabel: 'ವರ್ಗ',
      ingredientsLabel: 'ಪದಾರ್ಥಗಳ ಸಂಖ್ಯೆ',
      consultAiBtn: 'ಇದರ ಬಗ್ಗೆ AI ಸಲಹೆ ಪಡೆಯಿರಿ',
      statusCards: {
        sec3pTitle: 'ಸೆಕ್ಷನ್ 3(p) ಪೇಟೆಂಟ್ ಸಾಮರ್ಥ್ಯ',
        sec3pClassicalStatus: 'ಹೆಚ್ಚಿನ ಹೊರಗಿಡುವಿಕೆ ಅಪಾಯ (High Risk)',
        sec3pClassicalDesc: 'ಶಾಸ್ತ್ರೀಯ ಪಾಕವಿಧಾನಗಳನ್ನು ಸೆಕ್ಷನ್ 3(p) ಅಡಿಯಲ್ಲಿ ಪೇಟೆಂಟ್‌ನಿಂದ ನಿಷೇಧಿಸಲಾಗಿದೆ',
        sec3pNovelStatus: 'ಸಿನರ್ಜಿಸ್ಟಿಕ್ ಪರಿಶೀಲನೆ ಅಗತ್ಯ',
        sec3pNovelDesc: 'ಸೆಕ್ಷನ್ 3(e) ಅಡಿಯಲ್ಲಿ ಅನಿರೀಕ್ಷಿತ ಸಿನರ್ಜಿಸ್ಟಿಕ್ ಪರಿಣಾಮವನ್ನು ಪ್ರದರ್ಶಿಸಬೇಕು',
        nbaTitle: 'NBA ಫಾರ್ಮ್ III (ಜೈವಿಕ ವೈವಿಧ್ಯತೆ)',
        nbaMandatoryStatus: 'ಕಡ್ಡಾಯ ಪೂರ್ವಾನುಮೋದನೆ',
        nbaMandatoryDesc: 'ಭಾರತೀಯ ಜೈವಿಕ ಸಂಪನ್ಮೂಲಗಳ ಮೇಲಿನ ಪೇಟೆಂಟ್‌ಗೆ ಸೆಕ್ಷನ್ 6 ರ ಅಡಿಯಲ್ಲಿ NBA ಅನುಮೋದನೆ ಕಡ್ಡಾಯ',
        nbaVerifyStatus: 'ಪರಿಶೀಲನೆ ಅಗತ್ಯವಿದೆ',
        nbaVerifyDesc: 'ಭಾರತೀಯವಲ್ಲದ ಜೈವಿಕ ಸಂಪನ್ಮೂಲಗಳಿಗೆ ಆಮದು ಮತ್ತು ಮೂಲದ ಪುರಾವೆ ಅಗತ್ಯವಿದೆ',
        tmTitle: 'ಬ್ರ್ಯಾಂಡ್ / ಟ್ರೇಡ್‌ಮಾರ್ಕ್ ಮಾರ್ಗ',
        tmStatus: 'ವರ್ಗ 5 / ವರ್ಗ 30',
        tmDesc: 'ಸಸ್ಯಶಾಸ್ತ್ರೀಯ ಹೆಸರುಗಳನ್ನು ಸೆಕ್ಷನ್ 9(1)(b) ಅಡಿಯಲ್ಲಿ ನಿಷೇಧಿಸಲಾಗಿದೆ; ಹೊಸ ಹೆಸರನ್ನು ಶಿಫಾರಸು ಮಾಡಲಾಗಿದೆ',
        regRouteTitle: 'FSSAI vs. ಆಯುಷ್ ಮಾರ್ಗ',
        foodRouteStatus: 'ಆಯುರ್ವೇದ ಆಹಾರ (FSSAI)',
        foodRouteDesc: 'ಹೆವಿ ಮೆಟಲ್ ಮಿತಿಗಳು (ಸೀಸ <= 2.5mg/kg) ಮತ್ತು ವೇಳಾಪಟ್ಟಿ A ಅನುಸರಣೆ',
        medRouteStatus: 'ಆಯುಷ್ ಪರವಾನಗಿ (ASU)',
        medRouteDesc: 'ಔಷಧ ಮತ್ತು ಸೌಂದರ್ಯವರ್ಧಕ ಕಾಯ್ದೆ ಫಾರ್ಮ್ 24D / 25D ಅಡಿಯಲ್ಲಿ ಅನುಮೋದನೆ'
      },
      statutoryCard1: {
        title: 'ಪೇಟೆಂಟ್ ಕಾಯ್ದೆ 1970 ಮತ್ತು TKDL ತಪಾಸಣೆ ಮಾರ್ಗಸೂಚಿ',
        sec3pTitle: 'ಸೆಕ್ಷನ್ 3(p) ಸಾಂಪ್ರದಾಯಿಕ ಜ್ಞಾನ ನಿಷೇಧ:',
        sec3pBody: 'ಭಾರತೀಯ ಪೇಟೆಂಟ್ ಕಚೇರಿಯು (CGPDTM) ಆಯುರ್ವೇದ ಗಿಡಮೂಲಿಕೆಗಳನ್ನು ಒಳಗೊಂಡಿರುವ ಎಲ್ಲಾ ಪೇಟೆಂಟ್ ಅರ್ಜಿಗಳನ್ನು ಸಾಂಪ್ರದಾಯಿಕ ಜ್ಞಾನ ಡಿಜಿಟಲ್ ಲೈಬ್ರರಿ (TKDL) ಮತ್ತು 54 ಶಾಸ್ತ್ರೀಯ ಗ್ರಂಥಗಳೊಂದಿಗೆ ತಾಳೆ ನೋಡುತ್ತದೆ. ಶಾಸ್ತ್ರೀಯ ಬಳಕೆಯನ್ನು ನೇರವಾಗಿ ಪ್ರತಿಬಿಂಬಿಸುವ ಯಾವುದೇ ಹಕ್ಕನ್ನು ತಿರಸ್ಕರಿಸಲಾಗುತ್ತದೆ.',
        sec3eTitle: 'ಸೆಕ್ಷನ್ 3(e) ಸರಳ ಮಿಶ್ರಣ (Mere Admixture) ಆಕ್ಷೇಪಣೆ ಪರಿಹಾರ:',
        sec3eBody: 'ಗಿಡಮೂಲಿಕೆಗಳ ಸಂಯೋಜನೆಗೆ ಪೇಟೆಂಟ್ ಪಡೆಯಲು, ಸರಳ ಗುಣಲಕ್ಷಣಗಳ ಮೊತ್ತವನ್ನು ಮೀರಿದ ಅನಿರೀಕ್ಷಿತ ಸಿನರ್ಜಿಸ್ಟಿಕ್ ಪರಿಣಾಮ ಅಥವಾ ಜೈವಿಕ ವರ್ಧನೆಯನ್ನು (ಉದಾ. ಪೈಪರಿನ್ ಅಂಶಗಳಿಂದ ಜೈವಿಕ ಲಭ್ಯತೆ 3 ಪಟ್ಟು ಹೆಚ್ಚಳ) ತೋರಿಸುವ ಪ್ರಾಯೋಗಿಕ ದತ್ತಾಂಶವನ್ನು ಸಲ್ಲಿಸಬೇಕು.',
        sec10Title: 'ಸೆಕ್ಷನ್ 10(4)(d) ಜೈವಿಕ ಮೂಲ ಪ್ರಕಟಣೆ:',
        sec10Body: 'ಭಾರತದಲ್ಲಿ ಜೈವಿಕ ವಸ್ತುಗಳನ್ನು ಸಂಗ್ರಹಿಸಿದ ನಿಖರವಾದ ಭೌಗೋಳಿಕ ಮೂಲವನ್ನು ವಿವರಣೆಯಲ್ಲಿ ಔಪಚಾರಿಕವಾಗಿ ಬಹಿರಂಗಪಡಿಸಬೇಕು.'
      },
      statutoryCard2: {
        title: 'ಜೈವಿಕ ವೈವಿಧ್ಯತೆ (NBA) ಮತ್ತು ನಿಯಂತ್ರಕ ಅನುಸರಣೆ',
        nbaTitle: 'ರಾಷ್ಟ್ರೀಯ ಜೈವಿಕ ವೈವಿಧ್ಯ ಪ್ರಾಧಿಕಾರ ಫಾರ್ಮ್ III:',
        nbaBody: 'ಜೈವಿಕ ವೈವಿಧ್ಯತೆ ಕಾಯ್ದೆಯ ಸೆಕ್ಷನ್ 6 ರ ಅಡಿಯಲ್ಲಿ, ಭಾರತೀಯ ಜೈವಿಕ ಸಂಪನ್ಮೂಲಗಳನ್ನು ಬಳಸುವ ಆವಿಷ್ಕಾರಗಳಿಗೆ ಪೇಟೆಂಟ್ ನೀಡುವ ಮೊದಲು ₹500 ಶಾಸನಬದ್ಧ ಶುಲ್ಕದೊಂದಿಗೆ ಫಾರ್ಮ್ III ಅನ್ನು ಸಲ್ಲಿಸುವುದು ಕಡ್ಡಾಯವಾಗಿದೆ.',
        amendmentTitle: '2023 ಜೈವಿಕ ವೈವಿಧ್ಯತೆ ತಿದ್ದುಪಡಿ ವಿನಾಯಿತಿ ಪರಿಶೀಲನೆ:',
        amendmentBody: 'ನೋಂದಾಯಿತ ಆಯುಷ್ ವೈದ್ಯರು ಮತ್ತು ಕೃಷಿ ಮಾಡಿದ ದೇಶೀಯ ಗಿಡಮೂಲಿಕೆಗಳು ದೇಶೀಯ ಔಷಧ ತಯಾರಿಕೆಗೆ ವಿನಾಯಿತಿಗಳನ್ನು ಆನಂದಿಸುತ್ತವೆ, ಆದರೆ ವಾಣಿಜ್ಯ ಬೌದ್ಧಿಕ ಆಸ್ತಿ (IPR) ಸಲ್ಲಿಕೆಗಳಿಗೆ ಇನ್ನೂ NBA ಮೇಲ್ವಿಚಾರಣೆಯ ಅಗತ್ಯವಿದೆ.',
        magicTitle: 'ಔಷಧ ಮತ್ತು ಮ್ಯಾಜಿಕ್ ಪರಿಹಾರಗಳ ಕಾಯ್ದೆ 1954:',
        magicBody: 'ಪ್ಯಾಕೇಜಿಂಗ್ ಮತ್ತು ಪ್ರಚಾರದಲ್ಲಿ 54 ನಿಗದಿತ ಕಾಯಿಲೆಗಳನ್ನು (ಮಧುಮೇಹ, ಕ್ಯಾನ್ಸರ್, ಅಧಿಕ ರಕ್ತದೊತ್ತಡ, ಮೂತ್ರಪಿಂಡ ಕಾಯಿಲೆಗಳು) ಗುಣಪಡಿಸುವ ಅಥವಾ ತಡೆಗಟ್ಟುವ ಯಾವುದೇ ಹಕ್ಕುಗಳನ್ನು ಕಟ್ಟುನಿಟ್ಟಾಗಿ ತಪ್ಪಿಸಬೇಕು.'
      },
      nextSteps: {
        title: 'ಶಿಫಾರಸು ಮಾಡಲಾದ ಮುಂದಿನ ಶಾಸನಬದ್ಧ ಹಂತಗಳು',
        step1Title: '01. ಹಿಂದಿನ ಕಲೆ (Prior-Art) ಹುಡುಕಾಟ',
        step1Desc: 'ಹೊಂದಾಣಿಕೆಯಾಗುವ ಸಸ್ಯಶಾಸ್ತ್ರೀಯ ಸಂಯೋಜನೆಗಳಿಗಾಗಿ ಪೇಟೆಂಟ್ ಡೇಟಾಬೇಸ್ ಮತ್ತು TKDL ಇತಿಹಾಸವನ್ನು ಹುಡುಕಿ.',
        step1Btn: 'ಪೇಟೆಂಟ್ ಹುಡುಕಾಟ ತೆರೆಯಿರಿ →',
        step2Title: '02. ಸರ್ಕಾರಿ ಶುಲ್ಕ ಕ್ಯಾಲ್ಕುಲೇಟರ್',
        step2Desc: 'ನಿಮ್ಮ ಸಂಸ್ಥೆಯ ಪ್ರಕಾರದ ಆಧಾರದ ಮೇಲೆ ಫಾರ್ಮ್ 1, ಫಾರ್ಮ್ 9 ಮತ್ತು ಫಾರ್ಮ್ 18 ಗಾಗಿ ನಿಖರವಾದ ಅಧಿಕೃತ ಶುಲ್ಕವನ್ನು ಲೆಕ್ಕಹಾಕಿ.',
        step2Btn: 'ಶುಲ್ಕ ಕ್ಯಾಲ್ಕುಲೇಟರ್ ತೆರೆಯಿರಿ →',
        step3Title: '03. AI ಕಾನೂನು ಸಹಾಯಕವನ್ನು ಸಂಪರ್ಕಿಸಿ',
        step3Desc: 'ಗೆಜೆಟ್ ಕಾಯ್ದೆಗಳ ಆಧಾರಿತ ಉಲ್ಲೇಖಗಳೊಂದಿಗೆ ಪೇಟೆಂಟ್ ಮತ್ತು ನಿಯಂತ್ರಕ ಪ್ರಶ್ನೆಗಳಿಗೆ ಉತ್ತರಗಳನ್ನು ಪಡೆಯಿರಿ.',
        step3Btn: 'AI ಸಹಾಯಕ ಪ್ರಾರಂಭಿಸಿ →'
      },
      backToGoals: 'ಗುರಿಗಳಿಗೆ ಹಿಂತಿರುಗಿ',
      startNew: 'ಹೊಸ ಮೌಲ್ಯಮಾಪನ ಪ್ರಾರಂಭಿಸಿ'
    }
  }
};
