import React, { useState, useEffect } from 'react';
import MeetCard from '@/components/MeetCard';
import { Compass } from 'lucide-react';
import Modal from '@/components/Modal';
import MeetDetails from '@/components/MeetDetails';
import { fetchDiscoverMeetz } from '@/services/api';
import { useAppContext } from '@/context/AppContext';

interface Meet {
  id: string;
  title: string;
  description: string;
  place: string;
  location: string;
  dateTime: string;
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
  tags?: string[];
}

interface SavedPlace {
  id: string;
  place: string;
  location: string;
}

const Discover: React.FC = () => {
  const [meets, setMeets] = useState<Meet[]>([]);
  const [selectedMeet, setSelectedMeet] = useState<Meet | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [savedPlaces, setSavedPlaces] = useState<SavedPlace[]>([]);
  const { darkMode } = useAppContext();

  useEffect(() => {
    const loadMeets = async () => {
      try {
        const fetchedMeets = await fetchDiscoverMeetz();
        setMeets(fetchedMeets);
        setLoading(false);
      } catch (err) {
        setError('Failed to load meets');
        setLoading(false);
      }
    };

    loadMeets();
  }, []);

  useEffect(() => {
    const loadSavedPlaces = () => {
      if (typeof window !== 'undefined') {
        const places = JSON.parse(localStorage.getItem('savedPlaces') || '[]');
        setSavedPlaces(places);
      }
    };
    loadSavedPlaces();
  }, []);

  const handleRemoveMeet = (id: string) => {
    setMeets(meets.filter(meet => meet.id !== id));
  };

  const handleOpenMeetDetails = (meet: Meet) => {
    setSelectedMeet(meet);
  };

  const handleCloseMeetDetails = () => {
    setSelectedMeet(null);
    // Refresh the meets list to reflect any changes
    const updatedMeets = meets.map(meet => {
      if (typeof window !== 'undefined') {
        const joinedMeetz = JSON.parse(localStorage.getItem('joinedMeetz') || '[]');
        return {
          ...meet,
          isJoined: joinedMeetz.some((m: Meet) => m.id === meet.id),
          attendees: Array.isArray(meet.attendees) ? meet.attendees : []
        };
      }
      return meet;
    });
    setMeets(updatedMeets);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="pt-1 pb-16 px-2">
      <h1 className="text-2xl font-bold text-primary-light dark:text-primary-dark mb-4 flex items-center">
        discover meetz <Compass className="ml-2" size={20} />
      </h1>
      <div className="mb-8">
        <h2 className="text-xl font-bold text-primary-light dark:text-primary-dark mb-4">Saved Places</h2>
        {savedPlaces.length === 0 ? (
          <p className="text-gray-600 dark:text-gray-400">No saved places yet.</p>
        ) : (
          <div className="space-y-2">
            {savedPlaces.map((place) => (
              <div key={place.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
                <h3 className="font-semibold text-gray-800 dark:text-gray-200">{place.place}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">{place.location}</p>
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="space-y-2">
        {meets.map((meet) => (
          <MeetCard 
            key={meet.id} 
            meet={meet} 
            onRemove={handleRemoveMeet} 
            onClick={handleOpenMeetDetails} 
          />
        ))}
      </div>
      {selectedMeet && (
        <Modal isOpen={!!selectedMeet} onClose={handleCloseMeetDetails}>
          <MeetDetails meet={selectedMeet} onClose={handleCloseMeetDetails} />
        </Modal>
      )}
    </div>
  );
}

export default Discover;