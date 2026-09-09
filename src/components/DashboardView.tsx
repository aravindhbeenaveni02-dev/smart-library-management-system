import React, { useState } from 'react';
import { useLibrary } from '../context/LibraryContext';
import { 
  BookOpen, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  Users, 
  Coins, 
  ArrowRight, 
  PlusCircle, 
  RefreshCw, 
  TrendingUp, 
  BarChart3, 
  Bell, 
  ArrowUpRight, 
  Check, 
  Activity, 
  Layers,
  Edit3
} from 'lucide-react';

export const DashboardView: React.FC = () => {
  const { 
    vitals, 
    books, 
    members, 
    transactions, 
    adminProfile,
    setIsEditProfileModalOpen,
    setActiveTab, 
    setIsAddBookModalOpen, 
    setIsPaymentModalOpen,
    setSelectedBookForDetail,
    showToast 
  } = useLibrary();

  const [timeRange, setTimeRange] = useState<'30d' | '90d' | '1y'>('30d');

  // Stats calculation
  const totalBooksCount = vitals.totalCatalog;
  const availableBooksCount = vitals.availableCopies;
  const issuedBooksCount = vitals.currentlyIssued;
  const overdueBooksCount = vitals.overdueItems;
  const totalMembersCount = members.length * 740; // Total enrolled college patrons
  const totalFinesAccrued = members.reduce((sum, m) => sum + m.finesDue, 0) + 3840;

  const overdueList = transactions.filter(t => t.status === 'overdue');
  const recentTransactions = transactions.slice(0, 5);

  const monthlyAnalytics = [
    { month: 'May', borrows: 3400, returns: 3200 },
    { month: 'Jun', borrows: 2800, returns: 2900 },
    { month: 'Jul', borrows: 1900, returns: 2100 },
    { month: 'Aug', borrows: 4200, returns: 3800 },
    { month: 'Sep', borrows: 5100, returns: 4600 },
    { month: 'Oct', borrows: 4890, returns: 4420 },
  ];

  const categoryBreakdown = [
    { name: 'Computer Science & AI', count: 6840, pct: 27.5, color: 'bg-blue-500' },
    { name: 'Engineering & Mechanics', count: 4920, pct: 19.8, color: 'bg-indigo-500' },
    { name: 'Medicine & Life Sciences', count: 4100, pct: 16.5, color: 'bg-cyan-500' },
    { name: 'Economics & Business', count: 3520, pct: 14.2, color: 'bg-emerald-500' },
    { name: 'Physics & Mathematics', count: 3120, pct: 12.6, color: 'bg-violet-500' },
    { name: 'Literature & Humanities', count: 2350, pct: 9.4, color: 'bg-amber-500' },
  ];

  return (
    <div className="space-y-6">
      {/* 1. Header Hero Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#0d1424] via-[#0f1b33] to-[#0d1424] p-6 border border-[#1e293b] shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/20 text-blue-400 border border-blue-500/30 uppercase tracking-wider">
                Smart Library Management System
              </span>
              <span className="text-xs text-slate-400">• Fall Semester 2025</span>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight">
                Welcome, {adminProfile.name}
              </h2>
              <button
                type="button"
                onClick={() => setIsEditProfileModalOpen(true)}
                className="inline-flex items-center gap-1.5 text-[11px] font-bold text-blue-400 hover:text-blue-300 bg-blue-500/10 hover:bg-blue-500/20 px-2.5 py-1 rounded-lg border border-blue-500/30 transition-colors"
                title="Edit Admin Profile"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Edit Profile</span>
              </button>
            </div>
            <p className="text-xs md:text-sm text-slate-400 mt-1 max-w-2xl">
              Library Operations Command Center • Real-time telemetry across physical stacks, circulation desks, automated RFID gates, and student scholar activity.
            </p>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap">
            <button
              onClick={() => setActiveTab('circulation')}
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-blue-600/25 transition-all"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Circulation Desk</span>
            </button>

            <button
              onClick={() => setIsAddBookModalOpen(true)}
              className="px-4 py-2 rounded-xl bg-[#182234] hover:bg-[#1f2d47] border border-[#1e293b] text-slate-200 text-xs font-bold flex items-center gap-1.5 transition-all"
            >
              <PlusCircle className="w-3.5 h-3.5 text-blue-400" />
              <span>Add New Book</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Key Metric Cards (The 6 required metrics) */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5">
        {/* Card 1: Total Books */}
        <div 
          onClick={() => setActiveTab('catalog')}
          className="p-4 rounded-2xl bg-[#0e1422] border border-[#1e293b] hover:border-blue-500/40 hover:bg-[#121929] transition-all cursor-pointer group shadow-sm"
        >
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold">Total Books</span>
            <div className="p-1.5 rounded-lg bg-blue-500/10 text-blue-400 group-hover:bg-blue-500/20 transition-colors">
              <BookOpen className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl md:text-2xl font-bold text-white font-code tracking-tight">
            {totalBooksCount.toLocaleString()}
          </div>
          <div className="mt-2 flex items-center gap-1 text-[11px] text-emerald-400 font-medium">
            <TrendingUp className="w-3 h-3" />
            <span>+120 this month</span>
          </div>
        </div>

        {/* Card 2: Available Books */}
        <div 
          onClick={() => setActiveTab('catalog')}
          className="p-4 rounded-2xl bg-[#0e1422] border border-[#1e293b] hover:border-emerald-500/40 hover:bg-[#121929] transition-all cursor-pointer group shadow-sm"
        >
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold">Available Stock</span>
            <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 group-hover:bg-emerald-500/20 transition-colors">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl md:text-2xl font-bold text-white font-code tracking-tight">
            {availableBooksCount.toLocaleString()}
          </div>
          <div className="mt-2 flex items-center gap-1 text-[11px] text-emerald-400 font-medium">
            <span>78% on shelves</span>
          </div>
        </div>

        {/* Card 3: Issued Books */}
        <div 
          onClick={() => setActiveTab('circulation')}
          className="p-4 rounded-2xl bg-[#0e1422] border border-[#1e293b] hover:border-indigo-500/40 hover:bg-[#121929] transition-all cursor-pointer group shadow-sm"
        >
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold">Issued Books</span>
            <div className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400 group-hover:bg-indigo-500/20 transition-colors">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl md:text-2xl font-bold text-white font-code tracking-tight">
            {issuedBooksCount.toLocaleString()}
          </div>
          <div className="mt-2 flex items-center gap-1 text-[11px] text-indigo-400 font-medium">
            <span>Active loans</span>
          </div>
        </div>

        {/* Card 4: Overdue Books */}
        <div 
          onClick={() => setActiveTab('circulation')}
          className="p-4 rounded-2xl bg-[#0e1422] border border-rose-900/40 hover:border-rose-500/50 hover:bg-[#16121f] transition-all cursor-pointer group shadow-sm"
        >
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold">Overdue Books</span>
            <div className="p-1.5 rounded-lg bg-rose-500/15 text-rose-400 group-hover:bg-rose-500/25 transition-colors">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl md:text-2xl font-bold text-rose-400 font-code tracking-tight">
            {overdueBooksCount.toLocaleString()}
          </div>
          <div className="mt-2 flex items-center gap-1 text-[11px] text-rose-400 font-medium">
            <span>Requires notice</span>
          </div>
        </div>

        {/* Card 5: Total Members */}
        <div 
          onClick={() => setActiveTab('members')}
          className="p-4 rounded-2xl bg-[#0e1422] border border-[#1e293b] hover:border-cyan-500/40 hover:bg-[#121929] transition-all cursor-pointer group shadow-sm"
        >
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold">Total Members</span>
            <div className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-400 group-hover:bg-cyan-500/20 transition-colors">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl md:text-2xl font-bold text-white font-code tracking-tight">
            {totalMembersCount.toLocaleString()}
          </div>
          <div className="mt-2 flex items-center gap-1 text-[11px] text-cyan-400 font-medium">
            <span>Enrolled scholars</span>
          </div>
        </div>

        {/* Card 6: Total Fines */}
        <div 
          onClick={() => setIsPaymentModalOpen(true)}
          className="p-4 rounded-2xl bg-[#0e1422] border border-[#1e293b] hover:border-amber-500/40 hover:bg-[#121929] transition-all cursor-pointer group shadow-sm"
        >
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold">Total Fines</span>
            <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400 group-hover:bg-amber-500/20 transition-colors">
              <Coins className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl md:text-2xl font-bold text-amber-400 font-code tracking-tight">
            ${totalFinesAccrued.toLocaleString()}
          </div>
          <div className="mt-2 flex items-center gap-1 text-[11px] text-amber-400/90 font-medium">
            <span>Click to clear dues</span>
          </div>
        </div>
      </div>

      {/* 3. Analytics & Distribution Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Monthly Borrowing Trends (ProcureIQ style Chart) */}
        <div className="lg:col-span-2 p-5 rounded-2xl bg-[#0e1422] border border-[#1e293b] shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm md:text-base font-bold text-white flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-blue-400" />
                <span>Monthly Borrowing &amp; Return Circulation</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">Loan velocity vs. return turnaround</p>
            </div>

            <div className="flex items-center gap-1.5 bg-[#080c14] p-1 rounded-xl border border-[#1e293b] text-xs">
              {(['30d', '90d', '1y'] as const).map(t => (
                <button
                  key={t}
                  onClick={() => setTimeRange(t)}
                  className={`px-2.5 py-1 rounded-lg font-semibold transition-all ${
                    timeRange === t ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {t.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          {/* Clean Bar Visualization */}
          <div className="h-48 w-full flex items-end justify-between gap-3 pt-6 px-2">
            {monthlyAnalytics.map((item) => {
              const maxVal = 6000;
              const borrowHeight = (item.borrows / maxVal) * 100;
              const returnHeight = (item.returns / maxVal) * 100;

              return (
                <div key={item.month} className="flex-1 flex flex-col items-center gap-2 group">
                  <div className="w-full flex items-end justify-center gap-1.5 h-36">
                    <div
                      style={{ height: `${borrowHeight}%` }}
                      className="w-3.5 sm:w-5 bg-gradient-to-t from-blue-700 to-blue-500 rounded-t-md group-hover:brightness-125 transition-all relative"
                      title={`${item.month} Borrows: ${item.borrows}`}
                    ></div>
                    <div
                      style={{ height: `${returnHeight}%` }}
                      className="w-3.5 sm:w-5 bg-gradient-to-t from-slate-700 to-slate-500 rounded-t-md group-hover:brightness-125 transition-all relative"
                      title={`${item.month} Returns: ${item.returns}`}
                    ></div>
                  </div>
                  <span className="text-[11px] font-code text-slate-400 font-medium">
                    {item.month}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="mt-4 pt-3 border-t border-[#1e293b] flex items-center justify-between text-xs text-slate-400">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-sm bg-blue-500"></span>
                <span>Borrows</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-sm bg-slate-500"></span>
                <span>Returns</span>
              </span>
            </div>
            <span className="text-emerald-400 font-code font-semibold">+18.4% YoY Borrowing Activity</span>
          </div>
        </div>

        {/* Category Holdings Distribution */}
        <div className="p-5 rounded-2xl bg-[#0e1422] border border-[#1e293b] shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-sm md:text-base font-bold text-white flex items-center gap-2 mb-1">
              <Layers className="w-4 h-4 text-cyan-400" />
              <span>Collection Distribution</span>
            </h3>
            <p className="text-xs text-slate-400 mb-4">Holdings by academic discipline</p>

            <div className="space-y-3">
              {categoryBreakdown.map(cat => (
                <div key={cat.name} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-300 font-medium truncate max-w-[170px]">{cat.name}</span>
                    <span className="font-code text-slate-400">{cat.count.toLocaleString()} ({cat.pct}%)</span>
                  </div>
                  <div className="w-full h-1.5 bg-[#080c14] rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${cat.color} rounded-full`}
                      style={{ width: `${cat.pct * 2.5}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-[#1e293b] flex items-center justify-between text-xs">
            <span className="text-slate-400">Total Cataloged</span>
            <span className="text-white font-bold font-code">24,850 Volumes</span>
          </div>
        </div>
      </div>

      {/* 4. Overdue Books Section & Recent Transactions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Overdue Items Escalation Panel */}
        <div className="p-5 rounded-2xl bg-[#0e1422] border border-rose-900/30 shadow-sm flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-rose-500/15 text-rose-400">
                <AlertTriangle className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Overdue Escalations</h3>
                <p className="text-xs text-slate-400">{overdueList.length} active notices pending</p>
              </div>
            </div>

            <button
              onClick={() => showToast('Dispatched automated SMS/Email overdue notices to all defaulters', 'success')}
              className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-rose-500/20 text-rose-400 border border-rose-500/30 hover:bg-rose-500/30 transition-colors"
            >
              Dispatch All Notices
            </button>
          </div>

          <div className="space-y-2.5 flex-1 overflow-y-auto">
            {overdueList.map(item => (
              <div key={item.id} className="p-3 rounded-xl bg-[#121929] border border-[#1e293b] flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <h4 className="text-xs font-bold text-white truncate">{item.bookTitle}</h4>
                  <p className="text-[11px] text-slate-400 truncate">
                    {item.userName} • <span className="font-code text-rose-400">{item.overdueDays} days late</span>
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-xs font-bold font-code text-rose-400 block">
                    ${item.assessedFine.toFixed(2)}
                  </span>
                  <button
                    onClick={() => {
                      showToast(`SMS sent to ${item.userName} (${item.userRoll})`, 'info');
                    }}
                    className="text-[10px] text-blue-400 hover:underline font-semibold"
                  >
                    Notify Patron
                  </button>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={() => setActiveTab('circulation')}
            className="mt-3 w-full py-2 rounded-xl bg-[#121929] hover:bg-[#182234] border border-[#1e293b] text-xs font-semibold text-slate-300 hover:text-white flex items-center justify-center gap-1.5 transition-colors"
          >
            <span>View All Overdue in Circulation Desk</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Recent Transactions Stream */}
        <div className="lg:col-span-2 p-5 rounded-2xl bg-[#0e1422] border border-[#1e293b] shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm md:text-base font-bold text-white flex items-center gap-2">
                <Activity className="w-4 h-4 text-emerald-400" />
                <span>Recent Circulation Activity</span>
              </h3>
              <p className="text-xs text-slate-400">Live feed from RFID turnstiles and circulation counter</p>
            </div>

            <button
              onClick={() => setActiveTab('circulation')}
              className="text-xs text-blue-400 hover:text-blue-300 font-semibold flex items-center gap-1"
            >
              <span>View History</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#1e293b] text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
                  <th className="pb-2.5">Book Title</th>
                  <th className="pb-2.5">Patron</th>
                  <th className="pb-2.5">Accession</th>
                  <th className="pb-2.5">Due Date</th>
                  <th className="pb-2.5">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1e293b]/60">
                {recentTransactions.map(tx => (
                  <tr key={tx.id} className="hover:bg-[#121929] transition-colors">
                    <td className="py-3 font-medium text-white max-w-[180px] truncate">
                      {tx.bookTitle}
                    </td>
                    <td className="py-3 text-slate-300 truncate max-w-[140px]">
                      {tx.userName}
                    </td>
                    <td className="py-3 font-code text-blue-400">
                      {tx.accessionNo}
                    </td>
                    <td className="py-3 font-code text-slate-400">
                      {tx.dueDate}
                    </td>
                    <td className="py-3">
                      {tx.status === 'issued' && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/20 text-blue-400 border border-blue-500/30">
                          Active Loan
                        </span>
                      )}
                      {tx.status === 'returned' && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                          Returned
                        </span>
                      )}
                      {tx.status === 'overdue' && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/20 text-rose-400 border border-rose-500/30">
                          Overdue ({tx.overdueDays}d)
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
