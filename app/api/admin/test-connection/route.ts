import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { testOmniRouteConnection } from "@/lib/omniroute";
import connectDB from "@/lib/mongodb";
import Settings from "@/models/Settings";

const testSchema = z.object({
  omnirouteBaseUrl: z.string().url(),
  omnirouteApiKey: z.string().min(1),
  omnirouteModel: z.string().min(1),
});

/**
 * POST /api/admin/test-connection
 * Test OmniRoute connection without saving
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validated = testSchema.parse(body);

    // Test the connection
    const result = await testOmniRouteConnection(
      validated.omnirouteBaseUrl,
      validated.omnirouteApiKey,
      validated.omnirouteModel
    );

    // Update last tested status in DB if settings exist
    try {
      await connectDB();
      await settingsDoc.findOneAndUpdate(
        {},
        {
          lastTested: new Date(),
          testStatus: result.success ? "success" : "failed",
        },
        { upsert: false }
      );
      const settings = settingsDoc as any;
    } catch {
      // Ignore DB errors for test connection
    }

    return NextResponse.json(result, { status: result.success ? 200 : 400 });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, message: "Invalid configuration", details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, message: `Test failed: ${(error as Error).message}` },
      { status: 500 }
    );
  }
}
