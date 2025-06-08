import { CollectionsNavbar } from "@/components";
import { FilterProvider } from "@/context/FilterContext";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <FilterProvider>
      <CollectionsNavbar />
      <div>{children}</div>
    </FilterProvider>
  );
}
