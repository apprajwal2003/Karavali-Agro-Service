"use client";
import { useState } from "react";

export default function AddProductWrapperModal() {
  const [showModal, setShowModal] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [name, setName] = useState("");
  const [brand, setBrand] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState<number | null>(null);
  const [stock, setStock] = useState<number | null>(null);
  const [description, setDescription] = useState("");

  const handleModalToggle = () => {
    if (showModal) {
      setName("");
      setBrand("");
      setCategory("");
      setPrice(null);
      setStock(null);
      setDescription("");
      setImagePreview(null);
      setImageFile(null);
      setError("");
      setLoading(false);
    }
    setShowModal(!showModal);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) {
      setImageFile(null);
      setImagePreview(null);
      return;
    }
    setError("");
    setLoading(false);
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async () => {
    if (
      !name.trim() ||
      !brand.trim() ||
      !category.trim() ||
      price === null ||
      stock === null
    ) {
      setError("All fields are required");
      return;
    }

    setLoading(true);
    setError("");

    if (!imageFile) {
      setError("Image is required");
      setLoading(false);
      return;
    }
    if (imageFile.size > 2 * 1024 * 1024) {
      setError("Image size must be less than 2MB");
      setLoading(false);
      return;
    }
    if (!["image/jpeg", "image/png", "image/gif"].includes(imageFile.type)) {
      setError("Only JPEG, PNG, and GIF images are allowed");
      setLoading(false);
      return;
    }

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("brand", brand);
      formData.append("category", category);
      formData.append("price", price.toString());
      formData.append("stock", stock.toString());
      formData.append("description", description);
      formData.append("image", imageFile);

      const result = await fetch("/api/products", {
        method: "POST",
        body: formData,
      });

      if (!result.ok) {
        const data = await result.json();
        setError(data.error || "Failed to add product");
        setLoading(false);
        return;
      }

      setShowModal(false);
      setName("");
      setBrand("");
      setCategory("");
      setPrice(null);
      setStock(null);
      setDescription("");
      setImagePreview(null);
      setImageFile(null);
      setError("");
      setLoading(false);
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  return (
    <>
      <div
        className="bg-green-500 custom-button hover:bg-green-800 text-white"
        onClick={handleModalToggle}
      >
        + Add Product
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-md">
          <div className="bg-white rounded-lg shadow-lg p-6 w-auto relative max-w-[900px] mx-4">
            <button
              onClick={handleModalToggle}
              className="close-button absolute top-3 right-3 text-2xl font-bold"
            >
              &times;
            </button>

            <h2 className="text-2xl font-semibold mb-4">Product Details</h2>

            <div className="flex flex-wrap flex-col sm:flex-row gap-4">
              {/* Image container with fixed width */}
              <div className="relative w-[280px] h-96 border-2 border-dashed border-gray-300 rounded-md flex items-center justify-center overflow-hidden flex-shrink-0">
                <input
                  type="file"
                  accept="image/*"
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  onChange={handleImageUpload}
                />
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="Uploaded"
                    className="object-contain w-full h-full"
                  />
                ) : (
                  <span className="text-4xl text-gray-400 z-0">+</span>
                )}
              </div>

              {/* Inputs container with fixed width */}
              <div className="flex flex-col justify-around w-[320px] min-w-[300px] max-w-md flex-shrink-0">
                <div className="flex items-center gap-2">
                  <label htmlFor="name" className="min-w-[80px]">
                    Name:
                  </label>
                  <input
                    id="name"
                    type="text"
                    className="input-box"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div className="flex items-center gap-2">
                  <label htmlFor="brand" className="min-w-[80px]">
                    Brand:
                  </label>
                  <input
                    id="brand"
                    type="text"
                    className="input-box"
                    value={brand}
                    onChange={(e) => setBrand(e.target.value)}
                  />
                </div>
                <div className="flex items-center gap-2">
                  <label htmlFor="category" className="min-w-[80px]">
                    Category:
                  </label>
                  <input
                    id="category"
                    type="text"
                    className="input-box"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                  />
                </div>
                <div className="flex items-center gap-2">
                  <label htmlFor="price" className="min-w-[80px]">
                    Price:
                  </label>
                  <input
                    id="price"
                    type="number"
                    className="input-box"
                    value={price ?? ""}
                    onChange={(e) =>
                      setPrice(
                        e.target.value ? parseFloat(e.target.value) : null
                      )
                    }
                  />
                </div>
                <div className="flex items-center gap-2">
                  <label htmlFor="stock" className="min-w-[80px]">
                    Stock:
                  </label>
                  <input
                    id="stock"
                    type="number"
                    className="input-box"
                    value={stock ?? ""}
                    onChange={(e) =>
                      setStock(e.target.value ? parseInt(e.target.value) : null)
                    }
                  />
                </div>
              </div>

              {/* Description textarea and buttons */}
              <div className="w-full sm:flex-grow">
                <div>Description</div>
                <textarea
                  className="w-full h-24 p-2 border border-gray-300 rounded-lg"
                  placeholder="Enter product description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
                {error && <p className="text-red-600 mt-2">{error}</p>}

                <div className="flex items-center justify-end gap-4 mt-4">
                  <button
                    className="custom-button hover:bg-red-600 bg-red-400"
                    onClick={handleModalToggle}
                  >
                    Cancel
                  </button>
                  <button
                    className="custom-button hover:bg-green-600 bg-green-400"
                    onClick={handleSubmit}
                  >
                    {loading ? "Adding...." : "Add Product"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
