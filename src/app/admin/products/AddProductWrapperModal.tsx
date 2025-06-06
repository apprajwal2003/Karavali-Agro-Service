"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

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
  const [categories, setCategories] = useState<{ _id: string; name: string }[]>(
    []
  );
  const router = useRouter();

  useEffect(() => {
    if (!showModal) return;
    const fetchCategories = async () => {
      try {
        const res = await fetch("/api/categories");
        const data = await res.json();
        setCategories(data);
      } catch (err) {
        console.error("Failed to load categories", err);
      }
    };
    fetchCategories();
  }, [showModal]);

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
      router.refresh();
      alert("Product added successfully!");
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  return (
    <>
      <div
        className="bg-green-500 custom-button hover:bg-green-800 text-white px-2 py-1 flex"
        onClick={handleModalToggle}
      >
        +<div className="max-md:hidden pl-2"> Add Product</div>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-60 flex items-start justify-center px-2 py-4 sm:px-4 backdrop-blur-md overflow-y-auto mt-[4.5rem]">
          <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6 w-full max-w-4xl relative">
            <button
              onClick={handleModalToggle}
              className="close-button absolute top-2 right-2 text-2xl cursor-pointer"
              disabled={loading}
            >
              &times;
            </button>

            <h2 className="text-xl sm:text-2xl font-semibold mb-4">
              Product Details
            </h2>

            <div className="flex flex-col md:flex-row gap-4">
              {/* Image Upload */}
              <div className="relative w-full h-48 sm:h-56 md:w-[280px] md:h-64 border-2 border-dashed border-gray-300 rounded-md flex items-center justify-center overflow-hidden">
                <input
                  type="file"
                  accept="image/*"
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  onChange={handleImageUpload}
                />
                {imagePreview ? (
                  <Image
                    src={imagePreview}
                    alt="Uploaded"
                    width={280}
                    height={256}
                    className="object-contain w-full h-full"
                    unoptimized
                  />
                ) : (
                  <span className="text-4xl text-gray-400 z-0">+</span>
                )}
              </div>

              {/* Form Fields */}
              <div className="flex flex-col gap-3 w-full md:w-1/2">
                <div className="flex items-center gap-2">
                  <label htmlFor="name" className="w-20">
                    Name:
                  </label>
                  <input
                    id="name"
                    type="text"
                    className="input-box w-full"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div className="flex items-center gap-2">
                  <label htmlFor="brand" className="w-20">
                    Brand:
                  </label>
                  <input
                    id="brand"
                    type="text"
                    className="input-box w-full"
                    value={brand}
                    onChange={(e) => setBrand(e.target.value)}
                  />
                </div>
                <div className="flex items-center gap-2">
                  <label htmlFor="category" className="w-20">
                    Category:
                  </label>
                  <select
                    id="category"
                    className="input-box w-full"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                  >
                    <option value="">Select category</option>
                    {categories.map((cat) => (
                      <option key={cat._id} value={cat._id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex items-center gap-2">
                  <label htmlFor="price" className="w-20">
                    Price:
                  </label>
                  <input
                    id="price"
                    type="number"
                    className="input-box w-full"
                    value={price ?? ""}
                    onChange={(e) =>
                      setPrice(
                        e.target.value ? parseFloat(e.target.value) : null
                      )
                    }
                  />
                </div>
                <div className="flex items-center gap-2">
                  <label htmlFor="stock" className="w-20">
                    Stock:
                  </label>
                  <input
                    id="stock"
                    type="number"
                    className="input-box w-full"
                    value={stock ?? ""}
                    onChange={(e) =>
                      setStock(e.target.value ? parseInt(e.target.value) : null)
                    }
                  />
                </div>
              </div>
            </div>

            {/* Description and Buttons */}
            <div className="mt-4">
              <label>Description</label>
              <textarea
                className="w-full h-24 p-2 border border-gray-300 rounded-lg mt-1"
                placeholder="Enter product description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
              {error && <p className="text-red-600 mt-2">{error}</p>}
              <div className="flex flex-col sm:flex-row justify-end items-center gap-3 mt-4">
                <button
                  className="custom-button bg-red-400 hover:bg-red-600 w-full sm:w-auto"
                  onClick={handleModalToggle}
                >
                  Cancel
                </button>
                <button
                  className="custom-button bg-green-400 hover:bg-green-600 w-full sm:w-auto"
                  onClick={handleSubmit}
                >
                  {loading ? "Adding..." : "Add Product"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
