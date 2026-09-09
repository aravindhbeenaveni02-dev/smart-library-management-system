import React, { useState, useEffect } from 'react';
import { useLibrary } from '../context/LibraryContext';
import { Book, BookDiscipline } from '../types';
import { X, BookPlus, Save, Image as ImageIcon } from 'lucide-react';

export const AddBookModal: React.FC = () => {
  const { isAddBookModalOpen, setIsAddBookModalOpen, editingBook, addBook, updateBook } = useLibrary();

  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [isbn, setIsbn] = useState('');
  const [accessionNo, setAccessionNo] = useState('');
  const [discipline, setDiscipline] = useState<BookDiscipline>('Computer Science & AI');
  const [edition, setEdition] = useState('1st Ed');
  const [callNumber, setCallNumber] = useState('');
  const [shelfLocation, setShelfLocation] = useState('Stack 4-B');
  const [totalCopies, setTotalCopies] = useState<number>(5);
  const [coverImage, setCoverImage] = useState('');
  const [description, setDescription] = useState('');

  const disciplines: BookDiscipline[] = [
    'Computer Science & AI',
    'Mechanical Eng',
    'Medicine',
    'Literature & History',
    'Economics',
    'Physics & Math',
  ];

  useEffect(() => {
    if (editingBook) {
      setTitle(editingBook.title);
      setAuthor(editingBook.author);
      setIsbn(editingBook.isbn);
      setAccessionNo(editingBook.accessionNo);
      setDiscipline(editingBook.discipline);
      setEdition(editingBook.edition || '1st Ed');
      setCallNumber(editingBook.callNumber);
      setShelfLocation(editingBook.shelfLocation);
      setTotalCopies(editingBook.totalCopies);
      setCoverImage(editingBook.coverImage);
      setDescription(editingBook.description || '');
    } else {
      const randNum = Math.floor(100000 + Math.random() * 900000);
      setTitle('');
      setAuthor('');
      setIsbn(`978-${Math.floor(1000000000 + Math.random() * 9000000000)}`);
      setAccessionNo(`ACC-${randNum}`);
      setDiscipline('Computer Science & AI');
      setEdition('3rd Ed');
      setCallNumber(`QA76.${randNum.toString().slice(0, 3)} .M${randNum.toString().slice(3, 5)}`);
      setShelfLocation('Bay 4-B');
      setTotalCopies(5);
      setCoverImage('https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&auto=format&fit=crop&q=80');
      setDescription('');
    }
  }, [editingBook, isAddBookModalOpen]);

  if (!isAddBookModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !author.trim()) return;

    if (editingBook) {
      updateBook(editingBook.id, {
        title,
        author,
        isbn,
        accessionNo,
        discipline,
        edition,
        callNumber,
        shelfLocation,
        totalCopies,
        coverImage,
        description,
      });
    } else {
      addBook({
        title,
        author,
        isbn,
        accessionNo,
        discipline,
        edition,
        callNumber,
        shelfLocation,
        totalCopies,
        availableCopies: totalCopies,
        status: 'Available',
        coverImage: coverImage || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&auto=format&fit=crop&q=80',
        description,
      });
    }
    setIsAddBookModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-[#0e1422] rounded-3xl w-full max-w-2xl border border-[#1e293b] shadow-2xl overflow-hidden my-6 animate-in fade-in zoom-in-95">
        {/* Header */}
        <div className="px-6 py-4 bg-[#090d16] border-b border-[#1e293b] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center">
              <BookPlus className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white">
                {editingBook ? 'Edit Catalog Record' : 'Add New Book to Master Catalog'}
              </h3>
              <p className="text-xs text-slate-400">
                RFID accession, classification, and inventory metadata
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsAddBookModalOpen(false)}
            aria-label="Close modal"
            className="w-8 h-8 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Book Title *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Artificial Intelligence: A Modern Approach"
                className="w-full px-3 py-2 bg-[#080c14] text-xs md:text-sm text-white rounded-xl border border-[#1e293b] focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Primary Author(s) *
              </label>
              <input
                type="text"
                required
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                placeholder="e.g. Stuart Russell &amp; Peter Norvig"
                className="w-full px-3 py-2 bg-[#080c14] text-xs md:text-sm text-white rounded-xl border border-[#1e293b] focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Academic Discipline
              </label>
              <select
                value={discipline}
                onChange={(e) => setDiscipline(e.target.value as BookDiscipline)}
                className="w-full px-3 py-2 bg-[#080c14] text-xs md:text-sm text-white rounded-xl border border-[#1e293b] focus:outline-none focus:border-blue-500"
              >
                {disciplines.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                ISBN-13
              </label>
              <input
                type="text"
                value={isbn}
                onChange={(e) => setIsbn(e.target.value)}
                className="w-full px-3 py-2 bg-[#080c14] text-xs font-code text-white rounded-xl border border-[#1e293b] focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Accession Number
              </label>
              <input
                type="text"
                value={accessionNo}
                onChange={(e) => setAccessionNo(e.target.value)}
                className="w-full px-3 py-2 bg-[#080c14] text-xs font-code text-blue-400 font-bold rounded-xl border border-[#1e293b] focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Call Number
              </label>
              <input
                type="text"
                value={callNumber}
                onChange={(e) => setCallNumber(e.target.value)}
                placeholder="e.g. QA76.73 .C15"
                className="w-full px-3 py-2 bg-[#080c14] text-xs font-code text-white rounded-xl border border-[#1e293b] focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Shelf Location / Bay
              </label>
              <input
                type="text"
                value={shelfLocation}
                onChange={(e) => setShelfLocation(e.target.value)}
                placeholder="e.g. Bay 3-C East"
                className="w-full px-3 py-2 bg-[#080c14] text-xs text-white rounded-xl border border-[#1e293b] focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Total Copies in Stock
              </label>
              <input
                type="number"
                min="1"
                max="50"
                value={totalCopies}
                onChange={(e) => setTotalCopies(parseInt(e.target.value) || 1)}
                className="w-full px-3 py-2 bg-[#080c14] text-xs font-code text-white rounded-xl border border-[#1e293b] focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Edition / Volume
              </label>
              <input
                type="text"
                value={edition}
                onChange={(e) => setEdition(e.target.value)}
                placeholder="e.g. 4th Global Edition"
                className="w-full px-3 py-2 bg-[#080c14] text-xs text-white rounded-xl border border-[#1e293b] focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Cover Image URL
              </label>
              <div className="flex gap-2">
                <input
                  type="url"
                  value={coverImage}
                  onChange={(e) => setCoverImage(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="flex-1 px-3 py-2 bg-[#080c14] text-xs text-white rounded-xl border border-[#1e293b] focus:outline-none focus:border-blue-500"
                />
                {coverImage && (
                  <img
                    src={coverImage}
                    alt="Preview"
                    className="w-10 h-10 object-cover rounded-lg border border-[#1e293b]"
                  />
                )}
              </div>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Abstract &amp; Catalog Notes
              </label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Brief summary or syllabus topics covered in this volume..."
                className="w-full px-3 py-2 bg-[#080c14] text-xs text-white rounded-xl border border-[#1e293b] focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div className="pt-3 border-t border-[#1e293b] flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={() => setIsAddBookModalOpen(false)}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white rounded-xl text-xs font-bold shadow-lg shadow-blue-600/25 flex items-center gap-1.5 transition-all"
            >
              <Save className="w-4 h-4" />
              <span>{editingBook ? 'Save Changes' : 'Create Catalog Entry'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
