import {Schema, model} from "mongoose";
import ProductModel from "./product.model.js";
import userMessages from "../utils/messages/messages.user.utils.js";
import errorCodes from "../utils/enums/errorCodes.enum.js";
import customErrorCodes from "../utils/enums/errorCodes.custom.enum.js";
import ErrorHandler from "../utils/classes/errorHandler.utils.js";

const schema = new Schema({
  rate: {
    type: Number,
    required: true
  },

  message: {
    type: String,
    required: true
  },

  userCreator: {
    type: Schema.Types.ObjectId,
    ref: "users"
  }
});

schema.pre("save", async function (next, productId) {
  try {
    const product = await ProductModel.findOne({ _id: productId });
    product.comments.push(this._id);
    await product.save();
    next();
  } catch (err) {
    throw new ErrorHandler(userMessages.ADMIN_ONLY, err.message, errorCodes.FORBIDDEN, customErrorCodes.INVALID_REQUEST)
  }
});

const CommentModel = model("comments", schema);

export default CommentModel;
