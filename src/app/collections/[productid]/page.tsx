import { connectDB } from "@/lib/mongodb";
import { Product } from "@/models/product";
import ProductView from "./ProductView";

export default async function ProductPage({
  params,
}: {
  params: { productid: string };
}) {
  await connectDB();

  const product = await Product.findById(params.productid).populate("category");

  if (!product) return <div>Product not found</div>;

  const plainProduct = {
    ...product.toObject(),
    _id: product._id.toString(),
    category:
      product.category && typeof product.category === "object"
        ? {
            ...product.category.toObject?.(),
            _id: product.category._id?.toString(),
          }
        : null,
  };

  return <ProductView product={plainProduct} />;
}
