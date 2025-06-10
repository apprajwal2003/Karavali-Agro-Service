"use client";

import { useState, useEffect } from "react";
import type { ProductType } from "@/types/products";
import { useFilter } from "@/context/FilterContext";
import ProductCard from "./ProductCard";

interface ProductProps {
  products: ProductType[];
}

export default function Product({ products }: ProductProps) {
  const [filteredProducts, setFilteredProducts] = useState(products);
  const { search, selectedCategory } = useFilter();

  useEffect(() => {
    const filtered = products.filter((product) => {
      const matchesSearch =
        product.name.toLowerCase().includes(search.toLowerCase()) ||
        product.category?.name.toLowerCase().includes(search.toLowerCase());

      const matchesCategory =
        !selectedCategory ||
        product.category?.name.toLowerCase() === selectedCategory.toLowerCase();

      return matchesSearch && matchesCategory;
    });
    setFilteredProducts(filtered);
  }, [search, selectedCategory, products]);

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">All Products</h1>

      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-5 gap-4 overflow-auto">
        {filteredProducts.length === 0 && (
          <p className="text-center col-span-full">No products found</p>
        )}
        {filteredProducts.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    </div>
  );
}
