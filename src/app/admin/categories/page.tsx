import CategorySearchBar from "./CategorySearchBar";
import AddCategoryWrapperModal from "./AddCategoryWrapperModal";
import { Category } from "@/models/category";
import { connectDB } from "@/lib/mongodb";
import CategoryCard from "./CategoryCard";

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
      <div className="flex flex-wrap items-center justify-between bg-white h-auto w-full px-4 md:px-20 py-4 sticky top-18 z-45 gap-2">
        <div className="hidden md:block text-2xl font-bold">Categories</div>
        <div className="flex items-center gap-2 flex-1 justify-end">
          <CategorySearchBar />
          <AddCategoryWrapperModal />
        </div>
      </div>

      <div className="min-h-screen overflow-auto px-4 md:px-20 py-4 pt-24 grid grid-cols-1 md:grid-cols-2 gap-6 bg-gradient-to-br from-gray-800 to-gray-900">
        {safeCategories.map((category) => (
          <CategoryCard key={category._id} category={category} />
        ))}
      </div>
    </div>
  );
}
