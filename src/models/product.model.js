import { Schema, model, startSession } from "mongoose";
import mongooseDelete from "mongoose-delete";
import pagination from "mongoose-paginate-v2";
import userMessages from "../utils/messages/messages.user.utils.js";
import serverMessages from "../utils/messages/messages.server.utils.js";
import tryCatchHandler from "../utils/functions/tryCatch.utils.js";
import customErrorCodes from "../utils/enums/errorCodes.custom.enum.js";
import ErrorHandler from "../utils/classes/errorHandler.utils.js";
import errorCodes from "../utils/enums/errorCodes.enum.js";
import AdminModel from "./admin.model.js";
import CommentModel from "./comment.model.js";
const schema = new Schema({
  title: {
    type: String,
    required: true
  },

  description: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },

  thumbnail: {
    type: String,
    required: true,
    default:
      "https://i.pinimg.com/originals/73/a6/c4/73a6c4e772e4aad4e6ec37de2f52af74.png"
  },

  code: {
    type: String,
    required: true,
    unique: true
  },

  stock: {
    type: Number,
    required: true
  },

  status: {
    type: Boolean,
    required: true,
    default: true
  },

  createdBy: {
    required: true,
    type: Schema.Types.ObjectId,
    ref: "users"
  },

  comments: [
    {
      type: Schema.Types.ObjectId,
      ref: CommentModel
    }
  ],

  categoryType: {
    type: String,
    required: true
  }
});

schema.plugin(mongooseDelete, { deletedAt: true });
schema.plugin(pagination);

schema.pre("save", async function (next) {
  tryCatchHandler({
    fn: async () => {
      if (!(await AdminModel.exists({ admin: this.createdBy }))) {
        throw new ErrorHandler(
          userMessages.ADMIN_ONLY,
          "",
          errorCodes.FORBIDDEN,
          customErrorCodes.INVALID_REQUEST
        );
      }

      return next();
    }
  });
});

schema.methods.handleDelete = async function (userId) {
  const session = await startSession();

  session.startTransaction();
  try {
    await Promise.all([
      AdminModel.updateOne(
        { admin: userId },
        { $push: { deletedProducts: this._id } },
        { new: false, upsert: false }
      ),
      await this.delete()
    ]);

    await session.commitTransaction();
  } catch (err) {
    await session.abortTransaction();
    throw new ErrorHandler(
      serverMessages.SERVER_FAILURE,
      err.message,
      errorCodes.INTERNAL_SERVER_ERROR,
      customErrorCodes.SERVER_FAILURE
    );
  } finally {
    await session.endSession();
  }
};

schema.methods.irreversibleDeleteProduct = async function (userId) {
  const session = await startSession();

  session.startTransaction();

  try {
    await Promise.all([
      AdminModel.updateOne(
        { admin: userId },
        { $pull: { deletedProducts: this._id } },
        { new: false, upsert: false }
      ),
      await this.deleteOne()
    ]);

    await session.commitTransaction();
  } catch (err) {
    await session.abortTransaction();
    throw new ErrorHandler(
      serverMessages.SERVER_FAILURE,
      err.message,
      errorCodes.INTERNAL_SERVER_ERROR,
      customErrorCodes.SERVER_FAILURE
    );
  } finally {
    await session.endSession();
  }
};

schema.methods.restoreProduct = async function (userId) {
  const session = await startSession();

  session.startTransaction();

  try {
    await Promise.all([
      AdminModel.updateOne(
        { admin: userId },
        { $pull: { deletedProducts: this._id } },
        { new: false, upsert: false, session }
      ),
      await this.updateOne({ deleted: false }, { session })
    ]);

    await session.commitTransaction();
  } catch (err) {
    await session.abortTransaction();
    throw new ErrorHandler(
      serverMessages.SERVER_FAILURE,
      err.message,
      errorCodes.INTERNAL_SERVER_ERROR,
      customErrorCodes.SERVER_FAILURE
      );
    }
    
    finally {
    await session.endSession();
  }
};

const ProductModel = model("products", schema);

export default ProductModel;
