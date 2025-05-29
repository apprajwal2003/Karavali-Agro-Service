"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

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
      newPrice === null ||
      newStock === null
    ) {
      setError("All fields are required");
      return;
    }

    if (
      name.trim() == newName.trim() &&
      brand.trim() == newBrand.trim() &&
      category.trim() == newCategory.trim() &&
      price == newPrice &&
      stock == newStock
    ) {
      setError("No changes are made!");
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
      formData.append("name", newName);
      formData.append("brand", newBrand);
      formData.append("category", newCategory);
      formData.append("price", newPrice.toString());
      formData.append("stock", newStock.toString());
      formData.append("description", newDescription);
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

            <h2 className="text-2xl font-semibold mb-4">
              Edit Product Details
            </h2>

            <div className="flex flex-wrap flex-col sm:flex-row gap-4">
              <div className="relative w-[280px] h-96 border-2 border-dashed border-gray-300 rounded-md flex items-center justify-center overflow-hidden flex-shrink-0">
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
                    height={384}
                    className="object-contain w-full h-full"
                    unoptimized
                  />
                ) : (
                  <span className="text-4xl text-gray-400 z-0">+</span>
                )}
              </div>

              <div className="flex flex-col justify-around w-[320px] min-w-[300px] max-w-md flex-shrink-0">
                <div className="flex items-center gap-2">
                  <label htmlFor="name" className="min-w-[80px]">
                    Name:
                  </label>
                  <input
                    id="name"
                    type="text"
                    className="input-box"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
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
                    value={newBrand}
                    onChange={(e) => setNewBrand(e.target.value)}
                  />
                </div>
                <div className="flex items-center gap-2">
                  <label htmlFor="category" className="min-w-[80px]">
                    Category:
                  </label>
                  <select
                    id="category"
                    className="input-box"
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
                  <label htmlFor="price" className="min-w-[80px]">
                    Price:
                  </label>
                  <input
                    id="price"
                    type="number"
                    className="input-box"
                    value={newPrice ?? null}
                    onChange={(e) => setNewPrice(parseFloat(e.target.value))}
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
                    value={newStock ?? null}
                    onChange={(e) => setNewStock(parseInt(e.target.value))}
                  />
                </div>
              </div>

              <div className="w-full sm:flex-grow">
                <div>Description</div>
                <textarea
                  className="w-full h-24 p-2 border border-gray-300 rounded-lg"
                  placeholder="Enter product description"
                  value={newDescription ?? ""}
                  onChange={(e) => setNewDescription(e.target.value)}
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
