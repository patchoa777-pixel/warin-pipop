import React, { useState } from 'react';
import { X, Phone, MessageSquare, Copy, Check, Send } from 'lucide-react';
import { RepairItem, ShopInfo } from '../types/repair';
import { formatCurrency, formatThaiPhone } from '../utils/thaiFormat';

interface ContactCustomerModalProps {
  isOpen: boolean;
  onClose: () => void;
  repair: RepairItem | null;
  shopInfo: ShopInfo;
}

export const ContactCustomerModal: React.FC<ContactCustomerModalProps> = ({
  isOpen,
  onClose,
  repair,
  shopInfo,
}) => {
  const [copiedType, setCopiedType] = useState<string | null>(null);

  if (!isOpen || !repair) return null;

  const totalCost = repair.sparePartCost + repair.laborCost;

  // Thai message templates
  const templates = [
    {
      id: 'ready',
      title: '✅ แจ้งเครื่องซ่อมเสร็จเรียบร้อย (พร้อมรับ)',
      text: `เรียน ${repair.customerName}\nจากร้าน ${shopInfo.name}\n\nโทรศัพท์มือถือ ${repair.brand} ${repair.model} (เลขที่ใบรับ: ${repair.id})\nอาการ: ${repair.symptom}\n\n✨ ซ่อมเสร็จเรียบร้อยแล้วครับ ลูกค้าสามารถเข้ามารับเครื่องได้เลยครับ\n💰 ยอดชำระสุทธิ: ${formatCurrency(totalCost)} บาท\n🛡️ ประกันหลังซ่อม: ${repair.warranty}\n\n📍 พิกัดร้าน: ${shopInfo.address}\n📞 โทร: ${shopInfo.phone}`,
    },
    {
      id: 'waiting_parts',
      title: '⏳ แจ้งสถานะรออะไหล่',
      text: `เรียน ${repair.customerName}\nจากร้าน ${shopInfo.name}\n\nอัพเดทสถานะงานซ่อม ${repair.brand} ${repair.model} (เลขที่: ${repair.id})\nขณะนี้อยู่ระหว่างรอจัดส่งอะไหล่แท้ คาดว่าจะพร้อมส่งมอบภายใน ${repair.duration} ครับ\n\nหากดำเนินการเสร็จทางร้านจะแจ้งให้ทราบทันทีครับ\n📞 สอบถามเพิ่มเติม: ${shopInfo.phone}`,
    },
    {
      id: 'received',
      title: '📋 แจ้งยืนยันการรับเครื่องเข้าซ่อม',
      text: `เรียน ${repair.customerName}\nร้าน ${shopInfo.name} ได้รับเครื่อง ${repair.brand} ${repair.model} เข้าระบบเรียบร้อยแล้ว\n\n🔖 เลขที่ใบรับซ่อม: ${repair.id}\n🔧 อาการที่แจ้ง: ${repair.symptom}\n💵 ประเมินค่าบริการ: ${formatCurrency(totalCost)} บาท\n⏱️ ระยะเวลาดำเนินการประมาณ: ${repair.duration}\n\nขอบพระคุณที่ไว้วางใจใช้บริการครับ`,
    },
  ];

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedType(id);
    setTimeout(() => setCopiedType(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg my-6 border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 bg-emerald-700 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5" />
            <div>
              <h2 className="text-base font-bold">ติดต่อลูกค้า: {repair.customerName}</h2>
              <p className="text-xs text-emerald-100">
                {repair.brand} {repair.model} ({repair.id})
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-emerald-200 hover:text-white hover:bg-emerald-600 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-4 text-xs">
          {/* Quick Call Box */}
          <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-xl flex items-center justify-between">
            <div>
              <span className="text-[11px] text-emerald-700 block">เบอร์โทรศัพท์ลูกค้า:</span>
              <span className="font-mono text-base font-bold text-emerald-900">
                {formatThaiPhone(repair.phone)}
              </span>
            </div>
            <a
              href={`tel:${repair.phone}`}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg shadow-sm shadow-emerald-200 transition-colors"
            >
              <Phone className="w-4 h-4" />
              <span>กดโทรออก</span>
            </a>
          </div>

          <div className="pt-2">
            <span className="font-semibold text-slate-800 text-xs block mb-2">
              เลือกข้อความสำเร็จรูปสำหรับส่งทาง LINE หรือ SMS:
            </span>

            <div className="space-y-3">
              {templates.map((tpl) => (
                <div
                  key={tpl.id}
                  className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-slate-800">{tpl.title}</span>
                    <button
                      onClick={() => handleCopy(tpl.id, tpl.text)}
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded text-[11px] font-medium transition-colors cursor-pointer ${
                        copiedType === tpl.id
                          ? 'bg-emerald-600 text-white'
                          : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      {copiedType === tpl.id ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>คัดลอกแล้ว!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>คัดลอกข้อความ</span>
                        </>
                      )}
                    </button>
                  </div>
                  <pre className="font-sans text-[11px] text-slate-600 bg-white p-2.5 rounded border border-slate-200/80 whitespace-pre-wrap leading-relaxed">
                    {tpl.text}
                  </pre>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-100 border-t border-slate-200 flex justify-end shrink-0">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-900 text-white transition-colors cursor-pointer"
          >
            ปิด
          </button>
        </div>
      </div>
    </div>
  );
};
