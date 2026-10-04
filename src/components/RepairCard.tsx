import React, { useState } from 'react';
import {
  User,
  Phone,
  Wrench,
  ShieldCheck,
  Clock,
  Printer,
  Edit2,
  Trash2,
  MessageSquare,
  ChevronDown,
  DollarSign,
  AlertCircle,
  Copy,
  Check,
} from 'lucide-react';
import { RepairItem, RepairStatus } from '../types/repair';
import { formatCurrency, formatThaiDate, formatThaiPhone } from '../utils/thaiFormat';

interface RepairCardProps {
  repair: RepairItem;
  onEdit: (repair: RepairItem) => void;
  onDelete: (id: string) => void;
  onPrint: (repair: RepairItem) => void;
  onContact: (repair: RepairItem) => void;
  onStatusChange: (id: string, status: RepairStatus) => void;
}

export const RepairCard: React.FC<RepairCardProps> = ({
  repair,
  onEdit,
  onDelete,
  onPrint,
  onContact,
  onStatusChange,
}) => {
  const [copied, setCopied] = useState(false);
  const [showStatusMenu, setShowStatusMenu] = useState(false);

  const totalCost = repair.sparePartCost + repair.laborCost;

  const copyId = () => {
    navigator.clipboard.writeText(repair.id);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const getStatusBadge = (status: RepairStatus) => {
    switch (status) {
      case 'กำลังซ่อม':
        return {
          bg: 'bg-amber-50',
          text: 'text-amber-700',
          border: 'border-amber-200',
          dot: 'bg-amber-500',
        };
      case 'รออะไหล่':
        return {
          bg: 'bg-rose-50',
          text: 'text-rose-700',
          border: 'border-rose-200',
          dot: 'bg-rose-500',
        };
      case 'ซ่อมเสร็จแล้ว':
        return {
          bg: 'bg-emerald-50',
          text: 'text-emerald-700',
          border: 'border-emerald-200',
          dot: 'bg-emerald-500',
        };
      case 'ส่งมอบแล้ว':
        return {
          bg: 'bg-blue-50',
          text: 'text-blue-700',
          border: 'border-blue-200',
          dot: 'bg-blue-500',
        };
      default:
        return {
          bg: 'bg-slate-50',
          text: 'text-slate-700',
          border: 'border-slate-200',
          dot: 'bg-slate-500',
        };
    }
  };

  const statusStyle = getStatusBadge(repair.status);
  const allStatuses: RepairStatus[] = ['กำลังซ่อม', 'รออะไหล่', 'ซ่อมเสร็จแล้ว', 'ส่งมอบแล้ว'];

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-xs hover:shadow-md hover:border-slate-300 transition-all flex flex-col justify-between overflow-hidden group">
      <div className="p-5">
        {/* Header: ID, Brand, Model & Status */}
        <div className="flex items-start justify-between gap-3 mb-3.5 pb-3 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-1">
              <span className="font-mono font-semibold text-indigo-700">{repair.id}</span>
              <button
                onClick={copyId}
                title="คัดลอกเลขที่ใบรับ"
                className="text-slate-400 hover:text-indigo-600 transition-colors cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
              <span>·</span>
              <span>{formatThaiDate(repair.receiveDate)}</span>
            </div>
            <h3 className="text-base font-bold text-slate-900 leading-snug">
              <span className="text-indigo-900 font-semibold">{repair.brand}</span>{' '}
              <span>{repair.model}</span>
            </h3>
          </div>

          {/* Interactive Status Badge with quick change popover */}
          <div className="relative">
            <button
              onClick={() => setShowStatusMenu(!showStatusMenu)}
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${statusStyle.bg} ${statusStyle.text} ${statusStyle.border} hover:brightness-95 transition-all cursor-pointer`}
              title="คลิกเพื่อเปลี่ยนสถานะ"
            >
              <span className={`w-1.5 h-1.5 rounded-full ${statusStyle.dot}`} />
              <span>{repair.status}</span>
              <ChevronDown className="w-3 h-3 opacity-60" />
            </button>

            {showStatusMenu && (
              <>
                <div
                  className="fixed inset-0 z-20"
                  onClick={() => setShowStatusMenu(false)}
                />
                <div className="absolute right-0 top-full mt-1.5 w-36 bg-white border border-slate-200 rounded-lg shadow-lg z-30 py-1 text-xs">
                  <div className="px-2.5 py-1 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                    เปลี่ยนสถานะ
                  </div>
                  {allStatuses.map((st) => (
                    <button
                      key={st}
                      onClick={() => {
                        onStatusChange(repair.id, st);
                        setShowStatusMenu(false);
                      }}
                      className={`w-full text-left px-3 py-1.5 hover:bg-slate-50 flex items-center justify-between cursor-pointer ${
                        repair.status === st ? 'font-bold text-indigo-700 bg-indigo-50/50' : 'text-slate-700'
                      }`}
                    >
                      <span>{st}</span>
                      {repair.status === st && <Check className="w-3 h-3 text-indigo-600" />}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Customer & Device Information */}
        <div className="space-y-2 text-xs">
          {/* Customer */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-slate-600">
              <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span className="text-slate-500">ลูกค้า:</span>
              <span className="font-medium text-slate-800">{repair.customerName}</span>
            </div>
            <a
              href={`tel:${repair.phone}`}
              className="inline-flex items-center gap-1 text-indigo-600 hover:text-indigo-800 font-mono hover:underline"
              title="กดเพื่อโทรออก"
            >
              <Phone className="w-3 h-3" />
              <span>{formatThaiPhone(repair.phone)}</span>
            </a>
          </div>

          {/* Symptom */}
          <div className="flex items-start gap-2 bg-amber-50/50 p-2.5 rounded-lg border border-amber-100/60">
            <AlertCircle className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
            <div className="flex-1">
              <span className="font-medium text-amber-900 block mb-0.5">อาการเสีย / ตำหนิ:</span>
              <p className="text-slate-700 leading-relaxed">{repair.symptom}</p>
            </div>
          </div>

          {/* Passcode or tech note if available */}
          {repair.passcode && (
            <div className="text-[11px] text-slate-500 flex items-center gap-1.5 px-1">
              <span className="font-semibold text-slate-600">รหัสปลดล็อค:</span>
              <code className="bg-slate-100 px-1.5 py-0.5 rounded text-slate-700 font-mono">
                {repair.passcode}
              </code>
            </div>
          )}

          {/* Cost details */}
          <div className="pt-2 border-t border-slate-100 space-y-1">
            <div className="flex items-center justify-between text-slate-600">
              <div className="flex items-center gap-1.5">
                <Wrench className="w-3.5 h-3.5 text-slate-400" />
                <span>ค่าอะไหล่ / ค่าแรง:</span>
              </div>
              <span className="font-mono tabular-nums text-slate-700">
                {formatCurrency(repair.sparePartCost)} / {formatCurrency(repair.laborCost)} บาท
              </span>
            </div>

            <div className="flex items-center justify-between bg-emerald-50/70 px-2.5 py-1.5 rounded-lg border border-emerald-100 text-emerald-900">
              <div className="flex items-center gap-1.5 font-semibold text-emerald-800">
                <DollarSign className="w-3.5 h-3.5" />
                <span>ราคารวมสุทธิ:</span>
              </div>
              <span className="text-sm font-bold font-mono tabular-nums text-emerald-700">
                {formatCurrency(totalCost)} บาท
              </span>
            </div>
          </div>

          {/* Warranty & Duration */}
          <div className="grid grid-cols-2 gap-2 pt-1 text-[11px] text-slate-500">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
              <span>ประกัน: <strong className="text-slate-700">{repair.warranty}</strong></span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span>ระยะเวลา: <strong className="text-slate-700">{repair.duration}</strong></span>
            </div>
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <div className="px-5 py-3 bg-slate-50/80 border-t border-slate-100 flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => onPrint(repair)}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-md text-xs font-medium text-slate-700 bg-white border border-slate-200 hover:bg-slate-100 hover:text-slate-900 transition-colors cursor-pointer shadow-2xs"
            title="พิมพ์ใบรับซ่อม / ใบเสร็จ"
          >
            <Printer className="w-3.5 h-3.5 text-indigo-600" />
            <span className="hidden sm:inline">พิมพ์ใบรับ</span>
          </button>

          <button
            onClick={() => onContact(repair)}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-md text-xs font-medium text-slate-700 bg-white border border-slate-200 hover:bg-slate-100 hover:text-slate-900 transition-colors cursor-pointer shadow-2xs"
            title="ส่งข้อความแจ้งลูกค้า หรือโทรออก"
          >
            <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
            <span className="hidden sm:inline">แจ้งลูกค้า</span>
          </button>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => onEdit(repair)}
            className="p-1.5 rounded-md text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 transition-colors cursor-pointer"
            title="แก้ไขรายการ"
          >
            <Edit2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => onDelete(repair.id)}
            className="p-1.5 rounded-md text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
            title="ลบรายการ"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
