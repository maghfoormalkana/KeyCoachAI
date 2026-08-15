import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Passage from "@/models/Passage";

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const categories = await Passage.distinct("category", { isActive: true });

    // Get count for each category
    const categoryStats = await Promise.all(
      categories.map(async (cat) => {
        const count = await Passage.countDocuments({ category: cat, isActive: true });
        return { name: cat, count };
      })
    );

    return NextResponse.json({ categories: categoryStats }, { status: 200 });

  } catch (error) {
    console.error("Get categories error:", error);
    return NextResponse.json({ error: "Failed to fetch categories" }, { status: 500 });
  }
}
