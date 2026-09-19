import { useMemo } from 'react';
import { 
  Wallet, 
  ShieldAlert, 
  ArrowUpRight, 
  Layers, 
  Percent, 
  CheckCircle2, 
  AlertTriangle 
} from 'lucide-react';
import { AssetItem, LiabilityItem } from '../types';
import { formatRupiah, ASSET_CATEGORIES } from '../utils/formatters';

interface NetWorthSummaryProps {
  assets: AssetItem[];
  liabilities: LiabilityItem[];
  onScrollToAssets: () => void;
  onScrollToLiabilities: () => void;
}

export function NetWorthSummary({
  assets,
  liabilities,
  onScrollToAssets,
  onScrollToLiabilities,
}: NetWorthSummaryProps) {
  const totalAssets = useMemo(
    () => assets.reduce((sum, item) => sum + (item.amount || 0), 0),
    [assets]
  );

  const totalLiabilities = useMemo(
    () => liabilities.reduce((sum, item) => sum + (item.balance || 0), 0),
    [liabilities]
  );

  const netWorth = totalAssets - totalLiabilities;

  // Highest interest rate liability
  const highestInterest = useMemo(() => {
    if (liabilities.length === 0) return null;
    return [...liabilities].sort((a, b) => b.annualInterestRate - a.annualInterestRate)[0];
  }, [liabilities]);

  // Liquid assets breakdown
  const liquidAssets = useMemo(() => {
    return assets.reduce((sum, a) => {
      const meta = ASSET_CATEGORIES[a.category];
      return meta?.isLiquid ? sum + a.amount : sum;
    }, 0);
  }, [assets]);

  // Debt-to-Asset ratio
  const debtToAssetRatio = totalAssets > 0 ? (totalLiabilities / totalAssets) * 100 : 0;

  // Proportional breakdown by asset category
  const categoryBreakdown = useMemo(() => {
    if (totalAssets === 0) return [];
    const grouped: Record<string, number> = {};
    assets.forEach((a) => {
      grouped[a.category] = (grouped[a.category] || 0) + a.amount;
    });

    const colors: Record<string, string> = {
      rekening_bank: 'bg-blue-500',
      deposito: 'bg-sky-400',
      reksa_dana: 'bg-emerald-500',
      sbn: 'bg-teal-500',
      emas: 'bg-amber-400',
      saham: 'bg-indigo-500',
      bpjs_ketenagakerjaan: 'bg-green-600',
      properti: 'bg-orange-400',
      aset_lainnya: 'bg-purple-400',
    };

    return Object.entries(grouped)
      .map(([cat, amount]) => ({
        category: cat,
        label: ASSET_CATEGORIES[cat as keyof typeof ASSET_CATEGORIES]?.label || cat,
        amount,
        percentage: (amount / totalAssets) * 100,
        color: colors[cat] || 'bg-slate-400',
      }))
      .sort((a, b) => b.amount - a.amount);
  }, [assets, totalAssets]);

  return (
    <section className="space-y-4">
      {/* 3 Main Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5">
        
        {/* Card 1: Nilai Bersih (Net Worth) - Luxury Obsidian Gradient Card */}
        <div 
          id="card-net-worth"
          className="relative overflow-hidden bg-gradient-to-br from-neutral-950 via-stone-900 to-neutral-900 text-white rounded-3xl p-6 sm:p-7 shadow-lg shadow-stone-900/20 border border-stone-800/80 transition-all duration-300"
        >
          {/* Subtle Ambient Light Glow */}
          <div className="absolute -top-12 -right-12 w-48 h-48 bg-gradient-to-br from-amber-500/15 via-red-500/15 to-transparent rounded-full blur-2xl pointer-events-none" />

          <div className="relative z-10 flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-stone-300 uppercase tracking-widest flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-red-600/20 border border-red-500/30 flex items-center justify-center text-red-400">
                <Wallet className="w-3.5 h-3.5" />
              </div>
              Nilai Bersih (Net Worth)
            </span>
            <span className={`text-[11px] font-extrabold px-3 py-1 rounded-full border ${
              netWorth >= 0 
                ? 'bg-emerald-950/80 text-emerald-300 border-emerald-500/30' 
                : 'bg-rose-950/80 text-rose-300 border-rose-500/30'
            }`}>
              {netWorth >= 0 ? '✓ Surplus Finansial' : '⚠️ Defisit Utang'}
            </span>
          </div>

          <div className="relative z-10 mt-2">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white">
              {formatRupiah(netWorth)}
            </h2>
            <div className="text-xs text-stone-300 mt-2 flex items-center gap-1.5 flex-wrap">
              <span>Aset: <strong className="text-emerald-400 font-bold">{formatRupiah(totalAssets, true)}</strong></span>
              <span className="text-stone-500">−</span>
              <span>Utang: <strong className="text-rose-400 font-bold">{formatRupiah(totalLiabilities, true)}</strong></span>
            </div>
          </div>

          <div className="relative z-10 mt-5 pt-3.5 border-t border-stone-800/80 flex items-center justify-between text-xs text-stone-300">
            <span className="text-stone-400 font-medium">Rasio Utang / Aset:</span>
            <span className={`font-extrabold px-2 py-0.5 rounded-md ${
              debtToAssetRatio < 30 
                ? 'bg-emerald-900/40 text-emerald-300 border border-emerald-800/50' 
                : 'bg-amber-900/40 text-amber-300 border border-amber-800/50'
            }`}>
              {debtToAssetRatio.toFixed(1)}% {debtToAssetRatio < 30 ? '(Sangat Sehat)' : '(Perlu Ditekan)'}
            </span>
          </div>
        </div>

        {/* Card 2: Total Aset */}
        <div 
          id="card-total-assets"
          onClick={onScrollToAssets}
          className="bg-white rounded-3xl p-6 sm:p-7 shadow-xs border border-stone-200/90 hover:border-emerald-400 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-pointer group flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-neutral-500 uppercase tracking-wider flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                  <Layers className="w-3.5 h-3.5" />
                </div>
                Total Aset
              </span>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200/80 px-2.5 py-0.5 rounded-full group-hover:bg-emerald-100 transition-colors flex items-center gap-1">
                {assets.length} Item
                <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </span>
            </div>

            <div className="mt-1">
              <div className="text-3xl sm:text-4xl font-black tracking-tight text-neutral-900">
                {formatRupiah(totalAssets)}
              </div>
              <div className="flex items-center gap-2 mt-2 text-xs text-neutral-500">
                <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>Aset Likuid (Kas/Saham/Emas):</span>
                <span className="font-bold text-neutral-800">{formatRupiah(liquidAssets, true)}</span>
              </div>
            </div>
          </div>

          <div className="mt-5 pt-3.5 border-t border-stone-100 flex items-center justify-between text-xs text-neutral-500">
            <span>Instrumen Terbesar:</span>
            <span className="font-bold text-neutral-800 truncate max-w-[150px]">
              {categoryBreakdown[0]?.label || '-'}
            </span>
          </div>
        </div>

        {/* Card 3: Total Liabilitas / Utang */}
        <div 
          id="card-total-liabilities"
          onClick={onScrollToLiabilities}
          className="bg-white rounded-3xl p-6 sm:p-7 shadow-xs border border-stone-200/90 hover:border-rose-400 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-pointer group flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-neutral-500 uppercase tracking-wider flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600 group-hover:bg-rose-600 group-hover:text-white transition-colors">
                  <ShieldAlert className="w-3.5 h-3.5" />
                </div>
                Total Liabilitas
              </span>
              <span className="text-xs font-bold text-rose-700 bg-rose-50 border border-rose-200/80 px-2.5 py-0.5 rounded-full group-hover:bg-rose-100 transition-colors flex items-center gap-1">
                {liabilities.length} Utang
                <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </span>
            </div>

            <div className="mt-1">
              <div className="text-3xl sm:text-4xl font-black tracking-tight text-neutral-900">
                {formatRupiah(totalLiabilities)}
              </div>
              <div className="flex items-center gap-1.5 mt-2 text-xs text-rose-600">
                {highestInterest ? (
                  <>
                    <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate">
                      Bunga tertinggi: <strong className="font-bold">{highestInterest.annualInterestRate}% p.a.</strong> ({highestInterest.name})
                    </span>
                  </>
                ) : (
                  <span className="text-emerald-600 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Bebas Utang!
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="mt-5 pt-3.5 border-t border-stone-100 flex items-center justify-between text-xs text-neutral-500">
            <span>Prioritas Pelunasan:</span>
            <span className="font-bold text-rose-700 truncate max-w-[150px]">
              {highestInterest ? highestInterest.name : 'Tidak Ada (Bebas)'}
            </span>
          </div>
        </div>

      </div>

      {/* Asset Proportional Composition Bar */}
      {totalAssets > 0 && (
        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-xs mb-2">
            <span className="font-semibold text-slate-700">Komposisi Portofolio Aset</span>
            <span className="text-slate-500">Total {categoryBreakdown.length} Kategori</span>
          </div>
          {/* Progress bar segments */}
          <div className="h-3.5 w-full bg-slate-100 rounded-full overflow-hidden flex">
            {categoryBreakdown.map((item) => (
              <div
                key={item.category}
                style={{ width: `${Math.max(item.percentage, 1)}%` }}
                className={`${item.color} h-full transition-all`}
                title={`${item.label}: ${formatRupiah(item.amount)} (${item.percentage.toFixed(1)}%)`}
              />
            ))}
          </div>

          {/* Legend items */}
          <div className="flex flex-wrap gap-x-4 gap-y-1.5 mt-3 text-[11px] text-slate-600">
            {categoryBreakdown.slice(0, 6).map((item) => (
              <div key={item.category} className="flex items-center gap-1.5">
                <span className={`w-2.5 h-2.5 rounded-full ${item.color} shrink-0`} />
                <span className="text-slate-700 font-medium">{item.label}:</span>
                <span className="text-slate-500">{item.percentage.toFixed(0)}%</span>
              </div>
            ))}
            {categoryBreakdown.length > 6 && (
              <span className="text-slate-400">+{categoryBreakdown.length - 6} lainnya</span>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
