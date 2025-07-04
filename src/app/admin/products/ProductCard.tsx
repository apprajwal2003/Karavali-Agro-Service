"use client";

import { useState } from "react";
import Image from "next/image";
import EditButton from "./EditButton";
import DeleteButton from "./DeleteButton";
import ReadMoreWrapper from "./ReadMoreWrapper";
import type { ProductType } from "@/types/products";

export default function ProductCard({ product }: { product: ProductType }) {
  const [expand, setExpand] = useState(false);

  return (
    <div
      className={`flex flex-col justify-between p-4 mb-4 rounded-xl backdrop-blur-xl bg-white/10 border border-white/30 shadow-md text-white w-full
        transition-[max-height] duration-500 ease-in-out`}
    >
      <div className="flex flex-col md:grid md:grid-cols-4 gap-4 md:divide-x md:divide-gray-300">
        {/* Product Image */}
        <div className="md:row-span-2 md:border-r border-gray-300 flex justify-center items-center">
          <Image
            src={product.image}
            alt={product.name}
            width={150}
            height={150}
            className="object-contain rounded-xl"
          />
        </div>

        {/* Basic Info */}
        <div className="px-2">
          <strong>Name:</strong> {product.name}
        </div>
        <div className="px-2">
          <strong>Brand:</strong> {product.brand}
        </div>
        <div className="px-2">
          <strong>Category:</strong> {product.category?.name || "N/A"}
        </div>

        {/* Price, Stock, Rating */}
        <div className="px-2 flex flex-col justify-around">
          <div>
            <strong>Price:</strong> ₹{product.price}
          </div>
          <div>
            <strong>Stock:</strong> {product.stock}
          </div>
          <div className="flex items-center gap-1 mt-1">
            <strong>Rating:</strong>
            <span className="text-yellow-400">
              {"★".repeat(Math.floor(product.rating?.average ?? 0))}
              {"☆".repeat(5 - Math.floor(product.rating?.average ?? 0))}
            </span>
            <span className="text-xs text-gray-300">
              ({product.rating?.count ?? 0})
            </span>
          </div>
        </div>

        {/* Description */}
        <div className="col-span-2">
          <ReadMoreWrapper
            text={product.description}
            expand={expand}
            setExpand={setExpand}
          />
        </div>
      </div>

      {/* Action Buttons */}
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
  );
}
