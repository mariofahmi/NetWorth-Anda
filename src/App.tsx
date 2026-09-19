import { useState, useEffect, useMemo, useRef } from 'react';
import { Header } from './components/Header';
import { NetWorthSummary } from './components/NetWorthSummary';
import { FireCalculator } from './components/FireCalculator';
import { SavingsRateCard } from './components/SavingsRateCard';
import { AssetManager } from './components/AssetManager';
import { LiabilityManager } from './components/LiabilityManager';
import { NetWorthTrendChart } from './components/NetWorthTrendChart';
import { HabitsChecklist } from './components/HabitsChecklist';
import { IndonesianContextModal } from './components/IndonesianContextModal';
import { ExportImportModal } from './components/ExportImportModal';
import { SavingsTargetCard } from './components/SavingsTargetCard';
import { PrintableReport } from './components/PrintableReport';
import { DisclaimerModal } from './components/DisclaimerModal';
import { 
  AssetItem, 
  LiabilityItem, 
  MonthlyHistoryPoint, 
  HabitItem, 
  HabitPeriod, 
  FireSettings,
  UserProfile 
} from './types';
import { 
  DEFAULT_ASSETS, 
  DEFAULT_LIABILITIES, 
  DEFAULT_MONTHLY_HISTORY, 
  DEFAULT_HABITS, 
  DEFAULT_FIRE_SETTINGS,
  DEFAULT_USER_PROFILE,
  DEMO_ASSETS,
  DEMO_LIABILITIES,
  DEMO_MONTHLY_HISTORY,
  DEMO_FIRE_SETTINGS,
  DEMO_USER_PROFILE
} from './data/defaultData';
import { formatRupiah } from './utils/formatters';

const STORAGE_KEY = 'networth_anda_financial_v3_clean';

function getInitialData<T>(suffix: string, fallback: T): T {
  try {
    const saved = localStorage.getItem(`${STORAGE_KEY}_${suffix}`);
    return saved ? JSON.parse(saved) : fallback;
  } catch {
    return fallback;
  }
}

export default function App() {
  // --- Persistent States ---
  const [userProfile, setUserProfile] = useState<UserProfile>(() => getInitialData('user_profile', DEFAULT_USER_PROFILE));
  const [assets, setAssets] = useState<AssetItem[]>(() => getInitialData('assets', DEFAULT_ASSETS));
  const [liabilities, setLiabilities] = useState<LiabilityItem[]>(() => getInitialData('liabilities', DEFAULT_LIABILITIES));
  const [history, setHistory] = useState<MonthlyHistoryPoint[]>(() => getInitialData('history', DEFAULT_MONTHLY_HISTORY));
  const [habits, setHabits] = useState<HabitItem[]>(() => getInitialData('habits', DEFAULT_HABITS));
  const [fireSettings, setFireSettings] = useState<FireSettings>(() => getInitialData('fire_settings', DEFAULT_FIRE_SETTINGS));

  // --- Modal States ---
  // Disclaimer gatekeeper ALWAYS shows at startup before entering the application
  const [hasAcceptedDisclaimer, setHasAcceptedDisclaimer] = useState<boolean>(false);
  const [isReviewDisclaimerOpen, setIsReviewDisclaimerOpen] = useState(false);
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);
  const [isPrintableReportOpen, setIsPrintableReportOpen] = useState(false);
  const [exportImportModal, setExportImportModal] = useState<{
    isOpen: boolean;
    mode: 'export' | 'import';
  }>({
    isOpen: false,
    mode: 'export',
  });

  // Section Refs for smooth jumping
  const savingsTargetSectionRef = useRef<HTMLDivElement>(null);
  const assetsSectionRef = useRef<HTMLDivElement>(null);
  const liabilitiesSectionRef = useRef<HTMLDivElement>(null);
  const fireSectionRef = useRef<HTMLDivElement>(null);
  const trendSectionRef = useRef<HTMLDivElement>(null);
  const habitsSectionRef = useRef<HTMLDivElement>(null);

  // --- Auto-Save to LocalStorage ---
  useEffect(() => {
    try {
      localStorage.setItem(`${STORAGE_KEY}_user_profile`, JSON.stringify(userProfile));
    } catch (e) {
      console.error('Failed to save user profile:', e);
    }
  }, [userProfile]);

  useEffect(() => {
    try {
      localStorage.setItem(`${STORAGE_KEY}_assets`, JSON.stringify(assets));
    } catch (e) {
      console.error('Failed to save assets:', e);
    }
  }, [assets]);

  useEffect(() => {
    try {
      localStorage.setItem(`${STORAGE_KEY}_liabilities`, JSON.stringify(liabilities));
    } catch (e) {
      console.error('Failed to save liabilities:', e);
    }
  }, [liabilities]);

  useEffect(() => {
    try {
      localStorage.setItem(`${STORAGE_KEY}_history`, JSON.stringify(history));
    } catch (e) {
      console.error('Failed to save history:', e);
    }
  }, [history]);

  useEffect(() => {
    try {
      localStorage.setItem(`${STORAGE_KEY}_habits`, JSON.stringify(habits));
    } catch (e) {
      console.error('Failed to save habits:', e);
    }
  }, [habits]);

  useEffect(() => {
    try {
      localStorage.setItem(`${STORAGE_KEY}_fire_settings`, JSON.stringify(fireSettings));
    } catch (e) {
      console.error('Failed to save fire settings:', e);
    }
  }, [fireSettings]);

  // --- Derived Calculations ---
  const totalAssets = useMemo(
    () => assets.reduce((sum, item) => sum + (item.amount || 0), 0),
    [assets]
  );

  const totalLiabilities = useMemo(
    () => liabilities.reduce((sum, item) => sum + (item.balance || 0), 0),
    [liabilities]
  );

  const netWorth = totalAssets - totalLiabilities;

  // --- Handlers: Assets ---
  const handleAddAsset = (newAsset: Omit<AssetItem, 'id' | 'updatedAt'>) => {
    const item: AssetItem = {
      ...newAsset,
      id: `asset-${Date.now()}`,
      updatedAt: new Date().toISOString().split('T')[0],
    };
    setAssets((prev) => [item, ...prev]);
  };

  const handleUpdateAsset = (id: string, updated: Partial<AssetItem>) => {
    setAssets((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updated } : item))
    );
  };

  const handleDeleteAsset = (id: string) => {
    setAssets((prev) => prev.filter((item) => item.id !== id));
  };

  // --- Handlers: Liabilities ---
  const handleAddLiability = (newLiability: Omit<LiabilityItem, 'id' | 'updatedAt'>) => {
    const item: LiabilityItem = {
      ...newLiability,
      id: `liab-${Date.now()}`,
      updatedAt: new Date().toISOString().split('T')[0],
    };
    setLiabilities((prev) => [...prev, item]);
  };

  const handleUpdateLiability = (id: string, updated: Partial<LiabilityItem>) => {
    setLiabilities((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updated } : item))
    );
  };

  const handleDeleteLiability = (id: string) => {
    setLiabilities((prev) => prev.filter((item) => item.id !== id));
  };

  const handlePayoffLiability = (id: string) => {
    setLiabilities((prev) => prev.filter((item) => item.id !== id));
  };

  // --- Handlers: FIRE Settings & Savings ---
  const handleUpdateFireSettings = (newSettings: Partial<FireSettings>) => {
    setFireSettings((prev) => ({ ...prev, ...newSettings }));
  };

  const handleUpdateFinancials = (income: number, savings: number) => {
    setFireSettings((prev) => ({
      ...prev,
      monthlyIncome: income,
      monthlySavings: savings,
    }));
  };

  // --- Handlers: Snapshot History ---
  const handleSaveCurrentSnapshot = () => {
    const now = new Date();
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
    const monthLabel = `${months[now.getMonth()]} ${now.getFullYear()}`;
    const yearMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    const savingsRate = fireSettings.monthlyIncome > 0 
      ? Number(((fireSettings.monthlySavings / fireSettings.monthlyIncome) * 100).toFixed(1))
      : 0;

    const newPoint: MonthlyHistoryPoint = {
      id: `hist-${Date.now()}`,
      monthLabel,
      yearMonth,
      totalAssets,
      totalLiabilities,
      netWorth,
      monthlyIncome: fireSettings.monthlyIncome,
      monthlySavings: fireSettings.monthlySavings,
      savingsRate,
    };

    setHistory((prev) => {
      // If a point with the same yearMonth exists, update it, otherwise append
      const existingIdx = prev.findIndex((p) => p.yearMonth === yearMonth);
      if (existingIdx >= 0) {
        const copy = [...prev];
        copy[existingIdx] = { ...newPoint, id: copy[existingIdx].id };
        return copy;
      }
      return [...prev, newPoint];
    });
  };

  const handleDeleteSnapshot = (id: string) => {
    setHistory((prev) => prev.filter((item) => item.id !== id));
  };

  // --- Handlers: Habits ---
  const handleToggleHabit = (id: string) => {
    setHabits((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, completed: !item.completed } : item
      )
    );
  };

  const handleAddHabit = (newHabit: Omit<HabitItem, 'id'>) => {
    const item: HabitItem = {
      ...newHabit,
      id: `habit-${Date.now()}`,
    };
    setHabits((prev) => [item, ...prev]);
  };

  const handleDeleteHabit = (id: string) => {
    setHabits((prev) => prev.filter((item) => item.id !== id));
  };

  const handleUpdateProfile = (updated: Partial<UserProfile>) => {
    setUserProfile((prev) => ({ ...prev, ...updated }));
  };

  const handleResetPeriodHabits = (period: HabitPeriod) => {
    setHabits((prev) =>
      prev.map((item) =>
        item.period === period ? { ...item, completed: false } : item
      )
    );
  };

  // --- Handlers: Data Backup & Reset ---
  const handleResetToZero = () => {
    if (window.confirm('Kosongkan semua angka ke Rp 0? Seluruh aset, utang, dan target akan dimulai dari awal.')) {
      setUserProfile(DEFAULT_USER_PROFILE);
      setAssets([]);
      setLiabilities([]);
      setHistory([]);
      setHabits(DEFAULT_HABITS);
      setFireSettings(DEFAULT_FIRE_SETTINGS);
      localStorage.removeItem(`${STORAGE_KEY}_user_profile`);
      localStorage.removeItem(`${STORAGE_KEY}_assets`);
      localStorage.removeItem(`${STORAGE_KEY}_liabilities`);
      localStorage.removeItem(`${STORAGE_KEY}_history`);
      localStorage.removeItem(`${STORAGE_KEY}_habits`);
      localStorage.removeItem(`${STORAGE_KEY}_fire_settings`);
    }
  };

  const handleLoadDemoData = () => {
    if (window.confirm('Muat data simulasi / contoh keuangan? Data saat ini akan digantikan dengan contoh portofolio lengkap.')) {
      setUserProfile(DEMO_USER_PROFILE);
      setAssets(DEMO_ASSETS);
      setLiabilities(DEMO_LIABILITIES);
      setHistory(DEMO_MONTHLY_HISTORY);
      setFireSettings(DEMO_FIRE_SETTINGS);
    }
  };

  const fullBackupData = useMemo(() => {
    return JSON.stringify(
      {
        version: 1,
        exportedAt: new Date().toISOString(),
        userProfile,
        assets,
        liabilities,
        history,
        habits,
        fireSettings,
      },
      null,
      2
    );
  }, [userProfile, assets, liabilities, history, habits, fireSettings]);

  const handleImportConfirm = (importedJson: string): boolean => {
    try {
      const parsed = JSON.parse(importedJson);
      if (parsed.userProfile && typeof parsed.userProfile === 'object') {
        setUserProfile(parsed.userProfile);
      }
      if (Array.isArray(parsed.assets)) setAssets(parsed.assets);
      if (Array.isArray(parsed.liabilities)) setLiabilities(parsed.liabilities);
      if (Array.isArray(parsed.history)) setHistory(parsed.history);
      if (Array.isArray(parsed.habits)) setHabits(parsed.habits);
      if (parsed.fireSettings && typeof parsed.fireSettings === 'object') {
        setFireSettings(parsed.fireSettings);
      }
      return true;
    } catch (e) {
      console.error('Import failed:', e);
      return false;
    }
  };

  // Enforce reading & accepting disclaimer BEFORE entering the application
  if (!hasAcceptedDisclaimer) {
    return (
      <DisclaimerModal
        isOpen={true}
        isGatekeeper={true}
        onClose={() => {}}
        onAccept={() => {
          try {
            localStorage.removeItem('networth_disclaimer_gate_v2');
            localStorage.removeItem('networth_disclaimer_gate');
          } catch {}
          setHasAcceptedDisclaimer(true);
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-stone-50 text-neutral-900 flex flex-col font-sans">
      
      {/* Top Header */}
      <Header
        netWorth={netWorth}
        profile={userProfile}
        onResetToZero={handleResetToZero}
        onLoadDemoData={handleLoadDemoData}
        onExportData={() => setExportImportModal({ isOpen: true, mode: 'export' })}
        onImportData={() => setExportImportModal({ isOpen: true, mode: 'import' })}
        onOpenInfoModal={() => setIsInfoModalOpen(true)}
        onScrollToSavingsTarget={() => savingsTargetSectionRef.current?.scrollIntoView({ behavior: 'smooth' })}
        onOpenPrintableReport={() => setIsPrintableReportOpen(true)}
      />

      {/* Main Single-View Application Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-7">
        
        {/* 1. Net Worth Hero Summary & Asset Composition Bar */}
        <NetWorthSummary
          assets={assets}
          liabilities={liabilities}
          onScrollToAssets={() => assetsSectionRef.current?.scrollIntoView({ behavior: 'smooth' })}
          onScrollToLiabilities={() => liabilitiesSectionRef.current?.scrollIntoView({ behavior: 'smooth' })}
        />

        {/* 2. Menu Profil & Target Tabungan (NAMA, USIA, TARGET TABUNGAN: Tahun & Nominal) */}
        <div ref={savingsTargetSectionRef}>
          <SavingsTargetCard
            profile={userProfile}
            netWorth={netWorth}
            monthlySavings={fireSettings.monthlySavings}
            onUpdateProfile={handleUpdateProfile}
          />
        </div>

        {/* 3. FIRE Target Calculator (Flexible Multiplier: 20x, 25x, 30x, 33x, Custom) */}
        <div ref={fireSectionRef}>
          <FireCalculator
            netWorth={netWorth}
            settings={fireSettings}
            onUpdateSettings={handleUpdateFireSettings}
            onOpenInfoModal={() => setIsInfoModalOpen(true)}
          />
        </div>

        {/* 4. Monthly Savings Rate (Total Tabungan / Penghasilan) */}
        <SavingsRateCard
          monthlyIncome={fireSettings.monthlyIncome}
          monthlySavings={fireSettings.monthlySavings}
          onUpdateFinancials={handleUpdateFinancials}
        />

        {/* 4. Liabilities with Automatic Highest Interest Rate Priority (Metode Avalanche) */}
        <div ref={liabilitiesSectionRef}>
          <LiabilityManager
            liabilities={liabilities}
            onAddLiability={handleAddLiability}
            onUpdateLiability={handleUpdateLiability}
            onDeleteLiability={handleDeleteLiability}
            onPayoffLiability={handlePayoffLiability}
          />
        </div>

        {/* 5. Indonesian Assets Management (Deposito, Reksa Dana, SBN, Emas, Saham, BPJS TK, Properti) */}
        <div ref={assetsSectionRef}>
          <AssetManager
            assets={assets}
            onAddAsset={handleAddAsset}
            onUpdateAsset={handleUpdateAsset}
            onDeleteAsset={handleDeleteAsset}
          />
        </div>

        {/* 6. Month-over-Month Net Worth & Savings Trend Chart */}
        <div ref={trendSectionRef}>
          <NetWorthTrendChart
            history={history}
            currentAssets={totalAssets}
            currentLiabilities={totalLiabilities}
            currentNetWorth={netWorth}
            currentIncome={fireSettings.monthlyIncome}
            currentSavings={fireSettings.monthlySavings}
            onSaveCurrentSnapshot={handleSaveCurrentSnapshot}
            onDeleteSnapshot={handleDeleteSnapshot}
          />
        </div>

        {/* 7. Habits Checklist (Harian, Mingguan, Bulanan, Tahunan) */}
        <div ref={habitsSectionRef}>
          <HabitsChecklist
            habits={habits}
            onToggleHabit={handleToggleHabit}
            onAddHabit={handleAddHabit}
            onDeleteHabit={handleDeleteHabit}
            onResetPeriodHabits={handleResetPeriodHabits}
          />
        </div>

      </main>

      {/* Footer */}
      <footer className="border-t border-stone-200 bg-white py-6 mt-12 text-center text-xs text-neutral-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>
            <strong className="text-neutral-900 font-bold">NetWorth Anda</strong> • Perancang: <span className="text-neutral-900 font-bold">Mario Fahmi Syahrial</span>
          </p>
          <div className="flex items-center gap-3 text-neutral-600 flex-wrap justify-center">
            <span>Data Tersimpan Offline di Perangkat Anda</span>
            <span>•</span>
            <button
              onClick={() => setIsInfoModalOpen(true)}
              className="text-red-700 hover:text-red-800 hover:underline font-semibold cursor-pointer"
            >
              Panduan Bebas Finansial
            </button>
            <span>•</span>
            <button
              id="btn-open-disclaimer"
              onClick={() => setIsReviewDisclaimerOpen(true)}
              className="text-amber-800 hover:text-red-800 hover:underline font-semibold cursor-pointer"
            >
              Disclaimer & Privasi
            </button>
          </div>
        </div>
      </footer>

      {/* Educational FIRE Indonesia Modal */}
      <IndonesianContextModal
        isOpen={isInfoModalOpen}
        onClose={() => setIsInfoModalOpen(false)}
      />

      {/* Export / Import Modal */}
      <ExportImportModal
        isOpen={exportImportModal.isOpen}
        mode={exportImportModal.mode}
        dataJson={fullBackupData}
        onClose={() => setExportImportModal({ isOpen: false, mode: 'export' })}
        onImportConfirm={handleImportConfirm}
      />

      {/* Printable Report / PDF Modal */}
      <PrintableReport
        isOpen={isPrintableReportOpen}
        onClose={() => setIsPrintableReportOpen(false)}
        profile={userProfile}
        assets={assets}
        liabilities={liabilities}
        fireSettings={fireSettings}
        netWorth={netWorth}
      />

      {/* Disclaimer Modal (Review Mode from Footer) */}
      <DisclaimerModal
        isOpen={isReviewDisclaimerOpen}
        isGatekeeper={false}
        onClose={() => setIsReviewDisclaimerOpen(false)}
        onAccept={() => setIsReviewDisclaimerOpen(false)}
      />

    </div>
  );
}
