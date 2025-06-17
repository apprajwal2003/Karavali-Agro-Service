"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useFilter } from "@/context/FilterContext";

// This component is a modal for adding a new category.
// It includes a form with an input field for the category name and buttons to cancel or submit the form.
export default function AddCategoryWrapperModal() {
  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const { search, setSearch } = useFilter();

  const handleModalToggle = () => {
    setShowModal(!showModal);
    setError("");
    setName("");
  };

  const handleSubmit = async () => {
    if (!name.trim()) {
      setError("Category name is required");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Failed to add category");
        setLoading(false);
        return;
      }

      setLoading(false);
      setShowModal(false);
      setName("");
      router.refresh();
    } catch (error) {
      console.error("Error adding category:", error);
      setError("Something went wrong");
      setLoading(false);
    }
  };

  return (
    <>
      <div
        className="bg-green-500 custom-button hover:bg-green-800 text-white px-2 py-1 flex"
        onClick={handleModalToggle}
      >
        +<div className="max-md:hidden pl-2"> Add Category</div>
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
              Category Details
            </h2>

            <div className="flex items-center gap-2">
              <label htmlFor="name" className="min-w-[80px]">
                Category Name:
              </label>
              <input
                id="name"
                type="text"
                className="input-box"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            {error && <p className="text-red-600 mt-2">{error}</p>}

            <div className="pt-4 flex items-center justify-end gap-4">
              <button
                className="custom-button hover:bg-red-600"
                onClick={handleModalToggle}
                disabled={loading}
              >
                Cancel
              </button>
              <button
                className="custom-button hover:bg-green-600"
                onClick={handleSubmit}
                disabled={loading}
              >
                {loading ? "Adding..." : "Add Category"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
