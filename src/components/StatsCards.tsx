import React from 'react';
import { Wrench, Clock, CheckCircle2, DollarSign, PackageCheck } from 'lucide-react';
import { RepairItem } from '../types/repair';
import { formatCurrency } from '../utils/thaiFormat';

interface StatsCardsProps {
  repairs: RepairItem[];
  activeFilter: string;
  onSelectFilter: (status: string) => void;
}

export const StatsCards: React.FC<StatsCardsProps> = ({
  repairs,
  activeFilter,
  onSelectFilter,
}) => {
  const totalCount = repairs.length;
  const inProgressCount = repairs.filter((r) => r.status === 'กำลังซ่อม').length;
  const waitingPartsCount = repairs.filter((r) => r.status === 'รออะไหล่').length;
  const completedCount = repairs.filter((r) => r.status === 'ซ่อมเสร็จแล้ว').length;
  const deliveredCount = repairs.filter((r) => r.status === 'ส่งมอบแล้ว').length;

  const totalRevenue = repairs.reduce(
    (sum, r) => sum + (r.sparePartCost + r.laborCost),
    0
  );

  return (
    <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4 mb-6">
      {/* Total Card */}
      <button
        onClick={() => onSelectFilter('ทั้งหมด')}
        className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
          activeFilter === 'ทั้งหมด'
            ? 'bg-slate-900 text-white border-slate-900 shadow-md ring-2 ring-indigo-500/30'
            : 'bg-white text-slate-800 border-slate-200 hover:border-slate-300 hover:bg-slate-50/70 shadow-xs'
        }`}
      >
        <div className="flex items-center justify-between mb-2">
          <span className={`text-xs font-medium ${activeFilter === 'ทั้งหมด' ? 'text-slate-300' : 'text-slate-500'}`}>
            งานซ่อมทั้งหมด
          </span>
          <Wrench className={`w-4 h-4 ${activeFilter === 'ทั้งหมด' ? 'text-slate-300' : 'text-slate-400'}`} />
        </div>
        <div className="flex items-baseline gap-1">
          <span className="text-2xl font-bold font-mono tabular-nums">{totalCount}</span>
          <span className={`text-xs ${activeFilter === 'ทั้งหมด' ? 'text-slate-400' : 'text-slate-500'}`}>เครื่อง</span>
        </div>
      </button>

      {/* In Progress Card */}
      <button
        onClick={() => onSelectFilter('กำลังซ่อม')}
        className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
          activeFilter === 'กำลังซ่อม'
            ? 'bg-amber-600 text-white border-amber-600 shadow-md ring-2 ring-amber-500/30'
            : 'bg-white text-slate-800 border-slate-200 hover:border-amber-200 hover:bg-amber-50/30 shadow-xs'
        }`}
      >
        <div className="flex items-center justify-between mb-2">
          <span className={`text-xs font-medium ${activeFilter === 'กำลังซ่อม' ? 'text-amber-100' : 'text-slate-500'}`}>
            กำลังซ่อม
          </span>
          <Clock className={`w-4 h-4 ${activeFilter === 'กำลังซ่อม' ? 'text-amber-200' : 'text-amber-500'}`} />
        </div>
        <div className="flex items-baseline gap-1">
          <span className="text-2xl font-bold font-mono tabular-nums text-amber-600 group-hover:text-amber-700">
            <span className={activeFilter === 'กำลังซ่อม' ? 'text-white' : 'text-amber-600'}>
              {inProgressCount}
            </span>
          </span>
          <span className={`text-xs ${activeFilter === 'กำลังซ่อม' ? 'text-amber-100' : 'text-slate-500'}`}>เครื่อง</span>
        </div>
      </button>

      {/* Waiting for Parts Card */}
      <button
        onClick={() => onSelectFilter('รออะไหล่')}
        className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
          activeFilter === 'รออะไหล่'
            ? 'bg-rose-600 text-white border-rose-600 shadow-md ring-2 ring-rose-500/30'
            : 'bg-white text-slate-800 border-slate-200 hover:border-rose-200 hover:bg-rose-50/30 shadow-xs'
        }`}
      >
        <div className="flex items-center justify-between mb-2">
          <span className={`text-xs font-medium ${activeFilter === 'รออะไหล่' ? 'text-rose-100' : 'text-slate-500'}`}>
            รออะไหล่
          </span>
          <Clock className={`w-4 h-4 ${activeFilter === 'รออะไหล่' ? 'text-rose-200' : 'text-rose-500'}`} />
        </div>
        <div className="flex items-baseline gap-1">
          <span className="text-2xl font-bold font-mono tabular-nums">
            <span className={activeFilter === 'รออะไหล่' ? 'text-white' : 'text-rose-600'}>
              {waitingPartsCount}
            </span>
          </span>
          <span className={`text-xs ${activeFilter === 'รออะไหล่' ? 'text-rose-100' : 'text-slate-500'}`}>เครื่อง</span>
        </div>
      </button>

      {/* Finished Card */}
      <button
        onClick={() => onSelectFilter('ซ่อมเสร็จแล้ว')}
        className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
          activeFilter === 'ซ่อมเสร็จแล้ว'
            ? 'bg-emerald-600 text-white border-emerald-600 shadow-md ring-2 ring-emerald-500/30'
            : 'bg-white text-slate-800 border-slate-200 hover:border-emerald-200 hover:bg-emerald-50/30 shadow-xs'
        }`}
      >
        <div className="flex items-center justify-between mb-2">
          <span className={`text-xs font-medium ${activeFilter === 'ซ่อมเสร็จแล้ว' ? 'text-emerald-100' : 'text-slate-500'}`}>
            ซ่อมเสร็จแล้ว
          </span>
          <CheckCircle2 className={`w-4 h-4 ${activeFilter === 'ซ่อมเสร็จแล้ว' ? 'text-emerald-200' : 'text-emerald-600'}`} />
        </div>
        <div className="flex items-baseline gap-1">
          <span className="text-2xl font-bold font-mono tabular-nums">
            <span className={activeFilter === 'ซ่อมเสร็จแล้ว' ? 'text-white' : 'text-emerald-600'}>
              {completedCount}
            </span>
          </span>
          <span className={`text-xs ${activeFilter === 'ซ่อมเสร็จแล้ว' ? 'text-emerald-100' : 'text-slate-500'}`}>พร้อมรับ</span>
        </div>
      </button>

      {/* Total Revenue Card */}
      <div className="col-span-2 lg:col-span-1 p-4 rounded-xl border border-slate-200 bg-linear-to-br from-indigo-50/50 to-white shadow-xs">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium text-slate-500">มูลค่างานรวม</span>
          <DollarSign className="w-4 h-4 text-indigo-600" />
        </div>
        <div className="flex items-baseline gap-1">
          <span className="text-2xl font-bold font-mono tabular-nums text-indigo-700">
            {formatCurrency(totalRevenue)}
          </span>
          <span className="text-xs font-medium text-slate-500">บาท</span>
        </div>
      </div>
    </div>
  );
};
