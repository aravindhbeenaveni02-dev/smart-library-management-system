import React from 'react';
import { 
  X, 
  User, 
  Mail, 
  Phone, 
  Building2, 
  ShieldCheck, 
  Edit3, 
  KeyRound, 
  CheckCircle2, 
  Calendar,
  Layers
} from 'lucide-react';
import { useLibrary } from '../context/LibraryContext';

export const ViewProfileModal: React.FC = () => {
  const { 
    isViewProfileModalOpen, 
    setIsViewProfileModalOpen, 
    setIsEditProfileModalOpen,
    adminProfile 
  } = useLibrary();

  if (!isViewProfileModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div 
        className="relative w-full max-w-lg bg-[#0d1424] border border-[#1e293b] rounded-2xl shadow-2xl overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200"
        id="admin-view-profile-modal"
      >
        {/* Modal Header */}
        <div className="p-5 border-b border-[#1e293b] flex items-center justify-between bg-gradient-to-r from-[#0d1424] via-[#121c33] to-[#0d1424]">
          <div className="flex items-center gap-2.5">
            <ShieldCheck className="w-5 h-5 text-blue-400" />
            <h3 className="text-base font-bold text-white tracking-tight">Institutional Profile Card</h3>
          </div>
          <button
            onClick={() => setIsViewProfileModalOpen(false)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-[#1a263f] transition-colors"
            aria-label="Close view profile modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 space-y-5">
          {/* Identity Header */}
          <div className="flex flex-col sm:flex-row items-center gap-4 p-4 rounded-2xl bg-[#080d19] border border-[#1e293b] text-center sm:text-left">
            <div className="relative">
              <img
                src={adminProfile.avatar}
                alt={adminProfile.name}
                className="w-20 h-20 rounded-2xl object-cover border-2 border-blue-500/70 shadow-lg shadow-blue-500/10"
              />
              <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-[#080d19]" title="Active Online" />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <h4 className="text-lg font-bold text-white tracking-tight">{adminProfile.name}</h4>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/20 text-blue-400 border border-blue-500/30">
                  {adminProfile.role === 'admin' ? 'Administrator' : 'Chief Librarian'}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1 font-mono">ID: {adminProfile.id}</p>
              <div className="flex items-center justify-center sm:justify-start gap-2 mt-2">
                <span className="flex items-center gap-1 text-[11px] text-emerald-400 font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{adminProfile.standing}</span>
                </span>
                <span className="text-slate-600">•</span>
                <span className="text-[11px] text-blue-400 font-medium">
                  Quota: {adminProfile.quotaLimit} Books
                </span>
              </div>
            </div>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3.5 rounded-xl bg-[#0a0f1c] border border-[#1e293b] space-y-1">
              <div className="flex items-center gap-1.5 text-slate-400 text-[11px]">
                <Mail className="w-3.5 h-3.5 text-blue-400" />
                <span>Institutional Email</span>
              </div>
              <p className="font-semibold text-white break-all">{adminProfile.email}</p>
            </div>

            <div className="p-3.5 rounded-xl bg-[#0a0f1c] border border-[#1e293b] space-y-1">
              <div className="flex items-center gap-1.5 text-slate-400 text-[11px]">
                <Phone className="w-3.5 h-3.5 text-blue-400" />
                <span>Contact Phone</span>
              </div>
              <p className="font-semibold text-white">{adminProfile.phone || '+1 (555) 234-8901'}</p>
            </div>

            <div className="p-3.5 rounded-xl bg-[#0a0f1c] border border-[#1e293b] space-y-1 sm:col-span-2">
              <div className="flex items-center gap-1.5 text-slate-400 text-[11px]">
                <Building2 className="w-3.5 h-3.5 text-blue-400" />
                <span>Assigned Department</span>
              </div>
              <p className="font-semibold text-white">{adminProfile.department || 'Library Systems & Technology Administration'}</p>
            </div>
          </div>

          {/* Security & Access Level */}
          <div className="p-3.5 rounded-xl bg-[#0a0f1c] border border-[#1e293b] space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <KeyRound className="w-4 h-4 text-blue-400" />
                <span className="text-xs font-bold text-slate-200">ILS Authorization Permissions</span>
              </div>
              <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                Tier 1 Root Access
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-300 pt-1">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                <span>Catalog Write & Deletion</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                <span>Circulation Overrides</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                <span>Dean Fine Waivers</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                <span>Audit & Report Generation</span>
              </div>
            </div>
          </div>

          {/* Modal Actions */}
          <div className="pt-3 border-t border-[#1e293b] flex items-center justify-end gap-3">
            <button
              onClick={() => setIsViewProfileModalOpen(false)}
              className="px-4 py-2.5 rounded-xl border border-[#1e293b] bg-[#121929] hover:bg-[#182236] text-slate-300 hover:text-white text-xs font-semibold transition-colors"
            >
              Close
            </button>
            <button
              onClick={() => {
                setIsViewProfileModalOpen(false);
                setIsEditProfileModalOpen(true);
              }}
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-lg shadow-blue-600/25 flex items-center gap-2 transition-all"
            >
              <Edit3 className="w-4 h-4" />
              <span>Edit Profile</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
