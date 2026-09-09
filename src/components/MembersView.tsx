import React, { useState } from 'react';
import { useLibrary } from '../context/LibraryContext';
import { UserProfile } from '../types';
import { 
  Users, 
  UserPlus, 
  Search, 
  CheckCircle2, 
  AlertTriangle, 
  BookOpen, 
  CreditCard, 
  X, 
  Clock, 
  Mail, 
  GraduationCap, 
  ArrowUpRight 
} from 'lucide-react';

export const MembersView: React.FC = () => {
  const { 
    members, 
    transactions, 
    setIsRegisterModalOpen, 
    setIsPaymentModalOpen, 
    settleAllUserFines, 
    setActiveTab, 
    showToast 
  } = useLibrary();

  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'active' | 'overdue' | 'faculty'>('all');
  const [selectedMember, setSelectedMember] = useState<UserProfile | null>(members[1]); // Mahesh by default

  const filteredMembers = members.filter(m => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const match = 
        m.name.toLowerCase().includes(q) ||
        (m.rollNumber && m.rollNumber.toLowerCase().includes(q)) ||
        (m.department && m.department.toLowerCase().includes(q)) ||
        m.email.toLowerCase().includes(q);
      if (!match) return false;
    }
    if (activeFilter === 'active' && m.activeBorrowsCount === 0) return false;
    if (activeFilter === 'overdue' && m.finesDue === 0 && m.standing !== 'Fines Due') return false;
    if (activeFilter === 'faculty' && !m.isFaculty) return false;
    return true;
  });

  // Get currently borrowed books and history for selected member
  const memberCurrentLoans = selectedMember 
    ? transactions.filter(t => t.userId === selectedMember.id && t.status !== 'returned')
    : [];

  const memberHistory = selectedMember
    ? transactions.filter(t => t.userId === selectedMember.id)
    : [];

  return (
    <div className="space-y-6">
      {/* 1. Header & Enrollment Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <span>Students &amp; Faculty Registry</span>
            <span className="px-2 py-0.5 rounded-full text-xs font-code font-bold bg-blue-500/20 text-blue-400 border border-blue-500/30">
              {filteredMembers.length} Members
            </span>
          </h2>
          <p className="text-xs md:text-sm text-slate-400 mt-1">
            Manage student borrow quotas, institutional memberships, faculty privileges, and late dues.
          </p>
        </div>

        <button
          onClick={() => setIsRegisterModalOpen(true)}
          className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white rounded-xl text-xs font-bold shadow-lg shadow-blue-600/25 flex items-center gap-1.5 transition-all self-start sm:self-auto"
        >
          <UserPlus className="w-4 h-4" />
          <span>Register New Member</span>
        </button>
      </div>

      {/* 2. Search & Filter Bar */}
      <div className="p-4 rounded-2xl bg-[#0e1422] border border-[#1e293b] flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by student name, roll number, department, or email..."
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-[#080c14] border border-[#1e293b] text-xs md:text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
          />
        </div>

        <div className="flex items-center gap-1 bg-[#080c14] p-1 rounded-xl border border-[#1e293b]">
          {(['all', 'active', 'overdue', 'faculty'] as const).map(filter => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all ${
                activeFilter === filter ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              {filter === 'active' ? 'Active Borrowers' : filter}
            </button>
          ))}
        </div>
      </div>

      {/* 3. Members Grid + Selected Member Dossier */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Members Table / List */}
        <div className="lg:col-span-2 rounded-2xl bg-[#0e1422] border border-[#1e293b] overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#1e293b] bg-[#090d16] text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
                  <th className="py-3 px-4">Member Name</th>
                  <th className="py-3 px-4">Roll / ID</th>
                  <th className="py-3 px-4">Department</th>
                  <th className="py-3 px-4">Quota</th>
                  <th className="py-3 px-4">Fines</th>
                  <th className="py-3 px-4">Standing</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1e293b]/60">
                {filteredMembers.map(m => {
                  const isSelected = selectedMember?.id === m.id;
                  return (
                    <tr
                      key={m.id}
                      onClick={() => setSelectedMember(m)}
                      className={`cursor-pointer transition-colors ${
                        isSelected ? 'bg-[#182234]' : 'hover:bg-[#121929]'
                      }`}
                    >
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2.5">
                          <img
                            src={m.avatar}
                            alt={m.name}
                            className="w-8 h-8 rounded-lg object-cover border border-[#1e293b] shrink-0"
                          />
                          <div className="min-w-0 max-w-[140px]">
                            <h4 className="font-bold text-white truncate">{m.name}</h4>
                            <p className="text-[11px] text-slate-400 truncate">{m.email}</p>
                          </div>
                        </div>
                      </td>

                      <td className="py-3 px-4 font-code text-blue-400 font-bold whitespace-nowrap">
                        {m.rollNumber || m.id}
                      </td>

                      <td className="py-3 px-4 text-slate-300 truncate max-w-[120px]">
                        {m.department}
                      </td>

                      <td className="py-3 px-4 whitespace-nowrap">
                        <span className="font-code text-white font-bold">
                          {m.activeBorrowsCount}/{m.quotaLimit}
                        </span>
                      </td>

                      <td className="py-3 px-4 whitespace-nowrap font-code font-bold">
                        {m.finesDue > 0 ? (
                          <span className="text-rose-400">${m.finesDue.toFixed(2)}</span>
                        ) : (
                          <span className="text-emerald-400">$0.00</span>
                        )}
                      </td>

                      <td className="py-3 px-4 whitespace-nowrap">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          m.standing === 'Good Standing' || m.standing === 'Faculty Privileged'
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                            : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                        }`}>
                          {m.standing}
                        </span>
                      </td>

                      <td className="py-3 px-4 text-right whitespace-nowrap">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedMember(m);
                          }}
                          className="px-2.5 py-1 rounded-lg bg-[#121929] hover:bg-[#182234] text-blue-400 border border-[#1e293b] text-[11px] font-semibold"
                        >
                          Details
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right: Selected Member Dossier & Loan Details */}
        {selectedMember && (
          <div className="p-5 rounded-2xl bg-[#0e1422] border border-[#1e293b] space-y-5 shadow-sm">
            {/* Header / Avatar */}
            <div className="flex items-center gap-3.5 pb-4 border-b border-[#1e293b]">
              <img
                src={selectedMember.avatar}
                alt={selectedMember.name}
                className="w-14 h-14 rounded-2xl object-cover border-2 border-blue-500/40 shadow-md"
              />
              <div className="min-w-0 flex-1">
                <h3 className="text-base font-bold text-white truncate">{selectedMember.name}</h3>
                <p className="text-xs text-slate-400 font-code">{selectedMember.rollNumber}</p>
                <span className="inline-block mt-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/20 text-blue-400 border border-blue-500/30">
                  {selectedMember.department}
                </span>
              </div>
            </div>

            {/* Quota & Dues Cards */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-xl bg-[#080c14] border border-[#1e293b]">
                <span className="text-[11px] text-slate-400 block">Quota Limit</span>
                <span className="text-base font-bold text-white font-code">
                  {selectedMember.activeBorrowsCount} / {selectedMember.quotaLimit}
                </span>
                <div className="w-full h-1.5 bg-[#121929] rounded-full overflow-hidden mt-1.5">
                  <div
                    className="h-full bg-blue-500 rounded-full"
                    style={{ width: `${(selectedMember.activeBorrowsCount / selectedMember.quotaLimit) * 100}%` }}
                  ></div>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-[#080c14] border border-[#1e293b]">
                <span className="text-[11px] text-slate-400 block">Outstanding Dues</span>
                <span className={`text-base font-bold font-code ${selectedMember.finesDue > 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
                  ${selectedMember.finesDue.toFixed(2)}
                </span>
                {selectedMember.finesDue > 0 ? (
                  <button
                    onClick={() => setIsPaymentModalOpen(true)}
                    className="mt-1 text-[11px] font-semibold text-blue-400 hover:underline block"
                  >
                    Clear Fine
                  </button>
                ) : (
                  <span className="text-[10px] text-emerald-400 block mt-1">No dues pending</span>
                )}
              </div>
            </div>

            {/* Currently Borrowed Books */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center justify-between">
                <span>Currently Borrowed ({memberCurrentLoans.length})</span>
                <button
                  onClick={() => setActiveTab('circulation')}
                  className="text-blue-400 hover:underline text-[11px] normal-case"
                >
                  Go to Circulation
                </button>
              </h4>

              {memberCurrentLoans.length > 0 ? (
                <div className="space-y-2">
                  {memberCurrentLoans.map(loan => (
                    <div key={loan.id} className="p-2.5 rounded-xl bg-[#121929] border border-[#1e293b] text-xs">
                      <div className="flex justify-between items-start">
                        <h5 className="font-bold text-white truncate max-w-[180px]">{loan.bookTitle}</h5>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          loan.status === 'overdue' ? 'bg-rose-500/20 text-rose-400' : 'bg-blue-500/20 text-blue-400'
                        }`}>
                          Due: {loan.dueDate}
                        </span>
                      </div>
                      <p className="text-[11px] font-code text-slate-400 mt-1">
                        Acc: <strong className="text-blue-400">{loan.accessionNo}</strong>
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-4 rounded-xl bg-[#080c14] border border-[#1e293b] text-center text-xs text-slate-400">
                  No active loans currently checked out.
                </div>
              )}
            </div>

            {/* Borrowing History */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                Lifetime Borrowing History ({memberHistory.length})
              </h4>
              <div className="space-y-1.5 max-h-48 overflow-y-auto">
                {memberHistory.map(h => (
                  <div key={h.id} className="p-2 rounded-lg bg-[#080c14] border border-[#1e293b] text-xs flex items-center justify-between">
                    <span className="text-slate-300 truncate max-w-[150px]">{h.bookTitle}</span>
                    <span className="font-code text-[11px] text-slate-400 capitalize">{h.status}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
