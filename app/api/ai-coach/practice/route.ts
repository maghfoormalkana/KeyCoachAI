import { NextRequest, NextResponse } from "next/server";
import { sendToOmniRoute } from "@/lib/omniroute";

export async function POST(request: NextRequest) {
  try {
    const { weakKeys, weakPatterns, averageWpm, targetWpm } = await request.json();

    const systemPrompt = `You are KeyCoachAI's practice exercise generator. Create a personalized typing exercise that targets the user's weak areas.

Rules:
1. The exercise should be 2-3 sentences long (40-80 words)
2. Heavily feature the user's weak keys and patterns
3. Make it natural and readable, not just random characters
4. Include some punctuation for practice
5. Respond ONLY with the exercise text, no explanations

Example weak keys: r, t, g → include words like "great", "tree", "right", "target"
Example weak patterns: th, tr, gr → include words like "through", "train", "ground"`;

    const userPrompt = `Generate a typing exercise targeting these weak areas:
Weak Keys: ${weakKeys?.join(", ") || "none"}
Weak Patterns: ${weakPatterns?.join(", ") || "none"}
Current Average WPM: ${averageWpm}
Target WPM: ${targetWpm}

Generate the exercise now:`;

    const aiResponse = await sendToOmniRoute([
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt },
    ]);

    const exercise = aiResponse.choices[0]?.message?.content?.trim();

    return NextResponse.json({
      exercise: exercise || "The quick brown fox jumps over the lazy dog. Practice makes perfect when you type with focus and determination.",
    });

  } catch (error) {
    console.error("AI practice generation error:", error);
    return NextResponse.json({
      exercise: "The quick brown fox jumps over the lazy dog. Pack my box with five dozen liquor jugs.",
    });
  }
}
