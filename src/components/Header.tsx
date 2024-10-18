import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Sun, Moon, Bell, Calendar, User, Hourglass } from 'lucide-react';
import { useAppContext } from '@/context/AppContext';

function Header() {
  const { darkMode, toggleDarkMode } = useAppContext();
  const router = useRouter();
  const isLoginPage = router.pathname === '/login';

  return (
    <header className="bg-[#5CD2C1] dark:bg-[#2A8C7F] text-white fixed top-0 left-0 right-0 z-10 p-4 h-16">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <div className={`w-10 h-10 ${darkMode ? 'bg-gray-700' : 'bg-white'} rounded-lg flex items-center justify-center`}>
            <span className={`${darkMode ? 'text-[#4CB3A3]' : 'text-[#5CD2C1]'} font-bold text-lg`}>m<sub className="text-xs">z</sub></span>
          </div>
          <span className="text-2xl font-bold">meetz</span>
        </div>
        <div className="flex items-center space-x-4">
          {!isLoginPage && (
            <>
              <Link href="/calendar"><Calendar size={24} /></Link>
              <Link href="/pending"><Hourglass size={24} /></Link>
              <Link href="/notifications"><Bell size={24} /></Link>
              <Link href="/profile"><User size={24} /></Link>
            </>
          )}
          <button 
            onClick={toggleDarkMode}
            className="w-10 h-6 rounded-full bg-gray-300 flex items-center transition duration-300 focus:outline-none shadow"
          >
            <div
              className={`w-6 h-6 rounded-full transform transition duration-300 ${
                darkMode ? 'translate-x-full bg-[#2A8C7F]' : 'translate-x-0 bg-white'
              }`}
            >
              {darkMode ? (
                <Moon size={16} className="m-auto text-white" />
              ) : (
                <Sun size={16} className="m-auto text-gray-800" />
              )}
            </div>
          </button>
        </div>
      </div>
    </header>
  );
}

export default Header;