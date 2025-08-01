import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    // Debug: Print connected DB name
    console.log("Connected to MongoDB Database:", mongoose.connection.name);
  } catch (error) {
    console.error("DB Connection Failed", error);
    process.exit(1);
  }
};

export default connectDB;
