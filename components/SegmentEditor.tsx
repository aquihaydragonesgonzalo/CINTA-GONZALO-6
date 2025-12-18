
import React, { useState, useEffect } from 'react';
import { Segment } from '../types';
import { getMinutes, getSeconds, parseTime } from '../utils';
import { MAX_SPEED, MAX_INCLINE } from '../constants';

interface Props {
  segment: Segment;
  index: number;
  onUpdate: (updated: Segment) => void;
  onRemove: () => void;
}

export const SegmentEditor: React.FC<Props> = ({ segment, index, onUpdate, onRemove }) => {
  const [mins, setMins] = useState(getMinutes(segment.duration));
  const [secs, setSecs] = useState(getSeconds(segment.duration));

  useEffect(() => {
    const total = parseTime(mins, secs);
    if (total !== segment.duration) {
      onUpdate({ ...segment, duration: total });
    }
  }, [mins, secs]);

  const handleMinsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, '');
    setMins(val);
  };

  const handleSecsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, '');
    const num = parseInt(val) || 0;
    if (num < 60) setSecs(val);
  };

  const handleNumericInput = (field: keyof Segment, value: string) => {
    let num = parseFloat(value);
    if (isNaN(num)) num = 0;
    
    const max = field === 'speed' ? MAX_SPEED : MAX_INCLINE;
    if (num > max) num = max;
    if (num < 0) num = 0;

    onUpdate({ ...segment, [field]: num });
  };

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 bg-gray-50 rounded-xl border border-gray-200">
      <div className="flex items-center gap-3">
        <span className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center font-bold text-sm text-gray-600">
          {index + 1}
        </span>
      </div>

      <div className="flex-1 grid grid-cols-3 gap-3 w-full">
        {/* Time Inputs */}
        <div className="flex flex-col gap-1">
          <label className="text-[10px] uppercase tracking-wider font-bold text-gray-400">Tiempo</label>
          <div className="flex items-center gap-1">
            <input
              type="text"
              inputMode="numeric"
              value={mins}
              placeholder="00"
              onChange={handleMinsChange}
              onFocus={(e) => e.target.select()}
              className="w-full p-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none text-center font-mono font-bold"
            />
            <span className="font-bold">:</span>
            <input
              type="text"
              inputMode="numeric"
              value={secs}
              placeholder="00"
              onChange={handleSecsChange}
              onFocus={(e) => e.target.select()}
              className="w-full p-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none text-center font-mono font-bold"
            />
          </div>
        </div>

        {/* Speed Input */}
        <div className="flex flex-col gap-1">
          <label className="text-[10px] uppercase tracking-wider font-bold text-gray-400">Velocidad (0-15)</label>
          <input
            type="number"
            step="0.1"
            value={segment.speed}
            onChange={(e) => handleNumericInput('speed', e.target.value)}
            className="w-full p-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none text-center font-bold"
          />
        </div>

        {/* Incline Input */}
        <div className="flex flex-col gap-1">
          <label className="text-[10px] uppercase tracking-wider font-bold text-gray-400">Inclin. % (0-15)</label>
          <input
            type="number"
            step="0.5"
            value={segment.incline}
            onChange={(e) => handleNumericInput('incline', e.target.value)}
            className="w-full p-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none text-center font-bold"
          />
        </div>
      </div>

      <button
        onClick={onRemove}
        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
        title="Eliminar tramo"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
      </button>
    </div>
  );
};
