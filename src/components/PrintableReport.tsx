import { useMemo } from 'react';
import { 
  Printer, 
  X, 
  TrendingUp, 
  ShieldCheck, 
  AlertTriangle, 
  Calendar, 
  Wallet, 
  Target, 
  Flame,
  CheckCircle2
} from 'lucide-react';
import { AssetItem, LiabilityItem, FireSettings, UserProfile } from '../types';
import { formatRupiah, ASSET_CATEGORIES, LIABILITY_CATEGORIES } from '../utils/formatters';

interface PrintableReportProps {
  isOpen: boolean;
  onClose: () => void;
  profile: UserProfile;
  assets: AssetItem[];
  liabilities: LiabilityItem[];
  fireSettings: FireSettings;
  netWorth: number;
}

export function PrintableReport({
  isOpen,
  onClose,
  profile,
  assets,
  liabilities,
  fireSettings,
  netWorth,
}: PrintableReportProps) {
  const printDate = new Date().toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const totalAssets = useMemo(() => assets.reduce((s, a) => s + (a.amount || 0), 0), [assets]);
  const totalLiabilities = useMemo(() => liabilities.reduce((s, l) => s + (l.balance || 0), 0), [liabilities]);
  const debtRatio = totalAssets > 0 ? (totalLiabilities / totalAssets) * 100 : 0;
  
  const annualInterestDrain = useMemo(() => {
    return liabilities.reduce((s, l) => s + (l.balance * (l.annualInterestRate / 100)), 0);
  }, [liabilities]);

  const fireTarget = fireSettings.monthlyExpense * 12 * fireSettings.multiplier;
  const fireProgress = fireTarget > 0 ? (netWorth / fireTarget) * 100 : 0;

  // Sorted liabilities by interest rate
  const sortedLiabilities = useMemo(() => {
    return [...liabilities].sort((a, b) => b.annualInterestRate - a.annualInterestRate);
  }, [liabilities]);

  const handlePrint = () => {
    window.print();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-neutral-900/60 backdrop-blur-xs overflow-y-auto">
      
      {/* Print Overlay Container */}
      <div 
        className="bg-white rounded-2xl shadow-2xl border border-stone-200 w-full max-w-4xl my-auto overflow-hidden flex flex-col max-h-[95vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Toolbar (Hidden on actual print) */}
        <div className="print:hidden bg-stone-900 text-white px-6 py-3.5 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <Printer className="w-4 h-4 text-amber-400" />
            <span className="font-bold text-sm">Pratinjau Lembar Neraca Keuangan Pribadi</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              className="px-4 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Cetak / Simpan PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-white/10 text-neutral-300 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Document Content */}
        <div id="printable-statement" className="p-4 sm:p-8 md:p-10 overflow-y-auto font-sans text-neutral-900 space-y-6 sm:space-y-8 bg-white">
          
          {/* Document Header */}
          <div className="border-b-2 border-neutral-900 pb-5 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black uppercase tracking-widest text-red-700 bg-red-50 border border-red-200 px-2 py-0.5 rounded">
                  Dokumen Privat & Rahasia
                </span>
                <span className="text-xs text-neutral-500">• NetWorth Anda</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-neutral-900 mt-2">
                Neraca Keuangan Pribadi & Audit Finansial
              </h1>
              <p className="text-xs text-neutral-600 mt-1">
                Laporan Komprehensif Aset, Liabilitas, Rasio Solvabilitas, dan Peta Jalan Bebas Finansial (FIRE)
              </p>
            </div>

            <div className="text-right sm:text-right shrink-0 space-y-0.5">
              <div className="text-sm font-bold text-neutral-900">{profile.name}</div>
              <div className="text-xs text-neutral-500">Usia: {profile.age} Tahun</div>
              <div className="text-xs text-neutral-500">Tanggal Audit: {printDate}</div>
            </div>
          </div>

          {/* Key Metric Highlights Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl border border-stone-300 bg-stone-50">
              <span className="text-[11px] font-bold text-neutral-500 uppercase tracking-wider block">
                Kekayaan Bersih (Net Worth)
              </span>
              <div className={`text-xl font-black mt-1 ${netWorth >= 0 ? 'text-neutral-900' : 'text-red-700'}`}>
                {formatRupiah(netWorth)}
              </div>
            </div>

            <div className="p-4 rounded-xl border border-stone-300 bg-stone-50">
              <span className="text-[11px] font-bold text-neutral-500 uppercase tracking-wider block">
                Total Aset
              </span>
              <div className="text-xl font-black text-emerald-800 mt-1">
                {formatRupiah(totalAssets)}
              </div>
            </div>

            <div className="p-4 rounded-xl border border-stone-300 bg-stone-50">
              <span className="text-[11px] font-bold text-neutral-500 uppercase tracking-wider block">
                Total Liabilitas
              </span>
              <div className="text-xl font-black text-rose-800 mt-1">
                {formatRupiah(totalLiabilities)}
              </div>
            </div>

            <div className="p-4 rounded-xl border border-stone-300 bg-stone-50">
              <span className="text-[11px] font-bold text-neutral-500 uppercase tracking-wider block">
                Rasio Utang terhadap Aset
              </span>
              <div className="text-xl font-black text-neutral-900 mt-1">
                {debtRatio.toFixed(1)}%
              </div>
            </div>
          </div>

          {/* ASSET BREAKDOWN TABLE */}
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-stone-200 pb-2">
              <h3 className="font-extrabold text-base text-neutral-900">
                1. Portofolio & Rincian Aset ({assets.length} Item)
              </h3>
              <span className="text-xs font-bold text-emerald-800">
                Total: {formatRupiah(totalAssets)}
              </span>
            </div>

            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-stone-300 text-neutral-500 uppercase font-bold text-[10px]">
                  <th className="py-2 px-2">Kategori</th>
                  <th className="py-2 px-2">Nama Aset / Alokasi</th>
                  <th className="py-2 px-2">Institusi / Sekuritas</th>
                  <th className="py-2 px-2 text-center">Likuiditas</th>
                  <th className="py-2 px-2 text-right">Nilai Pasar</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-200">
                {assets.map((item) => {
                  const meta = ASSET_CATEGORIES[item.category];
                  return (
                    <tr key={item.id} className="text-neutral-800">
                      <td className="py-2.5 px-2 font-medium text-neutral-600">
                        {meta?.label || item.category}
                      </td>
                      <td className="py-2.5 px-2 font-bold text-neutral-900">
                        {item.name}
                        {item.notes && (
                          <span className="block text-[10px] font-normal text-neutral-500">{item.notes}</span>
                        )}
                      </td>
                      <td className="py-2.5 px-2 text-neutral-600">{item.institution || '-'}</td>
                      <td className="py-2.5 px-2 text-center">
                        <span className={`px-1.5 py-0.5 rounded text-[10px] font-semibold ${
                          meta?.isLiquid ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-stone-100 text-stone-700'
                        }`}>
                          {meta?.isLiquid ? 'Likuid (<1 bln)' : 'Non-Likuid'}
                        </span>
                      </td>
                      <td className="py-2.5 px-2 text-right font-black text-neutral-900">
                        {formatRupiah(item.amount)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* LIABILITY BREAKDOWN TABLE (AVALANCHE PRIORITY) */}
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-stone-200 pb-2">
              <h3 className="font-extrabold text-base text-neutral-900">
                2. Rincian Liabilitas (Prioritas Pelunasan Bunga Tertinggi)
              </h3>
              <span className="text-xs font-bold text-rose-800">
                Total: {formatRupiah(totalLiabilities)}
              </span>
            </div>

            {sortedLiabilities.length === 0 ? (
              <p className="text-xs text-neutral-500 italic py-2">
                Tidak ada kewajiban atau liabilitas terdaftar. Posisi neraca Anda bebas utang.
              </p>
            ) : (
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-stone-300 text-neutral-500 uppercase font-bold text-[10px]">
                    <th className="py-2 px-2">Prioritas</th>
                    <th className="py-2 px-2">Nama Liabilitas / Kreditur</th>
                    <th className="py-2 px-2 text-center">Bunga Tahunan</th>
                    <th className="py-2 px-2 text-right">Estimasi Bunga/Tahun</th>
                    <th className="py-2 px-2 text-right">Sisa Saldo Pokok</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-200">
                  {sortedLiabilities.map((item, idx) => {
                    const interestDrain = item.balance * (item.annualInterestRate / 100);
                    return (
                      <tr key={item.id} className="text-neutral-800">
                        <td className="py-2.5 px-2">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            idx === 0 ? 'bg-red-600 text-white' : 'bg-stone-200 text-neutral-800'
                          }`}>
                            #{idx + 1}
                          </span>
                        </td>
                        <td className="py-2.5 px-2 font-bold text-neutral-900">
                          {item.name}
                          {item.notes && (
                            <span className="block text-[10px] font-normal text-neutral-500">{item.notes}</span>
                          )}
                        </td>
                        <td className="py-2.5 px-2 text-center font-bold text-red-700">
                          {item.annualInterestRate.toFixed(1)}% p.a.
                        </td>
                        <td className="py-2.5 px-2 text-right text-rose-700 font-semibold">
                          {formatRupiah(interestDrain)}
                        </td>
                        <td className="py-2.5 px-2 text-right font-black text-neutral-900">
                          {formatRupiah(item.balance)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
                <tfoot>
                  <tr className="border-t-2 border-stone-400 font-bold">
                    <td colSpan={3} className="py-2 px-2 text-right text-neutral-600">
                      Total Beban Bunga yang Terbuang per Tahun:
                    </td>
                    <td className="py-2 px-2 text-right text-red-700 font-black">
                      {formatRupiah(annualInterestDrain)}
                    </td>
                    <td className="py-2 px-2 text-right text-neutral-900 font-black">
                      {formatRupiah(totalLiabilities)}
                    </td>
                  </tr>
                </tfoot>
              </table>
            )}
          </div>

          {/* FIRE & SAVINGS TARGET ROADMAP */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-2">
            
            {/* Savings Goal Box */}
            <div className="p-4 rounded-xl border border-stone-200 bg-stone-50 space-y-2">
              <h4 className="font-extrabold text-xs uppercase tracking-wider text-red-800 flex items-center gap-1.5">
                <Target className="w-4 h-4 text-red-600" /> Target Tabungan & Investasi
              </h4>
              <div className="space-y-1 text-xs text-neutral-700">
                <p><strong>Nama Tujuan:</strong> {profile.targetTitle || 'Target Kemandirian Finansial'}</p>
                <p><strong>Target Nominal:</strong> {formatRupiah(profile.savingsTargetAmount)}</p>
                <p><strong>Target Tercapai:</strong> Tahun {profile.targetYear} (Usia ~{profile.age + Math.max(0, profile.targetYear - 2026)} tahun)</p>
                <p><strong>Akumulasi Saat Ini:</strong> {formatRupiah(Math.max(0, netWorth))} ({(Math.min(100, Math.max(0, netWorth) / Math.max(1, profile.savingsTargetAmount) * 100)).toFixed(1)}%)</p>
              </div>
            </div>

            {/* FIRE Roadmap Box */}
            <div className="p-4 rounded-xl border border-stone-200 bg-stone-50 space-y-2">
              <h4 className="font-extrabold text-xs uppercase tracking-wider text-amber-800 flex items-center gap-1.5">
                <Flame className="w-4 h-4 text-amber-600" /> Parameter Kebebasan Finansial (FIRE)
              </h4>
              <div className="space-y-1 text-xs text-neutral-700">
                <p><strong>Pengeluaran Bulanan:</strong> {formatRupiah(fireSettings.monthlyExpense)}/bulan</p>
                <p><strong>Pengali Bebas Finansial:</strong> {fireSettings.multiplier}x (SWR {(100 / fireSettings.multiplier).toFixed(2)}%)</p>
                <p><strong>Target Dana Mandiri (FIRE Number):</strong> {formatRupiah(fireTarget)}</p>
                <p><strong>Tingkat Tabungan (Savings Rate):</strong> {((fireSettings.monthlySavings / Math.max(1, fireSettings.monthlyIncome)) * 100).toFixed(1)}% ({formatRupiah(fireSettings.monthlySavings)}/bln)</p>
              </div>
            </div>

          </div>

          {/* Document Footer & Signature Area */}
          <div className="border-t border-stone-300 pt-5 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-500">
            <div>
              <p>Dihasilkan secara lokal melalui sistem <strong>NetWorth Anda</strong>.</p>
              <p className="text-[10px] text-neutral-400">Tidak ada data keuangan yang disimpan di server publik.</p>
            </div>
            <div className="text-center sm:text-right">
              <div className="h-10 border-b border-stone-400 w-40 mx-auto sm:ml-auto"></div>
              <span className="text-[11px] font-bold text-neutral-800 block mt-1">{profile.name}</span>
            </div>
          </div>

        </div>

        {/* Modal Bottom Footer (Hidden on print) */}
        <div className="print:hidden border-t border-stone-200 bg-stone-50 px-6 py-3 flex items-center justify-between shrink-0">
          <span className="text-xs text-neutral-500">
            Gunakan fungsi cetak browser (Ctrl+P atau Cmd+P) lalu pilih <em>"Save as PDF"</em>.
          </span>
          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              className="px-4 py-1.5 rounded-lg bg-red-700 hover:bg-red-800 text-white font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Cetak Sekarang</span>
            </button>
            <button
              onClick={onClose}
              className="px-4 py-1.5 rounded-lg bg-stone-200 hover:bg-stone-300 text-neutral-800 font-bold text-xs transition-colors cursor-pointer"
            >
              Tutup
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
