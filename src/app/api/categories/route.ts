import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Category } from "@/models/category";

// GET: Fetch all categories (for dropdown)
export async function GET() {
  try {
    await connectDB();

    const categories = await Category.find({}, { name: 1 }); // only _id and name
    return NextResponse.json(categories, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch categories" },
      { status: 500 }
    );
  }
}

// POST: Add a new category
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

    // Check if category exists (case-insensitive)
    const existingCategory = await Category.findOne({
      name: name.trim().toUpperCase(),
    });

    if (existingCategory) {
      return NextResponse.json(
        { error: "Category already exists" },
        { status: 409 }
      );
    }

    const newCategory = new Category({
      name: name.trim().toUpperCase(),
    });

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
