import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatWPM(wpm: number): string {
  return wpm.toFixed(1);
}

export function formatAccuracy(accuracy: number): string {
  return accuracy.toFixed(1) + "%";
}

export function calculateWPM(charsTyped: number, timeInSeconds: number, errors: number): number {
  const minutes = timeInSeconds / 60;
  const grossWPM = (charsTyped / 5) / minutes;
  const netWPM = Math.max(0, grossWPM - (errors / minutes));
  return Math.round(netWPM);
}

export function calculateAccuracy(totalChars: number, errors: number): number {
  if (totalChars === 0) return 100;
  return Math.round(((totalChars - errors) / totalChars) * 100 * 10) / 10;
}

export function detectWeakKeys(typedText: string, targetText: string): string[] {
  const weakKeys = new Set<string>();
  const minLen = Math.min(typedText.length, targetText.length);

  for (let i = 0; i < minLen; i++) {
    if (typedText[i] !== targetText[i]) {
      weakKeys.add(targetText[i].toLowerCase());
    }
  }

  return Array.from(weakKeys).slice(0, 5);
}

export function detectWeakPatterns(typedText: string, targetText: string): string[] {
  const weakPatterns = new Set<string>();
  const minLen = Math.min(typedText.length, targetText.length);

  for (let i = 0; i < minLen - 1; i++) {
    if (typedText[i] !== targetText[i] || typedText[i + 1] !== targetText[i + 1]) {
      const pattern = targetText.substring(i, i + 2).toLowerCase();
      if (pattern.length === 2 && /^[a-z]{2}$/.test(pattern)) {
        weakPatterns.add(pattern);
      }
    }
  }

  return Array.from(weakPatterns).slice(0, 5);
}

export function generatePerformanceProfile(
  wpm: number,
  accuracy: number,
  errors: number,
  backspaces: number,
  duration: number,
  typedText: string,
  targetText: string,
  difficulty: string = "medium"
) {
  return {
    wpm,
    accuracy,
    errors,
    backspaces,
    duration,
    weakKeys: detectWeakKeys(typedText, targetText),
    weakPatterns: detectWeakPatterns(typedText, targetText),
    punctuationAccuracy: calculatePunctuationAccuracy(typedText, targetText),
    difficulty,
  };
}

function calculatePunctuationAccuracy(typedText: string, targetText: string): number {
  const punctuationRegex = /[.,!?;:'"()-]/g;
  const targetPunctuations = targetText.match(punctuationRegex) || [];
  if (targetPunctuations.length === 0) return 100;

  let correct = 0;
  const minLen = Math.min(typedText.length, targetText.length);

  for (let i = 0; i < minLen; i++) {
    if (punctuationRegex.test(targetText[i]) && typedText[i] === targetText[i]) {
      correct++;
    }
  }

  return Math.round((correct / targetPunctuations.length) * 100);
}
