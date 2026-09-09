import React, { useState } from 'react';
import { useLibrary } from '../context/LibraryContext';
import { 
  GraduationCap, 
  BookOpen, 
  Clock, 
  AlertTriangle, 
  CreditCard, 
  CheckCircle2, 
  Calendar, 
  RotateCw, 
  QrCode, 
  Wifi, 
  X, 
  ArrowRight 
} from 'lucide-react';

export const StudentPortalView: React.FC = () => {
  const { 
    currentUser, 
    transactions, 
    renewBook, 
    setIsPaymentModalOpen, 
    showToast 
  } = useLibrary();

  const [isQrZoomed, setIsQrZoomed] = useState(false);

  const studentTxns = transactions.filter(t => 
    t.userId === currentUser.id || t.userRoll === currentUser.rollNumber
  );

  const activeBorrows = studentTxns.filter(t => t.status === 'issued' || t.status === 'overdue');
  const returnedBorrows = studentTxns.filter(t => t.status === 'returned');
  const totalFines = activeBorrows.reduce((sum, t) => sum + (t.assessedFine - t.paidFine - t.waivedFine), 0);

  return (
    <div className="space-y-6">
      {/* 1. Header & Quick Status */}
      <div>
        <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight">
          Scholar Digital Access Portal
        </h2>
        <p className="text-xs md:text-sm text-slate-400 mt-1">
          Turnstile NFC entry pass, active borrowed volumes, automated renewal extensions, and account standing.
        </p>
      </div>

      {/* 2. Scholar ID Card & Account Quota */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Digital ID Card */}
        <div className="lg:col-span-2 relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#0f172a] via-[#131d33] to-[#090d16] p-6 border border-blue-500/30 shadow-xl text-slate-100">
          <div className="absolute right-0 top-0 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl pointer-events-none"></div>

          <div className="flex flex-col justify-between h-full space-y-6 relative z-10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-blue-400" />
                <span className="font-bold text-xs uppercase tracking-wider text-blue-400">
                  Smart Library Scholar ID Pass
                </span>
              </div>
              <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-semibold border border-emerald-500/30">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                Gate Pass Active
              </span>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="w-16 h-16 rounded-2xl object-cover border-2 border-blue-500/40 shadow-md shrink-0"
                />
                <div>
                  <h3 className="text-lg font-bold text-white">{currentUser.name}</h3>
                  <p className="text-xs text-slate-400 font-code">{currentUser.rollNumber || 'STU-2022-78'}</p>
                  <p className="text-xs text-blue-300 mt-0.5">{currentUser.department} • Year {currentUser.year || '3'}</p>
                </div>
              </div>

              {/* Turnstile QR Code Touch to Enlarge */}
              <div
                onClick={() => setIsQrZoomed(true)}
                className="p-2.5 rounded-xl bg-white text-[#090d16] cursor-pointer hover:scale-105 transition-transform flex flex-col items-center gap-1 shrink-0 shadow-lg"
              >
                <QrCode className="w-12 h-12" />
                <span className="text-[9px] font-bold uppercase tracking-wider">Tap to Enlarge</span>
              </div>
            </div>

            <div className="pt-3 border-t border-[#1e293b] flex items-center justify-between text-xs text-slate-400 font-code">
              <span>NFC ID: <strong>9283-4819-A</strong></span>
              <span>Valid Thru: <strong>JUN 2026</strong></span>
            </div>
          </div>
        </div>

        {/* Quota & Fine Status Card */}
        <div className="p-6 rounded-2xl bg-[#0e1422] border border-[#1e293b] flex flex-col justify-between shadow-sm space-y-4">
          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Borrowing Quota
            </span>
            <div className="text-2xl font-bold font-code text-white mt-1">
              {activeBorrows.length} / {currentUser.quotaLimit} Volumes
            </div>
            <p className="text-xs text-slate-400 mt-1">
              {currentUser.quotaLimit - activeBorrows.length} slots remaining for new issues
            </p>

            <div className="w-full h-2 bg-[#080c14] rounded-full overflow-hidden mt-3">
              <div
                className="h-full bg-blue-500 rounded-full"
                style={{ width: `${(activeBorrows.length / currentUser.quotaLimit) * 100}%` }}
              ></div>
            </div>
          </div>

          <div className="pt-4 border-t border-[#1e293b]">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400">Late Return Dues</span>
              <span className={`text-base font-bold font-code ${totalFines > 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
                ${totalFines.toFixed(2)}
              </span>
            </div>

            {totalFines > 0 ? (
              <button
                onClick={() => setIsPaymentModalOpen(true)}
                className="mt-3 w-full py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-bold shadow-md shadow-rose-600/20 transition-all flex items-center justify-center gap-1.5"
              >
                <CreditCard className="w-3.5 h-3.5" />
                <span>Clear Fines Online</span>
              </button>
            ) : (
              <div className="mt-2 flex items-center gap-1 text-xs text-emerald-400 font-semibold">
                <CheckCircle2 className="w-4 h-4" />
                <span>Account in Excellent Standing</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 3. Active Checked-Out Books */}
      <div className="p-5 rounded-2xl bg-[#0e1422] border border-[#1e293b] shadow-sm space-y-4">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-blue-400" />
          <span>Currently Checked Out Volumes ({activeBorrows.length})</span>
        </h3>

        {activeBorrows.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {activeBorrows.map(item => {
              const isOverdue = item.status === 'overdue';
              return (
                <div 
                  key={item.id} 
                  className={`p-4 rounded-2xl border transition-all ${
                    isOverdue 
                      ? 'bg-rose-950/20 border-rose-900/40' 
                      : 'bg-[#121929] border-[#1e293b]'
                  }`}
                >
                  <div className="flex gap-3">
                    <img
                      src={item.bookCover}
                      alt={item.bookTitle}
                      className="w-16 h-24 object-cover rounded-xl border border-[#1e293b] shrink-0 shadow-sm"
                    />
                    <div className="min-w-0 flex-1 text-xs">
                      <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        isOverdue ? 'bg-rose-500/20 text-rose-400' : 'bg-blue-500/20 text-blue-400'
                      }`}>
                        {isOverdue ? `Overdue (${item.overdueDays}d)` : 'Active Loan'}
                      </span>
                      <h4 className="font-bold text-white text-sm mt-1 truncate">{item.bookTitle}</h4>
                      <p className="text-[11px] font-code text-slate-400 mt-0.5">Acc: {item.accessionNo}</p>

                      <div className="mt-2 flex items-center gap-3 text-[11px] font-code">
                        <span>Due: <strong className={isOverdue ? 'text-rose-400' : 'text-white'}>{item.dueDate}</strong></span>
                        {isOverdue && <span className="text-rose-400 font-bold">${item.assessedFine.toFixed(2)} fine</span>}
                      </div>
                    </div>
                  </div>

                  <div className="mt-3 pt-3 border-t border-[#1e293b]/60 flex items-center justify-between">
                    <span className="text-[11px] text-slate-400">Renewals: {item.renewalsCount}/{item.maxRenewals}</span>
                    <button
                      onClick={() => renewBook(item.id)}
                      disabled={item.renewalsCount >= item.maxRenewals}
                      className="px-3 py-1 bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-white rounded-lg text-xs font-semibold flex items-center gap-1 transition-all"
                    >
                      <RotateCw className="w-3 h-3" />
                      <span>Request +14d Renewal</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="p-8 rounded-xl bg-[#080c14] border border-[#1e293b] text-center text-slate-400 text-xs">
            No active volumes currently checked out. Visit the catalog to reserve or borrow books!
          </div>
        )}
      </div>

      {/* 4. Lifetime Borrowing Archive */}
      <div className="p-5 rounded-2xl bg-[#0e1422] border border-[#1e293b] shadow-sm space-y-4">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <Clock className="w-4 h-4 text-slate-400" />
          <span>Lifetime Reading &amp; Borrowing Archive</span>
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#1e293b] text-slate-400 uppercase tracking-wider text-[10px]">
                <th className="pb-2.5">Title</th>
                <th className="pb-2.5">Accession</th>
                <th className="pb-2.5">Issue Date</th>
                <th className="pb-2.5">Return Date</th>
                <th className="pb-2.5 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1e293b]/60">
              {returnedBorrows.map(item => (
                <tr key={item.id} className="hover:bg-[#121929] transition-colors">
                  <td className="py-2.5 font-medium text-white">{item.bookTitle}</td>
                  <td className="py-2.5 font-code text-blue-400">{item.accessionNo}</td>
                  <td className="py-2.5 font-code text-slate-400">{item.issueDate}</td>
                  <td className="py-2.5 font-code text-slate-400">{item.returnDate}</td>
                  <td className="py-2.5 text-right">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400">
                      Completed
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* QR Code Zoom Modal */}
      {isQrZoomed && (
        <div 
          onClick={() => setIsQrZoomed(false)}
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in"
        >
          <div className="bg-[#0e1422] border border-blue-500/40 p-6 rounded-3xl max-w-xs w-full text-center space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-2 border-b border-[#1e293b]">
              <span className="text-xs font-bold text-white uppercase tracking-wider">Turnstile Pass</span>
              <button onClick={() => setIsQrZoomed(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4 bg-white rounded-2xl mx-auto w-48 h-48 flex items-center justify-center shadow-lg">
              <QrCode className="w-40 h-40 text-black" />
            </div>
            <p className="text-xs text-slate-400 font-code">
              Scan barcode or present to RFID scanner at turnstile gates
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
