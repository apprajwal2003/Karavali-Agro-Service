import { connectDB } from "@/lib/mongodb";
import { Product } from "@/models/product";
import ProductView from "./ProductView";

export async function generateStaticParams() {
  await connectDB();
  // Fetch all product IDs to generate static paths
  return Product.find({}, "_id").then((products) =>
    products.map((product) => ({
      productid: product._id.toString(),
    }))
  );
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ productid: string }>;
}) {
  await connectDB();
  const { productid } = await params;

  const product = await Product.findById(productid).populate("category");

  if (!product) return <div>Product not found</div>;

  const plainProduct = {
    ...product.toObject(),
    _id: product._id.toString(),
    category:
      product.category && typeof product.category === "object"
        ? {
            ...product.category.toObject?.(),
            _id: product.category._id?.toString(),
          }
        : null,
  };

  return <ProductView product={plainProduct} />;
}
