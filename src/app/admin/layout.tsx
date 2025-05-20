import { AdminNavbar } from "@/components";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <AdminNavbar />
      <div>{children}</div>
    </div>
  );
}
