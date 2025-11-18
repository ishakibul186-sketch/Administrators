
import React, { useEffect, useState, useMemo } from 'react';
import { fetchAllUsers, fetchTools, fetchAdminProfiles } from './services/firebase';
import { User, ToolData, AdminProfile } from './types';
import SearchBar from './components/SearchBar';
import UserCard from './components/UserCard';
import ToolAccessCard from './components/ToolAccessCard';
import AddToolModal from './components/AddToolModal';
import AdminProfileCard from './components/AdminProfileCard';
import AddAdminModal from './components/AddAdminModal';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<'home' | 'apps-hive' | 'tool-access' | 'admin-profile'>('home');
  
  // User State
  const [users, setUsers] = useState<User[]>([]);
  const [userLoading, setUserLoading] = useState<boolean>(false);
  const [userError, setUserError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');

  // Tool State
  const [tools, setTools] = useState<ToolData[]>([]);
  const [toolLoading, setToolLoading] = useState<boolean>(false);
  const [isAddToolModalOpen, setIsAddToolModalOpen] = useState<boolean>(false);

  // Admin Profile State
  const [adminProfiles, setAdminProfiles] = useState<AdminProfile[]>([]);
  const [adminLoading, setAdminLoading] = useState<boolean>(false);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState<boolean>(false);

  // --- Data Loading Functions ---
  
  const loadUsers = async () => {
    setUserLoading(true);
    try {
      const data = await fetchAllUsers();
      setUsers(data);
      setUserError(null);
    } catch (err) {
      setUserError('Failed to load user data. Please check your internet connection.');
      console.error(err);
    } finally {
      setUserLoading(false);
    }
  };

  const loadTools = async () => {
    setToolLoading(true);
    try {
      const data = await fetchTools();
      setTools(data);
    } catch (err) {
      console.error("Failed to load tools", err);
    } finally {
      setToolLoading(false);
    }
  };

  const loadAdminProfiles = async () => {
    setAdminLoading(true);
    try {
      const data = await fetchAdminProfiles();
      setAdminProfiles(data);
    } catch (err) {
      console.error("Failed to load admin profiles", err);
    } finally {
      setAdminLoading(false);
    }
  };

  // Initial Data Fetch based on View
  useEffect(() => {
    if (currentView === 'apps-hive') {
      loadUsers();
    } else if (currentView === 'tool-access') {
      loadTools();
    } else if (currentView === 'admin-profile') {
      loadAdminProfiles();
    }
  }, [currentView]);

  // Filter Logic for Users
  const filteredUsers = useMemo(() => {
    if (!searchTerm) return users;
    const lowerTerm = searchTerm.toLowerCase();
    return users.filter((user) => 
      (user.name && user.name.toLowerCase().includes(lowerTerm)) ||
      (user.email && user.email.toLowerCase().includes(lowerTerm)) ||
      (user.id && user.id.toLowerCase().includes(lowerTerm))
    );
  }, [users, searchTerm]);

  const navigateHome = () => {
    setCurrentView('home');
    setSearchTerm('');
  };

  // Helper to determine header color
  const getHeaderColorClass = () => {
    switch(currentView) {
      case 'tool-access': return 'bg-cyan-600 group-hover:shadow-cyan-500/30';
      case 'admin-profile': return 'bg-violet-600 group-hover:shadow-violet-500/30';
      default: return 'bg-indigo-600 group-hover:shadow-indigo-500/30';
    }
  };

  const getHeaderTitle = () => {
    switch(currentView) {
      case 'tool-access': return 'Platform Tool Access';
      case 'admin-profile': return 'Admin Profiles';
      default: return 'Apps Hive Access Control';
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-20 font-sans">
      {/* Navigation Header */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200 shadow-sm transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div 
              className="flex items-center gap-3 cursor-pointer group" 
              onClick={navigateHome}
            >
              <div className={`p-2 rounded-xl shadow-lg transition-all duration-300 group-hover:scale-105 ${getHeaderColorClass()}`}>
                {currentView === 'home' ? (
                  <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                ) : (
                  <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                     {currentView === 'admin-profile' ? (
                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                     ) : currentView === 'tool-access' ? (
                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11.536 16.25 13.5 18.25 11.5 20.25 9.5 18.25 7.5 20.25 5.5 18.25l4.25-4.257A6 6 0 1121 9z" />
                     ) : (
                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                     )}
                  </svg>
                )}
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900 tracking-tight group-hover:text-indigo-600 transition-colors">Administator</h1>
                <p className="text-xs text-slate-500 font-medium">
                    {getHeaderTitle()}
                </p>
              </div>
            </div>
            
            {/* Header Actions */}
            <div className="flex items-center space-x-4">
                {currentView !== 'home' && (
                    <button 
                        onClick={navigateHome}
                        className="hidden md:flex items-center px-4 py-2 text-sm font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                    >
                        <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        Back to Home
                    </button>
                )}
            </div>
          </div>
        </div>
      </nav>

      {/* Main Layout Switcher */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        
        {/* HOME VIEW */}
        {currentView === 'home' && (
            <div className="animate-in fade-in zoom-in duration-500">
                <div className="text-center mb-16 mt-10">
                    <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight mb-4">
                        Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">Admin</span>
                    </h2>
                    <p className="text-lg text-slate-500 max-w-2xl mx-auto">
                        Manage your ecosystem. Control user access, monitor database activity, and configure platform tools from one central hub.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {/* Apps Hive Card */}
                    <div 
                        onClick={() => setCurrentView('apps-hive')}
                        className="group relative bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl border border-slate-100 hover:border-indigo-100 transition-all duration-300 cursor-pointer transform hover:-translate-y-2 overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-indigo-50 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                        
                        <div className="relative z-10">
                            <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-indigo-600 transition-colors duration-300 shadow-sm group-hover:shadow-indigo-500/30">
                                <svg className="w-8 h-8 text-indigo-600 group-hover:text-white transition-colors duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                </svg>
                            </div>
                            
                            <h3 className="text-2xl font-bold text-slate-900 mb-2 group-hover:text-indigo-600 transition-colors">Apps Hive</h3>
                            <p className="text-slate-500 mb-6 line-clamp-2">
                                Manage user database, authentication tokens, and role-based access control.
                            </p>

                            <div className="flex items-center text-indigo-600 font-semibold group-hover:translate-x-2 transition-transform duration-300">
                                View Users
                                <svg className="w-5 h-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    {/* Access To (Tools) Card */}
                    <div 
                        onClick={() => setCurrentView('tool-access')}
                        className="group relative bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl border border-slate-100 hover:border-cyan-100 transition-all duration-300 cursor-pointer transform hover:-translate-y-2 overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-cyan-50 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                        
                        <div className="relative z-10">
                            <div className="w-16 h-16 bg-cyan-50 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-cyan-600 transition-colors duration-300 shadow-sm group-hover:shadow-cyan-500/30">
                                <svg className="w-8 h-8 text-cyan-600 group-hover:text-white transition-colors duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11.536 16.25 13.5 18.25 11.5 20.25 9.5 18.25 7.5 20.25 5.5 18.25l4.25-4.257A6 6 0 1121 9z" />
                                </svg>
                            </div>
                            
                            <h3 className="text-2xl font-bold text-slate-900 mb-2 group-hover:text-cyan-600 transition-colors">Access To</h3>
                            <p className="text-slate-500 mb-6 line-clamp-2">
                                Manage platform tools, webview access points, and error handling configurations.
                            </p>

                            <div className="flex items-center text-cyan-600 font-semibold group-hover:translate-x-2 transition-transform duration-300">
                                Manage Tools
                                <svg className="w-5 h-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                </svg>
                            </div>
                        </div>
                    </div>

                     {/* Admin Profile Card - NEW */}
                     <div 
                        onClick={() => setCurrentView('admin-profile')}
                        className="group relative bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl border border-slate-100 hover:border-violet-100 transition-all duration-300 cursor-pointer transform hover:-translate-y-2 overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-violet-50 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                        
                        <div className="relative z-10">
                            <div className="w-16 h-16 bg-violet-50 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-violet-600 transition-colors duration-300 shadow-sm group-hover:shadow-violet-500/30">
                                <svg className="w-8 h-8 text-violet-600 group-hover:text-white transition-colors duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                            </div>
                            
                            <h3 className="text-2xl font-bold text-slate-900 mb-2 group-hover:text-violet-600 transition-colors">Admin Profile</h3>
                            <p className="text-slate-500 mb-6 line-clamp-2">
                                Create and manage administrator profiles, assign permissions, and control account status.
                            </p>

                            <div className="flex items-center text-violet-600 font-semibold group-hover:translate-x-2 transition-transform duration-300">
                                Manage Admins
                                <svg className="w-5 h-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                </svg>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        )}

        {/* USER LIST VIEW */}
        {currentView === 'apps-hive' && (
            <div className="animate-in slide-in-from-bottom-4 duration-500">
                {/* Back Button Mobile */}
                <div className="md:hidden mb-6">
                     <button 
                        onClick={navigateHome}
                        className="flex items-center text-slate-500 hover:text-slate-800"
                    >
                        <svg className="w-5 h-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        Back to Home
                    </button>
                </div>

                {/* Search Section */}
                <div className="flex flex-col items-center justify-center mb-10">
                    <div className="w-full max-w-2xl">
                        <SearchBar value={searchTerm} onChange={setSearchTerm} />
                        
                        {/* Helper Text */}
                        <p className="text-center text-sm text-slate-400 mt-2">
                            Showing <span className="font-bold text-slate-700">{filteredUsers.length}</span> active users
                        </p>
                    </div>
                </div>

                {/* Loading State */}
                {userLoading && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
                    {[...Array(6)].map((_, i) => (
                    <div key={i} className="bg-white h-64 rounded-2xl shadow-sm p-6 border border-slate-100">
                        <div className="flex space-x-4 mb-4">
                            <div className="rounded-full bg-slate-200 h-14 w-14"></div>
                            <div className="flex-1 space-y-2 py-1">
                                <div className="h-4 bg-slate-200 rounded w-3/4"></div>
                                <div className="h-3 bg-slate-200 rounded w-1/2"></div>
                            </div>
                        </div>
                        <div className="space-y-3">
                            <div className="h-10 bg-slate-100 rounded-lg"></div>
                            <div className="h-10 bg-slate-100 rounded-lg"></div>
                        </div>
                    </div>
                    ))}
                </div>
                )}

                {/* Error State */}
                {userError && !userLoading && (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                    <div className="bg-red-50 p-4 rounded-full mb-4">
                        <svg className="w-10 h-10 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                    </div>
                    <h3 className="text-lg font-bold text-slate-800 mb-2">Something went wrong</h3>
                    <p className="text-slate-500 max-w-md">{userError}</p>
                    <button 
                        onClick={() => window.location.reload()} 
                        className="mt-6 px-6 py-2 bg-slate-900 text-white rounded-lg font-medium hover:bg-slate-800 transition-colors shadow-lg shadow-slate-900/20"
                    >
                        Reload Application
                    </button>
                </div>
                )}

                {/* Data Grid */}
                {!userLoading && !userError && filteredUsers.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                    {filteredUsers.map((user) => (
                    <UserCard key={user.id} user={user} />
                    ))}
                </div>
                )}
            </div>
        )}

        {/* TOOL ACCESS VIEW */}
        {currentView === 'tool-access' && (
          <div className="animate-in slide-in-from-bottom-4 duration-500">
             <div className="flex items-center justify-between mb-8">
                <button 
                    onClick={navigateHome}
                    className="flex items-center text-slate-500 hover:text-slate-800 md:hidden"
                >
                    <svg className="w-5 h-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    Back
                </button>
                <h2 className="text-2xl font-bold text-slate-800 hidden md:block">Tool Configuration</h2>
             </div>

             {toolLoading && (
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
                 {[1, 2, 3].map((i) => (
                   <div key={i} className="h-48 bg-slate-200 rounded-2xl"></div>
                 ))}
               </div>
             )}

             {!toolLoading && tools.length === 0 && (
               <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-200">
                  <div className="bg-cyan-50 p-4 rounded-full inline-block mb-4">
                    <svg className="w-8 h-8 text-cyan-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-slate-900">No Tools Configured</h3>
                  <p className="text-slate-500 mb-6">Get started by adding a new tool access point.</p>
               </div>
             )}

             {!toolLoading && tools.length > 0 && (
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                 {tools.map((tool) => (
                   <ToolAccessCard key={tool.id} tool={tool} onRefresh={loadTools} />
                 ))}
               </div>
             )}
             
             {/* Floating Action Button - Tools */}
             <button 
               onClick={() => setIsAddToolModalOpen(true)}
               className="fixed bottom-8 right-8 bg-cyan-600 text-white p-4 rounded-full shadow-xl hover:bg-cyan-700 hover:scale-110 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 z-40"
             >
               <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
               </svg>
             </button>

             {/* Add Tool Modal */}
             <AddToolModal 
               isOpen={isAddToolModalOpen} 
               onClose={() => setIsAddToolModalOpen(false)} 
               onSuccess={loadTools} 
             />
          </div>
        )}

        {/* ADMIN PROFILE VIEW - NEW */}
        {currentView === 'admin-profile' && (
            <div className="animate-in slide-in-from-bottom-4 duration-500">
             <div className="flex items-center justify-between mb-8">
                <button 
                    onClick={navigateHome}
                    className="flex items-center text-slate-500 hover:text-slate-800 md:hidden"
                >
                    <svg className="w-5 h-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    Back
                </button>
                <h2 className="text-2xl font-bold text-slate-800 hidden md:block">Admin Profiles</h2>
             </div>

             {adminLoading && (
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
                 {[1, 2, 3].map((i) => (
                   <div key={i} className="h-40 bg-slate-200 rounded-2xl"></div>
                 ))}
               </div>
             )}

             {!adminLoading && adminProfiles.length === 0 && (
               <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-200">
                  <div className="bg-violet-50 p-4 rounded-full inline-block mb-4">
                    <svg className="w-8 h-8 text-violet-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-slate-900">No Admins Found</h3>
                  <p className="text-slate-500 mb-6">Grant administrator privileges to your first user.</p>
               </div>
             )}

             {!adminLoading && adminProfiles.length > 0 && (
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                 {adminProfiles.map((profile) => (
                   <AdminProfileCard key={profile.id} profile={profile} onRefresh={loadAdminProfiles} />
                 ))}
               </div>
             )}
             
             {/* Floating Action Button - Admin */}
             <button 
               onClick={() => setIsAdminModalOpen(true)}
               className="fixed bottom-8 right-8 bg-violet-600 text-white p-4 rounded-full shadow-xl hover:bg-violet-700 hover:scale-110 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 z-40"
             >
               <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
               </svg>
             </button>

             {/* Add Admin Modal */}
             <AddAdminModal 
               isOpen={isAdminModalOpen} 
               onClose={() => setIsAdminModalOpen(false)} 
               onSuccess={loadAdminProfiles} 
             />
          </div>
        )}

      </main>
    </div>
  );
};

export default App;