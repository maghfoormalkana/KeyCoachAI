import { NextRequest, NextResponse } from "next/server";
import { sendToOmniRoute } from "@/lib/omniroute";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { category, difficulty, wordCount } = body;

    const wordCountNum = wordCount || 300;
    const categoryStr = category || "general";
    const difficultyStr = difficulty || "medium";

    // Topic ideas based on category
    const topics: Record<string, string[]> = {
      general: ["a day in the life of a curious mind", "the art of observation", "unexpected discoveries", "the beauty of everyday moments"],
      books: ["a forgotten library", "the last page of a mystery novel", "a conversation between two characters", "the power of storytelling"],
      poems: ["the rhythm of rain", "shadows at sunset", "whispers of the wind", "memories in autumn leaves"],
      quotes: ["wisdom passed through generations", "the weight of words", "moments that define us", "lessons from history"],
      code: ["the logic behind elegant algorithms", "a day in the life of a software engineer", "the evolution of programming languages", "debugging as detective work"],
      science: ["the wonders of the cosmos", "microscopic worlds", "the physics of everyday life", "breakthrough discoveries"],
      history: ["a moment that changed everything", "voices from the past", "the rise and fall of empires", "forgotten heroes"],
      technology: ["the future of artificial intelligence", "how technology shapes society", "the digital revolution", "innovations that changed the world"],
      movies: ["behind the scenes of filmmaking", "the magic of cinema", "a story waiting to be told", "the evolution of storytelling on screen"],
      sports: ["the spirit of competition", "a comeback story", "the psychology of champions", "the beauty of teamwork"],
    };

    const categoryTopics = topics[categoryStr] || topics.general;
    const randomTopic = categoryTopics[Math.floor(Math.random() * categoryTopics.length)];

    const userMessage = `Write a ${wordCountNum}-word passage about ${randomTopic}.

Requirements:
- Category: ${categoryStr}
- Difficulty: ${difficultyStr}
- Must be approximately ${wordCountNum} words
- Write continuous prose, not bullet points
- Include varied vocabulary and sentence structures
- Make it engaging and coherent
- Do NOT include any introduction like "Here is a passage"
- Start directly with the content

Return ONLY the passage text, nothing else.`;

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

    let passageContent = content.trim();

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

    return NextResponse.json({
      title: randomTopic,
      content: passageContent,
      wordCount: passageContent.split(/\s+/).filter((w: string) => w.length > 0).length,
      category: categoryStr,
      difficulty: difficultyStr,
    });

  } catch (error: any) {
    console.error("[Quick Generate Passage] Error:", error.message);
    return NextResponse.json(
      { error: "Failed to generate passage", message: error.message },
      { status: 500 }
    );
  }
}
