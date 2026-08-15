import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import connectDB from "@/lib/mongodb";
import TypingResult from "@/models/TypingResult";
import User from "@/models/User";

const resultSchema = z.object({
  userId: z.string().optional(),
  wpm: z.number().min(0).max(300),
  accuracy: z.number().min(0).max(100),
  errors: z.number().min(0),
  backspaces: z.number().min(0),
  duration: z.number().min(1),
  weakKeys: z.array(z.string()),
  weakPatterns: z.array(z.string()),
  punctuationAccuracy: z.number().min(0).max(100),
  difficulty: z.enum(["easy", "medium", "hard"]).default("medium"),
});

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();
    const validatedData = resultSchema.parse(body);

    // Save the typing result
    const result = await TypingResult.create(validatedData);

    // If user is logged in, update their profile stats
    if (validatedData.userId) {
      const user = await User.findById(validatedData.userId);
      if (user) {
        const totalTests = user.testsCompleted + 1;
        const newAvgWpm = ((user.averageWpm * user.testsCompleted) + validatedData.wpm) / totalTests;
        const newAvgAcc = ((user.averageAccuracy * user.testsCompleted) + validatedData.accuracy) / totalTests;

        await User.findByIdAndUpdate(validatedData.userId, {
          testsCompleted: totalTests,
          averageWpm: Math.round(newAvgWpm * 10) / 10,
          averageAccuracy: Math.round(newAvgAcc * 10) / 10,
          bestWpm: Math.max(user.bestWpm, validatedData.wpm),
        });
      }
    }

    return NextResponse.json({
      success: true,
      result: {
        id: result._id,
        wpm: result.wpm,
        accuracy: result.accuracy,
        createdAt: result.createdAt,
      },
    }, { status: 201 });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid result data", details: error.errors },
        { status: 400 }
      );
    }

    console.error("Save result error:", error);
    return NextResponse.json(
      { error: "Failed to save result" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    const limit = parseInt(searchParams.get("limit") || "10");

    const query = userId ? { userId } : {};
    const results = await TypingResult.find(query)
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean() as any;

    return NextResponse.json({ results }, { status: 200 });

  } catch (error) {
    console.error("Get results error:", error);
    return NextResponse.json(
      { error: "Failed to fetch results" },
      { status: 500 }
    );
  }
}
