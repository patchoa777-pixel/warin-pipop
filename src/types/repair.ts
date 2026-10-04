export type RepairStatus = 'กำลังซ่อม' | 'รออะไหล่' | 'ซ่อมเสร็จแล้ว' | 'ส่งมอบแล้ว';

export type WarrantyOption = 'ไม่มีประกัน' | '1 เดือน' | '3 เดือน' | '6 เดือน' | '1 ปี';

export interface DeviceChecklist {
  powerOn: boolean;
  touchScreen: boolean;
  camera: boolean;
  speakerMic: boolean;
  wifiSignal: boolean;
  charging: boolean;
}

export interface RepairItem {
  id: string;
  customerName: string;
  phone: string;
  brand: string;
  model: string;
  symptom: string;
  sparePartCost: number;
  laborCost: number;
  duration: string;
  warranty: string;
  status: RepairStatus;
  receiveDate: string; // ISO string
  completedDate?: string;
  deliveredDate?: string;
  passcode?: string;
  technicianName?: string;
  technicianNote?: string;
  checklist?: DeviceChecklist;
}

export interface ShopInfo {
  name: string;
  phone: string;
  address: string;
  lineId: string;
  taxId?: string;
}
