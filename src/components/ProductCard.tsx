"use client";
import { useState, useEffect } from "react";
import type { ProductType } from "@/types/products";

export default function Product({ products }: { products: ProductType[] }) {
  const [search, setSearch] = useState("");
  const [filteredProducts, setFilteredProducts] = useState(products);

  useEffect(() => {
    const filtered = products.filter((product) =>
      product.name.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredProducts(filtered);
  }, [search, products]);

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">All Products</h1>
      <input
        type="text"
        placeholder="Search products..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="mb-4 p-2 border rounded w-full"
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {filteredProducts.map((product) => (
          <div key={product._id} className="border p-4 rounded shadow">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-40 object-cover mb-2"
            />
            <h2 className="text-lg font-semibold">{product.name}</h2>
            <p className="text-sm text-gray-600">{product.brand}</p>
            <p className="text-green-700 font-bold">₹{product.price}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
