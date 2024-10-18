import React, { useState, useEffect } from 'react';
import { Calendar } from 'lucide-react';
import MeetCard from '@/components/MeetCard';
import Modal from '@/components/Modal';
import MeetDetails from '@/components/MeetDetails';
import { fetchHostedMeetz, fetchJoinedMeetz } from '@/services/api';
import { useAppContext } from '@/context/AppContext';

interface Meet {
  id: string;
  title: string;
  description: string;
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
}

interface JoinedMeet {
  meetz: Meet;
  pending: boolean;
}

const MyMeetz: React.FC = () => {
  const [hostedMeetz, setHostedMeetz] = useState<Meet[]>([]);
  const [joinedMeetz, setJoinedMeetz] = useState<JoinedMeet[]>([]);
  const [activeTab, setActiveTab] = useState<'hosted' | 'joined'>('hosted');
  const [selectedMeet, setSelectedMeet] = useState<Meet | JoinedMeet | null>(null);

  const { user, darkMode } = useAppContext();

  useEffect(() => {
    if (user) {
      refreshMeetz();
    }
  }, [user]);

  const refreshMeetz = async () => {
    try {
      if (user) {
        const hostedMeetzData = await fetchHostedMeetz(user.id);
        const joinedMeetzData = await fetchJoinedMeetz(user.id);
        setHostedMeetz(hostedMeetzData);
        setJoinedMeetz(joinedMeetzData);
      } else {
        setHostedMeetz([]);
        setJoinedMeetz([]);
      }
    } catch (error) {
      console.error('Error fetching meetz:', error);
    }
  };

  const handleCloseMeetDetails = () => {
    setSelectedMeet(null);
    refreshMeetz();
  };

  const renderMeetzList = (meetz: Meet[] | JoinedMeet[]) => (
    <div className="space-y-4">
      {meetz.length === 0 ? (
        <p className="text-gray-600 dark:text-gray-400">No meetz found.</p>
      ) : (
        meetz.map((meetData) => {
          const meet = activeTab === 'joined' ? (meetData as JoinedMeet).meetz : meetData as Meet;
          const isPending = activeTab === 'joined' ? (meetData as JoinedMeet).pending : false;
          return (
            <MeetCard
              key={meet.id}
              meet={meet}
              onClick={() => setSelectedMeet(meetData)}
              disableSwipe={true}
              hideRemoveButton={true}
              isPending={isPending}
            />
          );
        })
      )}
    </div>
  );

  return (
    <div className="pt-1 pb-16 px-2 max-w-md mx-auto">
      <h1 className="text-2xl font-bold text-primary-light dark:text-primary-dark mb-4 flex items-center justify-center">
        my meetz <Calendar className="ml-2" size={20} />
      </h1>
      <div className="flex mb-3">
        <button
          className={`flex-1 py-1 px-2 text-center text-sm ${
            activeTab === 'hosted' 
              ? 'bg-primary-light dark:bg-primary-dark text-white' 
              : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
          } rounded-l-lg transition-colors`}
          onClick={() => setActiveTab('hosted')}
        >
          Hosted Meetz
        </button>
        <button
          className={`flex-1 py-1 px-2 text-center text-sm ${
            activeTab === 'joined' 
              ? 'bg-primary-light dark:bg-primary-dark text-white' 
              : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
          } rounded-r-lg transition-colors`}
          onClick={() => setActiveTab('joined')}
        >
          Joined Meetz
        </button>
      </div>
      {activeTab === 'hosted' ? renderMeetzList(hostedMeetz) : renderMeetzList(joinedMeetz)}
      {selectedMeet && (
        <Modal isOpen={!!selectedMeet} onClose={handleCloseMeetDetails}>
          <MeetDetails 
            meet={activeTab === 'joined' ? (selectedMeet as JoinedMeet).meetz : selectedMeet as Meet}
            onClose={handleCloseMeetDetails} 
            isHosted={activeTab === 'hosted'}
            isPending={activeTab === 'joined' ? (selectedMeet as JoinedMeet).pending : false}
          />
        </Modal>
      )}
    </div>
  );
};

export default MyMeetz;