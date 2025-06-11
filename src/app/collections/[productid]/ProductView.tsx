"use client";

import Image from "next/image";
import { useState } from "react";
import type { ProductType } from "@/types/products";

export default function ProductView({ product }: { product: ProductType }) {
  const [quantity, setQuantity] = useState(1);

  return (
    <div className="flex flex-col md:flex-row gap-6 p-4 md:p-8 max-w-7xl mx-auto">
      {/* Left: Product Image */}
      <div className="flex-1 w-full md:w-1/2 flex items-center justify-center">
        <Image
          src={product.image}
          alt={product.name}
          width={500}
          height={500}
          className="object-contain max-h-[500px] w-full rounded-md border"
          unoptimized
        />
      </div>

      {/* Right: Product Details */}
      <div className="flex-1 w-full md:w-1/2 max-h-screen overflow-y-auto pr-2">
        <h1 className="text-3xl font-semibold mb-2">{product.name}</h1>

        <p className="text-lg text-gray-600 mb-4">{product.description}</p>

        <div className="text-xl font-bold text-green-600 mb-2">
          ₹{product.price}
        </div>

        {/* Stock info */}
        <div className="mb-4">
          {product.stock > 0 ? (
            <span className="text-green-600">In Stock</span>
          ) : (
            <span className="text-red-500">Out of Stock</span>
          )}
        </div>

        {/* Quantity Selector */}
        <div className="flex items-center gap-2 mb-6">
          <span className="font-medium">Quantity:</span>
          <input
            type="number"
            value={quantity}
            min={1}
            max={product.stock || 10}
            onChange={(e) => setQuantity(Number(e.target.value))}
            className="w-16 border rounded px-2 py-1"
          />
        </div>

        {/* Add to Cart Button */}
        <button
          disabled={!(product.stock > 0)}
          className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold py-2 px-4 rounded shadow disabled:bg-gray-300"
        >
          Add to Cart
        </button>

        {/* Additional Info */}
        <div className="mt-8 text-sm text-gray-700 leading-6 space-y-2">
          <p>
            <strong>Category:</strong> {product.category?.name || "General"}
          </p>
          <p>
            <strong>Brand:</strong> {product.brand || "N/A"}
          </p>
          <p>
            <strong>Return Policy:</strong> 7-day return policy available.
          </p>
          {/* Add more details if needed */}
        </div>
      </div>
    </div>
  );
}
