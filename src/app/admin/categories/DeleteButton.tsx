"use client";
// This component is a button that triggers a modal for deleting a category.
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createPortal } from "react-dom";

type DeleteProps = {
  id: string;
  name: string;
};

export default function DeleteButton({ id, name }: DeleteProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const router = useRouter();

  const handleModalToggle = () => {
    setShowModal(!showModal);
    setError("");
    setLoading(false);
  };

  // Close the modal when the Escape key is pressed
  useEffect(() => {
    if (!showModal) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        handleModalToggle();
      }

      if (e.key === "Enter") {
        handleDelete();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [showModal]);

  const handleDelete = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(`/api/categories/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const data = await response.json();
        setError(data.error || "Failed to delete category");
        setLoading(false);
        return;
      }

      setLoading(false);
      setShowModal(false);
      setError("");
      router.refresh();
    } catch (error) {
      console.error("Delete error:", error);
      setError("Something went wrong");
      setLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={handleModalToggle}
        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 w-full sm:w-auto"
      >
        {loading ? "Deleting...." : "Delete"}
      </button>

      {showModal &&
        createPortal(
          <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-md">
            <div className="bg-white rounded-lg shadow-lg p-6 w-auto relative">
              <div className="flex items-center justify-between gap-4">
                <h2 className="text-2xl font-semibold justify-around px-10 pt-10 mb-4">
                  Delete {name}?
                </h2>
                <button
                  onClick={handleModalToggle}
                  className="close-button absolute top-2 right-2 text-2xl cursor-pointer"
                >
                  &times;
                </button>
              </div>

              {error && <p className="text-red-600 mt-2">{error}</p>}

              <div className="pt-4 flex items-center justify-end gap-4">
                <button
                  className="custom-button bg-red-400 hover:bg-red-600 cursor-pointer"
                  onClick={handleModalToggle}
                  disabled={loading}
                >
                  No
                </button>
                <button
                  className="custom-button bg-green-400 hover:bg-green-600 cursor-pointer"
                  onClick={handleDelete}
                  disabled={loading}
                >
                  {loading ? "Deleting..." : "Yes, Delete"}
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}
    </>
  );
}
