import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { sendToOmniRoute } from "@/lib/omniroute";

const detailedPerformanceSchema = z.object({
  // Speed
  speed: z.object({
    averageWpm: z.number(),
    peakWpm: z.number(),
    rawWpm: z.number(),
    consistency: z.number(),
  }),
  // Accuracy
  accuracy: z.object({
    average: z.number(),
    correctCharacters: z.number(),
    incorrectCharacters: z.number(),
    correctedErrors: z.number(),
    uncorrectedErrors: z.number(),
  }),
  // Rhythm
  rhythm: z.object({
    avgKeystrokeInterval: z.number(),
    keystrokeIntervalVariability: z.number(),
    consistency: z.number(),
    longPauses: z.number(),
    avgPauseDuration: z.number(),
  }),
  // Errors
  errors: z.object({
    totalErrors: z.number(),
    commonKeys: z.array(z.object({ key: z.string(), count: z.number() })),
    commonPairs: z.array(z.object({ pair: z.string(), count: z.number() })),
    omissions: z.number(),
    insertions: z.number(),
    substitutions: z.number(),
    spacingErrors: z.number(),
    capitalizationErrors: z.number(),
  }),
  // Correction
  correction: z.object({
    correctionRate: z.number(),
    avgCorrectionTime: z.number(),
    totalBackspaces: z.number(),
    backspaceRate: z.number(),
  }),
  // Words
  words: z.object({
    slowWords: z.array(z.object({ word: z.string(), avgTime: z.number() })),
    difficultWordLength: z.number(),
    averageWordTime: z.number(),
    difficultWords: z.array(z.string()),
  }),
  // Hands
  hands: z.object({
    left: z.object({ accuracy: z.number(), speed: z.number(), commonErrors: z.array(z.string()) }),
    right: z.object({ accuracy: z.number(), speed: z.number(), commonErrors: z.array(z.string()) }),
  }),
  // Speed-Accuracy
  speedAccuracy: z.object({
    accuracyAtAverageSpeed: z.number(),
    speedAt90Accuracy: z.number(),
    speedAt95Accuracy: z.number(),
  }),
  // Trend
  trend: z.object({
    wpmChange: z.number(),
    accuracyChange: z.number(),
    consistencyChange: z.number(),
    errorRateChange: z.number(),
  }),
  // Basic info
  duration: z.number(),
  targetText: z.string(),
  difficulty: z.enum(["easy", "medium", "hard"]).default("medium"),
});

export async function POST(request: NextRequest) {
  try {
    console.log("[API AI-Coach] Received request");
    const body = await request.json();
    const perf = detailedPerformanceSchema.parse(body);

    const systemPrompt = `You are KeyCoachAI, an expert typing coach with deep knowledge of typing ergonomics, motor learning, and cognitive psychology. Analyze the user's detailed typing performance data and provide highly specific, actionable coaching.

Your response MUST be valid JSON in this exact format:
{
  "summary": "2-3 sentence overview of strengths and weaknesses",
  "tips": [
    "Specific tip 1 with exact key names or patterns",
    "Specific tip 2 with metrics reference",
    "Specific tip 3 with technique advice"
  ],
  "focusArea": "The single most important area to improve (speed|accuracy|rhythm|errors|correction|hand-balance)",
  "focusDescription": "Why this area needs attention, with specific data points",
  "exerciseDescription": "Detailed description of a personalized exercise targeting the weakest area. Include approximate word count, difficulty level, and what specific patterns/keys to focus on.",
  "exerciseContent": "The actual text content for the exercise (40-80 words)",
  "exerciseTitle": "A catchy title for this exercise"
}

Be extremely specific. Reference exact numbers, keys, and patterns from the data. Do not give generic advice.`;

    const userPrompt = `Analyze this detailed typing performance:

## SPEED
- Average WPM: ${perf.speed.averageWpm}
- Peak WPM: ${perf.speed.peakWpm}
- Raw WPM: ${perf.speed.rawWpm}
- Consistency: ${perf.speed.consistency}%

## ACCURACY
- Overall: ${perf.accuracy.average}%
- Correct: ${perf.accuracy.correctCharacters} | Incorrect: ${perf.accuracy.incorrectCharacters}
- Corrected errors: ${perf.accuracy.correctedErrors} | Uncorrected: ${perf.accuracy.uncorrectedErrors}

## RHYTHM
- Avg interval: ${perf.rhythm.avgKeystrokeInterval}ms
- Variability: ${perf.rhythm.keystrokeIntervalVariability}ms
- Consistency: ${perf.rhythm.consistency}%
- Long pauses: ${perf.rhythm.longPauses}

## ERRORS
- Total: ${perf.errors.totalErrors}
- Problem keys: ${perf.errors.commonKeys.map(k => k.key + "(" + k.count + ")").join(", ") || "None"}
- Problem pairs: ${perf.errors.commonPairs.map(p => p.pair + "(" + p.count + ")").join(", ") || "None"}
- Omissions: ${perf.errors.omissions} | Insertions: ${perf.errors.insertions} | Substitutions: ${perf.errors.substitutions}
- Spacing: ${perf.errors.spacingErrors} | Caps: ${perf.errors.capitalizationErrors}

## CORRECTION
- Rate: ${perf.correction.correctionRate}% | Backspaces: ${perf.correction.totalBackspaces}
- Avg correction time: ${perf.correction.avgCorrectionTime}ms

## WORDS
- Slow words: ${perf.words.slowWords.map(w => w.word + "(" + w.avgTime + "ms)").join(", ") || "None"}
- Difficult: ${perf.words.difficultWords.join(", ") || "None"}

## HANDS
- Left: ${perf.hands.left.accuracy}% accuracy, errors: ${perf.hands.left.commonErrors.join(", ") || "None"}
- Right: ${perf.hands.right.accuracy}% accuracy, errors: ${perf.hands.right.commonErrors.join(", ") || "None"}

## SPEED-ACCURACY
- At avg speed: ${perf.speedAccuracy.accuracyAtAverageSpeed}%
- At 90% acc: ${perf.speedAccuracy.speedAt90Accuracy} WPM
- At 95% acc: ${perf.speedAccuracy.speedAt95Accuracy} WPM

## TREND
- WPM: ${perf.trend.wpmChange > 0 ? "+" : ""}${perf.trend.wpmChange}
- Accuracy: ${perf.trend.accuracyChange > 0 ? "+" : ""}${perf.trend.accuracyChange}%
- Consistency: ${perf.trend.consistencyChange > 0 ? "+" : ""}${perf.trend.consistencyChange}%

Duration: ${perf.duration}s | Difficulty: ${perf.difficulty}

Generate personalized coaching JSON now:`;

    const aiResponse = await sendToOmniRoute([
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt },
    ], 0.7, 1500);

    const content = aiResponse.choices?.[0]?.message?.content;

    if (!content) {
      throw new Error("No response from AI coach");
    }

    // Parse JSON response with multiple strategies
    let parsed;
    try {
      parsed = JSON.parse(content);
    } catch {
      const codeBlockMatch = content.match(/\`\`\`(?:json)?\s*\n?([\s\S]*?)\n?\`\`\`/);
      if (codeBlockMatch) {
        try {
          parsed = JSON.parse(codeBlockMatch[1].trim());
        } catch {
          // fallback
        }
      }

      if (!parsed) {
        const jsonMatch = content.match(/\{[\s\S]*?"summary"[\s\S]*?\}/);
        if (jsonMatch) {
          try {
            parsed = JSON.parse(jsonMatch[0]);
          } catch {
            // fallback
          }
        }
      }
    }

    if (parsed && parsed.summary) {
      console.log("[API AI-Coach] Sending parsed AI response:", { summary: parsed.summary?.substring(0, 50) + "..." });
      // Ensure all fields exist with defaults
      const safeResponse = {
        summary: parsed.summary,
        tips: parsed.tips || ["Practice regularly", "Focus on accuracy", "Take breaks"],
        focusArea: parsed.focusArea || "general",
        focusDescription: parsed.focusDescription || "General typing improvement.",
        exerciseDescription: parsed.exerciseDescription || "Practice with this custom exercise.",
        exerciseContent: parsed.exerciseContent || "The quick brown fox jumps over the lazy dog.",
        exerciseTitle: parsed.exerciseTitle || "Personalized Exercise",
        ...parsed, // spread any extra fields the AI provided
      };
      return NextResponse.json(safeResponse, { status: 200 });
    }

    // Fallback
    console.log("[API AI-Coach] Sending fallback response (AI parse failed)");
    return NextResponse.json({
      summary: "Your typing shows a mix of strengths and areas for improvement.",
      tips: ["Practice problematic keys", "Focus on rhythm", "Reduce correction rate"],
      focusArea: "accuracy",
      focusDescription: "Work on reducing errors in common problematic keys.",
      exerciseDescription: "Practice typing words containing your most problematic keys.",
      exerciseContent: "The quick brown fox jumps over the lazy dog.",
      exerciseTitle: "General Practice",
    });

  } catch (error: any) {
    console.error("AI Coach error:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid performance data", details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { 
        error: "AI Coach unavailable", 
        message: error.message,
        fallback: {
          summary: "AI coach temporarily unavailable.",
          tips: ["Practice daily", "Focus on accuracy", "Use proper finger placement"],
          focusArea: "accuracy",
          focusDescription: "General accuracy improvement.",
          exerciseDescription: "Type common words slowly and accurately.",
          exerciseContent: "The quick brown fox jumps over the lazy dog.",
          exerciseTitle: "Basic Practice",
        }
      },
      { status: 200 }
    );
  }
}
