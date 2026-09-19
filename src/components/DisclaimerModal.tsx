import { useState, useRef, useEffect } from 'react';
import { 
  ShieldAlert, 
  CheckCircle2, 
  AlertTriangle, 
  Scale, 
  BookOpen, 
  X, 
  ArrowDown, 
  CheckSquare, 
  Square,
  FileText,
  Lock
} from 'lucide-react';

interface DisclaimerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAccept: () => void;
  isGatekeeper?: boolean;
}

export function DisclaimerModal({
  isOpen,
  onClose,
  onAccept,
  isGatekeeper = false,
}: DisclaimerModalProps) {
  const [hasScrolledToBottom, setHasScrolledToBottom] = useState(false);
  const [isAgreed, setIsAgreed] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Check if content fits without scrolling on tall screens
  useEffect(() => {
    if (!isOpen) return;
    setHasScrolledToBottom(false);
    setIsAgreed(false);

    const timer = setTimeout(() => {
      const el = scrollContainerRef.current;
      if (el) {
        if (el.scrollHeight <= el.clientHeight + 15) {
          setHasScrolledToBottom(true);
        }
      }
    }, 150);

    return () => clearTimeout(timer);
  }, [isOpen]);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    // When within 25px of bottom, unlock
    if (scrollHeight - scrollTop - clientHeight < 25) {
      setHasScrolledToBottom(true);
    }
  };

  const handleScrollToBottomClick = () => {
    const el = scrollContainerRef.current;
    if (el) {
      el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' });
    }
  };

  if (!isOpen) return null;

  const canProceed = hasScrolledToBottom && isAgreed;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-neutral-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-3xl shadow-2xl border border-stone-200 w-full max-w-2xl max-h-[92vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-stone-900 via-neutral-800 to-stone-900 p-5 sm:p-6 text-white flex items-center justify-between shrink-0 border-b border-stone-800">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-amber-500/20 border border-amber-400/30 flex items-center justify-center text-amber-400 shrink-0 shadow-inner">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-lg sm:text-xl font-extrabold tracking-tight text-white">
                  Disclaimer & Ketentuan Penggunaan
                </h3>
                <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-amber-400 text-stone-950">
                  {isGatekeeper ? 'Wajib Dibaca Sebelum Masuk' : 'Ketentuan Layanan'}
                </span>
              </div>
              <p className="text-xs text-neutral-400 mt-0.5">
                NetWorth Anda • Perancang: <strong className="text-neutral-200">Mario Fahmi Syahrial</strong>
              </p>
            </div>
          </div>

          {!isGatekeeper && (
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center text-neutral-300 hover:text-white transition-colors cursor-pointer"
              title="Tutup Disclaimer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Scrollable Content Body */}
        <div 
          ref={scrollContainerRef}
          onScroll={handleScroll}
          className="p-5 sm:p-7 overflow-y-auto space-y-4 text-xs text-neutral-700 leading-relaxed font-sans scroll-smooth"
        >
          {/* Notice Alert */}
          <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200/80 text-amber-950 flex items-start gap-3 shadow-2xs">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-xs">Pemberitahuan Penting Sebelum Memulai</p>
              <p className="text-[11px] text-amber-900/90 mt-0.5">
                Demi kenyamanan dan pemahaman bersama, Anda diwajibkan membaca seluruh poin ketentuan di bawah ini dengan menggulir (*scroll*) sampai halaman paling akhir untuk melanjutkan.
              </p>
            </div>
          </div>

          {/* Point 1: Bukan Nasihat Finansial Berlisensi */}
          <div className="flex items-start gap-3.5 p-4 rounded-2xl bg-stone-50 border border-stone-200/90">
            <div className="w-9 h-9 rounded-xl bg-red-100 text-red-700 flex items-center justify-center shrink-0">
              <Scale className="w-4 h-4" />
            </div>
            <div className="space-y-1">
              <h4 className="font-extrabold text-xs text-neutral-900">
                1. Bukan Nasihat Finansial atau Rekomendasi Investasi Resmi
              </h4>
              <p className="text-neutral-600 leading-relaxed">
                Aplikasi <strong>NetWorth Anda</strong> dirancang semata-mata sebagai instrumen bantu kalkulasi (*calculator*), visualisasi data, dan edukasi mandiri perencanaan keuangan pribadi. Aplikasi ini <strong>tidak memberikan nasihat keuangan berlisensi, konsultasi perpajakan, maupun rekomendasi jual/beli instrumen keuangan tertentu</strong> yang diawasi oleh OJK (Otoritas Jasa Keuangan) atau Bappebti.
              </p>
            </div>
          </div>

          {/* Point 2: Tanggung Jawab Keputusan Pribadi */}
          <div className="flex items-start gap-3.5 p-4 rounded-2xl bg-stone-50 border border-stone-200/90">
            <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <div className="space-y-1">
              <h4 className="font-extrabold text-xs text-neutral-900">
                2. Tanggung Jawab Penuh Keputusan Finansial
              </h4>
              <p className="text-neutral-600 leading-relaxed">
                Setiap tindakan, alokasi tabungan, keputusan berinvestasi di instrumen mana pun, serta keputusan pelunasan utang adalah <strong>tanggung jawab pribadi Anda seutuhnya</strong>. Perancang aplikasi dan pengembang tidak bertanggung jawab atas potensi kerugian, fluktuasi pasar modal, atau kekeliruan dalam menafsirkan angka hasil simulasi.
              </p>
            </div>
          </div>

          {/* Point 3: Sifat Asumsi Matematis & Pasar Indonesia */}
          <div className="flex items-start gap-3.5 p-4 rounded-2xl bg-stone-50 border border-stone-200/90">
            <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
              <BookOpen className="w-4 h-4" />
            </div>
            <div className="space-y-1">
              <h4 className="font-extrabold text-xs text-neutral-900">
                3. Sifat Asumsi Proyeksi Matematis
              </h4>
              <p className="text-neutral-600 leading-relaxed">
                Proyeksi target tabungan, perhitungan bunga berbunga (*compound interest*), dan estimasi tahun menuju kebebasan finansial (*FIRE Target*) dihitung menggunakan formula proyeksi matematis dengan asumsi imbal hasil dan inflasi tertentu. Kondisi perekonomian riil, suku bunga acuan Bank Indonesia, dan imbal hasil pasar dapat berubah secara dinamis sewaktu-waktu.
              </p>
            </div>
          </div>

          {/* Scroll progress anchor card */}
          <div className={`p-3.5 rounded-2xl border transition-all text-xs flex items-center justify-between ${
            hasScrolledToBottom 
              ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
              : 'bg-stone-100 border-stone-200 text-neutral-600'
          }`}>
            <div className="flex items-center gap-2">
              <FileText className={`w-4 h-4 ${hasScrolledToBottom ? 'text-emerald-600' : 'text-neutral-400'}`} />
              <span className="font-bold">
                {hasScrolledToBottom 
                  ? '✓ Anda telah selesai membaca seluruh dokumen ketentuan.'
                  : 'Silakan scroll ke bawah sampai bagian akhir untuk melanjutkan.'}
              </span>
            </div>

            {!hasScrolledToBottom && (
              <button
                type="button"
                onClick={handleScrollToBottomClick}
                className="px-2.5 py-1 rounded-lg bg-white border border-stone-300 text-neutral-800 font-bold text-[11px] flex items-center gap-1 hover:bg-stone-50 transition-colors cursor-pointer"
              >
                <span>Scroll ke Bawah</span>
                <ArrowDown className="w-3 h-3 animate-bounce" />
              </button>
            )}
          </div>

        </div>

        {/* Modal Bottom Footer Actions with Lock Mechanism */}
        <div className="border-t border-stone-200 bg-stone-50 p-4 sm:p-5 flex flex-col gap-3 shrink-0">
          
          {/* Checkbox agreement */}
          <label 
            className={`flex items-center gap-2.5 text-xs select-none transition-opacity ${
              hasScrolledToBottom ? 'cursor-pointer text-neutral-800' : 'cursor-not-allowed opacity-50 text-neutral-400'
            }`}
          >
            <input
              type="checkbox"
              id="checkbox-agree-disclaimer"
              checked={isAgreed}
              disabled={!hasScrolledToBottom}
              onChange={(e) => setIsAgreed(e.target.checked)}
              className="sr-only"
            />
            <div className="shrink-0">
              {isAgreed ? (
                <CheckSquare className="w-4 h-4 text-red-600" />
              ) : (
                <Square className="w-4 h-4 text-stone-400" />
              )}
            </div>
            <span className="font-semibold text-[11px] sm:text-xs">
              Saya telah membaca, memahami, dan menyetujui seluruh ketentuan disclaimer di atas.
            </span>
          </label>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-1">
            <span className="text-[11px] text-neutral-500 text-center sm:text-left">
              {!hasScrolledToBottom 
                ? '⚠️ Tombol persetujuan terkunci sampai Anda membaca seluruh isi teks.'
                : !isAgreed 
                  ? 'Centang kotak persetujuan di atas untuk membuka tombol.'
                  : 'Ketentuan siap disetujui. Klik tombol di kanan untuk masuk ke aplikasi.'}
            </span>

            <button
              id="btn-accept-disclaimer"
              onClick={onAccept}
              disabled={!canProceed}
              className={`w-full sm:w-auto px-6 py-2.5 rounded-xl font-extrabold text-xs flex items-center justify-center gap-2 transition-all ${
                canProceed
                  ? 'bg-red-700 hover:bg-red-800 text-white shadow-md shadow-red-700/20 hover:shadow-lg cursor-pointer animate-in zoom-in-95 duration-150'
                  : 'bg-stone-200 text-neutral-400 border border-stone-300 cursor-not-allowed shadow-none'
              }`}
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{isGatekeeper ? 'Setujui & Masuk ke Aplikasi' : 'Saya Mengerti & Tutup'}</span>
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
