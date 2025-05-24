import { connectDB } from "@/lib/mongodb";
import { Category } from "@/models/category";
import { read } from "fs";
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

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string; newName: String }> }
) {
  try {
    await connectDB();
    //extract the id from params
    const { id } = await params;
    // Parse the request body
    const body = await req.json();
    // Check if the body contains the required fields
    console.log(body.newName);
    if (!body.newName.trim()) {
      return NextResponse.json(
        { error: "Name and description are required" },
        { status: 400 }
      );
    }
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
    // Check if the new name is already taken
    const existingName = await Category.findOne({
      name: body.newName.trim().toUpperCase(),
    });
    if (existingName && existingName._id.toString() !== id) {
      return NextResponse.json(
        { error: "Category name already exists" },
        { status: 400 }
      );
    }

    // Check if the new name is the same as the old name
    if (
      existingCategory.name.trim().toUpperCase() ===
      body.newName.trim().toUpperCase()
    ) {
      return NextResponse.json(
        { error: "New name is the same as the old name" },
        { status: 400 }
      );
    }

    // Update the category
    const updatedCategory = await Category.findByIdAndUpdate(
      id,
      {
        name: body.newName.trim().toUpperCase(),
      },
      { new: true } // Return the updated document
    );

    if (!updatedCategory) {
      return NextResponse.json(
        { error: "Failed to update category" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: "Category updated successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating category:", error);
    return NextResponse.json(
      { error: "Failed to update category" },
      { status: 500 }
    );
  }
}
