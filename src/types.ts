export type AssetCategory =
  | 'rekening_bank'
  | 'deposito'
  | 'reksa_dana'
  | 'sbn'
  | 'emas'
  | 'saham'
  | 'bpjs_ketenagakerjaan'
  | 'properti'
  | 'aset_lainnya';

export interface AssetItem {
  id: string;
  name: string;
  category: AssetCategory;
  amount: number;
  institution?: string;
  notes?: string;
  updatedAt: string;
}

export type LiabilityCategory =
  | 'paylater_pinjol'
  | 'kartu_kredit'
  | 'kta'
  | 'cicilan_kendaraan'
  | 'kpr'
  | 'pinjaman_pribadi'
  | 'lainnya';

export interface LiabilityItem {
  id: string;
  name: string;
  category: LiabilityCategory;
  balance: number;
  annualInterestRate: number; // in % per year
  monthlyPayment?: number;
  notes?: string;
  updatedAt: string;
}

export interface MonthlyHistoryPoint {
  id: string;
  monthLabel: string; // e.g. "Apr 2026"
  yearMonth: string;  // e.g. "2026-04"
  totalAssets: number;
  totalLiabilities: number;
  netWorth: number;
  monthlyIncome: number;
  monthlySavings: number;
  savingsRate: number;
}

export type HabitPeriod = 'harian' | 'mingguan' | 'bulanan' | 'tahunan';

export interface HabitItem {
  id: string;
  period: HabitPeriod;
  title: string;
  subtitle?: string;
  completed: boolean;
  tag?: string;
}

export interface FireSettings {
  monthlyExpense: number;
  multiplier: number; // e.g. 20, 25, 30, 33
  expectedReturnRate: number; // e.g. 8% per year
  monthlyIncome: number;
  monthlySavings: number;
}

export interface UserProfile {
  name: string;
  age: number;
  savingsTargetAmount: number; // nominal target tabungan dalam Rupiah
  targetYear: number;          // target tahun tercapai (misal 2030)
  targetTitle?: string;
  notes?: string;
}
