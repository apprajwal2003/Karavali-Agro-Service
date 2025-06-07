import { connectDB } from "@/lib/mongodb";
// Needed for Mongoose model registration
import "@/models/category";
import ProductCard from "../../components/ProductCard";
import { Product } from "@/models/product";
import type { ProductType } from "@/types/products";

export default async function CollectionsPage() {
  await connectDB();
  const rawProducts = await Product.find({}).populate("category");

  const products: ProductType[] = rawProducts.map((product) => ({
    _id: product._id.toString(),
    name: product.name,
    brand: product.brand,
    image: product.image,
    price: product.price,
    stock: product.stock,
    description: product.description,
    category: product.category
      ? {
          _id: product.category._id.toString(),
          name: product.category.name,
        }
      : undefined,
  }));

  return <ProductCard products={products} />;
}
