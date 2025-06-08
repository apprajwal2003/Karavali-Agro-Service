"use client";

import Image from "next/image";
import { useFilter } from "@/context/FilterContext";

export default function CollectionsNavbar() {
  const { search, selectedCategory, setSearch, setSelectedCategory } =
    useFilter();

  const navItems = [
    { name: "All", value: "" },
    { name: "Fertilizers", value: "fertilizers" },
    { name: "Micro Nutrients", value: "micro nutrients" },
    { name: "Insecticides", value: "insecticides" },
    { name: "Seeds", value: "seeds" },
  ];

  return (
    <header className="bg-green-600 sticky top-0 z-10 w-full px-4 py-4 flex flex-col md:flex-row items-center justify-between gap-4">
      {/* Logo */}
      <div className="flex items-center gap-4">
        <Image
          src="/logo.png"
          alt="Logo"
          width={80}
          height={40}
          className="rounded-lg"
        />
      </div>

      {/* Category buttons, search bar, profile */}
      <div className="flex flex-wrap items-center gap-4 text-white">
        {navItems.map(({ name, value }) => {
          const isActive = selectedCategory === value;
          return (
            <button
              key={name}
              onClick={() => {
                setSelectedCategory(value);
                setSearch("");
              }}
              className={`px-2 py-2 rounded hover:bg-green-800 transition-all ${
                isActive && "bg-green-800"
              }`}
            >
              {name}
            </button>
          );
        })}

        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="p-2 rounded border text-white"
        />

        <Image
          src="/logo.png"
          width={40}
          height={40}
          alt="Profile"
          className="rounded-full border-2 border-white"
        />
      </div>
    </header>
  );
}
