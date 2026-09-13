import { Schema, model, type InferSchemaType, type HydratedDocument } from "mongoose"

const fieldSchema = new Schema(
  {
    id: { type: String, required: true },
    type: { type: String, required: true },
    label: { type: String, required: true },
    placeholder: String,
    required: { type: Boolean, default: false },
    options: [String],
    validation: {
      min: Number,
      max: Number,
      pattern: String,
    },
  },
  { _id: false }
)

/** A clinician-authored intake form, scoped to its owner. */
const customFormSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    name: { type: String, required: true, trim: true, maxlength: 255 },
    description: { type: String, default: "", trim: true },
    fields: { type: [fieldSchema], default: [] },
  },
  { timestamps: true }
)

customFormSchema.index({ user: 1, updatedAt: -1 })

export type CustomForm = InferSchemaType<typeof customFormSchema>
export type CustomFormDocument = HydratedDocument<CustomForm>

export const CustomFormModel = model("CustomForm", customFormSchema)
