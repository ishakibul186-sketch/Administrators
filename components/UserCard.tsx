import React from 'react';
import { User } from '../types';

interface UserCardProps {
  user: User;
}

const UserCard: React.FC<UserCardProps> = ({ user }) => {
  const isAdmin = user.role === 'Admin';

  // Generate a consistent color based on the first letter of the name
  const getAvatarColor = (name: string) => {
    const colors = [
      'bg-red-500', 'bg-orange-500', 'bg-amber-500', 'bg-green-500', 
      'bg-emerald-500', 'bg-teal-500', 'bg-cyan-500', 'bg-sky-500', 
      'bg-blue-500', 'bg-indigo-500', 'bg-violet-500', 'bg-purple-500', 
      'bg-fuchsia-500', 'bg-pink-500', 'bg-rose-500'
    ];
    const index = name.charCodeAt(0) % colors.length;
    return colors[index];
  };

  const formatDate = (timestamp: string | number) => {
    if (!timestamp) return 'N/A';
    try {
      // If timestamp is a string that looks like a number, parse it.
      // Firebase often stores timestamps as large integers (milliseconds).
      const date = new Date(Number(timestamp) || timestamp);
      return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }).format(date);
    } catch (e) {
      return String(timestamp);
    }
  };

  return (
    <div className="group relative bg-white rounded-2xl p-6 shadow-sm hover:shadow-xl border border-slate-100 hover:border-indigo-100 transition-all duration-300 transform hover:-translate-y-1">
      {/* Top Decorator */}
      <div className={`absolute top-0 inset-x-0 h-1 rounded-t-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${isAdmin ? 'bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500' : 'bg-slate-200'}`}></div>

      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-4">
          {/* Avatar */}
          <div className={`h-14 w-14 rounded-full flex items-center justify-center text-white text-xl font-bold shadow-md ${getAvatarColor(user.name)}`}>
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-bold text-slate-800 group-hover:text-indigo-600 transition-colors">
                {user.name}
              </h3>
              {isAdmin && (
                <span className="px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700 text-[10px] font-bold uppercase tracking-wider border border-indigo-200">
                  Admin
                </span>
              )}
            </div>
            <div className="flex items-center text-sm text-slate-500 mt-0.5">
              <svg className="w-3.5 h-3.5 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {formatDate(user.time)}
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {/* Email Section */}
        <div className="flex items-center p-2 bg-slate-50 rounded-lg group-hover:bg-indigo-50/50 transition-colors">
          <div className="p-2 bg-white rounded-md shadow-sm mr-3">
            <svg className="w-4 h-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <div className="overflow-hidden">
            <p className="text-xs text-slate-400 font-medium uppercase tracking-wide">Email</p>
            <p className="text-sm font-medium text-slate-700 truncate" title={user.email}>{user.email}</p>
          </div>
        </div>

        {/* Role Section - Added per request */}
        <div className="flex items-center p-2 bg-slate-50 rounded-lg group-hover:bg-indigo-50/50 transition-colors">
          <div className="p-2 bg-white rounded-md shadow-sm mr-3">
            <svg className={`w-4 h-4 ${isAdmin ? 'text-indigo-500' : 'text-slate-500'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {isAdmin ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              )}
            </svg>
          </div>
          <div className="overflow-hidden w-full">
            <p className="text-xs text-slate-400 font-medium uppercase tracking-wide">Role</p>
            <p className={`text-sm font-bold ${isAdmin ? 'text-indigo-600' : 'text-slate-700'}`}>
              {user.role || 'User'}
            </p>
          </div>
        </div>

        {/* User ID Section */}
        <div className="flex items-center p-2 bg-slate-50 rounded-lg group-hover:bg-indigo-50/50 transition-colors">
          <div className="p-2 bg-white rounded-md shadow-sm mr-3">
            <svg className="w-4 h-4 text-slate-500" fill="none" viewBox="0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
            </svg>
          </div>
          <div className="overflow-hidden w-full">
            <p className="text-xs text-slate-400 font-medium uppercase tracking-wide">User ID (Token)</p>
            <div className="flex items-center justify-between">
               <p className="text-sm font-mono font-medium text-slate-600 truncate max-w-[180px]" title={user.id}>
                {user.id}
              </p>
            </div>
          </div>
        </div>
        
        {/* "yttext box" - Access Control */}
        <div className="mt-4 pt-2 border-t border-slate-100">
            <label className="block text-xs font-semibold text-indigo-600 uppercase mb-1.5">
                Access Token
            </label>
            <input 
                type="text" 
                readOnly 
                value={user.id} 
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-500 font-mono focus:outline-none focus:ring-1 focus:ring-indigo-500 select-all"
                placeholder="User Token"
            />
        </div>
      </div>
      
      {/* Action Button */}
      <button className="mt-5 w-full py-2.5 bg-slate-900 hover:bg-indigo-600 text-white text-sm font-medium rounded-xl transition-all duration-300 shadow-md hover:shadow-lg flex items-center justify-center">
        <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
        Manage User
      </button>
    </div>
  );
};

export default UserCard;