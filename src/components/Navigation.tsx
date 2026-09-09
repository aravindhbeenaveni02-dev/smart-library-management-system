import React from 'react';
import { useLibrary } from '../context/LibraryContext';
import { 
  LayoutDashboard, 
  BookOpen, 
  RefreshCw, 
  Users, 
  GraduationCap, 
  BarChart3, 
  Settings 
} from 'lucide-react';

interface NavItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  roleAllowed?: 'all' | 'librarian' | 'student';
}

export const Navigation: React.FC = () => {
  const { activeTab, setActiveTab, currentUser } = useLibrary();

  const navItems: NavItem[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'catalog', label: 'Catalog', icon: BookOpen },
    { id: 'circulation', label: 'Circulation', icon: RefreshCw },
    { id: 'members', label: 'Members', icon: Users },
    { id: 'student-view', label: 'Student View', icon: GraduationCap },
    { id: 'reports', label: 'Reports', icon: BarChart3 },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <>
      {/* Desktop Top Sub-Bar Navigation (Tablet & Desktop) */}
      <nav aria-label="Desktop navigation" className="hidden md:block bg-[#ffffff] border-b border-[#e2e8f0] px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-1 overflow-x-auto py-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-semibold transition-all ${
                    isActive
                      ? 'bg-[#0f2042] text-[#ffffff] shadow-xs'
                      : 'text-[#45464e] hover:text-[#0f2042] hover:bg-[#f2f4f6]'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-[#ffffff]' : 'text-[#465f88]'}`} />
                  <span>{item.label}</span>
                  {item.id === 'student-view' && currentUser.role === 'student' && (
                    <span className="w-2 h-2 rounded-full bg-[#059669] animate-pulse"></span>
                  )}
                </button>
              );
            })}
          </div>

          <div className="hidden lg:flex items-center gap-3 text-xs text-[#75777f]">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#059669]"></span>
              <span>RFID Gateways: Active</span>
            </span>
            <span>•</span>
            <span className="font-code">MongoDB Shard #2 (Online)</span>
          </div>
        </div>
      </nav>

      {/* Mobile Fixed Bottom Navigation Bar (matches user mockup precisely!) */}
      <nav 
        aria-label="Mobile navigation" 
        className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-[#ffffff]/90 backdrop-blur-xl border-t border-[#e2e8f0] shadow-[0_-2px_12px_rgba(15,32,66,0.06)] pb-safe"
      >
        <div className="flex justify-around items-center h-16 max-w-md mx-auto px-1">
          {navItems.slice(0, 5).map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex flex-col items-center justify-center w-14 h-12 gap-0.5 transition-colors ${
                  isActive
                    ? 'text-[#0f2042] font-bold'
                    : 'text-[#75777f] hover:text-[#0f2042]'
                }`}
              >
                <div className="relative">
                  <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5px]' : 'stroke-2'}`} />
                  {item.id === 'student-view' && currentUser.role === 'student' && (
                    <span className="absolute -top-0.5 -right-1 w-2 h-2 rounded-full bg-[#059669]"></span>
                  )}
                </div>
                <span className="text-[11px] leading-tight truncate">
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </nav>
    </>
  );
};
