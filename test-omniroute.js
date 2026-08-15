// test-omniroute.js
// Run this from terminal: node test-omniroute.js

const OMNIROUTE_BASE_URL = process.env.OMNIROUTE_BASE_URL || "http://localhost:20128/v1";
const OMNIROUTE_API_KEY = process.env.OMNIROUTE_API_KEY || "";
const OMNIROUTE_MODEL = process.env.OMNIROUTE_MODEL || "auto";

async function testOmniRoute() {
  console.log("========================================");
  console.log("OmniRoute Connection Test");
  console.log("========================================");
  console.log("Base URL:", OMNIROUTE_BASE_URL);
  console.log("Model:", OMNIROUTE_MODEL);
  console.log("API Key length:", OMNIROUTE_API_KEY.length);
  console.log("");

  if (!OMNIROUTE_API_KEY) {
    console.error("❌ ERROR: OMNIROUTE_API_KEY is not set!");
    console.log("   Set it in .env.local or as environment variable.");
    process.exit(1);
  }

  // Test 1: List models
  console.log("Test 1: Listing available models...");
  try {
    const modelsUrl = OMNIROUTE_BASE_URL.endsWith("/v1") 
      ? `${OMNIROUTE_BASE_URL}/models` 
      : `${OMNIROUTE_BASE_URL}/v1/models`;

    const res = await fetch(modelsUrl, {
      headers: { "Authorization": `Bearer ${OMNIROUTE_API_KEY}` }
    });

    if (!res.ok) {
      console.error("❌ Failed to list models:", res.status, await res.text());
      process.exit(1);
    }

    const data = await res.json();
    console.log("✅ Connected! Available models:", data.data?.length || 0);
    console.log("   First 5 models:");
    data.data?.slice(0, 5).forEach((m, i) => {
      console.log(`   ${i + 1}. ${m.id}`);
    });
    console.log("");
  } catch (err) {
    console.error("❌ Connection failed:", err.message);
    process.exit(1);
  }

  // Test 2: Generate a simple passage
  console.log("Test 2: Generating a passage...");
  console.log("   Model:", OMNIROUTE_MODEL);

  const startTime = Date.now();

  try {
    const chatUrl = OMNIROUTE_BASE_URL.endsWith("/v1") 
      ? `${OMNIROUTE_BASE_URL}/chat/completions` 
      : `${OMNIROUTE_BASE_URL}/v1/chat/completions`;

    const res = await fetch(chatUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${OMNIROUTE_API_KEY}`,
      },
      body: JSON.stringify({
        model: OMNIROUTE_MODEL,
        messages: [
          { role: "system", content: "You are a typing passage generator. Return ONLY JSON: {\"title\":\"...\",\"content\":\"...\"}" },
          { role: "user", content: "Generate a 30-word passage about cats." }
        ],
        temperature: 0.7,
        max_tokens: 500,
        stream: false,
      }),
    });

    const elapsed = Date.now() - startTime;
    console.log("   Response status:", res.status);
    console.log("   Time:", elapsed + "ms");

    if (!res.ok) {
      const errorText = await res.text();
      console.error("❌ Generation failed:", res.status);
      console.error("   Error:", errorText.substring(0, 500));
      process.exit(1);
    }

    const data = await res.json();
    const content = data.choices?.[0]?.message?.content;

    console.log("✅ Generation successful!");
    console.log("   Raw response:");
    console.log("   ", content?.substring(0, 200) + "...");
    console.log("");

    // Try to parse JSON
    try {
      const parsed = JSON.parse(content);
      console.log("✅ JSON parsed successfully!");
      console.log("   Title:", parsed.title);
      console.log("   Content:", parsed.content?.substring(0, 100) + "...");
    } catch {
      console.log("⚠️  Response is not valid JSON, but generation works.");
    }

  } catch (err) {
    console.error("❌ Generation failed:", err.message);
    process.exit(1);
  }

  console.log("");
  console.log("========================================");
  console.log("All tests passed! OmniRoute is working.");
  console.log("========================================");
}

testOmniRoute();
