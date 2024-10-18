import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { MapPin, Calendar, Clock, Coffee } from 'lucide-react';
import dynamic from 'next/dynamic';
import { createMeetz } from '@/services/api';
import { useAppContext } from '@/context/AppContext';

const DatePicker = dynamic(() => import('react-datepicker'), {
  ssr: false,
});

interface MeetData {
  title: string;
  tags: string[];
  place: string;
  location: string;
  dateTime: Date;
  description: string;
}

const CreateMeet: React.FC = () => {
  const router = useRouter();
  const { user } = useAppContext();
  const [meetData, setMeetData] = useState<MeetData>({
    title: '',
    tags: [],
    place: '',
    location: '',
    dateTime: new Date(),
    description: '',
  });
  const [tagInput, setTagInput] = useState('');

  const suggestedTags = ['coffee', 'tech', 'yoga', 'art', 'music', 'food', 'sports', 'books'];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setMeetData({ ...meetData, [e.target.name]: e.target.value });
  };

  const handleTagInput = (e: React.KeyboardEvent<HTMLInputElement> | React.FocusEvent<HTMLInputElement>) => {
    if (e.type === 'keypress' && (e as React.KeyboardEvent).key !== 'Enter') return;
    if (tagInput.trim() !== '' && !meetData.tags.includes(tagInput.trim().toLowerCase())) {
      setMeetData({
        ...meetData,
        tags: [...meetData.tags, tagInput.trim().toLowerCase()],
      });
      setTagInput('');
    }
  };

  const addTag = (tag: string) => {
    if (!meetData.tags.includes(tag)) {
      setMeetData({
        ...meetData,
        tags: [...meetData.tags, tag],
      });
    }
  };

  const removeTag = (tagToRemove: string) => {
    setMeetData({
      ...meetData,
      tags: meetData.tags.filter((tag) => tag !== tagToRemove),
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      console.error('User is not logged in');
      return;
    }
    const newMeet = {
      ...meetData,
      hostId: user.id,
      attendees: [user.id],
      pendingAttendees: []
    };

    try {
      await createMeetz(newMeet);
      router.push('/my-meetz');
    } catch (error) {
      console.error('Error creating meet:', error);
    }
  };

  const handleDateChange = (date: Date | null) => {
    if (date) {
      setMeetData({ ...meetData, dateTime: date });
    }
  };

  const getUserLocation = () => {
    if (typeof navigator !== 'undefined' && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setMeetData({ ...meetData, location: `${latitude}, ${longitude}` });
        },
        (error) => {
          console.error("Error getting user location:", error);
          alert("Unable to retrieve your location. Please enter it manually.");
        }
      );
    } else {
      alert("Geolocation is not supported by your browser. Please enter your location manually.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 w-full max-w-md">
        <h1 className="text-2xl font-bold text-center text-primary-light dark:text-primary-dark mb-4">create a meetz</h1>
        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="text"
            name="title"
            value={meetData.title}
            onChange={handleChange}
            placeholder="what's your meetz about?"
            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-light dark:focus:ring-primary-dark bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
          
          <div>
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyPress={handleTagInput}
              onBlur={handleTagInput}
              placeholder="add meetztags (press enter)"
              className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-light dark:focus:ring-primary-dark bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
            <div className="flex flex-wrap gap-1 mt-1">
              {meetData.tags.map((tag) => (
                <span key={tag} className="bg-primary-light dark:bg-primary-dark text-white px-2 py-1 rounded-full text-xs flex items-center">
                  #{tag}
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    className="ml-1 text-white hover:text-red-500 focus:outline-none"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

          <div>
            <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">suggested meetztags:</p>
            <div className="flex flex-wrap gap-1">
              {suggestedTags.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => addTag(tag)}
                  className="bg-primary-light dark:bg-primary-dark text-white px-2 py-1 rounded-full text-xs hover:bg-opacity-90"
                >
                  #{tag}
                </button>
              ))}
            </div>
          </div>

          <div className="relative">
            <Coffee className="absolute left-2 top-1/2 transform -translate-y-1/2 text-primary-light dark:text-primary-dark" size={16} />
            <input
              type="text"
              name="place"
              value={meetData.place}
              onChange={handleChange}
              placeholder="enter meeting place"
              className="w-full pl-8 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-light dark:focus:ring-primary-dark bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white mb-2"
            />
          </div>
          <div className="relative flex items-center">
            <MapPin className="absolute left-2 top-1/2 transform -translate-y-1/2 text-primary-light dark:text-primary-dark" size={16} />
            <input
              type="text"
              name="location"
              value={meetData.location}
              onChange={handleChange}
              placeholder="Enter location (for Google Maps)"
              className="w-full pl-8 pr-24 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-light dark:focus:ring-primary-dark bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
            <button
              type="button"
              onClick={getUserLocation}
              className="absolute right-2 bg-primary-light dark:bg-primary-dark text-white px-2 py-1 rounded-md text-xs hover:bg-opacity-90"
            >
              Use My Location
            </button>
          </div>

          <div className="space-y-2">
            <div className="relative">
              <Calendar className="absolute left-2 top-1/2 transform -translate-y-1/2 text-primary-light dark:text-primary-dark" size={16} />
              <DatePicker
                selected={meetData.dateTime}
                onChange={(date) => handleDateChange(date)}
                dateFormat="MMMM d, yyyy"
                className="w-full pl-8 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-light dark:focus:ring-primary-dark bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                placeholderText="Select date"
              />
            </div>
            <div className="relative">
              <Clock className="absolute left-2 top-1/2 transform -translate-y-1/2 text-primary-light dark:text-primary-dark" size={16} />
              <DatePicker
                selected={meetData.dateTime}
                onChange={(date) => handleDateChange(date)}
                showTimeSelect
                showTimeSelectOnly
                timeIntervals={15}
                timeCaption="Time"
                dateFormat="h:mm aa"
                className="w-full pl-8 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-light dark:focus:ring-primary-dark bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                placeholderText="Select time"
              />
            </div>
          </div>

          <textarea
            name="description"
            value={meetData.description}
            onChange={handleChange}
            placeholder="deetz (optional)"
            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-light dark:focus:ring-primary-dark bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            rows={4}
          ></textarea>

          <button
            type="submit"
            className="w-full bg-primary-light dark:bg-primary-dark text-white py-2 px-4 rounded-lg hover:bg-opacity-90 transition duration-300"
          >
            create meetz
          </button>
        </form>
      </div>
    </div>
  );
}

export default CreateMeet;