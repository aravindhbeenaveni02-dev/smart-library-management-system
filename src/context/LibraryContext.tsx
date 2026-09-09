import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  Book, 
  CirculationTransaction, 
  LibraryNotification, 
  LibraryVitalStats, 
  UserProfile, 
  BookDiscipline 
} from '../types';
import { 
  INITIAL_BOOKS, 
  INITIAL_MEMBERS, 
  INITIAL_NOTIFICATIONS, 
  INITIAL_TRANSACTIONS, 
  INITIAL_VITALS, 
  ADMIN_ARAVINDH,
  LIBRARIAN_SARAH 
} from '../data/initialData';

interface ToastItem {
  id: string;
  message: string;
  type: 'success' | 'info' | 'warning' | 'error';
}

interface LibraryContextType {
  // Navigation & User
  activeTab: string;
  setActiveTab: (tab: string) => void;
  currentUser: UserProfile;
  setCurrentUser: (user: UserProfile) => void;
  adminProfile: UserProfile;
  updateAdminProfile: (updates: Partial<UserProfile>) => void;
  switchUserRole: (role: 'librarian' | 'student' | 'admin', studentId?: string) => void;
  logoutUser: () => void;

  // Modals & Profile
  isEditProfileModalOpen: boolean;
  setIsEditProfileModalOpen: (open: boolean) => void;
  isViewProfileModalOpen: boolean;
  setIsViewProfileModalOpen: (open: boolean) => void;

  // Data
  books: Book[];
  members: UserProfile[];
  transactions: CirculationTransaction[];
  vitals: LibraryVitalStats;
  notifications: LibraryNotification[];

  // Catalog Actions
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  selectedDiscipline: BookDiscipline;
  setSelectedDiscipline: (d: BookDiscipline) => void;
  selectedStockFilter: 'All' | 'Available' | 'Issued' | 'Reserved';
  setSelectedStockFilter: (f: 'All' | 'Available' | 'Issued' | 'Reserved') => void;
  addBook: (bookData: Omit<Book, 'id'>) => void;
  updateBook: (id: string, updates: Partial<Book>) => void;
  deleteBook: (id: string) => void;
  placeHold: (bookId: string) => void;

  // Circulation Actions
  issueBook: (userId: string, bookAccessionOrId: string, days?: number) => boolean;
  returnBook: (transactionIdOrAccession: string) => void;
  renewBook: (transactionId: string) => boolean;
  waiveFine: (transactionId: string) => void;
  payFine: (transactionId: string, amount: number) => void;
  settleAllUserFines: (userId: string) => void;

  // Member Actions
  registerMember: (memberData: Omit<UserProfile, 'id' | 'activeBorrowsCount' | 'finesDue' | 'standing'>) => void;
  updateMember: (id: string, updates: Partial<UserProfile>) => void;

  // Modals & UI Controls
  isAddBookModalOpen: boolean;
  setIsAddBookModalOpen: (open: boolean) => void;
  isRegisterModalOpen: boolean;
  setIsRegisterModalOpen: (open: boolean) => void;
  isPaymentModalOpen: boolean;
  setIsPaymentModalOpen: (open: boolean) => void;
  isQuickSearchOpen: boolean;
  setIsQuickSearchOpen: (open: boolean) => void;
  selectedBookForDetail: Book | null;
  setSelectedBookForDetail: (book: Book | null) => void;
  editingBook: Book | null;
  setEditingBook: (book: Book | null) => void;

  // Toast
  toasts: ToastItem[];
  showToast: (message: string, type?: 'success' | 'info' | 'warning' | 'error') => void;
  removeToast: (id: string) => void;
}

const LibraryContext = createContext<LibraryContextType | undefined>(undefined);

export const LibraryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load initial states from LocalStorage or fallbacks
  const [activeTab, setActiveTab] = useState<string>('dashboard');

  const [adminProfile, setAdminProfile] = useState<UserProfile>(() => {
    try {
      const saved = localStorage.getItem('ath_admin_profile');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.name && !parsed.name.includes('Sarah')) {
          return parsed;
        }
      }
    } catch {
      // fallback
    }
    return ADMIN_ARAVINDH;
  });

  const [currentUser, setCurrentUser] = useState<UserProfile>(() => {
    try {
      const saved = localStorage.getItem('ath_admin_profile');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.name && !parsed.name.includes('Sarah')) {
          return parsed;
        }
      }
    } catch {
      // fallback
    }
    return ADMIN_ARAVINDH;
  });

  // Profile Modals
  const [isEditProfileModalOpen, setIsEditProfileModalOpen] = useState(false);
  const [isViewProfileModalOpen, setIsViewProfileModalOpen] = useState(false);

  const [books, setBooks] = useState<Book[]>(() => {
    const saved = localStorage.getItem('ath_books');
    return saved ? JSON.parse(saved) : INITIAL_BOOKS;
  });

  const [members, setMembers] = useState<UserProfile[]>(() => {
    const saved = localStorage.getItem('ath_members');
    return saved ? JSON.parse(saved) : INITIAL_MEMBERS;
  });

  const [transactions, setTransactions] = useState<CirculationTransaction[]>(() => {
    const saved = localStorage.getItem('ath_transactions');
    return saved ? JSON.parse(saved) : INITIAL_TRANSACTIONS;
  });

  const [vitals, setVitals] = useState<LibraryVitalStats>(INITIAL_VITALS);
  const [notifications, setNotifications] = useState<LibraryNotification[]>(INITIAL_NOTIFICATIONS);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDiscipline, setSelectedDiscipline] = useState<BookDiscipline>('All Disciplines');
  const [selectedStockFilter, setSelectedStockFilter] = useState<'All' | 'Available' | 'Issued' | 'Reserved'>('All');

  // Modals
  const [isAddBookModalOpen, setIsAddBookModalOpen] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isQuickSearchOpen, setIsQuickSearchOpen] = useState(false);
  const [selectedBookForDetail, setSelectedBookForDetail] = useState<Book | null>(null);
  const [editingBook, setEditingBook] = useState<Book | null>(null);

  // Toast stack
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const showToast = (message: string, type: 'success' | 'info' | 'warning' | 'error' = 'info') => {
    const id = Date.now().toString() + Math.random().toString(36).substring(2, 5);
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 3800);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem('ath_books', JSON.stringify(books));
  }, [books]);

  useEffect(() => {
    localStorage.setItem('ath_members', JSON.stringify(members));
  }, [members]);

  useEffect(() => {
    localStorage.setItem('ath_transactions', JSON.stringify(transactions));
  }, [transactions]);

  // Recalculate Vitals dynamically
  useEffect(() => {
    const totalCatalog = books.reduce((sum, b) => sum + b.totalCopies, 0);
    const available = books.reduce((sum, b) => sum + b.availableCopies, 0);
    const issued = transactions.filter(t => t.status === 'issued').length;
    const overdue = transactions.filter(t => t.status === 'overdue').length;
    const unpaidDues = transactions.reduce((sum, t) => sum + (t.assessedFine - t.paidFine - t.waivedFine), 0);

    setVitals(prev => ({
      ...prev,
      totalCatalog: 24850 + (totalCatalog - INITIAL_BOOKS.reduce((s, b) => s + b.totalCopies, 0)),
      availableCopies: 19420 + (available - INITIAL_BOOKS.reduce((s, b) => s + b.availableCopies, 0)),
      shelfStockPercentage: Math.round((available / (totalCatalog || 1)) * 100),
      currentlyIssued: 4890 + (issued - 3),
      overdueItems: 540 + (overdue - 3),
      totalUnpaidFines: 1420 + Math.max(0, unpaidDues - 7.00),
    }));
  }, [books, transactions]);

  // Keyboard shortcut listener: Cmd+K / Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsQuickSearchOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const updateAdminProfile = (updates: Partial<UserProfile>) => {
    setAdminProfile(prev => {
      const updated = { ...prev, ...updates };
      try {
        localStorage.setItem('ath_admin_profile', JSON.stringify(updated));
      } catch {
        // ignore
      }
      return updated;
    });

    setCurrentUser(prev => {
      if (prev.role === 'admin' || prev.role === 'librarian') {
        return { ...prev, ...updates };
      }
      return prev;
    });

    showToast(`Profile changes saved for ${updates.name || adminProfile.name}`, 'success');
  };

  const logoutUser = () => {
    const student = members.find(m => m.name === 'Mahesh') || members[0];
    setCurrentUser(student);
    setActiveTab('student-view');
    showToast(`Logged out of Administrator session (${adminProfile.name}). Switched to Student Scholar view.`, 'info');
  };

  const switchUserRole = (role: 'librarian' | 'student' | 'admin', studentId?: string) => {
    if (role === 'librarian' || role === 'admin') {
      setCurrentUser(adminProfile);
      showToast(`Switched to Administrator (${adminProfile.name})`, 'info');
    } else {
      const student = members.find(m => m.id === (studentId || 'STU-2022-78')) || members[1];
      setCurrentUser(student);
      showToast(`Switched to Student Portal (${student.name} - ${student.rollNumber})`, 'info');
    }
  };

  const addBook = (newBookData: Omit<Book, 'id'>) => {
    const id = `BK-${Date.now().toString(36)}`;
    const newBook: Book = {
      ...newBookData,
      id,
    };
    setBooks(prev => [newBook, ...prev]);
    showToast(`"${newBook.title}" successfully committed to MongoDB Catalog`, 'success');
  };

  const updateBook = (id: string, updates: Partial<Book>) => {
    setBooks(prev => prev.map(b => b.id === id ? { ...b, ...updates } : b));
    showToast('Book record updated in database', 'success');
  };

  const deleteBook = (id: string) => {
    const target = books.find(b => b.id === id);
    setBooks(prev => prev.filter(b => b.id !== id));
    showToast(`"${target?.title || 'Book'}" removed from catalog`, 'info');
  };

  const placeHold = (bookId: string) => {
    setBooks(prev => prev.map(b => {
      if (b.id === bookId) {
        const holds = (b.queuedHolds || 0) + 1;
        return {
          ...b,
          queuedHolds: holds,
          status: 'Reserved',
        };
      }
      return b;
    }));
    showToast('Hold reservation registered in queue', 'success');
  };

  const issueBook = (userId: string, bookAccessionOrId: string, days = 14): boolean => {
    const member = members.find(m => m.id === userId || m.rollNumber === userId);
    if (!member) {
      showToast('Patron roll number not found in registry', 'error');
      return false;
    }

    if (member.activeBorrowsCount >= member.quotaLimit) {
      showToast(`Quota exceeded! Patron currently has ${member.activeBorrowsCount}/${member.quotaLimit} books`, 'warning');
      return false;
    }

    const book = books.find(b => 
      b.accessionNo.toLowerCase() === bookAccessionOrId.toLowerCase() || 
      b.id === bookAccessionOrId ||
      b.isbn === bookAccessionOrId
    );

    if (!book) {
      showToast('Book accession or barcode not found in catalog', 'error');
      return false;
    }

    if (book.availableCopies <= 0) {
      showToast('All physical copies of this title are currently issued', 'warning');
      return false;
    }

    // Calculate dates
    const now = new Date();
    const issueDateStr = now.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });
    const dueDate = new Date();
    dueDate.setDate(now.getDate() + days);
    const dueDateStr = dueDate.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });

    const newTxn: CirculationTransaction = {
      id: `TXN-${Date.now().toString(36)}`,
      transactionNo: `ATH-2025-${Math.floor(1000 + Math.random() * 9000)}`,
      bookId: book.id,
      bookTitle: book.title,
      bookCover: book.coverImage,
      accessionNo: book.accessionNo,
      callNumber: book.callNumber,
      userId: member.id,
      userName: member.name,
      userRoll: member.rollNumber || member.id,
      userDepartment: member.department || 'General',
      issueDate: issueDateStr,
      dueDate: dueDateStr,
      status: 'issued',
      overdueDays: 0,
      assessedFine: 0,
      paidFine: 0,
      waivedFine: 0,
      renewalsCount: 0,
      maxRenewals: 2,
    };

    // Update book copies
    setBooks(prev => prev.map(b => {
      if (b.id === book.id) {
        const remaining = b.availableCopies - 1;
        return {
          ...b,
          availableCopies: remaining,
          status: remaining === 0 ? 'Issued' : b.status,
        };
      }
      return b;
    }));

    // Update member quota
    setMembers(prev => prev.map(m => {
      if (m.id === member.id) {
        return {
          ...m,
          activeBorrowsCount: m.activeBorrowsCount + 1,
        };
      }
      return m;
    }));

    setTransactions(prev => [newTxn, ...prev]);
    showToast(`Issued "${book.title}" to ${member.name}. Due: ${dueDateStr}`, 'success');
    return true;
  };

  const returnBook = (transactionIdOrAccession: string) => {
    const txn = transactions.find(t => 
      t.id === transactionIdOrAccession || 
      t.accessionNo === transactionIdOrAccession
    );

    if (!txn) {
      showToast('Transaction or book accession not found', 'error');
      return;
    }

    if (txn.status === 'returned') {
      showToast('This book copy has already been returned to shelves', 'info');
      return;
    }

    const nowStr = new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });

    setTransactions(prev => prev.map(t => {
      if (t.id === txn.id) {
        return {
          ...t,
          status: 'returned',
          returnDate: nowStr,
          shelfRestocked: 'Stack 4B',
        };
      }
      return t;
    }));

    // Restock book copy
    setBooks(prev => prev.map(b => {
      if (b.id === txn.bookId) {
        return {
          ...b,
          availableCopies: Math.min(b.totalCopies, b.availableCopies + 1),
          status: 'Available',
        };
      }
      return b;
    }));

    // Decrement member borrows
    setMembers(prev => prev.map(m => {
      if (m.id === txn.userId) {
        return {
          ...m,
          activeBorrowsCount: Math.max(0, m.activeBorrowsCount - 1),
        };
      }
      return m;
    }));

    showToast(`Returned: "${txn.bookTitle}". Restocked to shelf.`, 'success');
  };

  const renewBook = (transactionId: string): boolean => {
    const txn = transactions.find(t => t.id === transactionId);
    if (!txn) return false;

    if (txn.renewalsCount >= txn.maxRenewals) {
      showToast('Maximum renewal limit (2x) reached for this item', 'warning');
      return false;
    }

    if (txn.status === 'overdue') {
      showToast('Cannot renew overdue items until dues are settled', 'error');
      return false;
    }

    const currDue = new Date(txn.dueDate);
    const newDue = isNaN(currDue.getTime()) ? new Date() : currDue;
    newDue.setDate(newDue.getDate() + 7);
    const newDueStr = newDue.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });

    setTransactions(prev => prev.map(t => {
      if (t.id === transactionId) {
        return {
          ...t,
          dueDate: newDueStr,
          renewalsCount: t.renewalsCount + 1,
        };
      }
      return t;
    }));

    showToast(`7-Day Renewal Approved! New due date: ${newDueStr}`, 'success');
    return true;
  };

  const waiveFine = (transactionId: string) => {
    setTransactions(prev => prev.map(t => {
      if (t.id === transactionId) {
        const remaining = Math.max(0, t.assessedFine - t.paidFine);
        return {
          ...t,
          waivedFine: remaining,
        };
      }
      return t;
    }));
    showToast('Librarian supervisor authorization granted. Fine waived.', 'success');
  };

  const payFine = (transactionId: string, amount: number) => {
    setTransactions(prev => prev.map(t => {
      if (t.id === transactionId) {
        return {
          ...t,
          paidFine: t.paidFine + amount,
        };
      }
      return t;
    }));
    showToast(`Payment of $${amount.toFixed(2)} recorded in bursar ledger`, 'success');
  };

  const settleAllUserFines = (userId: string) => {
    setTransactions(prev => prev.map(t => {
      if (t.userId === userId && t.assessedFine > (t.paidFine + t.waivedFine)) {
        return {
          ...t,
          paidFine: t.assessedFine - t.waivedFine,
        };
      }
      return t;
    }));

    setMembers(prev => prev.map(m => {
      if (m.id === userId) {
        return {
          ...m,
          finesDue: 0.00,
          standing: 'Good Standing',
        };
      }
      return m;
    }));

    if (currentUser.id === userId) {
      setCurrentUser(prev => ({
        ...prev,
        finesDue: 0.00,
        standing: 'Good Standing',
      }));
    }

    showToast('Payment successful! Account returned to Good Standing.', 'success');
  };

  const registerMember = (memberData: Omit<UserProfile, 'id' | 'activeBorrowsCount' | 'finesDue' | 'standing'>) => {
    const id = memberData.rollNumber || `STU-2025-${Math.floor(1000 + Math.random() * 9000)}`;
    const newMember: UserProfile = {
      ...memberData,
      id,
      activeBorrowsCount: 0,
      finesDue: 0.00,
      standing: memberData.isFaculty ? 'Faculty Privileged' : 'Good Standing',
    };
    setMembers(prev => [newMember, ...prev]);
    showToast(`Patron ${newMember.name} enrolled with RFID Barcode card`, 'success');
  };

  const updateMember = (id: string, updates: Partial<UserProfile>) => {
    setMembers(prev => prev.map(m => m.id === id ? { ...m, ...updates } : m));
    showToast('Member record updated', 'success');
  };

  return (
    <LibraryContext.Provider
      value={{
        activeTab,
        setActiveTab,
        currentUser,
        setCurrentUser,
        adminProfile,
        updateAdminProfile,
        switchUserRole,
        logoutUser,
        isEditProfileModalOpen,
        setIsEditProfileModalOpen,
        isViewProfileModalOpen,
        setIsViewProfileModalOpen,
        books,
        members,
        transactions,
        vitals,
        notifications,
        searchQuery,
        setSearchQuery,
        selectedDiscipline,
        setSelectedDiscipline,
        selectedStockFilter,
        setSelectedStockFilter,
        addBook,
        updateBook,
        deleteBook,
        placeHold,
        issueBook,
        returnBook,
        renewBook,
        waiveFine,
        payFine,
        settleAllUserFines,
        registerMember,
        updateMember,
        isAddBookModalOpen,
        setIsAddBookModalOpen,
        isRegisterModalOpen,
        setIsRegisterModalOpen,
        isPaymentModalOpen,
        setIsPaymentModalOpen,
        isQuickSearchOpen,
        setIsQuickSearchOpen,
        selectedBookForDetail,
        setSelectedBookForDetail,
        editingBook,
        setEditingBook,
        toasts,
        showToast,
        removeToast,
      }}
    >
      {children}
    </LibraryContext.Provider>
  );
};

export const useLibrary = () => {
  const context = useContext(LibraryContext);
  if (!context) {
    throw new Error('useLibrary must be used within a LibraryProvider');
  }
  return context;
};
