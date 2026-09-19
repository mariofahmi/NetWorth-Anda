import { useState, useMemo } from 'react';
import { 
  Sparkles, 
  X, 
  Send, 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  TrendingUp, 
  Flame, 
  Key, 
  Bot, 
  User, 
  RefreshCw,
  HelpCircle,
  Zap,
  ArrowRight,
  Calculator
} from 'lucide-react';
import { AssetItem, LiabilityItem, FireSettings, UserProfile } from '../types';
import { formatRupiah, ASSET_CATEGORIES } from '../utils/formatters';

interface AiAdvisorModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: UserProfile;
  assets: AssetItem[];
  liabilities: LiabilityItem[];
  fireSettings: FireSettings;
  netWorth: number;
}

interface ChatMessage {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  timestamp: string;
}

const API_KEY_STORAGE_KEY = 'networth_gemini_api_key_v1';

export function AiAdvisorModal({
  isOpen,
  onClose,
  profile,
  assets,
  liabilities,
  fireSettings,
  netWorth,
}: AiAdvisorModalProps) {
  const [activeTab, setActiveTab] = useState<'audit' | 'chat'>('audit');
  const [apiKey, setApiKey] = useState<string>(() => {
    return localStorage.getItem(API_KEY_STORAGE_KEY) || (import.meta as any).env?.VITE_GEMINI_API_KEY || '';
  });
  const [showKeyInput, setShowKeyInput] = useState(false);
  const [inputQuestion, setInputQuestion] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);

  // Total Calculations
  const totalAssets = useMemo(() => assets.reduce((sum, a) => sum + (a.amount || 0), 0), [assets]);
  const totalLiabilities = useMemo(() => liabilities.reduce((sum, l) => sum + (l.balance || 0), 0), [liabilities]);
  
  const liquidAssets = useMemo(() => {
    return assets.reduce((sum, a) => {
      const meta = ASSET_CATEGORIES[a.category];
      return meta?.isLiquid ? sum + a.amount : sum;
    }, 0);
  }, [assets]);

  const debtToAssetRatio = totalAssets > 0 ? (totalLiabilities / totalAssets) * 100 : 0;
  const emergencyMonths = fireSettings.monthlyExpense > 0 ? (liquidAssets / fireSettings.monthlyExpense) : 0;
  const savingsRate = fireSettings.monthlyIncome > 0 
    ? ((fireSettings.monthlySavings / fireSettings.monthlyIncome) * 100) 
    : 0;

  const highestInterestLiability = useMemo(() => {
    if (liabilities.length === 0) return null;
    return [...liabilities].sort((a, b) => b.annualInterestRate - a.annualInterestRate)[0];
  }, [liabilities]);

  // Annual interest drain
  const annualInterestDrain = useMemo(() => {
    return liabilities.reduce((sum, l) => sum + (l.balance * (l.annualInterestRate / 100)), 0);
  }, [liabilities]);

  // FIRE calculations
  const annualExpense = fireSettings.monthlyExpense * 12;
  const fireTarget = annualExpense * fireSettings.multiplier;
  const fireProgress = fireTarget > 0 ? Math.min(100, Math.max(0, (netWorth / fireTarget) * 100)) : 0;

  // Savings Target calculations
  const currentYear = 2026;
  const yearsRemaining = Math.max(0, profile.targetYear - currentYear);
  const targetAccumulation = Math.max(0, netWorth);
  const targetPercent = profile.savingsTargetAmount > 0 
    ? Math.min(100, (targetAccumulation / profile.savingsTargetAmount) * 100)
    : 0;
  const requiredMonthlySavings = yearsRemaining > 0 
    ? Math.ceil(Math.max(0, profile.savingsTargetAmount - targetAccumulation) / (yearsRemaining * 12))
    : 0;

  // Financial Health Score (0 - 100)
  const healthScore = useMemo(() => {
    let score = 50; // base

    // 1. Debt to Asset Ratio (max 25 pts)
    if (debtToAssetRatio === 0) score += 25;
    else if (debtToAssetRatio < 15) score += 20;
    else if (debtToAssetRatio < 30) score += 10;
    else if (debtToAssetRatio > 50) score -= 20;

    // 2. Emergency Runway (max 25 pts)
    if (emergencyMonths >= 6) score += 25;
    else if (emergencyMonths >= 3) score += 15;
    else if (emergencyMonths >= 1) score += 5;
    else score -= 15;

    // 3. Savings Rate (max 25 pts)
    if (savingsRate >= 40) score += 25;
    else if (savingsRate >= 25) score += 20;
    else if (savingsRate >= 15) score += 10;
    else score -= 10;

    // 4. Toxic Debt Penalty (-15 if paylater/pinjol exists)
    const hasPaylater = liabilities.some((l) => l.category === 'paylater_pinjol' && l.balance > 0);
    if (hasPaylater) score -= 15;

    return Math.min(100, Math.max(10, score));
  }, [debtToAssetRatio, emergencyMonths, savingsRate, liabilities]);

  const handleSaveApiKey = (key: string) => {
    const trimmed = key.trim();
    setApiKey(trimmed);
    localStorage.setItem(API_KEY_STORAGE_KEY, trimmed);
    setShowKeyInput(false);
  };

  // Pre-configured questions
  const SUGGESTED_QUESTIONS = [
    'Beri diagnosis kesehatan finansial lengkap saya.',
    'Bagaimana urutan prioritas pelunasan utang terbaik untuk saya?',
    'Apakah target tabungan saya di tahun ' + profile.targetYear + ' realistis?',
    'Strategi alokasi aset SBN, Reksadana, dan Saham untuk pasar Indonesia.',
  ];

  const generateOfflineAnalysis = (userQuery: string): string => {
    const queryLower = userQuery.toLowerCase();

    if (queryLower.includes('utang') || queryLower.includes('avalanche') || queryLower.includes('paylater')) {
      if (!highestInterestLiability) {
        return `🎉 **Selamat! Anda Tidak Memiliki Utang Terdaftar.**\n\nSeluruh penghasilan bulanan Anda dapat dialokasikan langsung untuk memperbesar portofolio investasi dan tabungan. Lanjutkan kebiasaan baik ini dan hindari godaan paylater impulsif.`;
      }
      return `⚡ **Strategi Pelunasan Utang (Metode Debt Avalanche):**\n\n` +
        `1. **Fokus Nomor 1:** Lunasi segera **${highestInterestLiability.name}** (${highestInterestLiability.annualInterestRate}% p.a.) dengan sisa saldo ${formatRupiah(highestInterestLiability.balance)}.\n` +
        `2. **Kebocoran Bunga:** Saat ini, total beban bunga pinjaman Anda adalah **${formatRupiah(annualInterestDrain)}/tahun** (${formatRupiah(Math.round(annualInterestDrain / 12))}/bulan). Melunasi pinjaman berbunga tertinggi akan langsung menghentikan kebocoran ini.\n` +
        `3. **Langkah Konkret:** Pertahankan pembayaran minimum untuk kewajiban lain, dan alokasikan kelebihan uang dari tabungan bulanan (${formatRupiah(fireSettings.monthlySavings)}) untuk langsung melunasi utang nomor 1.`;
    }

    if (queryLower.includes('target') || queryLower.includes('2030') || queryLower.includes('tabungan')) {
      const statusText = fireSettings.monthlySavings >= requiredMonthlySavings
        ? `✅ **Sangat Realistis & Sesuai Jalur!** Alokasi tabungan bulanan Anda (${formatRupiah(fireSettings.monthlySavings)}) sudah melampaui kebutuhan minimal (${formatRupiah(requiredMonthlySavings)}/bulan).`
        : `⚠️ **Perlu Penyesuaian!** Kebutuhan minimal tabungan per bulan adalah ${formatRupiah(requiredMonthlySavings)}, sedangkan saat ini dialokasikan ${formatRupiah(fireSettings.monthlySavings)}/bulan. Anda bisa menutup selisih ini dengan mengurangi pengeluaran sekunder atau meningkatkan pendapatan sampingan.`;

      return `🎯 **Evaluasi Target Tabungan ${profile.name} (Target Tahun ${profile.targetYear}):**\n\n` +
        `- **Nominal Target:** ${formatRupiah(profile.savingsTargetAmount)}\n` +
        `- **Akumulasi Saat Ini:** ${formatRupiah(targetAccumulation)} (${targetPercent.toFixed(1)}% tercapai)\n` +
        `- **Sisa Waktu:** ${yearsRemaining} tahun (hingga usia ~${profile.age + yearsRemaining} tahun)\n\n` +
        `${statusText}\n\n` +
        `💡 *Tips:* Tempatkan dana target ini pada instrumen berisiko rendah hingga moderat seperti Deposito Digital (bunga 5-6%) atau SBN Ritel (ORI/Sukuk) agar tidak tergerus inflasi namun tetap aman.`;
    }

    // Default full financial diagnosis
    return `📊 **Diagnosis Keuangan Lengkap untuk ${profile.name}:**\n\n` +
      `• **Skor Kesehatan Keuangan:** **${healthScore}/100**\n` +
      `• **Kekayaan Bersih (Net Worth):** **${formatRupiah(netWorth)}** (Aset: ${formatRupiah(totalAssets)} | Utang: ${formatRupiah(totalLiabilities)})\n` +
      `• **Rasio Utang terhadap Aset:** **${debtToAssetRatio.toFixed(1)}%** (${debtToAssetRatio < 30 ? 'Sehat' : 'Perlu Diwaspadai'})\n` +
      `• **Ketahanan Dana Darurat:** **${emergencyMonths.toFixed(1)} bulan** pengeluaran (Aset likuid: ${formatRupiah(liquidAssets)})\n` +
      `• **Tingkat Tabungan (Savings Rate):** **${savingsRate.toFixed(1)}%** (${savingsRate >= 30 ? 'Sangat Baik' : 'Cukup'})\n` +
      `• **Progres Kebebasan Finansial (FIRE):** **${fireProgress.toFixed(1)}%** dari target ${formatRupiah(fireTarget)} (Pengali ${fireSettings.multiplier}x)\n\n` +
      `📌 **3 Rekomendasi Utama:**\n` +
      `1. ${highestInterestLiability ? `Prioritaskan pelunasan utang berbunga tertinggi (${highestInterestLiability.name} - ${highestInterestLiability.annualInterestRate}%) untuk menghemat biaya bunga.` : 'Pertahankan posisi bebas utang konsumtif.'}\n` +
      `2. Jaga dana darurat minimal 6 bulan pengeluaran (${formatRupiah(fireSettings.monthlyExpense * 6)}) di instrumen likuid seperti Bank Operasional dan Deposito Digital.\n` +
      `3. Konsisten menabung minimal ${formatRupiah(fireSettings.monthlySavings)}/bulan pada instrumen SBN dan Reksa Dana untuk mempercepat pencapaian target tahun ${profile.targetYear}.`;
  };

  const handleAsk = async (questionText: string) => {
    const q = questionText.trim();
    if (!q) return;

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text: q,
      timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
    };

    setChatMessages((prev) => [...prev, userMsg]);
    setInputQuestion('');
    setIsLoading(true);

    try {
      if (apiKey) {
        // Call Google Gemini API directly via REST endpoint
        const systemPrompt = `Anda adalah penasihat keuangan pribadi (Certified Financial Planner) spesialis pasar finansial Indonesia untuk pengguna bernama ${profile.name} (usia ${profile.age} tahun).
Konteks keuangan pengguna saat ini:
- Total Aset: ${formatRupiah(totalAssets)}
- Aset Likuid: ${formatRupiah(liquidAssets)}
- Total Liabilitas/Utang: ${formatRupiah(totalLiabilities)}
- Kekayaan Bersih (Net Worth): ${formatRupiah(netWorth)}
- Pendapatan Bulanan: ${formatRupiah(fireSettings.monthlyIncome)}
- Tabungan/Investasi Bulanan: ${formatRupiah(fireSettings.monthlySavings)} (Savings Rate: ${savingsRate.toFixed(1)}%)
- Pengeluaran Bulanan: ${formatRupiah(fireSettings.monthlyExpense)}
- Target FIRE: ${formatRupiah(fireTarget)} (Pengali ${fireSettings.multiplier}x)
- Target Tabungan: ${formatRupiah(profile.savingsTargetAmount)} di tahun ${profile.targetYear}
- Beban Bunga Utang Tahunan: ${formatRupiah(annualInterestDrain)}
- Utang Terbesar/Tertinggi: ${highestInterestLiability ? `${highestInterestLiability.name} (Bunga ${highestInterestLiability.annualInterestRate}%, Saldo ${formatRupiah(highestInterestLiability.balance)})` : 'Tidak ada utang'}

Berikan nasihat yang terstruktur, praktis, ramah, dan berakar pada instrumen finansial Indonesia (BCA, Deposito Digital, SBN Ritel Kemenkeu, Reksadana Bibit, Emas Antam, Saham IHSG, BPJS Ketenagakerjaan). Gunakan format Markdown yang mudah dibaca dengan poin-poin tebal.`;

        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [
                {
                  role: 'user',
                  parts: [{ text: `${systemPrompt}\n\nPertanyaan Pengguna: ${q}` }],
                },
              ],
            }),
          }
        );

        if (!response.ok) {
          throw new Error(`API Gemini mengembalikan status ${response.status}`);
        }

        const data = await response.json();
        const aiText = data.candidates?.[0]?.content?.parts?.[0]?.text;

        if (!aiText) {
          throw new Error('Format respon AI tidak terbaca');
        }

        const aiMsg: ChatMessage = {
          id: `msg-${Date.now() + 1}`,
          sender: 'ai',
          text: aiText,
          timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
        };
        setChatMessages((prev) => [...prev, aiMsg]);
      } else {
        // Smart Heuristic Engine fallback
        await new Promise((r) => setTimeout(r, 600));
        const answer = generateOfflineAnalysis(q);
        const aiMsg: ChatMessage = {
          id: `msg-${Date.now() + 1}`,
          sender: 'ai',
          text: answer,
          timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
        };
        setChatMessages((prev) => [...prev, aiMsg]);
      }
    } catch (err: any) {
      console.warn('Fallback to offline analysis engine due to:', err);
      const answer = generateOfflineAnalysis(q) + `\n\n*(Catatan: Menggunakan analisis mesin cerdas internal karena kendala koneksi API: ${err.message})*`;
      const aiMsg: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        sender: 'ai',
        text: answer,
        timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
      };
      setChatMessages((prev) => [...prev, aiMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-neutral-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-3xl shadow-2xl border border-stone-200 w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-red-600 via-amber-600 to-red-700 p-5 sm:p-6 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center shadow-inner border border-white/30">
              <Sparkles className="w-6 h-6 text-amber-200 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-extrabold tracking-tight">Konsultan Keuangan AI</h3>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-amber-400 text-neutral-950">
                  {apiKey ? 'Gemini 2.5 Active' : 'Smart Diagnostic'}
                </span>
              </div>
              <p className="text-xs text-amber-100 mt-0.5">
                Analisis portofolio, prioritas utang, dan proyeksi finansial otomatis untuk {profile.name}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-xl bg-white/10 hover:bg-white/25 flex items-center justify-center text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Top Tab Bar & API Key Pill */}
        <div className="border-b border-stone-200 bg-stone-50/80 px-5 py-3 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-1.5 p-1 bg-stone-200/70 rounded-xl">
            <button
              onClick={() => setActiveTab('audit')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'audit'
                  ? 'bg-white text-neutral-900 shadow-xs'
                  : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              Diagnosis Cerdas (Audit)
            </button>
            <button
              onClick={() => setActiveTab('chat')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'chat'
                  ? 'bg-white text-neutral-900 shadow-xs'
                  : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              Tanya Jawab Konsultan
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowKeyInput(!showKeyInput)}
              className="flex items-center gap-1.5 text-xs text-neutral-600 hover:text-red-700 bg-white border border-stone-200 hover:border-red-300 px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer"
              title="Konfigurasi API Key Gemini"
            >
              <Key className="w-3.5 h-3.5 text-amber-600" />
              <span>{apiKey ? 'API Key Terpasang' : 'Koneksikan Gemini API'}</span>
            </button>
          </div>
        </div>

        {/* Optional API Key Input Banner */}
        {showKeyInput && (
          <div className="bg-amber-50/80 border-b border-amber-200 p-4 shrink-0 text-xs text-neutral-700 space-y-2">
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="font-bold text-neutral-900">Konfigurasi Google Gemini API Key</p>
                <p className="text-neutral-600 mt-0.5">
                  Masukkan Gemini API Key gratis dari Google AI Studio untuk mengaktifkan penalaran AI generatif tanpa batas.
                </p>
              </div>
              <a
                href="https://aistudio.google.com/app/apikey"
                target="_blank"
                rel="noreferrer"
                className="text-red-700 hover:underline font-bold shrink-0 inline-flex items-center gap-1"
              >
                Dapatkan Key Gratis <ArrowRight className="w-3 h-3" />
              </a>
            </div>
            <div className="flex items-center gap-2 pt-1">
              <input
                type="password"
                placeholder="Tempel Gemini API Key (AIzaSy...)"
                defaultValue={apiKey}
                id="gemini-key-input"
                className="flex-1 px-3 py-1.5 rounded-lg border border-amber-300 bg-white text-xs focus:outline-hidden focus:ring-2 focus:ring-amber-500"
              />
              <button
                onClick={() => {
                  const el = document.getElementById('gemini-key-input') as HTMLInputElement;
                  if (el) handleSaveApiKey(el.value);
                }}
                className="px-3 py-1.5 rounded-lg bg-red-700 hover:bg-red-800 text-white font-bold text-xs transition-colors cursor-pointer"
              >
                Simpan
              </button>
              {apiKey && (
                <button
                  onClick={() => handleSaveApiKey('')}
                  className="px-2.5 py-1.5 rounded-lg bg-stone-200 hover:bg-stone-300 text-neutral-700 text-xs transition-colors cursor-pointer"
                >
                  Hapus
                </button>
              )}
            </div>
          </div>
        )}

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
          {activeTab === 'audit' ? (
            /* TAB 1: AUDIT CERDAS */
            <div className="space-y-6">
              {/* Score Header Card */}
              <div className="bg-gradient-to-br from-stone-900 via-neutral-800 to-stone-900 rounded-2xl p-5 text-white flex flex-col sm:flex-row items-center justify-between gap-5 shadow-sm">
                <div className="space-y-1 text-center sm:text-left">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400">
                    Kesehatan Finansial Keseluruhan
                  </span>
                  <h4 className="text-xl font-extrabold">
                    {healthScore >= 80 ? '🌟 Sangat Sehat & Tangguh' : healthScore >= 60 ? '👍 Sehat dengan Potensi Optimalisasi' : '⚠️ Perlu Tindakan Perbaikan Segera'}
                  </h4>
                  <p className="text-xs text-neutral-300 max-w-md">
                    Berdasarkan rasio utang {debtToAssetRatio.toFixed(1)}%, dana darurat {emergencyMonths.toFixed(1)} bulan, dan tabungan bulanan {savingsRate.toFixed(1)}%.
                  </p>
                </div>

                <div className="flex flex-col items-center justify-center w-24 h-24 rounded-2xl bg-white/10 border border-white/20 backdrop-blur-sm shrink-0">
                  <span className="text-3xl font-black text-amber-300">{healthScore}</span>
                  <span className="text-[10px] text-neutral-300 font-semibold">dari 100</span>
                </div>
              </div>

              {/* 4 Key Metric Pillar Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                
                {/* 1. Debt Health */}
                <div className="p-4 rounded-xl border border-stone-200 bg-white space-y-2 shadow-2xs">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-neutral-600 flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-emerald-600" /> Beban Utang & Solvabilitas
                    </span>
                    <span className={`text-[11px] font-extrabold px-2 py-0.5 rounded-full ${
                      debtToAssetRatio < 20 ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                    }`}>
                      {debtToAssetRatio.toFixed(1)}% Ratio
                    </span>
                  </div>
                  <p className="text-xs text-neutral-700 leading-relaxed">
                    {highestInterestLiability ? (
                      <>
                        Waspadai <strong>{highestInterestLiability.name}</strong> dengan bunga <strong>{highestInterestLiability.annualInterestRate}% p.a.</strong> Kebocoran bunga: {formatRupiah(annualInterestDrain)}/thn.
                      </>
                    ) : (
                      'Portofolio Anda 100% bebas dari beban utang berbunga tinggi.'
                    )}
                  </p>
                </div>

                {/* 2. Emergency Fund */}
                <div className="p-4 rounded-xl border border-stone-200 bg-white space-y-2 shadow-2xs">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-neutral-600 flex items-center gap-1.5">
                      <Zap className="w-4 h-4 text-amber-600" /> Ketahanan Dana Darurat
                    </span>
                    <span className={`text-[11px] font-extrabold px-2 py-0.5 rounded-full ${
                      emergencyMonths >= 6 ? 'bg-emerald-100 text-emerald-800' : emergencyMonths >= 3 ? 'bg-amber-100 text-amber-800' : 'bg-rose-100 text-rose-800'
                    }`}>
                      {emergencyMonths.toFixed(1)} Bulan
                    </span>
                  </div>
                  <p className="text-xs text-neutral-700 leading-relaxed">
                    Aset likuid Anda ({formatRupiah(liquidAssets)}) dapat menopang kebutuhan hidup selama {emergencyMonths.toFixed(1)} bulan (Target ideal Indonesia: 6-12 bulan).
                  </p>
                </div>

                {/* 3. FIRE Readiness */}
                <div className="p-4 rounded-xl border border-stone-200 bg-white space-y-2 shadow-2xs">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-neutral-600 flex items-center gap-1.5">
                      <Flame className="w-4 h-4 text-red-600" /> Target FIRE ({fireSettings.multiplier}x)
                    </span>
                    <span className="text-[11px] font-extrabold px-2 py-0.5 rounded-full bg-red-100 text-red-800">
                      {fireProgress.toFixed(1)}% Tercapai
                    </span>
                  </div>
                  <p className="text-xs text-neutral-700 leading-relaxed">
                    Target FIRE Anda adalah {formatRupiah(fireTarget)}. Kekayaan bersih saat ini telah mencapai {formatRupiah(netWorth)}.
                  </p>
                </div>

                {/* 4. Savings Target */}
                <div className="p-4 rounded-xl border border-stone-200 bg-white space-y-2 shadow-2xs">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-neutral-600 flex items-center gap-1.5">
                      <TrendingUp className="w-4 h-4 text-blue-600" /> Target {profile.targetYear}
                    </span>
                    <span className={`text-[11px] font-extrabold px-2 py-0.5 rounded-full ${
                      fireSettings.monthlySavings >= requiredMonthlySavings ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {fireSettings.monthlySavings >= requiredMonthlySavings ? 'On Track' : 'Needs Boost'}
                    </span>
                  </div>
                  <p className="text-xs text-neutral-700 leading-relaxed">
                    Target {formatRupiah(profile.savingsTargetAmount)} di {profile.targetYear}. Kebutuhan tabungan: {formatRupiah(requiredMonthlySavings)}/bln (Aktual: {formatRupiah(fireSettings.monthlySavings)}/bln).
                  </p>
                </div>

              </div>

              {/* Actionable Recommendations List */}
              <div className="bg-amber-50/60 border border-amber-200/80 rounded-2xl p-5 space-y-3">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-600" />
                  <h5 className="font-extrabold text-sm text-neutral-900">
                    3 Langkah Rekomendasi Utama untuk {profile.name}
                  </h5>
                </div>

                <div className="space-y-2 text-xs text-neutral-700">
                  <div className="flex items-start gap-2.5 bg-white p-3 rounded-xl border border-amber-200/60 shadow-2xs">
                    <span className="w-5 h-5 rounded-full bg-red-100 text-red-800 font-bold flex items-center justify-center shrink-0 text-[11px]">
                      1
                    </span>
                    <div>
                      <strong className="text-neutral-900 font-bold block">
                        {highestInterestLiability ? `Lunasi ${highestInterestLiability.name} Terlebih Dahulu` : 'Pertahankan Nol Utang Konsumtif'}
                      </strong>
                      <span className="text-neutral-600">
                        {highestInterestLiability 
                          ? `Bunga tahunan ${highestInterestLiability.annualInterestRate}% sangat menggerus kekayaan. Gunakan metode Avalanche untuk melunasi utang ini sebelum berinvestasi agresif.`
                          : 'Fokuskan seluruh surplus arus kas untuk diversifikasi instrumen yang memberikan dividen atau kupon stabil.'}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5 bg-white p-3 rounded-xl border border-amber-200/60 shadow-2xs">
                    <span className="w-5 h-5 rounded-full bg-amber-100 text-amber-800 font-bold flex items-center justify-center shrink-0 text-[11px]">
                      2
                    </span>
                    <div>
                      <strong className="text-neutral-900 font-bold block">
                        Amankan SBN Ritel & Deposito Digital untuk Dana Darurat
                      </strong>
                      <span className="text-neutral-600">
                        Pertahankan cadangan likuid minimal {formatRupiah(fireSettings.monthlyExpense * 6)} di bank operasional dan deposito berbunga ~5-6% agar siap menghadapi situasi darurat tanpa berutang.
                      </span>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5 bg-white p-3 rounded-xl border border-amber-200/60 shadow-2xs">
                    <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center shrink-0 text-[11px]">
                      3
                    </span>
                    <div>
                      <strong className="text-neutral-900 font-bold block">
                        Kawal Konsistensi Tabungan Bulanan {formatRupiah(fireSettings.monthlySavings)}
                      </strong>
                      <span className="text-neutral-600">
                        Dengan disiplin menabung {formatRupiah(fireSettings.monthlySavings)} setiap bulan, target tabungan Rp {formatRupiah(profile.savingsTargetAmount, true)} pada tahun {profile.targetYear} diproyeksikan tercapai tepat waktu.
                      </span>
                    </div>
                  </div>
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    onClick={() => {
                      setActiveTab('chat');
                      handleAsk('Beri saya panduan mendalam untuk mencapai target tabungan tahun ' + profile.targetYear);
                    }}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-red-700 hover:text-red-800 hover:underline cursor-pointer"
                  >
                    Konsultasikan lebih lanjut di tab Chat <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* TAB 2: CHAT INTERAKTIF */
            <div className="space-y-4">
              {/* Preset prompt buttons */}
              <div className="space-y-1.5">
                <span className="text-[11px] font-bold text-neutral-500 uppercase tracking-wider">
                  Pertanyaan Cepat:
                </span>
                <div className="flex flex-wrap gap-2">
                  {SUGGESTED_QUESTIONS.map((q, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleAsk(q)}
                      disabled={isLoading}
                      className="text-xs bg-stone-100 hover:bg-amber-100/70 hover:border-amber-300 text-neutral-800 px-3 py-1.5 rounded-full border border-stone-200 transition-colors cursor-pointer text-left disabled:opacity-50"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>

              {/* Chat Thread */}
              <div className="min-h-[220px] max-h-[360px] overflow-y-auto space-y-3.5 p-3 rounded-2xl bg-stone-50 border border-stone-200">
                {chatMessages.length === 0 ? (
                  <div className="h-44 flex flex-col items-center justify-center text-center p-4 text-neutral-400 space-y-2">
                    <Bot className="w-8 h-8 text-neutral-300" />
                    <p className="text-xs text-neutral-600 font-medium">
                      Pilih pertanyaan cepat di atas atau ketik pertanyaan seputar keuangan Anda di bawah.
                    </p>
                    <span className="text-[11px] text-neutral-400">
                      Konsultan AI memahami data portofolio, utang, dan target FIRE Anda saat ini secara langsung.
                    </span>
                  </div>
                ) : (
                  chatMessages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex gap-3 text-xs ${
                        msg.sender === 'user' ? 'justify-end' : 'justify-start'
                      }`}
                    >
                      {msg.sender === 'ai' && (
                        <div className="w-7 h-7 rounded-xl bg-gradient-to-tr from-red-600 to-amber-500 flex items-center justify-center text-white shrink-0 mt-1 shadow-xs">
                          <Bot className="w-4 h-4" />
                        </div>
                      )}
                      <div
                        className={`p-3.5 rounded-2xl max-w-[85%] leading-relaxed whitespace-pre-wrap ${
                          msg.sender === 'user'
                            ? 'bg-neutral-900 text-white rounded-br-xs'
                            : 'bg-white text-neutral-900 border border-stone-200 rounded-bl-xs shadow-2xs'
                        }`}
                      >
                        {msg.text}
                        <div
                          className={`text-[9px] mt-1.5 ${
                            msg.sender === 'user' ? 'text-neutral-400 text-right' : 'text-neutral-400'
                          }`}
                        >
                          {msg.timestamp}
                        </div>
                      </div>
                      {msg.sender === 'user' && (
                        <div className="w-7 h-7 rounded-xl bg-neutral-800 flex items-center justify-center text-white shrink-0 mt-1 shadow-xs">
                          <User className="w-4 h-4" />
                        </div>
                      )}
                    </div>
                  ))
                )}

                {isLoading && (
                  <div className="flex gap-3 text-xs items-center text-neutral-500 py-2">
                    <div className="w-7 h-7 rounded-xl bg-gradient-to-tr from-red-600 to-amber-500 flex items-center justify-center text-white shrink-0 shadow-xs animate-spin">
                      <RefreshCw className="w-3.5 h-3.5" />
                    </div>
                    <span>Konsultan AI sedang menganalisis data keuangan Anda...</span>
                  </div>
                )}
              </div>

              {/* Chat Input */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleAsk(inputQuestion);
                }}
                className="flex items-center gap-2 pt-1"
              >
                <input
                  type="text"
                  value={inputQuestion}
                  onChange={(e) => setInputQuestion(e.target.value)}
                  placeholder="Ketik pertanyaan untuk Konsultan AI..."
                  disabled={isLoading}
                  className="flex-1 px-4 py-2.5 rounded-xl border border-stone-300 focus:outline-hidden focus:ring-2 focus:ring-red-600 bg-white text-xs"
                />
                <button
                  type="submit"
                  disabled={isLoading || !inputQuestion.trim()}
                  className="px-4 py-2.5 rounded-xl bg-red-700 hover:bg-red-800 disabled:opacity-50 text-white font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Kirim</span>
                </button>
              </form>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="border-t border-stone-200 bg-stone-50 px-5 py-3.5 flex items-center justify-between text-xs text-neutral-500 shrink-0">
          <span className="text-[11px]">
            Privasi Terjamin • Data Anda dianalisis langsung di perangkat peramban Anda.
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white font-bold text-xs transition-colors cursor-pointer"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
}
