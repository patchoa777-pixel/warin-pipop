import React from 'react';
import { Smartphone, BarChart3, Plus, Settings } from 'lucide-react';

interface TopNavProps {
  onOpenAddModal: () => void;
  onOpenReportModal: () => void;
  onOpenShopSettings: () => void;
  totalJobs: number;
}

export const TopNav: React.FC<TopNavProps> = ({
  onOpenAddModal,
  onOpenReportModal,
  onOpenShopSettings,
  totalJobs,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200 transition-shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Zone 1: Single text element wordmark */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-sm shadow-indigo-200">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold tracking-tight text-slate-900">
                  ระบบร้านซ่อมมือถือ Pro
                </span>
                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-100">
                  {totalJobs} รายการ
                </span>
              </div>
            </div>
          </div>

          {/* Zone 2: Navigation Links */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
            <a href="#repair-list" className="text-indigo-600 font-semibold transition-colors">
              รายการงานซ่อม
            </a>
            <button
              onClick={onOpenReportModal}
              className="hover:text-slate-900 transition-colors cursor-pointer"
            >
              รายงานสรุปยอด
            </button>
            <button
              onClick={onOpenShopSettings}
              className="hover:text-slate-900 transition-colors cursor-pointer"
            >
              ตั้งค่าร้านค้า
            </button>
          </nav>

          {/* Zone 3: Primary Actions */}
          <div className="flex items-center gap-2.5">
            <button
              onClick={onOpenShopSettings}
              title="ตั้งค่าข้อมูลร้านค้า"
              className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors md:hidden"
            >
              <Settings className="w-5 h-5" />
            </button>
            <button
              onClick={onOpenReportModal}
              className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors shadow-xs cursor-pointer whitespace-nowrap"
            >
              <BarChart3 className="w-4 h-4 text-indigo-600" />
              <span>สรุปยอดร้าน</span>
            </button>
            <button
              onClick={onOpenAddModal}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 active:bg-indigo-800 transition-colors shadow-sm shadow-indigo-200 cursor-pointer whitespace-nowrap"
            >
              <Plus className="w-4 h-4" />
              <span>รับเครื่องซ่อมใหม่</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
