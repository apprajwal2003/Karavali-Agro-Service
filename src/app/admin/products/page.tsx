import { AddProductWrapperModal, AdminSearchBar } from "@/components";
import Link from "next/link";
import products from "@/data/products";
import { Product } from "@/types/products";
import { Suspense } from "react";

export default async function AdminProductsPage() {
  return (
    <div className="flex flex-col ">
      <div className="flex items-center justify-between bg-white h-22 w-full px-20 py-4 sticky top-22 z-10">
        <div className="text-2xl font-bold">Products</div>
        <div className="flex items-center gap-4">
          <AdminSearchBar />
          <AddProductWrapperModal />
        </div>
      </div>
      <div className="overflow-auto px-20 py-4 grid grid-cols-2 gap-4 bg-gradient-to-br from-gray-800 to-gray-900">
        {products.map((product: Product) => (
          <div
            key={product.productId}
            className="flex flex-col justify-between p-4 mb-4 rounded-xl backdrop-blur-xl bg-white/10 border border-white/30 shadow-md text-white"
          >
            <div className="grid grid-cols-4 gap-4 divide-x divide-gray-300">
              <div className="row-span-2 border-r border-gray-300">
                <img src="/fert.png" alt="fert.png" className="w-50 h-auto" />
              </div>
              <div className="px-2 border-r border-gray-300">
                <strong>Name:</strong> {product.name}
              </div>
              <div className="px-2 border-r border-gray-300">
                <strong>Brand:</strong> {product.brand}
              </div>
              <div className="px-2">
                <strong>Category:</strong> {product.category}
              </div>
              <div className="px-2 border-r border-gray-300">
                <strong>Price:</strong> ₹{product.price}
              </div>
              <div className="px-2 border-r border-gray-300">
                <strong>Stock:</strong> {product.stock}
              </div>
              <div className="px-2">
                <strong>Description:</strong> {product.description}
              </div>
            </div>

            {/* Edit/Delete buttons */}
            <div className="flex justify-end gap-2 mt-4">
              <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                Edit
              </button>
              <button className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
