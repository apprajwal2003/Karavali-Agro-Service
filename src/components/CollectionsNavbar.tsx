"use client";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

export default function CollectionsNavbar() {
  const pathname = usePathname();

  const navItems = [
    { name: "Fertilizers", path: "/collections/fertilizers" },
    { name: "Seeds", path: "/collections/seeds" },
    { name: "Plants", path: "/collections/plants" },
    { name: "Pesticides", path: "/collections/pesticides" },
  ];
  return (
    <header className="flex items-center justify-between bg-green-600 h-22 w-full px-4 py-4 z-10 sticky top-0">
      <Link href="/">
        <Image
          src="/logo.png"
          alt="Logo"
          width={100}
          height={50}
          className="h-20 w-auto rounded-lg object-cover"
        />
      </Link>
      <div className="flex items-center gap-4 px-5 py-5 text-white text-xl">
        {navItems.map(({ name, path }) => {
          const isActive = pathname == path;

          return (
            <Link
              key={path}
              href={path}
              className={`custom-button admin-button ${
                isActive && "bg-green-800 rounded-lg px-2 py-2"
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
    </header>
  );
}
