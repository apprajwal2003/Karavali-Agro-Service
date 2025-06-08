import { connectDB } from "@/lib/mongodb";
import "@/models/category";
import { ProductsList } from "@/components";
import { Product } from "@/models/product";
import type { ProductType } from "@/types/products";

export default async function CollectionsPage() {
  await connectDB();

  // Then fetch the products
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
    rating: {
      average: product.rating?.average ?? 0,
      count: product.rating?.count ?? 0,
    },
  }));

  return <ProductsList products={products} />;
}
