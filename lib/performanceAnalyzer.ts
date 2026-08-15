"use client";

export interface KeystrokeEvent {
  key: string;
  timestamp: number;
  correct: boolean;
  isBackspace: boolean;
  targetChar: string;
  charIndex: number;
}

export interface DetailedPerformance {
  // Speed
  speed: {
    averageWpm: number;
    peakWpm: number;
    rawWpm: number;
    consistency: number; // 0-100
  };
  // Accuracy
  accuracy: {
    average: number;
    correctCharacters: number;
    incorrectCharacters: number;
    correctedErrors: number;
    uncorrectedErrors: number;
  };
  // Rhythm
  rhythm: {
    avgKeystrokeInterval: number; // ms
    keystrokeIntervalVariability: number; // standard deviation
    consistency: number; // 0-100
    longPauses: number; // count of pauses > 2s
    avgPauseDuration: number; // ms
  };
  // Errors
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
  // Correction
  correction: {
    correctionRate: number; // %
    avgCorrectionTime: number; // ms
    totalBackspaces: number;
    backspaceRate: number; // per 100 chars
  };
  // Words
  words: {
    slowWords: { word: string; avgTime: number }[];
    difficultWordLength: number; // avg length of error-prone words
    averageWordTime: number; // ms
    difficultWords: string[];
  };
  // Hands
  hands: {
    left: { accuracy: number; speed: number; commonErrors: string[] };
    right: { accuracy: number; speed: number; commonErrors: string[] };
  };
  // Speed-Accuracy tradeoff
  speedAccuracy: {
    accuracyAtAverageSpeed: number;
    speedAt90Accuracy: number;
    speedAt95Accuracy: number;
  };
  // Trend (if historical data provided)
  trend: {
    wpmChange: number;
    accuracyChange: number;
    consistencyChange: number;
    errorRateChange: number;
  };
}

const LEFT_HAND_KEYS = new Set([
  "q","w","e","r","t","a","s","d","f","g","z","x","c","v","b",
  "1","2","3","4","5","!","@","#","$","%",
  "`","~","Tab","CapsLock","Shift","Control","Meta","Alt"
]);

const RIGHT_HAND_KEYS = new Set([
  "y","u","i","o","p","h","j","k","l","n","m",
  "6","7","8","9","0","^","&","*","(",")",
  "[","]","\\",";","'",",",".","/","-","=","Enter","Backspace"
]);

function isLeftHand(key: string): boolean {
  return LEFT_HAND_KEYS.has(key.toLowerCase()) || LEFT_HAND_KEYS.has(key);
}

function isRightHand(key: string): boolean {
  return RIGHT_HAND_KEYS.has(key.toLowerCase()) || RIGHT_HAND_KEYS.has(key);
}

export function analyzeDetailedPerformance(
  keystrokes: KeystrokeEvent[],
  targetText: string,
  typedText: string,
  duration: number,
  historicalData?: {
    prevWpm: number;
    prevAccuracy: number;
    prevConsistency: number;
    prevErrorRate: number;
  }
): DetailedPerformance {
  if (keystrokes.length === 0) {
    return getDefaultPerformance();
  }

  // ===== SPEED ANALYSIS =====
  const totalChars = typedText.length;
  const minutes = duration / 60;
  const rawWpm = (totalChars / 5) / minutes;

  // Calculate WPM over time windows for peak and consistency
  const windowSize = 5000; // 5 second windows
  const windows: number[] = [];
  const startTime = keystrokes[0]?.timestamp || 0;

  for (let t = startTime; t < startTime + duration * 1000; t += windowSize) {
    const windowStrokes = keystrokes.filter(k => k.timestamp >= t && k.timestamp < t + windowSize && !k.isBackspace);
    const windowWpm = (windowStrokes.length / 5) / (windowSize / 60000);
    if (windowStrokes.length > 0) windows.push(windowWpm);
  }

  const peakWpm = windows.length > 0 ? Math.max(...windows) : rawWpm;
  const avgWpm = windows.length > 0 ? windows.reduce((a, b) => a + b, 0) / windows.length : rawWpm;

  // Consistency = 100 - coefficient of variation
  const wpmMean = avgWpm;
  const wpmVariance = windows.length > 0 
    ? windows.reduce((sum, w) => sum + Math.pow(w - wpmMean, 2), 0) / windows.length 
    : 0;
  const wpmStdDev = Math.sqrt(wpmVariance);
  const consistency = wpmMean > 0 ? Math.max(0, 100 - (wpmStdDev / wpmMean) * 100) : 100;

  // ===== ACCURACY ANALYSIS =====
  const correctChars = keystrokes.filter(k => k.correct && !k.isBackspace).length;
  const incorrectChars = keystrokes.filter(k => !k.correct && !k.isBackspace).length;
  const totalBackspaces = keystrokes.filter(k => k.isBackspace).length;

  // Corrected errors = backspaces that fixed something
  const correctedErrors = totalBackspaces;
  // Uncorrected = errors still in final text
  const uncorrectedErrors = countUncorrectedErrors(typedText, targetText);

  const accuracy = totalChars > 0 ? (correctChars / totalChars) * 100 : 100;

  // ===== RHYTHM ANALYSIS =====
  const intervals: number[] = [];
  const pauses: number[] = [];

  for (let i = 1; i < keystrokes.length; i++) {
    const interval = keystrokes[i].timestamp - keystrokes[i - 1].timestamp;
    if (interval > 2000) {
      pauses.push(interval);
    } else if (interval > 0) {
      intervals.push(interval);
    }
  }

  const avgInterval = intervals.length > 0 
    ? intervals.reduce((a, b) => a + b, 0) / intervals.length 
    : 0;

  const intervalVariance = intervals.length > 0
    ? intervals.reduce((sum, iv) => sum + Math.pow(iv - avgInterval, 2), 0) / intervals.length
    : 0;
  const intervalStdDev = Math.sqrt(intervalVariance);

  const rhythmConsistency = avgInterval > 0 
    ? Math.max(0, 100 - (intervalStdDev / avgInterval) * 100) 
    : 100;

  // ===== ERROR ANALYSIS =====
  const errorStrokes = keystrokes.filter(k => !k.correct && !k.isBackspace);

  // Common keys
  const keyErrorMap = new Map<string, number>();
  errorStrokes.forEach(k => {
    const key = k.targetChar || k.key;
    keyErrorMap.set(key, (keyErrorMap.get(key) || 0) + 1);
  });
  const commonKeys = Array.from(keyErrorMap.entries())
    .map(([key, count]) => ({ key, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  // Common pairs (bigrams)
  const pairErrorMap = new Map<string, number>();
  for (let i = 1; i < keystrokes.length; i++) {
    const prev = keystrokes[i - 1];
    const curr = keystrokes[i];
    if (!curr.correct && !curr.isBackspace && prev.targetChar) {
      const pair = (prev.targetChar + curr.targetChar).toLowerCase();
      if (pair.length === 2 && /^[a-z]{2}$/.test(pair)) {
        pairErrorMap.set(pair, (pairErrorMap.get(pair) || 0) + 1);
      }
    }
  }
  const commonPairs = Array.from(pairErrorMap.entries())
    .map(([pair, count]) => ({ pair, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  // Error types
  let omissions = 0;
  let insertions = 0;
  let substitutions = 0;
  let spacingErrors = 0;
  let capitalizationErrors = 0;

  const minLen = Math.min(typedText.length, targetText.length);
  for (let i = 0; i < minLen; i++) {
    if (typedText[i] !== targetText[i]) {
      if (typedText[i].toLowerCase() === targetText[i].toLowerCase()) {
        capitalizationErrors++;
      } else if (typedText[i] === " " || targetText[i] === " ") {
        spacingErrors++;
      } else {
        substitutions++;
      }
    }
  }

  if (typedText.length < targetText.length) omissions += targetText.length - typedText.length;
  if (typedText.length > targetText.length) insertions += typedText.length - targetText.length;

  // ===== CORRECTION ANALYSIS =====
  const correctionRate = totalChars > 0 ? (totalBackspaces / totalChars) * 100 : 0;
  const backspaceRate = totalChars > 0 ? (totalBackspaces / totalChars) * 100 : 0;

  // Average time between error and correction
  let totalCorrectionTime = 0;
  let correctionCount = 0;
  for (let i = 1; i < keystrokes.length; i++) {
    if (keystrokes[i].isBackspace) {
      // Find the error that triggered this backspace
      for (let j = i - 1; j >= 0; j--) {
        if (!keystrokes[j].correct && !keystrokes[j].isBackspace) {
          totalCorrectionTime += keystrokes[i].timestamp - keystrokes[j].timestamp;
          correctionCount++;
          break;
        }
      }
    }
  }
  const avgCorrectionTime = correctionCount > 0 ? totalCorrectionTime / correctionCount : 0;

  // ===== WORD ANALYSIS =====
  const words = targetText.split(/\s+/).filter(w => w.length > 0);
  const wordTimes: Map<string, number[]> = new Map();

  let currentWord = "";
  let wordStartTime = 0;

  for (const stroke of keystrokes) {
    if (stroke.targetChar === " " || stroke.key === " ") {
      if (currentWord && wordStartTime > 0) {
        const wordTime = stroke.timestamp - wordStartTime;
        if (!wordTimes.has(currentWord)) wordTimes.set(currentWord, []);
        wordTimes.get(currentWord)!.push(wordTime);
      }
      currentWord = "";
      wordStartTime = 0;
    } else {
      if (!currentWord) wordStartTime = stroke.timestamp;
      currentWord += stroke.targetChar || stroke.key;
    }
  }

  const wordStats = Array.from(wordTimes.entries())
    .map(([word, times]) => ({
      word,
      avgTime: times.reduce((a, b) => a + b, 0) / times.length,
    }))
    .sort((a, b) => b.avgTime - a.avgTime);

  const slowWords = wordStats.slice(0, 5);
  const averageWordTime = wordStats.length > 0 
    ? wordStats.reduce((sum, w) => sum + w.avgTime, 0) / wordStats.length 
    : 0;

  // Difficult words = words with errors
  const difficultWords = Array.from(new Set(
    errorStrokes
      .map(k => {
        // Find which word this character belongs to
        const idx = k.charIndex;
        let wordIdx = 0;
        let charCount = 0;
        for (const word of words) {
          if (charCount <= idx && idx < charCount + word.length + 1) {
            return word.toLowerCase().replace(/[^a-z]/g, "");
          }
          charCount += word.length + 1;
        }
        return "";
      })
      .filter(w => w.length > 2)
  )).slice(0, 5);

  const difficultWordLength = difficultWords.length > 0
    ? difficultWords.reduce((sum, w) => sum + w.length, 0) / difficultWords.length
    : 0;

  // ===== HAND ANALYSIS =====
  const leftHandStrokes = keystrokes.filter(k => isLeftHand(k.key));
  const rightHandStrokes = keystrokes.filter(k => isRightHand(k.key));

  const leftCorrect = leftHandStrokes.filter(k => k.correct && !k.isBackspace).length;
  const leftTotal = leftHandStrokes.filter(k => !k.isBackspace).length;
  const leftAccuracy = leftTotal > 0 ? (leftCorrect / leftTotal) * 100 : 100;
  const leftSpeed = leftTotal > 0 ? (leftTotal / 5) / minutes : 0;
  const leftErrors = leftHandStrokes
    .filter(k => !k.correct && !k.isBackspace)
    .map(k => k.targetChar || k.key)
    .filter((v, i, a) => a.indexOf(v) === i)
    .slice(0, 5);

  const rightCorrect = rightHandStrokes.filter(k => k.correct && !k.isBackspace).length;
  const rightTotal = rightHandStrokes.filter(k => !k.isBackspace).length;
  const rightAccuracy = rightTotal > 0 ? (rightCorrect / rightTotal) * 100 : 100;
  const rightSpeed = rightTotal > 0 ? (rightTotal / 5) / minutes : 0;
  const rightErrors = rightHandStrokes
    .filter(k => !k.correct && !k.isBackspace)
    .map(k => k.targetChar || k.key)
    .filter((v, i, a) => a.indexOf(v) === i)
    .slice(0, 5);

  // ===== SPEED-ACCURACY TRADEOFF =====
  // Calculate accuracy at different speed percentiles
  const sortedWindows = [...windows].sort((a, b) => a - b);
  const p50Index = Math.floor(sortedWindows.length * 0.5);
  const accuracyAtAvgSpeed = sortedWindows.length > 0 ? accuracy : 0;

  // Estimate speed at 90% and 95% accuracy using linear interpolation
  // This is a simplified estimation
  const speedAt90Accuracy = accuracy >= 90 ? avgWpm : avgWpm * (accuracy / 90);
  const speedAt95Accuracy = accuracy >= 95 ? avgWpm : avgWpm * (accuracy / 95);

  // ===== TREND =====
  const trend = historicalData && historicalData.prevWpm > 0 ? {
    wpmChange: Number((avgWpm - historicalData.prevWpm).toFixed(1)),
    accuracyChange: Number((accuracy - historicalData.prevAccuracy).toFixed(1)),
    consistencyChange: Number((consistency - historicalData.prevConsistency).toFixed(1)),
    errorRateChange: Number((((errorStrokes.length / Math.max(totalChars, 1)) * 100) - historicalData.prevErrorRate).toFixed(1)),
  } : {
    wpmChange: 0,
    accuracyChange: 0,
    consistencyChange: 0,
    errorRateChange: 0,
  };

  return {
    speed: {
      averageWpm: Math.round(avgWpm * 10) / 10,
      peakWpm: Math.round(peakWpm * 10) / 10,
      rawWpm: Math.round(rawWpm * 10) / 10,
      consistency: Math.round(consistency * 10) / 10,
    },
    accuracy: {
      average: Math.round(accuracy * 10) / 10,
      correctCharacters: correctChars,
      incorrectCharacters: incorrectChars,
      correctedErrors,
      uncorrectedErrors,
    },
    rhythm: {
      avgKeystrokeInterval: Math.round(avgInterval * 10) / 10,
      keystrokeIntervalVariability: Math.round(intervalStdDev * 10) / 10,
      consistency: Math.round(rhythmConsistency * 10) / 10,
      longPauses: pauses.length,
      avgPauseDuration: pauses.length > 0 ? Math.round(pauses.reduce((a, b) => a + b, 0) / pauses.length) : 0,
    },
    errors: {
      totalErrors: errorStrokes.length,
      commonKeys,
      commonPairs,
      omissions,
      insertions,
      substitutions,
      spacingErrors,
      capitalizationErrors,
    },
    correction: {
      correctionRate: Math.round(correctionRate * 10) / 10,
      avgCorrectionTime: Math.round(avgCorrectionTime * 10) / 10,
      totalBackspaces,
      backspaceRate: Math.round(backspaceRate * 10) / 10,
    },
    words: {
      slowWords: slowWords.map(w => ({ word: w.word, avgTime: Math.round(w.avgTime) })),
      difficultWordLength: Math.round(difficultWordLength * 10) / 10,
      averageWordTime: Math.round(averageWordTime * 10) / 10,
      difficultWords,
    },
    hands: {
      left: { accuracy: Math.round(leftAccuracy * 10) / 10, speed: Math.round(leftSpeed * 10) / 10, commonErrors: leftErrors },
      right: { accuracy: Math.round(rightAccuracy * 10) / 10, speed: Math.round(rightSpeed * 10) / 10, commonErrors: rightErrors },
    },
    speedAccuracy: {
      accuracyAtAverageSpeed: Math.round(accuracyAtAvgSpeed * 10) / 10,
      speedAt90Accuracy: Math.round(speedAt90Accuracy * 10) / 10,
      speedAt95Accuracy: Math.round(speedAt95Accuracy * 10) / 10,
    },
    trend: {
      wpmChange: Number.isFinite(trend.wpmChange) ? trend.wpmChange : 0,
      accuracyChange: Number.isFinite(trend.accuracyChange) ? trend.accuracyChange : 0,
      consistencyChange: Number.isFinite(trend.consistencyChange) ? trend.consistencyChange : 0,
      errorRateChange: Number.isFinite(trend.errorRateChange) ? trend.errorRateChange : 0,
    },
  };
}

function countUncorrectedErrors(typed: string, target: string): number {
  let errors = 0;
  const minLen = Math.min(typed.length, target.length);
  for (let i = 0; i < minLen; i++) {
    if (typed[i] !== target[i]) errors++;
  }
  errors += Math.abs(typed.length - target.length);
  return errors;
}

function getDefaultPerformance(): DetailedPerformance {
  return {
    speed: { averageWpm: 0, peakWpm: 0, rawWpm: 0, consistency: 0 },
    accuracy: { average: 100, correctCharacters: 0, incorrectCharacters: 0, correctedErrors: 0, uncorrectedErrors: 0 },
    rhythm: { avgKeystrokeInterval: 0, keystrokeIntervalVariability: 0, consistency: 0, longPauses: 0, avgPauseDuration: 0 },
    errors: { totalErrors: 0, commonKeys: [], commonPairs: [], omissions: 0, insertions: 0, substitutions: 0, spacingErrors: 0, capitalizationErrors: 0 },
    correction: { correctionRate: 0, avgCorrectionTime: 0, totalBackspaces: 0, backspaceRate: 0 },
    words: { slowWords: [], difficultWordLength: 0, averageWordTime: 0, difficultWords: [] },
    hands: { left: { accuracy: 100, speed: 0, commonErrors: [] }, right: { accuracy: 100, speed: 0, commonErrors: [] } },
    speedAccuracy: { accuracyAtAverageSpeed: 0, speedAt90Accuracy: 0, speedAt95Accuracy: 0 },
    trend: { wpmChange: 0, accuracyChange: 0, consistencyChange: 0, errorRateChange: 0 },
  };
}

export function generatePerformancePrompt(perf: DetailedPerformance, targetText: string): string {
  return `Analyze this detailed typing performance and provide personalized coaching advice:

## SPEED
- Average WPM: ${perf.speed.averageWpm}
- Peak WPM: ${perf.speed.peakWpm}
- Raw WPM: ${perf.speed.rawWpm}
- Consistency: ${perf.speed.consistency}%

## ACCURACY
- Overall: ${perf.accuracy.average}%
- Correct characters: ${perf.accuracy.correctCharacters}
- Incorrect characters: ${perf.accuracy.incorrectCharacters}
- Corrected errors (backspaced): ${perf.accuracy.correctedErrors}
- Uncorrected errors: ${perf.accuracy.uncorrectedErrors}

## RHYTHM
- Avg keystroke interval: ${perf.rhythm.avgKeystrokeInterval}ms
- Interval variability (std dev): ${perf.rhythm.keystrokeIntervalVariability}ms
- Rhythm consistency: ${perf.rhythm.consistency}%
- Long pauses (>2s): ${perf.rhythm.longPauses}
- Avg pause duration: ${perf.rhythm.avgPauseDuration}ms

## ERRORS
- Total errors: ${perf.errors.totalErrors}
- Most problematic keys: ${perf.errors.commonKeys.map(k => k.key + "(" + k.count + ")").join(", ") || "None"}
- Most problematic pairs: ${perf.errors.commonPairs.map(p => p.pair + "(" + p.count + ")").join(", ") || "None"}
- Omissions: ${perf.errors.omissions}
- Insertions: ${perf.errors.insertions}
- Substitutions: ${perf.errors.substitutions}
- Spacing errors: ${perf.errors.spacingErrors}
- Capitalization errors: ${perf.errors.capitalizationErrors}

## CORRECTION BEHAVIOR
- Correction rate: ${perf.correction.correctionRate}%
- Avg time to correct: ${perf.correction.avgCorrectionTime}ms
- Total backspaces: ${perf.correction.totalBackspaces}
- Backspace rate: ${perf.correction.backspaceRate}%

## WORDS
- Slowest words: ${perf.words.slowWords.map(w => w.word + "(" + w.avgTime + "ms)").join(", ") || "None"}
- Difficult words: ${perf.words.difficultWords.join(", ") || "None"}
- Avg word time: ${perf.words.averageWordTime}ms

## HAND PERFORMANCE
- Left hand: ${perf.hands.left.accuracy}% accuracy, ${perf.hands.left.speed} WPM, errors: ${perf.hands.left.commonErrors.join(", ") || "None"}
- Right hand: ${perf.hands.right.accuracy}% accuracy, ${perf.hands.right.speed} WPM, errors: ${perf.hands.right.commonErrors.join(", ") || "None"}

## SPEED-ACCURACY TRADEOFF
- Accuracy at avg speed: ${perf.speedAccuracy.accuracyAtAverageSpeed}%
- Speed at 90% accuracy: ${perf.speedAccuracy.speedAt90Accuracy} WPM
- Speed at 95% accuracy: ${perf.speedAccuracy.speedAt95Accuracy} WPM

## TREND (vs previous test)
- WPM change: ${perf.trend.wpmChange > 0 ? "+" : ""}${perf.trend.wpmChange}
- Accuracy change: ${perf.trend.accuracyChange > 0 ? "+" : ""}${perf.trend.accuracyChange}%
- Consistency change: ${perf.trend.consistencyChange > 0 ? "+" : ""}${perf.trend.consistencyChange}%
- Error rate change: ${perf.trend.errorRateChange > 0 ? "+" : ""}${perf.trend.errorRateChange}%

Provide:
1. A brief summary of strengths and weaknesses
2. 3 specific, actionable tips for improvement
3. A recommended focus area (speed, accuracy, rhythm, or specific keys)
4. A personalized exercise description targeting the weakest area`;
}
