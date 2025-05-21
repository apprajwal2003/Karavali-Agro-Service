"use client";
import { Suspense, useState } from "react";
import Image from "next/image";

export default function AddProductWrapperModal() {
  const [showModal, setShowModal] = useState(false);

  const handleModalToggle = () => {
    setShowModal(!showModal);
  };

  return (
    <>
      {/* Trigger Button */}
      <div
        className="bg-green-500 custom-button hover:bg-green-800 text-white"
        onClick={handleModalToggle}
      >
        + Add Product
      </div>

      {/* Modal Overlay */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-md">
          <div className="bg-white rounded-lg shadow-lg p-6 w-auto relative">
            {/* Close Button */}
            <button
              onClick={handleModalToggle}
              className="absolute top-2 right-3 px-2 rounded-lg transition-all duration-500 text-gray-500 hover:text-white hover:bg-red-600 text-4xl"
            >
              &times;
            </button>

            {/* Modal Content */}
            <h2 className="text-2xl font-semibold mb-4">Product Details</h2>
            <div className="grid grid-cols-4 grid-rows-8 gap-4">
              <div className="relative row-span-4 col-span-2 w-full h-full">
                <Image
                  src="/fert.png"
                  alt="product image"
                  fill
                  className="object-contain"
                />
              </div>
              <div className="text-center text-gray-700 col-span-2 row-span-5 flex flex-col justify-around">
                <div className="flex items-center gap-2">
                  <label htmlFor="name" className="min-w-[80px]">
                    Name:
                  </label>
                  <input id="name" type="text" className="input-box" />
                </div>

                <div className="flex items-center gap-2">
                  <label htmlFor="brand" className="min-w-[80px]">
                    Brand:
                  </label>
                  <input id="brand" type="text" className="input-box" />
                </div>

                <div className="flex items-center gap-2">
                  <label htmlFor="category" className="min-w-[80px]">
                    Category:
                  </label>
                  <input id="category" type="text" className="input-box" />
                </div>

                <div className="flex items-center gap-2">
                  <label htmlFor="price" className="min-w-[80px]">
                    Price:
                  </label>
                  <input id="price" type="number" className="input-box" />
                </div>

                <div className="flex items-center gap-2">
                  <label htmlFor="stock" className="min-w-[80px]">
                    Stock:
                  </label>
                  <input id="stock" type="number" className="input-box" />
                </div>
              </div>
              <div className="col-span-2 flex items-center justify-center">
                <div>+ Add Image</div>
              </div>
              <div className="row-span-2 col-span-full">
                <div>Description</div>
                <textarea
                  className="w-full h-24 p-2 border border-gray-300 rounded-lg"
                  placeholder="Enter product description"
                ></textarea>
              </div>
              <div className="flex items-center justify-end gap-4 col-span-full">
                <button className="custom-button hover:bg-red-600">
                  Cancel
                </button>
                <button className="custom-button hover:bg-green-600">
                  Add Product
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
