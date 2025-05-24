import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Category } from "@/models/category"; // You can move your model to /models for reuse

export async function POST(request: Request) {
  try {
    await connectDB();

    const data = await request.json();
    const { name } = data;

    if (!name || name.trim() === "") {
      return NextResponse.json(
        { error: "Category name is required" },
        { status: 400 }
      );
    }

    // Check if the category already exists
    const existingCategory = await Category.findOne({
      name: name.trim().toUpperCase(),
    });
    if (existingCategory) {
      return NextResponse.json(
        { error: "Category already exists" },
        { status: 409 }
      );
    }

    const newCategory = new Category({ name: name.trim().toUpperCase() });
    await newCategory.save();

    return NextResponse.json(
      { message: "Category added successfully" },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to add category" },
      { status: 500 }
    );
  }
}
