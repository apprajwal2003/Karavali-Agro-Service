import ProductSearchBar from "./ProductSearchBar";
import AddProductWrapperModal from "./AddProductWrapperModal";
import { connectDB } from "@/lib/mongodb";
import ProductCard from "./ProductCard";
import { Product } from "@/models/product";
import "@/models/category";
import type { ProductType } from "@/types/products";

export const revalidate = 0;

export default async function AdminProductsPage() {
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
    rating: product.rating,
    category: product.category
      ? {
          _id: product.category._id.toString(),
          name: product.category.name,
        }
      : undefined,
  }));

  return (
    <div className="flex flex-col">
      <div className="flex flex-wrap items-center justify-between bg-white h-auto w-full px-4 md:px-20 py-4 sticky top-18 z-45 gap-2">
        <div className="hidden md:block text-2xl font-bold">Products</div>
        <div className="flex items-center gap-2 flex-1 justify-end">
          <ProductSearchBar />
          <AddProductWrapperModal />
        </div>
      </div>

      <div className="min-h-screen overflow-auto px-4 md:px-20 py-4 pt-24 grid grid-cols-1 md:grid-cols-2 gap-6 bg-gradient-to-br from-gray-800 to-gray-900">
        {products.map((product) => (
          <ProductCard key={product._id.toString()} product={product} />
        ))}
      </div>
    </div>
  );
}
