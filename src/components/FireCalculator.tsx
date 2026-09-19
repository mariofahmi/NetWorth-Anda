import { useState, useMemo } from 'react';
import { 
  Target, 
  HelpCircle, 
  Flame, 
  Sparkles, 
  Clock, 
  ChevronRight, 
  TrendingUp, 
  ShieldCheck, 
  CheckCircle2, 
  Zap 
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { FireSettings } from '../types';
import { formatRupiah } from '../utils/formatters';

interface FireCalculatorProps {
  netWorth: number;
  settings: FireSettings;
  onUpdateSettings: (newSettings: Partial<FireSettings>) => void;
  onOpenInfoModal: () => void;
}

export function FireCalculator({
  netWorth,
  settings,
  onUpdateSettings,
  onOpenInfoModal,
}: FireCalculatorProps) {
  const [isEditingExpense, setIsEditingExpense] = useState(false);
  const [tempMonthlyExpense, setTempMonthlyExpense] = useState(settings.monthlyExpense.toString());
  const [customMultiplierInput, setCustomMultiplierInput] = useState(settings.multiplier.toString());

  const annualExpense = settings.monthlyExpense * 12;
  const fireTarget = annualExpense * settings.multiplier;
  
  // Progress percentage
  const progressPercent = fireTarget > 0 ? Math.min(Math.max((netWorth / fireTarget) * 100, 0), 100) : 0;
  const actualPercent = fireTarget > 0 ? (netWorth / fireTarget) * 100 : 0;
  const remainingAmount = Math.max(fireTarget - netWorth, 0);

  // Trigger confetti if >= 100%
  const handleMilestoneCelebration = () => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
    });
  };

  // Estimate years to reach FIRE:
  // Using compound interest formula with monthly contributions
  const estimatedYearsToFire = useMemo(() => {
    if (netWorth >= fireTarget) return 0;
    if (settings.monthlySavings <= 0) return null;

    const r = (settings.expectedReturnRate || 8) / 100 / 12; // monthly rate
    let current = Math.max(netWorth, 0);
    const target = fireTarget;
    const pmt = settings.monthlySavings;

    let months = 0;
    const maxMonths = 12 * 80; // cap at 80 years

    while (current < target && months < maxMonths) {
      current = current * (1 + r) + pmt;
      months++;
    }

    if (months >= maxMonths) return null;
    return (months / 12).toFixed(1);
  }, [netWorth, fireTarget, settings.monthlySavings, settings.expectedReturnRate]);

  // Safe Withdrawal Rate (SWR) based on multiplier
  const swr = settings.multiplier > 0 ? (100 / settings.multiplier).toFixed(2) : '0';

  // Multiplier presets
  const presets = [
    { value: 20, label: '20x', note: 'Tarik 5.0% (Agresif)' },
    { value: 25, label: '25x', note: 'Tarik 4.0% (Standar AS)' },
    { value: 30, label: '30x', note: 'Tarik 3.3% (Realistis Indo)' },
    { value: 33, label: '33x', note: 'Tarik 3.0% (Konservatif)' },
  ];

  // Milestones
  const emergencyFundTarget = settings.monthlyExpense * 6; // 6 bulan
  const miniFireTarget = fireTarget * 0.1;
  const halfwayFireTarget = fireTarget * 0.5;

  return (
    <div id="section-fire-calculator" className="bg-white rounded-2xl p-5 sm:p-7 shadow-xs border border-slate-200/90 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-400 flex items-center justify-center text-white shadow-xs">
            <Flame className="w-5 h-5 fill-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-bold text-slate-900 tracking-tight">
                Angka Target Bebas Finansial
              </h3>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
                Pengali Fleksibel
              </span>
            </div>
            <p className="text-xs text-neutral-500">
              Kebutuhan dana pensiun dini disesuaikan dengan target inflasi & imbal hasil investasi
            </p>
          </div>
        </div>

        <button
          onClick={onOpenInfoModal}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-red-700 hover:text-red-800 bg-amber-50 hover:bg-amber-100 px-3 py-1.5 rounded-lg border border-amber-200 transition-colors self-start sm:self-center cursor-pointer"
        >
          <HelpCircle className="w-3.5 h-3.5 text-red-600" />
          <span>Panduan Pemilihan Pengali Target</span>
        </button>
      </div>

      {/* Inputs & Multiplier Controls */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        
        {/* Input 1: Pengeluaran Bulanan / Tahunan */}
        <div className="bg-stone-50 rounded-xl p-4 border border-stone-200">
          <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1.5">
            Pengeluaran Bulanan
          </label>
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-neutral-500">Rp</span>
            <input
              type="number"
              inputMode="numeric"
              id="input-monthly-expense"
              value={settings.monthlyExpense}
              onChange={(e) => {
                const val = Math.max(0, parseInt(e.target.value, 10) || 0);
                onUpdateSettings({ monthlyExpense: val });
              }}
              className="w-full bg-white border border-stone-300 rounded-lg px-3 py-2 text-base font-bold text-neutral-800 focus:outline-none focus:ring-2 focus:ring-red-500"
              step="500000"
            />
          </div>
          <div className="mt-2 text-xs text-neutral-500 flex justify-between">
            <span>Pengeluaran Tahunan:</span>
            <span className="font-semibold text-neutral-800">{formatRupiah(annualExpense)}/thn</span>
          </div>
        </div>

        {/* Input 2: Pengali (Multiplier) Selector */}
        <div className="bg-stone-50 rounded-xl p-4 border border-stone-200 lg:col-span-2">
          <div className="flex items-center justify-between mb-2">
            <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider">
              Pilihan Pengali Target (Target = Pengeluaran Tahunan × Pengali)
            </label>
            <span className="text-xs font-semibold text-neutral-600">
              Tingkat Tarik Aman (SWR): <span className="text-red-700 font-bold">{swr}% / tahun</span>
            </span>
          </div>

          {/* Preset Buttons */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-3">
            {presets.map((p) => {
              const isSelected = settings.multiplier === p.value;
              return (
                <button
                  key={p.value}
                  id={`btn-multiplier-${p.value}`}
                  onClick={() => onUpdateSettings({ multiplier: p.value })}
                  className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-red-600 text-white border-red-600 shadow-xs'
                      : 'bg-white text-neutral-700 border-stone-200 hover:border-stone-300 hover:bg-stone-50'
                  }`}
                >
                  <div className="font-extrabold text-sm">{p.label}</div>
                  <div className={`text-[10px] leading-tight mt-0.5 ${isSelected ? 'text-amber-100' : 'text-neutral-500'}`}>
                    {p.note}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Custom multiplier slider & direct numeric input */}
          <div className="flex items-center gap-3 text-xs bg-white p-2.5 rounded-lg border border-stone-200">
            <span className="text-neutral-700 font-semibold whitespace-nowrap">Ubah Pengali Fleksibel:</span>
            <input
              type="range"
              min="10"
              max="50"
              step="1"
              value={settings.multiplier}
              onChange={(e) => onUpdateSettings({ multiplier: Math.max(1, parseInt(e.target.value, 10) || 1) })}
              className="w-full accent-red-600 cursor-pointer"
            />
            <div className="flex items-center gap-1 shrink-0">
              <input
                type="number"
                min="5"
                max="100"
                value={settings.multiplier}
                onChange={(e) => {
                  const val = parseInt(e.target.value, 10);
                  if (!isNaN(val) && val > 0) {
                    onUpdateSettings({ multiplier: val });
                  }
                }}
                className="w-16 px-2 py-1 bg-amber-50 border border-amber-300 rounded text-center font-black text-red-700 focus:outline-none focus:ring-1 focus:ring-red-500 text-xs"
              />
              <span className="font-bold text-neutral-600">x</span>
            </div>
          </div>
        </div>

      </div>

      {/* Main Target Result & Progress Bar */}
      <div className="bg-gradient-to-br from-red-950 via-neutral-900 to-stone-900 text-white rounded-2xl p-5 sm:p-7 relative overflow-hidden shadow-md border border-red-950">
        {/* Glow accent */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-amber-300 flex items-center gap-1.5 mb-1">
              <Target className="w-4 h-4 text-amber-400" />
              Angka Bebas Finansial Anda ({settings.multiplier}x Pengeluaran)
            </span>
            <div className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white mt-1">
              {formatRupiah(fireTarget)}
            </div>
            <p className="text-xs text-stone-300 mt-1.5 max-w-xl">
              Dihitung dari pengeluaran tahunan {formatRupiah(annualExpense)} × {settings.multiplier}. 
              Jika diinvestasikan di portofolio berimbal hasil ~{settings.expectedReturnRate || 8}%, 
              modal pokok tidak akan tergerus oleh penarikan kebutuhan tahunan Anda.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-xl p-3.5 border border-white/15 min-w-[200px] text-right md:text-right">
            <span className="text-xs text-stone-300 block">Progres Tercapai</span>
            <span className="text-3xl font-black text-amber-300">
              {actualPercent.toFixed(1)}%
            </span>
            <span className="text-[11px] text-stone-300 block mt-0.5">
              {remainingAmount <= 0 ? '🎉 Sudah Bebas Finansial!' : `Kurang ${formatRupiah(remainingAmount, true)} lagi`}
            </span>
          </div>
        </div>

        {/* Visual Progress Bar */}
        <div className="mt-6">
          <div className="flex justify-between text-xs text-stone-300 mb-1.5 font-medium">
            <span>Nilai Bersih Sekarang: <strong className="text-white">{formatRupiah(netWorth)}</strong></span>
            <span>Target Bebas Finansial: <strong className="text-amber-300">{formatRupiah(fireTarget)}</strong></span>
          </div>

          <div className="h-4 w-full bg-neutral-800 rounded-full overflow-hidden p-0.5 border border-white/10 relative">
            <div
              style={{ width: `${progressPercent}%` }}
              className={`h-full rounded-full transition-all duration-700 ${
                progressPercent >= 100
                  ? 'bg-gradient-to-r from-red-500 via-amber-400 to-yellow-300'
                  : 'bg-gradient-to-r from-red-600 via-amber-500 to-yellow-400'
              }`}
            />
          </div>

          {/* Quick Milestones Indicators */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-4 pt-3 border-t border-white/10 text-xs">
            <div className="flex items-center gap-1.5">
              <span className={`w-3.5 h-3.5 rounded-full flex items-center justify-center text-[9px] ${
                netWorth >= emergencyFundTarget ? 'bg-red-600 text-white font-bold' : 'bg-neutral-700 text-neutral-300'
              }`}>
                ✓
              </span>
              <span className="text-stone-300">Dana Darurat (6 bln)</span>
            </div>

            <div className="flex items-center gap-1.5">
              <span className={`w-3.5 h-3.5 rounded-full flex items-center justify-center text-[9px] ${
                netWorth >= miniFireTarget ? 'bg-red-600 text-white font-bold' : 'bg-neutral-700 text-neutral-300'
              }`}>
                {netWorth >= miniFireTarget ? '✓' : '•'}
              </span>
              <span className="text-stone-300">Fondasi Awal (10%)</span>
            </div>

            <div className="flex items-center gap-1.5">
              <span className={`w-3.5 h-3.5 rounded-full flex items-center justify-center text-[9px] ${
                netWorth >= halfwayFireTarget ? 'bg-amber-500 text-neutral-950 font-bold' : 'bg-neutral-700 text-neutral-300'
              }`}>
                {netWorth >= halfwayFireTarget ? '✓' : '•'}
              </span>
              <span className="text-stone-300">Setengah Jalan (50%)</span>
            </div>

            <div className="flex items-center gap-1.5">
              <span className={`w-3.5 h-3.5 rounded-full flex items-center justify-center text-[9px] ${
                netWorth >= fireTarget ? 'bg-yellow-400 text-neutral-950 font-black' : 'bg-neutral-700 text-neutral-300'
              }`}>
                {netWorth >= fireTarget ? '★' : '•'}
              </span>
              <span className="text-amber-300 font-bold">Bebas Finansial (100%)</span>
            </div>
          </div>
        </div>

        {/* Projection Timeline Banner */}
        <div className="mt-5 pt-4 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-stone-200">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-amber-400 shrink-0" />
            <span>
              {estimatedYearsToFire !== null ? (
                <>
                  Estimasi waktu menuju Bebas Finansial: <strong className="text-amber-300 font-bold">{estimatedYearsToFire} tahun lagi</strong> (dengan tabungan {formatRupiah(settings.monthlySavings, true)}/bln & imbal hasil majemuk {settings.expectedReturnRate || 8}%/thn).
                </>
              ) : (
                <>
                  Masukkan tabungan bulanan rutin pada kartu Tingkat Tabungan di bawah untuk melihat estimasi tahun menuju Bebas Finansial.
                </>
              )}
            </span>
          </div>

          {actualPercent >= 100 && (
            <button
              onClick={handleMilestoneCelebration}
              className="px-3 py-1.5 bg-amber-400 hover:bg-amber-300 text-neutral-950 font-bold rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 self-start sm:self-auto shadow-xs"
            >
              <Sparkles className="w-3.5 h-3.5" />
              Rayakan Bebas Finansial!
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
