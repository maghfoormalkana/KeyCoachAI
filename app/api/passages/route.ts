import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Passage from "@/models/Passage";

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const difficulty = searchParams.get("difficulty");
    const limit = parseInt(searchParams.get("limit") || "50");

    const query: any = { isActive: true };

    if (category && category !== "all") query.category = category;
    if (difficulty && difficulty !== "all") query.difficulty = difficulty;

    const passages = await Passage.find(query)
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();

    return NextResponse.json({ passages }, { status: 200 });

  } catch (error) {
    console.error("Get passages error:", error);
    return NextResponse.json({ error: "Failed to fetch passages" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const body = await request.json();
    const passage = await Passage.create(body);
    return NextResponse.json({ success: true, passage }, { status: 201 });
  } catch (error) {
    console.error("Create passage error:", error);
    return NextResponse.json({ error: "Failed to create passage" }, { status: 500 });
  }
}
