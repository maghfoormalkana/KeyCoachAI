import Settings from "@/models/Settings";
import connectDB from "@/lib/mongodb";

interface OmniRouteConfig {
  baseUrl: string;
  apiKey: string;
  model: string;
}

export async function getOmniRouteConfig(): Promise<OmniRouteConfig> {
  const envBaseUrl = process.env.OMNIROUTE_BASE_URL;
  const envApiKey = process.env.OMNIROUTE_API_KEY;
  const envModel = process.env.OMNIROUTE_MODEL;

  if (envBaseUrl && envApiKey && envModel) {
    return {
      baseUrl: envBaseUrl,
      apiKey: envApiKey,
      model: envModel,
    };
  }

  try {
    await connectDB();
    // ✅ FIX: Added "as any" to bypass strict Mongoose type checking
    const settings = await Settings.findOne().sort({ createdAt: -1 }).lean() as any;
    
    if (settings && settings.omnirouteApiKey) {
      return {
        baseUrl: settings.omnirouteBaseUrl || envBaseUrl || "http://localhost:20128/v1",
        apiKey: settings.omnirouteApiKey,
        model: settings.omnirouteModel || envModel || "auto",
      };
    }
  } catch {
    // fallback
  }

  return {
    baseUrl: envBaseUrl || "http://localhost:20128/v1",
    apiKey: envApiKey || "",
    model: envModel || "auto",
  };
}

export async function sendToOmniRoute(
  messages: Array<{ role: string; content: string }>,
  temperature: number = 0.7,
  maxTokens: number = 150
) {
  const config = await getOmniRouteConfig();

  if (!config.apiKey || config.apiKey.length < 10) {
    throw new Error("OmniRoute API key not configured.");
  }

  const url = config.baseUrl.endsWith("/v1")
    ? `${config.baseUrl}/chat/completions`
    : `${config.baseUrl}/v1/chat/completions`;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${config.apiKey}`,
    },
    body: JSON.stringify({
      model: config.model,
      messages,
      stream: false,
      temperature,
      max_tokens: maxTokens,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`OmniRoute HTTP ${response.status}: ${errorText}`);
  }

  return await response.json();
}

export async function testOmniRouteConnection(
  baseUrl: string,
  apiKey: string,
  model: string
) {
  if (!apiKey || apiKey.length < 10) {
    throw new Error("API key is missing or invalid.");
  }

  const url = baseUrl.endsWith("/v1")
    ? `${baseUrl}/chat/completions`
    : `${baseUrl}/v1/chat/completions`;

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: model,
        messages: [{ role: "user", content: "Ping. Reply with exactly 'Pong'." }],
        stream: false,
        temperature: 0.1,
        max_tokens: 10,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`OmniRoute HTTP ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    
    return { 
      success: true, 
      message: "Connection successful!", 
      data 
    };
  } catch (error: any) {
    console.error("OmniRoute connection test failed:", error);
    throw new Error(`Connection test failed: ${error.message}`);
  }
}