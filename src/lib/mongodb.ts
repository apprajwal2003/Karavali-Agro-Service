import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const result = await mongoose.connect(process.env.MONGO_URI as string);
    console.log("MongoDB Connected");
  } catch (error) {
    console.log(error);
  }
};

export { connectDB };
