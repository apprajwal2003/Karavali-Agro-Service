"use client";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState } from "react";

export default function AdminNavbar() {
  const pathname = usePathname();
  const [sideBar, setSideBar] = useState(false);

  const navItems = [
    { name: "Products", path: "/admin/products" },
    { name: "Categories", path: "/admin/categories" },
    { name: "Orders", path: "/admin/orders" },
    { name: "Users", path: "/admin/users" },
  ];

  const handleSideBar = () => {
    setSideBar(!sideBar);
  };

  return (
    <header className="flex items-center justify-between fixed top-0 left-0 h-18 w-full z-50 bg-white border-b-2 border-black">
      <Link href="/">
        <h1 className="text-2xl px-4">Karavali Agro Service</h1>
      </Link>
      {/*Desktop */}
      <div className="hidden md:flex items-center gap-4 px-5 py-5 text-black text-xl">
        {navItems.map(({ name, path }) => {
          const isActive = pathname == path;

          return (
            <Link
              key={path}
              href={path}
              className={`custom-button admin-button ${
                isActive && "bg-green-800 rounded-lg px-2 py-2 text-white"
              }`}
            >
              {name}
            </Link>
          );
        })}
        <Link href="/admin/profile" className="flex items-center">
          <Image
            src="/logo.png"
            height={50}
            width={50}
            alt="profile photo"
            className="h-12 w-12 rounded-full border-2 border-white hover:scale-110 transition-transform duration-300 ease-in-out hover:shadow-lg hover:shadow-green-800"
          />
        </Link>
      </div>

      {/*Mobile */}
      {/* Hamburger button - visible only on small screens */}
      <button
        className="md:hidden flex items-center px-3 py-2 text-black focus:outline-none"
        onClick={handleSideBar}
        aria-label="Toggle menu"
      >
        {/* Hamburger icon */}
        <svg
          className="fill-current h-6 w-6"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          {sideBar ? (
            // X icon when open
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M18.3 5.71a1 1 0 00-1.41-1.42L12 9.17 7.11 4.29a1 1 0 10-1.41 1.42L10.83 12l-5.13 5.13a1 1 0 101.41 1.41L12 14.83l4.89 4.9a1 1 0 001.41-1.42L13.17 12l5.13-5.13z"
            />
          ) : (
            // Hamburger bars icon
            <path
              d="M4 6h16M4 12h16M4 18h16"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          )}
        </svg>
      </button>

      {/* Sidebar menu - visible only on small screens and when sideBar is true */}
      {sideBar && (
        <div className="fixed top-0 right-0 h-full w-64 bg-green-700 shadow-lg z-20 p-6 flex flex-col gap-6 md:hidden">
          {navItems.map(({ name, path }) => {
            const isActive = pathname === path;
            return (
              <Link
                key={path}
                href={path}
                onClick={() => setSideBar(false)} // close sidebar on click
                className={`text-white text-xl ${
                  isActive ? "bg-green-800 rounded-lg px-2 py-2" : ""
                }`}
              >
                {name}
              </Link>
            );
          })}
          <Link
            href="/admin/profile"
            className="flex items-center mt-auto"
            onClick={() => setSideBar(false)}
          >
            <Image
              src="/logo.png"
              height={50}
              width={50}
              alt="profile photo"
              className="h-12 w-12 rounded-full border-2 border-white"
            />
          </Link>
        </div>
      )}
    </header>
  );
}
