import React, { useState } from 'react';
import { useLibrary } from '../context/LibraryContext';
import { X, UserPlus, GraduationCap, ShieldCheck, Mail, Hash, BookOpen } from 'lucide-react';

export const RegisterMemberModal: React.FC = () => {
  const { isRegisterModalOpen, setIsRegisterModalOpen, registerMember } = useLibrary();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<'student' | 'faculty'>('student');
  const [rollNumber, setRollNumber] = useState('');
  const [department, setDepartment] = useState('Computer Science');
  const [year, setYear] = useState('Year 2');
  const [quotaLimit, setQuotaLimit] = useState<number>(4);

  if (!isRegisterModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;

    registerMember({
      name,
      email,
      role: 'student',
      isFaculty: role === 'faculty',
      rollNumber: rollNumber || `STU-2025-${Math.floor(100 + Math.random() * 900)}`,
      department,
      year: role === 'faculty' ? 'Faculty Member' : year,
      avatar: `https://images.unsplash.com/photo-${role === 'faculty' ? '1534528741775-53994a69daeb' : '1539571696357-5a69c17a67c6'}?w=150&auto=format&fit=crop&q=80`,
      standing: 'Good Standing',
      quotaLimit: Number(quotaLimit),
      activeBorrowsCount: 0,
      finesDue: 0,
    });

    setIsRegisterModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-[#0e1422] rounded-3xl w-full max-w-lg border border-[#1e293b] shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 text-slate-200">
        <div className="px-6 py-4 bg-[#090d16] border-b border-[#1e293b] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center">
              <UserPlus className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white">
                Enroll New College Patron
              </h3>
              <p className="text-xs text-slate-400">
                Issue library borrower credentials &amp; circulation card
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsRegisterModalOpen(false)}
            className="w-8 h-8 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Full Name *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Samantha Wright"
                className="w-full px-3 py-2 bg-[#080c14] border border-[#1e293b] rounded-xl text-xs text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Institutional Email *
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="s.wright@university.edu"
                className="w-full px-3 py-2 bg-[#080c14] border border-[#1e293b] rounded-xl text-xs text-white focus:outline-none focus:border-blue-500 font-code"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Membership Type
                </label>
                <select
                  value={role}
                  onChange={(e) => {
                    const r = e.target.value as 'student' | 'faculty';
                    setRole(r);
                    setQuotaLimit(r === 'faculty' ? 8 : 4);
                  }}
                  className="w-full px-3 py-2 bg-[#080c14] border border-[#1e293b] rounded-xl text-xs text-white focus:outline-none focus:border-blue-500"
                >
                  <option value="student">Student Scholar</option>
                  <option value="faculty">Faculty Member</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Roll / ID Number
                </label>
                <input
                  type="text"
                  value={rollNumber}
                  onChange={(e) => setRollNumber(e.target.value)}
                  placeholder="e.g. STU-2025-104"
                  className="w-full px-3 py-2 bg-[#080c14] border border-[#1e293b] rounded-xl text-xs text-white focus:outline-none focus:border-blue-500 font-code"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Department
                </label>
                <input
                  type="text"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  placeholder="e.g. Computer Science"
                  className="w-full px-3 py-2 bg-[#080c14] border border-[#1e293b] rounded-xl text-xs text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Borrowing Quota
                </label>
                <input
                  type="number"
                  min="1"
                  max="12"
                  value={quotaLimit}
                  onChange={(e) => setQuotaLimit(parseInt(e.target.value) || 4)}
                  className="w-full px-3 py-2 bg-[#080c14] border border-[#1e293b] rounded-xl text-xs text-white focus:outline-none focus:border-blue-500 font-code"
                />
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-[#1e293b] flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={() => setIsRegisterModalOpen(false)}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white rounded-xl text-xs font-bold shadow-lg shadow-blue-600/25 flex items-center gap-1.5 transition-all"
            >
              <UserPlus className="w-4 h-4" />
              <span>Enroll Member</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
