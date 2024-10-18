import React, { useState } from 'react';
import Modal from './Modal';
import { useAppContext } from '@/context/AppContext';

interface Attendee {
  id: string;
  name: string;
  profilePicture: string;
  bio: string;
}

interface Meet {
  pendingAttendees: Attendee[];
}

interface ManageAttendeesProps {
  meet: Meet;
  onAccept: (id: string) => void;
  onDecline: (id: string) => void;
}

const ManageAttendees: React.FC<ManageAttendeesProps> = ({ meet, onAccept, onDecline }) => {
  const [selectedAttendee, setSelectedAttendee] = useState<Attendee | null>(null);
  const { darkMode } = useAppContext();

  const handleAttendeeClick = (attendee: Attendee) => {
    setSelectedAttendee(attendee);
  };

  const closeModal = () => {
    setSelectedAttendee(null);
  };

  return (
    <div className="mt-4">
      <h2 className="text-lg font-semibold mb-2 text-gray-800 dark:text-gray-200">Manage Attendees</h2>
      {meet.pendingAttendees && meet.pendingAttendees.length > 0 ? (
        meet.pendingAttendees.map((attendee) => (
          <div key={attendee.id} className="flex items-center justify-between mb-2">
            <span 
              className="cursor-pointer text-primary-light dark:text-primary-dark hover:underline"
              onClick={() => handleAttendeeClick(attendee)}
            >
              {attendee.name}
            </span>
            <div>
              <button
                onClick={() => onAccept(attendee.id)}
                className="bg-green-500 hover:bg-green-600 text-white px-2 py-1 rounded mr-2 transition-colors"
              >
                Accept
              </button>
              <button
                onClick={() => onDecline(attendee.id)}
                className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded transition-colors"
              >
                Decline
              </button>
            </div>
          </div>
        ))
      ) : (
        <p className="text-gray-600 dark:text-gray-400">No pending attendees</p>
      )}
      {selectedAttendee && (
        <Modal isOpen={!!selectedAttendee} onClose={closeModal}>
          <div className="p-4">
            <h2 className="text-xl font-semibold mb-2 text-gray-800 dark:text-gray-200">{selectedAttendee.name}</h2>
            <img 
              src={selectedAttendee.profilePicture} 
              alt={selectedAttendee.name} 
              className="w-24 h-24 rounded-full mb-2"
            />
            <p className="text-gray-600 dark:text-gray-400">{selectedAttendee.bio}</p>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default ManageAttendees;