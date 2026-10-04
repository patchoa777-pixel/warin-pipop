import React, { useState, useEffect } from 'react';
import { X, Smartphone, DollarSign, Shield, Clock, FileText, CheckSquare } from 'lucide-react';
import { RepairItem, RepairStatus, WarrantyOption, DeviceChecklist } from '../types/repair';
import { formatCurrency } from '../utils/thaiFormat';

interface AddRepairModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (repair: RepairItem) => void;
  initialData?: RepairItem | null;
  suggestedId: string;
}

export const AddRepairModal: React.FC<AddRepairModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData,
  suggestedId,
}) => {
  const [id, setId] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [brand, setBrand] = useState('Apple');
  const [model, setModel] = useState('');
  const [symptom, setSymptom] = useState('');
  const [sparePartCost, setSparePartCost] = useState('0');
  const [laborCost, setLaborCost] = useState('0');
  const [duration, setDuration] = useState('1-2 วัน');
  const [warranty, setWarranty] = useState<WarrantyOption>('1 เดือน');
  const [status, setStatus] = useState<RepairStatus>('กำลังซ่อม');
  const [passcode, setPasscode] = useState('');
  const [technicianName, setTechnicianName] = useState('ช่างประจำร้าน');
  const [technicianNote, setTechnicianNote] = useState('');

  // Initial inspection checklist
  const [checklist, setChecklist] = useState<DeviceChecklist>({
    powerOn: true,
    touchScreen: true,
    camera: true,
    speakerMic: true,
    wifiSignal: true,
    charging: true,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (initialData) {
      setId(initialData.id);
      setCustomerName(initialData.customerName);
      setPhone(initialData.phone);
      setBrand(initialData.brand);
      setModel(initialData.model);
      setSymptom(initialData.symptom);
      setSparePartCost(initialData.sparePartCost.toString());
      setLaborCost(initialData.laborCost.toString());
      setDuration(initialData.duration);
      setWarranty((initialData.warranty as WarrantyOption) || '1 เดือน');
      setStatus(initialData.status);
      setPasscode(initialData.passcode || '');
      setTechnicianName(initialData.technicianName || 'ช่างประจำร้าน');
      setTechnicianNote(initialData.technicianNote || '');
      if (initialData.checklist) {
        setChecklist(initialData.checklist);
      }
    } else {
      setId(suggestedId);
      setCustomerName('');
      setPhone('');
      setBrand('Apple');
      setModel('');
      setSymptom('');
      setSparePartCost('0');
      setLaborCost('0');
      setDuration('1-2 วัน');
      setWarranty('1 เดือน');
      setStatus('กำลังซ่อม');
      setPasscode('');
      setTechnicianName('ช่างประจำร้าน');
      setTechnicianNote('');
      setChecklist({
        powerOn: true,
        touchScreen: true,
        camera: true,
        speakerMic: true,
        wifiSignal: true,
        charging: true,
      });
    }
    setErrors({});
  }, [initialData, suggestedId, isOpen]);

  if (!isOpen) return null;

  const quickBrands = ['Apple', 'Samsung', 'Xiaomi', 'OPPO', 'Vivo', 'Realme', 'iPad', 'Huawei'];
  const warrantyOptions: WarrantyOption[] = ['ไม่มีประกัน', '1 เดือน', '3 เดือน', '6 เดือน', '1 ปี'];
  const statusOptions: RepairStatus[] = ['กำลังซ่อม', 'รออะไหล่', 'ซ่อมเสร็จแล้ว', 'ส่งมอบแล้ว'];

  const numSparePart = parseFloat(sparePartCost) || 0;
  const numLabor = parseFloat(laborCost) || 0;
  const totalCost = numSparePart + numLabor;

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!customerName.trim()) newErrors.customerName = 'กรุณากรอกชื่อลูกค้า';
    if (!phone.trim()) newErrors.phone = 'กรุณากรอกเบอร์โทรติดต่อ';
    if (!brand.trim()) newErrors.brand = 'กรุณาระบุยี่ห้อมือถือ';
    if (!model.trim()) newErrors.model = 'กรุณาระบุรุ่นมือถือ';
    if (!symptom.trim()) newErrors.symptom = 'กรุณากรอกอาการเสีย / ตำหนิเครื่อง';
    if (!duration.trim()) newErrors.duration = 'กรุณาระบุระยะเวลาประเมิน';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const repairItem: RepairItem = {
      id: id || suggestedId,
      customerName: customerName.trim(),
      phone: phone.trim(),
      brand: brand.trim(),
      model: model.trim(),
      symptom: symptom.trim(),
      sparePartCost: numSparePart,
      laborCost: numLabor,
      duration: duration.trim(),
      warranty,
      status,
      receiveDate: initialData?.receiveDate || new Date().toISOString(),
      passcode: passcode.trim() || undefined,
      technicianName: technicianName.trim() || undefined,
      technicianNote: technicianNote.trim() || undefined,
      checklist,
    };

    onSave(repairItem);
  };

  const toggleChecklist = (key: keyof DeviceChecklist) => {
    setChecklist((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl my-6 border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 bg-indigo-700 text-white flex items-center justify-between shrink-0">
          <div>
            <h2 className="text-lg font-bold">
              {initialData ? 'แก้ไขข้อมูลงานซ่อม' : 'ออกใบรับซ่อมมือถือใหม่'}
            </h2>
            <p className="text-xs text-indigo-100">
              เลขที่ใบรับซ่อม: <span className="font-mono font-bold text-white">{id || suggestedId}</span>
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-indigo-200 hover:text-white hover:bg-indigo-600 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 text-xs">
          {/* Customer Section */}
          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/80 space-y-3">
            <span className="font-semibold text-slate-800 text-xs block">
              1. ข้อมูลลูกค้า
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-600 mb-1 font-medium">
                  ชื่อลูกค้า <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="เช่น คุณสมชาย ใจดี"
                  className={`w-full px-3 py-2 bg-white border rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 ${
                    errors.customerName ? 'border-rose-400' : 'border-slate-300 focus:border-indigo-600'
                  }`}
                />
                {errors.customerName && (
                  <p className="text-rose-500 text-[11px] mt-0.5">{errors.customerName}</p>
                )}
              </div>

              <div>
                <label className="block text-slate-600 mb-1 font-medium">
                  เบอร์โทรติดต่อ <span className="text-rose-500">*</span>
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="เช่น 081-234-5678"
                  className={`w-full px-3 py-2 bg-white border rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 ${
                    errors.phone ? 'border-rose-400' : 'border-slate-300 focus:border-indigo-600'
                  }`}
                />
                {errors.phone && (
                  <p className="text-rose-500 text-[11px] mt-0.5">{errors.phone}</p>
                )}
              </div>
            </div>
          </div>

          {/* Device Section */}
          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/80 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-slate-800 text-xs block">
                2. ข้อมูลอุปกรณ์ / มือถือ
              </span>
              {/* Brand quick picks */}
              <div className="flex items-center gap-1 overflow-x-auto max-w-xs">
                {quickBrands.slice(0, 5).map((b) => (
                  <button
                    key={b}
                    type="button"
                    onClick={() => setBrand(b)}
                    className={`px-2 py-0.5 rounded text-[10px] cursor-pointer transition-colors ${
                      brand === b
                        ? 'bg-indigo-600 text-white font-medium'
                        : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {b}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-slate-600 mb-1 font-medium">
                  ยี่ห้อ <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                  placeholder="เช่น Apple, Samsung"
                  className={`w-full px-3 py-2 bg-white border rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 ${
                    errors.brand ? 'border-rose-400' : 'border-slate-300 focus:border-indigo-600'
                  }`}
                />
                {errors.brand && (
                  <p className="text-rose-500 text-[11px] mt-0.5">{errors.brand}</p>
                )}
              </div>

              <div>
                <label className="block text-slate-600 mb-1 font-medium">
                  รุ่น <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  placeholder="เช่น iPhone 13, S22"
                  className={`w-full px-3 py-2 bg-white border rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 ${
                    errors.model ? 'border-rose-400' : 'border-slate-300 focus:border-indigo-600'
                  }`}
                />
                {errors.model && (
                  <p className="text-rose-500 text-[11px] mt-0.5">{errors.model}</p>
                )}
              </div>

              <div>
                <label className="block text-slate-600 mb-1 font-medium">
                  รหัสปลดล็อคเครื่อง (PIN / Pattern)
                </label>
                <input
                  type="text"
                  value={passcode}
                  onChange={(e) => setPasscode(e.target.value)}
                  placeholder="เช่น 1234 หรือ ไม่มี"
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-800 focus:outline-none focus:border-indigo-600"
                />
              </div>
            </div>

            {/* Symptom */}
            <div>
              <label className="block text-slate-600 mb-1 font-medium">
                อาการเสีย / ตำหนิเครื่องเดิม <span className="text-rose-500">*</span>
              </label>
              <textarea
                rows={2}
                value={symptom}
                onChange={(e) => setSymptom(e.target.value)}
                placeholder="เช่น จอแตก ทัชสกรีนไม่ได้ ขอบเครื่องมีรอยถลอกมุมขวาล่าง..."
                className={`w-full px-3 py-2 bg-white border rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 ${
                  errors.symptom ? 'border-rose-400' : 'border-slate-300 focus:border-indigo-600'
                }`}
              />
              {errors.symptom && (
                <p className="text-rose-500 text-[11px] mt-0.5">{errors.symptom}</p>
              )}
            </div>

            {/* Device Inspection Checklist */}
            <div className="pt-2 border-t border-slate-200">
              <span className="text-[11px] font-medium text-slate-600 mb-1.5 block">
                ตรวจสภาพเครื่องเบื้องต้นขณะรับซ่อม:
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {[
                  { key: 'powerOn', label: 'เครื่องเปิดติด' },
                  { key: 'touchScreen', label: 'ทัชสกรีนได้ปกติ' },
                  { key: 'camera', label: 'กล้องหน้า/หลังปกติ' },
                  { key: 'speakerMic', label: 'ลำโพงและไมค์ปกติ' },
                  { key: 'wifiSignal', label: 'สัญญาณ/Wi-Fi ปกติ' },
                  { key: 'charging', label: 'ชาร์จไฟเข้าปกติ' },
                ].map((item) => {
                  const isChecked = checklist[item.key as keyof DeviceChecklist];
                  return (
                    <label
                      key={item.key}
                      onClick={() => toggleChecklist(item.key as keyof DeviceChecklist)}
                      className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs cursor-pointer select-none transition-colors ${
                        isChecked
                          ? 'bg-emerald-50/70 border-emerald-300 text-emerald-800 font-medium'
                          : 'bg-white border-slate-200 text-slate-500 line-through'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => {}}
                        className="hidden"
                      />
                      <span>{isChecked ? '✓' : '✕'}</span>
                      <span>{item.label}</span>
                    </label>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Pricing & Estimation Section */}
          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/80 space-y-3">
            <span className="font-semibold text-slate-800 text-xs block">
              3. ค่าบริการ ระยะเวลา และการรับประกัน
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-600 mb-1 font-medium">
                  ค่าอะไหล่ (บาท)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="0"
                    step="50"
                    value={sparePartCost}
                    onChange={(e) => setSparePartCost(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-800 font-mono text-sm focus:outline-none focus:border-indigo-600"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs">บาท</span>
                </div>
              </div>

              <div>
                <label className="block text-slate-600 mb-1 font-medium">
                  ค่าแรงช่าง (บาท)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="0"
                    step="50"
                    value={laborCost}
                    onChange={(e) => setLaborCost(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-800 font-mono text-sm focus:outline-none focus:border-indigo-600"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs">บาท</span>
                </div>
              </div>
            </div>

            {/* Total calculation banner */}
            <div className="flex items-center justify-between p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-900">
              <span className="font-medium text-xs">ราคารวมสุทธิประเมิน (ค่าอะไหล่ + ค่าแรง):</span>
              <span className="text-base font-bold font-mono tabular-nums text-emerald-700">
                {formatCurrency(totalCost)} บาท
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-slate-600 mb-1 font-medium">
                  ระยะเวลาซ่อมประเมิน <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  placeholder="เช่น 3 ชั่วโมง, 1-2 วัน"
                  className={`w-full px-3 py-2 bg-white border rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 ${
                    errors.duration ? 'border-rose-400' : 'border-slate-300 focus:border-indigo-600'
                  }`}
                />
                {errors.duration && (
                  <p className="text-rose-500 text-[11px] mt-0.5">{errors.duration}</p>
                )}
              </div>

              <div>
                <label className="block text-slate-600 mb-1 font-medium">
                  ประกันหลังซ่อม
                </label>
                <select
                  value={warranty}
                  onChange={(e) => setWarranty(e.target.value as WarrantyOption)}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-800 focus:outline-none focus:border-indigo-600 cursor-pointer"
                >
                  {warrantyOptions.map((w) => (
                    <option key={w} value={w}>
                      {w}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-600 mb-1 font-medium">
                  สถานะงานซ่อม
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as RepairStatus)}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-800 font-semibold focus:outline-none focus:border-indigo-600 cursor-pointer"
                >
                  {statusOptions.map((st) => (
                    <option key={st} value={st}>
                      {st}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Technician Notes */}
          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/80 space-y-3">
            <span className="font-semibold text-slate-800 text-xs block">
              4. บันทึกภายในสำหรับช่าง (Technician Note)
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-600 mb-1 font-medium">
                  ชื่อช่างผู้รับผิดชอบ
                </label>
                <input
                  type="text"
                  value={technicianName}
                  onChange={(e) => setTechnicianName(e.target.value)}
                  placeholder="เช่น ช่างบอย, ช่างเอก"
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-800 focus:outline-none focus:border-indigo-600"
                />
              </div>

              <div>
                <label className="block text-slate-600 mb-1 font-medium">
                  บันทึกการซ่อม / หมายเหตุอะไหล่
                </label>
                <input
                  type="text"
                  value={technicianNote}
                  onChange={(e) => setTechnicianNote(e.target.value)}
                  placeholder="เช่น ใช้จอเกรดแท้, เช็ค Face ID ปกติ"
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-800 focus:outline-none focus:border-indigo-600"
                />
              </div>
            </div>
          </div>

          {/* Footer Action */}
          <div className="pt-2 flex items-center justify-end gap-3 shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 rounded-lg transition-colors shadow-sm shadow-indigo-200 cursor-pointer"
            >
              {initialData ? 'บันทึกการแก้ไข' : 'บันทึกและออกใบรับซ่อม'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
