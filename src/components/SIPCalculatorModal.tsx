import React, { useState } from 'react';
import { X, Info, TrendingUp, Sparkles, ArrowRight, ShieldAlert } from 'lucide-react';

interface SIPCalculatorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SIPCalculatorModal: React.FC<SIPCalculatorModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  // Investment Type: 'LUMPSUM' | 'SIP'
  const [calcType, setCalcType] = useState<'LUMPSUM' | 'SIP'>('LUMPSUM');

  // Mode: 'RETURNS' | 'TARGET'
  const [calcMode, setCalcMode] = useState<'RETURNS' | 'TARGET'>('RETURNS');

  // Form State
  const [amount, setAmount] = useState<number>(100000); // Lumpsum 1,00,000 or SIP 5,000
  const [targetWealth, setTargetWealth] = useState<number>(10000000); // 1 Cr
  const [expectedReturn, setExpectedReturn] = useState<number>(12); // 12% p.a
  const [periodYears, setPeriodYears] = useState<number>(10); // 10 years
  const [stepUpEnabled, setStepUpEnabled] = useState<boolean>(false);
  const [stepUpPercent, setStepUpPercent] = useState<number>(10); // 10% annual step up

  // Math Calculations
  const r = expectedReturn / 100;
  const t = periodYears;

  let totalInvested = 0;
  let estimatedTotalValue = 0;
  let estimatedReturns = 0;
  let requiredMonthlySIP = 0;

  if (calcType === 'LUMPSUM') {
    totalInvested = amount;
    // Compound interest: A = P * (1 + r)^t
    estimatedTotalValue = Math.round(amount * Math.pow(1 + r, t));
    estimatedReturns = estimatedTotalValue - totalInvested;
  } else {
    // SIP Mode
    if (calcMode === 'RETURNS') {
      const n = t * 12; // total months
      const i = r / 12; // monthly rate

      if (!stepUpEnabled || stepUpPercent <= 0) {
        // Standard SIP formula: M * [ (1 + i)^n - 1 ] / i * (1 + i)
        estimatedTotalValue = Math.round(amount * ((Math.pow(1 + i, n) - 1) / i) * (1 + i));
        totalInvested = amount * n;
      } else {
        // Step-Up SIP calculation
        let currentMonthlySIP = amount;
        let cumulativeVal = 0;
        let cumulativeInvested = 0;

        for (let yr = 1; yr <= t; yr++) {
          for (let m = 1; m <= 12; m++) {
            cumulativeInvested += currentMonthlySIP;
            // Compound monthly remaining months
            const remainingMonths = (t - yr) * 12 + (12 - m + 1);
            cumulativeVal += currentMonthlySIP * Math.pow(1 + i, remainingMonths);
          }
          currentMonthlySIP *= 1 + stepUpPercent / 100;
        }
        totalInvested = Math.round(cumulativeInvested);
        estimatedTotalValue = Math.round(cumulativeVal);
      }
      estimatedReturns = Math.max(0, estimatedTotalValue - totalInvested);
    } else {
      // Target Wealth Mode
      const n = t * 12;
      const i = r / 12;
      // Reverse SIP formula: Required SIP = Target / [ ((1+i)^n - 1) / i * (1+i) ]
      if (!stepUpEnabled || stepUpPercent <= 0) {
        const factor = ((Math.pow(1 + i, n) - 1) / i) * (1 + i);
        requiredMonthlySIP = Math.round(targetWealth / factor);
        totalInvested = requiredMonthlySIP * n;
        estimatedTotalValue = targetWealth;
      } else {
        // Approximate required starting monthly SIP with step-up
        let unitVal = 0;
        let unitInvested = 0;
        let unitSIP = 1;

        for (let yr = 1; yr <= t; yr++) {
          for (let m = 1; m <= 12; m++) {
            unitInvested += unitSIP;
            const remainingMonths = (t - yr) * 12 + (12 - m + 1);
            unitVal += unitSIP * Math.pow(1 + i, remainingMonths);
          }
          unitSIP *= 1 + stepUpPercent / 100;
        }

        const multiplier = targetWealth / unitVal;
        requiredMonthlySIP = Math.round(multiplier);
        totalInvested = Math.round(unitInvested * multiplier);
        estimatedTotalValue = targetWealth;
      }
      estimatedReturns = Math.max(0, estimatedTotalValue - totalInvested);
    }
  }

  // Rule of 72: Doubling years ~ 72 / r
  const doublingYears = Math.round(72 / (expectedReturn || 1));

  // Trajectory Bar Heights for 7 points
  const trajectoryBars = Array.from({ length: 7 }, (_, idx) => {
    const yrFraction = ((idx + 1) / 7) * t;
    const val = Math.round(totalInvested * Math.pow(1 + r, yrFraction));
    const maxVal = Math.max(1, estimatedTotalValue);
    const heightPct = Math.min(100, Math.max(12, Math.round((val / maxVal) * 100)));
    return heightPct;
  });

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[100] flex items-center justify-center p-3 md:p-5 overflow-y-auto">
      <div className="bg-[#0F1115] border border-slate-800 w-full max-w-[840px] rounded-xl shadow-2xl overflow-hidden flex flex-col md:flex-row max-h-[90vh] my-auto">
        
        {/* Left Column: Input Panel */}
        <div className="w-full md:w-1/2 p-5 border-b md:border-b-0 md:border-r border-slate-800 overflow-y-auto flex flex-col justify-between">
          <div>
            {/* Header */}
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-bold text-xl text-white">
                {calcType === 'LUMPSUM' ? 'Lumpsum Calculator' : 'SIP Calculator'}
              </h2>
              <button
                onClick={onClose}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Main Type Toggle: Lumpsum vs SIP */}
            <div className="flex p-1 bg-[#161920] border border-slate-800 rounded-lg mb-4">
              <button
                onClick={() => {
                  setCalcType('LUMPSUM');
                  if (amount < 10000) setAmount(100000);
                }}
                className={`flex-1 py-1.5 text-xs font-bold rounded-md transition-all ${
                  calcType === 'LUMPSUM'
                    ? 'text-white bg-indigo-600 shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Lumpsum
              </button>
              <button
                onClick={() => {
                  setCalcType('SIP');
                  if (amount > 100000) setAmount(5000);
                }}
                className={`flex-1 py-1.5 text-xs font-bold rounded-md transition-all ${
                  calcType === 'SIP'
                    ? 'text-white bg-indigo-600 shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                SIP
              </button>
            </div>

            {/* Sub-Mode Toggle (Only for SIP) */}
            {calcType === 'SIP' && (
              <div className="flex p-1 bg-[#161920] border border-slate-800 rounded-lg mb-4">
                <button
                  onClick={() => setCalcMode('RETURNS')}
                  className={`flex-1 py-1.5 text-xs font-bold rounded-md transition-all ${
                    calcMode === 'RETURNS'
                      ? 'text-white bg-slate-800 shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Calculate Returns
                </button>
                <button
                  onClick={() => setCalcMode('TARGET')}
                  className={`flex-1 py-1.5 text-xs font-bold rounded-md transition-all ${
                    calcMode === 'TARGET'
                      ? 'text-indigo-300 bg-slate-800 shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Target Wealth
                </button>
              </div>
            )}

            {/* Form Fields */}
            <div className="space-y-4 text-xs">
              {/* Amount Field */}
              {calcMode === 'RETURNS' || calcType === 'LUMPSUM' ? (
                <div>
                  <div className="flex justify-between mb-1">
                    <label className="text-slate-400">
                      {calcType === 'LUMPSUM' ? 'Total Lumpsum Investment' : 'Monthly SIP Amount'}
                    </label>
                    <span className="font-numeric font-bold text-white">
                      ₹{amount.toLocaleString('en-IN')}
                    </span>
                  </div>
                  <div className="relative flex items-center bg-[#161920] border border-slate-800 rounded-lg overflow-hidden focus-within:border-indigo-500">
                    <span className="pl-3 text-slate-400 font-numeric">₹</span>
                    <input
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(Number(e.target.value))}
                      className="w-full bg-transparent border-none text-white font-numeric py-2 px-2 outline-none"
                    />
                  </div>
                  <input
                    type="range"
                    min={calcType === 'LUMPSUM' ? 5000 : 500}
                    max={calcType === 'LUMPSUM' ? 10000000 : 100000}
                    step={calcType === 'LUMPSUM' ? 5000 : 500}
                    value={amount}
                    onChange={(e) => setAmount(Number(e.target.value))}
                    className="w-full mt-2 appearance-none bg-transparent cursor-pointer"
                  />
                </div>
              ) : (
                /* Target Wealth Field */
                <div>
                  <div className="flex justify-between mb-1">
                    <label className="text-slate-400">Target Wealth Amount</label>
                    <span className="font-numeric font-bold text-white">
                      ₹{targetWealth.toLocaleString('en-IN')}
                    </span>
                  </div>
                  <div className="relative flex items-center bg-[#161920] border border-slate-800 rounded-lg overflow-hidden focus-within:border-indigo-500">
                    <span className="pl-3 text-slate-400 font-numeric">₹</span>
                    <input
                      type="number"
                      value={targetWealth}
                      onChange={(e) => setTargetWealth(Number(e.target.value))}
                      className="w-full bg-transparent border-none text-white font-numeric py-2 px-2 outline-none"
                    />
                  </div>
                  <input
                    type="range"
                    min={100000}
                    max={100000000}
                    step={100000}
                    value={targetWealth}
                    onChange={(e) => setTargetWealth(Number(e.target.value))}
                    className="w-full mt-2 appearance-none bg-transparent cursor-pointer"
                  />
                </div>
              )}

              {/* Expected Return Field */}
              <div>
                <div className="flex justify-between mb-1">
                  <label className="text-slate-400">Expected Return (p.a)</label>
                  <span className="font-numeric font-bold text-white">{expectedReturn}%</span>
                </div>
                <div className="relative flex items-center bg-[#161920] border border-slate-800 rounded-lg overflow-hidden focus-within:border-indigo-500">
                  <input
                    type="number"
                    value={expectedReturn}
                    onChange={(e) => setExpectedReturn(Number(e.target.value))}
                    className="w-full bg-transparent border-none text-white font-numeric py-2 pl-3 outline-none"
                  />
                  <span className="pr-3 text-slate-400 font-numeric">%</span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={30}
                  step={0.5}
                  value={expectedReturn}
                  onChange={(e) => setExpectedReturn(Number(e.target.value))}
                  className="w-full mt-2 appearance-none bg-transparent cursor-pointer"
                />

                {/* Risk Profile Buttons */}
                <div className="mt-2.5">
                  <label className="text-slate-500 block mb-1">Risk Profile Presets</label>
                  <div className="grid grid-cols-3 gap-1.5">
                    <button
                      onClick={() => setExpectedReturn(8)}
                      className={`py-1 px-1 rounded-lg border text-[11px] font-bold transition-all ${
                        expectedReturn === 8
                          ? 'border-indigo-500 bg-indigo-500/20 text-indigo-300'
                          : 'border-slate-800 bg-[#161920] text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      Conservative (8%)
                    </button>
                    <button
                      onClick={() => setExpectedReturn(12)}
                      className={`py-1 px-1 rounded-lg border text-[11px] font-bold transition-all ${
                        expectedReturn === 12
                          ? 'border-indigo-500 bg-indigo-500/20 text-indigo-300'
                          : 'border-slate-800 bg-[#161920] text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      Moderate (12%)
                    </button>
                    <button
                      onClick={() => setExpectedReturn(15)}
                      className={`py-1 px-1 rounded-lg border text-[11px] font-bold transition-all ${
                        expectedReturn === 15
                          ? 'border-indigo-500 bg-indigo-500/20 text-indigo-300'
                          : 'border-slate-800 bg-[#161920] text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      Aggressive (15%)
                    </button>
                  </div>
                </div>
              </div>

              {/* Time Period Field */}
              <div>
                <div className="flex justify-between mb-1">
                  <label className="text-slate-400">Time Period</label>
                  <span className="font-numeric font-bold text-white">{periodYears} Yrs</span>
                </div>
                <div className="relative flex items-center bg-[#161920] border border-slate-800 rounded-lg overflow-hidden focus-within:border-indigo-500">
                  <input
                    type="number"
                    value={periodYears}
                    onChange={(e) => setPeriodYears(Number(e.target.value))}
                    className="w-full bg-transparent border-none text-white font-numeric py-2 pl-3 outline-none"
                  />
                  <span className="pr-3 text-slate-400 font-numeric">Yrs</span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={40}
                  value={periodYears}
                  onChange={(e) => setPeriodYears(Number(e.target.value))}
                  className="w-full mt-2 appearance-none bg-transparent cursor-pointer"
                />
              </div>

              {/* Annual Step-up (Optional for SIP) */}
              {calcType === 'SIP' && (
                <div className="p-3 bg-[#161920] rounded-lg border border-slate-800 space-y-2">
                  <div className="flex justify-between items-center">
                    <label className="text-slate-200 font-semibold flex items-center gap-1.5">
                      <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
                      Annual Step-up (Optional)
                    </label>
                    <input
                      type="checkbox"
                      checked={stepUpEnabled}
                      onChange={(e) => setStepUpEnabled(e.target.checked)}
                      className="w-4 h-4 accent-indigo-600 rounded cursor-pointer"
                    />
                  </div>

                  {stepUpEnabled && (
                    <div className="pt-1">
                      <div className="flex justify-between mb-1">
                        <span className="text-slate-400">Step-up Percentage</span>
                        <span className="font-numeric text-white font-bold">{stepUpPercent}%</span>
                      </div>
                      <input
                        type="range"
                        min={1}
                        max={30}
                        value={stepUpPercent}
                        onChange={(e) => setStepUpPercent(Number(e.target.value))}
                        className="w-full appearance-none bg-transparent cursor-pointer"
                      />
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Calculated Results & Trajectory */}
        <div className="w-full md:w-1/2 p-5 bg-[#0A0B0E] flex flex-col justify-between overflow-y-auto relative">
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/10 rounded-full blur-[80px] pointer-events-none"></div>

          <div>
            {/* Primary Calculated Result Display */}
            <div className="text-center mb-5">
              <p className="text-[11px] font-bold text-slate-400 tracking-widest uppercase mb-1">
                {calcMode === 'TARGET' && calcType === 'SIP' ? 'REQUIRED MONTHLY SIP' : 'ESTIMATED TOTAL VALUE'}
              </p>

              <div className="flex justify-center items-baseline gap-1 text-emerald-400">
                <span className="text-2xl font-bold">₹</span>
                <span className="text-3xl md:text-4xl font-extrabold font-numeric text-emerald-400">
                  {(calcMode === 'TARGET' && calcType === 'SIP' ? requiredMonthlySIP : estimatedTotalValue).toLocaleString('en-IN')}
                </span>
              </div>

              <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                {calcType === 'LUMPSUM'
                  ? `on an investment of ₹${amount.toLocaleString('en-IN')} over ${periodYears} years at ${expectedReturn}% p.a`
                  : calcMode === 'TARGET'
                  ? `to reach ₹${(targetWealth / 10000000).toFixed(2)} Cr in ${periodYears} years at ${expectedReturn}% p.a${
                      stepUpEnabled ? ` with ${stepUpPercent}% step-up` : ''
                    }`
                  : `on monthly SIP of ₹${amount.toLocaleString('en-IN')} over ${periodYears} years at ${expectedReturn}% p.a${
                      stepUpEnabled ? ` with ${stepUpPercent}% step-up` : ''
                    }`}
              </p>
            </div>

            {/* Summary Stat Blocks */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="bg-[#161920] p-3 rounded-lg border border-slate-800">
                <p className="text-[11px] text-slate-400 mb-1">Total Investment</p>
                <p className="font-numeric font-bold text-base text-slate-100">
                  ₹{totalInvested.toLocaleString('en-IN')}
                </p>
              </div>

              <div className="bg-[#161920] p-3 rounded-lg border border-slate-800">
                <p className="text-[11px] text-slate-400 mb-1">Est. Returns / Wealth Gained</p>
                <p className="font-numeric font-bold text-base text-emerald-400">
                  +₹{estimatedReturns.toLocaleString('en-IN')}
                </p>
              </div>
            </div>

            {/* Rule of 72 Banner */}
            <div className="bg-indigo-500/10 border border-indigo-500/25 p-2.5 rounded-lg mb-4 flex items-center gap-2 text-xs">
              <Info className="w-4 h-4 text-emerald-400 shrink-0" />
              <p className="text-slate-300">
                Rule of 72: Investment projected to double in{' '}
                <span className="text-emerald-400 font-bold font-numeric">~{doublingYears} years</span>
              </p>
            </div>

            {/* Wealth Trajectory Graph Area */}
            <div className="w-full h-44 bg-[#161920] border border-slate-800 rounded-lg mb-4 relative overflow-hidden flex flex-col justify-between p-3 pt-6">
              <div className="absolute top-2 left-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Wealth Trajectory
              </div>

              <div className="absolute top-2 right-3 bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 px-2 py-0.5 rounded-full flex items-center gap-1 text-[10px] font-bold">
                <Sparkles className="w-3 h-3" />
                <span>AI Optimized</span>
              </div>

              {/* Bar Representation */}
              <div className="w-full h-28 flex items-end justify-between gap-1.5 px-1 mt-auto">
                {trajectoryBars.map((height, i) => (
                  <div key={i} className="w-full bg-slate-800 rounded-t h-full relative flex items-end">
                    <div
                      className="w-full bg-indigo-600 rounded-t transition-all duration-500 shadow-[0_0_8px_rgba(99,102,241,0.4)]"
                      style={{ height: `${height}%` }}
                    ></div>
                  </div>
                ))}
              </div>
            </div>

            {/* Action CTA */}
            <button
              onClick={onClose}
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm rounded-lg transition-all flex justify-center items-center gap-2 shadow-[0_0_15px_rgba(99,102,241,0.4)]"
            >
              <span>Calculate & Start Strategy</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
