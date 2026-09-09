import React from 'react';
import { useLibrary } from '../context/LibraryContext';
import { 
  BarChart3, 
  Download, 
  FileSpreadsheet, 
  BookOpen, 
  Users, 
  Clock, 
  Coins, 
  TrendingUp, 
  CheckCircle2, 
  AlertTriangle, 
  Award, 
  Layers 
} from 'lucide-react';

export const ReportsView: React.FC = () => {
  const { vitals, books, transactions, members, showToast } = useLibrary();

  const mostBorrowedBooks = [
    { rank: 1, title: 'Clean Code: A Handbook of Agile Software', author: 'Robert C. Martin', times: 412, discipline: 'Computer Science & AI', available: '3/5' },
    { rank: 2, title: 'Introduction to Algorithms (CLRS 4th Ed.)', author: 'Cormen, Leiserson, Rivest', times: 389, discipline: 'Computer Science & AI', available: '0/4' },
    { rank: 3, title: 'Campbell Biology (12th Edition)', author: 'Lisa A. Urry', times: 324, discipline: 'Medicine', available: '2/3' },
    { rank: 4, title: 'Principles of Neural Science (6th Edition)', author: 'Eric R. Kandel', times: 298, discipline: 'Medicine', available: '1/3' },
    { rank: 5, title: 'Shigley’s Mechanical Engineering Design', author: 'Richard Budynas', times: 275, discipline: 'Mechanical Eng', available: '4/4' },
  ];

  const mostActiveMembers = [
    { name: 'Laxman', roll: 'EE-2022-41', dept: 'Electrical Engineering', totalLoans: 28, onTimeRate: '100%' },
    { name: 'Mahesh', roll: 'CS-2022-78', dept: 'Comp. Sci & AI', totalLoans: 24, onTimeRate: '92%' },
    { name: 'Mahendar', roll: 'CS-2023-114', dept: 'Computer Science', totalLoans: 21, onTimeRate: '95%' },
    { name: 'Dr. Arthur Pendelton', roll: 'FAC-ENG-08', dept: 'Engineering Faculty', totalLoans: 39, onTimeRate: '100%' },
  ];

  const fineStatusBreakdown = [
    { label: 'Collected Dues (YTD)', amount: '$5,420.00', pct: 68, color: 'bg-emerald-500' },
    { label: 'Outstanding Active Dues', amount: '$1,420.00', pct: 21, color: 'bg-rose-500' },
    { label: 'Dean-Approved Fee Waivers', amount: '$850.00', pct: 11, color: 'bg-blue-500' },
  ];

  const exportReport = (format: 'CSV' | 'PDF') => {
    showToast(`Compiled & Exported Official Library Audit Report (${format})`, 'success');
  };

  return (
    <div className="space-y-6">
      {/* 1. Header & Export Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight">
            Library Intelligence &amp; Reports
          </h2>
          <p className="text-xs md:text-sm text-slate-400 mt-1">
            Collection turnover, patron compliance, overdue audits, and institutional circulation analytics.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => exportReport('CSV')}
            className="flex items-center gap-1.5 px-3 py-2 bg-[#0e1422] hover:bg-[#121929] border border-[#1e293b] text-slate-300 hover:text-white rounded-xl text-xs font-semibold shadow-sm transition-colors"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
            <span>Export CSV</span>
          </button>
          <button
            onClick={() => exportReport('PDF')}
            className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white rounded-xl text-xs font-bold shadow-lg shadow-blue-600/25 transition-all"
          >
            <Download className="w-4 h-4" />
            <span>Audit PDF</span>
          </button>
        </div>
      </div>

      {/* 2. Top Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-[#0e1422] border border-[#1e293b] shadow-sm">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold">Catalog Holdings</span>
            <BookOpen className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-2xl font-bold text-white font-code">24,850</div>
          <div className="mt-1 text-[11px] text-emerald-400 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" />
            <span>+120 added this month</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-[#0e1422] border border-[#1e293b] shadow-sm">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold">Active Members</span>
            <Users className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-bold text-white font-code">3,700</div>
          <div className="mt-1 text-[11px] text-cyan-400">98.4% good standing</div>
        </div>

        <div className="p-4 rounded-2xl bg-[#0e1422] border border-[#1e293b] shadow-sm">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold">Circulation Volume</span>
            <BarChart3 className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-2xl font-bold text-white font-code">4,890</div>
          <div className="mt-1 text-[11px] text-indigo-400">Loans this semester</div>
        </div>

        <div className="p-4 rounded-2xl bg-[#0e1422] border border-[#1e293b] shadow-sm">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold">Total Dues Collected</span>
            <Coins className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-bold text-white font-code">$5,420</div>
          <div className="mt-1 text-[11px] text-amber-400">Academic Year 2025</div>
        </div>
      </div>

      {/* 3. Most Borrowed Books & Active Members Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Most Borrowed Books Leaderboard */}
        <div className="p-5 rounded-2xl bg-[#0e1422] border border-[#1e293b] space-y-4 shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="text-sm md:text-base font-bold text-white flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-400" />
              <span>Most Borrowed Volumes (High Demand)</span>
            </h3>
            <span className="text-xs text-slate-400 font-code">Top 5</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#1e293b] text-slate-400 uppercase tracking-wider text-[10px]">
                  <th className="pb-2.5">Rank</th>
                  <th className="pb-2.5">Title &amp; Author</th>
                  <th className="pb-2.5">Loans</th>
                  <th className="pb-2.5 text-right">Available</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1e293b]/60">
                {mostBorrowedBooks.map(b => (
                  <tr key={b.rank} className="hover:bg-[#121929] transition-colors">
                    <td className="py-3 font-code font-bold text-blue-400">{b.rank}</td>
                    <td className="py-3">
                      <div className="font-bold text-white max-w-[200px] truncate">{b.title}</div>
                      <div className="text-[11px] text-slate-400 truncate">{b.author}</div>
                    </td>
                    <td className="py-3 font-code text-white font-bold">{b.times}</td>
                    <td className="py-3 text-right font-code text-slate-300">{b.available}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Most Active Borrowers */}
        <div className="p-5 rounded-2xl bg-[#0e1422] border border-[#1e293b] space-y-4 shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="text-sm md:text-base font-bold text-white flex items-center gap-2">
              <Users className="w-4 h-4 text-blue-400" />
              <span>Active Borrowers &amp; Compliance Rate</span>
            </h3>
            <span className="text-xs text-slate-400 font-code">Scholars</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#1e293b] text-slate-400 uppercase tracking-wider text-[10px]">
                  <th className="pb-2.5">Member</th>
                  <th className="pb-2.5">Department</th>
                  <th className="pb-2.5">Total Loans</th>
                  <th className="pb-2.5 text-right">On-Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1e293b]/60">
                {mostActiveMembers.map(m => (
                  <tr key={m.roll} className="hover:bg-[#121929] transition-colors">
                    <td className="py-3">
                      <div className="font-bold text-white">{m.name}</div>
                      <div className="text-[11px] font-code text-blue-400">{m.roll}</div>
                    </td>
                    <td className="py-3 text-slate-300">{m.dept}</td>
                    <td className="py-3 font-code font-bold text-white">{m.totalLoans}</td>
                    <td className="py-3 text-right font-code text-emerald-400 font-bold">{m.onTimeRate}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* 4. Fine Reports & Overdue Analytics */}
      <div className="p-5 rounded-2xl bg-[#0e1422] border border-[#1e293b] shadow-sm space-y-4">
        <h3 className="text-sm md:text-base font-bold text-white flex items-center gap-2">
          <Coins className="w-4 h-4 text-amber-400" />
          <span>Fines &amp; Overdue Revenue Breakdown</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {fineStatusBreakdown.map(item => (
            <div key={item.label} className="p-4 rounded-xl bg-[#080c14] border border-[#1e293b] space-y-2">
              <span className="text-xs text-slate-400">{item.label}</span>
              <div className="text-xl font-bold font-code text-white">{item.amount}</div>
              <div className="w-full h-1.5 bg-[#121929] rounded-full overflow-hidden">
                <div className={`h-full ${item.color} rounded-full`} style={{ width: `${item.pct}%` }}></div>
              </div>
              <span className="text-[10px] text-slate-400 font-code">{item.pct}% of total assessed dues</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
