import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  brand: {
    type: String,
    required: true,
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  image: {
    type: String, // ✅ Changed from Buffer to String
    required: true,
  },
  stock: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
    default: "No description available",
  },
});

export const Product =
  mongoose.models.Product || mongoose.model("Product", productSchema);
