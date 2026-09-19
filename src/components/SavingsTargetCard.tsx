import { useMemo } from 'react';
import { 
  User, 
  Calendar, 
  Target, 
  Sparkles, 
  TrendingUp, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  Flag
} from 'lucide-react';
import { UserProfile } from '../types';
import { formatRupiah } from '../utils/formatters';

interface SavingsTargetCardProps {
  profile: UserProfile;
  netWorth: number;
  monthlySavings: number;
  onUpdateProfile: (updated: Partial<UserProfile>) => void;
}

export function SavingsTargetCard({
  profile,
  netWorth,
  monthlySavings,
  onUpdateProfile,
}: SavingsTargetCardProps) {
  const currentYear = 2026; // Current simulation year anchor
  
  // Calculate remaining years and target age
  const yearsRemaining = Math.max(0, profile.targetYear - currentYear);
  const monthsRemaining = Math.max(1, yearsRemaining * 12);
  const ageAtTarget = profile.age + yearsRemaining;

  // Calculate target progress
  const targetAmount = Math.max(1, profile.savingsTargetAmount);
  const currentAccumulation = Math.max(0, netWorth);
  const progressPercent = Math.min(100, Math.max(0, (currentAccumulation / targetAmount) * 100));
  const actualPercent = (currentAccumulation / targetAmount) * 100;
  const remainingAmount = Math.max(0, targetAmount - currentAccumulation);

  // Required monthly savings without interest
  const requiredMonthlySavings = yearsRemaining > 0 
    ? Math.ceil(remainingAmount / monthsRemaining)
    : 0;

  const isMonthlySavingsSufficient = monthlySavings >= requiredMonthlySavings && remainingAmount > 0;
  const isTargetAchieved = remainingAmount <= 0;

  // Preset Nominal Tabungan
  const NOMINAL_PRESETS = [
    { label: '100 Jt', value: 100_000_000 },
    { label: '250 Jt', value: 250_000_000 },
    { label: '500 Jt', value: 500_000_000 },
    { label: '1 Miliar', value: 1_000_000_000 },
    { label: '2 Miliar', value: 2_000_000_000 },
  ];

  // Preset Target Tahun
  const YEAR_PRESETS = [
    { label: `${currentYear + 2} (+2 thn)`, year: currentYear + 2 },
    { label: `${currentYear + 4} (+4 thn)`, year: currentYear + 4 },
    { label: `${currentYear + 9} (+9 thn)`, year: currentYear + 9 },
    { label: `${currentYear + 14} (+14 thn)`, year: currentYear + 14 },
  ];

  return (
    <div id="section-savings-target" className="bg-white rounded-2xl p-5 sm:p-7 shadow-xs border border-stone-200 space-y-6">
      
      {/* Header Menu */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-stone-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-red-600 to-amber-500 flex items-center justify-center text-white shadow-xs">
            <Target className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-extrabold text-neutral-900 tracking-tight">
                Menu Profil & Target Tabungan
              </h3>
              <span className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-red-100 text-red-800 border border-red-200">
                Tujuan Finansial
              </span>
            </div>
            <p className="text-xs text-neutral-500 mt-0.5">
              Tentukan target pencapaian tabungan berdasarkan nama, usia saat ini, nominal yang diinginkan, dan tahun target
            </p>
          </div>
        </div>

        {/* Quick summary chip */}
        <div className="flex items-center gap-2 bg-stone-50 border border-stone-200 px-3 py-1.5 rounded-xl text-xs self-start sm:self-center">
          <Flag className="w-4 h-4 text-red-600 shrink-0" />
          <span className="text-neutral-600">
            Target Tahun <strong className="text-neutral-900 font-bold">{profile.targetYear}</strong>:
          </span>
          <span className="text-red-700 font-bold">
            {formatRupiah(profile.savingsTargetAmount)}
          </span>
        </div>
      </div>

      {/* Input Grid: NAMA, USIA, TARGET TAHUN, TARGET NOMINAL */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* 1. Input NAMA */}
        <div className="bg-stone-50 rounded-xl p-4 border border-stone-200 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label htmlFor="input-profile-name" className="block text-xs font-bold text-neutral-700 uppercase tracking-wider">
                Nama Lengkap
              </label>
              <User className="w-4 h-4 text-neutral-400" />
            </div>
            <input
              type="text"
              id="input-profile-name"
              value={profile.name}
              onChange={(e) => onUpdateProfile({ name: e.target.value })}
              placeholder="Masukkan nama Anda"
              className="w-full bg-white border border-stone-300 rounded-lg px-3 py-2 text-sm font-bold text-neutral-800 focus:outline-none focus:ring-2 focus:ring-red-500 transition-all"
            />
          </div>
          <span className="text-[11px] text-neutral-500 mt-2 block">
            Nama pemilik rencana tabungan ini
          </span>
        </div>

        {/* 2. Input USIA */}
        <div className="bg-stone-50 rounded-xl p-4 border border-stone-200 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label htmlFor="input-profile-age" className="block text-xs font-bold text-neutral-700 uppercase tracking-wider">
                Usia Saat Ini
              </label>
              <Calendar className="w-4 h-4 text-neutral-400" />
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                inputMode="numeric"
                id="input-profile-age"
                min="10"
                max="100"
                value={profile.age}
                onChange={(e) => {
                  const val = Math.max(1, parseInt(e.target.value, 10) || 1);
                  onUpdateProfile({ age: val });
                }}
                className="w-full bg-white border border-stone-300 rounded-lg px-3 py-2 text-base font-bold text-neutral-800 focus:outline-none focus:ring-2 focus:ring-red-500"
              />
              <span className="text-xs font-bold text-neutral-600 shrink-0">Tahun</span>
            </div>
          </div>
          <div className="text-[11px] text-neutral-600 mt-2 flex justify-between items-center">
            <span>Usia saat target tercapai:</span>
            <strong className="text-red-700 font-bold">{ageAtTarget} tahun</strong>
          </div>
        </div>

        {/* 3. Input TARGET TAHUN TERCAPAI */}
        <div className="bg-stone-50 rounded-xl p-4 border border-stone-200 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label htmlFor="input-target-year" className="block text-xs font-bold text-neutral-700 uppercase tracking-wider">
                Target Tahun Tercapai
              </label>
              <Clock className="w-4 h-4 text-neutral-400" />
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                inputMode="numeric"
                id="input-target-year"
                min={currentYear}
                max={currentYear + 50}
                value={profile.targetYear}
                onChange={(e) => {
                  const val = Math.max(currentYear, parseInt(e.target.value, 10) || currentYear);
                  onUpdateProfile({ targetYear: val });
                }}
                className="w-full bg-white border border-stone-300 rounded-lg px-3 py-2 text-base font-bold text-neutral-800 focus:outline-none focus:ring-2 focus:ring-red-500"
              />
              <span className="text-xs font-bold text-neutral-600 shrink-0">
                {yearsRemaining > 0 ? `(${yearsRemaining} thn lagi)` : '(Tahun ini)'}
              </span>
            </div>
          </div>

          {/* Quick Year Presets */}
          <div className="grid grid-cols-2 gap-1.5 mt-2">
            {YEAR_PRESETS.map((p) => (
              <button
                key={p.year}
                type="button"
                onClick={() => onUpdateProfile({ targetYear: p.year })}
                className={`text-xs font-bold py-1.5 px-2 rounded-lg border text-center transition-all cursor-pointer min-h-[34px] flex items-center justify-center ${
                  profile.targetYear === p.year
                    ? 'bg-red-600 text-white border-red-600 shadow-2xs'
                    : 'bg-white text-neutral-700 border-stone-200 hover:bg-stone-100'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* 4. Input NOMINAL TARGET TABUNGAN */}
        <div className="bg-stone-50 rounded-xl p-4 border border-stone-200 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label htmlFor="input-target-amount" className="block text-xs font-bold text-neutral-700 uppercase tracking-wider">
                Nominal Target Tabungan
              </label>
              <TrendingUp className="w-4 h-4 text-neutral-400" />
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold text-neutral-500">Rp</span>
              <input
                type="number"
                inputMode="numeric"
                id="input-target-amount"
                step="5000000"
                min="1000000"
                value={profile.savingsTargetAmount}
                onChange={(e) => {
                  const val = Math.max(0, parseInt(e.target.value, 10) || 0);
                  onUpdateProfile({ savingsTargetAmount: val });
                }}
                className="w-full bg-white border border-stone-300 rounded-lg px-2.5 py-2 text-sm font-bold text-neutral-800 focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>
          </div>

          {/* Quick Amount Presets */}
          <div className="flex flex-wrap gap-1.5 mt-2">
            {NOMINAL_PRESETS.map((preset) => (
              <button
                key={preset.value}
                type="button"
                onClick={() => onUpdateProfile({ savingsTargetAmount: preset.value })}
                className={`text-xs font-bold py-1 px-2.5 rounded-lg border transition-all cursor-pointer min-h-[30px] flex items-center justify-center ${
                  profile.savingsTargetAmount === preset.value
                    ? 'bg-red-600 text-white border-red-600 shadow-2xs'
                    : 'bg-white text-neutral-700 border-stone-200 hover:bg-stone-100'
                }`}
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>

      </div>

      {/* Target Progress & Financial Projection Banner */}
      <div className="bg-gradient-to-br from-neutral-900 via-neutral-950 to-red-950 text-white rounded-2xl p-5 sm:p-6 border border-red-900/50 relative overflow-hidden shadow-sm">
        
        {/* Accent Glow */}
        <div className="absolute top-0 right-0 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-4">
          
          {/* Top Banner Row */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-amber-300 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                Target Tabungan: {profile.name || 'Pengguna'}
              </span>
              <div className="text-2xl sm:text-3xl font-black text-white mt-1">
                {formatRupiah(profile.savingsTargetAmount)}
              </div>
              <p className="text-xs text-stone-300 mt-1">
                Target tercapai pada tahun <strong className="text-amber-300">{profile.targetYear}</strong> (saat usia <strong className="text-amber-300">{ageAtTarget} tahun</strong>, tersisa {yearsRemaining} tahun lagi).
              </p>
            </div>

            {/* Target Percentage Box */}
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-3.5 border border-white/15 min-w-[190px] text-right">
              <span className="text-xs text-stone-300 block">Progres Tabungan</span>
              <span className="text-3xl font-black text-amber-300">
                {actualPercent.toFixed(1)}%
              </span>
              <span className="text-[11px] text-stone-300 block mt-0.5">
                {isTargetAchieved 
                  ? '🎉 Target Sudah Tercapai!' 
                  : `Kurang ${formatRupiah(remainingAmount, true)} lagi`}
              </span>
            </div>
          </div>

          {/* Visual Progress Bar */}
          <div className="space-y-1.5 pt-2">
            <div className="flex justify-between text-xs text-stone-300 font-medium">
              <span>Akumulasi Nilai Bersih Saat Ini: <strong className="text-white">{formatRupiah(currentAccumulation)}</strong></span>
              <span>Target {profile.targetYear}: <strong className="text-amber-300">{formatRupiah(profile.savingsTargetAmount)}</strong></span>
            </div>

            <div className="h-4 w-full bg-neutral-800 rounded-full overflow-hidden p-0.5 border border-white/10 relative">
              <div
                style={{ width: `${progressPercent}%` }}
                className="h-full rounded-full transition-all duration-700 bg-gradient-to-r from-red-600 via-amber-400 to-yellow-300"
              />
            </div>
          </div>

          {/* Detailed Monthly Savings Guidance */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-3 border-t border-white/10 text-xs">
            
            <div className="flex items-start gap-2.5 bg-white/5 rounded-xl p-3 border border-white/10">
              <Clock className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <div className="font-bold text-stone-200">Kebutuhan Tabungan Bulanan:</div>
                <div className="text-sm font-black text-amber-300 mt-0.5">
                  {isTargetAchieved ? (
                    <span>Rp 0 (Target Telah Terpenuhi)</span>
                  ) : (
                    <span>{formatRupiah(requiredMonthlySavings)} / bulan</span>
                  )}
                </div>
                <div className="text-[11px] text-stone-400 mt-0.5">
                  Diperlukan untuk mengumpulkan kekurangan {formatRupiah(remainingAmount)} dalam kurun waktu {yearsRemaining} tahun ({monthsRemaining} bulan).
                </div>
              </div>
            </div>

            <div className="flex items-start gap-2.5 bg-white/5 rounded-xl p-3 border border-white/10">
              {isTargetAchieved || isMonthlySavingsSufficient ? (
                <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              )}
              <div>
                <div className="font-bold text-stone-200">Status Alokasi Saat Ini:</div>
                <div className="text-xs text-stone-300 mt-0.5">
                  {isTargetAchieved ? (
                    <span className="text-amber-300 font-bold">Luar biasa! Target nominal tabungan telah tercapai. Pertahankan dan kelola aset dengan baik.</span>
                  ) : isMonthlySavingsSufficient ? (
                    <span className="text-amber-300 font-bold">
                      🚀 On Track! Alokasi tabungan Anda saat ini ({formatRupiah(monthlySavings)}/bln) sudah melebihi kebutuhan minimal ({formatRupiah(requiredMonthlySavings)}/bln).
                    </span>
                  ) : (
                    <span className="text-stone-300">
                      Tabungan bulanan saat ini <strong className="text-white">{formatRupiah(monthlySavings)}/bln</strong>. Perlu ditambah sekitar <strong className="text-red-300">{formatRupiah(Math.max(0, requiredMonthlySavings - monthlySavings))}/bln</strong> agar target tahun {profile.targetYear} tercapai tepat waktu.
                    </span>
                  )}
                </div>
              </div>
            </div>

          </div>

        </div>
      </div>

    </div>
  );
}
