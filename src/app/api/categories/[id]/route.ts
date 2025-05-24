import { connectDB } from "@/lib/mongodb";
import { Category } from "@/models/category";
import { NextResponse } from "next/server";

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    //extract the id from params
    const { id } = await params;
    // Check if the id is provided
    if (!id) {
      return NextResponse.json(
        { error: "Category ID is required" },
        { status: 400 }
      );
    }
    // Check if the category exists
    const existingCategory = await Category.findById(id);
    if (!existingCategory) {
      return NextResponse.json(
        { error: "Category not found" },
        { status: 404 }
      );
    }
    // Delete the category
    const response = await Category.findByIdAndDelete(id);
    if (!response) {
      return NextResponse.json(
        { error: "Failed to delete category" },
        { status: 500 }
      );
    }
    return NextResponse.json(
      { message: "Category deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting category:", error);
    return NextResponse.json(
      { error: "Failed to del category" },
      { status: 500 }
    );
  }
}
