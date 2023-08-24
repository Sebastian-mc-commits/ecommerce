import { Schema, model } from "mongoose";

const schema = new Schema({

  superAdmin: {
    type: Schema.Types.ObjectId,
    ref: "users"
  },

  usersSetToAdmin: [
    {
      type: Schema.Types.ObjectId,
      ref: "users",
      unique: true
    }
  ]
});

const SuperAdminModel = model("super_admins", schema);

export default SuperAdminModel;
