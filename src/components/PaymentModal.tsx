import React, { useState } from 'react';
import { useLibrary } from '../context/LibraryContext';
import { 
  X, 
  CreditCard, 
  Coins, 
  Building, 
  CheckCircle2, 
  ShieldCheck, 
  FileText 
} from 'lucide-react';

export const PaymentModal: React.FC = () => {
  const { 
    isPaymentModalOpen, 
    setIsPaymentModalOpen, 
    members, 
    settleAllUserFines, 
    showToast 
  } = useLibrary();

  const [selectedPatronId, setSelectedPatronId] = useState<string>('STU-2022-78');
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'bursar' | 'cash' | 'waive'>('card');
  const [isProcessing, setIsProcessing] = useState(false);
  const [receiptSuccess, setReceiptSuccess] = useState<string | null>(null);

  if (!isPaymentModalOpen) return null;

  const patron = members.find(m => m.id === selectedPatronId) || members[1];
  const fineAmount = patron.finesDue > 0 ? patron.finesDue : 4.50;

  const handleProcessPayment = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    setTimeout(() => {
      setIsProcessing(false);
      settleAllUserFines(patron.id);
      const receiptNo = `PAY-2025-${Math.floor(100000 + Math.random() * 900000)}`;
      setReceiptSuccess(receiptNo);
      showToast(`Fine clearance recorded. Receipt #${receiptNo}`, 'success');
    }, 500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-[#0e1422] rounded-3xl w-full max-w-md border border-[#1e293b] shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 text-slate-200">
        <div className="px-6 py-4 bg-[#090d16] border-b border-[#1e293b] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Coins className="w-5 h-5 text-amber-400" />
            <h3 className="font-bold text-base text-white">
              Circulation Fine Clearance
            </h3>
          </div>

          <button
            onClick={() => {
              setIsPaymentModalOpen(false);
              setReceiptSuccess(null);
            }}
            className="w-8 h-8 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {receiptSuccess ? (
          <div className="p-6 text-center space-y-4 animate-in fade-in">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/30">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-base text-white">Dues Cleared Successfully</h4>
              <p className="text-xs text-slate-400 mt-1 font-code">
                Receipt #{receiptSuccess} has been generated
              </p>
            </div>
            <div className="bg-[#080c14] p-3.5 rounded-xl border border-[#1e293b] text-xs text-slate-300 font-code text-left space-y-1">
              <div className="flex justify-between">
                <span className="text-slate-500">Patron:</span>
                <span className="text-white font-bold">{patron.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Amount Paid:</span>
                <span className="text-emerald-400 font-bold">${fineAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Method:</span>
                <span className="text-white uppercase">{paymentMethod}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Standing:</span>
                <span className="text-emerald-400">Reinstated (Good)</span>
              </div>
            </div>

            <button
              onClick={() => {
                setIsPaymentModalOpen(false);
                setReceiptSuccess(null);
              }}
              className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-blue-600/20"
            >
              Close &amp; Return to Desk
            </button>
          </div>
        ) : (
          <form onSubmit={handleProcessPayment} className="p-6 space-y-4">
            <div className="bg-[#080c14] p-4 rounded-xl border border-[#1e293b] space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400">Patron Account:</span>
                <span className="font-bold text-white">{patron.name}</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400">Student Roll No:</span>
                <span className="font-code text-blue-400">{patron.rollNumber || 'STU-2022-78'}</span>
              </div>
              <div className="flex justify-between items-center text-xs pt-1 border-t border-[#1e293b]">
                <span className="text-slate-300 font-semibold">Total Assessed Overdue Fine:</span>
                <span className="text-base font-bold font-code text-rose-400">
                  ${fineAmount.toFixed(2)}
                </span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2">
                Settlement Channel
              </label>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('card')}
                  className={`p-2.5 rounded-xl border flex items-center gap-2 font-semibold transition-all ${
                    paymentMethod === 'card'
                      ? 'bg-blue-600/20 text-blue-400 border-blue-500'
                      : 'bg-[#080c14] text-slate-400 border-[#1e293b] hover:text-white'
                  }`}
                >
                  <CreditCard className="w-4 h-4" />
                  <span>Debit / Credit</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('bursar')}
                  className={`p-2.5 rounded-xl border flex items-center gap-2 font-semibold transition-all ${
                    paymentMethod === 'bursar'
                      ? 'bg-blue-600/20 text-blue-400 border-blue-500'
                      : 'bg-[#080c14] text-slate-400 border-[#1e293b] hover:text-white'
                  }`}
                >
                  <Building className="w-4 h-4" />
                  <span>College Bursar</span>
                </button>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isProcessing}
                className="w-full py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white rounded-xl text-xs font-bold shadow-lg shadow-blue-600/25 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
              >
                <Coins className="w-4 h-4" />
                <span>{isProcessing ? 'Processing Transaction...' : `Confirm & Clear $${fineAmount.toFixed(2)}`}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
