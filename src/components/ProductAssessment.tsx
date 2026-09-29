import { useState, useEffect } from 'react';
import { 
  CheckCircle2, 
  ArrowRight, 
  ArrowLeft, 
  Plus, 
  Trash2, 
  Sparkles,
  ShieldCheck,
  RotateCcw,
  Globe,
  Languages,
  Scale
} from 'lucide-react';
import { AssessmentData, IngredientItem, ActiveTab, Jurisdiction, AppLanguage } from '../types';
import { SUGGESTED_INGREDIENTS, INITIAL_ASSESSMENT_DATA } from '../data/portalData';
import { ASSESSMENT_TRANSLATIONS } from '../data/assessmentTranslations';

interface ProductAssessmentProps {
  onAskAboutAssessment: (context: string) => void;
  setActiveTab: (tab: ActiveTab) => void;
  jurisdiction: Jurisdiction;
  setJurisdiction: (j: Jurisdiction) => void;
  language: AppLanguage;
  setLanguage: (l: AppLanguage) => void;
}

export function ProductAssessment({ 
  onAskAboutAssessment, 
  setActiveTab,
  jurisdiction,
  setJurisdiction,
  language,
  setLanguage
}: ProductAssessmentProps) {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [newIngredientInput, setNewIngredientInput] = useState<string>('');
  
  const [formData, setFormData] = useState<AssessmentData>({
    ...INITIAL_ASSESSMENT_DATA,
    jurisdiction,
    language
  });

  // Sync state if jurisdiction or language changes from outside (e.g. Navbar)
  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      jurisdiction,
      language
    }));
  }, [jurisdiction, language]);

  const t = ASSESSMENT_TRANSLATIONS[language] || ASSESSMENT_TRANSLATIONS.en;

  const handleUpdateIngredient = (id: string, field: 'name' | 'sourceLocation', value: string) => {
    setFormData((prev) => ({
      ...prev,
      ingredients: prev.ingredients.map((ing) => 
        ing.id === id ? { ...ing, [field]: value } : ing
      )
    }));
  };

  const handleRemoveIngredient = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      ingredients: prev.ingredients.filter((ing) => ing.id !== id)
    }));
  };

  const handleAddCustomIngredient = () => {
    const trimmed = newIngredientInput.trim();
    if (!trimmed) return;
    const newIng: IngredientItem = {
      id: `ing-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      name: trimmed,
      sourceLocation: 'India'
    };
    setFormData((prev) => ({
      ...prev,
      ingredients: [...prev.ingredients, newIng]
    }));
    setNewIngredientInput('');
  };

  const handleAddSuggestedIngredient = (name: string) => {
    if (formData.ingredients.some((i) => i.name.toLowerCase() === name.toLowerCase())) {
      return;
    }
    const newIng: IngredientItem = {
      id: `ing-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      name,
      sourceLocation: 'India'
    };
    setFormData((prev) => ({
      ...prev,
      ingredients: [...prev.ingredients, newIng]
    }));
  };

  const toggleBusinessGoal = (goal: string) => {
    setFormData((prev) => {
      const exists = prev.businessGoals.includes(goal);
      return {
        ...prev,
        businessGoals: exists 
          ? prev.businessGoals.filter((g) => g !== goal)
          : [...prev.businessGoals, goal]
      };
    });
  };

  const handleReset = () => {
    setFormData({
      ...INITIAL_ASSESSMENT_DATA,
      jurisdiction,
      language
    });
    setNewIngredientInput('');
    setCurrentStep(1);
  };

  const handleGenerateAssessment = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      setIsAnalyzing(false);
      setCurrentStep(6);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 600);
  };

  // Localized lists
  const productTypes = [
    t.step2.productTypes.classical,
    t.step2.productTypes.proprietary,
    t.step2.productTypes.food,
    t.step2.productTypes.cosmetic,
    t.step2.productTypes.supplement,
    t.step2.productTypes.other
  ];

  const intendedUses = t.step4.intendedUses;
  const businessGoalsList = t.step5.goals;

  // Derived analysis logic for Step 6 report
  const isClassical = formData.isClassicalText === 'Yes';
  const usesIndianBio = formData.ingredients.some((i) => i.sourceLocation === 'India') || formData.usesBiologicalResources === 'Yes';
  const isFoodOrAahar =
    formData.productType.toLowerCase().includes('food') ||
    formData.productType.toLowerCase().includes('aahar') ||
    formData.productType.includes('खाद्य') ||
    formData.productType.includes('ಆಹಾರ') ||
    formData.intendedUse.includes('Food') ||
    formData.intendedUse.includes('पोषण') ||
    formData.intendedUse.includes('ಆಹಾರ');

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-16">
      {/* Header & Step Indicator */}
      <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#047857] bg-emerald-50 border border-emerald-200/80 px-2.5 py-0.5 rounded-full">
                {t.badge}
              </span>
              <span className="text-xs text-[#6B7280]">
                {t.stepIndicator(currentStep, 6)}
              </span>
            </div>
            <h2 className="text-2xl font-bold text-[#111827] tracking-tight mt-1">
              {t.title}
            </h2>
            <p className="text-xs text-[#6B7280] mt-0.5 font-medium">
              {t.subtitle}
            </p>
          </div>

          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-stone-200 text-xs font-semibold text-stone-600 hover:bg-stone-50 transition-colors self-start sm:self-auto"
            title={t.resetBtn}
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>{t.resetBtn}</span>
          </button>
        </div>

        {/* Step Progress Bar */}
        <div className="grid grid-cols-6 gap-2 mt-6 pt-5 border-t border-stone-100">
          {[1, 2, 3, 4, 5, 6].map((num) => {
            const stepKey = num as 1 | 2 | 3 | 4 | 5 | 6;
            const label = t.steps[stepKey];
            return (
              <div
                key={num}
                onClick={() => {
                  if (num <= currentStep || (num === 6 && formData.productName)) {
                    setCurrentStep(num);
                  }
                }}
                className={`cursor-pointer group flex flex-col gap-1.5`}
              >
                <div
                  className={`h-1.5 rounded-full transition-all ${
                    num === currentStep
                      ? 'bg-[#15803D]'
                      : num < currentStep
                      ? 'bg-emerald-300'
                      : 'bg-stone-200'
                  }`}
                />
                <span className="text-[10px] font-bold text-[#6B7280] hidden sm:block truncate">
                  {num}. {label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* STEP 1: JURISDICTION & LANGUAGE */}
      {currentStep === 1 && (
        <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 sm:p-8 shadow-xs space-y-6">
          <div className="border-b border-stone-100 pb-4">
            <span className="text-xs font-mono font-bold text-[#047857] uppercase tracking-wider">
              {t.stepIndicator(1, 6).toUpperCase()}
            </span>
            <h3 className="text-xl font-bold text-[#111827] mt-1">
              {t.step1.title}
            </h3>
            <p className="text-xs text-[#6B7280] mt-1">
              {t.step1.description}
            </p>
          </div>

          {/* Jurisdiction Choice */}
          <div className="space-y-3">
            <label className="block text-xs font-bold text-[#374151] uppercase tracking-wider flex items-center gap-1.5">
              <Globe className="w-4 h-4 text-emerald-600" />
              <span>{t.step1.targetJurisdiction}</span>
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                {
                  id: 'India' as Jurisdiction,
                  title: t.step1.jurisdictions.indiaTitle,
                  flag: '🇮🇳',
                  desc: t.step1.jurisdictions.indiaDesc
                },
                {
                  id: 'International' as Jurisdiction,
                  title: t.step1.jurisdictions.intlTitle,
                  flag: '🌐',
                  desc: t.step1.jurisdictions.intlDesc
                },
                {
                  id: 'Both' as Jurisdiction,
                  title: t.step1.jurisdictions.bothTitle,
                  flag: '🌍',
                  desc: t.step1.jurisdictions.bothDesc
                }
              ].map((item) => (
                <div
                  key={item.id}
                  onClick={() => {
                    setJurisdiction(item.id);
                    setFormData((prev) => ({ ...prev, jurisdiction: item.id }));
                  }}
                  className={`p-4 rounded-xl border cursor-pointer transition-all flex flex-col justify-between ${
                    jurisdiction === item.id
                      ? 'border-[#15803D] bg-emerald-50/50 shadow-xs ring-1 ring-[#15803D]'
                      : 'border-[#E5E7EB] hover:border-stone-400 bg-white'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-2xl">{item.flag}</span>
                      {jurisdiction === item.id && (
                        <CheckCircle2 className="w-4 h-4 text-[#15803D]" />
                      )}
                    </div>
                    <h4 className="text-sm font-bold text-[#111827]">{item.title}</h4>
                    <p className="text-xs text-[#6B7280] mt-1.5 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Language Choice */}
          <div className="space-y-3 pt-4 border-t border-stone-100">
            <label className="block text-xs font-bold text-[#374151] uppercase tracking-wider flex items-center gap-1.5">
              <Languages className="w-4 h-4 text-emerald-600" />
              <span>{t.step1.appLanguage}</span>
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { 
                  id: 'en' as AppLanguage, 
                  native: t.step1.languages.enTitle, 
                  desc: t.step1.languages.enDesc 
                },
                { 
                  id: 'hi' as AppLanguage, 
                  native: t.step1.languages.hiTitle, 
                  desc: t.step1.languages.hiDesc 
                },
                { 
                  id: 'kn' as AppLanguage, 
                  native: t.step1.languages.knTitle, 
                  desc: t.step1.languages.knDesc 
                }
              ].map((l) => (
                <div
                  key={l.id}
                  onClick={() => {
                    setLanguage(l.id);
                    setFormData((prev) => ({ ...prev, language: l.id }));
                  }}
                  className={`p-4 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                    language === l.id
                      ? 'border-[#15803D] bg-emerald-50/50 shadow-xs ring-1 ring-[#15803D]'
                      : 'border-[#E5E7EB] hover:border-stone-400 bg-white'
                  }`}
                >
                  <div>
                    <span className="text-base font-bold text-[#111827] block">{l.native}</span>
                    <span className="text-xs text-[#6B7280]">{l.desc}</span>
                  </div>
                  {language === l.id && <CheckCircle2 className="w-4 h-4 text-[#15803D]" />}
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <button
              onClick={() => setCurrentStep(2)}
              className="bg-[#15803D] hover:bg-[#166534] text-white px-6 py-3 rounded-xl text-xs font-bold flex items-center gap-2 shadow-xs transition-all"
            >
              <span>{t.step1.continueBtn}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: PRODUCT PROFILE */}
      {currentStep === 2 && (
        <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 sm:p-8 shadow-xs space-y-6">
          <div className="border-b border-stone-100 pb-4">
            <span className="text-xs font-mono font-bold text-[#047857] uppercase tracking-wider">
              {t.stepIndicator(2, 6).toUpperCase()}
            </span>
            <h3 className="text-xl font-bold text-[#111827] mt-1">
              {t.step2.title}
            </h3>
            <p className="text-xs text-[#6B7280] mt-1">
              {t.step2.description}
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-[#374151] mb-1.5">
                {t.step2.productNameLabel}
              </label>
              <input
                type="text"
                value={formData.productName}
                onChange={(e) => setFormData({ ...formData, productName: e.target.value })}
                placeholder={t.step2.productNamePlaceholder}
                className="w-full text-xs p-3.5 rounded-xl border border-[#D1D5DB] focus:border-[#15803D] focus:ring-1 focus:ring-[#15803D] outline-none text-[#111827] font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#374151] mb-1.5">
                {t.step2.productTypeLabel}
              </label>
              <select
                value={formData.productType}
                onChange={(e) => setFormData({ ...formData, productType: e.target.value })}
                className="w-full text-xs p-3.5 rounded-xl border border-[#D1D5DB] focus:border-[#15803D] outline-none bg-white text-[#111827] font-medium"
              >
                {productTypes.map((pt) => (
                  <option key={pt} value={pt}>{pt}</option>
                ))}
              </select>
            </div>

            {/* Classical Text Citation Check */}
            <div className="p-4 rounded-xl border border-stone-200 bg-stone-50/60 space-y-2">
              <span className="text-xs font-bold text-[#111827] block">
                {t.step2.classicalTextLabel}
              </span>
              <p className="text-[11px] text-[#6B7280]">
                {t.step2.classicalTextHelp}
              </p>
              <div className="flex flex-wrap gap-2 pt-1">
                {[
                  { id: 'Yes', label: t.step2.yes },
                  { id: 'No', label: t.step2.no },
                  { id: 'Unsure', label: t.step2.unsure }
                ].map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setFormData({ ...formData, isClassicalText: opt.id as any })}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                      formData.isClassicalText === opt.id
                        ? 'bg-[#15803D] text-white'
                        : 'bg-white border border-stone-200 text-stone-700 hover:bg-stone-50'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Delivery Method / Dosage Form */}
            <div>
              <label className="block text-xs font-bold text-[#374151] mb-1.5">
                {t.step2.deliveryMethodLabel}
              </label>
              <div className="flex flex-wrap gap-1.5">
                {t.step2.deliveryMethods.map((dm) => (
                  <button
                    key={dm}
                    type="button"
                    onClick={() => setFormData({ ...formData, productDescription: dm })}
                    className={`text-xs px-3 py-1.5 rounded-lg border transition-colors ${
                      formData.productDescription === dm
                        ? 'bg-emerald-100 border-emerald-400 text-emerald-900 font-bold'
                        : 'border-stone-200 bg-stone-50 hover:bg-white text-stone-700'
                    }`}
                  >
                    {dm}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="flex justify-between pt-4 border-t border-stone-100">
            <button
              onClick={() => setCurrentStep(1)}
              className="px-5 py-2.5 rounded-xl border border-stone-200 text-xs font-semibold text-stone-700 hover:bg-stone-50 flex items-center gap-1.5"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>{t.step2.backBtn}</span>
            </button>
            <button
              onClick={() => setCurrentStep(3)}
              disabled={!formData.productName.trim()}
              className="bg-[#15803D] hover:bg-[#166534] disabled:opacity-50 text-white px-6 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 shadow-xs transition-all"
            >
              <span>{t.step2.continueBtn}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: INGREDIENTS */}
      {currentStep === 3 && (
        <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 sm:p-8 shadow-xs space-y-6">
          <div className="border-b border-stone-100 pb-4">
            <span className="text-xs font-mono font-bold text-[#047857] uppercase tracking-wider">
              {t.stepIndicator(3, 6).toUpperCase()}
            </span>
            <h3 className="text-xl font-bold text-[#111827] mt-1">
              {t.step3.title}
            </h3>
            <p className="text-xs text-[#6B7280] mt-1">
              {t.step3.description}
            </p>
          </div>

          {/* Type-in Ingredient Input Box */}
          <div className="space-y-3">
            <label className="block text-xs font-bold text-[#374151]">
              {t.step3.ingredientsListLabel}
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={newIngredientInput}
                onChange={(e) => setNewIngredientInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddCustomIngredient();
                  }
                }}
                placeholder={t.step3.addCustomPlaceholder}
                className="flex-1 text-xs p-3.5 rounded-xl border border-[#D1D5DB] focus:border-[#15803D] focus:ring-1 focus:ring-[#15803D] outline-none text-[#111827]"
              />
              <button
                type="button"
                onClick={handleAddCustomIngredient}
                disabled={!newIngredientInput.trim()}
                className="bg-[#15803D] hover:bg-[#166534] disabled:opacity-50 text-white px-5 py-3.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors shrink-0"
              >
                <Plus className="w-4 h-4" />
                <span>{t.step3.addBtn}</span>
              </button>
            </div>

            {/* Quick Suggestions Chips */}
            <div className="pt-2">
              <span className="text-[11px] text-[#6B7280] font-medium block mb-2">
                {t.step3.quickAddTitle}
              </span>
              <div className="flex flex-wrap gap-1.5">
                {SUGGESTED_INGREDIENTS.map((herb) => (
                  <button
                    key={herb}
                    type="button"
                    onClick={() => handleAddSuggestedIngredient(herb)}
                    className="text-[11px] px-2.5 py-1 rounded-lg border border-stone-200 bg-stone-50 hover:bg-emerald-50 hover:border-emerald-300 hover:text-emerald-800 text-stone-700 transition-colors"
                  >
                    + {herb}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Added Ingredients List */}
          <div className="space-y-2 pt-3 border-t border-stone-100">
            <span className="text-xs font-bold text-[#374151] block">
              {t.step3.ingredientsListLabel} ({formData.ingredients.length})
            </span>

            {formData.ingredients.length === 0 ? (
              <div className="p-6 rounded-xl border border-dashed border-stone-300 text-center text-xs text-[#6B7280]">
                {t.step3.emptyIngredients}
              </div>
            ) : (
              <div className="space-y-2">
                {formData.ingredients.map((ing) => (
                  <div
                    key={ing.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 rounded-xl border border-stone-200 bg-stone-50/50"
                  >
                    <span className="text-xs font-bold text-[#111827]">{ing.name}</span>
                    <div className="flex items-center gap-3">
                      <select
                        value={ing.sourceLocation}
                        onChange={(e) => handleUpdateIngredient(ing.id, 'sourceLocation', e.target.value)}
                        className="text-[11px] p-1.5 rounded-lg border border-stone-200 bg-white text-stone-700"
                        title="Origin Location"
                      >
                        <option value="India">{t.step3.sourceIndia}</option>
                        <option value="Outside India">{t.step3.sourceOutside}</option>
                      </select>

                      <button
                        type="button"
                        onClick={() => handleRemoveIngredient(ing.id)}
                        className="text-red-500 hover:text-red-700 p-1"
                        title="Remove"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Biological Resources Mandate Check */}
          <div className="p-4 rounded-xl border border-stone-200 bg-stone-50/60 space-y-2">
            <span className="text-xs font-bold text-[#111827] block">
              {t.step3.bioResourcesQuestion}
            </span>
            <p className="text-[11px] text-[#6B7280]">
              {t.step3.bioResourcesHelp}
            </p>
            <div className="flex gap-2 pt-1">
              {[
                { id: 'Yes', label: t.step2.yes },
                { id: 'No', label: t.step2.no }
              ].map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setFormData({ ...formData, usesBiologicalResources: opt.id as any })}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                    formData.usesBiologicalResources === opt.id
                      ? 'bg-[#15803D] text-white'
                      : 'bg-white border border-stone-200 text-stone-700 hover:bg-stone-50'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex justify-between pt-4 border-t border-stone-100">
            <button
              onClick={() => setCurrentStep(2)}
              className="px-5 py-2.5 rounded-xl border border-stone-200 text-xs font-semibold text-stone-700 hover:bg-stone-50 flex items-center gap-1.5"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>{t.step3.backBtn}</span>
            </button>
            <button
              onClick={() => setCurrentStep(4)}
              className="bg-[#15803D] hover:bg-[#166534] text-white px-6 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 shadow-xs transition-all"
            >
              <span>{t.step3.continueBtn}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 4: CLAIMS & INTENDED USE */}
      {currentStep === 4 && (
        <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 sm:p-8 shadow-xs space-y-6">
          <div className="border-b border-stone-100 pb-4">
            <span className="text-xs font-mono font-bold text-[#047857] uppercase tracking-wider">
              {t.stepIndicator(4, 6).toUpperCase()}
            </span>
            <h3 className="text-xl font-bold text-[#111827] mt-1">
              {t.step4.title}
            </h3>
            <p className="text-xs text-[#6B7280] mt-1">
              {t.step4.description}
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-[#374151] mb-1.5">
                {t.step4.intendedUseLabel}
              </label>
              <select
                value={formData.intendedUse}
                onChange={(e) => setFormData({ ...formData, intendedUse: e.target.value })}
                className="w-full text-xs p-3.5 rounded-xl border border-[#D1D5DB] focus:border-[#15803D] outline-none bg-white text-[#111827] font-medium"
              >
                <option value="">{t.step4.intendedUseLabel}...</option>
                {intendedUses.map((u) => (
                  <option key={u} value={u}>{u}</option>
                ))}
              </select>
            </div>

            {/* R&D Synergistic Innovation Question */}
            <div className="p-4 rounded-xl border border-stone-200 bg-stone-50/60 space-y-2">
              <span className="text-xs font-bold text-[#111827] block">
                {t.step4.rdQuestion}
              </span>
              <p className="text-[11px] text-[#6B7280]">
                {t.step4.rdHelp}
              </p>
              <div className="flex gap-2 pt-1">
                {[
                  { id: 'Yes', label: t.step2.yes },
                  { id: 'No', label: t.step2.no }
                ].map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setFormData({ ...formData, isOrgDeveloped: opt.id as any })}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                      formData.isOrgDeveloped === opt.id
                        ? 'bg-[#15803D] text-white'
                        : 'bg-white border border-stone-200 text-stone-700 hover:bg-stone-50'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#374151] mb-1.5">
                {t.step4.claimsLabel}
              </label>
              <textarea
                rows={3}
                value={formData.claims}
                onChange={(e) => setFormData({ ...formData, claims: e.target.value })}
                placeholder={t.step4.claimsPlaceholder}
                className="w-full text-xs p-3.5 rounded-xl border border-[#D1D5DB] focus:border-[#15803D] outline-none text-[#111827]"
              />
            </div>
          </div>

          <div className="flex justify-between pt-4 border-t border-stone-100">
            <button
              onClick={() => setCurrentStep(3)}
              className="px-5 py-2.5 rounded-xl border border-stone-200 text-xs font-semibold text-stone-700 hover:bg-stone-50 flex items-center gap-1.5"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>{t.step4.backBtn}</span>
            </button>
            <button
              onClick={() => setCurrentStep(5)}
              className="bg-[#15803D] hover:bg-[#166534] text-white px-6 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 shadow-xs transition-all"
            >
              <span>{t.step4.continueBtn}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 5: BUSINESS & IP GOALS */}
      {currentStep === 5 && (
        <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 sm:p-8 shadow-xs space-y-6">
          <div className="border-b border-stone-100 pb-4">
            <span className="text-xs font-mono font-bold text-[#047857] uppercase tracking-wider">
              {t.stepIndicator(5, 6).toUpperCase()}
            </span>
            <h3 className="text-xl font-bold text-[#111827] mt-1">
              {t.step5.title}
            </h3>
            <p className="text-xs text-[#6B7280] mt-1">
              {t.step5.description}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {businessGoalsList.map((goal) => {
              const selected = formData.businessGoals.includes(goal);
              return (
                <div
                  key={goal}
                  onClick={() => toggleBusinessGoal(goal)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all flex items-start gap-3 ${
                    selected
                      ? 'border-[#15803D] bg-emerald-50/50 shadow-xs ring-1 ring-[#15803D]'
                      : 'border-[#E5E7EB] hover:border-stone-400 bg-white'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={selected}
                    onChange={() => {}}
                    className="w-4 h-4 text-[#15803D] rounded border-[#D1D5DB] mt-0.5"
                  />
                  <div>
                    <span className="text-xs font-bold text-[#111827] block">{goal}</span>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex justify-between pt-4 border-t border-stone-100">
            <button
              onClick={() => setCurrentStep(4)}
              className="px-5 py-2.5 rounded-xl border border-stone-200 text-xs font-semibold text-stone-700 hover:bg-stone-50 flex items-center gap-1.5"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>{t.step5.backBtn}</span>
            </button>
            <button
              onClick={handleGenerateAssessment}
              disabled={isAnalyzing}
              className="bg-[#15803D] hover:bg-[#166534] text-white px-7 py-3 rounded-xl text-xs font-bold flex items-center gap-2 shadow-xs transition-all"
            >
              {isAnalyzing ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>{t.step5.analyzingBtn}</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>{t.step5.generateBtn}</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* STEP 6: INSTANT COMPREHENSIVE REGULATORY & IP AUDIT REPORT (Localized) */}
      {currentStep === 6 && (
        <div className="space-y-6">
          {/* Top Banner */}
          <div className="bg-[#0F2922] text-white rounded-3xl p-8 shadow-md border border-[#1b4338] relative overflow-hidden">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-emerald-900/60 pb-5">
              <div>
                <span className="text-[11px] font-mono font-bold tracking-widest text-emerald-400 uppercase">
                  {t.step6.badge}
                </span>
                <h3 className="text-2xl font-bold text-white tracking-tight mt-1">
                  {formData.productName || t.step6.defaultProduct}
                </h3>
                <div className="flex flex-wrap items-center gap-2 text-xs text-stone-300 mt-2">
                  <span className="bg-[#193F34] px-2.5 py-0.5 rounded-full border border-emerald-800">
                    {t.step6.regimeLabel}: {jurisdiction}
                  </span>
                  <span>•</span>
                  <span>{t.step6.categoryLabel}: {formData.productType}</span>
                  <span>•</span>
                  <span>{t.step6.ingredientsLabel}: {formData.ingredients.length}</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    const ctx = `Product: ${formData.productName}. Type: ${formData.productType}. Ingredients: ${formData.ingredients.map(i => i.name).join(', ')}. Claims: ${formData.claims || 'N/A'}. Classical: ${formData.isClassicalText}. Novel: ${formData.isOrgDeveloped}.`;
                    onAskAboutAssessment(ctx);
                  }}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 shadow-xs transition-colors"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{t.step6.consultAiBtn}</span>
                </button>
              </div>
            </div>

            {/* Quick Status Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
              {/* Card 1: Section 3(p) */}
              <div className="bg-[#16382E] p-4 rounded-xl border border-emerald-800/60">
                <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-400">
                  {t.step6.statusCards.sec3pTitle}
                </span>
                <div className="text-base font-bold text-white mt-1">
                  {isClassical ? t.step6.statusCards.sec3pClassicalStatus : t.step6.statusCards.sec3pNovelStatus}
                </div>
                <p className="text-[11px] text-stone-300 mt-1">
                  {isClassical ? t.step6.statusCards.sec3pClassicalDesc : t.step6.statusCards.sec3pNovelDesc}
                </p>
              </div>

              {/* Card 2: NBA Form III */}
              <div className="bg-[#16382E] p-4 rounded-xl border border-emerald-800/60">
                <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-400">
                  {t.step6.statusCards.nbaTitle}
                </span>
                <div className="text-base font-bold text-white mt-1">
                  {usesIndianBio ? t.step6.statusCards.nbaMandatoryStatus : t.step6.statusCards.nbaVerifyStatus}
                </div>
                <p className="text-[11px] text-stone-300 mt-1">
                  {usesIndianBio ? t.step6.statusCards.nbaMandatoryDesc : t.step6.statusCards.nbaVerifyDesc}
                </p>
              </div>

              {/* Card 3: Trademark Route */}
              <div className="bg-[#16382E] p-4 rounded-xl border border-emerald-800/60">
                <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-400">
                  {t.step6.statusCards.tmTitle}
                </span>
                <div className="text-base font-bold text-white mt-1">
                  {t.step6.statusCards.tmStatus}
                </div>
                <p className="text-[11px] text-stone-300 mt-1">
                  {t.step6.statusCards.tmDesc}
                </p>
              </div>

              {/* Card 4: Regulatory Pathway */}
              <div className="bg-[#16382E] p-4 rounded-xl border border-emerald-800/60">
                <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-400">
                  {t.step6.statusCards.regRouteTitle}
                </span>
                <div className="text-base font-bold text-white mt-1">
                  {isFoodOrAahar ? t.step6.statusCards.foodRouteStatus : t.step6.statusCards.medRouteStatus}
                </div>
                <p className="text-[11px] text-stone-300 mt-1">
                  {isFoodOrAahar ? t.step6.statusCards.foodRouteDesc : t.step6.statusCards.medRouteDesc}
                </p>
              </div>
            </div>
          </div>

          {/* Detailed Audit Breakdown Sections */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Card: Statutory Patents & TKDL Analysis */}
            <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 shadow-xs space-y-4">
              <div className="flex items-center gap-2 text-sm font-bold text-[#111827]">
                <Scale className="w-4 h-4 text-emerald-700" />
                <span>{t.step6.statutoryCard1.title}</span>
              </div>

              <div className="space-y-3 text-xs text-[#4B5563] leading-relaxed">
                <div className="p-3.5 rounded-xl bg-emerald-50/60 border border-emerald-200/80">
                  <strong className="text-emerald-950 font-bold block mb-1">
                    {t.step6.statutoryCard1.sec3pTitle}
                  </strong>
                  {t.step6.statutoryCard1.sec3pBody}
                </div>

                <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200">
                  <strong className="text-[#111827] font-bold block mb-1">
                    {t.step6.statutoryCard1.sec3eTitle}
                  </strong>
                  {t.step6.statutoryCard1.sec3eBody}
                </div>

                <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200">
                  <strong className="text-[#111827] font-bold block mb-1">
                    {t.step6.statutoryCard1.sec10Title}
                  </strong>
                  {t.step6.statutoryCard1.sec10Body}
                </div>
              </div>
            </div>

            {/* Right Card: Biodiversity NBA & Regulatory Compliance */}
            <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 shadow-xs space-y-4">
              <div className="flex items-center gap-2 text-sm font-bold text-[#111827]">
                <ShieldCheck className="w-4 h-4 text-emerald-700" />
                <span>{t.step6.statutoryCard2.title}</span>
              </div>

              <div className="space-y-3 text-xs text-[#4B5563] leading-relaxed">
                <div className="p-3.5 rounded-xl bg-blue-50/60 border border-blue-200/80">
                  <strong className="text-blue-950 font-bold block mb-1">
                    {t.step6.statutoryCard2.nbaTitle}
                  </strong>
                  {t.step6.statutoryCard2.nbaBody}
                </div>

                <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200">
                  <strong className="text-[#111827] font-bold block mb-1">
                    {t.step6.statutoryCard2.amendmentTitle}
                  </strong>
                  {t.step6.statutoryCard2.amendmentBody}
                </div>

                <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200">
                  <strong className="text-[#111827] font-bold block mb-1">
                    {t.step6.statutoryCard2.magicTitle}
                  </strong>
                  {t.step6.statutoryCard2.magicBody}
                </div>
              </div>
            </div>
          </div>

          {/* Actionable Next Steps Card */}
          <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 shadow-xs space-y-4">
            <h4 className="text-sm font-bold text-[#111827]">
              {t.step6.nextSteps.title}
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-4 rounded-xl border border-stone-200 bg-stone-50 flex flex-col justify-between">
                <div>
                  <span className="text-xs font-mono font-bold text-[#15803D]">
                    {t.step6.nextSteps.step1Title}
                  </span>
                  <p className="text-xs text-[#4B5563] mt-1.5 leading-snug">
                    {t.step6.nextSteps.step1Desc}
                  </p>
                </div>
                <button
                  onClick={() => setActiveTab('patents')}
                  className="mt-3 text-xs font-bold text-[#15803D] hover:underline text-left"
                >
                  {t.step6.nextSteps.step1Btn}
                </button>
              </div>

              <div className="p-4 rounded-xl border border-stone-200 bg-stone-50 flex flex-col justify-between">
                <div>
                  <span className="text-xs font-mono font-bold text-[#15803D]">
                    {t.step6.nextSteps.step2Title}
                  </span>
                  <p className="text-xs text-[#4B5563] mt-1.5 leading-snug">
                    {t.step6.nextSteps.step2Desc}
                  </p>
                </div>
                <button
                  onClick={() => setActiveTab('cost')}
                  className="mt-3 text-xs font-bold text-[#15803D] hover:underline text-left"
                >
                  {t.step6.nextSteps.step2Btn}
                </button>
              </div>

              <div className="p-4 rounded-xl border border-stone-200 bg-stone-50 flex flex-col justify-between">
                <div>
                  <span className="text-xs font-mono font-bold text-[#15803D]">
                    {t.step6.nextSteps.step3Title}
                  </span>
                  <p className="text-xs text-[#4B5563] mt-1.5 leading-snug">
                    {t.step6.nextSteps.step3Desc}
                  </p>
                </div>
                <button
                  onClick={() => {
                    const ctx = `Product: ${formData.productName}. Type: ${formData.productType}. Ingredients: ${formData.ingredients.map(i => i.name).join(', ')}.`;
                    onAskAboutAssessment(ctx);
                  }}
                  className="mt-3 text-xs font-bold text-[#15803D] hover:underline text-left"
                >
                  {t.step6.nextSteps.step3Btn}
                </button>
              </div>
            </div>
          </div>

          {/* Navigation Controls */}
          <div className="flex justify-between items-center pt-2">
            <button
              onClick={() => setCurrentStep(5)}
              className="px-5 py-2.5 rounded-xl border border-stone-200 text-xs font-semibold text-stone-700 hover:bg-stone-50 flex items-center gap-1.5"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>{t.step6.backToGoals}</span>
            </button>

            <button
              onClick={handleReset}
              className="bg-stone-800 hover:bg-black text-white px-5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>{t.step6.startNew}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
