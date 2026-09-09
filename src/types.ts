export type UserRole = 'admin' | 'librarian' | 'student';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: UserRole;
  rollNumber?: string;
  department?: string;
  avatar: string;
  year?: string | number;
  quotaLimit: number;
  activeBorrowsCount: number;
  finesDue: number;
  standing: 'Good Standing' | 'Fines Due' | 'Faculty Privileged' | 'Blocked';
  isFaculty?: boolean;
}

export type BookDiscipline = 
  | 'All Disciplines'
  | 'Computer Science & AI'
  | 'Mechanical Eng'
  | 'Medicine'
  | 'Literature & History'
  | 'Economics'
  | 'Physics & Math';

export type BookStatus = 'Available' | 'Reserved' | 'Issued' | 'Reference Only';

export interface Book {
  id: string;
  accessionNo: string;
  title: string;
  author: string;
  edition?: string;
  isbn: string;
  callNumber: string;
  shelfLocation: string;
  discipline: BookDiscipline;
  coverImage: string;
  totalCopies: number;
  availableCopies: number;
  status: BookStatus;
  publishYear?: number;
  publisher?: string;
  description?: string;
  earliestDueDate?: string;
  queuedHolds?: number;
  isReferenceOnly?: boolean;
}

export interface CirculationTransaction {
  id: string;
  transactionNo: string;
  bookId: string;
  bookTitle: string;
  bookCover: string;
  accessionNo: string;
  callNumber: string;
  userId: string;
  userName: string;
  userRoll: string;
  userDepartment: string;
  issueDate: string;
  dueDate: string;
  returnDate?: string;
  status: 'issued' | 'returned' | 'overdue';
  overdueDays: number;
  assessedFine: number;
  paidFine: number;
  waivedFine: number;
  renewalsCount: number;
  maxRenewals: number;
  shelfRestocked?: string;
}

export interface LibraryVitalStats {
  totalCatalog: number;
  totalCatalogMonthlyGrowth: number;
  availableCopies: number;
  shelfStockPercentage: number;
  currentlyIssued: number;
  overdueItems: number;
  totalUnpaidFines: number;
  activeRfidGateways: boolean;
  deskClosingTime: string;
  currentCapacityPercentage: number;
  occupiedSeats: number;
  totalSeats: number;
  peakRushHours: string;
  todayCheckouts: number;
  todayReturns: number;
}

export interface LibraryNotification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  type: 'alert' | 'info' | 'success' | 'warning';
  read: boolean;
  linkTab?: string;
}
