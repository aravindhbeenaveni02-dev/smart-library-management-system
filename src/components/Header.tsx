import React, { useState, useRef, useEffect } from 'react';
import { useLibrary } from '../context/LibraryContext';
import { 
  Menu, 
  Search, 
  Bell, 
  ChevronDown, 
  ShieldCheck, 
  GraduationCap, 
  CheckCircle2, 
  LogOut, 
  Plus, 
  AlertTriangle, 
  Info, 
  RefreshCw, 
  Sparkles,
  User,
  Edit3,
  Settings,
  Eye
} from 'lucide-react';

interface HeaderProps {
  onToggleMobileSidebar: () => void;
  isSidebarCollapsed: boolean;
  onToggleSidebarCollapse: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onToggleMobileSidebar,
  isSidebarCollapsed,
  onToggleSidebarCollapse,
}) => {
  const { 
    currentUser, 
    adminProfile,
    switchUserRole, 
    logoutUser,
    setIsEditProfileModalOpen,
    setIsViewProfileModalOpen,
    notifications, 
    members, 
    setIsQuickSearchOpen, 
    setIsAddBookModalOpen,
    setActiveTab, 
    activeTab, 
    resetToSeedData, 
    showToast 
  } = useLibrary();

  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter(n => !n.read).length;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setIsNotifOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getPageTitle = () => {
    switch (activeTab) {
      case 'dashboard': return 'Dashboard Overview';
      case 'catalog': return 'Books Catalog';
      case 'circulation': return 'Circulation Desk';
      case 'members': return 'Students & Faculty Registry';
      case 'student-view': return 'Scholar Digital Portal';
      case 'reports': return 'Reports & Intelligence';
      case 'settings': return 'System Policies & Setup';
      default: return 'Library Operations';
    }
  };

  return (
    <header className="sticky top-0 w-full z-20 h-16 bg-[#090d16]/90 backdrop-blur-md border-b border-[#1e293b] px-4 md:px-6 flex items-center justify-between gap-4">
      {/* Left: Hamburger & Current View Breadcrumb */}
      <div className="flex items-center gap-3 min-w-0">
        <button
          onClick={onToggleMobileSidebar}
          className="md:hidden p-2 rounded-xl bg-[#121929] hover:bg-[#182234] border border-[#1e293b] text-slate-300 hover:text-white transition-colors"
          aria-label="Open Navigation Sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>

        <button
          onClick={onToggleSidebarCollapse}
          className="hidden md:flex lg:hidden p-2 rounded-xl bg-[#121929] hover:bg-[#182234] border border-[#1e293b] text-slate-300 hover:text-white transition-colors"
          aria-label="Toggle Sidebar Size"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex flex-col min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-blue-400 uppercase tracking-wider hidden sm:inline">
              Smart Library
            </span>
            <span className="text-xs text-slate-400 hidden sm:inline">/</span>
            <h1 className="font-bold text-sm md:text-base text-white truncate tracking-tight">
              {getPageTitle()}
            </h1>
          </div>
        </div>
      </div>

      {/* Center: Global Search Bar */}
      <div className="flex-1 max-w-md mx-2 hidden sm:block">
        <button
          onClick={() => setIsQuickSearchOpen(true)}
          className="w-full h-10 px-3.5 rounded-xl bg-[#0f172a] hover:bg-[#131c31] text-slate-400 hover:text-slate-200 flex items-center justify-between text-xs transition-all border border-[#1e293b] hover:border-blue-500/40 shadow-inner group"
        >
          <span className="flex items-center gap-2 truncate">
            <Search className="w-4 h-4 text-slate-400 group-hover:text-blue-400 transition-colors shrink-0" />
            <span className="truncate">Search catalog, accession, patron ID, author...</span>
          </span>
          <kbd className="font-code text-[11px] bg-[#1e293b] text-slate-300 px-2 py-0.5 rounded border border-slate-700 font-semibold shrink-0">
            ⌘K
          </kbd>
        </button>
      </div>

      {/* Right: Actions, Notifications & User Menu */}
      <div className="flex items-center gap-2.5 shrink-0">
        {/* Mobile Search Icon Trigger */}
        <button
          onClick={() => setIsQuickSearchOpen(true)}
          className="sm:hidden p-2 rounded-xl bg-[#0f172a] hover:bg-[#131c31] border border-[#1e293b] text-slate-300 hover:text-white"
          aria-label="Search Catalog"
        >
          <Search className="w-4 h-4" />
        </button>

        {/* Quick Add Book Action Button (Desktop) */}
        <button
          onClick={() => setIsAddBookModalOpen(true)}
          className="hidden lg:flex items-center gap-1.5 px-3 py-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white rounded-xl text-xs font-semibold shadow-md shadow-blue-600/20 transition-all active:scale-98"
        >
          <Plus className="w-4 h-4" />
          <span>Add Book</span>
        </button>

        {/* Notifications Popover */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setIsNotifOpen(prev => !prev)}
            aria-label="Notifications"
            className="relative p-2 rounded-xl bg-[#0f172a] hover:bg-[#131c31] border border-[#1e293b] text-slate-300 hover:text-white transition-colors"
          >
            <Bell className="w-4 h-4 text-slate-300" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-rose-600 text-white font-code text-[10px] flex items-center justify-center font-bold animate-pulse shadow-md shadow-rose-600/40">
                {unreadCount}
              </span>
            )}
          </button>

          {isNotifOpen && (
            <div className="absolute right-0 mt-2 w-80 md:w-96 rounded-2xl bg-[#0f172a] border border-[#1e293b] shadow-2xl p-3 z-50 animate-in fade-in slide-in-from-top-2 duration-150 text-slate-200">
              <div className="flex items-center justify-between pb-2 border-b border-[#1e293b] px-1">
                <span className="font-semibold text-white text-xs">Circulation Alerts &amp; Audits</span>
                <span className="text-[10px] font-code text-blue-400 bg-blue-500/10 border border-blue-500/20 px-2 py-0.5 rounded-full font-bold">
                  {unreadCount} Unresolved
                </span>
              </div>

              <div className="flex flex-col gap-2 mt-2 max-h-72 overflow-y-auto">
                {notifications.map(n => (
                  <div
                    key={n.id}
                    onClick={() => {
                      if (n.linkTab) setActiveTab(n.linkTab);
                      setIsNotifOpen(false);
                    }}
                    className="p-2.5 rounded-xl bg-[#121929] hover:bg-[#182234] border border-[#1e293b]/60 transition-colors cursor-pointer flex items-start gap-2.5 text-left"
                  >
                    <div className="p-1.5 rounded-lg bg-rose-500/20 text-rose-400 border border-rose-500/30 mt-0.5 shrink-0">
                      {n.type === 'alert' ? <AlertTriangle className="w-4 h-4" /> : <Info className="w-4 h-4 text-blue-400" />}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-white">{n.title}</span>
                        <span className="text-[10px] text-slate-400 font-code">{n.timestamp}</span>
                      </div>
                      <p className="text-[12px] text-slate-300 line-clamp-2 mt-0.5">{n.message}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User Profile / Persona Switcher */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => setIsProfileMenuOpen(prev => !prev)}
            className="flex items-center gap-2 p-1.5 rounded-xl bg-[#0f172a] hover:bg-[#131c31] border border-[#1e293b] transition-all"
          >
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-7 h-7 rounded-lg object-cover border border-blue-500/40 shrink-0"
            />
            <div className="hidden sm:flex flex-col text-left">
              <span className="text-xs font-bold text-white leading-none truncate max-w-[110px]">
                {currentUser.name}
              </span>
              <span className="text-[10px] text-blue-400 leading-tight">
                {currentUser.role === 'admin' || currentUser.role === 'librarian' ? 'Admin / Desk' : 'Scholar'}
              </span>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
          </button>

          {isProfileMenuOpen && (
            <div className="absolute right-0 mt-2 w-72 rounded-2xl bg-[#0f172a] border border-[#1e293b] shadow-2xl p-3 z-50 text-slate-200">
              {/* Profile Card Summary */}
              <div className="flex items-center gap-3 p-2.5 bg-[#121929] rounded-xl border border-[#1e293b]">
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="w-10 h-10 rounded-xl object-cover border border-blue-500/40 shrink-0"
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-bold text-white truncate">{currentUser.name}</p>
                    <span className="text-[9px] font-bold font-mono px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-400 border border-blue-500/30">
                      {currentUser.role === 'admin' || currentUser.role === 'librarian' ? 'ADMIN' : 'STUDENT'}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 truncate">{currentUser.email}</p>
                  <p className="text-[10px] text-emerald-400 font-medium truncate mt-0.5">
                    ● {currentUser.standing}
                  </p>
                </div>
              </div>

              {/* Requirement 4: Core Profile Menu Items */}
              <div className="py-2 border-b border-[#1e293b] space-y-1">
                <button
                  onClick={() => {
                    setIsProfileMenuOpen(false);
                    setIsViewProfileModalOpen(true);
                  }}
                  className="w-full text-left px-2.5 py-2 rounded-lg text-xs font-semibold flex items-center gap-2.5 text-slate-200 hover:text-white hover:bg-[#182236] transition-colors"
                >
                  <Eye className="w-4 h-4 text-blue-400" />
                  <span>View Profile</span>
                </button>

                <button
                  onClick={() => {
                    setIsProfileMenuOpen(false);
                    setIsEditProfileModalOpen(true);
                  }}
                  className="w-full text-left px-2.5 py-2 rounded-lg text-xs font-semibold flex items-center gap-2.5 text-slate-200 hover:text-white hover:bg-[#182236] transition-colors"
                >
                  <Edit3 className="w-4 h-4 text-blue-400" />
                  <span>Edit Profile</span>
                </button>

                <button
                  onClick={() => {
                    setIsProfileMenuOpen(false);
                    setActiveTab('settings');
                  }}
                  className="w-full text-left px-2.5 py-2 rounded-lg text-xs font-semibold flex items-center gap-2.5 text-slate-200 hover:text-white hover:bg-[#182236] transition-colors"
                >
                  <Settings className="w-4 h-4 text-slate-400" />
                  <span>Settings</span>
                </button>

                <button
                  onClick={() => {
                    setIsProfileMenuOpen(false);
                    logoutUser();
                  }}
                  className="w-full text-left px-2.5 py-2 rounded-lg text-xs font-semibold flex items-center gap-2.5 text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition-colors"
                >
                  <LogOut className="w-4 h-4 text-rose-400" />
                  <span>Logout</span>
                </button>
              </div>

              {/* Smart Library Quick Account / Persona Switcher */}
              <div className="pt-2">
                <div className="flex items-center justify-between px-2 mb-1.5">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Quick Persona Switcher
                  </p>
                  <span className="text-[9px] font-bold font-mono text-blue-400 bg-blue-500/10 px-1.5 py-0.5 rounded">
                    Active: {currentUser.name}
                  </span>
                </div>

                <button
                  onClick={() => {
                    switchUserRole('admin');
                    setIsProfileMenuOpen(false);
                    setActiveTab('dashboard');
                  }}
                  className={`w-full text-left px-2 py-1.5 rounded-lg text-xs flex items-center justify-between transition-colors mb-1 ${
                    currentUser.role === 'admin' || currentUser.role === 'librarian' 
                      ? 'bg-blue-600/25 font-bold text-blue-300 border border-blue-500/30' 
                      : 'hover:bg-[#121929] text-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-blue-400" />
                    <span>{adminProfile.name} (Admin Desk)</span>
                  </div>
                  {(currentUser.role === 'admin' || currentUser.role === 'librarian') && (
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-400" />
                  )}
                </button>

                {members.slice(0, 3).map(m => (
                  <button
                    key={m.id}
                    onClick={() => {
                      switchUserRole('student', m.id);
                      setIsProfileMenuOpen(false);
                      setActiveTab('student-view');
                    }}
                    className={`w-full text-left px-2 py-1.5 rounded-lg text-xs flex items-center justify-between transition-colors ${
                      currentUser.id === m.id ? 'bg-blue-600/25 font-bold text-blue-300 border border-blue-500/30' : 'hover:bg-[#121929] text-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      <GraduationCap className="w-4 h-4 text-slate-400 shrink-0" />
                      <span className="truncate">{m.name} ({m.rollNumber || 'Scholar'})</span>
                    </div>
                    {currentUser.id === m.id && <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 shrink-0" />}
                  </button>
                ))}
              </div>

              <div className="pt-2 mt-2 border-t border-[#1e293b]">
                <button
                  onClick={() => {
                    resetToSeedData();
                    setIsProfileMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-2 px-2 py-1.5 text-xs text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Reset Demo Database State</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
