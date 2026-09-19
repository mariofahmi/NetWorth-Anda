import { useState, useMemo } from 'react';
import { 
  TrendingUp, 
  Camera, 
  Calendar, 
  Trash2, 
  Layers, 
  ArrowUpRight, 
  ArrowDownRight,
  Check, 
  Wallet,
  Sparkles,
  Zap,
  Activity
} from 'lucide-react';
import { MonthlyHistoryPoint } from '../types';
import { formatRupiah } from '../utils/formatters';

interface NetWorthTrendChartProps {
  history: MonthlyHistoryPoint[];
  currentAssets: number;
  currentLiabilities: number;
  currentNetWorth: number;
  currentIncome: number;
  currentSavings: number;
  onSaveCurrentSnapshot: () => void;
  onDeleteSnapshot: (id: string) => void;
}

// Spline smoothing helper using cubic Bezier curves
function getCubicBezierPath(points: { x: number; y: number }[]): string {
  if (points.length === 0) return '';
  if (points.length === 1) return `M ${points[0].x} ${points[0].y}`;
  if (points.length === 2) {
    return `M ${points[0].x} ${points[0].y} L ${points[1].x} ${points[1].y}`;
  }

  let d = `M ${points[0].x.toFixed(1)} ${points[0].y.toFixed(1)}`;
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i === 0 ? 0 : i - 1];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[i + 2] || p2;

    const tension = 0.18;
    const cp1x = p1.x + (p2.x - p0.x) * tension;
    const cp1y = p1.y + (p2.y - p0.y) * tension;
    const cp2x = p2.x - (p3.x - p1.x) * tension;
    const cp2y = p2.y - (p3.y - p1.y) * tension;

    d += ` C ${cp1x.toFixed(1)} ${cp1y.toFixed(1)}, ${cp2x.toFixed(1)} ${cp2y.toFixed(1)}, ${p2.x.toFixed(1)} ${p2.y.toFixed(1)}`;
  }
  return d;
}

function getCubicBezierArea(points: { x: number; y: number }[], bottomY: number): string {
  if (points.length === 0) return '';
  const curve = getCubicBezierPath(points);
  const first = points[0];
  const last = points[points.length - 1];
  return `${curve} L ${last.x.toFixed(1)} ${bottomY.toFixed(1)} L ${first.x.toFixed(1)} ${bottomY.toFixed(1)} Z`;
}

export function NetWorthTrendChart({
  history,
  currentAssets,
  currentLiabilities,
  currentNetWorth,
  currentIncome,
  currentSavings,
  onSaveCurrentSnapshot,
  onDeleteSnapshot,
}: NetWorthTrendChartProps) {
  const [activeTab, setActiveTab] = useState<'net_worth' | 'savings' | 'assets_vs_liabilities'>('net_worth');
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [showHistoryTable, setShowHistoryTable] = useState(false);
  const [savedNotification, setSavedNotification] = useState(false);

  const handleSnapshotClick = () => {
    onSaveCurrentSnapshot();
    setSavedNotification(true);
    setTimeout(() => setSavedNotification(false), 3000);
  };

  // Sort history chronologically
  const sortedHistory = useMemo(() => {
    return [...history].sort((a, b) => a.yearMonth.localeCompare(b.yearMonth));
  }, [history]);

  // Chart dimensions & scaling
  const chartWidth = 740;
  const chartHeight = 290;
  const padding = { top: 32, right: 35, bottom: 42, left: 80 };
  const innerWidth = chartWidth - padding.left - padding.right;
  const innerHeight = chartHeight - padding.top - padding.bottom;

  // Compute domain bounds based on activeTab
  const { minVal, maxVal } = useMemo(() => {
    if (sortedHistory.length === 0) return { minVal: 0, maxVal: 100_000_000 };

    let values: number[] = [];
    if (activeTab === 'net_worth') {
      values = sortedHistory.map((h) => h.netWorth);
    } else if (activeTab === 'savings') {
      values = sortedHistory.map((h) => h.monthlySavings);
    } else {
      values = [
        ...sortedHistory.map((h) => h.totalAssets),
        ...sortedHistory.map((h) => h.totalLiabilities),
      ];
    }

    const min = Math.min(...values, 0);
    const max = Math.max(...values, 10_000_000);
    const buffer = (max - min) * 0.14 || 10_000_000;

    return {
      minVal: Math.max(0, min - buffer * 0.4),
      maxVal: max + buffer,
    };
  }, [sortedHistory, activeTab]);

  // Helper to map coordinate
  const getX = (index: number) => {
    if (sortedHistory.length <= 1) return padding.left + innerWidth / 2;
    return padding.left + (index / (sortedHistory.length - 1)) * innerWidth;
  };

  const getY = (val: number) => {
    if (maxVal === minVal) return padding.top + innerHeight / 2;
    const ratio = (val - minVal) / (maxVal - minVal);
    return padding.top + innerHeight - ratio * innerHeight;
  };

  // Pre-computed points for curves
  const netWorthPoints = useMemo(() => {
    return sortedHistory.map((pt, idx) => ({ x: getX(idx), y: getY(pt.netWorth) }));
  }, [sortedHistory, minVal, maxVal]);

  const savingsPoints = useMemo(() => {
    return sortedHistory.map((pt, idx) => ({ x: getX(idx), y: getY(pt.monthlySavings) }));
  }, [sortedHistory, minVal, maxVal]);

  const assetsPoints = useMemo(() => {
    return sortedHistory.map((pt, idx) => ({ x: getX(idx), y: getY(pt.totalAssets) }));
  }, [sortedHistory, minVal, maxVal]);

  const liabilitiesPoints = useMemo(() => {
    return sortedHistory.map((pt, idx) => ({ x: getX(idx), y: getY(pt.totalLiabilities) }));
  }, [sortedHistory, minVal, maxVal]);

  const bottomY = padding.top + innerHeight;

  // Month-over-month growth calculation
  const momGrowth = useMemo(() => {
    if (sortedHistory.length < 2) return null;
    const current = sortedHistory[sortedHistory.length - 1].netWorth;
    const prev = sortedHistory[sortedHistory.length - 2].netWorth;
    const diff = current - prev;
    const pct = prev !== 0 ? (diff / prev) * 100 : 0;
    return { diff, pct };
  }, [sortedHistory]);

  // Total growth calculation since inception
  const totalGrowth = useMemo(() => {
    if (sortedHistory.length < 2) return null;
    const first = sortedHistory[0].netWorth;
    const latest = sortedHistory[sortedHistory.length - 1].netWorth;
    const diff = latest - first;
    const pct = first > 0 ? (diff / first) * 100 : 0;
    return { diff, pct, startMonth: sortedHistory[0].monthLabel };
  }, [sortedHistory]);

  const latestPoint = sortedHistory[sortedHistory.length - 1];

  return (
    <div id="section-trend-chart" className="bg-white rounded-3xl p-6 sm:p-8 shadow-xs border border-stone-200/90 space-y-6 transition-all">
      
      {/* Top Header & Stat Overview Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-stone-100">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-red-600 via-amber-500 to-red-600 flex items-center justify-center text-white shadow-md shadow-red-500/15">
              <TrendingUp className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-xl font-black text-neutral-900 tracking-tight">
                  Grafik Tren Nilai Bersih & Tabungan
                </h3>
                {momGrowth && (
                  <span className={`text-[11px] font-extrabold px-2.5 py-0.5 rounded-full flex items-center gap-1 border shadow-2xs ${
                    momGrowth.diff >= 0 
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-200' 
                      : 'bg-rose-50 text-rose-800 border-rose-200'
                  }`}>
                    {momGrowth.diff >= 0 ? (
                      <ArrowUpRight className="w-3.5 h-3.5 text-emerald-600" />
                    ) : (
                      <ArrowDownRight className="w-3.5 h-3.5 text-rose-600" />
                    )}
                    <span>{momGrowth.diff >= 0 ? '+' : ''}{momGrowth.pct.toFixed(1)}% MoM</span>
                    <span className="text-neutral-400 font-normal">({formatRupiah(momGrowth.diff, true)})</span>
                  </span>
                )}
              </div>
              <p className="text-xs text-neutral-500 mt-0.5">
                Perkembangan akumulasi kekayaan bersih dan tabungan per bulan
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5 self-start lg:self-center">
          <button
            id="btn-save-snapshot"
            onClick={handleSnapshotClick}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white text-xs font-bold rounded-xl shadow-xs hover:shadow-md transition-all cursor-pointer group"
            title="Simpan kondisi aset & utang saat ini sebagai riwayat bulan ini"
          >
            <Camera className="w-3.5 h-3.5 text-amber-200 group-hover:scale-110 transition-transform" />
            <span>Simpan Snapshot Bulan Ini</span>
          </button>

          <button
            onClick={() => setShowHistoryTable(!showHistoryTable)}
            className="px-3 py-2 border border-stone-200 hover:bg-stone-50 hover:border-stone-300 text-neutral-700 text-xs font-semibold rounded-xl transition-all cursor-pointer flex items-center gap-1.5 shadow-2xs"
          >
            <Calendar className="w-3.5 h-3.5 text-neutral-500" />
            <span>{showHistoryTable ? 'Tutup Riwayat' : 'Tabel Riwayat'}</span>
          </button>
        </div>
      </div>

      {savedNotification && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-2xl flex items-center gap-2.5 text-xs font-bold animate-in fade-in duration-200 shadow-xs">
          <div className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0">
            <Check className="w-3 h-3 stroke-[3]" />
          </div>
          <span>Snapshot bulan berjalan berhasil disimpan! Riwayat grafik otomatis diperbarui.</span>
        </div>
      )}

      {/* Modern Financial Metric Highlights Banner */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-gradient-to-br from-stone-50 via-white to-stone-100/60 p-4 rounded-2xl border border-stone-200/80 shadow-2xs">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block">
            Nilai Bersih Terkini
          </span>
          <div className="text-base sm:text-lg font-black text-neutral-900 mt-0.5">
            {formatRupiah(latestPoint?.netWorth || currentNetWorth)}
          </div>
        </div>

        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block">
            Total Pertumbuhan
          </span>
          <div className="text-base sm:text-lg font-black text-emerald-700 mt-0.5 flex items-center gap-0.5">
            <ArrowUpRight className="w-4 h-4" />
            {totalGrowth ? `+${totalGrowth.pct.toFixed(1)}%` : '-'}
          </div>
          {totalGrowth && (
            <span className="text-[10px] text-neutral-500 block">
              +{formatRupiah(totalGrowth.diff, true)} sejak {totalGrowth.startMonth}
            </span>
          )}
        </div>

        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block">
            Tabungan Terakhir
          </span>
          <div className="text-base sm:text-lg font-black text-amber-700 mt-0.5">
            {formatRupiah(latestPoint?.monthlySavings || currentSavings, true)}
          </div>
          <span className="text-[10px] text-neutral-500 block">
            Savings Rate: {latestPoint?.savingsRate || 0}%
          </span>
        </div>

        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block">
            Snapshot Tersimpan
          </span>
          <div className="text-base sm:text-lg font-black text-neutral-800 mt-0.5 flex items-center gap-1.5">
            <Activity className="w-4 h-4 text-red-600" />
            <span>{sortedHistory.length} Bulan</span>
          </div>
          <span className="text-[10px] text-neutral-500 block">
            {sortedHistory[0]?.monthLabel} - {latestPoint?.monthLabel}
          </span>
        </div>
      </div>

      {/* Mode Tabs & Legend Switcher */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-1.5 bg-stone-100/90 p-1.5 rounded-2xl border border-stone-200/60 text-xs font-bold overflow-x-auto max-w-full scrollbar-none">
          <button
            onClick={() => setActiveTab('net_worth')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl transition-all cursor-pointer ${
              activeTab === 'net_worth'
                ? 'bg-gradient-to-r from-red-600 to-amber-600 text-white shadow-xs'
                : 'text-neutral-600 hover:text-neutral-950 hover:bg-white/60'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Tren Nilai Bersih</span>
          </button>

          <button
            onClick={() => setActiveTab('savings')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl transition-all cursor-pointer ${
              activeTab === 'savings'
                ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-neutral-950 shadow-xs'
                : 'text-neutral-600 hover:text-neutral-950 hover:bg-white/60'
            }`}
          >
            <Wallet className="w-3.5 h-3.5" />
            <span>Tabungan per Bulan</span>
          </button>

          <button
            onClick={() => setActiveTab('assets_vs_liabilities')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl transition-all cursor-pointer ${
              activeTab === 'assets_vs_liabilities'
                ? 'bg-neutral-900 text-white shadow-xs'
                : 'text-neutral-600 hover:text-neutral-950 hover:bg-white/60'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Aset vs Utang</span>
          </button>
        </div>

        {/* Legend Indicators */}
        <div className="flex items-center gap-4 text-xs font-semibold">
          {activeTab === 'net_worth' && (
            <div className="flex items-center gap-2 bg-red-50/80 border border-red-200/80 px-3 py-1 rounded-full text-red-900">
              <span className="w-2.5 h-2.5 bg-red-600 rounded-full shadow-xs" />
              <span>Nilai Bersih (Net Worth)</span>
            </div>
          )}
          {activeTab === 'savings' && (
            <div className="flex items-center gap-2 bg-amber-50/80 border border-amber-200/80 px-3 py-1 rounded-full text-amber-900">
              <span className="w-2.5 h-2.5 bg-amber-500 rounded-full shadow-xs" />
              <span>Tabungan Disisihkan Bulanan</span>
            </div>
          )}
          {activeTab === 'assets_vs_liabilities' && (
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full text-emerald-900">
                <span className="w-2.5 h-2.5 bg-emerald-600 rounded-full shadow-xs" />
                <span>Total Aset</span>
              </div>
              <div className="flex items-center gap-2 bg-rose-50 border border-rose-200 px-3 py-1 rounded-full text-rose-900">
                <span className="w-2.5 h-2.5 bg-rose-500 rounded-full shadow-xs" />
                <span>Total Utang</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* SVG Interactive Chart Canvas */}
      <div className="relative overflow-x-auto bg-gradient-to-b from-stone-50/70 via-white to-stone-50/40 rounded-3xl p-3 sm:p-5 border border-stone-200/90 shadow-inner">
        <svg
          viewBox={`0 0 ${chartWidth} ${chartHeight}`}
          className="w-full h-auto min-w-[580px] overflow-visible"
        >
          <defs>
            {/* Luminous Glow Filter */}
            <filter id="glowEffect" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="3" stdDeviation="4" floodColor="#dc2626" floodOpacity="0.25" />
            </filter>
            <filter id="amberGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="3" stdDeviation="4" floodColor="#f59e0b" floodOpacity="0.3" />
            </filter>
            <filter id="emeraldGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="3" stdDeviation="4" floodColor="#10b981" floodOpacity="0.3" />
            </filter>

            {/* Gradients */}
            <linearGradient id="netWorthArea" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#ef4444" stopOpacity="0.28" />
              <stop offset="60%" stopColor="#f97316" stopOpacity="0.10" />
              <stop offset="100%" stopColor="#ef4444" stopOpacity="0.00" />
            </linearGradient>

            <linearGradient id="netWorthStroke" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#dc2626" />
              <stop offset="50%" stopColor="#ea580c" />
              <stop offset="100%" stopColor="#e11d48" />
            </linearGradient>

            <linearGradient id="savingsArea" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.32" />
              <stop offset="60%" stopColor="#fbbf24" stopOpacity="0.08" />
              <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.00" />
            </linearGradient>

            <linearGradient id="assetsArea" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#10b981" stopOpacity="0.22" />
              <stop offset="100%" stopColor="#10b981" stopOpacity="0.00" />
            </linearGradient>

            <linearGradient id="liabilitiesArea" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#f43f5e" stopOpacity="0.18" />
              <stop offset="100%" stopColor="#f43f5e" stopOpacity="0.00" />
            </linearGradient>
          </defs>

          {/* Horizontal Grid lines & Soft Pill Y-Axis Labels */}
          {[0, 0.25, 0.5, 0.75, 1].map((ratio) => {
            const val = minVal + ratio * (maxVal - minVal);
            const y = getY(val);
            return (
              <g key={ratio}>
                <line
                  x1={padding.left}
                  y1={y}
                  x2={chartWidth - padding.right}
                  y2={y}
                  stroke="#e2e8f0"
                  strokeDasharray="4 6"
                  strokeWidth="1.2"
                />
                <text
                  x={padding.left - 10}
                  y={y + 3.5}
                  textAnchor="end"
                  fontSize="10.5"
                  fill="#64748b"
                  fontWeight="600"
                  fontFamily="sans-serif"
                >
                  {formatRupiah(val, true)}
                </text>
              </g>
            );
          })}

          {/* Curves & Area Fills */}
          {activeTab === 'net_worth' && (
            <>
              {/* Smooth Area Fill */}
              <path
                d={getCubicBezierArea(netWorthPoints, bottomY)}
                fill="url(#netWorthArea)"
              />
              {/* Smooth Spline Line */}
              <path
                d={getCubicBezierPath(netWorthPoints)}
                fill="none"
                stroke="url(#netWorthStroke)"
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
                filter="url(#glowEffect)"
              />
            </>
          )}

          {activeTab === 'savings' && (
            <>
              <path
                d={getCubicBezierArea(savingsPoints, bottomY)}
                fill="url(#savingsArea)"
              />
              <path
                d={getCubicBezierPath(savingsPoints)}
                fill="none"
                stroke="#d97706"
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
                filter="url(#amberGlow)"
              />
            </>
          )}

          {activeTab === 'assets_vs_liabilities' && (
            <>
              {/* Assets Area & Curve */}
              <path
                d={getCubicBezierArea(assetsPoints, bottomY)}
                fill="url(#assetsArea)"
              />
              <path
                d={getCubicBezierPath(assetsPoints)}
                fill="none"
                stroke="#059669"
                strokeWidth="3.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                filter="url(#emeraldGlow)"
              />

              {/* Liabilities Area & Curve */}
              <path
                d={getCubicBezierArea(liabilitiesPoints, bottomY)}
                fill="url(#liabilitiesArea)"
              />
              <path
                d={getCubicBezierPath(liabilitiesPoints)}
                fill="none"
                stroke="#e11d48"
                strokeWidth="3.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </>
          )}

          {/* Dynamic Radar Pulse on the Latest Point (Active Indicator) */}
          {sortedHistory.length > 0 && (
            (() => {
              const lastIdx = sortedHistory.length - 1;
              const lastX = getX(lastIdx);
              let lastY = getY(sortedHistory[lastIdx].netWorth);
              let pulseColor = '#ef4444';

              if (activeTab === 'savings') {
                lastY = getY(sortedHistory[lastIdx].monthlySavings);
                pulseColor = '#f59e0b';
              } else if (activeTab === 'assets_vs_liabilities') {
                lastY = getY(sortedHistory[lastIdx].totalAssets);
                pulseColor = '#10b981';
              }

              return (
                <g pointerEvents="none">
                  <circle
                    cx={lastX}
                    cy={lastY}
                    r="12"
                    fill={pulseColor}
                    opacity="0.25"
                    className="animate-ping"
                  />
                  <circle
                    cx={lastX}
                    cy={lastY}
                    r="6.5"
                    fill={pulseColor}
                    stroke="#ffffff"
                    strokeWidth="2.5"
                    className="shadow-md"
                  />
                </g>
              );
            })()
          )}

          {/* Interactive Data Points & Hover Targets */}
          {sortedHistory.map((pt, idx) => {
            const x = getX(idx);
            let y = getY(pt.netWorth);
            if (activeTab === 'savings') y = getY(pt.monthlySavings);
            if (activeTab === 'assets_vs_liabilities') y = getY(pt.totalAssets);

            const isHovered = hoveredIndex === idx;
            const isLast = idx === sortedHistory.length - 1;

            return (
              <g
                key={pt.id}
                onClick={() => setHoveredIndex(hoveredIndex === idx ? null : idx)}
                onMouseEnter={() => setHoveredIndex(idx)}
                onMouseLeave={() => setHoveredIndex(null)}
                className="cursor-pointer group"
              >
                {/* Vertical Hover Crosshair Line */}
                {isHovered && (
                  <line
                    x1={x}
                    y1={padding.top}
                    x2={x}
                    y2={padding.top + innerHeight}
                    stroke="#94a3b8"
                    strokeWidth="1.5"
                    strokeDasharray="3 3"
                  />
                )}

                {/* Invisible large hover hit area */}
                <rect
                  x={x - 18}
                  y={padding.top}
                  width="36"
                  height={innerHeight + 25}
                  fill="transparent"
                />

                {/* Visible Data Dot */}
                {!isLast && (
                  <circle
                    cx={x}
                    cy={y}
                    r={isHovered ? 6.5 : 4.5}
                    fill={isHovered ? (activeTab === 'savings' ? '#d97706' : '#dc2626') : '#ffffff'}
                    stroke={activeTab === 'savings' ? '#f59e0b' : activeTab === 'assets_vs_liabilities' ? '#059669' : '#dc2626'}
                    strokeWidth="2.5"
                    className="transition-all duration-150"
                  />
                )}

                {/* X-Axis Month Tag */}
                <text
                  x={x}
                  y={padding.top + innerHeight + 22}
                  textAnchor="middle"
                  fontSize="11.5"
                  fill={isHovered ? '#0f172a' : '#64748b'}
                  fontWeight={isHovered ? '800' : '600'}
                  className="transition-colors"
                >
                  {pt.monthLabel}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Floating Glassmorphism Tooltip Card */}
        {hoveredIndex !== null && sortedHistory[hoveredIndex] && (
          <div 
            className="absolute top-4 right-4 sm:top-5 sm:right-6 bg-neutral-900/95 backdrop-blur-md text-white rounded-2xl p-4 shadow-2xl text-xs space-y-2 z-20 border border-neutral-700 min-w-[210px] pointer-events-none animate-in fade-in zoom-in-95 duration-150"
          >
            <div className="font-black text-sm text-neutral-100 border-b border-neutral-800 pb-1.5 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-amber-400" />
                {sortedHistory[hoveredIndex].monthLabel}
              </span>
              <span className="text-[10px] bg-amber-400/20 text-amber-300 font-extrabold px-2 py-0.5 rounded-full border border-amber-400/30">
                SR: {sortedHistory[hoveredIndex].savingsRate}%
              </span>
            </div>

            <div className="flex items-center justify-between pt-0.5">
              <span className="text-neutral-400">Nilai Bersih:</span>
              <span className="font-extrabold text-sm text-red-400">
                {formatRupiah(sortedHistory[hoveredIndex].netWorth)}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-neutral-400">Tabungan Bulan Ini:</span>
              <span className="font-bold text-amber-300">
                {formatRupiah(sortedHistory[hoveredIndex].monthlySavings)}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-[11px] text-neutral-300 pt-1.5 border-t border-neutral-800/80">
              <div>
                <span className="text-[10px] text-neutral-500 block">Total Aset:</span>
                <span className="font-bold text-emerald-400">
                  {formatRupiah(sortedHistory[hoveredIndex].totalAssets, true)}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-neutral-500 block">Total Utang:</span>
                <span className="font-bold text-rose-400">
                  {formatRupiah(sortedHistory[hoveredIndex].totalLiabilities, true)}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Mobile Touch / Swipe Guidance */}
      <div className="sm:hidden -mt-2 flex items-center justify-center gap-1.5 text-[11px] text-neutral-500 font-medium">
        <span>👈 Geser grafik ke kiri/kanan untuk riwayat lengkap 👉</span>
      </div>

      {/* Snapshot History Table Drawer */}
      {showHistoryTable && (
        <div className="bg-stone-50/90 rounded-2xl p-5 border border-stone-200 space-y-4 animate-in fade-in duration-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-red-600" />
              <h4 className="text-xs font-black text-neutral-800 uppercase tracking-wider">
                Daftar Riwayat Snapshot Bulanan ({sortedHistory.length} Data)
              </h4>
            </div>
            <button
              onClick={() => setShowHistoryTable(false)}
              className="text-xs font-bold text-neutral-500 hover:text-neutral-900 cursor-pointer"
            >
              Tutup Tabel
            </button>
          </div>

          <div className="overflow-x-auto rounded-xl border border-stone-200 bg-white">
            <table className="w-full text-xs text-left">
              <thead className="bg-stone-100 text-neutral-700 font-extrabold border-b border-stone-200">
                <tr>
                  <th className="p-3">Bulan</th>
                  <th className="p-3">Total Aset</th>
                  <th className="p-3">Total Utang</th>
                  <th className="p-3">Nilai Bersih</th>
                  <th className="p-3">Tabungan Disisihkan</th>
                  <th className="p-3">Savings Rate</th>
                  <th className="p-3 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-200">
                {sortedHistory.map((item) => (
                  <tr key={item.id} className="hover:bg-stone-50/80 transition-colors">
                    <td className="p-3 font-extrabold text-neutral-900">{item.monthLabel}</td>
                    <td className="p-3 text-emerald-800 font-bold">{formatRupiah(item.totalAssets)}</td>
                    <td className="p-3 text-rose-700 font-semibold">{formatRupiah(item.totalLiabilities)}</td>
                    <td className="p-3 font-black text-neutral-900">{formatRupiah(item.netWorth)}</td>
                    <td className="p-3 font-bold text-amber-700">{formatRupiah(item.monthlySavings)}</td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 font-extrabold text-[11px]">
                        {item.savingsRate}%
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      {sortedHistory.length > 2 && (
                        <button
                          onClick={() => onDeleteSnapshot(item.id)}
                          className="text-neutral-400 hover:text-rose-600 p-1.5 rounded-lg hover:bg-rose-50 transition-colors cursor-pointer"
                          title="Hapus Catatan Ini"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
}
