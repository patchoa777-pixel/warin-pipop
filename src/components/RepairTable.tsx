import React from 'react';
import { Printer, MessageSquare, Edit2, Trash2, Phone, Copy } from 'lucide-react';
import { RepairItem, RepairStatus } from '../types/repair';
import { formatCurrency, formatThaiDate, formatThaiPhone } from '../utils/thaiFormat';

interface RepairTableProps {
  repairs: RepairItem[];
  onEdit: (repair: RepairItem) => void;
  onDelete: (id: string) => void;
  onPrint: (repair: RepairItem) => void;
  onContact: (repair: RepairItem) => void;
  onStatusChange: (id: string, status: RepairStatus) => void;
}

export const RepairTable: React.FC<RepairTableProps> = ({
  repairs,
  onEdit,
  onDelete,
  onPrint,
  onContact,
  onStatusChange,
}) => {
  const getStatusBadge = (status: RepairStatus) => {
    switch (status) {
      case 'กำลังซ่อม':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'รออะไหล่':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      case 'ซ่อมเสร็จแล้ว':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'ส่งมอบแล้ว':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  const allStatuses: RepairStatus[] = ['กำลังซ่อม', 'รออะไหล่', 'ซ่อมเสร็จแล้ว', 'ส่งมอบแล้ว'];

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-slate-600">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-semibold text-[11px]">
            <tr>
              <th className="py-3 px-4">เลขที่ใบรับ</th>
              <th className="py-3 px-4">ลูกค้า / เบอร์โทร</th>
              <th className="py-3 px-4">อุปกรณ์ (ยี่ห้อ/รุ่น)</th>
              <th className="py-3 px-4 max-w-xs">อาการเสีย</th>
              <th className="py-3 px-4 text-right">ค่าอะไหล่</th>
              <th className="py-3 px-4 text-right">ค่าแรง</th>
              <th className="py-3 px-4 text-right">ราคารวม</th>
              <th className="py-3 px-4 text-center">ประกัน</th>
              <th className="py-3 px-4">สถานะ</th>
              <th className="py-3 px-4 text-center">จัดการ</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {repairs.map((repair) => {
              const totalCost = repair.sparePartCost + repair.laborCost;
              return (
                <tr
                  key={repair.id}
                  className="hover:bg-slate-50/80 transition-colors group"
                >
                  {/* ID */}
                  <td className="py-3.5 px-4 font-mono font-medium text-indigo-700 whitespace-nowrap">
                    <div>{repair.id}</div>
                    <div className="text-[10px] text-slate-400 font-sans">
                      {formatThaiDate(repair.receiveDate)}
                    </div>
                  </td>

                  {/* Customer */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <div className="font-semibold text-slate-900">{repair.customerName}</div>
                    <a
                      href={`tel:${repair.phone}`}
                      className="text-slate-500 hover:text-indigo-600 font-mono inline-flex items-center gap-1 mt-0.5"
                    >
                      <Phone className="w-3 h-3 text-slate-400" />
                      <span>{formatThaiPhone(repair.phone)}</span>
                    </a>
                  </td>

                  {/* Device */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <span className="font-medium text-slate-900">{repair.brand}</span>{' '}
                    <span className="text-slate-600">{repair.model}</span>
                    {repair.passcode && (
                      <div className="text-[10px] text-slate-400 font-mono">
                        PIN: {repair.passcode}
                      </div>
                    )}
                  </td>

                  {/* Symptom */}
                  <td className="py-3.5 px-4 max-w-xs truncate text-slate-700" title={repair.symptom}>
                    {repair.symptom}
                  </td>

                  {/* Spare parts cost */}
                  <td className="py-3.5 px-4 text-right font-mono tabular-nums text-slate-600 whitespace-nowrap">
                    {formatCurrency(repair.sparePartCost)} ฿
                  </td>

                  {/* Labor cost */}
                  <td className="py-3.5 px-4 text-right font-mono tabular-nums text-slate-600 whitespace-nowrap">
                    {formatCurrency(repair.laborCost)} ฿
                  </td>

                  {/* Total cost */}
                  <td className="py-3.5 px-4 text-right font-mono tabular-nums font-bold text-emerald-700 whitespace-nowrap">
                    {formatCurrency(totalCost)} ฿
                  </td>

                  {/* Warranty */}
                  <td className="py-3.5 px-4 text-center whitespace-nowrap text-slate-600">
                    <span className="bg-slate-100 px-2 py-0.5 rounded text-[11px]">
                      {repair.warranty}
                    </span>
                  </td>

                  {/* Status Dropdown */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <select
                      value={repair.status}
                      onChange={(e) => onStatusChange(repair.id, e.target.value as RepairStatus)}
                      className={`text-xs font-semibold px-2 py-1 rounded-md border cursor-pointer focus:outline-none ${getStatusBadge(
                        repair.status
                      )}`}
                    >
                      {allStatuses.map((st) => (
                        <option key={st} value={st}>
                          {st}
                        </option>
                      ))}
                    </select>
                  </td>

                  {/* Actions */}
                  <td className="py-3.5 px-4 text-center whitespace-nowrap">
                    <div className="flex items-center justify-center gap-1">
                      <button
                        onClick={() => onPrint(repair)}
                        title="พิมพ์ใบรับซ่อม"
                        className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded transition-colors cursor-pointer"
                      >
                        <Printer className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => onContact(repair)}
                        title="ติดต่อลูกค้า"
                        className="p-1.5 text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 rounded transition-colors cursor-pointer"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => onEdit(repair)}
                        title="แก้ไข"
                        className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded transition-colors cursor-pointer"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => onDelete(repair.id)}
                        title="ลบ"
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
