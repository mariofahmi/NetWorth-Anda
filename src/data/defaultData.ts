import { AssetItem, LiabilityItem, MonthlyHistoryPoint, HabitItem, FireSettings, UserProfile } from '../types';

export const DEFAULT_USER_PROFILE: UserProfile = {
  name: 'Mario Fahmi Syahrial',
  age: 28,
  savingsTargetAmount: 0,           // Rp 0 (Mulai dari nol)
  targetYear: 2030,                 // Target tahun 2030
  targetTitle: 'Target Kemandirian Finansial',
  notes: 'Mulai catat aset dan rencana tabungan untuk masa depan finansial Anda.',
};

export const DEFAULT_FIRE_SETTINGS: FireSettings = {
  monthlyExpense: 0,        // Rp 0 per bulan
  multiplier: 25,           // Standar 25x
  expectedReturnRate: 8,    // 8% per tahun rata-rata di Indonesia
  monthlyIncome: 0,         // Rp 0 per bulan
  monthlySavings: 0,        // Rp 0 ditabung per bulan
};

// Default Aset Kosong (Rp 0)
export const DEFAULT_ASSETS: AssetItem[] = [];

// Default Utang Kosong (Rp 0)
export const DEFAULT_LIABILITIES: LiabilityItem[] = [];

// Default Riwayat Bulanan Kosong
export const DEFAULT_MONTHLY_HISTORY: MonthlyHistoryPoint[] = [];

// =========================================================================
// DATA SIMULASI / CONTOH (DEMO)
// =========================================================================
export const DEMO_USER_PROFILE: UserProfile = {
  name: 'Mario Fahmi Syahrial',
  age: 28,
  savingsTargetAmount: 500_000_000,
  targetYear: 2030,
  targetTitle: 'Target Tabungan & Kemandirian Finansial',
  notes: 'Akumulasi dari tabungan bulanan, instrumen deposito, SBN, dan reksa dana',
};

export const DEMO_FIRE_SETTINGS: FireSettings = {
  monthlyExpense: 7_500_000,
  multiplier: 25,
  expectedReturnRate: 8,
  monthlyIncome: 12_000_000,
  monthlySavings: 4_500_000,
};

export const DEMO_ASSETS: AssetItem[] = [
  {
    id: 'asset-1',
    name: 'Tabungan Utama & Operasional',
    category: 'rekening_bank',
    amount: 18_500_000,
    institution: 'Bank BCA & Bank Jago',
    notes: 'Untuk operasional bulanan dan dana darurat cair 2-3 bulan',
    updatedAt: '2026-04-15',
  },
  {
    id: 'asset-2',
    name: 'Deposito Digital (Bunga 6%)',
    category: 'deposito',
    amount: 25_000_000,
    institution: 'Seabank / Neobank',
    notes: 'Dana darurat cadangan jangka 3-6 bulan',
    updatedAt: '2026-04-10',
  },
  {
    id: 'asset-3',
    name: 'Portofolio Reksadana Obligasi & Pasar Uang',
    category: 'reksa_dana',
    amount: 42_000_000,
    institution: 'Bibit (Sucorinvest & Danamas)',
    notes: 'Imbal hasil stabil ~6.5% - 7.5% per tahun',
    updatedAt: '2026-04-18',
  },
  {
    id: 'asset-4',
    name: 'Surat Berharga Negara (ORI025 & Sukuk)',
    category: 'sbn',
    amount: 20_000_000,
    institution: 'Kemenkeu RI (via Mitra Distribusi)',
    notes: 'Kupon 6.25% fixed rate dijamin undang-undang',
    updatedAt: '2026-03-20',
  },
  {
    id: 'asset-5',
    name: 'Logam Mulia Emas Antam (25 Gram)',
    category: 'emas',
    amount: 32_500_000,
    institution: 'Brankas / Pegadaian',
    notes: 'Pelindung nilai jangka panjang terhadap inflasi rupiah',
    updatedAt: '2026-04-01',
  },
  {
    id: 'asset-6',
    name: 'Saham Blue Chip IHSG',
    category: 'saham',
    amount: 35_000_000,
    institution: 'Stockbit / Sekuritas',
    notes: 'BBCA, BBRI, ASII untuk pertumbuhan modal dan dividen',
    updatedAt: '2026-04-19',
  },
  {
    id: 'asset-7',
    name: 'Saldo JHT BPJS Ketenagakerjaan',
    category: 'bpjs_ketenagakerjaan',
    amount: 24_500_000,
    institution: 'BPJS Ketenagakerjaan (JMO App)',
    notes: 'Iuran wajib perusahaan 5.7% per bulan + hasil pengembangan',
    updatedAt: '2026-04-05',
  },
  {
    id: 'asset-8',
    name: 'Sepeda Motor Harian',
    category: 'aset_lainnya',
    amount: 18_000_000,
    institution: 'Honda Vario 160',
    notes: 'Taksiran harga pasar kendaraan pribadi saat ini',
    updatedAt: '2026-01-15',
  },
];

export const DEMO_LIABILITIES: LiabilityItem[] = [
  {
    id: 'liab-1',
    name: 'ShopeePayLater / Gopay Later',
    category: 'paylater_pinjol',
    balance: 1_800_000,
    annualInterestRate: 35.4, // Bunga sangat tinggi (~2.95% per bulan = 35.4% per tahun)
    monthlyPayment: 600_000,
    notes: 'Cicilan 3 bulan beli gadget. Wajib dilunasi secepatnya!',
    updatedAt: '2026-04-12',
  },
  {
    id: 'liab-2',
    name: 'Tagihan Kartu Kredit (CC BCA)',
    category: 'kartu_kredit',
    balance: 4_200_000,
    annualInterestRate: 21.0, // Standar BI kartu kredit 1.75% / bulan = 21% / tahun
    monthlyPayment: 1_000_000,
    notes: 'Belanja keperluan rumah dan tiket travel tempo lalu',
    updatedAt: '2026-04-14',
  },
  {
    id: 'liab-3',
    name: 'Sisa Cicilan Leasing Motor',
    category: 'cicilan_kendaraan',
    balance: 8_500_000,
    annualInterestRate: 9.2, // Bunga leasing kendaraan
    monthlyPayment: 980_000,
    notes: 'Tersisa 9 bulan lagi sampai BPKB diserahkan',
    updatedAt: '2026-04-01',
  },
];

export const DEMO_MONTHLY_HISTORY: MonthlyHistoryPoint[] = [
  {
    id: 'hist-1',
    monthLabel: 'Nov 2025',
    yearMonth: '2025-11',
    totalAssets: 172_000_000,
    totalLiabilities: 21_000_000,
    netWorth: 151_000_000,
    monthlyIncome: 11_500_000,
    monthlySavings: 3_800_000,
    savingsRate: 33.0,
  },
  {
    id: 'hist-2',
    monthLabel: 'Des 2025',
    yearMonth: '2025-12',
    totalAssets: 184_500_000,
    totalLiabilities: 19_500_000,
    netWorth: 165_000_000,
    monthlyIncome: 14_000_000, // Ada bonus akhir tahun
    monthlySavings: 6_000_000,
    savingsRate: 42.8,
  },
  {
    id: 'hist-3',
    monthLabel: 'Jan 2026',
    yearMonth: '2026-01',
    totalAssets: 192_000_000,
    totalLiabilities: 18_000_000,
    netWorth: 174_000_000,
    monthlyIncome: 12_000_000,
    monthlySavings: 4_200_000,
    savingsRate: 35.0,
  },
  {
    id: 'hist-4',
    monthLabel: 'Feb 2026',
    yearMonth: '2026-02',
    totalAssets: 201_500_000,
    totalLiabilities: 16_800_000,
    netWorth: 184_700_000,
    monthlyIncome: 12_000_000,
    monthlySavings: 4_500_000,
    savingsRate: 37.5,
  },
  {
    id: 'hist-5',
    monthLabel: 'Mar 2026',
    yearMonth: '2026-03',
    totalAssets: 209_000_000,
    totalLiabilities: 15_600_000,
    netWorth: 193_400_000,
    monthlyIncome: 12_000_000,
    monthlySavings: 4_500_000,
    savingsRate: 37.5,
  },
  {
    id: 'hist-6',
    monthLabel: 'Apr 2026',
    yearMonth: '2026-04',
    totalAssets: 215_500_000,
    totalLiabilities: 14_500_000,
    netWorth: 201_000_000,
    monthlyIncome: 12_000_000,
    monthlySavings: 4_500_000,
    savingsRate: 37.5,
  },
];

export const DEFAULT_HABITS: HabitItem[] = [
  // Harian
  {
    id: 'h-1',
    period: 'harian',
    title: 'Catat Pengeluaran Hari Ini',
    subtitle: 'Semua jajan, transport ojol, dan makan siang jangan sampai ada bocor halus',
    completed: false,
    tag: 'Disiplin',
  },
  {
    id: 'h-2',
    period: 'harian',
    title: 'Tahan Impulsif Belanja Promo',
    subtitle: 'Terapkan aturan 48 jam: jika mau beli barang non-pokok, tunda 2 hari dulu',
    completed: false,
    tag: 'Mindful',
  },
  {
    id: 'h-3',
    period: 'harian',
    title: 'Batasi Jajan Kopi / Boba Kekinian',
    subtitle: 'Maksimal 1 gelas per hari atau seduh sendiri di kos / kantor',
    completed: false,
    tag: 'Hemat',
  },

  // Mingguan
  {
    id: 'w-1',
    period: 'mingguan',
    title: 'Evaluasi Anggaran Mingguan',
    subtitle: 'Cek sisa saldo di rekening operasional dan dompet digital (Gopay/ShopeePay)',
    completed: false,
    tag: 'Review',
  },
  {
    id: 'w-2',
    period: 'mingguan',
    title: 'Meal-Prep / Masak Sendiri',
    subtitle: 'Bawa bekal makan siang minimal 2-3 hari untuk memangkas budget delivery',
    completed: false,
    tag: 'Lifestyle',
  },
  {
    id: 'w-3',
    period: 'mingguan',
    title: 'Cek Promo Tanpa Terjebak Belanja',
    subtitle: 'Hapus notifikasi e-commerce yang memicu FOMO barang tidak penting',
    completed: false,
    tag: 'Fokus',
  },

  // Bulanan
  {
    id: 'm-1',
    period: 'bulanan',
    title: 'Pay Yourself First (Langsung Investasi Pas Gajian)',
    subtitle: 'Sisihkan minimal 20-30% begitu gaji masuk sebelum mulai belanja apa pun',
    completed: false,
    tag: 'Wajib',
  },
  {
    id: 'm-2',
    period: 'bulanan',
    title: 'Prioritaskan Lunasi Utang Bunga Tertinggi',
    subtitle: 'Lunasi Paylater / Kartu Kredit secara penuh (full payment) sebelum bunga menumpuk',
    completed: false,
    tag: 'Prioritas',
  },
  {
    id: 'm-3',
    period: 'bulanan',
    title: 'Cek Saldo BPJS Ketenagakerjaan (JHT & JP)',
    subtitle: 'Buka aplikasi JMO untuk verifikasi iuran kantor sudah disetorkan dengan benar',
    completed: false,
    tag: 'Aset',
  },
  {
    id: 'm-4',
    period: 'bulanan',
    title: 'Rekap Nilai Bersih (Simpan Snapshot Bulanan)',
    subtitle: 'Catat pertumbuhan aset dan penurunan liabilitas di aplikasi ini',
    completed: false,
    tag: 'Tracking',
  },

  // Tahunan
  {
    id: 'y-1',
    period: 'tahunan',
    title: 'Lapor SPT Tahunan Pajak Penghasilan (PPh 21)',
    subtitle: 'Laporkan bukti potong 1721-A1 sebelum tanggal 31 Maret via DJP Online',
    completed: false,
    tag: 'Pajak',
  },
  {
    id: 'y-2',
    period: 'tahunan',
    title: 'Rebalancing Portofolio Investasi',
    subtitle: 'Sesuaikan porsi Saham, SBN, Reksa Dana, dan Emas sesuai profil risiko terkini',
    completed: false,
    tag: 'Investasi',
  },
  {
    id: 'y-3',
    period: 'tahunan',
    title: 'Evaluasi Polis Asuransi Kesehatan & Jiwa',
    subtitle: 'Pastikan BPJS Kesehatan aktif dan plafon asuransi rawat inap masih memadai',
    completed: false,
    tag: 'Proteksi',
  },
  {
    id: 'y-4',
    period: 'tahunan',
    title: 'Review Target Bebas Finansial & Inflasi',
    subtitle: 'Hitung ulang pengeluaran riil tahunan dan sesuaikan pengali target jika perlu',
    completed: false,
    tag: 'Target',
  },
];
