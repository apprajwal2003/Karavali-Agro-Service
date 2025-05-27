import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Product } from "@/models/product";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { v4 as uuidv4 } from "uuid";

const s3 = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export async function GET() {
  try {
    await connectDB();

    // Fetch all products and populate category name
    const products = await Product.find({})
      .populate("category", "name") // Only get category name
      .lean();

    return NextResponse.json(products, { status: 200 });
  } catch (error) {
    console.error("Failed to fetch products", error);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const formData = await req.formData();

    const name = formData.get("name")?.toString() || "";
    const brand = formData.get("brand")?.toString() || "";
    const category = formData.get("category")?.toString() || "";
    const price = parseFloat(formData.get("price")?.toString() || "");
    const stock = parseInt(formData.get("stock")?.toString() || "");
    const description = formData.get("description")?.toString() || "";
    const imageFile = formData.get("image") as File | null;

    if (!name || !brand || !category || !price || !stock || !imageFile) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    // Convert image file to buffer
    const arrayBuffer = await imageFile.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Get file extension from MIME type
    const extension = imageFile.type.split("/")[1];
    const filename = `products/${uuidv4()}.${extension}`;

    const uploadParams = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: filename,
      Body: buffer,
      ContentType: imageFile.type,
    };

    await s3.send(new PutObjectCommand(uploadParams));

    // Build public URL
    const imageUrl = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${filename}`;

    // Save product with imageUrl
    const newProduct = await Product.create({
      name,
      brand,
      category,
      price,
      stock,
      description,
      image: imageUrl,
    });

    return NextResponse.json(newProduct, { status: 201 });
  } catch (err) {
    console.error("Error uploading product/image:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
