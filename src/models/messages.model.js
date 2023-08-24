import { Schema, model } from "mongoose";
import UserModel from "./user.models.js";
import userMessages from "../utils/messages/messages.user.utils.js";
import errorCodes from "../utils/enums/errorCodes.enum.js";
import customErrorCodes from "../utils/enums/errorCodes.custom.enum.js";
import ErrorHandler from "../utils/classes/errorHandler.utils.js";

const schema = new Schema({
  from: {
    type: Schema.Types.ObjectId,
    ref: "users",
    required: true
  },

  to: {
    type: Schema.Types.ObjectId,
    ref: "users",
    required: true
  },

  message: {
    type: String,
    required: true
  },

  timestamp: {
    type: Date,
    default: Date.now()
  }
});

schema.pre("save", async function (next) {
  try {
    const { from, to, _id } = this;
    const request = await UserModel.updateMany(
      { $or: [{ _id: from }, { _id: to }] },
      { $push: { messages: _id } },
      { upsert: false }
    );
    if (!request) throw new ErrorHandler(userMessages.NOT_FOUND, '', errorCodes.BAD_REQUEST, customErrorCodes.INVALID_REQUEST);
    next();
  } catch (err) {
    throw new ErrorHandler(userMessages.NOT_FOUND, err.message, errorCodes.BAD_REQUEST, customErrorCodes.INVALID_REQUEST);
  }
});

const MessageModel = model("messages", schema);

export default MessageModel;
