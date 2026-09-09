import React, { useState } from 'react';
import { useLibrary } from '../context/LibraryContext';
import { 
  Settings, 
  ShieldCheck, 
  Database, 
  Clock, 
  RotateCcw, 
  Bell, 
  Save, 
  Server, 
  Radio, 
  CheckCircle2, 
  RefreshCw, 
  Lock,
  User,
  Edit3,
  Mail,
  Phone,
  Building2
} from 'lucide-react';

export const SettingsView: React.FC = () => {
  const { 
    showToast, 
    resetToSeedData, 
    adminProfile, 
    setIsEditProfileModalOpen 
  } = useLibrary();

  const [loanPeriodDays, setLoanPeriodDays] = useState<number>(14);
  const [dailyFineAmount, setDailyFineAmount] = useState<number>(0.50);
  const [maxRenewals, setMaxRenewals] = useState<number>(2);
  const [studentQuota, setStudentQuota] = useState<number>(4);
  const [facultyQuota, setFacultyQuota] = useState<number>(8);
  const [autoSmsEnabled, setAutoSmsEnabled] = useState<boolean>(true);
  const [rfidFrequency, setRfidFrequency] = useState<string>('915 MHz (EPC Gen2)');

  const handleSavePolicy = (e: React.FormEvent) => {
    e.preventDefault();
    showToast('Library circulation policies synchronized across all terminals', 'success');
  };

  return (
    <div className="space-y-6">
      {/* 1. Header */}
      <div>
        <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight">
          System Policies &amp; Configuration
        </h2>
        <p className="text-xs md:text-sm text-slate-400 mt-1">
          Institutional lending rules, late return penalty rates, RFID frequencies, and administrator identity settings.
        </p>
      </div>

      {/* Admin Profile Overview Card */}
      <div className="p-5 rounded-2xl bg-[#0e1422] border border-[#1e293b] shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#1e293b]">
          <div className="flex items-center gap-2">
            <User className="w-5 h-5 text-blue-400" />
            <h3 className="font-bold text-sm md:text-base text-white">
              Administrator Profile &amp; Credentials
            </h3>
          </div>
          <button
            type="button"
            onClick={() => setIsEditProfileModalOpen(true)}
            className="px-3 py-1.5 rounded-xl bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/40 text-blue-400 hover:text-blue-300 text-xs font-bold flex items-center gap-1.5 transition-colors"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Edit Profile</span>
          </button>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 rounded-xl bg-[#080c14] border border-[#1e293b]">
          <img
            src={adminProfile.avatar}
            alt={adminProfile.name}
            className="w-16 h-16 rounded-2xl object-cover border-2 border-blue-500/50 shadow-md shadow-blue-500/10 shrink-0"
          />

          <div className="flex-1 min-w-0 space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <h4 className="text-base font-bold text-white">{adminProfile.name}</h4>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/20 text-blue-400 border border-blue-500/30">
                {adminProfile.role === 'admin' ? 'System Administrator' : 'Chief Librarian'}
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-emerald-500/15 text-emerald-400 border border-emerald-500/25">
                ● {adminProfile.standing}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1 text-xs text-slate-300">
              <div className="flex items-center gap-1.5 truncate">
                <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span className="truncate">{adminProfile.email}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span>{adminProfile.phone || '+1 (555) 234-8901'}</span>
              </div>
              <div className="flex items-center gap-1.5 truncate">
                <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span className="truncate">{adminProfile.department || 'Library Systems Administration'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Circulation Lending Rules Form */}
      <form onSubmit={handleSavePolicy} className="p-5 rounded-2xl bg-[#0e1422] border border-[#1e293b] shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#1e293b]">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-blue-400" />
            <h3 className="font-bold text-sm md:text-base text-white">
              Circulation Lending Rules &amp; Penalties
            </h3>
          </div>
          <span className="text-xs font-code text-blue-400 bg-blue-500/10 border border-blue-500/20 px-2 py-0.5 rounded-full font-bold">
            Policy v4.8 Active
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Standard Loan Duration (Days)
            </label>
            <input
              type="number"
              value={loanPeriodDays}
              onChange={(e) => setLoanPeriodDays(Number(e.target.value))}
              className="w-full px-3 py-2 bg-[#080c14] border border-[#1e293b] rounded-xl text-xs text-white focus:outline-none focus:border-blue-500 font-code"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Overdue Fine Rate ($/Day)
            </label>
            <input
              type="number"
              step="0.10"
              value={dailyFineAmount}
              onChange={(e) => setDailyFineAmount(Number(e.target.value))}
              className="w-full px-3 py-2 bg-[#080c14] border border-[#1e293b] rounded-xl text-xs text-white focus:outline-none focus:border-blue-500 font-code"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Maximum Allowed Renewals
            </label>
            <input
              type="number"
              value={maxRenewals}
              onChange={(e) => setMaxRenewals(Number(e.target.value))}
              className="w-full px-3 py-2 bg-[#080c14] border border-[#1e293b] rounded-xl text-xs text-white focus:outline-none focus:border-blue-500 font-code"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Undergraduate Student Book Quota
            </label>
            <input
              type="number"
              value={studentQuota}
              onChange={(e) => setStudentQuota(Number(e.target.value))}
              className="w-full px-3 py-2 bg-[#080c14] border border-[#1e293b] rounded-xl text-xs text-white focus:outline-none focus:border-blue-500 font-code"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Faculty / Researcher Book Quota
            </label>
            <input
              type="number"
              value={facultyQuota}
              onChange={(e) => setFacultyQuota(Number(e.target.value))}
              className="w-full px-3 py-2 bg-[#080c14] border border-[#1e293b] rounded-xl text-xs text-white focus:outline-none focus:border-blue-500 font-code"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Automated SMS/Email Dispatch
            </label>
            <button
              type="button"
              onClick={() => setAutoSmsEnabled(prev => !prev)}
              className={`w-full py-2 px-3 rounded-xl border text-xs font-semibold transition-all flex items-center justify-between ${
                autoSmsEnabled
                  ? 'bg-blue-600/20 text-blue-300 border-blue-500/40'
                  : 'bg-[#080c14] text-slate-400 border-[#1e293b]'
              }`}
            >
              <span>{autoSmsEnabled ? 'Enabled (Automated)' : 'Disabled (Manual)'}</span>
              <span className={`w-2 h-2 rounded-full ${autoSmsEnabled ? 'bg-blue-400' : 'bg-slate-500'}`}></span>
            </button>
          </div>
        </div>

        <div className="pt-2 flex justify-end">
          <button
            type="submit"
            className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white rounded-xl text-xs font-bold shadow-lg shadow-blue-600/25 flex items-center gap-1.5 transition-all"
          >
            <Save className="w-4 h-4" />
            <span>Save &amp; Publish Policies</span>
          </button>
        </div>
      </form>

      {/* 3. Infrastructure & Telemetry Diagnostics */}
      <div className="p-5 rounded-2xl bg-[#0e1422] border border-[#1e293b] shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#1e293b]">
          <div className="flex items-center gap-2">
            <Server className="w-5 h-5 text-emerald-400" />
            <h3 className="font-bold text-sm md:text-base text-white">
              Hardware Gateways &amp; Cluster Telemetry
            </h3>
          </div>
          <span className="text-xs text-emerald-400 font-code font-semibold flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" /> All Services Operational
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-3.5 rounded-xl bg-[#080c14] border border-[#1e293b] space-y-1">
            <span className="text-[11px] text-slate-400">RFID Protocol</span>
            <div className="text-sm font-bold text-white font-code">SIP2 / NCIP 2.0</div>
            <p className="text-[10px] text-slate-500">Frequency: 915 MHz EPC Gen2</p>
          </div>

          <div className="p-3.5 rounded-xl bg-[#080c14] border border-[#1e293b] space-y-1">
            <span className="text-[11px] text-slate-400">Database Engine</span>
            <div className="text-sm font-bold text-white font-code">MongoDB 7.0 Cluster</div>
            <p className="text-[10px] text-slate-500">Replica Set 3 Nodes • 0.8ms Ping</p>
          </div>

          <div className="p-3.5 rounded-xl bg-[#080c14] border border-[#1e293b] space-y-1">
            <span className="text-[11px] text-slate-400">Turnstile Gateways</span>
            <div className="text-sm font-bold text-emerald-400 font-code">4 / 4 Synced</div>
            <p className="text-[10px] text-slate-500">North &amp; South Reading Halls</p>
          </div>
        </div>

        {/* Reset Demo State Button */}
        <div className="pt-2 flex items-center justify-between">
          <span className="text-xs text-slate-400">Want to restore initial library records and seed transactions?</span>
          <button
            onClick={() => {
              if (window.confirm('Reset catalog and circulation records to default state?')) {
                resetToSeedData();
              }
            }}
            className="px-4 py-2 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/30 text-rose-400 text-xs font-bold flex items-center gap-1.5 transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reset Demo Database</span>
          </button>
        </div>
      </div>
    </div>
  );
};
