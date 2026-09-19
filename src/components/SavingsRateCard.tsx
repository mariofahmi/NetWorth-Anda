import { useState } from 'react';
import { 
  PiggyBank, 
  TrendingUp, 
  AlertCircle, 
  CheckCircle, 
  Sparkles, 
  ArrowRight,
  Info 
} from 'lucide-react';
import { formatRupiah } from '../utils/formatters';

interface SavingsRateCardProps {
  monthlyIncome: number;
  monthlySavings: number;
  onUpdateFinancials: (income: number, savings: number) => void;
}

export function SavingsRateCard({
  monthlyIncome,
  monthlySavings,
  onUpdateFinancials,
}: SavingsRateCardProps) {
  // Savings Rate formula: (Total Tabungan ÷ Penghasilan) * 100
  const savingsRate = monthlyIncome > 0 ? (monthlySavings / monthlyIncome) * 100 : 0;
  const clampedRate = Math.min(Math.max(savingsRate, 0), 100);

  // Status & Guidance tier
  let statusColor = 'text-neutral-600';
  let badgeColor = 'bg-stone-100 text-neutral-700 border-stone-200';
  let tierTitle = 'Mulai Menabung';
  let tierDescription = 'Mulailah dengan menyisihkan minimal 10-20% pendapatan begitu gajian sebelum belanja.';

  if (monthlyIncome === 0 && monthlySavings === 0) {
    statusColor = 'text-neutral-700';
    badgeColor = 'bg-stone-100 text-neutral-700 border-stone-200';
    tierTitle = 'Mulai Menabung 🌱';
    tierDescription = 'Masukkan angka penghasilan dan tabungan bulanan Anda di atas untuk mulai menghitung rasio tabungan.';
  } else if (savingsRate >= 60) {
    statusColor = 'text-red-700';
    badgeColor = 'bg-red-100 text-red-800 border-red-300';
    tierTitle = 'Master Bebas Finansial 🚀';
    tierDescription = 'Luar biasa! Di tingkat tabungan >60%, Anda berada di jalur super ekspres bebas finansial dalam kurun 10-15 tahun.';
  } else if (savingsRate >= 40) {
    statusColor = 'text-amber-800';
    badgeColor = 'bg-amber-100 text-amber-900 border-amber-300';
    tierTitle = 'Akselerasi Tinggi ⚡';
    tierDescription = 'Mantap! Tingkat tabungan 40-60% adalah pendorong utama kemandirian finansial lebih dini dari usia pensiun umum.';
  } else if (savingsRate >= 20) {
    statusColor = 'text-neutral-800';
    badgeColor = 'bg-stone-100 text-neutral-800 border-stone-300';
    tierTitle = 'Sehat & Ideal (Standar 50/30/20) 👍';
    tierDescription = 'Sangat baik. Memenuhi rekomendasi dasar perencana keuangan: 50% kebutuhan pokok, 30% keinginan, 20% investasi.';
  } else if (savingsRate > 0) {
    statusColor = 'text-amber-700';
    badgeColor = 'bg-amber-50 text-amber-800 border-amber-200';
    tierTitle = 'Perlu Ditingkatkan ⚠️';
    tierDescription = 'Coba cek kembali "bocor halus" seperti biaya jajan delivery ojol, langganan streaming tak terpakai, atau paylater.';
  } else {
    statusColor = 'text-red-700';
    badgeColor = 'bg-red-100 text-red-800 border-red-300';
    tierTitle = 'Defisit / Belum Ada Tabungan 🚨';
    tierDescription = 'Pengeluaran sama atau melebihi penghasilan. Prioritaskan audit pengeluaran dan lunasi utang berbunga.';
  }

  return (
    <div id="section-savings-rate" className="bg-white rounded-2xl p-5 sm:p-7 shadow-xs border border-stone-200 space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-stone-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-red-600 to-amber-500 flex items-center justify-center text-white shadow-xs">
            <PiggyBank className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-extrabold text-neutral-900 tracking-tight">
              Tingkat Tabungan Bulanan (Savings Rate)
            </h3>
            <p className="text-xs text-neutral-500">
              Kunci utama kecepatan menuju kebebasan finansial = (Tabungan ÷ Penghasilan) × 100%
            </p>
          </div>
        </div>

        <div className={`px-3 py-1 rounded-full text-xs font-bold border self-start sm:self-center ${badgeColor}`}>
          {tierTitle}
        </div>
      </div>

      {/* Inputs & Main Metric */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
        
        {/* Input Penghasilan */}
        <div className="bg-stone-50 rounded-xl p-4 border border-stone-200">
          <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1.5">
            Penghasilan Bersih Bulanan
          </label>
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-neutral-500">Rp</span>
            <input
              type="number"
              inputMode="numeric"
              id="input-monthly-income"
              value={monthlyIncome}
              onChange={(e) => {
                const val = Math.max(0, parseInt(e.target.value, 10) || 0);
                onUpdateFinancials(val, monthlySavings);
              }}
              className="w-full bg-white border border-stone-300 rounded-lg px-3 py-2 text-base font-bold text-neutral-800 focus:outline-none focus:ring-2 focus:ring-red-500"
              step="500000"
            />
          </div>
          <span className="text-[11px] text-neutral-500 mt-1 block">
            Gaji pokok, tunjangan, dan freelance (Take Home Pay)
          </span>
        </div>

        {/* Input Tabungan/Investasi */}
        <div className="bg-stone-50 rounded-xl p-4 border border-stone-200">
          <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1.5">
            Total Ditabung / Investasi Bulanan
          </label>
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-neutral-500">Rp</span>
            <input
              type="number"
              inputMode="numeric"
              id="input-monthly-savings"
              value={monthlySavings}
              onChange={(e) => {
                const val = Math.max(0, parseInt(e.target.value, 10) || 0);
                onUpdateFinancials(monthlyIncome, val);
              }}
              className="w-full bg-white border border-stone-300 rounded-lg px-3 py-2 text-base font-bold text-neutral-800 focus:outline-none focus:ring-2 focus:ring-red-500"
              step="250000"
            />
          </div>
          <span className="text-[11px] text-neutral-500 mt-1 block">
            Reksa dana, SBN, saham, tabungan emas, deposito
          </span>
        </div>

        {/* Big Savings Rate Percentage */}
        <div className="bg-gradient-to-br from-amber-50 to-red-50 rounded-xl p-4 border border-amber-200 text-center md:text-left flex flex-col justify-center">
          <span className="text-xs font-bold text-red-900 uppercase tracking-wider block">
            Savings Rate Anda
          </span>
          <div className="flex items-baseline justify-center md:justify-start gap-1.5 mt-0.5">
            <span className="text-3xl sm:text-4xl font-black text-red-700 tracking-tight">
              {savingsRate.toFixed(1)}%
            </span>
            <span className="text-xs font-bold text-amber-800">dari penghasilan</span>
          </div>
          <span className="text-xs text-neutral-600 mt-1 block">
            Tersisa {formatRupiah(Math.max(monthlyIncome - monthlySavings, 0))} untuk biaya hidup & jajan
          </span>
        </div>

      </div>

      {/* Visual Meter Bar */}
      <div className="space-y-1.5">
        <div className="flex justify-between text-xs text-neutral-500 font-medium">
          <span>0%</span>
          <span className="text-amber-700 font-semibold">20% (Minimal)</span>
          <span className="text-amber-600 font-semibold">40% (Akselerasi)</span>
          <span className="text-red-700 font-bold">60%+ (Akselerasi Penuh)</span>
          <span>100%</span>
        </div>

        <div className="h-3 w-full bg-stone-100 rounded-full overflow-hidden relative border border-stone-200">
          <div
            style={{ width: `${clampedRate}%` }}
            className={`h-full transition-all duration-500 ${
              clampedRate >= 50
                ? 'bg-gradient-to-r from-amber-500 to-red-600'
                : clampedRate >= 20
                ? 'bg-gradient-to-r from-yellow-400 to-amber-500'
                : 'bg-stone-400'
            }`}
          />
        </div>
      </div>

      {/* Advice Note */}
      <div className="p-3.5 bg-stone-50 rounded-xl border border-stone-200 flex items-start gap-2.5 text-xs text-neutral-700">
        <Info className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
        <div>
          <strong className="text-neutral-900">{tierTitle}: </strong>
          {tierDescription}
        </div>
      </div>
    </div>
  );
}
