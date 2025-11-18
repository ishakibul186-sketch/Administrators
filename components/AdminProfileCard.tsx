
import React, { useState } from 'react';
import { AdminProfile } from '../types';
import { addOrUpdateAdminProfile } from '../services/firebase';

interface AdminProfileCardProps {
  profile: AdminProfile;
  onRefresh: () => void;
}

const AdminProfileCard: React.FC<AdminProfileCardProps> = ({ profile, onRefresh }) => {
  const [isToggling, setIsToggling] = useState(false);

  const handleToggle = async () => {
    setIsToggling(true);
    try {
      // Update status in DB
      // We pass profile.id as the userid (key), and the new status
      await addOrUpdateAdminProfile(profile.id, profile.name, !profile.status, profile.error);
      setTimeout(() => {
        onRefresh();
        setIsToggling(false);
      }, 500);
    } catch (error) {
      console.error("Failed to toggle status", error);
      setIsToggling(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 hover:border-violet-200 transition-all duration-300 hover:shadow-lg relative group">
       {/* Decorator Line */}
       <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${profile.status ? 'bg-violet-500' : 'bg-slate-300'} transition-colors duration-300 rounded-l-2xl`}></div>

      <div className="flex items-start justify-between mb-4 pl-2">
        <div className="flex items-center space-x-4">
          {/* Avatar */}
          <div className={`h-12 w-12 rounded-full flex items-center justify-center text-white text-lg font-bold shadow-md ${profile.status ? 'bg-gradient-to-br from-violet-500 to-fuchsia-600' : 'bg-slate-400'}`}>
            {profile.name.charAt(0).toUpperCase()}
          </div>
          <div className="overflow-hidden">
            <h3 className="text-lg font-bold text-slate-800 group-hover:text-violet-700 transition-colors truncate">
              {profile.name}
            </h3>
            <p className="text-xs text-slate-400 font-mono mt-0.5 truncate max-w-[150px]" title={profile.id}>
              {profile.id}
            </p>
          </div>
        </div>
        
        <span className={`flex-shrink-0 inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wider ${
              profile.status ? 'bg-violet-100 text-violet-800' : 'bg-slate-100 text-slate-500'
            }`}>
           {profile.status ? 'Active' : 'Inactive'}
        </span>
      </div>

      <div className="space-y-3 pl-2">
         {/* Error/Note Section */}
        <div className="bg-slate-50 rounded-lg p-3 border border-slate-100">
            <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">
                System Message / Error
            </label>
            <div className="text-sm font-mono text-slate-600 break-all min-h-[1.5rem]">
                {profile.error || <span className="text-slate-300 italic">No message configured</span>}
            </div>
        </div>
      </div>

      {/* Toggle Action */}
      <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between pl-2">
        <span className="text-sm font-medium text-slate-500">Profile Access</span>
        <button 
            onClick={handleToggle}
            disabled={isToggling}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 ${
              profile.status ? 'bg-violet-600' : 'bg-slate-300'
            } ${isToggling ? 'opacity-50 cursor-wait' : 'cursor-pointer'}`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 shadow-sm ${
                profile.status ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
      </div>
    </div>
  );
};

export default AdminProfileCard;
