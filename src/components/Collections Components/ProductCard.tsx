"use client";

import type { ProductType } from "@/types/products";

interface ProductCardProps {
  product: ProductType;
}

export default function ProductCard({ product }: ProductCardProps) {
  const renderStars = (average: number) => {
    const fullStars = Math.floor(average);
    const halfStar = average % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

    return (
      <div className="text-yellow-500 flex items-center text-xs sm:text-sm">
        {"★".repeat(fullStars)}
        {halfStar && "☆"}
        {"☆".repeat(emptyStars)}
      </div>
    );
  };

  return (
    <div className="p-2 sm:p-4 rounded-xl shadow-md hover:shadow-2xl transition-shadow duration-200 bg-white h-full">
      <img
        src={product.image}
        alt={product.name}
        className="w-full h-32 sm:h-40 object-cover mb-2 rounded"
      />
      <h2 className="text-sm sm:text-lg font-semibold break-words">
        {product.name}
      </h2>
      <p className="text-xs sm:text-sm text-gray-600">{product.brand}</p>
      <p className="text-green-700 font-bold text-sm sm:text-base">
        ₹{product.price}
      </p>
      <div className="mt-1 text-xs sm:text-sm flex items-center gap-1">
        {renderStars(product.rating.average)}
        <span className="text-gray-500">({product.rating.count})</span>
      </div>
    </div>
  );
}
