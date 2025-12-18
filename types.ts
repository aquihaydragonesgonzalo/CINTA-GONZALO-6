
export interface Segment {
  id: string;
  duration: number; // in seconds
  speed: number;    // 0 to 15
  incline: number;  // 0 to 15
}

export interface Session {
  id: string;
  name: string;
  segments: Segment[];
}

export type AppState = 'LIST' | 'EDIT' | 'WORKOUT' | 'SUMMARY';
