import { Schema, model } from "mongoose";

const schema = new Schema({
  admin: {
    type: Schema.Types.ObjectId,
    ref: "users",
    required: true,
    unique: true
  },

  deletedProducts: [
    {
      type: Schema.Types.ObjectId,
      ref: "Product"
    }
  ]
});

// adminSchema.index({ deletedProducts: 1 }, { sparse: true, unique: true });
// schema.index({ deletedProducts: 1 }, { sparse: true, unique: true });
const AdminModel = model("admins", schema);

export default AdminModel;
