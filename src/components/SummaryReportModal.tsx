import React from 'react';
import { X, BarChart3, Download, TrendingUp, Layers, CheckCircle2, Clock } from 'lucide-react';
import { RepairItem } from '../types/repair';
import { formatCurrency, formatThaiDate } from '../utils/thaiFormat';

interface SummaryReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  repairs: RepairItem[];
}

export const SummaryReportModal: React.FC<SummaryReportModalProps> = ({
  isOpen,
  onClose,
  repairs,
}) => {
  if (!isOpen) return null;

  const totalJobs = repairs.length;
  const totalRevenue = repairs.reduce((sum, r) => sum + (r.sparePartCost + r.laborCost), 0);
  const totalPartsCost = repairs.reduce((sum, r) => sum + r.sparePartCost, 0);
  const totalLaborIncome = repairs.reduce((sum, r) => sum + r.laborCost, 0);

  // Status breakdown
  const statusStats = [
    {
      status: 'กำลังซ่อม',
      count: repairs.filter((r) => r.status === 'กำลังซ่อม').length,
      revenue: repairs
        .filter((r) => r.status === 'กำลังซ่อม')
        .reduce((sum, r) => sum + (r.sparePartCost + r.laborCost), 0),
      color: 'bg-amber-500',
      badge: 'bg-amber-50 text-amber-700 border-amber-200',
    },
    {
      status: 'รออะไหล่',
      count: repairs.filter((r) => r.status === 'รออะไหล่').length,
      revenue: repairs
        .filter((r) => r.status === 'รออะไหล่')
        .reduce((sum, r) => sum + (r.sparePartCost + r.laborCost), 0),
      color: 'bg-rose-500',
      badge: 'bg-rose-50 text-rose-700 border-rose-200',
    },
    {
      status: 'ซ่อมเสร็จแล้ว',
      count: repairs.filter((r) => r.status === 'ซ่อมเสร็จแล้ว').length,
      revenue: repairs
        .filter((r) => r.status === 'ซ่อมเสร็จแล้ว')
        .reduce((sum, r) => sum + (r.sparePartCost + r.laborCost), 0),
      color: 'bg-emerald-500',
      badge: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    },
    {
      status: 'ส่งมอบแล้ว',
      count: repairs.filter((r) => r.status === 'ส่งมอบแล้ว').length,
      revenue: repairs
        .filter((r) => r.status === 'ส่งมอบแล้ว')
        .reduce((sum, r) => sum + (r.sparePartCost + r.laborCost), 0),
      color: 'bg-blue-500',
      badge: 'bg-blue-50 text-blue-700 border-blue-200',
    },
  ];

  // Brand breakdown
  const brandMap: Record<string, { count: number; total: number }> = {};
  repairs.forEach((r) => {
    const b = r.brand.trim() || 'อื่นๆ';
    if (!brandMap[b]) {
      brandMap[b] = { count: 0, total: 0 };
    }
    brandMap[b].count += 1;
    brandMap[b].total += r.sparePartCost + r.laborCost;
  });

  const brandStats = Object.entries(brandMap).sort((a, b) => b[1].count - a[1].count);

  // Export CSV
  const handleExportCSV = () => {
    const headers = [
      'เลขที่ใบรับ',
      'วันที่รับเครื่อง',
      'ชื่อลูกค้า',
      'เบอร์โทร',
      'ยี่ห้อ',
      'รุ่น',
      'อาการเสีย',
      'ค่าอะไหล่ (บาท)',
      'ค่าแรง (บาท)',
      'ราคารวม (บาท)',
      'ระยะเวลารับประกัน',
      'สถานะ',
      'ช่างผู้รับผิดชอบ',
    ];

    const rows = repairs.map((r) => [
      `"${r.id}"`,
      `"${formatThaiDate(r.receiveDate)}"`,
      `"${r.customerName.replace(/"/g, '""')}"`,
      `"${r.phone}"`,
      `"${r.brand}"`,
      `"${r.model.replace(/"/g, '""')}"`,
      `"${r.symptom.replace(/"/g, '""')}"`,
      r.sparePartCost,
      r.laborCost,
      r.sparePartCost + r.laborCost,
      `"${r.warranty}"`,
      `"${r.status}"`,
      `"${r.technicianName || ''}"`,
    ]);

    const csvContent =
      '\uFEFF' + [headers.join(','), ...rows.map((row) => row.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `รายงานร้านซ่อมมือถือ_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl my-6 border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 bg-indigo-700 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            <div>
              <h2 className="text-lg font-bold">📊 สรุปภาพรวมและรายได้ร้านค้า</h2>
              <p className="text-xs text-indigo-100">สถิติงานซ่อมและรายรับสุทธิ</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-indigo-200 hover:text-white hover:bg-indigo-600 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs text-slate-700">
          {/* Top Metric Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
              <span className="text-[11px] text-slate-500 font-medium block mb-1">
                จำนวนงานซ่อมทั้งหมด
              </span>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-bold font-mono tabular-nums text-slate-900">
                  {totalJobs}
                </span>
                <span className="text-xs text-slate-500">เครื่อง</span>
              </div>
            </div>

            <div className="bg-indigo-50/70 p-3.5 rounded-xl border border-indigo-100">
              <span className="text-[11px] text-indigo-600 font-medium block mb-1">
                มูลค่างานซ่อมรวมสุทธิ
              </span>
              <div className="flex items-baseline gap-1">
                <span className="text-xl font-bold font-mono tabular-nums text-indigo-900">
                  {formatCurrency(totalRevenue)}
                </span>
                <span className="text-xs text-indigo-700">บาท</span>
              </div>
            </div>

            <div className="bg-emerald-50/70 p-3.5 rounded-xl border border-emerald-100">
              <span className="text-[11px] text-emerald-700 font-medium block mb-1">
                กำไรค่าแรงช่าง (Gross)
              </span>
              <div className="flex items-baseline gap-1">
                <span className="text-xl font-bold font-mono tabular-nums text-emerald-900">
                  {formatCurrency(totalLaborIncome)}
                </span>
                <span className="text-xs text-emerald-700">บาท</span>
              </div>
            </div>

            <div className="bg-amber-50/70 p-3.5 rounded-xl border border-amber-100">
              <span className="text-[11px] text-amber-700 font-medium block mb-1">
                ต้นทุนค่าอะไหล่
              </span>
              <div className="flex items-baseline gap-1">
                <span className="text-xl font-bold font-mono tabular-nums text-amber-900">
                  {formatCurrency(totalPartsCost)}
                </span>
                <span className="text-xs text-amber-700">บาท</span>
              </div>
            </div>
          </div>

          {/* Status Breakdown */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
            <h3 className="font-bold text-slate-800 text-sm mb-3 flex items-center justify-between">
              <span>สถานะงานซ่อมปัจจุบัน</span>
              <span className="text-xs font-normal text-slate-500">รวม {totalJobs} เครื่อง</span>
            </h3>

            <div className="space-y-3">
              {statusStats.map((st) => {
                const percent = totalJobs > 0 ? (st.count / totalJobs) * 100 : 0;
                return (
                  <div key={st.status} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-0.5 rounded text-[11px] font-semibold border ${st.badge}`}>
                          {st.status}
                        </span>
                        <span className="text-slate-600 font-mono font-medium">
                          {st.count} เครื่อง ({percent.toFixed(0)}%)
                        </span>
                      </div>
                      <span className="font-mono tabular-nums font-semibold text-slate-800">
                        {formatCurrency(st.revenue)} บาท
                      </span>
                    </div>
                    {/* Progress Bar */}
                    <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${st.color} transition-all duration-300`}
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Popular Brands Breakdown */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
            <h3 className="font-bold text-slate-800 text-sm mb-3">
              แบรนด์มือถือที่นำมาซ่อมมากที่สุด
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {brandStats.map(([brand, data]) => (
                <div
                  key={brand}
                  className="bg-white p-2.5 rounded-lg border border-slate-200 text-center"
                >
                  <span className="font-bold text-slate-900 block text-xs">{brand}</span>
                  <span className="text-indigo-600 font-mono font-semibold text-sm">
                    {data.count}
                  </span>
                  <span className="text-slate-500 text-[10px] ml-1">เครื่อง</span>
                  <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                    {formatCurrency(data.total)} ฿
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-3.5 bg-slate-100 border-t border-slate-200 flex items-center justify-between shrink-0">
          <button
            onClick={handleExportCSV}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 transition-colors cursor-pointer shadow-2xs"
          >
            <Download className="w-3.5 h-3.5 text-indigo-600" />
            <span>ส่งออกรายงาน (CSV)</span>
          </button>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-900 text-white transition-colors cursor-pointer"
          >
            ปิดหน้าต่าง
          </button>
        </div>
      </div>
    </div>
  );
};
