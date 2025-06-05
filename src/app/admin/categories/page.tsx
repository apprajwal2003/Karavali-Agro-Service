import { AdminSearchBar } from "@/components";
import AddCategoryWrapperModal from "./AddCategoryWrapperModal";
import { Category } from "@/models/category";
import { connectDB } from "@/lib/mongodb";
import DeleteButton from "./DeleteButton";
import EditButton from "./EditButton";

export const revalidate = 0;

type LeanCategory = {
  _id: string;
  name: string;
  __v: number;
};

export default async function AdminCategoriesPage() {
  await connectDB();
  const categories = await Category.find();

  const safeCategories: LeanCategory[] = categories.map((cat) => ({
    _id: cat._id.toString(),
    name: cat.name,
    __v: cat.__v,
  }));

  return (
    <div className="flex flex-col">
      <div className="flex items-center justify-between bg-white h-22 w-full px-20 py-4 sticky top-22">
        <h1 className="text-xl md:text-2xl font-bold mb-2 md:mb-0">
          Categories
        </h1>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4">
          <AdminSearchBar />
          <AddCategoryWrapperModal />
        </div>
      </div>

      <div className="overflow-auto p-4 sm:p-6 md:p-8 bg-gradient-to-br from-gray-800 to-gray-900 min-h-screen">
        <div className="grid gap-4">
          {safeCategories.map((cat) => (
            <div
              key={cat._id}
              className="max-w-md w-full mx-auto flex flex-col md:flex-row justify-between items-start md:items-center p-4 rounded-xl backdrop-blur-xl bg-white/10 border border-white/30 shadow-md text-white"
            >
              <div className="mb-2 md:mb-0">{cat.name}</div>
              <div className="flex gap-2 w-full md:w-auto">
                <EditButton id={cat._id} name={cat.name} />
                <DeleteButton id={cat._id} name={cat.name} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
