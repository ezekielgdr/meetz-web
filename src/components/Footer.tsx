import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Compass, Search, PlusCircle, Menu, Calendar } from 'lucide-react';
import { useAppContext } from '@/context/AppContext';

function Footer() {
  const router = useRouter();
  const { setIsSidebarOpen } = useAppContext();

  const isActive = (path: string) => {
    return router.pathname === path ? 'text-primary-light dark:text-primary-dark' : 'text-gray-400';
  };

  return (
    <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 fixed bottom-0 left-0 right-0 z-10">
      <nav className="flex justify-between items-center max-w-md mx-auto">
        <Link 
          href="/my-meetz" 
          className={`flex flex-col items-center w-1/5 py-2 ${isActive('/my-meetz')}`}
        >
          <Calendar className="w-7 h-7" strokeWidth={1.5} />
          <span className="text-[10px] mt-1 font-medium">my meetz</span>
        </Link>
        <Link 
          href="/" 
          className={`flex flex-col items-center w-1/5 py-2 ${isActive('/')}`}
        >
          <Compass className="w-7 h-7" strokeWidth={1.5} />
          <span className="text-[10px] mt-1 font-medium">discover</span>
        </Link>
        <Link 
          href="/create" 
          className={`flex flex-col items-center w-1/5 py-2 ${isActive('/create')}`}
        >
          <PlusCircle className="w-9 h-9" strokeWidth={1.5} />
          <span className="text-[10px] mt-1 font-medium">create</span>
        </Link>
        <Link 
          href="/search" 
          className={`flex flex-col items-center w-1/5 py-2 ${isActive('/search')}`}
        >
          <Search className="w-7 h-7" strokeWidth={1.5} />
          <span className="text-[10px] mt-1 font-medium">search</span>
        </Link>
        <button 
          className="flex flex-col items-center w-1/5 py-2 text-gray-400"
          onClick={() => setIsSidebarOpen(true)}
        >
          <Menu className="w-7 h-7" strokeWidth={1.5} />
          <span className="text-[10px] mt-1 font-medium">more</span>
        </button>
      </nav>
    </footer>
  );
}

export default Footer;