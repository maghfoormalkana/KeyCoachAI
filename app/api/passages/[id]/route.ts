import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Passage from "@/models/Passage";

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();

    const passage = await Passage.findByIdAndDelete(params.id);

    if (!passage) {
      return NextResponse.json({ error: "Passage not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Passage deleted" });

  } catch (error) {
    console.error("Delete passage error:", error);
    return NextResponse.json({ error: "Failed to delete passage" }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const body = await request.json();

    const passage = await Passage.findByIdAndUpdate(
      params.id,
      { ...body, updatedAt: new Date() },
      { new: true }
    );

    if (!passage) {
      return NextResponse.json({ error: "Passage not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, passage });

  } catch (error) {
    console.error("Update passage error:", error);
    return NextResponse.json({ error: "Failed to update passage" }, { status: 500 });
  }
}
