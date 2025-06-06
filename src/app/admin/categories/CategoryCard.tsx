import EditButton from "./EditButton";
import DeleteButton from "./DeleteButton";

interface CategoryType {
  _id: string;
  name: string;
}

export default async function CategoryCard({
  category,
}: {
  category: CategoryType;
}) {
  return (
    <div
      key={category._id}
      className="max-w-md w-full mx-auto flex flex-col md:flex-row justify-between md:items-center p-4 rounded-xl backdrop-blur-xl bg-white/10 border border-white/30 shadow-md text-white"
    >
      <div className="mb-2 md:mb-0">{category.name}</div>
      <div className="flex gap-2 w-full md:w-auto justify-end">
        <EditButton id={category._id} name={category.name} />
        <DeleteButton id={category._id} name={category.name} />
      </div>
    </div>
  );
}
