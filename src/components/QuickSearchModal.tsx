import React, { useState, useEffect } from 'react';
import { useLibrary } from '../context/LibraryContext';
import { Search, BookOpen, User, X, ArrowRight } from 'lucide-react';

export const QuickSearchModal: React.FC = () => {
  const { 
    isQuickSearchOpen, 
    setIsQuickSearchOpen, 
    books, 
    members, 
    setSelectedBookForDetail, 
    setActiveTab 
  } = useLibrary();

  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsQuickSearchOpen(prev => !prev);
      }
      if (e.key === 'Escape') {
        setIsQuickSearchOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setIsQuickSearchOpen]);

  if (!isQuickSearchOpen) return null;

  const q = query.toLowerCase().trim();

  const matchedBooks = q ? books.filter(b => 
    b.title.toLowerCase().includes(q) ||
    b.author.toLowerCase().includes(q) ||
    b.isbn.includes(q) ||
    b.accessionNo.toLowerCase().includes(q)
  ).slice(0, 4) : books.slice(0, 3);

  const matchedMembers = q ? members.filter(m => 
    m.name.toLowerCase().includes(q) ||
    (m.rollNumber && m.rollNumber.toLowerCase().includes(q)) ||
    (m.department && m.department.toLowerCase().includes(q))
  ).slice(0, 3) : members.slice(0, 2);

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-start justify-center pt-16 px-4">
      <div className="bg-[#0e1422] rounded-3xl w-full max-w-2xl border border-[#1e293b] shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 text-slate-200">
        {/* Search Input Bar */}
        <div className="p-4 border-b border-[#1e293b] flex items-center gap-3 bg-[#090d16]">
          <Search className="w-5 h-5 text-blue-400 shrink-0" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search catalog titles, authors, accession barcodes, or student rolls..."
            className="flex-1 bg-transparent text-sm text-white placeholder:text-slate-500 focus:outline-none"
          />
          <button
            onClick={() => setIsQuickSearchOpen(false)}
            className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Results Container */}
        <div className="p-4 space-y-4 max-h-[60vh] overflow-y-auto">
          {/* Books Section */}
          <div>
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider px-2 block mb-1">
              Catalog Titles
            </span>
            <div className="space-y-1">
              {matchedBooks.map(book => (
                <div
                  key={book.id}
                  onClick={() => {
                    setSelectedBookForDetail(book);
                    setIsQuickSearchOpen(false);
                  }}
                  className="flex items-center gap-3 p-2 rounded-xl hover:bg-[#121929] cursor-pointer transition-colors"
                >
                  <img
                    src={book.coverImage}
                    alt={book.title}
                    className="w-8 h-11 object-cover rounded-md border border-[#1e293b] shrink-0"
                  />
                  <div className="flex-1 min-w-0 text-xs">
                    <h5 className="font-bold text-white truncate">{book.title}</h5>
                    <p className="text-slate-400 truncate">{book.author} • <span className="text-blue-400 font-code">{book.accessionNo}</span></p>
                  </div>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    book.availableCopies > 0 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'
                  }`}>
                    {book.availableCopies > 0 ? `${book.availableCopies} available` : 'Issued'}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Members Section */}
          <div>
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider px-2 block mb-1">
              Enrolled Scholars &amp; Faculty
            </span>
            <div className="space-y-1">
              {matchedMembers.map(m => (
                <div
                  key={m.id}
                  onClick={() => {
                    setActiveTab('members');
                    setIsQuickSearchOpen(false);
                  }}
                  className="flex items-center gap-3 p-2 rounded-xl hover:bg-[#121929] cursor-pointer transition-colors"
                >
                  <img
                    src={m.avatar}
                    alt={m.name}
                    className="w-8 h-8 rounded-full object-cover border border-[#1e293b] shrink-0"
                  />
                  <div className="flex-1 min-w-0 text-xs">
                    <h5 className="font-bold text-white truncate">{m.name}</h5>
                    <p className="text-slate-400 font-code text-[11px]">{m.rollNumber} • {m.department}</p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-500" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer shortcuts */}
        <div className="px-4 py-2.5 bg-[#090d16] border-t border-[#1e293b] flex items-center justify-between text-[11px] text-slate-500 font-code">
          <span>Navigation: <kbd className="px-1.5 py-0.5 rounded bg-[#1e293b] text-slate-300">ESC</kbd> to exit</span>
          <span>Press <kbd className="px-1.5 py-0.5 rounded bg-[#1e293b] text-slate-300">⌘K</kbd> anywhere</span>
        </div>
      </div>
    </div>
  );
};
