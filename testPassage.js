require('dotenv').config({ path: '.env.local' });

const OMNIROUTE_BASE_URL = process.env.OMNIROUTE_BASE_URL || "http://localhost:20128/v1";
const OMNIROUTE_API_KEY = process.env.OMNIROUTE_API_KEY || "";
const OMNIROUTE_MODEL = process.env.OMNIROUTE_MODEL || "auto";

const PROMPT = process.argv[2] || "A passage about student stress";
const CATEGORY = process.argv[3] || "general";
const DIFFICULTY = process.argv[4] || "medium";
const WORD_COUNT = parseInt(process.argv[5]) || 50;

async function generatePassage() {
  console.log("========================================");
  console.log("KeyCoachAI Passage Generator");
  console.log("========================================");
  console.log("Config:");
  console.log("  Base URL:", OMNIROUTE_BASE_URL);
  console.log("  Model:", OMNIROUTE_MODEL);
  console.log("  API Key:", OMNIROUTE_API_KEY ? "Set (" + OMNIROUTE_API_KEY.length + " chars)" : "NOT SET");
  console.log("");
  console.log("Request:");
  console.log("  Prompt:", PROMPT);
  console.log("  Category:", CATEGORY);
  console.log("  Difficulty:", DIFFICULTY);
  console.log("  Word Count:", WORD_COUNT);
  console.log("");

  if (!OMNIROUTE_API_KEY) {
    console.error("ERROR: OMNIROUTE_API_KEY not set in .env.local");
    process.exit(1);
  }

  const systemPrompt = `You are a typing passage generator. Create a single typing practice passage.

Requirements:
- Natural, readable text suitable for typing practice
- Include varied punctuation (commas, periods, quotes)
- No markdown, no headers, no explanations
- Respond ONLY as JSON: {\"title\":\"...\",\"content\":\"...\"}`;

  const userPrompt = `Create a typing passage about: ${PROMPT}
Category: ${CATEGORY}
Difficulty: ${DIFFICULTY}
Approximate length: ${WORD_COUNT} words

Return ONLY JSON, no other text.`;

  const url = OMNIROUTE_BASE_URL.endsWith("/v1") 
    ? `${OMNIROUTE_BASE_URL}/chat/completions` 
    : `${OMNIROUTE_BASE_URL}/v1/chat/completions`;

  console.log("Sending request to OmniRoute...");
  console.log("  URL:", url);
  console.log("");

  const startTime = Date.now();

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${OMNIROUTE_API_KEY}`,
      },
      body: JSON.stringify({
        model: OMNIROUTE_MODEL,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
        temperature: 0.8,
        max_tokens: 2000,
        stream: false,
      }),
    });

    const elapsed = Date.now() - startTime;

    console.log("Response received!");
    console.log("  Status:", response.status, response.statusText);
    console.log("  Time:", elapsed + "ms");
    console.log("");

    if (!response.ok) {
      const errorText = await response.text();
      console.error("ERROR: Request failed");
      console.error("  Status:", response.status);
      console.error("  Body:", errorText.substring(0, 1000));
      process.exit(1);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    console.log("Raw AI Response:");
    console.log("  ", content.substring(0, 300).replace(/\n/g, " ") + "...");
    console.log("");

    let title = "";
    let passageContent = "";

    try {
      const parsed = JSON.parse(content);
      title = parsed.title || "Untitled";
      passageContent = parsed.content || "";
      console.log("Parsed as JSON");
    } catch {
      const match = content.match(/```(?:json)?\s*\n?([\s\S]*?)\n?```/);
      if (match) {
        try {
          const parsed = JSON.parse(match[1].trim());
          title = parsed.title || "Untitled";
          passageContent = parsed.content || "";
          console.log("Parsed from code block");
        } catch {
          title = "AI Generated";
          passageContent = content;
          console.log("Using raw text");
        }
      } else {
        title = "AI Generated";
        passageContent = content;
        console.log("Using raw text");
      }
    }

    console.log("");
    console.log("========================================");
    console.log("           GENERATED PASSAGE            ");
    console.log("========================================");
    console.log("");
    console.log("Title:", title);
    console.log("");
    console.log("Content:");
    console.log(passageContent);
    console.log("");
    console.log("Word Count:", passageContent.split(/\s+/).length);
    console.log("Character Count:", passageContent.length);
    console.log("");
    console.log("Done!");

  } catch (err) {
    console.error("ERROR:", err.message);
    process.exit(1);
  }
}

generatePassage();