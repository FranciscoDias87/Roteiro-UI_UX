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

export type GameState = 'WELCOME' | 'TRAIL' | 'PLAYING' | 'SUMMARY' | 'TEACHER';

export interface DuolingoLevel {
  id: string; // e.g., 'level_1', 'level_2', 'level_3', 'level_4'
  title: string;
  topicTag: string;
  description: string;
  iconName: 'Shield' | 'Crop' | 'Sparkles' | 'Brain';
  colorClass: string; // e.g., 'bg-green-500' or active hexes
  borderClass: string; // for chunky bottom borders
  textColor: string;
  badgeColor: string;
  questionIds: number[];
}

export interface ScoreHistory {
  date: string;
  score: number;
  total: number;
  timeTaken: number; // in seconds
}

export interface StudentLevelProgress {
  levelId: string;
  playerName: string;
  score: number;
  total: number;
  perfect: boolean;
  timeTaken: number;
  mode: 'study' | 'exam';
  timestamp: any; // Firestore server timestamp or Date string
}

export interface StudentSessionResult {
  id?: string;
  playerName: string;
  timestamp: any;
  overallScore: number;
  overallTotal: number;
  overallPercentage: number;
  levelsCompleted: { [levelId: string]: number }; // levelId -> score
  timeTaken: number; // overall seconds
  mode: 'study' | 'exam';
  deviceInfo?: string;
}
