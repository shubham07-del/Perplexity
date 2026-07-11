import mongoose from "mongoose";
import dns from "dns";

dns.setServers(["8.8.8.8"]);

async function connectToDB() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("connected to MongoDB.");
  } catch (err) {
    console.error("MongoDB connection failed:", err);
  }
}

export default connectToDB;
