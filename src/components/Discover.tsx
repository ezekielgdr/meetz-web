import React, { useState, useEffect } from 'react';
import { Compass } from 'lucide-react';
import { fetchDiscoverMeetz } from '@/services/api';
import { useAppContext } from '@/context/AppContext';
import MeetCard from './MeetCard';

function Discover() {
  console.log('Rendering Discover component');
  const [meets, setMeets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { darkMode } = useAppContext();

  useEffect(() => {
    const loadMeets = async () => {
      try {
        console.log('Fetching meets...');
        const fetchedMeets = await fetchDiscoverMeetz();
        console.log('Fetched meets:', fetchedMeets);
        setMeets(fetchedMeets);
        setLoading(false);
      } catch (err) {
        console.error('Error loading meets:', err);
        setError(err instanceof Error ? err : new Error('An unknown error occurred'));
        setLoading(false);
      }
    };

    loadMeets();
  }, []);

  if (loading) return <div className="text-center">Loading...</div>;
  if (error) return (
    <div className="text-red-600">
      <h2>Error: {error.message}</h2>
      <p>Stack trace: {error.stack}</p>
    </div>
  );

  return (
    <div className="pt-1 pb-16 px-2">
      <h2 className="text-2xl font-bold text-primary-light dark:text-primary-dark mb-4 flex items-center">
        discover meetz <Compass className="ml-2" size={20} />
      </h2>
      <div className="space-y-2">
        {meets.map((meet: any) => (
          <MeetCard 
            key={meet.id} 
            meet={meet} 
            onRemove={() => {}} 
            onClick={() => {}}
          />
        ))}
      </div>
    </div>
  );
}

export default Discover;