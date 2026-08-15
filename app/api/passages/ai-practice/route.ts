import { NextRequest, NextResponse } from "next/server";
import { sendToOmniRoute } from "@/lib/omniroute";

export async function POST(request: NextRequest) {
  try {
    const { prompt, difficulty, wordCount } = await request.json();

    const wordCountNum = wordCount || 50;
    const difficultyStr = difficulty || "medium";
    const promptStr = prompt || "an interesting topic";

    const userMessage = `Write a ${wordCountNum}-word passage about ${promptStr}. Difficulty: ${difficultyStr}. Return only the passage.`;

    const aiResponse = await sendToOmniRoute(
      [{ role: "user", content: userMessage }],
      0.7,
      150
    );

    const content = aiResponse.choices?.[0]?.message?.content;

    if (!content) {
      return NextResponse.json({ error: "Empty response from AI" }, { status: 500 });
    }

    return NextResponse.json({
      title: promptStr.slice(0, 60),
      content: content.trim(),
    });

  } catch (error: any) {
    console.error("[AI Practice] Error:", error.message);
    return NextResponse.json(
      { error: "Failed to generate passage", message: error.message },
      { status: 500 }
    );
  }
}
