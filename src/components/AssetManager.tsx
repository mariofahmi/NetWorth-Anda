import { useState } from 'react';
import { 
  Plus, 
  Trash2, 
  Edit3, 
  Layers, 
  Building2, 
  Landmark, 
  Coins, 
  TrendingUp, 
  Briefcase, 
  Home, 
  Sparkles,
  Search,
  Check,
  X
} from 'lucide-react';
import { AssetItem, AssetCategory } from '../types';
import { formatRupiah, ASSET_CATEGORIES } from '../utils/formatters';

interface AssetManagerProps {
  assets: AssetItem[];
  onAddAsset: (asset: Omit<AssetItem, 'id' | 'updatedAt'>) => void;
  onUpdateAsset: (id: string, asset: Partial<AssetItem>) => void;
  onDeleteAsset: (id: string) => void;
}

export function AssetManager({
  assets,
  onAddAsset,
  onUpdateAsset,
  onDeleteAsset,
}: AssetManagerProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('all');

  // Form state
  const [formName, setFormName] = useState('');
  const [formCategory, setFormCategory] = useState<AssetCategory>('rekening_bank');
  const [formAmount, setFormAmount] = useState<number>(5000000);
  const [formInstitution, setFormInstitution] = useState('');
  const [formNotes, setFormNotes] = useState('');

  const resetForm = () => {
    setFormName('');
    setFormCategory('rekening_bank');
    setFormAmount(5000000);
    setFormInstitution('');
    setFormNotes('');
    setIsAdding(false);
    setEditingId(null);
  };

  const handleStartEdit = (item: AssetItem) => {
    setEditingId(item.id);
    setFormName(item.name);
    setFormCategory(item.category);
    setFormAmount(item.amount);
    setFormInstitution(item.institution || '');
    setFormNotes(item.notes || '');
    setIsAdding(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || formAmount < 0) return;

    if (editingId) {
      onUpdateAsset(editingId, {
        name: formName.trim(),
        category: formCategory,
        amount: formAmount,
        institution: formInstitution.trim() || undefined,
        notes: formNotes.trim() || undefined,
        updatedAt: new Date().toISOString().split('T')[0],
      });
    } else {
      onAddAsset({
        name: formName.trim(),
        category: formCategory,
        amount: formAmount,
        institution: formInstitution.trim() || undefined,
        notes: formNotes.trim() || undefined,
      });
    }
    resetForm();
  };

  const filteredAssets = assets.filter((item) => {
    const matchCat = selectedCategoryFilter === 'all' || item.category === selectedCategoryFilter;
    const matchSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.institution && item.institution.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (item.notes && item.notes.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchCat && matchSearch;
  });

  const totalAssetValue = assets.reduce((sum, item) => sum + (item.amount || 0), 0);

  const getCategoryIcon = (cat: AssetCategory) => {
    switch (cat) {
      case 'rekening_bank':
        return <Landmark className="w-4 h-4 text-blue-600" />;
      case 'deposito':
        return <Building2 className="w-4 h-4 text-sky-600" />;
      case 'reksa_dana':
        return <Layers className="w-4 h-4 text-emerald-600" />;
      case 'sbn':
        return <Landmark className="w-4 h-4 text-teal-600" />;
      case 'emas':
        return <Coins className="w-4 h-4 text-amber-600" />;
      case 'saham':
        return <TrendingUp className="w-4 h-4 text-indigo-600" />;
      case 'bpjs_ketenagakerjaan':
        return <Briefcase className="w-4 h-4 text-green-700" />;
      case 'properti':
        return <Home className="w-4 h-4 text-orange-600" />;
      default:
        return <Sparkles className="w-4 h-4 text-purple-600" />;
    }
  };

  return (
    <div id="section-assets" className="bg-white rounded-2xl p-5 sm:p-7 shadow-xs border border-stone-200 space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-stone-100">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-extrabold text-neutral-900 tracking-tight">
              Portofolio Aset
            </h3>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-200">
              {assets.length} Aset Terdaftar
            </span>
          </div>
          <p className="text-xs text-neutral-500 mt-0.5">
            Mencakup instrumen: Tabungan, Deposito, SBN, Reksa Dana, Saham, Emas, dan Dana Pensiun
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <span className="text-[11px] text-neutral-400 block font-medium">Total Nilai Aset</span>
            <span className="text-base font-extrabold text-neutral-900">{formatRupiah(totalAssetValue)}</span>
          </div>

          {!isAdding && (
            <button
              id="btn-add-asset"
              onClick={() => {
                resetForm();
                setIsAdding(true);
              }}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Aset</span>
            </button>
          )}
        </div>
      </div>

      {/* Inline Add / Edit Form */}
      {isAdding && (
        <form 
          onSubmit={handleSubmit}
          className="bg-stone-50 rounded-xl p-4 sm:p-5 border border-amber-300 shadow-xs space-y-4 animate-in fade-in duration-150"
        >
          <div className="flex items-center justify-between border-b border-stone-200 pb-2.5">
            <span className="text-xs font-bold text-neutral-800 uppercase tracking-wider">
              {editingId ? 'Edit Data Aset' : 'Tambah Aset Baru'}
            </span>
            <button
              type="button"
              onClick={resetForm}
              className="text-stone-400 hover:text-stone-600 p-1 rounded-md"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {/* Nama Aset */}
            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">
                Nama Aset <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="input-asset-name"
                placeholder="Contoh: Tabungan Jago, Emas Antam 10g, SBN ORI025"
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                required
                className="w-full bg-white border border-stone-300 rounded-lg px-3 py-2 text-xs text-neutral-800 focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>

            {/* Kategori Lokal Indonesia */}
            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">
                Kategori Aset Lokal <span className="text-red-500">*</span>
              </label>
              <select
                id="select-asset-category"
                value={formCategory}
                onChange={(e) => setFormCategory(e.target.value as AssetCategory)}
                className="w-full bg-white border border-stone-300 rounded-lg px-3 py-2 text-xs text-neutral-800 focus:outline-none focus:ring-2 focus:ring-red-500 cursor-pointer"
              >
                {Object.values(ASSET_CATEGORIES).map((cat) => (
                  <option key={cat.key} value={cat.key}>
                    {cat.label} {cat.isLiquid ? '(Likuid)' : '(Non-Likuid)'}
                  </option>
                ))}
              </select>
            </div>

            {/* Nilai / Saldo dalam Rupiah */}
            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">
                Nilai / Saldo Saat Ini (Rupiah) <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2 text-xs font-bold text-neutral-400">Rp</span>
                <input
                  type="number"
                  inputMode="numeric"
                  id="input-asset-amount"
                  value={formAmount}
                  onChange={(e) => setFormAmount(Math.max(0, parseInt(e.target.value, 10) || 0))}
                  required
                  step="100000"
                  className="w-full bg-white border border-stone-300 rounded-lg pl-9 pr-3 py-2 text-xs font-bold text-neutral-900 focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>
              <div className="text-[11px] text-red-700 font-semibold mt-1">
                Terbaca: {formatRupiah(formAmount)}
              </div>
            </div>

            {/* Lembaga / Platform */}
            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">
                Platform / Institusi
              </label>
              <input
                type="text"
                id="input-asset-institution"
                placeholder="Contoh: Bibit, BCA, Stockbit, Antam, BPJS TK"
                value={formInstitution}
                onChange={(e) => setFormInstitution(e.target.value)}
                className="w-full bg-white border border-stone-300 rounded-lg px-3 py-2 text-xs text-neutral-800 focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>

            {/* Catatan Tambahan */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-neutral-700 mb-1">
                Catatan (Opsional)
              </label>
              <input
                type="text"
                id="input-asset-notes"
                placeholder="Contoh: Kupon 6.25% jatuh tempo 2027, tujuan pensiun dini"
                value={formNotes}
                onChange={(e) => setFormNotes(e.target.value)}
                className="w-full bg-white border border-stone-300 rounded-lg px-3 py-2 text-xs text-neutral-800 focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>
          </div>

          {/* Quick Amount Shortcuts */}
          <div className="flex flex-wrap items-center gap-1.5 pt-1 text-[11px] text-neutral-500">
            <span>Tambah Cepat Nilai:</span>
            {[1_000_000, 5_000_000, 10_000_000, 50_000_000].map((val) => (
              <button
                key={val}
                type="button"
                onClick={() => setFormAmount((prev) => prev + val)}
                className="px-2 py-0.5 rounded bg-white hover:bg-red-50 border border-stone-200 hover:border-red-300 text-neutral-700 hover:text-red-700 font-medium transition-colors cursor-pointer"
              >
                +{formatRupiah(val, true)}
              </button>
            ))}
          </div>

          {/* Buttons */}
          <div className="flex items-center justify-end gap-2 pt-2 border-t border-stone-200">
            <button
              type="button"
              onClick={resetForm}
              className="px-3 py-1.5 rounded-lg border border-stone-300 text-xs font-medium text-neutral-700 hover:bg-stone-100 transition-colors cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              id="btn-save-asset"
              className="px-4 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-xs transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <Check className="w-3.5 h-3.5" />
              <span>{editingId ? 'Simpan Perubahan' : 'Tambahkan Aset'}</span>
            </button>
          </div>
        </form>
      )}

      {/* Filters & Search */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-2.5">
        {/* Search */}
        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Cari aset atau institusi..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-stone-50 border border-stone-200 rounded-lg pl-8 pr-3 py-1.5 text-xs text-neutral-800 focus:bg-white focus:outline-none focus:ring-1 focus:ring-red-500"
          />
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 text-xs scrollbar-none">
          <button
            onClick={() => setSelectedCategoryFilter('all')}
            className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors whitespace-nowrap cursor-pointer ${
              selectedCategoryFilter === 'all'
                ? 'bg-slate-900 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Semua ({assets.length})
          </button>
          <button
            onClick={() => setSelectedCategoryFilter('rekening_bank')}
            className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors whitespace-nowrap cursor-pointer ${
              selectedCategoryFilter === 'rekening_bank'
                ? 'bg-slate-900 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Bank & Kas
          </button>
          <button
            onClick={() => setSelectedCategoryFilter('reksa_dana')}
            className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors whitespace-nowrap cursor-pointer ${
              selectedCategoryFilter === 'reksa_dana'
                ? 'bg-slate-900 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Reksa Dana
          </button>
          <button
            onClick={() => setSelectedCategoryFilter('saham')}
            className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors whitespace-nowrap cursor-pointer ${
              selectedCategoryFilter === 'saham'
                ? 'bg-slate-900 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Saham
          </button>
          <button
            onClick={() => setSelectedCategoryFilter('sbn')}
            className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors whitespace-nowrap cursor-pointer ${
              selectedCategoryFilter === 'sbn'
                ? 'bg-slate-900 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            SBN
          </button>
          <button
            onClick={() => setSelectedCategoryFilter('emas')}
            className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors whitespace-nowrap cursor-pointer ${
              selectedCategoryFilter === 'emas'
                ? 'bg-slate-900 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Emas
          </button>
          <button
            onClick={() => setSelectedCategoryFilter('bpjs_ketenagakerjaan')}
            className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors whitespace-nowrap cursor-pointer ${
              selectedCategoryFilter === 'bpjs_ketenagakerjaan'
                ? 'bg-slate-900 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            BPJS TK
          </button>
        </div>
      </div>

      {/* Asset List */}
      <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden">
        {filteredAssets.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-400">
            Tidak ada data aset yang cocok dengan filter atau pencarian Anda.
          </div>
        ) : (
          filteredAssets.map((item) => {
            const meta = ASSET_CATEGORIES[item.category] || {
              label: item.category,
              badgeColor: 'bg-slate-100 text-slate-700',
              isLiquid: false,
            };
            const share = totalAssetValue > 0 ? (item.amount / totalAssetValue) * 100 : 0;

            return (
              <div
                key={item.id}
                className="p-3.5 sm:p-4 hover:bg-slate-50/80 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3 group"
              >
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center shrink-0 mt-0.5 border border-slate-200/60">
                    {getCategoryIcon(item.category)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-bold text-slate-900">{item.name}</span>
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${meta.badgeColor}`}>
                        {meta.label}
                      </span>
                      {meta.isLiquid && (
                        <span className="text-[10px] font-medium px-1.5 py-0.2 rounded bg-blue-50 text-blue-600 border border-blue-100">
                          Likuid
                        </span>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-2 text-xs text-slate-500 mt-1 flex-wrap">
                      {item.institution && (
                        <span className="font-medium text-slate-700 bg-slate-100 px-1.5 py-0.5 rounded">
                          {item.institution}
                        </span>
                      )}
                      {item.notes && <span className="italic">{item.notes}</span>}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-4 shrink-0 pl-12 sm:pl-0">
                  <div className="text-left sm:text-right">
                    <div className="text-sm sm:text-base font-extrabold text-slate-900">
                      {formatRupiah(item.amount)}
                    </div>
                    <span className="text-[11px] text-slate-400">
                      {share.toFixed(1)}% dari total aset
                    </span>
                  </div>

                  <div className="flex items-center gap-1 opacity-90 sm:opacity-40 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => handleStartEdit(item)}
                      className="p-1.5 text-neutral-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                      title="Edit Aset"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDeleteAsset(item.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                      title="Hapus Aset"
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
