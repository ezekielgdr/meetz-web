import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { ArrowLeft } from 'lucide-react';
import { joinMeetz, flakeMeetz, updateMeetz, acceptAttendee, declineAttendee } from '@/services/api';
import { useAppContext } from '@/context/AppContext';
import ManageAttendees from './ManageAttendees';

interface Attendee {
  id: string;
  name: string;
  profilePicture: string;
}

interface Host {
  id: string;
  name: string;
  profilePicture: string;
}

interface Meet {
  id: string;
  title: string;
  description: string;
  location: string;
  dateTime: string;
  host: Host;
  attendees: Attendee[];
  pendingAttendees?: Attendee[];
}

interface MeetDetailsProps {
  meet: Meet;
  onClose?: () => void;
  isHosted?: boolean;
  isPending?: boolean;
}

const MeetDetails: React.FC<MeetDetailsProps> = ({ meet: propMeet, onClose, isHosted, isPending }) => {
  const [meet, setMeet] = useState<Meet>(propMeet);
  const [isJoined, setIsJoined] = useState(false);
  const router = useRouter();
  const { user, darkMode } = useAppContext();
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    if (!propMeet) {
      // Fetch meet details if not provided
      const meetId = router.query.id as string;
      // Fetch meet details using meetId and update state
    }
    checkJoinStatus();
  }, [propMeet, router.query.id, meet, user, isPending]);

  const checkJoinStatus = () => {
    if (meet.attendees && meet.attendees.some(attendee => attendee.id === user?.id)) {
      setIsJoined(true);
    } else if (isPending) {
      setIsJoined(true);
    } else {
      setIsJoined(false);
    }
  };

  const handleJoinMeetz = async () => {
    try {
      await joinMeetz(meet.id, user!.id);
      setIsJoined(true);
    } catch (error) {
      console.error('Error joining meet:', error);
    }
  };

  const handleFlakeMeetz = async () => {
    try {
      await flakeMeetz(meet.id, user!.id);
      setIsJoined(false);
    } catch (error) {
      console.error('Error flaking meet:', error);
    }
  };

  const handleAcceptAttendee = async (attendeeId: string) => {
    try {
      const updatedMeet = await acceptAttendee(meet.id, attendeeId);
      setMeet(updatedMeet);
    } catch (error) {
      console.error('Error accepting attendee:', error);
    }
  };

  const handleDeclineAttendee = async (attendeeId: string) => {
    try {
      const updatedMeet = await declineAttendee(meet.id, attendeeId);
      setMeet(updatedMeet);
    } catch (error) {
      console.error('Error declining attendee:', error);
    }
  };

  const handleSavePlace = () => {
    if (typeof window !== 'undefined') {
      const savedPlaces = JSON.parse(localStorage.getItem('savedPlaces') || '[]');
      const placeToSave = { id: meet.id, place: meet.location, location: meet.location };
      
      if (!savedPlaces.some((p: { id: string }) => p.id === meet.id)) {
        savedPlaces.push(placeToSave);
        localStorage.setItem('savedPlaces', JSON.stringify(savedPlaces));
        setIsSaved(true);
      }
    }
  };

  return (
    <div className="max-w-md mx-auto p-4">
      {!propMeet && (
        <button onClick={() => router.back()} className="mb-6 text-primary-light dark:text-primary-dark hover:underline flex items-center text-xl">
          <ArrowLeft className="mr-2" size={24} />
          back
        </button>
      )}
      <h1 className="text-2xl font-bold text-primary-light dark:text-primary-dark mb-2">{meet.title}</h1>
      <p className="text-gray-700 dark:text-gray-300 mb-4">{meet.description}</p>
      <div className="space-y-2 mb-4">
        <div className="flex items-center text-gray-600 dark:text-gray-400">
          <span className="font-semibold mr-2">Location:</span> {meet.location}
        </div>
        <div className="flex items-center text-gray-600 dark:text-gray-400">
          <span className="font-semibold mr-2">Date:</span> {meet.dateTime}
        </div>
      </div>
      
      {/* Host information */}
      <div className="mb-4">
        <h2 className="text-lg font-semibold mb-2 text-gray-800 dark:text-gray-200">Host</h2>
        <div className="flex items-center">
          <img 
            src={meet.host.profilePicture} 
            alt={meet.host.name} 
            className="w-10 h-10 rounded-full mr-2"
          />
          <span 
            className="text-primary-light dark:text-primary-dark hover:underline cursor-pointer"
            onClick={() => router.push(`/profiles/${meet.host.id}`)}
          >
            {meet.host.name}
          </span>
        </div>
      </div>

      {/* Confirmed attendees */}
      <div className="mb-4">
        <h2 className="text-lg font-semibold mb-2 text-gray-800 dark:text-gray-200">Confirmed Attendees</h2>
        {meet.attendees && meet.attendees.length > 0 ? (
          <div className="space-y-2">
            {meet.attendees.map(attendee => (
              <div key={attendee.id} className="flex items-center">
                <img 
                  src={attendee.profilePicture} 
                  alt={attendee.name} 
                  className="w-8 h-8 rounded-full mr-2"
                />
                <span 
                  className="text-primary-light dark:text-primary-dark hover:underline cursor-pointer"
                  onClick={() => router.push(`/profiles/${attendee.id}`)}
                >
                  {attendee.name}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-600 dark:text-gray-400">No confirmed attendees yet.</p>
        )}
      </div>

      {isHosted ? (
        <ManageAttendees 
          meet={meet} 
          onAccept={handleAcceptAttendee} 
          onDecline={handleDeclineAttendee} 
        />
      ) : isJoined || isPending ? (
        <>
          {isPending && (
            <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-4" role="alert">
              <p className="font-bold">Pending Approval</p>
              <p>Your request to join this meetz is pending approval from the host.</p>
            </div>
          )}
          <button
            onClick={handleFlakeMeetz}
            className="w-full bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-lg transition duration-300"
          >
            flake this meetz
          </button>
        </>
      ) : (
        <button
          onClick={handleJoinMeetz}
          className="w-full bg-primary-light dark:bg-primary-dark hover:bg-opacity-90 text-white py-2 px-4 rounded-lg transition duration-300"
        >
          join this meetz
        </button>
      )}

      <button
        onClick={handleSavePlace}
        className="w-full bg-primary-light dark:bg-primary-dark hover:bg-opacity-90 text-white py-2 px-4 rounded-lg transition duration-300 mt-2"
        disabled={isSaved}
      >
        {isSaved ? 'Place Saved' : 'Save Place'}
      </button>
    </div>
  );
};

export default MeetDetails;