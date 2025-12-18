
import { Session } from './types';

export const PREDEFINED_SESSIONS: Session[] = [
  {
    id: 'hiit-gonzalo',
    name: 'HIIT GONZALO',
    segments: [
      { id: '1', duration: 300, speed: 3.5, incline: 5 },
      { id: '2', duration: 360, speed: 4.5, incline: 8 },
      { id: '3', duration: 360, speed: 4.5, incline: 11 },
      { id: '4', duration: 360, speed: 4.5, incline: 9 },
      { id: '5', duration: 360, speed: 4.5, incline: 12 },
      { id: '6', duration: 60, speed: 4.5, incline: 13 },
      { id: '7', duration: 60, speed: 4.5, incline: 14 },
      { id: '8', duration: 60, speed: 4.5, incline: 15 },
      { id: '9', duration: 30, speed: 4, incline: 14 },
      { id: '10', duration: 30, speed: 4, incline: 13 },
      { id: '11', duration: 30, speed: 4, incline: 12 },
      { id: '12', duration: 30, speed: 4, incline: 11 },
      { id: '13', duration: 30, speed: 4, incline: 10 },
      { id: '14', duration: 30, speed: 4, incline: 9 },
      { id: '15', duration: 30, speed: 4, incline: 8 },
      { id: '16', duration: 30, speed: 4, incline: 7 },
      { id: '17', duration: 30, speed: 4, incline: 6 },
      { id: '18', duration: 30, speed: 3.5, incline: 5 },
      { id: '19', duration: 30, speed: 3.5, incline: 4 },
      { id: '20', duration: 30, speed: 3, incline: 3 },
      { id: '21', duration: 60, speed: 2, incline: 2 },
    ]
  },
  {
    id: 'basic-walk',
    name: 'Caminata Básica',
    segments: [
      { id: 'b1', duration: 300, speed: 4, incline: 2 },
      { id: 'b2', duration: 300, speed: 5, incline: 3 },
      { id: 'b3', duration: 300, speed: 5, incline: 4 },
      { id: 'b4', duration: 300, speed: 4, incline: 3 },
      { id: 'b5', duration: 300, speed: 3, incline: 1 },
    ]
  }
];

export const MAX_SPEED = 15;
export const MAX_INCLINE = 15;
