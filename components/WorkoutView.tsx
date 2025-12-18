
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Session, Segment } from '../types';
import { formatTime } from '../utils';

interface Props {
  session: Session;
  onFinish: () => void;
  onCancel: () => void;
}

export const WorkoutView: React.FC<Props> = ({ session, onFinish, onCancel }) => {
  const [currentSegmentIndex, setCurrentSegmentIndex] = useState(0);
  const [segmentRemaining, setSegmentRemaining] = useState(session.segments[0].duration);
  const [isActive, setIsActive] = useState(false);
  
  const totalDuration = session.segments.reduce((acc, s) => acc + s.duration, 0);
  const [totalRemaining, setTotalRemaining] = useState(totalDuration);

  // FIX: Using ReturnType<typeof setInterval> instead of NodeJS.Timeout to support browser environments
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const currentSegment = session.segments[currentSegmentIndex];
  
  const isAlarmActive = segmentRemaining <= 5 && segmentRemaining > 0;

  useEffect(() => {
    if (isActive && segmentRemaining > 0) {
      timerRef.current = setInterval(() => {
        setSegmentRemaining(prev => prev - 1);
        setTotalRemaining(prev => prev - 1);
      }, 1000);
    } else if (segmentRemaining === 0) {
      if (currentSegmentIndex < session.segments.length - 1) {
        const nextIdx = currentSegmentIndex + 1;
        setCurrentSegmentIndex(nextIdx);
        setSegmentRemaining(session.segments[nextIdx].duration);
      } else {
        setIsActive(false);
        onFinish();
      }
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isActive, segmentRemaining, currentSegmentIndex, session.segments, onFinish]);

  const toggleTimer = () => setIsActive(!isActive);

  const skipSegment = () => {
    if (currentSegmentIndex < session.segments.length - 1) {
      const skippedTime = segmentRemaining;
      const nextIdx = currentSegmentIndex + 1;
      setTotalRemaining(prev => prev - skippedTime);
      setCurrentSegmentIndex(nextIdx);
      setSegmentRemaining(session.segments[nextIdx].duration);
    }
  };

  const prevSegment = () => {
    if (currentSegmentIndex > 0) {
      const nextIdx = currentSegmentIndex - 1;
      const addedTime = session.segments[nextIdx].duration + (session.segments[currentSegmentIndex].duration - segmentRemaining);
      setTotalRemaining(prev => prev + addedTime);
      setCurrentSegmentIndex(nextIdx);
      setSegmentRemaining(session.segments[nextIdx].duration);
    }
  };

  const segmentProgress = ((currentSegment.duration - segmentRemaining) / currentSegment.duration) * 100;
  const totalProgress = ((totalDuration - totalRemaining) / totalDuration) * 100;

  return (
    <div className={`fixed inset-0 z-50 flex flex-col bg-white transition-colors duration-300 ${isAlarmActive ? 'animate-alarm' : ''}`}>
      {/* Header */}
      <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-white z-10">
        <div>
          <h2 className="text-xl font-extrabold text-gray-800">{session.name}</h2>
          <p className="text-sm text-gray-500 uppercase tracking-widest font-bold">
            Tramo {currentSegmentIndex + 1} de {session.segments.length}
          </p>
        </div>
        <button 
          onClick={onCancel}
          className="p-2 text-gray-400 hover:text-red-500 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Main Stats */}
      <div className="flex-1 flex flex-col justify-center items-center p-6 space-y-8 overflow-y-auto">
        
        {/* Partial Timer (Segment) */}
        <div className="text-center w-full">
          <div className="text-xs font-bold text-blue-500 uppercase tracking-[0.2em] mb-2">Siguiente cambio en</div>
          <div className="text-8xl md:text-9xl font-mono font-bold tabular-nums text-gray-900 leading-none">
            {formatTime(segmentRemaining)}
          </div>
          
          <div className="mt-4 w-full max-w-md mx-auto h-3 bg-gray-100 rounded-full overflow-hidden">
            <div 
              className="h-full bg-blue-500 transition-all duration-1000 ease-linear"
              style={{ width: `${segmentProgress}%` }}
            />
          </div>
        </div>

        {/* Speed & Incline Display */}
        <div className="grid grid-cols-2 gap-4 w-full max-w-xl">
          <div className="bg-orange-50 p-6 rounded-3xl border-2 border-orange-100 text-center">
            <div className="text-xs font-black text-orange-500 uppercase tracking-widest mb-1">Velocidad</div>
            <div className="text-5xl font-mono font-extrabold text-orange-600">{currentSegment.speed}</div>
            <div className="text-xs font-bold text-orange-400">km/h</div>
          </div>
          <div className="bg-emerald-50 p-6 rounded-3xl border-2 border-emerald-100 text-center">
            <div className="text-xs font-black text-emerald-500 uppercase tracking-widest mb-1">Inclinación</div>
            <div className="text-5xl font-mono font-extrabold text-emerald-600">{currentSegment.incline}%</div>
            <div className="text-xs font-bold text-emerald-400">Gradiante</div>
          </div>
        </div>

        {/* Total Time Info */}
        <div className="text-center">
          <div className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Tiempo total restante</div>
          <div className="text-3xl font-mono font-bold text-gray-600">
            {formatTime(totalRemaining)}
          </div>
          <div className="mt-2 w-full max-w-xs mx-auto h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gray-400 transition-all duration-1000 ease-linear"
              style={{ width: `${totalProgress}%` }}
            />
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="p-8 bg-gray-50 border-t border-gray-200">
        <div className="max-w-xl mx-auto flex items-center justify-between gap-6">
          <button 
            onClick={prevSegment}
            disabled={currentSegmentIndex === 0}
            className="p-4 rounded-full bg-white border border-gray-200 text-gray-600 disabled:opacity-30 active:scale-90 transition-transform"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
            </svg>
          </button>

          <button 
            onClick={toggleTimer}
            className={`flex-1 h-20 rounded-full flex items-center justify-center gap-3 text-white font-black text-2xl shadow-xl active:scale-95 transition-all ${isActive ? 'bg-amber-500 shadow-amber-200' : 'bg-blue-600 shadow-blue-200'}`}
          >
            {isActive ? (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                PAUSAR
              </>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
                CONTINUAR
              </>
            )}
          </button>

          <button 
            onClick={skipSegment}
            disabled={currentSegmentIndex === session.segments.length - 1}
            className="p-4 rounded-full bg-white border border-gray-200 text-gray-600 disabled:opacity-30 active:scale-90 transition-transform"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      {/* Alarm Warning Overlay */}
      {isAlarmActive && (
        <div className="fixed top-0 left-0 right-0 py-4 bg-red-600 text-white text-center font-black text-2xl z-20 pointer-events-none uppercase tracking-tighter">
          ¡CAMBIO INMINENTE! {segmentRemaining}s
        </div>
      )}
    </div>
  );
};
