import CollectionsNavbar from "@/components/CollectionsNavbar";
export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <CollectionsNavbar />
      <div>{children}</div>
    </div>
  );
}
