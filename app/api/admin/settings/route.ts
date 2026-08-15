import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import connectDB from "@/lib/mongodb";
import Settings from "@/models/Settings";

/**
 * GET /api/admin/settings
 * Returns AI settings (API key is MASKED for security)
 */
export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const settingsDoc = await Settings.findOne().sort({ createdAt: -1 }).lean();
    const settings = settingsDoc as any;

    if (!settings) {
      // Return defaults from env
      return NextResponse.json({
        omnirouteBaseUrl: process.env.OMNIROUTE_BASE_URL || "http://192.168.1.7:20128/v1",
        omnirouteApiKey: process.env.OMNIROUTE_API_KEY ? "••••••••••••" : "",
        omnirouteModel: process.env.OMNIROUTE_MODEL || "gpt-4o-mini",
        isConfigured: !!process.env.OMNIROUTE_API_KEY,
        lastTested: null,
        testStatus: "untested",
      });
    }

    // Mask the API key — never send full key to client
    const maskedKey = settings.omnirouteApiKey 
      ? "••••••••" + settings.omnirouteApiKey.slice(-4) 
      : "";

    return NextResponse.json({
      omnirouteBaseUrl: settings.omnirouteBaseUrl,
      omnirouteApiKey: maskedKey,
      omnirouteModel: settings.omnirouteModel,
      isConfigured: settings.isConfigured,
      lastTested: settings.lastTested,
      testStatus: settings.testStatus,
    });

  } catch (error) {
    console.error("Get settings error:", error);
    return NextResponse.json({ error: "Failed to fetch settings" }, { status: 500 });
  }
}

const settingsSchema = z.object({
  omnirouteBaseUrl: z.string().url(),
  omnirouteApiKey: z.string().min(1, "API key is required"),
  omnirouteModel: z.string().min(1, "Model is required"),
});

/**
 * POST /api/admin/settings
 * Save AI settings to database
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validated = settingsSchema.parse(body);

    await connectDB();

    // Upsert settings
    const settingsDoc = await Settings.findOneAndUpdate(
      {},
      {
        omnirouteBaseUrl: validated.omnirouteBaseUrl,
        omnirouteApiKey: validated.omnirouteApiKey,
        omnirouteModel: validated.omnirouteModel,
        isConfigured: true,
      },
      { upsert: true, new: true }
    );

        const savedSettings = settingsDoc as any;

    return NextResponse.json({
      success: true,
      message: "Settings saved successfully",
      settings: {
        omnirouteBaseUrl: savedSettings.omnirouteBaseUrl,
        omnirouteModel: savedSettings.omnirouteModel,
        isConfigured: savedSettings.isConfigured,
      },
    });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid settings", details: error.errors },
        { status: 400 }
      );
    }

    console.error("Save settings error:", error);
    return NextResponse.json({ error: "Failed to save settings" }, { status: 500 });
  }
}
