import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAppContext } from '@/context/AppContext';
import { X, User, Calendar, Search, Home, LogOut } from 'lucide-react';

const Sidebar: React.FC = () => {
  const { user, logout, isSidebarOpen, setIsSidebarOpen } = useAppContext();
  const router = useRouter();

  if (!isSidebarOpen) return null;

  const handleLogout = async () => {
    await logout();
    setIsSidebarOpen(false);
    router.push('/login');
  };

  return (
    <div className="fixed inset-y-0 right-0 w-64 bg-white dark:bg-gray-800 shadow-lg z-50 transform transition-transform duration-300 ease-in-out">
      <button 
        onClick={() => setIsSidebarOpen(false)} 
        className="absolute top-4 right-4 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100"
        aria-label="Close sidebar"
      >
        <X size={24} />
      </button>
      <div className="p-4 mt-12">
        {user && (
          <>
            <img src={user.profilePicture || '/default-avatar.png'} alt={user.name} className="w-16 h-16 rounded-full mb-4 mx-auto" />
            <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-gray-200 text-center">{user.name}</h2>
          </>
        )}
        <nav className="space-y-2">
          <Link href="/profile" className="block p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded text-gray-700 dark:text-gray-300" onClick={() => setIsSidebarOpen(false)}>
            <User className="inline-block mr-2" size={20} /> Profile
          </Link>
          <Link href="/my-meetz" className="block p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded text-gray-700 dark:text-gray-300" onClick={() => setIsSidebarOpen(false)}>
            <Calendar className="inline-block mr-2" size={20} /> My Meetz
          </Link>
          <Link href="/search" className="block p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded text-gray-700 dark:text-gray-300" onClick={() => setIsSidebarOpen(false)}>
            <Search className="inline-block mr-2" size={20} /> Search
          </Link>
          <Link href="/discover" className="block p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded text-gray-700 dark:text-gray-300" onClick={() => setIsSidebarOpen(false)}>
            <Home className="inline-block mr-2" size={20} /> Discover
          </Link>
          {user ? (
            <button 
              onClick={handleLogout} 
              className="block w-full text-left p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded text-gray-700 dark:text-gray-300"
            >
              <LogOut className="inline-block mr-2" size={20} /> Logout
            </button>
          ) : (
            <Link href="/login" className="block p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded text-gray-700 dark:text-gray-300" onClick={() => setIsSidebarOpen(false)}>
              <LogOut className="inline-block mr-2" size={20} /> Login
            </Link>
          )}
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;