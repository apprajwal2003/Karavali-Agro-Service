import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Product } from "@/models/product";
import { S3Client, DeleteObjectCommand } from "@aws-sdk/client-s3";

const s3 = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    const { id } = await params;
    // Check if the id is provided
    if (!id) {
      return NextResponse.json(
        { error: "Product ID is required" },
        { status: 400 }
      );
    }
    // Check if the product exists
    const product = await Product.findById(id);
    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    // Extract S3 object key from product.image (assuming it's the full S3 URL)
    const imageUrl = product.image;
    const imageKey = new URL(imageUrl).pathname.slice(1);

    // Delete image from S3
    if (imageKey) {
      const res = await s3.send(
        new DeleteObjectCommand({
          Bucket: process.env.AWS_BUCKET_NAME!,
          Key: imageKey,
        })
      );
      if (res.$metadata.httpStatusCode !== 204) {
        console.error("Failed to delete image from S3");
        return NextResponse.json(
          { error: "Failed to delete image from S3" },
          { status: 500 }
        );
      }
    } else {
      console.error("Image key not found in product image URL");
      return NextResponse.json(
        { error: "Image key not found" },
        { status: 500 }
      );
    }

    // Delete product from DB
    const response = await Product.findByIdAndDelete(id);
    if (!response) {
      return NextResponse.json(
        { error: "Failed to delete product" },
        { status: 500 }
      );
    }

    return NextResponse.json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("Error deleting product:", error);
    return NextResponse.json(
      { error: "Failed to delete product" },
      { status: 500 }
    );
  }
}
