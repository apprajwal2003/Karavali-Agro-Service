import mongoose, { Schema } from "mongoose";

const categorySchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
});

// ✅ Prevent model overwrite error
export const Category =
  mongoose.models.Category || mongoose.model("Category", categorySchema);
