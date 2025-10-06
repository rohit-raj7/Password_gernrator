import mongoose from "mongoose";

const vaultSchema = new mongoose.Schema({
  salt: { type: String, required: true },
  blob: { type: String, required: true },
  updatedAt: { type: Date, default: Date.now },
});

const userSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
    vault: { type: vaultSchema, default: null },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
