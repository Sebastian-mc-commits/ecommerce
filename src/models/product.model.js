import mongoose, { mongo } from "mongoose";
import mongooseDelete from "mongoose-delete";
import User from "./user.models.js";
import pagination from "mongoose-paginate-v2";
import userMessages from "../utils/messages/messages.user.utils.js";
import productMessages from "../utils/messages/messages.product.utils.js";
import serverMessages from "../utils/messages/messages.server.utils.js";
const schema = new mongoose.Schema({
    title: {
        type: String,
        requred: true
    },

    description: {
        type: String,
        requred: true
    },
    price: {
        type: Number,
        requred: true
    },

    thumbnail: {
        type: String,
        requred: true,
        default: "https://i.pinimg.com/originals/73/a6/c4/73a6c4e772e4aad4e6ec37de2f52af74.png"
    },


    code: {
        type: String,
        requred: true,
        unique: true
    },

    stock: {
        type: Number,
        requred: true
    },

    status: {
        type: Boolean,
        requred: true,
        default: true
    },

    createdBy: {
        required: true,
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },

    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment"
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
    const user = await User.findOne({ _id: this.createdBy });
    try {

        if (!user || !user.adminOptions.isAdmin) throw new Error(userMessages.ADMIN_ONLY);

        return next();

    } catch {
        throw new Error(serverMessages.SERVER_FAILURE);
    }
});

schema.methods.handleDelete = async function (userId) {

    const session = await mongoose.startSession();

    session.startTransaction();
    try {

        await Promise.all([
            await User.updateOne({ _id: userId, "adminOptions.isAdmin": true }, { $push: { "adminOptions.deletedProducts": this._id } }),
            await this.delete()
        ]);

        await session.commitTransaction();
        session.endSession();

    } catch {
        await session.abortTransaction();
        session.endSession();
        throw new Error(serverMessages.SERVER_FAILURE);
    }

}

schema.methods.irreversibleDeleteProduct = async function (userId) {

    const session = await mongoose.startSession();

    session.startTransaction();

    try {

        await Promise.all([
            await User.updateOne({ _id: userId, "adminOptions.isAdmin": true }, { $pull: { "adminOptions.deletedProducts": this._id } }),
            await this.deleteOne(),
        ]);

        await session.commitTransaction();
        session.endSession();

    } catch (err) {
        await session.abortTransaction();
        session.endSession();

        throw new Error(serverMessages.SERVER_FAILURE);
    }

}

schema.methods.restoreProduct = async function (userId) {
    const session = await mongoose.startSession();

    session.startTransaction();

    try {

        await Promise.all([
            await User.updateOne({ _id: userId, "adminOptions.isAdmin": true }, { $pull: { "adminOptions.deletedProducts": this._id } }, { session }),
            await this.updateOne({ deleted: false }, { session })
        ]);

        await session.commitTransaction();
        session.endSession();

    } catch (err) {
        await session.abortTransaction();
        session.endSession();
        throw new Error(serverMessages.SERVER_FAILURE);
    }

}

const ProductModel = mongoose.model("Product", schema);

export default ProductModel;
