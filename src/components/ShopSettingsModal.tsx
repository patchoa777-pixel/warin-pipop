import React, { useState } from 'react';
import { X, Store, Save } from 'lucide-react';
import { ShopInfo } from '../types/repair';

interface ShopSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  shopInfo: ShopInfo;
  onSave: (info: ShopInfo) => void;
}

export const ShopSettingsModal: React.FC<ShopSettingsModalProps> = ({
  isOpen,
  onClose,
  shopInfo,
  onSave,
}) => {
  const [name, setName] = useState(shopInfo.name);
  const [phone, setPhone] = useState(shopInfo.phone);
  const [address, setAddress] = useState(shopInfo.address);
  const [lineId, setLineId] = useState(shopInfo.lineId);
  const [taxId, setTaxId] = useState(shopInfo.taxId || '');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      name: name.trim() || 'ร้านซ่อมมือถือ Pro',
      phone: phone.trim() || '080-000-0000',
      address: address.trim() || '',
      lineId: lineId.trim() || '',
      taxId: taxId.trim() || undefined,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg my-6 border border-slate-200 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <Store className="w-5 h-5 text-indigo-400" />
            <div>
              <h2 className="text-base font-bold">ตั้งค่าข้อมูลร้านค้า</h2>
              <p className="text-xs text-slate-400">ข้อมูลนี้จะแสดงบนใบรับซ่อมและใบเสร็จ</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-3.5 text-xs text-slate-700">
          <div>
            <label className="block font-medium text-slate-700 mb-1">ชื่อร้านซ่อม / ศูนย์บริการ</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-800 focus:outline-none focus:border-indigo-600"
              placeholder="เช่น ศูนย์ซ่อมมือถือด่วน Pro Mobile Service"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-medium text-slate-700 mb-1">เบอร์โทรศัพท์ร้าน</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-800 focus:outline-none focus:border-indigo-600"
                placeholder="เช่น 089-999-8877"
              />
            </div>

            <div>
              <label className="block font-medium text-slate-700 mb-1">LINE ID ร้าน</label>
              <input
                type="text"
                value={lineId}
                onChange={(e) => setLineId(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-800 focus:outline-none focus:border-indigo-600"
                placeholder="เช่น @promobilerepair"
              />
            </div>
          </div>

          <div>
            <label className="block font-medium text-slate-700 mb-1">ที่อยู่ร้านค้า / สาขา</label>
            <textarea
              rows={2}
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-800 focus:outline-none focus:border-indigo-600"
              placeholder="ที่ตั้งสาขา เช่น ชั้น 2 ไอทีมอลล์ แขวงคลองเตย กรุงเทพฯ"
            />
          </div>

          <div>
            <label className="block font-medium text-slate-700 mb-1">
              เลขประจำตัวผู้เสียภาษี (Tax ID - ถ้ามี)
            </label>
            <input
              type="text"
              value={taxId}
              onChange={(e) => setTaxId(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-800 focus:outline-none focus:border-indigo-600"
              placeholder="เช่น 0105556012345"
            />
          </div>

          {/* Footer Action */}
          <div className="pt-4 border-t border-slate-200 flex justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 rounded-lg transition-colors cursor-pointer"
            >
              <Save className="w-3.5 h-3.5" />
              <span>บันทึกการตั้งค่า</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
