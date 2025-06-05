import Link from "next/link";

export default function AdminSearchBar() {
  return (
    <>
      <input
        type="text"
        placeholder="Product Name..."
        className="border border-gray-300 rounded-lg px-3 py-2 text-sm md:text-base"
      />
      <Link
        href="admin/products/"
        className="bg-blue-400 rounded-lg px-4 py-3 custom-button hover:bg-blue-600 text-white"
      >
        Search
      </Link>
    </>
  );
}
