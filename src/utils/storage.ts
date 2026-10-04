import { RepairItem, ShopInfo } from '../types/repair';

const STORAGE_KEY = 'repair_shop_pro_items_v1';
const SHOP_INFO_KEY = 'repair_shop_pro_info_v1';

export const DEFAULT_SHOP_INFO: ShopInfo = {
  name: 'ศูนย์ซ่อมมือถือด่วน Pro Mobile Service',
  phone: '089-999-8877',
  address: 'เลขที่ 128/4 ชั้น 2 อาคารไอทีมอลล์ ถ.สุขุมวิท แขวงคลองเตย เขตคลองเตย กรุงเทพฯ 10110',
  lineId: '@promobilerepair',
  taxId: '0105556012345',
};

export const INITIAL_REPAIRS: RepairItem[] = [
  {
    id: 'REC-2026-001',
    customerName: 'คุณสมชาย ใจดี',
    phone: '081-234-5678',
    brand: 'Apple',
    model: 'iPhone 13',
    symptom: 'จอแตก ทัชสกรีนไม่ได้',
    sparePartCost: 3500.0,
    laborCost: 500.0,
    duration: '1-2 วัน',
    warranty: '3 เดือน',
    status: 'กำลังซ่อม',
    receiveDate: '2026-10-02T10:30:00.000Z',
    passcode: '123456',
    technicianName: 'ช่างบอย',
    technicianNote: 'เปลี่ยนจอแท้ OLED ตรวจสอบ Face ID ใช้งานได้ปกติ',
    checklist: {
      powerOn: true,
      touchScreen: false,
      camera: true,
      speakerMic: true,
      wifiSignal: true,
      charging: true,
    },
  },
  {
    id: 'REC-2026-002',
    customerName: 'คุณ Suda App',
    phone: '089-876-5432',
    brand: 'Samsung',
    model: 'Galaxy S22',
    symptom: 'แบตเสื่อม ชาร์จไม่เข้า',
    sparePartCost: 1200.0,
    laborCost: 300.0,
    duration: '3 ชั่วโมง',
    warranty: '6 เดือน',
    status: 'ซ่อมเสร็จแล้ว',
    receiveDate: '2026-10-03T09:15:00.000Z',
    completedDate: '2026-10-03T12:00:00.000Z',
    passcode: '0987',
    technicianName: 'ช่างเอก',
    technicianNote: 'เปลี่ยนแบตเตอรี่แท้ 3700mAh ทดสอบกระแสชาร์จ 25W Fast Charge ปกติ',
    checklist: {
      powerOn: true,
      touchScreen: true,
      camera: true,
      speakerMic: true,
      wifiSignal: true,
      charging: false,
    },
  },
  {
    id: 'REC-2026-003',
    customerName: 'คุณวิภาดา สร้อยทอง',
    phone: '095-443-8899',
    brand: 'Xiaomi',
    model: 'Redmi Note 12 Pro',
    symptom: 'โดนน้ำตกสระว่ายน้ำ เปิดไม่ติด เครื่องร้อนผิดปกติ',
    sparePartCost: 1800.0,
    laborCost: 700.0,
    duration: '2-3 วัน',
    warranty: '1 เดือน',
    status: 'รออะไหล่',
    receiveDate: '2026-10-03T14:40:00.000Z',
    passcode: 'ไม่มี (สแกนนิ้ว)',
    technicianName: 'ช่างบอย',
    technicianNote: 'ล้างบอร์ด ultrasonic แล้ว ต้องรอเปลี่ยน IC ชาร์จ PMIC ตัวใหม่จากสต็อกศูนย์',
    checklist: {
      powerOn: false,
      touchScreen: false,
      camera: false,
      speakerMic: false,
      wifiSignal: false,
      charging: false,
    },
  },
  {
    id: 'REC-2026-004',
    customerName: 'คุณกิตติศักดิ์ พรหมมา',
    phone: '086-112-9900',
    brand: 'OPPO',
    model: 'Reno 8 5G',
    symptom: 'กระจกเลนส์กล้องหลังแตก ถ่ายรูปเบลอ ฝาหลังมีรอยร้าว',
    sparePartCost: 850.0,
    laborCost: 400.0,
    duration: '1 วัน',
    warranty: '3 เดือน',
    status: 'ส่งมอบแล้ว',
    receiveDate: '2026-10-01T11:00:00.000Z',
    completedDate: '2026-10-02T13:30:00.000Z',
    deliveredDate: '2026-10-02T17:00:00.000Z',
    passcode: '4321',
    technicianName: 'ช่างเอก',
    technicianNote: 'เปลี่ยนเลนส์กล้อง + ฝาหลังแท้สี Shimmer Gold ส่งมอบพร้อมใบรับประกันและของแถมฟิล์ม',
    checklist: {
      powerOn: true,
      touchScreen: true,
      camera: false,
      speakerMic: true,
      wifiSignal: true,
      charging: true,
    },
  },
  {
    id: 'REC-2026-005',
    customerName: 'คุณณัฐพล ธนทรัพย์',
    phone: '092-777-3322',
    brand: 'iPad',
    model: 'iPad Air 5 (M1)',
    symptom: 'พอร์ต Type-C หลวม ชาร์จไฟเข้าช้า ต้องเอียงสาย',
    sparePartCost: 1400.0,
    laborCost: 600.0,
    duration: '1 วัน',
    warranty: '6 เดือน',
    status: 'กำลังซ่อม',
    receiveDate: '2026-10-04T08:20:00.000Z',
    passcode: '9988',
    technicianName: 'ช่างบอย',
    technicianNote: 'ซ่อมเปลี่ยนแพรพอร์ตชาร์จ Type-C แท้',
    checklist: {
      powerOn: true,
      touchScreen: true,
      camera: true,
      speakerMic: true,
      wifiSignal: true,
      charging: false,
    },
  },
];

export function getSavedRepairs(): RepairItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      saveRepairs(INITIAL_REPAIRS);
      return INITIAL_REPAIRS;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : INITIAL_REPAIRS;
  } catch {
    return INITIAL_REPAIRS;
  }
}

export function saveRepairs(items: RepairItem[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch (err) {
    console.error('Failed to save repairs to localStorage', err);
  }
}

export function getSavedShopInfo(): ShopInfo {
  try {
    const raw = localStorage.getItem(SHOP_INFO_KEY);
    if (!raw) return DEFAULT_SHOP_INFO;
    return JSON.parse(raw);
  } catch {
    return DEFAULT_SHOP_INFO;
  }
}

export function saveShopInfo(info: ShopInfo): void {
  try {
    localStorage.setItem(SHOP_INFO_KEY, JSON.stringify(info));
  } catch (err) {
    console.error('Failed to save shop info to localStorage', err);
  }
}

export function generateNextRepairId(existingItems: RepairItem[]): string {
  const currentYear = new Date().getFullYear();
  const yearPrefix = `REC-${currentYear}-`;
  
  // Find highest number with this year prefix
  let maxNum = 0;
  for (const item of existingItems) {
    if (item.id.startsWith(yearPrefix)) {
      const numPart = item.id.replace(yearPrefix, '');
      const num = parseInt(numPart, 10);
      if (!isNaN(num) && num > maxNum) {
        maxNum = num;
      }
    }
  }

  const nextNum = (maxNum + 1).toString().padStart(3, '0');
  return `${yearPrefix}${nextNum}`;
}
