import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 20,
      trim: true,
    },
    state: {
      type: Boolean,
      required: true,
      default: false,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      validate: {
        validator: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
        message: "Invalid email format",
      },
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    userImage: {
      type: String,
      required: false,
    },
    resetCode: {
      type: String,
    },
    resetCodeExpires: {
      type: Date,
    },
    deleteCode: {
      type: String,
    },
    deleteCodeExpires: {
      type: Date,
    },
    role: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Role",
      default: null,
    },
    courses: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course"
    }],
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", async function (next) {
  if (!this.role) {
    const Role = mongoose.model("Role");
    const defaultRole = await Role.findOne({ nombre: "usuario" });
    this.role = defaultRole ? defaultRole._id : null;
  }
  next();
});

export default mongoose.model("User", userSchema);
