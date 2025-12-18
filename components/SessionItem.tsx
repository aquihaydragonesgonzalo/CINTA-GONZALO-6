
import React from 'react';
import { Session } from '../types';
import { formatTime } from '../utils';

interface Props {
  session: Session;
  onSelect: (session: Session) => void;
}

export const SessionItem: React.FC<Props> = ({ session, onSelect }) => {
  const totalTime = session.segments.reduce((acc, s) => acc + s.duration, 0);
  
  return (
    <button
      onClick={() => onSelect(session)}
      className="w-full bg-white p-6 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md hover:border-blue-300 transition-all text-left flex justify-between items-center group"
    >
      <div>
        <h3 className="text-xl font-bold text-gray-800 mb-1 group-hover:text-blue-600 transition-colors">
          {session.name}
        </h3>
        <div className="flex gap-4 text-sm text-gray-500">
          <span>{session.segments.length} tramos</span>
          <span>•</span>
          <span>{formatTime(totalTime)} total</span>
        </div>
      </div>
      <div className="bg-blue-50 p-2 rounded-full text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </div>
    </button>
  );
};
