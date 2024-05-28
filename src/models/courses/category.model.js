import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
  name: { type: String, unique: true, required: true },
  image: { type: String, required: false }, 
  description: { type: String, required: false } 
});

export default mongoose.model("Category", categorySchema);
