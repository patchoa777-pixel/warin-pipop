import React from 'react';
import { X, Printer, Check, Smartphone, ShieldCheck, QrCode } from 'lucide-react';
import { RepairItem, ShopInfo } from '../types/repair';
import { formatCurrency, formatThaiDate, formatThaiPhone } from '../utils/thaiFormat';

interface PrintTicketModalProps {
  isOpen: boolean;
  onClose: () => void;
  repair: RepairItem | null;
  shopInfo: ShopInfo;
}

export const PrintTicketModal: React.FC<PrintTicketModalProps> = ({
  isOpen,
  onClose,
  repair,
  shopInfo,
}) => {
  if (!isOpen || !repair) return null;

  const totalCost = repair.sparePartCost + repair.laborCost;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl my-6 border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Top Actions (Hidden in Print) */}
        <div className="no-print px-6 py-3.5 bg-slate-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <Printer className="w-4 h-4 text-indigo-400" />
            <span className="text-sm font-semibold">พิมพ์ใบรับซ่อม / ใบส่งมอบเครื่อง</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white transition-colors cursor-pointer shadow-xs"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>สั่งพิมพ์ (Print)</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Ticket Canvas */}
        <div className="p-6 sm:p-8 overflow-y-auto bg-white text-slate-900 print:p-0 print:m-0">
          {/* Shop Header */}
          <div className="border-b-2 border-slate-900 pb-4 mb-4">
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
                  {shopInfo.name}
                </h1>
                <p className="text-xs text-slate-600 mt-0.5">{shopInfo.address}</p>
                <div className="flex items-center gap-3 text-xs text-slate-600 mt-1">
                  <span>โทร: <strong className="font-mono">{formatThaiPhone(shopInfo.phone)}</strong></span>
                  <span>·</span>
                  <span>LINE: <strong className="font-mono">{shopInfo.lineId}</strong></span>
                  {shopInfo.taxId && (
                    <>
                      <span>·</span>
                      <span>เลขผู้เสียภาษี: <strong className="font-mono">{shopInfo.taxId}</strong></span>
                    </>
                  )}
                </div>
              </div>

              {/* Barcode/QR placeholder */}
              <div className="text-right shrink-0">
                <div className="border border-slate-300 p-1.5 rounded bg-slate-50 inline-block text-center">
                  <div className="w-16 h-16 flex items-center justify-center bg-white border border-slate-200">
                    <QrCode className="w-12 h-12 text-slate-800" />
                  </div>
                  <span className="block font-mono text-[9px] text-slate-600 mt-0.5">{repair.id}</span>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-2 border-t border-slate-200 flex items-center justify-between">
              <span className="text-sm font-bold bg-slate-900 text-white px-3 py-1 rounded">
                ใบรับเครื่องซ่อม / ใบเสร็จรับเงิน
              </span>
              <div className="text-right text-xs">
                <div>เลขที่: <span className="font-mono font-bold text-indigo-700">{repair.id}</span></div>
                <div className="text-slate-500">วันที่รับเครื่อง: {formatThaiDate(repair.receiveDate, true)}</div>
              </div>
            </div>
          </div>

          {/* Customer & Device Information */}
          <div className="grid grid-cols-2 gap-4 mb-4 text-xs">
            <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
              <h3 className="font-bold text-slate-800 mb-1.5 border-b border-slate-200 pb-1">
                ข้อมูลลูกค้า (Customer)
              </h3>
              <div className="space-y-1">
                <div>ชื่อ-นามสกุล: <strong className="text-slate-900">{repair.customerName}</strong></div>
                <div>เบอร์โทรศัพท์: <strong className="font-mono">{formatThaiPhone(repair.phone)}</strong></div>
                <div>สถานะปัจจุบัน: <strong className="text-indigo-700">{repair.status}</strong></div>
              </div>
            </div>

            <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
              <h3 className="font-bold text-slate-800 mb-1.5 border-b border-slate-200 pb-1">
                ข้อมูลอุปกรณ์ (Device)
              </h3>
              <div className="space-y-1">
                <div>ยี่ห้อ / รุ่น: <strong className="text-slate-900">{repair.brand} {repair.model}</strong></div>
                {repair.passcode && (
                  <div>รหัสปลดล็อค: <strong className="font-mono">{repair.passcode}</strong></div>
                )}
                <div>ช่างผู้รับผิดชอบ: <strong className="text-slate-900">{repair.technicianName || 'ช่างประจำร้าน'}</strong></div>
              </div>
            </div>
          </div>

          {/* Symptom & Pre-inspection */}
          <div className="mb-4 text-xs bg-slate-50 p-3 rounded-lg border border-slate-200">
            <div className="mb-2">
              <span className="font-bold text-slate-800">อาการเสียที่ลูกค้าแจ้ง / สภาพตัวเครื่อง:</span>
              <p className="mt-1 text-slate-800 bg-white p-2 rounded border border-slate-200 leading-relaxed">
                {repair.symptom}
              </p>
            </div>

            {repair.checklist && (
              <div>
                <span className="font-semibold text-slate-700 text-[11px] block mb-1">
                  ผลการตรวจสภาพเครื่องเบื้องต้นก่อนรับซ่อม:
                </span>
                <div className="grid grid-cols-3 gap-1.5 text-[11px]">
                  <div className="flex items-center gap-1">
                    <span>{repair.checklist.powerOn ? '✓' : '✕'}</span>
                    <span>เปิดติด</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span>{repair.checklist.touchScreen ? '✓' : '✕'}</span>
                    <span>ทัชสกรีนได้</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span>{repair.checklist.camera ? '✓' : '✕'}</span>
                    <span>กล้องหน้า/หลัง</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span>{repair.checklist.speakerMic ? '✓' : '✕'}</span>
                    <span>ลำโพง/ไมค์</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span>{repair.checklist.wifiSignal ? '✓' : '✕'}</span>
                    <span>สัญญาณ/Wi-Fi</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span>{repair.checklist.charging ? '✓' : '✕'}</span>
                    <span>ชาร์จไฟเข้า</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Financial Breakdown Table */}
          <table className="w-full text-xs mb-4 border border-slate-200">
            <thead className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-200">
              <tr>
                <th className="py-2 px-3 text-left">รายการบริการ / อะไหล่</th>
                <th className="py-2 px-3 text-center">ระยะเวลารับประกัน</th>
                <th className="py-2 px-3 text-right">จำนวนเงิน (บาท)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <tr>
                <td className="py-2 px-3">
                  ค่าอะไหล่ ({repair.brand} {repair.model})
                </td>
                <td className="py-2 px-3 text-center">{repair.warranty}</td>
                <td className="py-2 px-3 text-right font-mono tabular-nums">
                  {formatCurrency(repair.sparePartCost)}
                </td>
              </tr>
              <tr>
                <td className="py-2 px-3">ค่าบริการและค่าแรงช่าง</td>
                <td className="py-2 px-3 text-center">การันตีงานประกอบ</td>
                <td className="py-2 px-3 text-right font-mono tabular-nums">
                  {formatCurrency(repair.laborCost)}
                </td>
              </tr>
              <tr className="bg-slate-50 font-bold border-t-2 border-slate-900">
                <td colSpan={2} className="py-2.5 px-3 text-right text-slate-900">
                  ราคารวมสุทธิทั้งสิ้น:
                </td>
                <td className="py-2.5 px-3 text-right font-mono text-sm text-indigo-900 tabular-nums">
                  {formatCurrency(totalCost)} บาท
                </td>
              </tr>
            </tbody>
          </table>

          {/* Warranty Terms & Conditions */}
          <div className="text-[10px] text-slate-500 border border-slate-200 p-2.5 rounded-lg mb-6 leading-relaxed bg-slate-50/50">
            <strong className="text-slate-700 block mb-0.5">เงื่อนไขการรับประกันและข้อตกลง:</strong>
            <ol className="list-decimal pl-4 space-y-0.5">
              <li>โปรดนำใบรับซ่อมฉบับนี้มาแสดงทุกครั้งที่มารับเครื่อง หรือติดต่อสอบถาม</li>
              <li>การรับประกันครอบคลุมเฉพาะอะไหล่หรือจุดที่ได้รับการซ่อมเท่านั้น เป็นระยะเวลา {repair.warranty}</li>
              <li>การรับประกันสิ้นสุดทันทีหาก: สติกเกอร์รับประกันขาด, เครื่องโดนน้ำ, ตกกระแทกแตก, หรือมีการแกะซ่อมจากที่อื่น</li>
              <li>ทางร้านไม่รับผิดชอบต่อข้อมูลในเครื่อง (ลูกค้าควรสำรองข้อมูลก่อนส่งซ่อม)</li>
              <li>หากซ่อมเสร็จแล้วไม่มารับเครื่องเกิน 60 วัน ทางร้านขอสงวนสิทธิ์ในการจัดการตามระเบียบร้าน</li>
            </ol>
          </div>

          {/* Signatures */}
          <div className="grid grid-cols-2 gap-8 text-center text-xs pt-4 border-t border-slate-200">
            <div>
              <div className="border-b border-dashed border-slate-400 h-10 mb-2"></div>
              <p className="font-medium text-slate-800">ลงชื่อ .....................................................</p>
              <p className="text-slate-500 mt-0.5">({repair.customerName})</p>
              <p className="text-[10px] text-slate-400">ผู้ส่งเครื่องซ่อม</p>
            </div>
            <div>
              <div className="border-b border-dashed border-slate-400 h-10 mb-2"></div>
              <p className="font-medium text-slate-800">ลงชื่อ .....................................................</p>
              <p className="text-slate-500 mt-0.5">({repair.technicianName || 'ช่างประจำร้าน'})</p>
              <p className="text-[10px] text-slate-400">ช่างผู้รับเครื่อง / ตัวแทนร้าน</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
