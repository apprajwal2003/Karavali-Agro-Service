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
    type: String,
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
  rating: {
    average: {
      type: Number,
      default: 5,
      min: 1,
      max: 5,
    },
    count: {
      type: Number,
      default: 0,
    },
  },
});

export const Product =
  mongoose.models.Product || mongoose.model("Product", productSchema);
