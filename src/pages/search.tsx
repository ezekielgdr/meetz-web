import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import MeetCard from '@/components/MeetCard';
import { Search as SearchIcon, X, Calendar, Check } from 'lucide-react';
import Modal from '@/components/Modal';
import MeetDetails from '@/components/MeetDetails';
import { fetchMeetz } from '@/services/api';
import { useAppContext } from '@/context/AppContext';

const DatePicker = dynamic(() => import('react-datepicker'), {
  ssr: false,
});

interface Meet {
  id: string;
  title: string;
  description: string;
  location: string;
  dateTime: string;
  tags: string[];
  isFriendMeet?: boolean;
  isSquadMeet?: boolean;
  isClanMeet?: boolean;
  host: {
    id: string;
    name: string;
    profilePicture: string;
  };
  attendees: {
    id: string;
    name: string;
    profilePicture: string;
  }[];
}

const Search: React.FC = () => {
  const [meets, setMeets] = useState<Meet[]>([]);
  const [filteredMeets, setFilteredMeets] = useState<Meet[]>([]);
  const [selectedMeet, setSelectedMeet] = useState<Meet | null>(null);
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [suggestedFilters] = useState(['coffee', 'tech', 'art', 'sports', 'food']);
  const [dateFrom, setDateFrom] = useState<Date | null>(null);
  const [dateTo, setDateTo] = useState<Date | null>(null);
  const [showFilters, setShowFilters] = useState(true);
  const [includeOptions, setIncludeOptions] = useState({
    friends: false,
    squad: false,
    clans: false
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { darkMode } = useAppContext();

  useEffect(() => {
    const loadMeets = async () => {
      try {
        const fetchedMeets = await fetchMeetz();
        setMeets(fetchedMeets);
        setFilteredMeets(fetchedMeets);
        setLoading(false);
      } catch (err) {
        setError('Failed to load meets');
        setLoading(false);
      }
    };

    loadMeets();
  }, []);

  const addFilter = (filter: string) => {
    if (!activeFilters.includes(filter)) {
      setActiveFilters([...activeFilters, filter]);
    }
  };

  const removeFilter = (filter: string) => {
    setActiveFilters(activeFilters.filter(f => f !== filter));
  };

  const handleIncludeOptionChange = (option: 'friends' | 'squad' | 'clans') => {
    setIncludeOptions(prev => ({
      ...prev,
      [option]: !prev[option]
    }));
  };

  const handleSearch = () => {
    const filtered = meets.filter(meet =>
      (activeFilters.length === 0 || activeFilters.some(filter => meet.tags.includes(filter))) &&
      (!dateFrom || new Date(meet.dateTime) >= dateFrom) &&
      (!dateTo || new Date(meet.dateTime) <= dateTo) &&
      (!includeOptions.friends || meet.isFriendMeet) &&
      (!includeOptions.squad || meet.isSquadMeet) &&
      (!includeOptions.clans || meet.isClanMeet)
    );
    setFilteredMeets(filtered);
    setShowFilters(false);
  };

  const handleRemoveMeet = (id: string) => {
    setFilteredMeets(filteredMeets.filter(meet => meet.id !== id));
  };

  const handleOpenMeetDetails = (meet: Meet) => {
    setSelectedMeet(meet);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="pt-1 pb-16 px-2">
      <h1 className="text-2xl font-bold text-primary-light dark:text-primary-dark mb-4 flex items-center">
        search meetz <SearchIcon className="ml-2" size={20} />
      </h1>
      
      <div className={`bg-background-light dark:bg-gray-800 rounded-lg shadow-md overflow-hidden transition-all duration-300 ease-in-out ${showFilters ? 'mb-4' : 'mb-2'}`}>
        <div className="p-2 flex justify-between items-center bg-primary-light dark:bg-primary-dark">
          <span className="text-white font-semibold text-sm">Filters</span>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center focus:outline-none"
            aria-label="Toggle filters"
          >
            <div className={`w-8 h-5 flex items-center bg-gray-300 rounded-full p-1 duration-300 ease-in-out ${showFilters ? 'bg-white' : ''}`}>
              <div className={`bg-primary-light dark:bg-primary-dark w-3 h-3 rounded-full shadow-md transform duration-300 ease-in-out ${showFilters ? 'translate-x-3' : ''}`}></div>
            </div>
          </button>
        </div>
        {showFilters && (
          <div className="p-2">
            <div className="space-y-2">
              <div className="flex space-x-1">
                <div className="flex-1 relative">
                  <DatePicker
                    selected={dateFrom}
                    onChange={(date: Date) => setDateFrom(date)}
                    selectsStart
                    startDate={dateFrom}
                    endDate={dateTo}
                    placeholderText="From Date"
                    className="w-full p-2 pl-8 border border-gray-300 rounded-md bg-white dark:bg-gray-700 dark:text-white dark:border-gray-600"
                  />
                  <Calendar className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                </div>
                <div className="flex-1 relative">
                  <DatePicker
                    selected={dateTo}
                    onChange={(date: Date) => setDateTo(date)}
                    selectsEnd
                    startDate={dateFrom}
                    endDate={dateTo}
                    minDate={dateFrom}
                    placeholderText="To Date"
                    className="w-full p-2 pl-8 border border-gray-300 rounded-md bg-white dark:bg-gray-700 dark:text-white dark:border-gray-600"
                  />
                  <Calendar className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                </div>
              </div>
              <div>
                <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">only include:</p>
                <div className="flex space-x-2">
                  {(['friends', 'squad', 'clans'] as const).map(option => (
                    <label key={option} className="inline-flex items-center">
                      <div className="relative">
                        <input
                          type="checkbox"
                          checked={includeOptions[option]}
                          onChange={() => handleIncludeOptionChange(option)}
                          className="sr-only"
                        />
                        <div className={`w-5 h-5 border-2 rounded-md ${includeOptions[option] ? 'bg-primary-light dark:bg-primary-dark border-primary-light dark:border-primary-dark' : 'border-gray-300 dark:border-gray-600'} transition-colors duration-200 ease-in-out`}>
                          {includeOptions[option] && (
                            <Check className="w-4 h-4 text-white absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
                          )}
                        </div>
                      </div>
                      <span className="ml-1 text-xs text-gray-700 dark:text-gray-300 capitalize">{option}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">active filters:</p>
                <div className="flex flex-wrap gap-1">
                  {activeFilters.map(filter => (
                    <span key={filter} className="bg-primary-light dark:bg-primary-dark text-white px-2 py-1 rounded-full text-xs flex items-center">
                      #{filter}
                      <button onClick={() => removeFilter(filter)} className="ml-1 focus:outline-none">
                        <X size={12} />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">suggested filters:</p>
                <div className="flex flex-wrap gap-1">
                  {suggestedFilters.map(filter => (
                    <button
                      key={filter}
                      onClick={() => addFilter(filter)}
                      className="bg-white dark:bg-gray-700 text-primary-light dark:text-primary-dark px-2 py-1 rounded-full text-xs hover:bg-primary-light dark:hover:bg-primary-dark hover:text-white transition-colors"
                    >
                      #{filter}
                    </button>
                  ))}
                </div>
              </div>
              <button
                onClick={handleSearch}
                className="w-full bg-primary-light dark:bg-primary-dark text-white py-2 px-4 rounded-md hover:bg-opacity-90 transition-colors"
              >
                Search
              </button>
            </div>
          </div>
        )}
      </div>
      
      <div>
        {filteredMeets.map((meet) => (
          <MeetCard 
            key={meet.id} 
            meet={meet} 
            onRemove={handleRemoveMeet} 
            onClick={handleOpenMeetDetails} 
          />
        ))}
      </div>
      {selectedMeet && (
        <Modal isOpen={!!selectedMeet} onClose={() => setSelectedMeet(null)}>
          <MeetDetails meet={selectedMeet} onClose={() => setSelectedMeet(null)} />
        </Modal>
      )}
    </div>
  );
}

export default Search;