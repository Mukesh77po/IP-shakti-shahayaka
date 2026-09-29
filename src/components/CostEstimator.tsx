import { useState } from 'react';
import { Calculator, Check, Info, Scale, ShieldCheck, FileText, ExternalLink, HelpCircle } from 'lucide-react';

type EntityCategory = 'Natural Person / Startup / Educational' | 'Small Entity' | 'Large Entity (Others)';
type FilingMode = 'e-filing' | 'physical';

export function CostEstimator() {
  const [entityCategory, setEntityCategory] = useState<EntityCategory>('Natural Person / Startup / Educational');
  const [filingMode, setFilingMode] = useState<FilingMode>('e-filing');

  // Patent Forms selection
  const [includePatentForm1, setIncludePatentForm1] = useState<boolean>(true);
  const [includeForm9EarlyPub, setIncludeForm9EarlyPub] = useState<boolean>(false);
  const [includeForm18Exam, setIncludeForm18Exam] = useState<boolean>(true);
  const [includeForm18AExpedited, setIncludeForm18AExpedited] = useState<boolean>(false);
  const [extraPages, setExtraPages] = useState<number>(0);
  const [extraClaims, setExtraClaims] = useState<number>(0);

  // Other Intellectual Property selections
  const [includeTrademarkClass5, setIncludeTrademarkClass5] = useState<boolean>(true);
  const [includeTrademarkClass30, setIncludeTrademarkClass30] = useState<boolean>(false);
  const [includeDesignApp, setIncludeDesignApp] = useState<boolean>(false);
  const [includeNbaForm3, setIncludeNbaForm3] = useState<boolean>(true);

  const isSmallOrStartup = entityCategory === 'Natural Person / Startup / Educational';
  const isSmallEntity = entityCategory === 'Small Entity';
  const isLarge = entityCategory === 'Large Entity (Others)';

  // Exact Official Statutory Fee Schedule (First Schedule, Patent Rules 2003 as amended up to 2024)
  // Form 1:
  const feeForm1 = isSmallOrStartup
    ? (filingMode === 'e-filing' ? 1600 : 1750)
    : isSmallEntity
    ? (filingMode === 'e-filing' ? 4000 : 4400)
    : (filingMode === 'e-filing' ? 8000 : 8800);

  // Form 9 (Early Publication - Section 11A(2)):
  const feeForm9 = isSmallOrStartup
    ? (filingMode === 'e-filing' ? 2500 : 2750)
    : isSmallEntity
    ? (filingMode === 'e-filing' ? 6250 : 6875)
    : (filingMode === 'e-filing' ? 12500 : 13750);

  // Form 18 (Standard Examination - Section 11B & Rule 24B):
  const feeForm18 = isSmallOrStartup
    ? (filingMode === 'e-filing' ? 4000 : 4400)
    : isSmallEntity
    ? (filingMode === 'e-filing' ? 10000 : 11000)
    : (filingMode === 'e-filing' ? 20000 : 22000);

  // Form 18A (Expedited Examination - Rule 24C for Startups, Women, Govt entities):
  const feeForm18A = isSmallOrStartup
    ? (filingMode === 'e-filing' ? 8000 : 8800)
    : isSmallEntity
    ? (filingMode === 'e-filing' ? 25000 : 27500)
    : (filingMode === 'e-filing' ? 60000 : 66000);

  // Extra pages beyond 30: ₹160 (startup/person), ₹400 (small), ₹800 (large)
  const pageUnitFee = isSmallOrStartup ? 160 : isSmallEntity ? 400 : 800;
  const totalExtraPagesFee = extraPages > 0 ? extraPages * pageUnitFee : 0;

  // Extra claims beyond 10: ₹320 (startup/person), ₹800 (small), ₹1600 (large)
  const claimUnitFee = isSmallOrStartup ? 320 : isSmallEntity ? 800 : 1600;
  const totalExtraClaimsFee = extraClaims > 0 ? extraClaims * claimUnitFee : 0;

  // Total Patents Gov Fee
  const totalPatentsFee =
    (includePatentForm1 ? feeForm1 : 0) +
    (includeForm9EarlyPub ? feeForm9 : 0) +
    (includeForm18Exam ? feeForm18 : 0) +
    (includeForm18AExpedited ? feeForm18A : 0) +
    totalExtraPagesFee +
    totalExtraClaimsFee;

  // Trademark Form TM-A (Trade Marks Rules, 2017 Schedule 1):
  // Individual / Startup: ₹4,500 (e-filing) / ₹5,000 (physical)
  // Large / Others: ₹9,000 (e-filing) / ₹10,000 (physical)
  const tmUnitFee = isSmallOrStartup
    ? (filingMode === 'e-filing' ? 4500 : 5000)
    : (filingMode === 'e-filing' ? 9000 : 10000);

  const totalTrademarkFee =
    (includeTrademarkClass5 ? tmUnitFee : 0) +
    (includeTrademarkClass30 ? tmUnitFee : 0);

  // Designs Act Form 1 (Designs Rules 2001 First Schedule):
  // Natural Person / Startup: ₹1,000
  // Small Entity: ₹2,000
  // Others: ₹4,000
  const designFee = isSmallOrStartup
    ? (filingMode === 'e-filing' ? 1000 : 1100)
    : isSmallEntity
    ? (filingMode === 'e-filing' ? 2000 : 2200)
    : (filingMode === 'e-filing' ? 4000 : 4400);

  const totalDesignFee = includeDesignApp ? designFee : 0;

  // National Biodiversity Authority Form III (Biological Diversity Rules, 2004 Rule 18):
  // Statutory application fee is ₹500
  const totalNbaFee = includeNbaForm3 ? 500 : 0;

  // Grand Total Official Fees
  const grandTotal = totalPatentsFee + totalTrademarkFee + totalDesignFee + totalNbaFee;

  const formatRupee = (num: number) => {
    return '₹' + num.toLocaleString('en-IN');
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      {/* Header Banner */}
      <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 sm:p-8 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#047857] bg-emerald-50 border border-emerald-200/80 px-2.5 py-0.5 rounded-full">
              OFFICIAL GOVERNMENT SCHEDULE AUDITOR
            </span>
            <span className="text-xs text-stone-500 font-medium">
              Verified Against Official Gazette Schedules
            </span>
          </div>
          <h2 className="text-2xl font-bold text-[#111827] tracking-tight mt-1">
            Official Statutory Fee Estimator
          </h2>
          <p className="text-xs text-[#6B7280] mt-1 font-medium max-w-3xl">
            Calculated strictly according to the First Schedule of Patent Rules 2003 (as amended 2024), Trade Marks Rules 2017 (Schedule 1), Designs Rules 2001, and Biological Diversity Rules 2004 (Rule 18).
          </p>
        </div>

        <a
          href="https://ipindia.gov.in"
          target="_blank"
          rel="noreferrer"
          className="text-xs font-bold text-[#15803D] hover:underline flex items-center gap-1.5 shrink-0"
        >
          <span>Verify at ipindia.gov.in</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Form: Selectors */}
        <div className="lg:col-span-7 bg-white border border-[#E5E7EB] rounded-2xl p-6 sm:p-7 shadow-xs space-y-6">
          {/* Entity & Filing Configuration */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#374151] mb-1.5">
                Applicant Legal Entity Category
              </label>
              <select
                value={entityCategory}
                onChange={(e) => setEntityCategory(e.target.value as EntityCategory)}
                className="w-full text-xs p-3 rounded-xl border border-[#D1D5DB] bg-white font-medium text-[#111827] focus:border-[#15803D] outline-none"
              >
                <option value="Natural Person / Startup / Educational">
                  Natural Person / Startup / DPIIT Recognized (80% Concession)
                </option>
                <option value="Small Entity">
                  Small Entity (MSME Udyam) (50% Concession)
                </option>
                <option value="Large Entity (Others)">
                  Large Entity (Corporate / Other than MSME)
                </option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#374151] mb-1.5">
                Filing Method
              </label>
              <select
                value={filingMode}
                onChange={(e) => setFilingMode(e.target.value as FilingMode)}
                className="w-full text-xs p-3 rounded-xl border border-[#D1D5DB] bg-white font-medium text-[#111827] focus:border-[#15803D] outline-none"
              >
                <option value="e-filing">Comprehensive e-Filing Portal (Official 10% Discount)</option>
                <option value="physical">Physical Filing at Patent Office Counter</option>
              </select>
            </div>
          </div>

          {/* Section 1: Patents Act Statutory Fees */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between border-b border-stone-100 pb-2">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#15803D] flex items-center gap-1.5">
                <Scale className="w-3.5 h-3.5" />
                <span>Patents Act, 1970 Statutory Forms</span>
              </span>
              <span className="text-xs font-mono font-semibold text-stone-500">First Schedule</span>
            </div>

            <div className="space-y-2">
              <label className="flex items-start justify-between p-3 rounded-xl border border-stone-200 hover:bg-stone-50/50 cursor-pointer">
                <div className="flex items-start gap-2.5">
                  <input
                    type="checkbox"
                    checked={includePatentForm1}
                    onChange={(e) => setIncludePatentForm1(e.target.checked)}
                    className="w-4 h-4 text-[#15803D] rounded border-[#D1D5DB] mt-0.5"
                  />
                  <div>
                    <span className="text-xs font-bold text-[#111827] block">
                      Form 1: Application for Grant of Patent
                    </span>
                    <span className="text-[11px] text-[#6B7280]">
                      Includes provisional or complete specification up to 30 pages and 10 claims.
                    </span>
                  </div>
                </div>
                <span className="text-xs font-mono font-bold text-stone-900 ml-2">
                  {formatRupee(feeForm1)}
                </span>
              </label>

              <label className="flex items-start justify-between p-3 rounded-xl border border-stone-200 hover:bg-stone-50/50 cursor-pointer">
                <div className="flex items-start gap-2.5">
                  <input
                    type="checkbox"
                    checked={includeForm9EarlyPub}
                    onChange={(e) => setIncludeForm9EarlyPub(e.target.checked)}
                    className="w-4 h-4 text-[#15803D] rounded border-[#D1D5DB] mt-0.5"
                  />
                  <div>
                    <span className="text-xs font-bold text-[#111827] block">
                      Form 9: Request for Early Publication (Sec 11A(2))
                    </span>
                    <span className="text-[11px] text-[#6B7280]">
                      Publishes within 1 month instead of waiting standard 18 months.
                    </span>
                  </div>
                </div>
                <span className="text-xs font-mono font-bold text-stone-900 ml-2">
                  {formatRupee(feeForm9)}
                </span>
              </label>

              <label className="flex items-start justify-between p-3 rounded-xl border border-stone-200 hover:bg-stone-50/50 cursor-pointer">
                <div className="flex items-start gap-2.5">
                  <input
                    type="checkbox"
                    checked={includeForm18Exam}
                    onChange={(e) => {
                      setIncludeForm18Exam(e.target.checked);
                      if (e.target.checked) setIncludeForm18AExpedited(false);
                    }}
                    className="w-4 h-4 text-[#15803D] rounded border-[#D1D5DB] mt-0.5"
                  />
                  <div>
                    <span className="text-xs font-bold text-[#111827] block">
                      Form 18: Standard Request for Examination (Sec 11B)
                    </span>
                    <span className="text-[11px] text-[#6B7280]">
                      Mandatory statutory examination queue (Rule 24B).
                    </span>
                  </div>
                </div>
                <span className="text-xs font-mono font-bold text-stone-900 ml-2">
                  {formatRupee(feeForm18)}
                </span>
              </label>

              <label className="flex items-start justify-between p-3 rounded-xl border border-stone-200 hover:bg-stone-50/50 cursor-pointer">
                <div className="flex items-start gap-2.5">
                  <input
                    type="checkbox"
                    checked={includeForm18AExpedited}
                    onChange={(e) => {
                      setIncludeForm18AExpedited(e.target.checked);
                      if (e.target.checked) setIncludeForm18Exam(false);
                    }}
                    className="w-4 h-4 text-[#15803D] rounded border-[#D1D5DB] mt-0.5"
                  />
                  <div>
                    <span className="text-xs font-bold text-[#111827] block">
                      Form 18A: Expedited Examination (Rule 24C)
                    </span>
                    <span className="text-[11px] text-[#6B7280]">
                      Available for DPIIT Startups, women applicants, and government institutes.
                    </span>
                  </div>
                </div>
                <span className="text-xs font-mono font-bold text-stone-900 ml-2">
                  {formatRupee(feeForm18A)}
                </span>
              </label>

              {/* Extra Pages & Claims Controls */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="p-3 rounded-xl bg-stone-50 border border-stone-200">
                  <label className="block text-[11px] font-bold text-stone-700 mb-1">
                    Extra Pages (&gt;30): {extraPages}
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="range"
                      min="0"
                      max="50"
                      value={extraPages}
                      onChange={(e) => setExtraPages(parseInt(e.target.value))}
                      className="w-full"
                    />
                    <span className="text-xs font-mono font-bold text-stone-900">
                      {formatRupee(totalExtraPagesFee)}
                    </span>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-stone-50 border border-stone-200">
                  <label className="block text-[11px] font-bold text-stone-700 mb-1">
                    Extra Claims (&gt;10): {extraClaims}
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="range"
                      min="0"
                      max="20"
                      value={extraClaims}
                      onChange={(e) => setExtraClaims(parseInt(e.target.value))}
                      className="w-full"
                    />
                    <span className="text-xs font-mono font-bold text-stone-900">
                      {formatRupee(totalExtraClaimsFee)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Trade Marks, Designs & NBA Statutory Fees */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between border-b border-stone-100 pb-2">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#15803D] flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Trade Marks, Designs & Biodiversity Forms</span>
              </span>
              <span className="text-xs font-mono font-semibold text-stone-500">Statutory Schedules</span>
            </div>

            <div className="space-y-2">
              <label className="flex items-start justify-between p-3 rounded-xl border border-stone-200 hover:bg-stone-50/50 cursor-pointer">
                <div className="flex items-start gap-2.5">
                  <input
                    type="checkbox"
                    checked={includeTrademarkClass5}
                    onChange={(e) => setIncludeTrademarkClass5(e.target.checked)}
                    className="w-4 h-4 text-[#15803D] rounded border-[#D1D5DB] mt-0.5"
                  />
                  <div>
                    <span className="text-xs font-bold text-[#111827] block">
                      Trademark Form TM-A (Class 5 - ASU / Herbal Medicines)
                    </span>
                    <span className="text-[11px] text-[#6B7280]">
                      Coined brand name registration under Trade Marks Rules 2017 Schedule 1.
                    </span>
                  </div>
                </div>
                <span className="text-xs font-mono font-bold text-stone-900 ml-2">
                  {formatRupee(tmUnitFee)}
                </span>
              </label>

              <label className="flex items-start justify-between p-3 rounded-xl border border-stone-200 hover:bg-stone-50/50 cursor-pointer">
                <div className="flex items-start gap-2.5">
                  <input
                    type="checkbox"
                    checked={includeTrademarkClass30}
                    onChange={(e) => setIncludeTrademarkClass30(e.target.checked)}
                    className="w-4 h-4 text-[#15803D] rounded border-[#D1D5DB] mt-0.5"
                  />
                  <div>
                    <span className="text-xs font-bold text-[#111827] block">
                      Trademark Form TM-A (Class 30 - Ayurveda Aahara / Herbal Teas)
                    </span>
                    <span className="text-[11px] text-[#6B7280]">
                      Protects food supplements and herbal infusions.
                    </span>
                  </div>
                </div>
                <span className="text-xs font-mono font-bold text-stone-900 ml-2">
                  {formatRupee(tmUnitFee)}
                </span>
              </label>

              <label className="flex items-start justify-between p-3 rounded-xl border border-stone-200 hover:bg-stone-50/50 cursor-pointer">
                <div className="flex items-start gap-2.5">
                  <input
                    type="checkbox"
                    checked={includeDesignApp}
                    onChange={(e) => setIncludeDesignApp(e.target.checked)}
                    className="w-4 h-4 text-[#15803D] rounded border-[#D1D5DB] mt-0.5"
                  />
                  <div>
                    <span className="text-xs font-bold text-[#111827] block">
                      Designs Form 1: Packaging / Dropper Nozzle Registration
                    </span>
                    <span className="text-[11px] text-[#6B7280]">
                      Protects visual 3D bottle, dispenser, or nasal applicator geometry for 10-15 years.
                    </span>
                  </div>
                </div>
                <span className="text-xs font-mono font-bold text-stone-900 ml-2">
                  {formatRupee(designFee)}
                </span>
              </label>

              <label className="flex items-start justify-between p-3 rounded-xl border border-stone-200 hover:bg-stone-50/50 cursor-pointer">
                <div className="flex items-start gap-2.5">
                  <input
                    type="checkbox"
                    checked={includeNbaForm3}
                    onChange={(e) => setIncludeNbaForm3(e.target.checked)}
                    className="w-4 h-4 text-[#15803D] rounded border-[#D1D5DB] mt-0.5"
                  />
                  <div>
                    <span className="text-xs font-bold text-[#111827] block">
                      National Biodiversity Authority: Form III (Section 6 Approval)
                    </span>
                    <span className="text-[11px] text-[#6B7280]">
                      Statutory application fee specified under Biological Diversity Rules, 2004 (Rule 18).
                    </span>
                  </div>
                </div>
                <span className="text-xs font-mono font-bold text-stone-900 ml-2">
                  {formatRupee(500)}
                </span>
              </label>
            </div>
          </div>
        </div>

        {/* Right Summary: Official Statutory Fee Calculation Card */}
        <div className="lg:col-span-5 bg-[#0F2922] text-white rounded-2xl p-6 sm:p-7 shadow-md border border-[#1b4338] space-y-6">
          <div className="border-b border-emerald-900/80 pb-4">
            <span className="text-[10px] font-mono font-bold tracking-wider text-emerald-400 uppercase">
              OFFICIAL GOVERNMENT SCHEDULE
            </span>
            <h3 className="text-lg font-bold text-white mt-1">
              Estimated Statutory Filing Dues
            </h3>
            <span className="text-xs text-stone-300 block mt-0.5">
              Category: {entityCategory}
            </span>
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between pb-2 border-b border-emerald-900/60">
              <span className="text-stone-300">Patent Form 1 (Application):</span>
              <span className="font-mono font-bold text-white">
                {includePatentForm1 ? formatRupee(feeForm1) : '₹0'}
              </span>
            </div>

            {includeForm9EarlyPub && (
              <div className="flex items-center justify-between pb-2 border-b border-emerald-900/60">
                <span className="text-stone-300">Patent Form 9 (Early Publication):</span>
                <span className="font-mono font-bold text-white">{formatRupee(feeForm9)}</span>
              </div>
            )}

            {includeForm18Exam && (
              <div className="flex items-center justify-between pb-2 border-b border-emerald-900/60">
                <span className="text-stone-300">Patent Form 18 (Examination):</span>
                <span className="font-mono font-bold text-white">{formatRupee(feeForm18)}</span>
              </div>
            )}

            {includeForm18AExpedited && (
              <div className="flex items-center justify-between pb-2 border-b border-emerald-900/60">
                <span className="text-stone-300">Patent Form 18A (Expedited Exam):</span>
                <span className="font-mono font-bold text-white">{formatRupee(feeForm18A)}</span>
              </div>
            )}

            {(totalExtraPagesFee > 0 || totalExtraClaimsFee > 0) && (
              <div className="flex items-center justify-between pb-2 border-b border-emerald-900/60">
                <span className="text-stone-300">Extra Pages & Claims:</span>
                <span className="font-mono font-bold text-white">
                  {formatRupee(totalExtraPagesFee + totalExtraClaimsFee)}
                </span>
              </div>
            )}

            {includeTrademarkClass5 && (
              <div className="flex items-center justify-between pb-2 border-b border-emerald-900/60">
                <span className="text-stone-300">Trademark Form TM-A (Class 5):</span>
                <span className="font-mono font-bold text-white">{formatRupee(tmUnitFee)}</span>
              </div>
            )}

            {includeTrademarkClass30 && (
              <div className="flex items-center justify-between pb-2 border-b border-emerald-900/60">
                <span className="text-stone-300">Trademark Form TM-A (Class 30):</span>
                <span className="font-mono font-bold text-white">{formatRupee(tmUnitFee)}</span>
              </div>
            )}

            {includeDesignApp && (
              <div className="flex items-center justify-between pb-2 border-b border-emerald-900/60">
                <span className="text-stone-300">Designs Form 1 (Packaging Shape):</span>
                <span className="font-mono font-bold text-white">{formatRupee(designFee)}</span>
              </div>
            )}

            {includeNbaForm3 && (
              <div className="flex items-center justify-between pb-2 border-b border-emerald-900/60">
                <span className="text-stone-300">NBA Form III Statutory Fee (Rule 18):</span>
                <span className="font-mono font-bold text-white">{formatRupee(500)}</span>
              </div>
            )}
          </div>

          <div className="pt-4 border-t border-emerald-800">
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-stone-200">Total Statutory Fee:</span>
              <span className="text-2xl font-mono font-extrabold text-emerald-300">
                {formatRupee(grandTotal)}
              </span>
            </div>
            <p className="text-[11px] text-stone-400 mt-2 leading-relaxed">
              These figures represent 100% official statutory government filing fees payable directly to the Controller General of Patents, Designs & Trade Marks (CGPDTM) and the National Biodiversity Authority (NBA).
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-[#16382E] border border-emerald-800/80 text-xs text-stone-300 space-y-1">
            <span className="font-bold text-emerald-400 block">DPIIT Startup Concession Note:</span>
            <p className="text-[11px] text-stone-300 leading-snug">
              Recognized startups and individuals save up to 80% on Patent fees and 50% on Trademark e-filing fees compared to large entities.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
