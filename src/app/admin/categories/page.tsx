import { AdminSearchBar } from "@/components";
import AddCategoryWrapperModal from "./AddCategoryWrapperModal";
import { Category } from "@/models/category";
import { connectDB } from "@/lib/mongodb";
import DeleteButton from "./DeleteButton";

export default async function AdminCategoriesPage() {
  await connectDB();
  const categories = await Category.find().lean();

  return (
    <div className="flex flex-col">
      <div className="flex items-center justify-between bg-white h-22 w-full px-20 py-4 sticky top-22 z-10">
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
          {categories.map((cat: any) => (
            <div
              key={cat._id}
              className="max-w-md w-full mx-auto flex flex-col md:flex-row justify-between items-start md:items-center p-4 rounded-xl backdrop-blur-xl bg-white/10 border border-white/30 shadow-md text-white"
            >
              <div className="mb-2 md:mb-0">{cat.name}</div>
              <div className="flex gap-2 w-full md:w-auto">
                <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 w-full sm:w-auto">
                  Edit
                </button>

                <DeleteButton
                  id={cat._id.toString()}
                  name={cat.name.toString()}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
