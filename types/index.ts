export interface TypingResult {
  _id?: string;
  userId?: string;
  wpm: number;
  accuracy: number;
  errors: number;
  backspaces: number;
  duration: number;
  weakKeys: string[];
  weakPatterns: string[];
  punctuationAccuracy: number;
  difficulty: string;
  createdAt?: Date;
}

export interface UserProfile {
  _id?: string;
  name: string;
  email: string;
  image?: string;
  targetWpm: number;
  targetAccuracy: number;
  testsCompleted: number;
  averageWpm: number;
  bestWpm: number;
  averageAccuracy: number;
  createdAt?: Date;
}

export interface PerformanceProfile {
  wpm: number;
  accuracy: number;
  errors: number;
  backspaces: number;
  duration: number;
  weakKeys: string[];
  weakPatterns: string[];
  punctuationAccuracy: number;
  difficulty: string;
}

export interface HistoricalProfile {
  current: {
    wpm: number;
    accuracy: number;
  };
  history: {
    averageWpm: number;
    bestWpm: number;
    averageAccuracy: number;
    testsCompleted: number;
  };
  weakKeys: string[];
  weakPatterns: string[];
  goals: {
    targetWpm: number;
    targetAccuracy: number;
  };
}

export interface AICoachResponse {
  feedback: string;
  exercise: string;
  tips: string[];
}
