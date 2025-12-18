
export const formatTime = (totalSeconds: number): string => {
  const mins = Math.floor(totalSeconds / 60);
  const secs = totalSeconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

export const parseTime = (mm: string, ss: string): number => {
  const m = parseInt(mm) || 0;
  const s = parseInt(ss) || 0;
  return m * 60 + s;
};

export const getMinutes = (totalSeconds: number): string => 
  Math.floor(totalSeconds / 60).toString();

export const getSeconds = (totalSeconds: number): string => 
  (totalSeconds % 60).toString();

export const generateId = () => Math.random().toString(36).substr(2, 9);
