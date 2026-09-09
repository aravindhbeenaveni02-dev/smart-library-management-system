/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { LibraryProvider, useLibrary } from './context/LibraryContext';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { DashboardView } from './components/DashboardView';
import { CatalogView } from './components/CatalogView';
import { CirculationView } from './components/CirculationView';
import { MembersView } from './components/MembersView';
import { StudentPortalView } from './components/StudentPortalView';
import { ReportsView } from './components/ReportsView';
import { SettingsView } from './components/SettingsView';
import { AddBookModal } from './components/AddBookModal';
import { RegisterMemberModal } from './components/RegisterMemberModal';
import { BookDetailModal } from './components/BookDetailModal';
import { PaymentModal } from './components/PaymentModal';
import { QuickSearchModal } from './components/QuickSearchModal';
import { EditProfileModal } from './components/EditProfileModal';
import { ViewProfileModal } from './components/ViewProfileModal';
import { CheckCircle2, AlertTriangle, Info, X } from 'lucide-react';

const MainLayout: React.FC = () => {
  const { activeTab, toasts, removeToast } = useLibrary();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const renderActiveView = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardView />;
      case 'catalog':
        return <CatalogView />;
      case 'circulation':
        return <CirculationView />;
      case 'members':
        return <MembersView />;
      case 'student-view':
        return <StudentPortalView />;
      case 'reports':
        return <ReportsView />;
      case 'settings':
        return <SettingsView />;
      default:
        return <DashboardView />;
    }
  };

  return (
    <div className="min-h-screen bg-[#080c14] text-slate-100 font-body selection:bg-blue-600 selection:text-white flex">
      {/* 1. Fixed Left Sidebar */}
      <Sidebar 
        isMobileOpen={isMobileOpen}
        setIsMobileOpen={setIsMobileOpen}
        isCollapsed={isCollapsed}
        setIsCollapsed={setIsCollapsed}
      />

      {/* 2. Main Content Wrapper beside the sidebar */}
      <div className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ${
        isCollapsed ? 'md:ml-20' : 'md:ml-64'
      }`}>
        {/* Top Header */}
        <Header 
          onToggleMobileSidebar={() => setIsMobileOpen(prev => !prev)}
          isSidebarCollapsed={isCollapsed}
          onToggleSidebarCollapse={() => setIsCollapsed(prev => !prev)}
        />

        {/* Main Content Stage */}
        <main className="flex-1 w-full p-4 md:p-6 max-w-7xl mx-auto animate-in fade-in duration-150">
          {renderActiveView()}
        </main>

        {/* Enterprise Bottom Footer */}
        <footer className="border-t border-[#1e293b] bg-[#090d16] py-5 px-6 text-xs text-slate-400 mt-auto">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-300">Smart Library Management System</span>
              <span>•</span>
              <span className="text-slate-400">Enterprise ILS Architecture</span>
            </div>

            <div className="flex items-center gap-4 text-[11px] font-code">
              <span>RFID: <strong className="text-emerald-400">Online</strong></span>
              <span>•</span>
              <span>MongoDB Shard: <strong className="text-blue-400">Cluster 01</strong></span>
              <span>•</span>
              <span className="text-slate-400">Academic Fall Term</span>
            </div>
          </div>
        </footer>
      </div>

      {/* Global Interactive Modals */}
      <AddBookModal />
      <RegisterMemberModal />
      <BookDetailModal />
      <PaymentModal />
      <QuickSearchModal />
      <EditProfileModal />
      <ViewProfileModal />

      {/* Toast Notification Stack */}
      {toasts.length > 0 && (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
          {toasts.map((toast) => (
            <aside 
              key={toast.id}
              aria-label="Notification"
              className="pointer-events-auto bg-[#0d1424] text-slate-100 p-3.5 rounded-2xl shadow-2xl border border-blue-500/30 flex items-center justify-between gap-3 animate-in slide-in-from-bottom-3 fade-in duration-200"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                {toast.type === 'success' && <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />}
                {toast.type === 'error' && <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0" />}
                {toast.type === 'info' && <Info className="w-5 h-5 text-blue-400 shrink-0" />}
                {toast.type === 'warning' && <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />}
                <p className="text-xs font-medium text-slate-200 truncate">{toast.message}</p>
              </div>
              <button 
                onClick={() => removeToast(toast.id)}
                aria-label="Dismiss notification"
                className="text-slate-400 hover:text-white p-1 rounded-lg transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </aside>
          ))}
        </div>
      )}
    </div>
  );
};

export default function App() {
  return (
    <LibraryProvider>
      <MainLayout />
    </LibraryProvider>
  );
}

