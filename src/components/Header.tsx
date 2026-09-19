import { useState } from 'react';
import { 
  TrendingUp, 
  HelpCircle, 
  RotateCcw, 
  Download, 
  Upload, 
  ShieldCheck, 
  Target, 
  Printer, 
  Award,
  ChevronDown,
  Sparkles
} from 'lucide-react';
import { UserProfile } from '../types';
import { formatRupiah } from '../utils/formatters';
import logoMf from '../assets/logo.png';

interface HeaderProps {
  netWorth: number;
  profile?: UserProfile;
  onResetToZero: () => void;
  onLoadDemoData: () => void;
  onExportData: () => void;
  onImportData: () => void;
  onOpenInfoModal: () => void;
  onScrollToSavingsTarget?: () => void;
  onOpenPrintableReport: () => void;
}

export function Header({
  netWorth,
  profile,
  onResetToZero,
  onLoadDemoData,
  onExportData,
  onImportData,
  onOpenInfoModal,
  onScrollToSavingsTarget,
  onOpenPrintableReport,
}: HeaderProps) {
  const [showSettingsDropdown, setShowSettingsDropdown] = useState(false);

  return (
    <header className="border-b border-stone-200/80 bg-white/95 backdrop-blur-md sticky top-0 z-30 shadow-xs transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* 1. Left: Brand & Luxury Designer Signature */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-white flex items-center justify-center shadow-md shadow-stone-900/10 ring-2 ring-stone-200/80 overflow-hidden shrink-0 p-1">
              <img src={logoMf} alt="MF Logo" className="w-full h-full object-contain" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-black text-lg sm:text-xl text-neutral-900 tracking-tight">
                  NetWorth <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 via-red-500 to-amber-600">Anda</span>
                </span>
                
                {/* Premium Designer Capsule */}
                <div 
                  className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-gradient-to-r from-stone-900 via-neutral-900 to-stone-900 text-white shadow-2xs border border-amber-400/40 text-[10px] whitespace-nowrap hover:border-amber-400 transition-all group"
                  title="Perancang Aplikasi: Mario Fahmi Syahrial"
                >
                  <div className="w-4 h-4 rounded-full bg-white flex items-center justify-center overflow-hidden shrink-0 p-0.5 ring-1 ring-amber-400">
                    <img src={logoMf} alt="MF" className="w-full h-full object-contain" />
                  </div>
                  <span className="text-[9px] uppercase tracking-wider text-neutral-400 font-bold">
                    Perancang
                  </span>
                  <span className="text-neutral-500">•</span>
                  <span className="text-amber-200 font-black tracking-wide group-hover:text-amber-100 transition-colors">
                    Mario Fahmi Syahrial
                  </span>
                </div>
              </div>

              <p className="text-[11px] sm:text-xs text-neutral-500 hidden sm:block font-medium">
                Kalkulator Nilai Bersih & Target Bebas Finansial
              </p>
            </div>
          </div>

          {/* 2. Center: Sleek Unified Target & Net Worth Status Pill */}
          {profile && (
            <div className="hidden lg:flex items-center gap-2">
              <button
                id="header-btn-savings-target"
                onClick={onScrollToSavingsTarget}
                className="flex items-center gap-2.5 bg-stone-50 hover:bg-amber-50/70 px-4 py-1.5 rounded-full border border-stone-200 hover:border-amber-300 text-xs transition-all cursor-pointer group shadow-2xs"
                title="Klik untuk melihat menu Target Tabungan"
              >
                <div className="w-5 h-5 rounded-full bg-red-100 flex items-center justify-center text-red-600 group-hover:bg-red-600 group-hover:text-white transition-colors">
                  <Target className="w-3 h-3" />
                </div>
                <span className="text-neutral-600 font-medium">
                  Target <strong className="text-neutral-900 font-bold">{profile.targetYear}</strong>:
                </span>
                <span className="font-black text-red-700">
                  {formatRupiah(profile.savingsTargetAmount, true)}
                </span>
                <span className="text-[10px] bg-amber-100 text-amber-900 font-bold px-1.5 py-0.5 rounded-full">
                  {profile.age} thn
                </span>
              </button>

              <div className="flex items-center gap-1.5 bg-stone-100 px-3.5 py-1.5 rounded-full border border-stone-200 text-xs font-semibold">
                <span className="text-neutral-500">Nilai Bersih:</span>
                <span className={`font-black ${netWorth >= 0 ? 'text-neutral-900' : 'text-red-700'}`}>
                  {formatRupiah(netWorth, true)}
                </span>
              </div>
            </div>
          )}

          {/* 3. Right: Clean Consolidated Action Buttons */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            
            {/* Quick target scroll button for mobile */}
            {onScrollToSavingsTarget && (
              <button
                onClick={onScrollToSavingsTarget}
                className="lg:hidden p-2 text-red-700 bg-red-50 hover:bg-red-100 border border-red-200 rounded-xl transition-colors cursor-pointer"
                title="Target Tabungan"
              >
                <Target className="w-4 h-4" />
              </button>
            )}

            {/* Quick Print PDF Button */}
            <button
              id="btn-quick-print"
              onClick={onOpenPrintableReport}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-white bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 rounded-xl shadow-xs shadow-red-500/20 transition-all cursor-pointer hover:shadow-md"
              title="Cetak / Unduh Neraca Keuangan Pribadi (PDF)"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Cetak PDF</span>
            </button>

            {/* Panduan Button */}
            <button
              id="btn-info-fire"
              onClick={onOpenInfoModal}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-neutral-700 bg-stone-50 hover:bg-amber-50 hover:text-amber-950 border border-stone-200 hover:border-amber-300 rounded-xl transition-all cursor-pointer shadow-2xs"
              title="Panduan Bebas Finansial & Pengali Target"
            >
              <HelpCircle className="w-4 h-4 text-amber-600 shrink-0" />
              <span className="hidden sm:inline">Panduan</span>
            </button>

            {/* Kelola Data Dropdown Menu */}
            <div className="relative">
              <button
                id="btn-data-menu"
                onClick={() => setShowSettingsDropdown(!showSettingsDropdown)}
                className="px-3 py-2 text-xs font-bold text-neutral-700 hover:text-neutral-950 bg-white hover:bg-stone-50 border border-stone-200 rounded-xl transition-colors cursor-pointer flex items-center gap-1.5 shadow-2xs"
              >
                <span>Kelola Data</span>
                <ChevronDown className="w-3.5 h-3.5 text-neutral-400" />
              </button>

              {showSettingsDropdown && (
                <>
                  {/* Tap-outside backdrop for touch devices */}
                  <div 
                    className="fixed inset-0 z-30" 
                    onClick={() => setShowSettingsDropdown(false)} 
                  />

                  <div 
                    className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-stone-200 py-2 z-40 text-xs text-neutral-700 animate-in fade-in zoom-in-95 duration-150"
                  >
                    <div className="px-3.5 py-1.5 text-[11px] font-bold text-neutral-400 uppercase tracking-wider border-b border-stone-100">
                      Laporan & Cetak
                    </div>
                    <button
                      id="btn-print-statement"
                      onClick={() => {
                        setShowSettingsDropdown(false);
                        onOpenPrintableReport();
                      }}
                      className="w-full text-left px-3.5 py-2.5 hover:bg-amber-50/80 flex items-center gap-2.5 cursor-pointer text-neutral-800 hover:text-red-700 font-bold transition-colors"
                    >
                      <Printer className="w-4 h-4 text-amber-600" />
                      <span>Cetak Neraca Keuangan (PDF)</span>
                    </button>

                    <div className="my-1 border-t border-stone-100" />
                    
                    <div className="px-3.5 py-1.5 text-[11px] font-bold text-neutral-400 uppercase tracking-wider border-b border-stone-100">
                      Cadangan & Sinkronisasi
                    </div>
                    <button
                      id="btn-export-data"
                      onClick={() => {
                        setShowSettingsDropdown(false);
                        onExportData();
                      }}
                      className="w-full text-left px-3.5 py-2 hover:bg-stone-50 flex items-center gap-2.5 cursor-pointer text-neutral-700 hover:text-neutral-950 transition-colors"
                    >
                      <Download className="w-4 h-4 text-neutral-400" />
                      <span>Ekspor Cadangan (File JSON)</span>
                    </button>
                    <button
                      id="btn-import-data"
                      onClick={() => {
                        setShowSettingsDropdown(false);
                        onImportData();
                      }}
                      className="w-full text-left px-3.5 py-2 hover:bg-stone-50 flex items-center gap-2.5 cursor-pointer text-neutral-700 hover:text-neutral-950 transition-colors"
                    >
                      <Upload className="w-4 h-4 text-neutral-400" />
                      <span>Impor Cadangan Data</span>
                    </button>

                    <div className="my-1 border-t border-stone-100" />

                    <div className="px-3.5 py-1.5 text-[11px] font-bold text-neutral-400 uppercase tracking-wider border-b border-stone-100">
                      Kelola Angka & Data
                    </div>
                    <button
                      id="btn-load-demo"
                      onClick={() => {
                        setShowSettingsDropdown(false);
                        onLoadDemoData();
                      }}
                      className="w-full text-left px-3.5 py-2 hover:bg-amber-50/80 flex items-center gap-2.5 cursor-pointer text-amber-700 font-semibold transition-colors"
                    >
                      <Sparkles className="w-4 h-4 text-amber-500" />
                      <span>Muat Data Simulasi / Contoh</span>
                    </button>
                    <button
                      id="btn-reset-zero"
                      onClick={() => {
                        setShowSettingsDropdown(false);
                        onResetToZero();
                      }}
                      className="w-full text-left px-3.5 py-2 hover:bg-red-50 flex items-center gap-2.5 cursor-pointer text-red-600 font-semibold transition-colors"
                    >
                      <RotateCcw className="w-4 h-4 text-red-500" />
                      <span>Kosongkan Semua Angka (Mulai Rp 0)</span>
                    </button>

                    {/* Integrated Privacy Badge */}
                    <div className="mt-2 pt-2 border-t border-stone-100 mx-2 px-2.5 py-2 bg-emerald-50/60 rounded-xl flex items-center gap-2 text-[11px] text-emerald-800 font-semibold">
                      <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                      <span>Data 100% Privat & Tersimpan Offline di Browser Anda</span>
                    </div>
                  </div>
                </>
              )}
            </div>

          </div>

        </div>
      </div>
    </header>
  );
}
