import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import TypingResult from "@/models/TypingResult";

export async function GET(request: NextRequest) {
  try {
    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });

    if (!token?.sub) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const user = await User.findById(token.sub);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Get recent results to calculate weak keys/patterns
    const recentResults = await TypingResult.find({ userId: token.sub })
      .sort({ createdAt: -1 })
      .limit(10)
      .lean() as any;

    // Aggregate weak keys and patterns
    const allWeakKeys: string[] = [];
    const allWeakPatterns: string[] = [];

    // FIX: Added explicit types for 'result' so TypeScript doesn't fail the build
    recentResults.forEach((result: { weakKeys?: string[]; weakPatterns?: string[] }) => {
      allWeakKeys.push(...(result.weakKeys || []));
      allWeakPatterns.push(...(result.weakPatterns || []));
    });

    // Count frequency and get top weak areas
    const keyCounts: Record<string, number> = {};
    const patternCounts: Record<string, number> = {};

    allWeakKeys.forEach((k) => { keyCounts[k] = (keyCounts[k] || 0) + 1; });
    allWeakPatterns.forEach((p) => { patternCounts[p] = (patternCounts[p] || 0) + 1; });

    const weakKeys = Object.entries(keyCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([k]) => k);

    const weakPatterns = Object.entries(patternCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([p]) => p);

    return NextResponse.json({
      stats: {
        averageWpm: user.averageWpm || 0,
        bestWpm: user.bestWpm || 0,
        averageAccuracy: user.averageAccuracy || 0,
        testsCompleted: user.testsCompleted || 0,
        targetWpm: user.targetWpm || 60,
        targetAccuracy: user.targetAccuracy || 95,
        weakKeys,
        weakPatterns,
      }
    });

  } catch (error) {
    console.error("User stats error:", error);
    return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 });
  }
}