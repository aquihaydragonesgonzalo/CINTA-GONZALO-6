
import React, { useState, useEffect } from 'react';
import { AppState, Session, Segment } from './types';
import { PREDEFINED_SESSIONS } from './constants';
import { SessionItem } from './components/SessionItem';
import { SegmentEditor } from './components/SegmentEditor';
import { WorkoutView } from './components/WorkoutView';
import { generateId, formatTime } from './utils';

const App: React.FC = () => {
  const [view, setView] = useState<AppState>('LIST');
  const [sessions, setSessions] = useState<Session[]>(PREDEFINED_SESSIONS);
  const [currentSession, setCurrentSession] = useState<Session | null>(null);

  const startNewSession = () => {
    const newSession: Session = {
      id: generateId(),
      name: 'Nueva Sesión',
      segments: Array.from({ length: 5 }, (_, i) => ({
        id: generateId(),
        duration: 300,
        speed: 5,
        incline: 0,
      }))
    };
    setCurrentSession(newSession);
    setView('EDIT');
  };

  const editSession = (session: Session) => {
    setCurrentSession(JSON.parse(JSON.stringify(session)));
    setView('EDIT');
  };

  const addSegment = () => {
    if (!currentSession) return;
    const lastSegment = currentSession.segments[currentSession.segments.length - 1];
    const newSegment: Segment = {
      ...lastSegment,
      id: generateId(),
    };
    setCurrentSession({
      ...currentSession,
      segments: [...currentSession.segments, newSegment]
    });
  };

  const updateSegment = (updated: Segment) => {
    if (!currentSession) return;
    setCurrentSession({
      ...currentSession,
      segments: currentSession.segments.map(s => s.id === updated.id ? updated : s)
    });
  };

  const removeSegment = (id: string) => {
    if (!currentSession || currentSession.segments.length <= 1) return;
    setCurrentSession({
      ...currentSession,
      segments: currentSession.segments.filter(s => s.id !== id)
    });
  };

  const saveAndStart = () => {
    if (!currentSession) return;
    // Basic validation: ensure total time > 0
    const totalTime = currentSession.segments.reduce((acc, s) => acc + s.duration, 0);
    if (totalTime <= 0) {
      alert("La sesión debe tener una duración mayor a 0.");
      return;
    }
    setView('WORKOUT');
  };

  return (
    <div className="min-h-screen pb-20">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10 px-6 py-4">
        <div className="max-w-2xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="bg-blue-600 p-2 rounded-lg">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h1 className="text-2xl font-black text-gray-900 tracking-tight">Treadmill Pro</h1>
          </div>
          {view === 'LIST' && (
            <button
              onClick={startNewSession}
              className="bg-blue-600 text-white px-4 py-2 rounded-xl font-bold text-sm shadow-lg shadow-blue-100 active:scale-95 transition-all"
            >
              + Nueva Sesión
            </button>
          )}
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-6 mt-8">
        {view === 'LIST' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-gray-400 font-black text-xs uppercase tracking-[0.2em] mb-4">Mis Sesiones</h2>
              <div className="grid gap-4">
                {sessions.map(s => (
                  <SessionItem 
                    key={s.id} 
                    session={s} 
                    onSelect={editSession} 
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        {view === 'EDIT' && currentSession && (
          <div className="space-y-6 pb-32">
            <div className="flex flex-col gap-2">
              <input
                type="text"
                value={currentSession.name}
                onChange={(e) => setCurrentSession({...currentSession, name: e.target.value})}
                className="text-3xl font-black text-gray-900 outline-none border-b-2 border-transparent focus:border-blue-500 transition-colors w-full"
                placeholder="Nombre de la sesión..."
              />
              <p className="text-sm text-gray-500 font-medium">
                Edita los tramos, velocidad e inclinación antes de comenzar.
              </p>
            </div>

            <div className="space-y-3">
              {currentSession.segments.map((segment, idx) => (
                <SegmentEditor
                  key={segment.id}
                  segment={segment}
                  index={idx}
                  onUpdate={updateSegment}
                  onRemove={() => removeSegment(segment.id)}
                />
              ))}
            </div>

            <button
              onClick={addSegment}
              className="w-full py-4 border-2 border-dashed border-gray-300 rounded-xl text-gray-400 font-bold hover:border-blue-400 hover:text-blue-500 transition-all flex items-center justify-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
              Añadir Tramo
            </button>

            {/* Sticky Actions */}
            <div className="fixed bottom-0 left-0 right-0 p-6 bg-white/80 backdrop-blur-md border-t border-gray-200 z-10">
              <div className="max-w-2xl mx-auto flex gap-4">
                <button
                  onClick={() => setView('LIST')}
                  className="flex-1 py-4 px-6 rounded-2xl border-2 border-gray-200 font-bold text-gray-600 active:scale-95 transition-all"
                >
                  Cancelar
                </button>
                <button
                  onClick={saveAndStart}
                  className="flex-[2] py-4 px-6 rounded-2xl bg-blue-600 text-white font-black text-lg shadow-xl shadow-blue-200 active:scale-95 transition-all"
                >
                  COMENZAR SESIÓN
                </button>
              </div>
            </div>
          </div>
        )}

        {view === 'WORKOUT' && currentSession && (
          <WorkoutView
            session={currentSession}
            onFinish={() => setView('SUMMARY')}
            onCancel={() => setView('LIST')}
          />
        )}

        {view === 'SUMMARY' && currentSession && (
          <div className="text-center space-y-8 py-12">
            <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div>
              <h2 className="text-4xl font-black text-gray-900 mb-2">¡Completado!</h2>
              <p className="text-gray-500 font-medium">Has finalizado {currentSession.name}</p>
            </div>
            
            <div className="bg-white p-8 rounded-3xl border border-gray-200 shadow-sm max-w-sm mx-auto space-y-4">
              <div className="flex justify-between items-center border-b border-gray-100 pb-4">
                <span className="text-gray-500 font-bold">Tiempo Total</span>
                <span className="text-2xl font-mono font-bold">{formatTime(currentSession.segments.reduce((acc, s) => acc + s.duration, 0))}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-500 font-bold">Tramos Realizados</span>
                <span className="text-2xl font-mono font-bold">{currentSession.segments.length}</span>
              </div>
            </div>

            <button
              onClick={() => setView('LIST')}
              className="bg-blue-600 text-white px-12 py-4 rounded-2xl font-black text-xl shadow-xl shadow-blue-200 active:scale-95 transition-all"
            >
              Volver al Inicio
            </button>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;
