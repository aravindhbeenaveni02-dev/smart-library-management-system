import React, { useState } from 'react';
import { useLibrary } from '../context/LibraryContext';
import { Book, BookDiscipline } from '../types';
import { 
  Search, 
  Plus, 
  Filter, 
  LayoutList, 
  LayoutGrid, 
  MoreVertical, 
  Edit3, 
  Trash2, 
  BookOpen, 
  CheckCircle2, 
  Clock, 
  Eye, 
  ArrowUpCircle, 
  Download, 
  Scan 
} from 'lucide-react';

export const CatalogView: React.FC = () => {
  const { 
    books, 
    searchQuery, 
    setSearchQuery, 
    selectedDiscipline, 
    setSelectedDiscipline, 
    selectedStockFilter, 
    setSelectedStockFilter, 
    setIsAddBookModalOpen, 
    setSelectedBookForDetail, 
    setEditingBook, 
    deleteBook, 
    setActiveTab, 
    showToast 
  } = useLibrary();

  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');
  const [activeActionId, setActiveActionId] = useState<string | null>(null);

  const disciplines: BookDiscipline[] = [
    'All Disciplines',
    'Computer Science & AI',
    'Mechanical Eng',
    'Medicine',
    'Literature & History',
    'Economics',
    'Physics & Math',
  ];

  // Filtering
  const filteredBooks = books.filter(book => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const match = 
        book.title.toLowerCase().includes(q) ||
        book.author.toLowerCase().includes(q) ||
        book.isbn.includes(q) ||
        book.accessionNo.toLowerCase().includes(q) ||
        book.callNumber.toLowerCase().includes(q);
      if (!match) return false;
    }
    if (selectedDiscipline !== 'All Disciplines' && book.discipline !== selectedDiscipline) {
      return false;
    }
    if (selectedStockFilter === 'available' && book.availableCopies <= 0) {
      return false;
    }
    if (selectedStockFilter === 'issued' && book.availableCopies >= book.totalCopies) {
      return false;
    }
    return true;
  });

  const handleDelete = (id: string, title: string) => {
    if (window.confirm(`Are you sure you want to delete "${title}" from the catalog?`)) {
      deleteBook(id);
      setActiveActionId(null);
    }
  };

  const handleEdit = (book: Book) => {
    setEditingBook(book);
    setIsAddBookModalOpen(true);
    setActiveActionId(null);
  };

  return (
    <div className="space-y-6">
      {/* 1. Header & Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <span>Books Catalog Management</span>
            <span className="px-2 py-0.5 rounded-full text-xs font-code font-bold bg-blue-500/20 text-blue-400 border border-blue-500/30">
              {filteredBooks.length} Titles
            </span>
          </h2>
          <p className="text-xs md:text-sm text-slate-400 mt-1">
            Browse, classify, edit, and manage physical &amp; digital volume holdings across all faculties.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="flex items-center bg-[#0e1422] p-1 rounded-xl border border-[#1e293b]">
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-lg transition-colors ${
                viewMode === 'table' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
              title="Table View"
            >
              <LayoutList className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg transition-colors ${
                viewMode === 'grid' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
              title="Grid View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={() => {
              setEditingBook(null);
              setIsAddBookModalOpen(true);
            }}
            className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white rounded-xl text-xs font-bold shadow-lg shadow-blue-600/25 flex items-center gap-1.5 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Book</span>
          </button>
        </div>
      </div>

      {/* 2. Search & Filters Bar */}
      <div className="p-4 rounded-2xl bg-[#0e1422] border border-[#1e293b] space-y-3">
        <div className="flex flex-col md:flex-row gap-3">
          {/* Search Bar */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by title, author, ISBN-13, accession, or call number..."
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-[#080c14] border border-[#1e293b] text-xs md:text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>

          {/* Discipline Selector */}
          <div className="w-full md:w-64">
            <select
              value={selectedDiscipline}
              onChange={(e) => setSelectedDiscipline(e.target.value as BookDiscipline)}
              className="w-full px-3 py-2 rounded-xl bg-[#080c14] border border-[#1e293b] text-xs md:text-sm text-slate-200 focus:outline-none focus:border-blue-500"
            >
              {disciplines.map(d => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>

          {/* Stock Filter Pills */}
          <div className="flex items-center gap-1 bg-[#080c14] p-1 rounded-xl border border-[#1e293b]">
            {(['all', 'available', 'issued'] as const).map(filter => (
              <button
                key={filter}
                onClick={() => setSelectedStockFilter(filter)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all ${
                  selectedStockFilter === filter
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 3. Book Records: Professional Enterprise Table (ProcureIQ Style) */}
      {viewMode === 'table' ? (
        <div className="rounded-2xl bg-[#0e1422] border border-[#1e293b] overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#1e293b] bg-[#090d16] text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
                  <th className="py-3 px-4">Book &amp; Title</th>
                  <th className="py-3 px-4">Author</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Accession / ISBN</th>
                  <th className="py-3 px-4">Location / Bay</th>
                  <th className="py-3 px-4">Availability</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1e293b]/60">
                {filteredBooks.map(book => {
                  const isAvailable = book.availableCopies > 0;
                  return (
                    <tr 
                      key={book.id} 
                      className="hover:bg-[#121929] transition-colors group"
                    >
                      {/* Book Thumbnail & Title */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={book.coverImage}
                            alt={book.title}
                            className="w-9 h-13 object-cover rounded-md border border-[#1e293b] shadow-xs shrink-0"
                          />
                          <div className="min-w-0 max-w-[200px]">
                            <h4 
                              onClick={() => setSelectedBookForDetail(book)}
                              className="font-bold text-white hover:text-blue-400 cursor-pointer truncate transition-colors text-xs"
                            >
                              {book.title}
                            </h4>
                            <p className="text-[11px] text-slate-400 truncate">
                              {book.edition || '1st Edition'}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Author */}
                      <td className="py-3 px-4 text-slate-300 font-medium whitespace-nowrap">
                        {book.author}
                      </td>

                      {/* Category */}
                      <td className="py-3 px-4 whitespace-nowrap">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#182234] text-slate-300 border border-[#1e293b]">
                          {book.discipline}
                        </span>
                      </td>

                      {/* Accession & ISBN */}
                      <td className="py-3 px-4 whitespace-nowrap font-code text-[11px]">
                        <span className="text-blue-400 font-bold block">{book.accessionNo}</span>
                        <span className="text-slate-400">{book.isbn}</span>
                      </td>

                      {/* Shelf Bay */}
                      <td className="py-3 px-4 whitespace-nowrap">
                        <span className="text-slate-300 font-medium block">{book.shelfLocation}</span>
                        <span className="text-[10px] font-code text-slate-400">{book.callNumber}</span>
                      </td>

                      {/* Availability Count */}
                      <td className="py-3 px-4 whitespace-nowrap">
                        <span className="font-code font-bold text-white">
                          {book.availableCopies}
                        </span>
                        <span className="text-slate-400 font-code"> / {book.totalCopies} copies</span>
                      </td>

                      {/* Status */}
                      <td className="py-3 px-4 whitespace-nowrap">
                        {isAvailable ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                            Available
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                            Checked Out
                          </span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          {isAvailable ? (
                            <button
                              onClick={() => {
                                setActiveTab('circulation');
                                showToast(`Directing to circulation to issue "${book.title}"`, 'info');
                              }}
                              className="px-2.5 py-1 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold text-[11px] flex items-center gap-1 transition-colors"
                            >
                              <ArrowUpCircle className="w-3.5 h-3.5" />
                              <span>Issue</span>
                            </button>
                          ) : (
                            <button
                              onClick={() => setSelectedBookForDetail(book)}
                              className="px-2.5 py-1 rounded-lg bg-amber-600/20 text-amber-400 border border-amber-500/30 hover:bg-amber-600/30 font-semibold text-[11px] flex items-center gap-1 transition-colors"
                            >
                              <Clock className="w-3.5 h-3.5" />
                              <span>Hold</span>
                            </button>
                          )}

                          <button
                            onClick={() => setSelectedBookForDetail(book)}
                            className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white"
                            title="View Metadata"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={() => handleEdit(book)}
                            className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-blue-400"
                            title="Edit Book"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={() => handleDelete(book.id, book.title)}
                            className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-rose-400"
                            title="Delete Book"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Grid Cards View */
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredBooks.map(book => {
            const isAvailable = book.availableCopies > 0;
            return (
              <div 
                key={book.id} 
                className="p-4 rounded-2xl bg-[#0e1422] border border-[#1e293b] hover:border-blue-500/40 hover:bg-[#121929] transition-all flex flex-col justify-between group shadow-sm"
              >
                <div>
                  <div className="flex gap-3 mb-3">
                    <img
                      src={book.coverImage}
                      alt={book.title}
                      className="w-16 h-24 object-cover rounded-lg border border-[#1e293b] shadow-sm shrink-0"
                    />
                    <div className="min-w-0 flex-1">
                      <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider mb-1 ${
                        isAvailable ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'
                      }`}>
                        {isAvailable ? 'Available' : 'Issued'}
                      </span>
                      <h4 
                        onClick={() => setSelectedBookForDetail(book)}
                        className="font-bold text-white hover:text-blue-400 cursor-pointer text-xs line-clamp-2"
                      >
                        {book.title}
                      </h4>
                      <p className="text-[11px] text-slate-400 truncate mt-0.5">{book.author}</p>
                    </div>
                  </div>

                  <div className="space-y-1 text-[11px] font-code text-slate-400 bg-[#080c14] p-2.5 rounded-xl border border-[#1e293b]">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Accession:</span>
                      <span className="text-blue-400 font-bold">{book.accessionNo}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Call:</span>
                      <span className="text-slate-300">{book.callNumber}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Bay:</span>
                      <span className="text-slate-300">{book.shelfLocation}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-[#1e293b] flex items-center justify-between">
                  <span className="text-xs font-code font-bold text-white">
                    {book.availableCopies}/{book.totalCopies} <span className="text-slate-500 text-[10px]">copies</span>
                  </span>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleEdit(book)}
                      className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-blue-400"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(book.id, book.title)}
                      className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-rose-400"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
