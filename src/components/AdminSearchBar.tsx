import Link from "next/link";

export default function AdminSearchBar() {
  return (
    <>
      <input
        type="text"
        placeholder="Search..."
        className="border border-gray-300 rounded-lg px-4 py-2"
      />
      <Link
        href="admin/products/addproduct"
        className="bg-green-500 rounded-lg px-4 py-3 admin-button text-white"
      >
        Search
      </Link>
    </>
  );
}
