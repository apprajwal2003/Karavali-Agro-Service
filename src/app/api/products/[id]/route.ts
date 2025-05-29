import { NextResponse, NextRequest } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Product } from "@/models/product";
import { v4 as uuidv4 } from "uuid";

import {
  S3Client,
  DeleteObjectCommand,
  PutObjectCommand,
} from "@aws-sdk/client-s3";

const s3 = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export async function DELETE(
  request: NextRequest,
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

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { error: "Product ID is required" },
        { status: 400 }
      );
    }

    const product = await Product.findById(id);
    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    const formData = await request.formData();

    const name = formData.get("name")?.toString() || "";
    const brand = formData.get("brand")?.toString() || "";
    const category = formData.get("category")?.toString() || "";
    const price = parseFloat(formData.get("price")?.toString() || "");
    const stock = parseInt(formData.get("stock")?.toString() || "");
    const description = formData.get("description")?.toString() || "";
    const imageFile = formData.get("image") as File | null;

    if (!name || !brand || !category || isNaN(price) || isNaN(stock)) {
      return NextResponse.json({
        error: "All fields except image and description are mandatory",
      });
    }

    let imageUrl = product.image;
    let uploadedImageKey = "";

    // 1. Upload new image to S3 if provided
    if (imageFile && imageFile.size > 0) {
      try {
        const arrayBuffer = await imageFile.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        const extension = imageFile.type.split("/")[1];
        uploadedImageKey = `products/${uuidv4()}.${extension}`;

        await s3.send(
          new PutObjectCommand({
            Bucket: process.env.AWS_BUCKET_NAME!,
            Key: uploadedImageKey,
            Body: buffer,
            ContentType: imageFile.type,
          })
        );

        imageUrl = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${uploadedImageKey}`;
      } catch (err) {
        return NextResponse.json(
          { error: "Image upload to AWS S3 failed" },
          { status: 500 }
        );
      }
    }

    // 2. Update product fields
    const oldImageUrl = product.image;

    product.name = name;
    product.brand = brand;
    product.category = category;
    product.price = price;
    product.stock = stock;
    product.description = description;
    product.image = imageUrl;

    const savedProduct = await product.save();

    if (!savedProduct) {
      // Rollback uploaded image if DB save fails
      if (uploadedImageKey) {
        await s3.send(
          new DeleteObjectCommand({
            Bucket: process.env.AWS_BUCKET_NAME!,
            Key: uploadedImageKey,
          })
        );
      }
      return NextResponse.json(
        { error: "Failed to update product in database" },
        { status: 500 }
      );
    }

    // 3. Delete old image only after DB update is successful
    if (imageFile && oldImageUrl) {
      try {
        const oldKey = new URL(oldImageUrl).pathname.slice(1);
        await s3.send(
          new DeleteObjectCommand({
            Bucket: process.env.AWS_BUCKET_NAME!,
            Key: oldKey,
          })
        );
      } catch (err) {
        console.warn(
          "Warning: Old image deletion failed. Manual cleanup may be required."
        );
      }
    }

    return NextResponse.json(savedProduct, { status: 200 });
  } catch (error) {
    console.error("Error editing product:", error);
    return NextResponse.json(
      { error: "Unexpected server error while editing product" },
      { status: 500 }
    );
  }
}
