import { connectDB } from "@/lib/mongodb";
import { Category } from "@/models/category";
import { Product } from "@/models/product";
import { NextResponse } from "next/server";

//add new category
export async function PUT(
  request: Request,
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

    // Parse the request body
    const body = await request.json();

    // Check if the body contains the required fields
    if (!body.newName?.trim()) {
      return NextResponse.json(
        { error: "New name is required" },
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
      _id: { $ne: id }, // Exclude current category from the check
    });
    if (existingName) {
      return NextResponse.json(
        { error: "Category name already exists" },
        { status: 400 }
      );
    }

    //check if products with the current category exists
    const products = await Product.find({ category: id });

    // If there are products and user hasn't confirmed to update them
    if (products.length > 0 && !body.updateProducts) {
      return NextResponse.json(
        {
          error: "CONFIRM_UPDATE",
          message:
            "This category has associated products. Do you want to update all products to use the new category name?",
          productsCount: products.length,
        },
        { status: 409 }
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

    //handle update failure
    if (!updatedCategory) {
      return NextResponse.json(
        { error: "Failed to update category to database" },
        { status: 500 }
      );
    }

    // If user confirmed to update products
    if (body.updateProducts && products.length > 0) {
      await Product.updateMany(
        { category: id },
        { $set: { categoryName: body.newName.trim().toUpperCase() } }
      );

      return NextResponse.json(
        {
          message: "Category and all associated products updated successfully",
          updatedProductsCount: products.length,
        },
        { status: 200 }
      );
    }

    //successful update response (no products to update)
    return NextResponse.json(
      { message: "Category updated successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating category:", error);
    return NextResponse.json(
      { error: "Failed to update category from server" },
      { status: 500 }
    );
  }
}

//remove category
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

    //check if products with the same category exists
    const products = await Product.find({ category: id });
    if (products.length > 0) {
      return NextResponse.json(
        {
          error:
            "Remove All Products with the given categories before deletion",
        },
        { status: 409 }
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
