import { Schema } from "mongoose";
import bcryptjs from "bcryptjs";
import ProductModel from "./product.model.js";
import authMessages from "../utils/messages/messages.auth.utils.js";
import userMessages from "../utils/messages/messages.user.utils.js";
import serverMessages from "../utils/messages/messages.server.utils.js";
import providers, { providerEnum } from "../utils/enums/provider.enum.js";
import { model } from "mongoose";
import ErrorHandler from "../utils/classes/errorHandler.utils.js";
import errorCodes from "../utils/enums/errorCodes.enum.js";
import customErrorCodes from "../utils/enums/errorCodes.custom.enum.js";
import SuperAdminModel from "./superAdmin.model.js";
import AdminModel from "./admin.model.js";

const schema = new Schema({
  image: {
    type: String,
    required: true,
    default:
      "https://th.bing.com/th/id/R.6c6bff6f40d420c8a756db79a369681c?rik=suTO6OOqRmSAJQ&pid=ImgRaw&r=0"
  },

  name: {
    type: String,
    required: true
  },

  last_name: {
    type: String
  },

  auth: {
    email: {
      type: String,
      required: true,
      index: true,
      unique: true
    },

    provider: {
      type: String,
      required: true,
      default: providerEnum.EMAIL_PASSWORD_AUTH,
      enum: providers
    },

    password: {
      type: String,
      index: true
    }
  },

  cart: {
    type: [
      {
        product: {
          type: Schema.Types.ObjectId,
          ref: "Product"
        }
      }
    ],

    default: []
  },

  orders: {
    type: [
      {
        order: {
          type: Schema.Types.ObjectId,
          ref: "Order"
        }
      }
    ],

    default: []
  },

  messages: [
    {
      type: Schema.Types.ObjectId,
      ref: "Message"
    }
  ]
});

schema.pre("save", async function (next) {
  if (
    this.auth.provider === providerEnum.EMAIL_PASSWORD_AUTH &&
    !this.auth.password
  ) {
    throw new ErrorHandler(
      authMessages.FAIL_PASSWORD,
      "",
      errorCodes.UNAUTHORIZED,
      customErrorCodes.INVALID_REQUEST
    );
  }
  if (
    !this.isModified("auth.password") ||
    this.auth.provider !== providerEnum.EMAIL_PASSWORD_AUTH
  )
    {
      return next();
    }
  const salt = await bcryptjs.genSalt(10);
  this.auth.password = await bcryptjs.hash(this.auth.password, salt);
  return next();
});

schema.methods.comparePassword = async function (password) {
  if (this.auth.provider !== providerEnum.EMAIL_PASSWORD_AUTH) return;
  const isValidPassword = await bcryptjs.compare(password, this.auth.password);
  return isValidPassword;
};

schema.methods.setToAdmin = async function (_id) {
  try {
    const superAdmin = await SuperAdminModel.findOne({ superAdmin: _id });
    if (!superAdmin)
      throw new ErrorHandler(
        userMessages.ADMIN_ONLY,
        "",
        errorCodes.FORBIDDEN,
        customErrorCodes.INVALID_REQUEST
      );

    const isAlreadySetByAdmin = [...superAdmin.usersSetToAdmin].includes(
      this._id
    );

    if (!isAlreadySetByAdmin) {
      superAdmin.usersSetToAdmin.push(this._id);
    }

    await Promise.all([
      await superAdmin.save(),
      await AdminModel.create({
        admin: this._id
      }),
      await this.save()
    ]);
  } catch (err) {
    throw new ErrorHandler(serverMessages.SERVER_FAILURE, err.message);
  }
};

schema.methods.unsetUserToAdmin = async function (_id) {
  try {
    const superAdmin = await SuperAdminModel.findOne({ superAdmin: _id });
    if (!superAdmin)
      throw new ErrorHandler(
        userMessages.ADMIN_ONLY,
        "",
        errorCodes.FORBIDDEN,
        customErrorCodes.INVALID_REQUEST
      );

    const isAlreadySetByAdmin = [...superAdmin.usersSetToAdmin].includes(
      this._id
    );

    if (isAlreadySetByAdmin) {
      superAdmin.usersSetToAdmin.pull(this._id);
    }

    await Promise.all([
      await superAdmin.save(),
      await AdminModel.deleteOne({
        admin: this._id
      }),
      await this.save()
    ]);
  } catch (err) {
    throw new ErrorHandler(serverMessages.SERVER_FAILURE, err.message);
  }
};

const UserModel = model("users", schema);

export default UserModel;
