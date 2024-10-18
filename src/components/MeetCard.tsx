import React from 'react';
import { MapPin, Calendar, Users, X, Check, X as XIcon } from 'lucide-react';
import { useSpring, animated } from '@react-spring/web';
import { useDrag } from '@use-gesture/react';
import { format } from 'date-fns';

interface MeetCardProps {
  meet: any;
  onRemove: (id: string) => void;
  onClick: (meet: any) => void;
  disableSwipe?: boolean;
  hideRemoveButton?: boolean;
  isPending?: boolean;
}

const MeetCard: React.FC<MeetCardProps> = ({ meet, onRemove, onClick, disableSwipe = false, hideRemoveButton = false, isPending = false }) => {
  const [{ x, rot, scale }, api] = useSpring(() => ({
    x: 0,
    rot: 0,
    scale: 1,
    config: { friction: 50, tension: 200 }
  }));

  const bind = useDrag(({ active, movement: [mx], direction: [xDir], velocity: [vx] }) => {
    if (disableSwipe) return;
    const trigger = vx > 0.2;
    const dir = xDir < 0 ? -1 : 1;
    if (!active && trigger) {
      if (dir === 1) {
        onClick(meet);
      } else {
        onRemove(meet.id);
      }
    }
    api.start({
      x: active ? mx : 0,
      rot: mx / 100,
      scale: active ? 1.1 : 1,
    });
  }, { filterTaps: true });

  const indicatorOpacity = x.to((x) => Math.min(1, Math.abs(x) / 100));

  const handleClick = (e: React.MouseEvent) => {
    if (Math.abs(x.get()) < 5) {
      onClick(meet);
    }
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    onRemove(meet.id);
  };

  const formattedDate = meet.dateTime ? format(new Date(meet.dateTime), 'MMMM d, yyyy h:mm aa') : 'Date not available';

  return (
    <animated.div
      {...bind()}
      style={{
        x,
        rotateZ: rot,
        scale,
        touchAction: 'pan-y',
      }}
      className={`bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 mb-4 relative ${isPending ? 'border-2 border-yellow-400' : ''}`}
      onClick={handleClick}
    >
      {isPending && (
        <div className="absolute top-2 right-2 bg-yellow-400 text-xs text-black font-semibold px-2 py-1 rounded-full">
          Pending
        </div>
      )}
      {!disableSwipe && (
        <>
          <animated.div
            style={{ opacity: indicatorOpacity }}
            className="absolute top-0 left-0 h-full w-12 bg-red-500 rounded-l-lg flex items-center justify-center"
          >
            <XIcon className="text-white" size={24} />
          </animated.div>
          <animated.div
            style={{ opacity: indicatorOpacity }}
            className="absolute top-0 right-0 h-full w-12 bg-green-500 rounded-r-lg flex items-center justify-center"
          >
            <Check className="text-white" size={24} />
          </animated.div>
        </>
      )}

      {!hideRemoveButton && (
        <button
          onClick={handleRemove}
          className="absolute top-1 right-1 p-1 rounded-full bg-gray-200 hover:bg-gray-300 transition-colors z-10"
        >
          <X size={16} />
        </button>
      )}

      <h2 className="text-lg font-semibold text-primary-light dark:text-primary-dark mb-1">{meet.title}</h2>
      <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">{meet.description}</p>
      <div className="flex flex-col text-xs text-gray-600 dark:text-gray-400 mb-1">
        <div className="flex items-center">
          <MapPin className="w-3 h-3 mr-1" />
          <span className="font-semibold">{meet.place}</span>
        </div>
        <div className="flex items-center ml-4">
          <span>{meet.location}</span>
        </div>
      </div>
      <div className="flex items-center text-xs text-gray-600 dark:text-gray-400 mb-2">
        <Calendar className="w-3 h-3 mr-1" />
        {formattedDate}
      </div>
      <div className="flex items-center mb-2">
        <div className="flex items-center mr-2">
          <div className="w-6 h-6 rounded-full bg-gray-300 dark:bg-gray-600 mr-1 overflow-hidden">
            <img src={meet.host.profilePicture} alt={meet.host.name} className="w-full h-full object-cover" />
          </div>
          <div className="text-xs">
            <p className="font-semibold text-primary-light dark:text-primary-dark">hosted by</p>
            <p className="text-gray-700 dark:text-gray-300">{meet.host.name}</p>
          </div>
        </div>
        {Array.isArray(meet.attendees) && meet.attendees.length > 0 && (
          <>
            {[...Array(Math.min(3, meet.attendees.length))].map((_, i) => (
              <div key={i} className="w-4 h-4 rounded-full bg-primary-light dark:bg-primary-dark border-2 border-white dark:border-gray-800 -ml-1 first:ml-0"></div>
            ))}
            {meet.attendees.length > 3 && (
              <div className="w-4 h-4 rounded-full bg-primary-light dark:bg-primary-dark border-2 border-white dark:border-gray-800 -ml-1 flex items-center justify-center text-white text-xs">
                +{meet.attendees.length - 3}
              </div>
            )}
          </>
        )}
      </div>
      <div className="flex flex-wrap">
        {meet.tags && meet.tags.map((tag: string) => (
          <span key={tag} className="bg-primary-light dark:bg-primary-dark text-white text-xs px-1 py-0.5 rounded-full mr-1 mb-1">#{tag}</span>
        ))}
      </div>
    </animated.div>
  );
}

export default MeetCard;