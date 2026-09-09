import React, { useState, useEffect } from 'react';
import { 
  X, 
  User, 
  Mail, 
  Phone, 
  Building2, 
  ShieldCheck, 
  Camera, 
  Check, 
  Sparkles,
  Save
} from 'lucide-react';
import { useLibrary } from '../context/LibraryContext';
import { UserRole } from '../types';

// Curated professional generic young male avatars
export const MALE_AVATAR_PRESETS = [
  {
    id: 'male-1',
    label: 'Professional Classic',
    url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80',
  },
  {
    id: 'male-2',
    label: 'Modern Tech',
    url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop&q=80',
  },
  {
    id: 'male-3',
    label: 'Executive Academic',
    url: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=300&auto=format&fit=crop&q=80',
  },
  {
    id: 'male-4',
    label: 'Creative Scholar',
    url: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=300&auto=format&fit=crop&q=80',
  }
];

export const EditProfileModal: React.FC = () => {
  const { 
    isEditProfileModalOpen, 
    setIsEditProfileModalOpen, 
    adminProfile, 
    updateAdminProfile 
  } = useLibrary();

  const [name, setName] = useState(adminProfile.name);
  const [email, setEmail] = useState(adminProfile.email);
  const [phone, setPhone] = useState(adminProfile.phone || '+1 (555) 234-8901');
  const [department, setDepartment] = useState(adminProfile.department || 'Library Systems & Technology Administration');
  const [role, setRole] = useState<UserRole>(adminProfile.role || 'admin');
  const [avatar, setAvatar] = useState(adminProfile.avatar);
  const [showCustomUrlInput, setShowCustomUrlInput] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Sync state whenever modal opens or adminProfile updates
  useEffect(() => {
    if (isEditProfileModalOpen) {
      setName(adminProfile.name);
      setEmail(adminProfile.email);
      setPhone(adminProfile.phone || '+1 (555) 234-8901');
      setDepartment(adminProfile.department || 'Library Systems & Technology Administration');
      setRole(adminProfile.role || 'admin');
      setAvatar(adminProfile.avatar);
      setErrors({});
    }
  }, [isEditProfileModalOpen, adminProfile]);

  if (!isEditProfileModalOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { [key: string]: string } = {};

    if (!name.trim()) {
      newErrors.name = 'Full name is required';
    }
    if (!email.trim() || !email.includes('@')) {
      newErrors.email = 'Valid institutional email is required';
    }
    if (!phone.trim()) {
      newErrors.phone = 'Contact phone number is required';
    }
    if (!department.trim()) {
      newErrors.department = 'Department is required';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    updateAdminProfile({
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      department: department.trim(),
      role,
      avatar,
    });

    setIsEditProfileModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div 
        className="relative w-full max-w-lg bg-[#0d1424] border border-[#1e293b] rounded-2xl shadow-2xl overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200"
        id="admin-edit-profile-modal"
      >
        {/* Modal Header */}
        <div className="p-5 border-b border-[#1e293b] flex items-center justify-between bg-gradient-to-r from-[#0d1424] via-[#121c33] to-[#0d1424]">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-blue-500/15 border border-blue-500/30 text-blue-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white tracking-tight">Edit Administrator Profile</h3>
              <p className="text-xs text-slate-400">Update your institutional identity, contact info, and avatar</p>
            </div>
          </div>
          <button
            onClick={() => setIsEditProfileModalOpen(false)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-[#1a263f] transition-colors"
            aria-label="Close edit profile modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body / Form */}
        <form onSubmit={handleSave} className="p-6 space-y-5 max-h-[80vh] overflow-y-auto">
          {/* Profile Photo Section */}
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2.5">
              Profile Photo
            </label>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 rounded-xl bg-[#090e1a] border border-[#1e293b]">
              <div className="relative shrink-0">
                <img
                  src={avatar}
                  alt={name || 'Admin'}
                  className="w-20 h-20 rounded-2xl object-cover border-2 border-blue-500/60 shadow-md shadow-blue-500/10"
                />
                <div className="absolute -bottom-1 -right-1 p-1 bg-blue-600 rounded-lg text-white shadow">
                  <Camera className="w-3.5 h-3.5" />
                </div>
              </div>

              <div className="flex-1 space-y-2 w-full">
                <p className="text-xs font-medium text-slate-300">
                  Select professional avatar preset or provide custom photo URL:
                </p>
                <div className="grid grid-cols-4 gap-2">
                  {MALE_AVATAR_PRESETS.map((preset) => {
                    const isSelected = avatar === preset.url;
                    return (
                      <button
                        key={preset.id}
                        type="button"
                        onClick={() => setAvatar(preset.url)}
                        className={`group relative rounded-xl overflow-hidden border-2 transition-all p-0.5 ${
                          isSelected 
                            ? 'border-blue-500 shadow-md shadow-blue-500/25 ring-2 ring-blue-500/30' 
                            : 'border-[#1e293b] hover:border-slate-500'
                        }`}
                        title={preset.label}
                      >
                        <img 
                          src={preset.url} 
                          alt={preset.label}
                          className="w-full h-10 rounded-lg object-cover" 
                        />
                        {isSelected && (
                          <div className="absolute inset-0 bg-blue-600/40 flex items-center justify-center">
                            <Check className="w-3.5 h-3.5 text-white stroke-[3]" />
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>

                <div className="pt-1">
                  <button
                    type="button"
                    onClick={() => setShowCustomUrlInput(prev => !prev)}
                    className="text-[11px] text-blue-400 hover:text-blue-300 font-semibold underline underline-offset-2 flex items-center gap-1"
                  >
                    <Sparkles className="w-3 h-3" />
                    <span>{showCustomUrlInput ? 'Hide custom URL input' : 'Enter custom photo URL'}</span>
                  </button>
                  {showCustomUrlInput && (
                    <input
                      type="url"
                      value={avatar}
                      onChange={(e) => setAvatar(e.target.value)}
                      placeholder="https://images.unsplash.com/..."
                      className="mt-2 w-full px-3 py-1.5 bg-[#0e172a] text-xs text-white rounded-lg border border-[#1e293b] focus:border-blue-500 focus:outline-none font-code"
                    />
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Full Name */}
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
              Full Name <span className="text-rose-400">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <User className="w-4 h-4" />
              </div>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Aravindh"
                className={`w-full pl-10 pr-4 py-2.5 bg-[#090e1a] text-white rounded-xl text-sm border focus:outline-none transition-colors ${
                  errors.name ? 'border-rose-500 focus:border-rose-400' : 'border-[#1e293b] focus:border-blue-500'
                }`}
              />
            </div>
            {errors.name && <p className="text-[11px] text-rose-400 mt-1">{errors.name}</p>}
          </div>

          {/* Email & Phone grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Email */}
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                Institutional Email <span className="text-rose-400">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="aravindh@smartlibrary.edu"
                  className={`w-full pl-10 pr-4 py-2.5 bg-[#090e1a] text-white rounded-xl text-sm border focus:outline-none transition-colors ${
                    errors.email ? 'border-rose-500 focus:border-rose-400' : 'border-[#1e293b] focus:border-blue-500'
                  }`}
                />
              </div>
              {errors.email && <p className="text-[11px] text-rose-400 mt-1">{errors.email}</p>}
            </div>

            {/* Phone Number */}
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                Phone Number <span className="text-rose-400">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Phone className="w-4 h-4" />
                </div>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+1 (555) 234-8901"
                  className={`w-full pl-10 pr-4 py-2.5 bg-[#090e1a] text-white rounded-xl text-sm border focus:outline-none transition-colors ${
                    errors.phone ? 'border-rose-500 focus:border-rose-400' : 'border-[#1e293b] focus:border-blue-500'
                  }`}
                />
              </div>
              {errors.phone && <p className="text-[11px] text-rose-400 mt-1">{errors.phone}</p>}
            </div>
          </div>

          {/* Department */}
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
              Department <span className="text-rose-400">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Building2 className="w-4 h-4" />
              </div>
              <input
                type="text"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                placeholder="Library Systems & Technology Administration"
                className={`w-full pl-10 pr-4 py-2.5 bg-[#090e1a] text-white rounded-xl text-sm border focus:outline-none transition-colors ${
                  errors.department ? 'border-rose-500 focus:border-rose-400' : 'border-[#1e293b] focus:border-blue-500'
                }`}
              />
            </div>
            {errors.department && <p className="text-[11px] text-rose-400 mt-1">{errors.department}</p>}
          </div>

          {/* Role Selection */}
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
              System Role
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as UserRole)}
                className="w-full pl-10 pr-4 py-2.5 bg-[#090e1a] text-white rounded-xl text-sm border border-[#1e293b] focus:border-blue-500 focus:outline-none appearance-none"
              >
                <option value="admin">System Administrator (Full ILS Authority)</option>
                <option value="librarian">Chief Librarian (Circulation & Catalog Head)</option>
              </select>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              Provides administrative overrides, fine management, catalog editing, and audit exports.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="pt-4 border-t border-[#1e293b] flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => setIsEditProfileModalOpen(false)}
              className="px-4 py-2.5 rounded-xl border border-[#1e293b] bg-[#121929] hover:bg-[#182236] text-slate-300 hover:text-white text-xs font-semibold transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-lg shadow-blue-600/25 flex items-center gap-2 transition-all"
            >
              <Save className="w-4 h-4" />
              <span>Save Changes</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
