import mongoose from "mongoose";
let isConnected = false;

const connectDB = async () => {
  if (isConnected) {
    return;
  }
  try {
    const result = await mongoose.connect(process.env.MONGO_URI as string);
    isConnected = true;
    console.log("MongoDB Connected");
  } catch (error) {
    console.log(error);
  }
};

export { connectDB };
