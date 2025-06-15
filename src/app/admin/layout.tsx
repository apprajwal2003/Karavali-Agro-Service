import { AdminNavbar } from "@/components";
import { FilterProvider } from "@/context/FilterContext";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <FilterProvider>
        <AdminNavbar />
        <div>{children}</div>
      </FilterProvider>
    </div>
  );
}
