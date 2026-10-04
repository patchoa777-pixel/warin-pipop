import React from 'react';
import { Search, LayoutGrid, Table, ArrowUpDown, X } from 'lucide-react';
import { RepairItem, RepairStatus } from '../types/repair';

interface FilterBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedStatus: string;
  onStatusChange: (status: string) => void;
  selectedBrand: string;
  onBrandChange: (brand: string) => void;
  sortBy: 'date-desc' | 'date-asc' | 'cost-desc' | 'cost-asc';
  onSortChange: (sort: 'date-desc' | 'date-asc' | 'cost-desc' | 'cost-asc') => void;
  viewMode: 'grid' | 'table';
  onViewModeChange: (mode: 'grid' | 'table') => void;
  repairs: RepairItem[];
}

export const FilterBar: React.FC<FilterBarProps> = ({
  searchQuery,
  onSearchChange,
  selectedStatus,
  onStatusChange,
  selectedBrand,
  onBrandChange,
  sortBy,
  onSortChange,
  viewMode,
  onViewModeChange,
  repairs,
}) => {
  const statusOptions: Array<'ทั้งหมด' | RepairStatus> = [
    'ทั้งหมด',
    'กำลังซ่อม',
    'รออะไหล่',
    'ซ่อมเสร็จแล้ว',
    'ส่งมอบแล้ว',
  ];

  // Extract unique brands
  const brands = Array.from(new Set(repairs.map((r) => r.brand.trim()))).filter(Boolean);

  const getStatusCount = (status: string) => {
    if (status === 'ทั้งหมด') return repairs.length;
    return repairs.filter((r) => r.status === status).length;
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-4 mb-6 shadow-xs space-y-3.5">
      {/* Search Input Row */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="ค้นหาด้วย เลขใบรับซ่อม (REC-), ชื่อลูกค้า, เบอร์โทร, ยี่ห้อ หรือ รุ่น..."
            className="w-full pl-10 pr-9 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 focus:bg-white transition-all text-slate-900 placeholder:text-slate-400"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Brand & Sort Controls */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          {brands.length > 0 && (
            <select
              value={selectedBrand}
              onChange={(e) => onBrandChange(e.target.value)}
              className="text-xs font-medium py-2 px-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 focus:outline-none focus:border-indigo-600 cursor-pointer"
            >
              <option value="ทั้งหมด">ทุกยี่ห้อ ({repairs.length})</option>
              {brands.map((b) => (
                <option key={b} value={b}>
                  {b} ({repairs.filter((r) => r.brand.toLowerCase() === b.toLowerCase()).length})
                </option>
              ))}
            </select>
          )}

          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value as any)}
              className="text-xs font-medium py-2 pl-7 pr-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 focus:outline-none focus:border-indigo-600 cursor-pointer"
            >
              <option value="date-desc">ล่าสุดก่อน</option>
              <option value="date-asc">เก่าสุดก่อน</option>
              <option value="cost-desc">ราคาสูงสุด</option>
              <option value="cost-asc">ราคาต่ำสุด</option>
            </select>
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* View toggle (Grid / Table) */}
          <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200">
            <button
              onClick={() => onViewModeChange('grid')}
              title="มุมมองการ์ด (Card View)"
              className={`p-1.5 rounded-md transition-colors ${
                viewMode === 'grid'
                  ? 'bg-white text-indigo-700 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => onViewModeChange('table')}
              title="มุมมองตาราง (Table View)"
              className={`p-1.5 rounded-md transition-colors ${
                viewMode === 'table'
                  ? 'bg-white text-indigo-700 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <Table className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Segmented Status Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pt-1 pb-1 border-t border-slate-100">
        <span className="text-xs font-medium text-slate-400 mr-1 shrink-0">สถานะ:</span>
        {statusOptions.map((status) => {
          const isSelected = selectedStatus === status;
          const count = getStatusCount(status);
          
          let colorTheme = 'hover:bg-slate-100 text-slate-600';
          if (isSelected) {
            if (status === 'กำลังซ่อม') colorTheme = 'bg-amber-500 text-white font-semibold';
            else if (status === 'รออะไหล่') colorTheme = 'bg-rose-500 text-white font-semibold';
            else if (status === 'ซ่อมเสร็จแล้ว') colorTheme = 'bg-emerald-600 text-white font-semibold';
            else if (status === 'ส่งมอบแล้ว') colorTheme = 'bg-blue-600 text-white font-semibold';
            else colorTheme = 'bg-indigo-600 text-white font-semibold';
          }

          return (
            <button
              key={status}
              onClick={() => onStatusChange(status)}
              className={`px-3 py-1.5 rounded-lg text-xs transition-all flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer ${
                isSelected ? colorTheme : 'bg-slate-100/80 text-slate-600 hover:bg-slate-200/80'
              }`}
            >
              <span>{status}</span>
              <span
                className={`text-[11px] px-1.5 py-0.2 rounded-full tabular-nums font-mono ${
                  isSelected
                    ? 'bg-white/25 text-white'
                    : 'bg-white text-slate-600 shadow-2xs'
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
