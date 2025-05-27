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
  const [newName, setNewName] = useState(name.trim());
  const router = useRouter();

  const handleModalToggle = useCallback(() => {
    setShowModal((prev) => !prev);
    setError("");
    setNewName(name.trim());
    setLoading(false);
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
        body: JSON.stringify({ newName: trimmedNewName }),
      });

      if (!response.ok) {
        const data = await response.json();
        setError(data.error || "Failed to edit category");
        setLoading(false);
        return;
      }

      setLoading(false);
      setShowModal(false);
      router.refresh();
    } catch (err) {
      console.error("Edit error:", err);
      setError("Something went wrong");
      setLoading(false);
    }
  }, [id, name, newName, router]);

  useEffect(() => {
    if (!showModal) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        handleModalToggle();
      }

      if (e.key === "Enter") {
        e.preventDefault();
        handleEdit();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [showModal, handleModalToggle, handleEdit]);

  return (
    <>
      <button
        onClick={handleModalToggle}
        className="bg-blue-400 text-white px-4 py-2 rounded hover:bg-blue-600 w-full sm:w-auto"
      >
        {loading ? "Updating..." : "Update"}
      </button>

      {showModal &&
        createPortal(
          <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-md">
            <div className="bg-white rounded-lg shadow-lg p-6 w-auto relative">
              <div className="flex items-center justify-between gap-4">
                <h2 className="text-2xl font-semibold justify-around px-10 pt-10 mb-4">
                  Update {name} to
                </h2>
                <button
                  onClick={handleModalToggle}
                  className="close-button absolute top-2 right-2 text-2xl cursor-pointer"
                >
                  &times;
                </button>
              </div>

              <div>
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded"
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

              <div className="pt-4 flex items-center justify-end gap-4">
                <button
                  className="custom-button bg-red-400 hover:bg-red-600 cursor-pointer"
                  onClick={handleModalToggle}
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  className="custom-button bg-green-400 hover:bg-green-600 cursor-pointer"
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
    </>
  );
}
