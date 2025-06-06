"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { createPortal } from "react-dom";

type EditProps = {
  id: string;
  name: string;
  brand: string;
  stock: number;
  description: string;
  category: string;
  image: string;
  price: number;
};

export default function EditButton({
  id,
  name,
  brand,
  stock,
  description,
  category,
  image,
  price,
}: EditProps) {
  const [showModal, setShowModal] = useState(false);
  const [imagePreview, setImagePreview] = useState(image);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [newName, setNewName] = useState(name);
  const [newBrand, setNewBrand] = useState(brand);
  const [newCategory, setNewCategory] = useState(category);
  const [newPrice, setNewPrice] = useState(price);
  const [newStock, setNewStock] = useState(stock);
  const [newDescription, setNewDescription] = useState(description);
  const [categories, setCategories] = useState<{ _id: string; name: string }[]>(
    []
  );
  const router = useRouter();

  //update modal category
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
    setShowModal(!showModal);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) {
      setError("Please select image");
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
      !newName.trim() ||
      !newBrand.trim() ||
      !newCategory.trim() ||
      isNaN(newPrice) ||
      isNaN(newStock)
    ) {
      setError("All fields are required");
      return;
    }

    if (
      name.trim() == newName.trim() &&
      brand.trim() == newBrand.trim() &&
      category.trim() == newCategory.trim() &&
      price == newPrice &&
      stock == newStock &&
      description == newDescription &&
      imageFile == null
    ) {
      setError("No changes are made!");
      return;
    }

    setLoading(true);
    setError("");
    if (imageFile) {
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
    }

    try {
      const formData = new FormData();
      formData.append("name", newName);
      formData.append("brand", newBrand);
      formData.append("category", newCategory);
      formData.append("price", newPrice.toString());
      formData.append("stock", newStock.toString());
      formData.append("description", newDescription);
      if (imageFile) {
        formData.append("image", imageFile);
      }

      const result = await fetch(`/api/products/${id}`, {
        method: "PUT",
        body: formData,
      });

      if (!result.ok) {
        const data = await result.json();
        setError(data.error || "Failed to update product details!");
        setLoading(false);
        return;
      }

      setError("");
      setLoading(false);
      router.refresh();
      setShowModal(false);
      alert("Product updated successfully!");
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  return (
    <>
      <div
        className="bg-blue-500 custom-button hover:bg-blue-600 text-white px-2 py-1"
        onClick={handleModalToggle}
      >
        Edit
      </div>

      {typeof window !== "undefined" &&
        showModal &&
        createPortal(
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
                Edit Product Details
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
                      value={newName}
                      onChange={(e) => setNewName(e.target.value)}
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
                      value={newBrand}
                      onChange={(e) => setNewBrand(e.target.value)}
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <label htmlFor="category" className="w-20">
                      Category:
                    </label>
                    <select
                      id="category"
                      className="input-box w-full"
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value)}
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
                      value={newPrice ?? ""}
                      onChange={(e) => setNewPrice(parseFloat(e.target.value))}
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
                      value={newStock ?? ""}
                      onChange={(e) => setNewStock(parseInt(e.target.value))}
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
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
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
                    {loading ? "Updating..." : "Update"}
                  </button>
                </div>
              </div>
            </div>
          </div>,
          document.body
        )}
    </>
  );
}
