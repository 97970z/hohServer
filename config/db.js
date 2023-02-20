import { connect } from "mongoose";
import { config } from "dotenv";

config();

const connectDB = async () => {
  try {
    const conn = await connect(process.env.MONGODB_URI);
    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
