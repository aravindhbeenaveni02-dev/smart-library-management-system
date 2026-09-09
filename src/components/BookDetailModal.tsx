import React from 'react';
import { useLibrary } from '../context/LibraryContext';
import { 
  X, 
  Check, 
  Clock, 
  BookMarked, 
  ArrowUpCircle, 
  BookOpen, 
  Layers 
} from 'lucide-react';

export const BookDetailModal: React.FC = () => {
  const { 
    selectedBookForDetail, 
    setSelectedBookForDetail, 
    placeHold, 
    setActiveTab, 
    showToast 
  } = useLibrary();

  if (!selectedBookForDetail) return null;

  const book = selectedBookForDetail;
  const isAvailable = book.availableCopies > 0;

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-[#0e1422] rounded-3xl w-full max-w-lg border border-[#1e293b] shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 text-slate-200">
        <div className="px-6 py-4 bg-[#090d16] border-b border-[#1e293b] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookMarked className="w-5 h-5 text-blue-400" />
            <span className="font-bold text-sm text-white">
              Catalog Record &amp; Inventory Details
            </span>
          </div>

          <button
            onClick={() => setSelectedBookForDetail(null)}
            className="w-8 h-8 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div className="flex gap-4">
            <div className="w-24 h-36 rounded-xl overflow-hidden shrink-0 shadow-md border border-[#1e293b]">
              <img
                src={book.coverImage}
                alt={book.title}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="flex-1 min-w-0">
              <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                isAvailable ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
              }`}>
                {isAvailable ? 'Available for Issue' : 'All Checked Out'}
              </span>

              <h3 className="font-bold text-base text-white mt-1 leading-tight line-clamp-2">
                {book.title}
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">By {book.author}</p>
              <p className="text-[11px] text-blue-400 mt-1 font-semibold">{book.discipline}</p>
            </div>
          </div>

          {/* Classification grid */}
          <div className="grid grid-cols-2 gap-2 text-xs bg-[#080c14] p-3 rounded-2xl border border-[#1e293b] font-code">
            <div>
              <span className="text-slate-400 block text-[10px]">Accession No:</span>
              <span className="font-bold text-blue-400">{book.accessionNo}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px]">Call Number:</span>
              <span className="text-white">{book.callNumber}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px]">Shelf / Stack:</span>
              <span className="text-white">{book.shelfLocation}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px]">ISBN-13:</span>
              <span className="text-slate-300">{book.isbn}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px]">Total Copies:</span>
              <span className="text-white">{book.totalCopies} registered</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px]">Current In-Stack:</span>
              <span className={`font-bold ${isAvailable ? 'text-emerald-400' : 'text-amber-400'}`}>
                {book.availableCopies} available
              </span>
            </div>
          </div>

          {book.description && (
            <div className="text-xs text-slate-300 leading-relaxed bg-[#080c14] p-3 rounded-2xl border border-[#1e293b]">
              <span className="font-semibold text-white block mb-1">Summary:</span>
              {book.description}
            </div>
          )}

          <div className="pt-2 flex items-center justify-end gap-2.5">
            {isAvailable ? (
              <button
                onClick={() => {
                  setSelectedBookForDetail(null);
                  setActiveTab('circulation');
                  showToast(`Directing to circulation desk to issue ${book.title}`, 'info');
                }}
                className="w-full py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white rounded-xl text-xs font-bold shadow-lg shadow-blue-600/25 flex items-center justify-center gap-1.5 transition-all"
              >
                <ArrowUpCircle className="w-4 h-4" />
                <span>Issue Volume at Circulation Desk</span>
              </button>
            ) : (
              <button
                onClick={() => {
                  placeHold(book.id);
                  setSelectedBookForDetail(null);
                }}
                className="w-full py-2.5 bg-amber-600 hover:bg-amber-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-amber-600/25 flex items-center justify-center gap-1.5 transition-all"
              >
                <Clock className="w-4 h-4" />
                <span>Place Hold / Reserve for Next Availability</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
