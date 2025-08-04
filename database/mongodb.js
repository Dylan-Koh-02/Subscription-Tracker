import mongoose from "mongoose";
import { DB_URI, NODE_ENV } from "../config/env.js";

if (!DB_URI) {
  throw new Error(`Please add DB_URI to .env.${NODE_ENV}.local file`);
}

const connectToDatabase = async()=>{
  try {
    await mongoose.connect(DB_URI)
    console.log(`Connected to database in ${NODE_ENV} mode`);
    
  } catch (error) {
    console.error('Error connecting to database: ',error)
    process.exit(1)
  }
}

export default connectToDatabase