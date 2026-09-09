import React, { useState } from 'react';
import { useLibrary } from '../context/LibraryContext';
import { 
  ArrowUpCircle, 
  RotateCcw, 
  History, 
  Scan, 
  CheckCircle2, 
  Calendar, 
  Clock, 
  AlertTriangle, 
  CreditCard, 
  BookOpen, 
  User, 
  Search, 
  MailCheck, 
  X, 
  FileText, 
  ShieldAlert 
} from 'lucide-react';

export const CirculationView: React.FC = () => {
  const { 
    books, 
    members, 
    transactions, 
    issueBook, 
    returnBook, 
    renewBook, 
    waiveFine, 
    setIsPaymentModalOpen, 
    showToast 
  } = useLibrary();

  const [deskMode, setDeskMode] = useState<'issue' | 'return' | 'history'>('issue');
  const [historySearch, setHistorySearch] = useState('');
  const [historyFilter, setHistoryFilter] = useState<'all' | 'issued' | 'overdue' | 'returned'>('all');

  // Issue desk states
  const [selectedPatronRoll, setSelectedPatronRoll] = useState('STU-2022-78');
  const [selectedAccessionNo, setSelectedAccessionNo] = useState('ACC-883921');
  const [loanDaysExtension, setLoanDaysExtension] = useState<number>(14);
  const [isProcessingIssue, setIsProcessingIssue] = useState(false);
  const [issueReceipt, setIssueReceipt] = useState<{ receiptNo: string; patronName: string } | null>(null);

  // Return desk states
  const [returnAccessionInput, setReturnAccessionInput] = useState('');

  // Lookup selections
  const selectedMember = members.find(m => 
    m.rollNumber?.toLowerCase() === selectedPatronRoll.toLowerCase() ||
    m.id.toLowerCase() === selectedPatronRoll.toLowerCase()
  ) || members[1];

  const selectedBook = books.find(b => 
    b.accessionNo.toLowerCase() === selectedAccessionNo.toLowerCase() ||
    b.isbn.includes(selectedAccessionNo)
  ) || books[0];

  const handleIssueSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMember || !selectedBook) {
      showToast('Please verify patron roll number and book accession', 'error');
      return;
    }
    if (selectedBook.availableCopies <= 0) {
      showToast(`No available copies of "${selectedBook.title}". All checked out.`, 'error');
      return;
    }

    setIsProcessingIssue(true);
    setTimeout(() => {
      const success = issueBook(selectedBook.id, selectedMember.id, loanDaysExtension);
      setIsProcessingIssue(false);
      if (success) {
        setIssueReceipt({
          receiptNo: `ATH-2025-${Math.floor(1000 + Math.random() * 9000)}`,
          patronName: selectedMember.name,
        });
      }
    }, 400);
  };

  const now = new Date();
  const calculatedDueDate = new Date();
  calculatedDueDate.setDate(now.getDate() + loanDaysExtension);
  const calculatedDueDateStr = calculatedDueDate.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });
  const todayStr = now.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });

  // Overdue item for quick return desk
  const overdueTransaction = transactions.find(t => t.status === 'overdue') || transactions[2];

  // History filtering
  const filteredHistory = transactions.filter(tx => {
    if (historyFilter !== 'all' && tx.status !== historyFilter) return false;
    if (historySearch.trim()) {
      const q = historySearch.toLowerCase();
      return (
        tx.bookTitle.toLowerCase().includes(q) ||
        tx.userName.toLowerCase().includes(q) ||
        tx.accessionNo.toLowerCase().includes(q) ||
        tx.userRoll.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* 1. Header & Desk Mode Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight">
            Circulation Management Desk
          </h2>
          <p className="text-xs md:text-sm text-slate-400 mt-1">
            Issue volumes, execute rapid RFID returns, process loan renewals, and audit fine dues.
          </p>
        </div>

        {/* Mode Segmented Controls */}
        <div className="flex items-center bg-[#0e1422] p-1 rounded-xl border border-[#1e293b]">
          <button
            onClick={() => setDeskMode('issue')}
            className={`px-3.5 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all ${
              deskMode === 'issue'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/25'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <ArrowUpCircle className="w-4 h-4" />
            <span>Issue Book</span>
          </button>

          <button
            onClick={() => setDeskMode('return')}
            className={`px-3.5 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all ${
              deskMode === 'return'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/25'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <RotateCcw className="w-4 h-4" />
            <span>Return / Renew</span>
          </button>

          <button
            onClick={() => setDeskMode('history')}
            className={`px-3.5 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all ${
              deskMode === 'history'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/25'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <History className="w-4 h-4" />
            <span>Borrowing History</span>
          </button>
        </div>
      </div>

      {/* Confirmation Receipt Banner */}
      {issueReceipt && (
        <div className="bg-blue-950/40 border border-blue-500/30 p-4 rounded-2xl flex items-center justify-between gap-3 animate-in fade-in slide-in-from-top-2 text-slate-200">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0">
              <MailCheck className="w-5 h-5" />
            </div>
            <div className="flex flex-col min-w-0 text-xs">
              <span className="font-bold text-white">Book Issued &amp; SMS Dispatch Confirmed</span>
              <span className="text-slate-400 truncate">
                Receipt #{issueReceipt.receiptNo} sent to {issueReceipt.patronName}
              </span>
            </div>
          </div>
          <button 
            onClick={() => setIssueReceipt(null)}
            className="p-1 text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* 2. MAIN DESK WORKFLOWS */}

      {/* A. ISSUE BOOK DESK */}
      {deskMode === 'issue' && (
        <form onSubmit={handleIssueSubmit} className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Step 1: Patron Identification */}
            <div className="p-5 rounded-2xl bg-[#0e1422] border border-[#1e293b] space-y-4 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-lg bg-blue-600 text-white flex items-center justify-center text-xs font-bold font-code">
                    1
                  </div>
                  <h3 className="font-bold text-sm md:text-base text-white">
                    Patron Identification
                  </h3>
                </div>
                <span className="text-xs text-slate-400">Barcode / Student ID</span>
              </div>

              {/* Patron Input */}
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <span className="absolute left-3 top-3 text-slate-400">
                    <User className="w-4 h-4" />
                  </span>
                  <input
                    type="text"
                    value={selectedPatronRoll}
                    onChange={(e) => setSelectedPatronRoll(e.target.value)}
                    placeholder="Scan Barcode or Roll Number (e.g. STU-2022-78)"
                    className="w-full pl-9 pr-20 py-2.5 bg-[#080c14] text-white rounded-xl text-xs md:text-sm border border-[#1e293b] focus:border-blue-500 font-code focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedPatronRoll('STU-2022-78');
                      showToast('NFC Scan: Mahesh (CS-2022-78)', 'info');
                    }}
                    className="absolute right-2 top-2 px-2 py-1 rounded-lg bg-blue-600/20 hover:bg-blue-600/30 text-[11px] font-bold text-blue-400"
                  >
                    Scan NFC
                  </button>
                </div>
              </div>

              {/* Verified Patron Card */}
              {selectedMember && (
                <div className="p-3.5 rounded-xl bg-[#121929] border border-[#1e293b] flex items-center gap-3">
                  <img
                    className="w-12 h-12 rounded-xl object-cover border border-blue-500/30 shrink-0"
                    src={selectedMember.avatar}
                    alt={selectedMember.name}
                  />
                  <div className="flex-1 min-w-0 text-xs">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-white truncate text-sm">{selectedMember.name}</h4>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/20 text-emerald-400">
                        {selectedMember.standing}
                      </span>
                    </div>
                    <p className="text-slate-400 truncate mt-0.5">
                      {selectedMember.rollNumber} • {selectedMember.department}
                    </p>
                    <div className="flex items-center gap-3 mt-1.5 text-[11px] font-code">
                      <span>Quota: <strong className="text-white">{selectedMember.activeBorrowsCount}/{selectedMember.quotaLimit}</strong></span>
                      <span>Dues: <strong className={selectedMember.finesDue > 0 ? 'text-rose-400' : 'text-emerald-400'}>${selectedMember.finesDue.toFixed(2)}</strong></span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Step 2: Book Accession Scan */}
            <div className="p-5 rounded-2xl bg-[#0e1422] border border-[#1e293b] space-y-4 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-lg bg-blue-600 text-white flex items-center justify-center text-xs font-bold font-code">
                    2
                  </div>
                  <h3 className="font-bold text-sm md:text-base text-white">
                    Book Accession Barcode
                  </h3>
                </div>
                <span className="text-xs text-slate-400 font-code">RFID Reader Active</span>
              </div>

              {/* Book Scan Input */}
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <span className="absolute left-3 top-3 text-slate-400">
                    <BookOpen className="w-4 h-4" />
                  </span>
                  <input
                    type="text"
                    value={selectedAccessionNo}
                    onChange={(e) => setSelectedAccessionNo(e.target.value)}
                    placeholder="Scan Accession Barcode (e.g. ACC-883921)"
                    className="w-full pl-9 pr-20 py-2.5 bg-[#080c14] text-white rounded-xl text-xs md:text-sm border border-[#1e293b] focus:border-blue-500 font-code focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedAccessionNo('ACC-883921');
                      showToast('Laser Scanned: Clean Code (ACC-883921)', 'info');
                    }}
                    className="absolute right-2 top-2 px-2 py-1 rounded-lg bg-blue-600/20 hover:bg-blue-600/30 text-[11px] font-bold text-blue-400"
                  >
                    Scan Laser
                  </button>
                </div>
              </div>

              {/* Verified Book Card */}
              {selectedBook && (
                <div className="p-3.5 rounded-xl bg-[#121929] border border-[#1e293b] flex items-center gap-3">
                  <img
                    className="w-12 h-16 rounded-lg object-cover border border-[#1e293b] shrink-0"
                    src={selectedBook.coverImage}
                    alt={selectedBook.title}
                  />
                  <div className="flex-1 min-w-0 text-xs">
                    <span className="text-[10px] font-code font-bold text-blue-400">
                      {selectedBook.accessionNo} • Bay {selectedBook.shelfLocation}
                    </span>
                    <h4 className="font-bold text-white truncate text-sm mt-0.5">{selectedBook.title}</h4>
                    <p className="text-slate-400 truncate">{selectedBook.author}</p>
                    <div className="mt-1 flex items-center gap-2">
                      <span className="text-[11px] font-code text-slate-300">
                        Holdings: <strong>{selectedBook.availableCopies}/{selectedBook.totalCopies} available</strong>
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Step 3: Circulation Terms & Final Execution */}
          <div className="p-5 rounded-2xl bg-[#0e1422] border border-[#1e293b] space-y-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg bg-blue-600 text-white flex items-center justify-center text-xs font-bold font-code">
                  3
                </div>
                <h3 className="font-bold text-sm md:text-base text-white">
                  Circulation Policy &amp; Due Date
                </h3>
              </div>
              <span className="text-xs text-slate-400">Undergrad Policy (14 Days)</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3 rounded-xl bg-[#080c14] border border-[#1e293b]">
                <span className="text-[11px] text-slate-400 block">Session Issue Date</span>
                <span className="text-sm font-bold text-white flex items-center gap-1 mt-0.5">
                  <Calendar className="w-3.5 h-3.5 text-blue-400" />
                  {todayStr}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-[#080c14] border border-[#1e293b]">
                <span className="text-[11px] text-slate-400 block">Calculated Due Date</span>
                <span className="text-sm font-bold text-blue-400 flex items-center gap-1 mt-0.5">
                  <Clock className="w-3.5 h-3.5 text-blue-400" />
                  {calculatedDueDateStr}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-[#080c14] border border-[#1e293b]">
                <span className="text-[11px] text-slate-400 block">Loan Extension Window</span>
                <div className="flex items-center gap-2 mt-1">
                  {[14, 21, 28].map(days => (
                    <button
                      key={days}
                      type="button"
                      onClick={() => setLoanDaysExtension(days)}
                      className={`px-2.5 py-0.5 rounded-lg text-xs font-code font-bold transition-all ${
                        loanDaysExtension === days
                          ? 'bg-blue-600 text-white'
                          : 'bg-[#121929] text-slate-400 hover:text-white'
                      }`}
                    >
                      {days}d
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                disabled={isProcessingIssue || !selectedBook || selectedBook.availableCopies <= 0}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white rounded-xl text-xs md:text-sm font-bold shadow-lg shadow-blue-600/25 flex items-center gap-2 disabled:opacity-50 transition-all active:scale-98"
              >
                <ArrowUpCircle className="w-4 h-4" />
                <span>{isProcessingIssue ? 'Authorizing Loan...' : 'Confirm Book Checkout & Issue'}</span>
              </button>
            </div>
          </div>
        </form>
      )}

      {/* B. RETURN / RENEW DESK */}
      {deskMode === 'return' && (
        <div className="space-y-6">
          {/* Rapid Barcode Scan Return */}
          <div className="p-5 rounded-2xl bg-[#0e1422] border border-[#1e293b] space-y-4 shadow-sm">
            <h3 className="font-bold text-sm md:text-base text-white flex items-center gap-2">
              <Scan className="w-4 h-4 text-blue-400" />
              <span>Rapid RFID Return Desk</span>
            </h3>

            <div className="flex gap-3">
              <input
                type="text"
                value={returnAccessionInput}
                onChange={(e) => setReturnAccessionInput(e.target.value)}
                placeholder="Scan book accession or RFID barcode (e.g. ACC-300184)"
                className="flex-1 px-4 py-2.5 bg-[#080c14] text-white rounded-xl text-xs md:text-sm border border-[#1e293b] focus:border-blue-500 font-code focus:outline-none"
              />
              <button
                onClick={() => {
                  const target = returnAccessionInput || 'ACC-300184';
                  returnBook(target);
                  setReturnAccessionInput('');
                }}
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-blue-600/20"
              >
                Scan Return
              </button>
            </div>
          </div>

          {/* Quick Return Table with Active Loans & Overdues */}
          <div className="p-5 rounded-2xl bg-[#0e1422] border border-[#1e293b] shadow-sm">
            <h3 className="font-bold text-sm md:text-base text-white mb-3 flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-400" />
              <span>Active Circulation Loans Ready for Check-In</span>
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-[#1e293b] text-slate-400 uppercase tracking-wider text-[10px]">
                    <th className="pb-2.5">Book Title</th>
                    <th className="pb-2.5">Patron</th>
                    <th className="pb-2.5">Accession</th>
                    <th className="pb-2.5">Due Date</th>
                    <th className="pb-2.5">Status &amp; Fine</th>
                    <th className="pb-2.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1e293b]/60">
                  {transactions.filter(t => t.status !== 'returned').map(tx => (
                    <tr key={tx.id} className="hover:bg-[#121929] transition-colors">
                      <td className="py-3 font-medium text-white max-w-[200px] truncate">
                        {tx.bookTitle}
                      </td>
                      <td className="py-3 text-slate-300 truncate max-w-[140px]">
                        {tx.userName} ({tx.userRoll})
                      </td>
                      <td className="py-3 font-code text-blue-400">{tx.accessionNo}</td>
                      <td className="py-3 font-code text-slate-400">{tx.dueDate}</td>
                      <td className="py-3">
                        {tx.status === 'overdue' ? (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/20 text-rose-400 border border-rose-500/30">
                            Overdue (${tx.assessedFine.toFixed(2)})
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/20 text-blue-400 border border-blue-500/30">
                            Active Loan
                          </span>
                        )}
                      </td>
                      <td className="py-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => returnBook(tx.id)}
                            className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-[11px]"
                          >
                            Return
                          </button>
                          <button
                            onClick={() => renewBook(tx.id)}
                            className="px-2.5 py-1 rounded-lg bg-[#182234] hover:bg-[#1f2d47] text-slate-200 border border-[#1e293b] font-semibold text-[11px]"
                          >
                            Renew +14d
                          </button>
                          {tx.assessedFine > 0 && (
                            <button
                              onClick={() => waiveFine(tx.id, 'Administrative adjustment')}
                              className="px-2 py-1 rounded-lg bg-rose-500/20 text-rose-400 hover:bg-rose-500/30 text-[11px] font-semibold"
                              title="Waive Fine"
                            >
                              Waive
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* C. BORROWING HISTORY AUDIT TABLE */}
      {deskMode === 'history' && (
        <div className="p-5 rounded-2xl bg-[#0e1422] border border-[#1e293b] space-y-4 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="relative flex-1 max-w-sm">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                value={historySearch}
                onChange={(e) => setHistorySearch(e.target.value)}
                placeholder="Search history by title, patron, roll, accession..."
                className="w-full pl-9 pr-3 py-2 bg-[#080c14] border border-[#1e293b] rounded-xl text-xs text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="flex items-center gap-1 bg-[#080c14] p-1 rounded-xl border border-[#1e293b]">
              {(['all', 'issued', 'overdue', 'returned'] as const).map(filter => (
                <button
                  key={filter}
                  onClick={() => setHistoryFilter(filter)}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold capitalize transition-all ${
                    historyFilter === filter ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#1e293b] text-slate-400 uppercase tracking-wider text-[10px]">
                  <th className="pb-2.5">Txn #</th>
                  <th className="pb-2.5">Book Title</th>
                  <th className="pb-2.5">Patron</th>
                  <th className="pb-2.5">Accession</th>
                  <th className="pb-2.5">Issue Date</th>
                  <th className="pb-2.5">Due Date</th>
                  <th className="pb-2.5">Return Date</th>
                  <th className="pb-2.5">Status</th>
                  <th className="pb-2.5 text-right">Fine</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1e293b]/60">
                {filteredHistory.map(tx => (
                  <tr key={tx.id} className="hover:bg-[#121929] transition-colors">
                    <td className="py-3 font-code text-slate-400">{tx.transactionNo}</td>
                    <td className="py-3 font-medium text-white max-w-[180px] truncate">{tx.bookTitle}</td>
                    <td className="py-3 text-slate-300 truncate max-w-[130px]">{tx.userName}</td>
                    <td className="py-3 font-code text-blue-400">{tx.accessionNo}</td>
                    <td className="py-3 font-code text-slate-400">{tx.issueDate}</td>
                    <td className="py-3 font-code text-slate-400">{tx.dueDate}</td>
                    <td className="py-3 font-code text-slate-400">{tx.returnDate || '—'}</td>
                    <td className="py-3">
                      {tx.status === 'issued' && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/20 text-blue-400">
                          Active
                        </span>
                      )}
                      {tx.status === 'returned' && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400">
                          Returned
                        </span>
                      )}
                      {tx.status === 'overdue' && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/20 text-rose-400">
                          Overdue
                        </span>
                      )}
                    </td>
                    <td className="py-3 text-right font-code font-bold">
                      {tx.assessedFine > 0 ? (
                        <span className="text-rose-400">${tx.assessedFine.toFixed(2)}</span>
                      ) : (
                        <span className="text-slate-500">$0.00</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
