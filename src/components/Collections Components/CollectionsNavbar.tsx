"use client";

import Image from "next/image";
import { useFilter } from "@/context/FilterContext";
import Link from "next/link";

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
    <header className="bg-green-500 sticky top-0 z-10 w-full px-4 py-4 flex flex-col md:flex-row items-center justify-between gap-4">
      {/* Logo */}
      <Link
        href={"/collections"}
        onClick={() => {
          setSelectedCategory("");
          setSearch("");
        }}
      >
        <div className="flex items-center gap-4">
          <Image
            src="/logo.png"
            alt="Logo"
            width={50}
            height={50}
            className="rounded-lg"
          />
          <h1 className="text-4xl font-extrabold tracking-tighter uppercase bg-gradient-to-r from-orange-500 via-yellow-500 to-green-600 text-transparent bg-clip-text drop-shadow-md text-stroke-white">
            KARAVALI AGRO SERVICES
          </h1>
        </div>
      </Link>

      {/* Category buttons, search bar, profile */}
      <div className="hidden md:flex flex-wrap items-center gap-4 text-white">
        {navItems.map(({ name, value }) => {
          const isActive = selectedCategory === value;
          return (
            <Link
              href={`/collections`}
              key={name}
              onClick={() => {
                setSelectedCategory(value);
                setSearch("");
              }}
              className={`hover:bg-green-800 custom-button ${
                isActive && "bg-green-800"
              }`}
            >
              {name}
            </Link>
          );
        })}

        <input
          type="text"
          placeholder={`Search ${selectedCategory}...`}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="hidden md:block p-2 rounded border text-white"
        />

        <div className="relative inline-block">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 32 32"
            className="w-8 h-8"
          >
            <path d="M29.4 8.85A2.48 2.48 0 0 0 27.53 8H14a1 1 0 0 0 0 2h13.53a.47.47 0 0 1 .36.16.48.48 0 0 1 .11.36l-1.45 10a1.71 1.71 0 0 1-1.7 1.48H14.23a1.72 1.72 0 0 1-1.68-1.33L10 8.79l-.5-1.92A3.79 3.79 0 0 0 5.82 4H3a1 1 0 0 0 0 2h2.82a1.8 1.8 0 0 1 1.74 1.36L8 9.21l2.6 11.88A3.72 3.72 0 0 0 14.23 24h10.62a3.74 3.74 0 0 0 3.68-3.16l1.45-10a2.45 2.45 0 0 0-.58-1.99zM16 25h-2a1 1 0 0 0 0 2h2a1 1 0 0 0 0-2zM25 25h-2a1 1 0 0 0 0 2h2a1 1 0 0 0 0-2z" />
          </svg>
          <span className="absolute top-0 right-0 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-white bg-red-600 rounded-full">
            {1}
          </span>
        </div>

        <Image
          src="/logo.png"
          width={40}
          height={40}
          alt="Profile"
          className="hidden md:block rounded-full border-2 border-white hover:scale-110 transition-transform cursor-pointer"
        />
      </div>
    </header>
  );
}
