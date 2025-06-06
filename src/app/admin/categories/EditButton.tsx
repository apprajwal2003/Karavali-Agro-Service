"use client";
import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { createPortal } from "react-dom";

type EditProps = {
  id: string;
  name: string;
};

export default function EditButton({ id, name }: EditProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [newName, setNewName] = useState(name.trim());
  const [updateProducts, setUpdateProducts] = useState(false);
  const [productsCount, setProductsCount] = useState(0);
  const router = useRouter();

  const handleModalToggle = useCallback(() => {
    setShowModal((prev) => !prev);
    setShowConfirmModal(false);
    setError("");
    setNewName(name.trim());
    setLoading(false);
    setUpdateProducts(false);
  }, [name]);

  const handleEdit = useCallback(async () => {
    const trimmedNewName = newName.trim();

    if (trimmedNewName.toUpperCase() === name.trim().toUpperCase()) {
      setError("No changes made to the category name.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response = await fetch(`/api/categories/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          newName: trimmedNewName,
          updateProducts: updateProducts,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.error === "CONFIRM_UPDATE") {
          setShowConfirmModal(true);
          setProductsCount(data.productsCount);
          setShowModal(false);
        } else {
          setError(data.error || "Failed to edit category");
        }
        setLoading(false);
        return;
      }

      setLoading(false);
      setShowModal(false);
      setShowConfirmModal(false);
      router.refresh();
    } catch (err) {
      console.error("Edit error:", err);
      setError("Something went wrong");
      setLoading(false);
    }
  }, [id, name, newName, router, updateProducts]);

  const handleConfirmUpdate = useCallback((confirm: boolean) => {
    setUpdateProducts(confirm);
    setShowConfirmModal(false);
    setShowModal(confirm);
  }, []);

  useEffect(() => {
    if (!showModal && !showConfirmModal) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (showConfirmModal) {
          setShowConfirmModal(false);
          setShowModal(true);
        } else {
          handleModalToggle();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [showModal, showConfirmModal, handleModalToggle]);

  return (
    <>
      <div
        className="bg-blue-500 custom-button hover:bg-blue-600 text-white px-2 py-1"
        onClick={handleModalToggle}
      >
        Edit
      </div>

      {showModal &&
        createPortal(
          <div className="fixed inset-0 z-60 flex items-start justify-center px-4 py-4 sm:px-4 backdrop-blur-md overflow-y-auto mt-[4.5rem]">
            <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6 w-full max-w-4xl relative">
              <button
                onClick={handleModalToggle}
                className="close-button absolute top-2 right-2 text-2xl cursor-pointer"
                disabled={loading}
              >
                &times;
              </button>

              <h2 className="text-xl sm:text-2xl font-semibold mb-4">
                Edit Category
              </h2>

              <div className="flex items-center gap-2">
                <label htmlFor="name" className="min-w-[80px]">
                  Category Name:
                </label>
                <input
                  id="name"
                  type="text"
                  className="input-box w-full"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="Enter new category name"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleEdit();
                    }
                  }}
                />
              </div>

              {error && <p className="text-red-600 mt-2">{error}</p>}

              <div className="flex flex-col sm:flex-row justify-end items-center gap-3 mt-4">
                <button
                  className="custom-button bg-red-400 hover:bg-red-600 w-full sm:w-auto"
                  onClick={handleModalToggle}
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  className="custom-button bg-green-400 hover:bg-green-600 w-full sm:w-auto"
                  onClick={handleEdit}
                  disabled={loading}
                >
                  {loading ? "Updating..." : "Update"}
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}

      {showConfirmModal &&
        createPortal(
          <div className="fixed inset-0 z-60 flex items-start justify-center px-4 py-4 sm:px-4 backdrop-blur-md overflow-y-auto mt-[4.5rem] ">
            <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6 w-full max-w-4xl relative">
              <button
                onClick={() => {
                  setShowConfirmModal(false);
                  setShowModal(true);
                }}
                className="close-button absolute top-2 right-2 text-2xl cursor-pointer"
                disabled={loading}
              >
                &times;
              </button>

              <h2 className="text-xl sm:text-2xl font-semibold mb-4 text-red-600">
                Warning
              </h2>

              <p className="mb-4">
                This category has {productsCount} associated product(s). Do you
                want to update all products to use the new category name?
              </p>

              <div className="flex flex-col sm:flex-row justify-end items-center gap-3 mt-4">
                <button
                  className="custom-button bg-red-400 hover:bg-red-600 w-full sm:w-auto"
                  onClick={() => handleConfirmUpdate(false)}
                  disabled={loading}
                >
                  No, Cancel Update
                </button>
                <button
                  className="custom-button bg-green-400 hover:bg-green-600 w-full sm:w-auto"
                  onClick={() => handleConfirmUpdate(true)}
                  disabled={loading}
                >
                  Yes, Confirm
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}
    </>
  );
}
