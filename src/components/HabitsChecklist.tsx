import { useState, useMemo } from 'react';
import { 
  CheckSquare, 
  Square, 
  RotateCcw, 
  Plus, 
  Trash2, 
  Sparkles, 
  Sun, 
  CalendarDays, 
  CalendarRange, 
  Trophy,
  CheckCircle2,
  X
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { HabitItem, HabitPeriod } from '../types';

interface HabitsChecklistProps {
  habits: HabitItem[];
  onToggleHabit: (id: string) => void;
  onAddHabit: (habit: Omit<HabitItem, 'id'>) => void;
  onDeleteHabit: (id: string) => void;
  onResetPeriodHabits: (period: HabitPeriod) => void;
}

export function HabitsChecklist({
  habits,
  onToggleHabit,
  onAddHabit,
  onDeleteHabit,
  onResetPeriodHabits,
}: HabitsChecklistProps) {
  const [selectedPeriod, setSelectedPeriod] = useState<HabitPeriod>('harian');
  const [isAdding, setIsAdding] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newSubtitle, setNewSubtitle] = useState('');
  const [newTag, setNewTag] = useState('Rutinitas');

  const periodHabits = useMemo(() => {
    return habits.filter((h) => h.period === selectedPeriod);
  }, [habits, selectedPeriod]);

  const completedCount = periodHabits.filter((h) => h.completed).length;
  const totalCount = periodHabits.length;
  const progressPercent = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  const handleToggle = (id: string, currentlyCompleted: boolean) => {
    onToggleHabit(id);
    if (!currentlyCompleted && completedCount + 1 === totalCount) {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.8 },
      });
    }
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    onAddHabit({
      period: selectedPeriod,
      title: newTitle.trim(),
      subtitle: newSubtitle.trim() || undefined,
      completed: false,
      tag: newTag.trim() || 'Kebiasaan',
    });

    setNewTitle('');
    setNewSubtitle('');
    setIsAdding(false);
  };

  const periodConfig = {
    harian: {
      label: 'Harian',
      desc: 'Disiplin kecil harian untuk memutus kebocoran uang halus (latte factor & impulsif promo)',
      icon: <Sun className="w-4 h-4 text-amber-500" />,
      resetLabel: 'Mulai Hari Baru',
    },
    mingguan: {
      label: 'Mingguan',
      desc: 'Evaluasi mingguan agar pengeluaran akhir pekan tidak melebihi anggaran bulanan',
      icon: <CalendarDays className="w-4 h-4 text-blue-500" />,
      resetLabel: 'Mulai Minggu Baru',
    },
    bulanan: {
      label: 'Bulanan',
      desc: 'Rutinitas saat gajian: Pay yourself first, bayar utang bunga tertinggi, dan cek BPJS TK',
      icon: <CalendarRange className="w-4 h-4 text-emerald-500" />,
      resetLabel: 'Mulai Bulan Baru',
    },
    tahunan: {
      label: 'Tahunan',
      desc: 'Kewajiban pajak SPT Tahunan DJP Online, review polis asuransi, dan rebalancing portofolio',
      icon: <Trophy className="w-4 h-4 text-purple-500" />,
      resetLabel: 'Reset Tahunan',
    },
  };

  return (
    <div id="section-habits" className="bg-white rounded-2xl p-5 sm:p-7 shadow-xs border border-stone-200 space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-stone-100">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-extrabold text-neutral-900 tracking-tight">
              Checklist Kebiasaan Finansial Cerdas
            </h3>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-200">
              {completedCount}/{totalCount} Selesai
            </span>
          </div>
          <p className="text-xs text-neutral-500 mt-0.5">
            Kebiasaan finansial rutin yang terbukti mempercepat kebebasan finansial Anda
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onResetPeriodHabits(selectedPeriod)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-neutral-700 text-xs font-semibold rounded-xl transition-colors cursor-pointer"
            title="Centang ulang semua checklist pada periode ini"
          >
            <RotateCcw className="w-3.5 h-3.5 text-neutral-500" />
            <span>{periodConfig[selectedPeriod].resetLabel}</span>
          </button>

          {!isAdding && (
            <button
              onClick={() => setIsAdding(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Tambah Habit</span>
            </button>
          )}
        </div>
      </div>

      {/* Period Selection Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {(Object.keys(periodConfig) as HabitPeriod[]).map((periodKey) => {
          const cfg = periodConfig[periodKey];
          const isSelected = selectedPeriod === periodKey;
          const count = habits.filter((h) => h.period === periodKey);
          const done = count.filter((h) => h.completed).length;

          return (
            <button
              key={periodKey}
              id={`tab-habit-${periodKey}`}
              onClick={() => {
                setSelectedPeriod(periodKey);
                setIsAdding(false);
              }}
              className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                isSelected
                  ? 'bg-red-50/90 border-red-500 shadow-2xs'
                  : 'bg-white border-stone-200 hover:bg-stone-50'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {cfg.icon}
                  <span className={`text-xs font-extrabold ${isSelected ? 'text-red-950' : 'text-neutral-800'}`}>
                    {cfg.label}
                  </span>
                </div>
                <span className={`text-[11px] font-bold ${done === count.length && count.length > 0 ? 'text-red-600' : 'text-neutral-400'}`}>
                  {done}/{count.length}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Active Period Description & Progress */}
      <div className="bg-stone-50 rounded-xl p-3.5 border border-stone-200 space-y-2">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs">
          <p className="text-neutral-600">{periodConfig[selectedPeriod].desc}</p>
          <span className="font-bold text-red-700 whitespace-nowrap">
            {progressPercent.toFixed(0)}% Tercapai
          </span>
        </div>

        <div className="h-2 w-full bg-stone-200 rounded-full overflow-hidden">
          <div
            style={{ width: `${progressPercent}%` }}
            className={`h-full transition-all duration-300 ${
              progressPercent === 100 ? 'bg-amber-500' : 'bg-red-600'
            }`}
          />
        </div>
      </div>

      {/* Add Custom Habit Form */}
      {isAdding && (
        <form
          onSubmit={handleAddSubmit}
          className="bg-amber-50/70 rounded-xl p-4 border border-amber-300 shadow-xs space-y-3 animate-in fade-in duration-150"
        >
          <div className="flex items-center justify-between border-b border-amber-200 pb-2">
            <span className="text-xs font-bold text-amber-950 uppercase tracking-wide">
              Tambah Kebiasaan {periodConfig[selectedPeriod].label} Baru
            </span>
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="text-stone-400 hover:text-stone-600"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-neutral-700 mb-1">
                Judul Kebiasaan <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="Contoh: Bawa botol minum sendiri, cek promo tanpa impulsif checkout"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                required
                className="w-full bg-white border border-stone-300 rounded-lg px-3 py-2 text-xs text-neutral-800 focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">
                Keterangan / Tips Tambahan
              </label>
              <input
                type="text"
                placeholder="Contoh: Menghemat Rp 15.000 per hari untuk dialihkan ke RDN"
                value={newSubtitle}
                onChange={(e) => setNewSubtitle(e.target.value)}
                className="w-full bg-white border border-stone-300 rounded-lg px-3 py-2 text-xs text-neutral-800 focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">
                Label / Tag
              </label>
              <input
                type="text"
                placeholder="Contoh: Hemat, Investasi, Disiplin"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                className="w-full bg-white border border-stone-300 rounded-lg px-3 py-2 text-xs text-neutral-800 focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="px-3 py-1.5 text-xs text-neutral-600 hover:bg-stone-100 rounded-lg border border-stone-300"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-lg shadow-xs"
            >
              Simpan Kebiasaan
            </button>
          </div>
        </form>
      )}

      {/* Checklist Items */}
      <div className="space-y-2.5">
        {periodHabits.length === 0 ? (
          <div className="p-8 text-center text-xs text-neutral-400 bg-stone-50 rounded-xl border border-stone-200">
            Belum ada kebiasaan untuk periode ini. Klik <strong>+ Tambah Habit</strong> di atas!
          </div>
        ) : (
          periodHabits.map((item) => (
            <div
              key={item.id}
              onClick={() => handleToggle(item.id, item.completed)}
              className={`p-3.5 sm:p-4 rounded-xl border transition-all cursor-pointer flex items-start justify-between gap-3 group select-none ${
                item.completed
                  ? 'bg-amber-50/50 border-amber-200'
                  : 'bg-white border-stone-200 hover:border-red-300 hover:shadow-2xs'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="mt-0.5 shrink-0">
                  {item.completed ? (
                    <div className="w-5 h-5 rounded-md bg-red-600 text-white flex items-center justify-center shadow-xs">
                      <CheckCircle2 className="w-3.5 h-3.5 stroke-[3]" />
                    </div>
                  ) : (
                    <div className="w-5 h-5 rounded-md border-2 border-stone-300 group-hover:border-red-500 transition-colors bg-white" />
                  )}
                </div>

                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`text-xs sm:text-sm font-bold ${
                      item.completed ? 'line-through text-neutral-400' : 'text-neutral-900'
                    }`}>
                      {item.title}
                    </span>
                    {item.tag && (
                      <span className="text-[10px] font-semibold px-2 py-0.2 rounded bg-stone-100 text-neutral-600 border border-stone-200">
                        {item.tag}
                      </span>
                    )}
                  </div>

                  {item.subtitle && (
                    <p className={`text-xs mt-0.5 ${
                      item.completed ? 'text-neutral-400' : 'text-neutral-500'
                    }`}>
                      {item.subtitle}
                    </p>
                  )}
                </div>
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteHabit(item.id);
                }}
                className="opacity-20 group-hover:opacity-100 p-1 text-neutral-400 hover:text-red-600 hover:bg-red-50 rounded transition-all shrink-0"
                title="Hapus checklist"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))
        )}
      </div>

      {progressPercent === 100 && totalCount > 0 && (
        <div className="p-3 bg-gradient-to-r from-red-600 via-amber-500 to-red-600 text-white rounded-xl flex items-center justify-center gap-2 text-xs font-bold shadow-xs">
          <Sparkles className="w-4 h-4 text-amber-200" />
          <span>Semua checklist {periodConfig[selectedPeriod].label.toLowerCase()} sudah selesai! Pertahankan kedisiplinan ini.</span>
        </div>
      )}
    </div>
  );
}
