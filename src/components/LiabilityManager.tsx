import { useState, useMemo } from 'react';
import { 
  Plus, 
  Trash2, 
  Edit3, 
  ShieldAlert, 
  AlertTriangle, 
  Zap, 
  CheckCircle, 
  Check, 
  X,
  CreditCard,
  Smartphone,
  Car,
  Home,
  Users,
  Flame,
  HelpCircle
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { LiabilityItem, LiabilityCategory } from '../types';
import { formatRupiah, LIABILITY_CATEGORIES } from '../utils/formatters';

interface LiabilityManagerProps {
  liabilities: LiabilityItem[];
  onAddLiability: (liability: Omit<LiabilityItem, 'id' | 'updatedAt'>) => void;
  onUpdateLiability: (id: string, liability: Partial<LiabilityItem>) => void;
  onDeleteLiability: (id: string) => void;
  onPayoffLiability: (id: string) => void;
}

export function LiabilityManager({
  liabilities,
  onAddLiability,
  onUpdateLiability,
  onDeleteLiability,
  onPayoffLiability,
}: LiabilityManagerProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form state
  const [formName, setFormName] = useState('');
  const [formCategory, setFormCategory] = useState<LiabilityCategory>('paylater_pinjol');
  const [formBalance, setFormBalance] = useState<number>(2000000);
  const [formInterestRate, setFormInterestRate] = useState<number>(24.0);
  const [formMonthlyPayment, setFormMonthlyPayment] = useState<number>(500000);
  const [formNotes, setFormNotes] = useState('');

  // AUTOMATIC SORTING BY HIGHEST INTEREST RATE (Debt Avalanche Priority)
  const sortedLiabilities = useMemo(() => {
    return [...liabilities].sort((a, b) => {
      // Primary sort: highest interest rate first
      if (b.annualInterestRate !== a.annualInterestRate) {
        return b.annualInterestRate - a.annualInterestRate;
      }
      // Secondary sort: balance
      return b.balance - a.balance;
    });
  }, [liabilities]);

  // Total liabilities & annual interest drain
  const totalBalance = useMemo(
    () => liabilities.reduce((sum, item) => sum + (item.balance || 0), 0),
    [liabilities]
  );

  const totalAnnualInterestDrain = useMemo(() => {
    return liabilities.reduce(
      (sum, item) => sum + (item.balance * (item.annualInterestRate / 100)),
      0
    );
  }, [liabilities]);

  const resetForm = () => {
    setFormName('');
    setFormCategory('paylater_pinjol');
    setFormBalance(2000000);
    setFormInterestRate(24.0);
    setFormMonthlyPayment(500000);
    setFormNotes('');
    setIsAdding(false);
    setEditingId(null);
  };

  const handleStartEdit = (item: LiabilityItem) => {
    setEditingId(item.id);
    setFormName(item.name);
    setFormCategory(item.category);
    setFormBalance(item.balance);
    setFormInterestRate(item.annualInterestRate);
    setFormMonthlyPayment(item.monthlyPayment || 0);
    setFormNotes(item.notes || '');
    setIsAdding(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || formBalance <= 0) return;

    if (editingId) {
      onUpdateLiability(editingId, {
        name: formName.trim(),
        category: formCategory,
        balance: formBalance,
        annualInterestRate: formInterestRate,
        monthlyPayment: formMonthlyPayment > 0 ? formMonthlyPayment : undefined,
        notes: formNotes.trim() || undefined,
        updatedAt: new Date().toISOString().split('T')[0],
      });
    } else {
      onAddLiability({
        name: formName.trim(),
        category: formCategory,
        balance: formBalance,
        annualInterestRate: formInterestRate,
        monthlyPayment: formMonthlyPayment > 0 ? formMonthlyPayment : undefined,
        notes: formNotes.trim() || undefined,
      });
    }
    resetForm();
  };

  const handlePayoffWithCelebration = (id: string, name: string) => {
    confetti({
      particleCount: 70,
      spread: 60,
      origin: { y: 0.7 },
    });
    onPayoffLiability(id);
  };

  const getCategoryIcon = (cat: LiabilityCategory) => {
    switch (cat) {
      case 'paylater_pinjol':
        return <Smartphone className="w-4 h-4 text-rose-600" />;
      case 'kartu_kredit':
        return <CreditCard className="w-4 h-4 text-red-600" />;
      case 'cicilan_kendaraan':
        return <Car className="w-4 h-4 text-amber-600" />;
      case 'kpr':
        return <Home className="w-4 h-4 text-blue-600" />;
      case 'pinjaman_pribadi':
        return <Users className="w-4 h-4 text-slate-600" />;
      default:
        return <ShieldAlert className="w-4 h-4 text-orange-600" />;
    }
  };

  return (
    <div id="section-liabilities" className="bg-white rounded-2xl p-5 sm:p-7 shadow-xs border border-slate-200/90 space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-bold text-slate-900 tracking-tight">
              Liabilitas & Prioritas Pelunasan Utang
            </h3>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 border border-rose-200">
              Metode Avalanche
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Utang otomatis diurutkan dari <strong>bunga tertinggi</strong> untuk memotong kebocoran finansial terbesar lebih cepat
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <span className="text-[11px] text-slate-400 block font-medium">Beban Bunga Terbuang</span>
            <span className="text-sm font-extrabold text-rose-600">
              ~{formatRupiah(totalAnnualInterestDrain / 12)}/bulan
            </span>
          </div>

          {!isAdding && (
            <button
              id="btn-add-liability"
              onClick={() => {
                resetForm();
                setIsAdding(true);
              }}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Utang</span>
            </button>
          )}
        </div>
      </div>

      {/* Priority Strategy Banner */}
      {sortedLiabilities.length > 0 && (
        <div className="bg-rose-50/70 border border-rose-200 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-rose-600 text-white flex items-center justify-center shrink-0 font-extrabold text-xs shadow-xs">
              #1
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-extrabold text-rose-900 uppercase tracking-wide">
                  Prioritas Pelunasan Pertama
                </span>
                <span className="text-[10px] bg-rose-200/80 text-rose-900 px-1.5 py-0.2 rounded font-bold">
                  Bunga {sortedLiabilities[0].annualInterestRate}% p.a.
                </span>
              </div>
              <p className="text-xs text-rose-800 mt-0.5 font-medium">
                Fokuskan seluruh uang ekstra untuk melunasi <strong>{sortedLiabilities[0].name}</strong> ({formatRupiah(sortedLiabilities[0].balance)}) terlebih dahulu sembari membayar cicilan minimum utang lainnya.
              </p>
            </div>
          </div>

          <button
            onClick={() => handlePayoffWithCelebration(sortedLiabilities[0].id, sortedLiabilities[0].name)}
            className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-lg shadow-2xs transition-colors cursor-pointer shrink-0 self-end sm:self-auto flex items-center gap-1.5"
          >
            <CheckCircle className="w-3.5 h-3.5" />
            <span>Tandai Sudah Lunas!</span>
          </button>
        </div>
      )}

      {/* Inline Add / Edit Form */}
      {isAdding && (
        <form 
          onSubmit={handleSubmit}
          className="bg-slate-50/90 rounded-xl p-4 sm:p-5 border border-rose-200 shadow-xs space-y-4 animate-in fade-in duration-150"
        >
          <div className="flex items-center justify-between border-b border-slate-200/80 pb-2.5">
            <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              {editingId ? 'Edit Data Liabilitas' : 'Tambah Liabilitas Baru'}
            </span>
            <button
              type="button"
              onClick={resetForm}
              className="text-slate-400 hover:text-slate-600 p-1 rounded-md"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {/* Nama Utang */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Nama Liabilitas / Pinjaman <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                id="input-liability-name"
                placeholder="Contoh: Shopee Paylater, CC Mandiri, Cicilan Motor"
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                required
                className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-rose-500"
              />
            </div>

            {/* Kategori Liabilitas */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Kategori Liabilitas <span className="text-rose-500">*</span>
              </label>
              <select
                id="select-liability-category"
                value={formCategory}
                onChange={(e) => {
                  const cat = e.target.value as LiabilityCategory;
                  setFormCategory(cat);
                  // auto suggest typical interest rate
                  if (cat === 'paylater_pinjol') setFormInterestRate(35.4);
                  if (cat === 'kartu_kredit') setFormInterestRate(21.0);
                  if (cat === 'kta') setFormInterestRate(15.0);
                  if (cat === 'cicilan_kendaraan') setFormInterestRate(8.5);
                  if (cat === 'kpr') setFormInterestRate(6.5);
                }}
                className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-rose-500 cursor-pointer"
              >
                {Object.values(LIABILITY_CATEGORIES).map((cat) => (
                  <option key={cat.key} value={cat.key}>
                    {cat.label} (Khas: {cat.typicalRate})
                  </option>
                ))}
              </select>
            </div>

            {/* Sisa Saldo Utang */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Sisa Saldo Utang (Rupiah) <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2 text-xs font-bold text-slate-400">Rp</span>
                <input
                  type="number"
                  inputMode="numeric"
                  id="input-liability-balance"
                  value={formBalance}
                  onChange={(e) => setFormBalance(Math.max(0, parseInt(e.target.value, 10) || 0))}
                  required
                  step="100000"
                  className="w-full bg-white border border-slate-300 rounded-lg pl-9 pr-3 py-2 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
              </div>
              <div className="text-[11px] text-rose-700 font-semibold mt-1">
                {formatRupiah(formBalance)}
              </div>
            </div>

            {/* Kolom Bunga (% per Tahun) */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Suku Bunga (% per Tahun) <span className="text-rose-500">*</span>
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  inputMode="decimal"
                  id="input-liability-interest-rate"
                  value={formInterestRate}
                  onChange={(e) => setFormInterestRate(parseFloat(e.target.value) || 0)}
                  required
                  step="0.1"
                  min="0"
                  max="150"
                  className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
                <span className="text-xs font-bold text-slate-600">% p.a.</span>
              </div>
              <div className="text-[11px] text-slate-500 mt-1">
                Setara ~{(formInterestRate / 12).toFixed(2)}% per bulan
              </div>
            </div>

            {/* Cicilan Bulanan */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Cicilan Minimum per Bulan
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2 text-xs font-bold text-slate-400">Rp</span>
                <input
                  type="number"
                  inputMode="numeric"
                  id="input-liability-monthly-payment"
                  value={formMonthlyPayment}
                  onChange={(e) => setFormMonthlyPayment(Math.max(0, parseInt(e.target.value, 10) || 0))}
                  step="50000"
                  className="w-full bg-white border border-slate-300 rounded-lg pl-9 pr-3 py-2 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
              </div>
            </div>

            {/* Catatan */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Catatan (Opsional)
              </label>
              <input
                type="text"
                id="input-liability-notes"
                placeholder="Jatuh tempo tgl 20, sisa 4 bulan lagi"
                value={formNotes}
                onChange={(e) => setFormNotes(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-rose-500"
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200/80">
            <button
              type="button"
              onClick={resetForm}
              className="px-3 py-1.5 rounded-lg border border-slate-300 text-xs font-medium text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              id="btn-save-liability"
              className="px-4 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-xs transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <Check className="w-3.5 h-3.5" />
              <span>{editingId ? 'Simpan Perubahan' : 'Tambahkan Utang'}</span>
            </button>
          </div>
        </form>
      )}

      {/* Liabilities List (Strictly Sorted by Highest Interest Rate) */}
      <div className="space-y-2.5">
        {sortedLiabilities.length === 0 ? (
          <div className="p-8 text-center bg-emerald-50/50 rounded-xl border border-emerald-200">
            <CheckCircle className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
            <p className="text-sm font-bold text-emerald-900">Selamat! Anda Saat Ini Bebas Utang.</p>
            <p className="text-xs text-emerald-700 mt-0.5">
              Seluruh penghasilan dan tabungan Anda dapat dialokasikan 100% untuk akumulasi aset bebas finansial.
            </p>
          </div>
        ) : (
          sortedLiabilities.map((item, index) => {
            const meta = LIABILITY_CATEGORIES[item.category] || {
              label: item.category,
              badgeColor: 'bg-slate-100 text-slate-700',
            };

            const isPriorityOne = index === 0;
            const annualCost = item.balance * (item.annualInterestRate / 100);

            let rateBadgeColor = 'bg-blue-50 text-blue-700 border-blue-200';
            if (item.annualInterestRate >= 20) {
              rateBadgeColor = 'bg-rose-100 text-rose-800 border-rose-300 font-bold';
            } else if (item.annualInterestRate >= 10) {
              rateBadgeColor = 'bg-amber-100 text-amber-800 border-amber-300';
            }

            return (
              <div
                key={item.id}
                className={`p-3.5 sm:p-4 rounded-xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 group ${
                  isPriorityOne
                    ? 'bg-rose-50/40 border-rose-300 shadow-xs'
                    : 'bg-white border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-start gap-3">
                  {/* Priority Rank Badge */}
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 font-black text-xs mt-0.5 border ${
                    isPriorityOne
                      ? 'bg-rose-600 text-white border-rose-600 shadow-xs'
                      : 'bg-slate-100 text-slate-700 border-slate-200'
                  }`}>
                    #{index + 1}
                  </div>

                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-extrabold text-slate-900">{item.name}</span>
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${meta.badgeColor}`}>
                        {meta.label}
                      </span>
                      {isPriorityOne && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-600 text-white flex items-center gap-1 shadow-2xs">
                          <Flame className="w-3 h-3 fill-white" /> Prioritas #1
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-3 text-xs text-slate-500 mt-1 flex-wrap">
                      <span className={`text-xs px-2 py-0.5 rounded-md border ${rateBadgeColor}`}>
                        Bunga: <strong>{item.annualInterestRate}% p.a.</strong> (~{(item.annualInterestRate / 12).toFixed(1)}%/bln)
                      </span>

                      {item.monthlyPayment && (
                        <span className="text-slate-600">
                          Cicilan: <strong>{formatRupiah(item.monthlyPayment)}</strong>/bln
                        </span>
                      )}

                      {item.notes && <span className="italic text-slate-500">"{item.notes}"</span>}
                    </div>
                  </div>
                </div>

                {/* Right Balance & Actions */}
                <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 pl-11 sm:pl-0">
                  <div className="text-left sm:text-right">
                    <div className="text-sm sm:text-base font-extrabold text-slate-900">
                      {formatRupiah(item.balance)}
                    </div>
                    <span className="text-[11px] text-rose-600 block">
                      Bunga ~{formatRupiah(annualCost / 12)}/bln
                    </span>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handlePayoffWithCelebration(item.id, item.name)}
                      className="p-1.5 text-red-700 hover:bg-amber-100 bg-amber-50 rounded-lg transition-colors cursor-pointer text-xs font-bold flex items-center gap-1 border border-amber-200"
                      title="Lunasi Sekarang"
                    >
                      <CheckCircle className="w-3.5 h-3.5 text-red-600" />
                      <span className="hidden sm:inline">Lunas</span>
                    </button>

                    <button
                      onClick={() => handleStartEdit(item)}
                      className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                      title="Edit Utang"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => onDeleteLiability(item.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                      title="Hapus Utang"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
