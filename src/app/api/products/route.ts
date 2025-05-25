import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Product } from "@/models/product";

export async function POST(req: NextRequest) {
  try {
    await connectDB(); // Connect to MongoDB

    const body = await req.json();
    const {
      name,
      brand,
      category, // should be an ObjectId as string
      price,
      stock,
      description,
      imageBase64, // expected to be base64 string like "data:image/png;base64,..."
    } = body;

    if (!name || !brand || !category || !price || !stock || !imageBase64) {
      return NextResponse.json(
        {
          error:
            "All fields are required (name, brand, category, price, stock, image)",
        },
        { status: 400 }
      );
    }

    const imageBuffer = Buffer.from(imageBase64.split(",")[1], "base64");

    const newProduct = await Product.create({
      name,
      brand,
      category,
      price,
      stock,
      description,
      image: imageBuffer,
    });

    return NextResponse.json(newProduct, { status: 201 });
  } catch (error: any) {
    console.error("Error saving product:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
