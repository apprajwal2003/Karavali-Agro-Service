import { AdminSearchBar } from "@/components";
import AddProductWrapperModal from "./AddProductWrapperModal";
import DeleteButton from "./DeleteButton";
import { connectDB } from "@/lib/mongodb";
import Image from "next/image";
import EditButton from "./EditButton";
import ReadMoreWrapper from "./ReadMoreWrapper";

export const revalidate = 0;

interface CategoryType {
  _id: string;
  name: string;
}

interface ProductType {
  _id: string;
  name: string;
  brand: string;
  image: string;
  price: number;
  stock: number;
  description: string;
  category?: CategoryType;
}

export default async function AdminProductsPage() {
  await connectDB();
  const { Product } = await import("@/models/product");
  const { Category } = await import("@/models/category"); // Ensure Category is imported for type safety
  void Category; // Prevent unused import warning

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

  return (
    <div className="flex flex-col">
      <div className="flex items-center justify-between bg-white h-22 w-full px-20 py-4 sticky top-22 z-10">
        <div className="text-2xl font-bold">Products</div>
        <div className="flex items-center gap-4">
          <AdminSearchBar />
          <AddProductWrapperModal />
        </div>
      </div>

      <div className="overflow-auto px-20 py-4 grid grid-cols-1 md:grid-cols-2 gap-4 bg-gradient-to-br from-gray-800 to-gray-900">
        {products.map((product) => (
          <div
            key={product._id}
            className="flex flex-col justify-between p-4 mb-4 rounded-xl backdrop-blur-xl bg-white/10 border border-white/30 shadow-md text-white transition-all duration-300 ease-in-out min-h-[260px]"
          >
            <div className="grid grid-cols-4 gap-4 divide-x divide-gray-300">
              <div className="row-span-2 border-r border-gray-300 ">
                <Image
                  src={product.image}
                  alt={product.name}
                  width={150}
                  height={150}
                  className="object-contain rounded-xl"
                />
              </div>

              <div className="px-2 border-r border-gray-300">
                <strong>Name:</strong> {product.name}
              </div>
              <div className="px-2 border-r border-gray-300">
                <strong>Brand:</strong> {product.brand}
              </div>
              <div className="px-2">
                <strong>Category:</strong> {product.category?.name || "N/A"}
              </div>
              <div className="flex flex-col justify-around px-2 border-r border-gray-300">
                <div>
                  <strong>Price:</strong> ₹{product.price}
                </div>
                <div>
                  <strong>Stock:</strong> {product.stock}
                </div>
              </div>
              <div className="col-span-2">
                <ReadMoreWrapper text={product.description} />
              </div>
            </div>

            <div className="flex justify-end gap-2 mt-4">
              <EditButton
                id={product._id}
                name={product.name}
                brand={product.brand}
                stock={product.stock}
                description={product.description}
                category={product.category?._id || ""}
                image={product.image}
                price={product.price}
              />
              <DeleteButton id={product._id} name={product.name} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
