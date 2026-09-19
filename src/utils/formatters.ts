import { AssetCategory, LiabilityCategory } from '../types';

export function formatRupiah(amount: number, compact: boolean = false): string {
  if (isNaN(amount)) return 'Rp 0';

  if (compact) {
    const abs = Math.abs(amount);
    const sign = amount < 0 ? '-' : '';
    if (abs >= 1_000_000_000) {
      const val = (abs / 1_000_000_000).toFixed(1).replace('.0', '');
      return `${sign}Rp ${val} Miliar`;
    }
    if (abs >= 1_000_000) {
      const val = (abs / 1_000_000).toFixed(1).replace('.0', '');
      return `${sign}Rp ${val} Juta`;
    }
    if (abs >= 1_000) {
      const val = (abs / 1_000).toFixed(0);
      return `${sign}Rp ${val} Rb`;
    }
  }

  const isNegative = amount < 0;
  const absVal = Math.round(Math.abs(amount));
  const formatted = new Intl.NumberFormat('id-ID').format(absVal);
  return `${isNegative ? '- ' : ''}Rp ${formatted}`;
}

export function parseRupiahInput(value: string): number {
  // remove anything except digits
  const cleaned = value.replace(/[^0-9]/g, '');
  if (!cleaned) return 0;
  return parseInt(cleaned, 10);
}

export interface AssetCategoryMeta {
  key: AssetCategory;
  label: string;
  description: string;
  badgeColor: string;
  isLiquid: boolean;
}

export const ASSET_CATEGORIES: Record<AssetCategory, AssetCategoryMeta> = {
  rekening_bank: {
    key: 'rekening_bank',
    label: 'Rekening Bank & Kas',
    description: 'Tabungan harian, payroll, dompet digital (Gopay/OVO/ShopeePay)',
    badgeColor: 'bg-blue-50 text-blue-700 border-blue-200',
    isLiquid: true,
  },
  deposito: {
    key: 'deposito',
    label: 'Deposito',
    description: 'Deposito bank konvensional / digital (Neobank, Seabank, Jago)',
    badgeColor: 'bg-sky-50 text-sky-700 border-sky-200',
    isLiquid: true,
  },
  reksa_dana: {
    key: 'reksa_dana',
    label: 'Reksa Dana',
    description: 'Pasar Uang, Obligasi/Pendapatan Tetap, Saham (Bibit, Bareksa)',
    badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    isLiquid: true,
  },
  sbn: {
    key: 'sbn',
    label: 'SBN (Surat Berharga Negara)',
    description: 'Obligasi Negara Ritel: ORI, Sukuk Ritel (SR), SBR, ST (Kemenkeu)',
    badgeColor: 'bg-teal-50 text-teal-700 border-teal-200',
    isLiquid: false,
  },
  emas: {
    key: 'emas',
    label: 'Emas & Logam Mulia',
    description: 'Emas fisik Antam/UBS, tabungan emas digital (Pegadaian, Treasury)',
    badgeColor: 'bg-amber-50 text-amber-700 border-amber-200',
    isLiquid: true,
  },
  saham: {
    key: 'saham',
    label: 'Saham (IHSG / IDX)',
    description: 'Portofolio saham di sekuritas (Ajaib, Stockbit, Mirae, Mandiri)',
    badgeColor: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    isLiquid: true,
  },
  bpjs_ketenagakerjaan: {
    key: 'bpjs_ketenagakerjaan',
    label: 'BPJS Ketenagakerjaan',
    description: 'Saldo Jaminan Hari Tua (JHT) & Jaminan Pensiun (JP) dari kantor',
    badgeColor: 'bg-green-50 text-green-700 border-green-200',
    isLiquid: false,
  },
  properti: {
    key: 'properti',
    label: 'Properti & Tanah',
    description: 'Rumah tinggal, apartemen, tanah kavling (aset riil)',
    badgeColor: 'bg-orange-50 text-orange-700 border-orange-200',
    isLiquid: false,
  },
  aset_lainnya: {
    key: 'aset_lainnya',
    label: 'Barang Berharga & Lainnya',
    description: 'Kendaraan bernilai, bisnis/usaha, aset kripto, koleksi',
    badgeColor: 'bg-purple-50 text-purple-700 border-purple-200',
    isLiquid: false,
  },
};

export interface LiabilityCategoryMeta {
  key: LiabilityCategory;
  label: string;
  typicalRate: string;
  badgeColor: string;
}

export const LIABILITY_CATEGORIES: Record<LiabilityCategory, LiabilityCategoryMeta> = {
  paylater_pinjol: {
    key: 'paylater_pinjol',
    label: 'Paylater & Pinjol',
    typicalRate: '24% - 48% p.a.',
    badgeColor: 'bg-rose-50 text-rose-700 border-rose-200',
  },
  kartu_kredit: {
    key: 'kartu_kredit',
    label: 'Kartu Kredit (Credit Card)',
    typicalRate: '21% - 24% p.a.',
    badgeColor: 'bg-red-50 text-red-700 border-red-200',
  },
  kta: {
    key: 'kta',
    label: 'KTA (Kredit Tanpa Agunan)',
    typicalRate: '12% - 20% p.a.',
    badgeColor: 'bg-orange-50 text-orange-700 border-orange-200',
  },
  cicilan_kendaraan: {
    key: 'cicilan_kendaraan',
    label: 'KKB / Cicilan Kendaraan',
    typicalRate: '6% - 10% p.a.',
    badgeColor: 'bg-amber-50 text-amber-700 border-amber-200',
  },
  kpr: {
    key: 'kpr',
    label: 'KPR (Kredit Pemilikan Rumah)',
    typicalRate: '4.5% - 9.5% p.a.',
    badgeColor: 'bg-blue-50 text-blue-700 border-blue-200',
  },
  pinjaman_pribadi: {
    key: 'pinjaman_pribadi',
    label: 'Pinjaman Pribadi / Teman / Keluarga',
    typicalRate: '0% - 5% p.a.',
    badgeColor: 'bg-slate-50 text-slate-700 border-slate-200',
  },
  lainnya: {
    key: 'lainnya',
    label: 'Utang / Liabilitas Lainnya',
    typicalRate: 'Bervariasi',
    badgeColor: 'bg-zinc-50 text-zinc-700 border-zinc-200',
  },
};
