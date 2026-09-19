import { X, Sparkles, AlertCircle, BookOpen, CheckCircle, TrendingUp } from 'lucide-react';

interface IndonesianContextModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function IndonesianContextModal({ isOpen, onClose }: IndonesianContextModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 p-6 space-y-5"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-stone-100 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-red-100 text-red-700 flex items-center justify-center">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-extrabold text-neutral-900 text-base">
                Panduan Bebas Finansial & Pengali Target
              </h3>
              <p className="text-xs text-neutral-500">
                Memahami strategi penentuan pengali bebas finansial dan prioritas keuangan
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-neutral-400 hover:text-neutral-600 rounded-lg hover:bg-stone-100 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content sections */}
        <div className="space-y-4 text-xs text-neutral-700 leading-relaxed">
          
          {/* Section 1 */}
          <div className="bg-amber-50/70 rounded-xl p-4 border border-amber-200/80 space-y-1.5">
            <h4 className="font-bold text-amber-950 flex items-center gap-1.5 text-sm">
              <TrendingUp className="w-4 h-4 text-amber-700" />
              1. Mengapa Angka "25 Kali Pengeluaran" Perlu Disesuaikan?
            </h4>
            <p className="text-neutral-700">
              Angka <strong>25x</strong> berasal dari <em>Trinity Study</em> (1998) di AS, yang mengasumsikan <strong>Aturan Penarikan 4% (4% Rule)</strong> per tahun dari portofolio saham (S&P 500) & obligasi AS. 
              Artinya: <code className="bg-white px-1.5 py-0.5 rounded border border-amber-200 font-mono">100 ÷ 4% = 25 kali</code> pengeluaran tahunan.
            </p>
            <p className="text-neutral-700">
              Namun di Indonesia, kondisi pasar berbeda:
            </p>
            <ul className="list-disc list-inside space-y-1 pl-1 text-neutral-600">
              <li><strong>Inflasi Indonesia:</strong> Rata-rata inflasi riil kebutuhan hidup (makanan, tempat tinggal, kesehatan) sering berada di kisaran 3% - 5%.</li>
              <li><strong>Imbal Hasil Kupon SBN / Deposito:</strong> Berita baiknya, obligasi negara Indonesia (ORI, SR, Sukuk) menawarkan kupon bersih 5.5% - 6.5% bebas risiko gagal bayar, lebih tinggi dibanding obligasi AS.</li>
              <li><strong>Pilihan Pengali Fleksibel:</strong>
                <ul className="list-circle list-inside pl-4 mt-0.5 space-y-0.5">
                  <li><strong>20x (Tarik 5%):</strong> Agresif, cocok jika aset banyak di instrumen pertumbuhan tinggi.</li>
                  <li><strong>25x (Tarik 4%):</strong> Standar klasik, cukup aman untuk horizon waktu 25-30 tahun.</li>
                  <li><strong>30x (Tarik 3.3%):</strong> Sangat direkomendasikan perencana keuangan Indonesia untuk pensiun dini lebih dari 30 tahun.</li>
                  <li><strong>33x (Tarik 3.0%):</strong> Konservatif & aman dari fluktuasi inflasi jangka panjang.</li>
                </ul>
              </li>
            </ul>
          </div>

          {/* Section 2 */}
          <div className="bg-stone-50 rounded-xl p-4 border border-stone-200 space-y-1.5">
            <h4 className="font-bold text-neutral-900 flex items-center gap-1.5 text-sm">
              <CheckCircle className="w-4 h-4 text-red-600" />
              2. Kategori Aset Lokal Indonesia (Bukan 401(k) atau Roth IRA)
            </h4>
            <p className="text-neutral-700">
              Banyak buku barat menyuruh memaksimalkan 401(k) atau Roth IRA yang tidak ada di Indonesia. Padahal kita punya instrumen lokal yang sangat kompetitif:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
              <div className="bg-white p-2.5 rounded-lg border border-stone-200 shadow-2xs">
                <span className="font-bold text-neutral-900 block">BPJS Ketenagakerjaan (JHT & JP)</span>
                <span className="text-[11px] text-neutral-500">Pensiun wajib dari kantor (iuran 5.7% per bulan) dengan imbal hasil di atas deposito.</span>
              </div>
              <div className="bg-white p-2.5 rounded-lg border border-stone-200 shadow-2xs">
                <span className="font-bold text-neutral-900 block">SBN Ritel (ORI, SR, SBR, ST)</span>
                <span className="text-[11px] text-neutral-500">Surat Utang Negara dijamin 100% oleh APBN RI, kupon cair tiap bulan seperti dividen.</span>
              </div>
              <div className="bg-white p-2.5 rounded-lg border border-stone-200 shadow-2xs">
                <span className="font-bold text-neutral-900 block">Reksa Dana & Saham IHSG</span>
                <span className="text-[11px] text-neutral-500">Pasar uang bebas pajak transaksi, dan saham bluechip dividen tinggi (perbankan).</span>
              </div>
              <div className="bg-white p-2.5 rounded-lg border border-stone-200 shadow-2xs">
                <span className="font-bold text-neutral-900 block">Emas Batangan Antam / Logam Mulia</span>
                <span className="text-[11px] text-neutral-500">Aset lindung nilai (hedging) favorit masyarakat Indonesia dari pelemahan kurs rupiah.</span>
              </div>
            </div>
          </div>

          {/* Section 3 */}
          <div className="bg-red-50/70 rounded-xl p-4 border border-red-200 space-y-1.5">
            <h4 className="font-bold text-red-950 flex items-center gap-1.5 text-sm">
              <AlertCircle className="w-4 h-4 text-red-600" />
              3. Kenapa Utang Bunga Tertinggi Harus Dilunasi Duluan?
            </h4>
            <p className="text-neutral-700">
              Paylater dan Pinjol mengenakan bunga rata-rata <strong>2% - 3.5% per bulan</strong> (setara <strong>24% - 42% per tahun</strong>!). 
              Bahkan investasi saham terbaik pun jarang memberikan return 35% stabil tiap tahun. 
              Melunasi Paylater memberikan "imbal hasil pasti" sebesar 35% dari beban bunga yang Anda selamatkan.
            </p>
          </div>

        </div>

        {/* Footer */}
        <div className="pt-2 border-t border-stone-100 flex items-center justify-between">
          <span className="text-[11px] text-neutral-500 font-medium">
            Perancang: <strong className="text-neutral-800">Mario Fahmi Syahrial</strong>
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
          >
            Mengerti & Lanjutkan
          </button>
        </div>
      </div>
    </div>
  );
}
