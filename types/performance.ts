export interface KeystrokeEvent {
  key: string;
  timestamp: number;
  correct: boolean;
  isBackspace: boolean;
  targetChar: string;
  charIndex: number;
}

export interface DetailedPerformance {
  speed: {
    averageWpm: number;
    peakWpm: number;
    rawWpm: number;
    consistency: number;
  };
  accuracy: {
    average: number;
    correctCharacters: number;
    incorrectCharacters: number;
    correctedErrors: number;
    uncorrectedErrors: number;
  };
  rhythm: {
    avgKeystrokeInterval: number;
    keystrokeIntervalVariability: number;
    consistency: number;
    longPauses: number;
    avgPauseDuration: number;
  };
  errors: {
    totalErrors: number;
    commonKeys: { key: string; count: number }[];
    commonPairs: { pair: string; count: number }[];
    omissions: number;
    insertions: number;
    substitutions: number;
    spacingErrors: number;
    capitalizationErrors: number;
  };
  correction: {
    correctionRate: number;
    avgCorrectionTime: number;
    totalBackspaces: number;
    backspaceRate: number;
  };
  words: {
    slowWords: { word: string; avgTime: number }[];
    difficultWordLength: number;
    averageWordTime: number;
    difficultWords: string[];
  };
  hands: {
    left: { accuracy: number; speed: number; commonErrors: string[] };
    right: { accuracy: number; speed: number; commonErrors: string[] };
  };
  speedAccuracy: {
    accuracyAtAverageSpeed: number;
    speedAt90Accuracy: number;
    speedAt95Accuracy: number;
  };
  trend: {
    wpmChange: number;
    accuracyChange: number;
    consistencyChange: number;
    errorRateChange: number;
  };
}

export interface AICoachResponse {
  summary: string;
  tips: string[];
  focusArea: string;
  focusDescription: string;
  exerciseDescription: string;
  exerciseContent: string;
  exerciseTitle: string;
}
