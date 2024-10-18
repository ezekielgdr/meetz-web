import React, { useState } from 'react';
import { Search } from 'lucide-react';

interface SearchBarProps {
  onSearch: (query: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  const [query, setQuery] = useState('');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSearch(query);
  };

  return (
    <form onSubmit={handleSubmit} className="relative">
      <input
        type="text"
        placeholder="search meetz..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full py-2 px-4 pr-10 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
      />
      <button 
        type="submit" 
        className="absolute right-3 top-1/2 transform -translate-y-1/2"
        aria-label="Search"
      >
        <Search className="w-5 h-5 text-gray-500 dark:text-gray-400" />
      </button>
    </form>
  );
};

export default SearchBar;