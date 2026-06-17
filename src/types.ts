export interface Question {
  id: number;
  text: string;
  options: {
    [key: string]: string; // Key is 'A', 'B', 'C', 'D', 'E' or 'a', 'b', 'c', 'd', 'e'
  };
  correctOption: string; // 'A', 'B', 'C', 'D', 'E' or standard lower-case
  topic: string;
  explanation: string;
}

export type GameState = 'WELCOME' | 'PLAYING' | 'SUMMARY';

export interface ScoreHistory {
  date: string;
  score: number;
  total: number;
  timeTaken: number; // in seconds
}
