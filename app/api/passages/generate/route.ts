import { NextRequest, NextResponse } from "next/server";
import { sendToOmniRoute } from "@/lib/omniroute";
import connectDB from "@/lib/mongodb";
import Passage from "@/models/Passage";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { prompt, category, difficulty, wordCount } = body;

    // Default to 300 words for long passages (suitable for 5-10 min tests)
    const wordCountNum = wordCount || 300;
    const categoryStr = category || "general";
    const difficultyStr = difficulty || "medium";
    const promptStr = prompt || "an interesting topic";

    // Enhanced prompt for long, high-quality passages
    const userMessage = `Write a ${wordCountNum}-word passage about ${promptStr}.

Requirements:
- Category: ${categoryStr}
- Difficulty: ${difficultyStr}
- Must be EXACTLY ${wordCountNum} words (or very close)
- Write continuous prose, not bullet points
- Include varied vocabulary and sentence structures
- Make it engaging and coherent
- Do NOT include any introduction like "Here is a passage" or "Here is a ${wordCountNum}-word passage"
- Start directly with the content

Return ONLY the passage text, nothing else.`;

    // Increase max tokens for longer passages (roughly 1.5 tokens per word)
    const maxTokens = Math.min(Math.ceil(wordCountNum * 2.5), 2000);

    const aiResponse = await sendToOmniRoute(
      [{ role: "user", content: userMessage }],
      0.7,
      maxTokens
    );

    const content = aiResponse.choices?.[0]?.message?.content;

    if (!content) {
      return NextResponse.json({ error: "Empty response from AI" }, { status: 500 });
    }

    // Clean up the content - remove any intro text
    let passageContent = content.trim();

    // Remove common AI intros
    const introsToRemove = [
      /^here is a \d+-word passage[:\.]?\s*/i,
      /^here is a passage[:\.]?\s*/i,
      /^passage[:\.]?\s*/i,
      /^\d+-word passage[:\.]?\s*/i,
    ];

    for (const intro of introsToRemove) {
      passageContent = passageContent.replace(intro, "");
    }

    passageContent = passageContent.trim();

    // Use prompt as title (truncated)
    const title = promptStr.slice(0, 80);

    // Save to database
    try {
      await connectDB();
      await Passage.create({
        title,
        content: passageContent,
        category: categoryStr,
        difficulty: difficultyStr,
        wordCount: passageContent.split(/\s+/).filter((w: string) => w.length > 0).length,
        isActive: true,
      });
    } catch {
      // Continue even if DB save fails
    }

    return NextResponse.json({
      title,
      content: passageContent,
      wordCount: passageContent.split(/\s+/).filter((w: string) => w.length > 0).length,
    });

  } catch (error: any) {
    console.error("[Generate Passage] Error:", error.message);
    return NextResponse.json(
      { error: "Failed to generate passage", message: error.message },
      { status: 500 }
    );
  }
}
