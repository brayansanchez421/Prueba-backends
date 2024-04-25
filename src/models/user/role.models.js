import mongoose from "mongoose";

const roleSchema = new mongoose.Schema({
  nombre: { type: String, unique: true },
  permisos: [{ type: String }], 
});

export default mongoose.model("Role", roleSchema);
