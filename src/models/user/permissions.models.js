import mongoose from "mongoose";

const permissionSchema = new mongoose.Schema({
  nombre: { type: String, unique: true },
  descripcion: { type: String }, 
});

export default mongoose.model("Permissions", permissionSchema);

