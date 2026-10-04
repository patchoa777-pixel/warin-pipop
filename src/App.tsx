/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { Plus, Search, AlertCircle, RefreshCw, CheckCircle2, Trash2 } from 'lucide-react';
import { RepairItem, RepairStatus, ShopInfo } from './types/repair';
import {
  getSavedRepairs,
  saveRepairs,
  getSavedShopInfo,
  saveShopInfo,
  generateNextRepairId,
  INITIAL_REPAIRS,
} from './utils/storage';
import { TopNav } from './components/TopNav';
import { StatsCards } from './components/StatsCards';
import { FilterBar } from './components/FilterBar';
import { RepairCard } from './components/RepairCard';
import { RepairTable } from './components/RepairTable';
import { AddRepairModal } from './components/AddRepairModal';
import { PrintTicketModal } from './components/PrintTicketModal';
import { SummaryReportModal } from './components/SummaryReportModal';
import { ContactCustomerModal } from './components/ContactCustomerModal';
import { ShopSettingsModal } from './components/ShopSettingsModal';

export default function App() {
  const [repairs, setRepairs] = useState<RepairItem[]>([]);
  const [shopInfo, setShopInfo] = useState<ShopInfo>(getSavedShopInfo());
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('ทั้งหมด');
  const [selectedBrand, setSelectedBrand] = useState<string>('ทั้งหมด');
  const [sortBy, setSortBy] = useState<'date-desc' | 'date-asc' | 'cost-desc' | 'cost-asc'>('date-desc');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  // Modal States
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingRepair, setEditingRepair] = useState<RepairItem | null>(null);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);
  const [printingRepair, setPrintingRepair] = useState<RepairItem | null>(null);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [contactRepair, setContactRepair] = useState<RepairItem | null>(null);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Notification Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage((prev) => (prev === message ? null : prev));
    }, 3000);
  };

  // Load initial data
  useEffect(() => {
    const saved = getSavedRepairs();
    setRepairs(saved);
  }, []);

  // Update storage whenever repairs change
  const updateRepairs = (newRepairs: RepairItem[]) => {
    setRepairs(newRepairs);
    saveRepairs(newRepairs);
  };

  // Update shop settings
  const handleSaveShopInfo = (newInfo: ShopInfo) => {
    setShopInfo(newInfo);
    saveShopInfo(newInfo);
    showToast('บันทึกข้อมูลร้านค้าเรียบร้อยแล้ว');
  };

  // Add or Edit Repair
  const handleSaveRepair = (item: RepairItem) => {
    const existsIndex = repairs.findIndex((r) => r.id === item.id);
    if (existsIndex >= 0) {
      // Edit
      const updated = [...repairs];
      updated[existsIndex] = item;
      updateRepairs(updated);
      showToast(`อัพเดทรายการ ${item.id} เรียบร้อยแล้ว`);
    } else {
      // New
      const updated = [item, ...repairs];
      updateRepairs(updated);
      showToast('เพิ่มรายการซ่อมเรียบร้อยแล้ว');
    }
    setIsAddModalOpen(false);
    setEditingRepair(null);
  };

  // Quick Status Change
  const handleStatusChange = (id: string, newStatus: RepairStatus) => {
    const updated = repairs.map((r) => {
      if (r.id === id) {
        return {
          ...r,
          status: newStatus,
          completedDate: newStatus === 'ซ่อมเสร็จแล้ว' ? new Date().toISOString() : r.completedDate,
          deliveredDate: newStatus === 'ส่งมอบแล้ว' ? new Date().toISOString() : r.deliveredDate,
        };
      }
      return r;
    });
    updateRepairs(updated);
    showToast(`อัพเดทสถานะ ${id} เป็น "${newStatus}" แล้ว`);
  };

  // Delete
  const handleDeleteRepair = (id: string) => {
    const updated = repairs.filter((r) => r.id !== id);
    updateRepairs(updated);
    setDeleteConfirmId(null);
    showToast(`ลบรายการ ${id} เรียบร้อยแล้ว`);
  };

  // Reset to sample initial data
  const handleResetSampleData = () => {
    if (window.confirm('ต้องการรีเซ็ตข้อมูลตัวอย่างทั้งหมดกลับเป็นค่าเริ่มต้นหรือไม่?')) {
      updateRepairs(INITIAL_REPAIRS);
      showToast('รีเซ็ตข้อมูลตัวอย่างเรียบร้อยแล้ว');
    }
  };

  // Filter & Sort Logic
  const filteredRepairs = useMemo(() => {
    return repairs
      .filter((repair) => {
        const q = searchQuery.toLowerCase().trim();
        const matchesQuery =
          !q ||
          repair.id.toLowerCase().includes(q) ||
          repair.customerName.toLowerCase().includes(q) ||
          repair.phone.toLowerCase().includes(q) ||
          repair.brand.toLowerCase().includes(q) ||
          repair.model.toLowerCase().includes(q) ||
          repair.symptom.toLowerCase().includes(q);

        const matchesStatus =
          selectedStatus === 'ทั้งหมด' || repair.status === selectedStatus;

        const matchesBrand =
          selectedBrand === 'ทั้งหมด' ||
          repair.brand.toLowerCase() === selectedBrand.toLowerCase();

        return matchesQuery && matchesStatus && matchesBrand;
      })
      .sort((a, b) => {
        if (sortBy === 'date-desc') {
          return new Date(b.receiveDate).getTime() - new Date(a.receiveDate).getTime();
        }
        if (sortBy === 'date-asc') {
          return new Date(a.receiveDate).getTime() - new Date(b.receiveDate).getTime();
        }
        const totalA = a.sparePartCost + a.laborCost;
        const totalB = b.sparePartCost + b.laborCost;
        if (sortBy === 'cost-desc') {
          return totalB - totalA;
        }
        if (sortBy === 'cost-asc') {
          return totalA - totalB;
        }
        return 0;
      });
  }, [repairs, searchQuery, selectedStatus, selectedBrand, sortBy]);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col text-slate-900 pb-20 sm:pb-12">
      {/* Top Navigation */}
      <TopNav
        onOpenAddModal={() => {
          setEditingRepair(null);
          setIsAddModalOpen(true);
        }}
        onOpenReportModal={() => setIsReportModalOpen(true)}
        onOpenShopSettings={() => setIsSettingsModalOpen(true)}
        totalJobs={repairs.length}
      />

      {/* Main Content Viewport */}
      <main id="repair-list" className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Metric Cards */}
        <StatsCards
          repairs={repairs}
          activeFilter={selectedStatus}
          onSelectFilter={(status) => setSelectedStatus(status)}
        />

        {/* Filter & Search Bar */}
        <FilterBar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedStatus={selectedStatus}
          onStatusChange={setSelectedStatus}
          selectedBrand={selectedBrand}
          onBrandChange={setSelectedBrand}
          sortBy={sortBy}
          onSortChange={setSortBy}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          repairs={repairs}
        />

        {/* Repairs Display Area */}
        {filteredRepairs.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center shadow-xs">
            <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3 text-slate-400">
              <Search className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-800 mb-1">
              ไม่พบรายการซ่อมในระบบ
            </h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto mb-5">
              {searchQuery
                ? `ไม่พบข้อมูลที่ตรงกับคำค้นหา "${searchQuery}" ลองค้นหาด้วยชื่ออื่น หรือเคลียร์คำค้นหา`
                : 'ยังไม่มีรายการซ่อมในสถานะนี้ คุณสามารถออกใบรับซ่อมเครื่องใหม่ได้ทันที'}
            </p>
            <div className="flex items-center justify-center gap-3">
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="px-3.5 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
                >
                  ล้างคำค้นหา
                </button>
              )}
              <button
                onClick={() => {
                  setEditingRepair(null);
                  setIsAddModalOpen(true);
                }}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors shadow-sm shadow-indigo-200 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>รับเครื่องซ่อมใหม่</span>
              </button>
            </div>
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredRepairs.map((repair) => (
              <RepairCard
                key={repair.id}
                repair={repair}
                onEdit={(item) => {
                  setEditingRepair(item);
                  setIsAddModalOpen(true);
                }}
                onDelete={(id) => setDeleteConfirmId(id)}
                onPrint={(item) => {
                  setPrintingRepair(item);
                  setIsPrintModalOpen(true);
                }}
                onContact={(item) => {
                  setContactRepair(item);
                  setIsContactModalOpen(true);
                }}
                onStatusChange={handleStatusChange}
              />
            ))}
          </div>
        ) : (
          <RepairTable
            repairs={filteredRepairs}
            onEdit={(item) => {
              setEditingRepair(item);
              setIsAddModalOpen(true);
            }}
            onDelete={(id) => setDeleteConfirmId(id)}
            onPrint={(item) => {
              setPrintingRepair(item);
              setIsPrintModalOpen(true);
            }}
            onContact={(item) => {
              setContactRepair(item);
              setIsContactModalOpen(true);
            }}
            onStatusChange={handleStatusChange}
          />
        )}

        {/* Footer info & sample data reset */}
        <div className="mt-10 pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-3">
          <div className="flex items-center gap-2">
            <span>© {new Date().getFullYear()} {shopInfo.name}</span>
            <span>·</span>
            <span>ระบบบันทึกและออกใบรับซ่อม</span>
          </div>
          <button
            onClick={handleResetSampleData}
            className="inline-flex items-center gap-1 text-[11px] text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
          >
            <RefreshCw className="w-3 h-3" />
            <span>รีเซ็ตข้อมูลตัวอย่างระบบ</span>
          </button>
        </div>
      </main>

      {/* Floating Action Button (Mobile View, matches Flutter FAB) */}
      <div className="fixed bottom-5 right-5 sm:hidden z-40">
        <button
          onClick={() => {
            setEditingRepair(null);
            setIsAddModalOpen(true);
          }}
          className="flex items-center gap-2 px-4 py-3 bg-indigo-700 hover:bg-indigo-800 text-white rounded-full shadow-lg shadow-indigo-600/30 font-semibold text-xs active:scale-95 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>รับเครื่องซ่อมใหม่</span>
        </button>
      </div>

      {/* Add / Edit Repair Modal */}
      <AddRepairModal
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          setEditingRepair(null);
        }}
        onSave={handleSaveRepair}
        initialData={editingRepair}
        suggestedId={generateNextRepairId(repairs)}
      />

      {/* Print Ticket & Receipt Modal */}
      <PrintTicketModal
        isOpen={isPrintModalOpen}
        onClose={() => {
          setIsPrintModalOpen(false);
          setPrintingRepair(null);
        }}
        repair={printingRepair}
        shopInfo={shopInfo}
      />

      {/* Summary Report Modal */}
      <SummaryReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        repairs={repairs}
      />

      {/* Contact Customer Modal */}
      <ContactCustomerModal
        isOpen={isContactModalOpen}
        onClose={() => {
          setIsContactModalOpen(false);
          setContactRepair(null);
        }}
        repair={contactRepair}
        shopInfo={shopInfo}
      />

      {/* Shop Settings Modal */}
      <ShopSettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
        shopInfo={shopInfo}
        onSave={handleSaveShopInfo}
      />

      {/* Delete Confirmation Dialog */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl border border-slate-200">
            <div className="w-10 h-10 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mb-3">
              <Trash2 className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-1">
              ยืนยันการลบรายการซ่อม?
            </h3>
            <p className="text-xs text-slate-500 mb-5">
              คุณกำลังจะลบรายการใบรับซ่อม <strong className="font-mono text-slate-800">{deleteConfirmId}</strong> ออกจากระบบ การกระทำนี้ไม่สามารถย้อนกลับได้
            </p>
            <div className="flex items-center justify-end gap-2.5">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="px-3.5 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
              >
                ยกเลิก
              </button>
              <button
                onClick={() => handleDeleteRepair(deleteConfirmId)}
                className="px-4 py-2 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-lg transition-colors shadow-xs cursor-pointer"
              >
                ยืนยันการลบ
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification (Snack-bar style) */}
      {toastMessage && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 bg-slate-900 text-white px-4 py-2.5 rounded-xl shadow-xl border border-slate-800 text-xs font-medium animate-in fade-in slide-in-from-bottom-2 duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
