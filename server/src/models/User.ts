import { Schema, model, type InferSchemaType, type HydratedDocument } from "mongoose"

const userSchema = new Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 120 },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
    passwordHash: { type: String, required: true },
    plan: { type: String, enum: ["free", "premium"], default: "free" },
  },
  { timestamps: true }
)

export type User = InferSchemaType<typeof userSchema>
export type UserDocument = HydratedDocument<User>

export const UserModel = model("User", userSchema)
