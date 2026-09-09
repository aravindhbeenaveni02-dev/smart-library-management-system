import React from 'react';
import { useLibrary } from '../context/LibraryContext';
import { APP_EMBLEM_URL } from '../data/initialData';
import { 
  LayoutDashboard, 
  BookOpen, 
  RefreshCw, 
  Users, 
  BarChart3, 
  Settings, 
  GraduationCap, 
  ShieldCheck, 
  LogOut, 
  Database, 
  X, 
  ChevronRight,
  Sparkles,
  Edit3
} from 'lucide-react';

interface SidebarProps {
  isMobileOpen: boolean;
  setIsMobileOpen: (open: boolean) => void;
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isMobileOpen,
  setIsMobileOpen,
  isCollapsed,
  setIsCollapsed,
}) => {
  const { 
    activeTab, 
    setActiveTab, 
    currentUser, 
    switchUserRole, 
    setIsEditProfileModalOpen,
    setIsViewProfileModalOpen,
    books, 
    members, 
    vitals 
  } = useLibrary();

  const navItems = [
    { 
      id: 'dashboard', 
      label: 'Dashboard', 
      icon: LayoutDashboard,
      badge: null
    },
    { 
      id: 'catalog', 
      label: 'Catalog / Books', 
      icon: BookOpen,
      badge: `${(books.length).toLocaleString()}`
    },
    { 
      id: 'circulation', 
      label: 'Circulation', 
      icon: RefreshCw,
      badge: vitals.overdueItems > 0 ? `${vitals.overdueItems} due` : null,
      badgeColor: 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
    },
    { 
      id: 'members', 
      label: 'Members / Students', 
      icon: Users,
      badge: `${members.length}`
    },
    { 
      id: 'student-view', 
      label: 'Scholar Portal', 
      icon: GraduationCap,
      badge: 'ID Pass',
      badgeColor: 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
    },
    { 
      id: 'reports', 
      label: 'Reports & Analytics', 
      icon: BarChart3,
      badge: null
    },
    { 
      id: 'settings', 
      label: 'Settings & Policy', 
      icon: Settings,
      badge: null
    },
  ];

  const sidebarContent = (
    <div className="h-full flex flex-col justify-between bg-[#0b0f19] border-r border-[#1e293b] text-slate-300">
      {/* 1. Header / Branding */}
      <div>
        <div className="h-16 px-4 flex items-center justify-between border-b border-[#1e293b]">
          <div 
            onClick={() => {
              setActiveTab('dashboard');
              setIsMobileOpen(false);
            }}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-800 p-0.5 shadow-lg shadow-blue-500/20 flex items-center justify-center shrink-0">
              <div className="w-full h-full bg-[#0b0f19] rounded-[10px] flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-blue-400 group-hover:scale-110 transition-transform" />
              </div>
            </div>

            {(!isCollapsed || isMobileOpen) && (
              <div className="flex flex-col min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-sm text-white tracking-tight font-headline truncate">
                    Smart Library
                  </span>
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-blue-500/20 text-blue-400 border border-blue-500/30 uppercase tracking-wider">
                    LMS
                  </span>
                </div>
                <span className="text-[11px] text-slate-400 truncate">
                  Management System
                </span>
              </div>
            )}
          </div>

          {/* Mobile close button */}
          <button
            onClick={() => setIsMobileOpen(false)}
            className="md:hidden text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 2. Navigation Menu */}
        <div className="px-3 py-4 space-y-1">
          {(!isCollapsed || isMobileOpen) && (
            <p className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Library Operations
            </p>
          )}

          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setIsMobileOpen(false);
                }}
                title={item.label}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all group relative ${
                  isActive
                    ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-md shadow-blue-600/30 font-bold'
                    : 'text-slate-400 hover:text-white hover:bg-[#121929]'
                } ${isCollapsed && !isMobileOpen ? 'justify-center px-0' : ''}`}
              >
                <Icon className={`w-4 h-4 shrink-0 transition-colors ${
                  isActive ? 'text-white' : 'text-slate-400 group-hover:text-blue-400'
                }`} />

                {(!isCollapsed || isMobileOpen) && (
                  <span className="truncate flex-1 text-left">{item.label}</span>
                )}

                {(!isCollapsed || isMobileOpen) && item.badge && (
                  <span className={`px-2 py-0.5 rounded-md text-[10px] font-code font-bold ${
                    item.badgeColor || (isActive ? 'bg-blue-800 text-blue-100' : 'bg-[#182234] text-slate-300 border border-[#1e293b]')
                  }`}>
                    {item.badge}
                  </span>
                )}

                {isActive && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-blue-300 rounded-r-full"></span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Footer / Role & System Status */}
      <div className="p-3 border-t border-[#1e293b] space-y-3">
        {/* System telemetry status pill */}
        {(!isCollapsed || isMobileOpen) && (
          <div className="p-2.5 rounded-xl bg-[#0e1422] border border-[#1e293b] space-y-1.5">
            <div className="flex items-center justify-between text-[11px]">
              <span className="flex items-center gap-1.5 text-slate-300 font-medium">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                MongoDB Shard #2
              </span>
              <span className="text-emerald-400 font-code text-[10px] font-bold">100% ONLINE</span>
            </div>
            <div className="flex items-center justify-between text-[10px] text-slate-400">
              <span>SIP2 RFID Gateway</span>
              <span className="font-code text-blue-400">Active</span>
            </div>
          </div>
        )}

        {/* User Card & Role Switcher */}
        <div className={`p-2 rounded-xl bg-[#0e1422] border border-[#1e293b] flex items-center gap-2.5 ${
          isCollapsed && !isMobileOpen ? 'justify-center p-1.5' : ''
        }`}>
          <button
            onClick={() => setIsViewProfileModalOpen(true)}
            className="shrink-0 relative group"
            title="View Profile"
          >
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-9 h-9 rounded-lg object-cover border border-blue-500/40 group-hover:border-blue-400 transition-colors"
            />
          </button>

          {(!isCollapsed || isMobileOpen) && (
            <div className="flex-1 min-w-0 text-left">
              <div className="flex items-center justify-between">
                <p className="text-xs font-bold text-white truncate">{currentUser.name}</p>
                {(currentUser.role === 'admin' || currentUser.role === 'librarian') && (
                  <button
                    onClick={() => setIsEditProfileModalOpen(true)}
                    className="p-1 rounded text-slate-400 hover:text-blue-400 hover:bg-[#1a253d] transition-colors"
                    title="Edit Profile"
                  >
                    <Edit3 className="w-3 h-3" />
                  </button>
                )}
              </div>
              <div className="flex items-center gap-1">
                <span className={`inline-block w-1.5 h-1.5 rounded-full ${
                  currentUser.role === 'admin' || currentUser.role === 'librarian' ? 'bg-blue-400' : 'bg-emerald-400'
                }`}></span>
                <span className="text-[10px] text-slate-400 truncate">
                  {currentUser.role === 'admin' ? 'System Admin' : currentUser.role === 'librarian' ? 'Chief Librarian' : 'Student Scholar'}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Switch Persona / Role Quick Action */}
        {(!isCollapsed || isMobileOpen) && (
          <button
            onClick={() => {
              if (currentUser.role === 'librarian' || currentUser.role === 'admin') {
                switchUserRole('student', 'STU-2022-78');
                setActiveTab('student-view');
              } else {
                switchUserRole('admin');
                setActiveTab('dashboard');
              }
            }}
            className="w-full py-2 px-3 rounded-xl bg-blue-600/15 hover:bg-blue-600/25 border border-blue-500/30 text-blue-400 hover:text-blue-300 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
          >
            {currentUser.role === 'librarian' || currentUser.role === 'admin' ? (
              <>
                <GraduationCap className="w-3.5 h-3.5" />
                <span>Switch to Student View</span>
              </>
            ) : (
              <>
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Switch to Admin Desk</span>
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Fixed Left Sidebar */}
      <aside className={`hidden md:block fixed top-0 left-0 bottom-0 z-30 transition-all duration-300 ${
        isCollapsed ? 'w-20' : 'w-64'
      }`}>
        {sidebarContent}
      </aside>

      {/* Mobile Slide-Over Drawer with Backdrop */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div 
            onClick={() => setIsMobileOpen(false)}
            className="fixed inset-0 bg-black/70 backdrop-blur-xs transition-opacity"
          ></div>
          <div className="relative w-72 max-w-[80vw] h-full shadow-2xl z-10 animate-in slide-in-from-left duration-200">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
};
