import mongoose from "mongoose";
import ProductModel from "./product.model.js";

const schema = new mongoose.Schema({
    rate: {
        type: Number,
        required: true,
    },

    message: {
        type: String,
        requred: true
    },

    userCreator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }

});

schema.pre("save", async function(next, productId) {
    const _id = Object.values(productId).join("");
    try {
        const product = await ProductModel.findOne({_id});
        product.comments.push(this._id);
        await product.save();
        next();
    } catch (err) {
        return console.log("err.message");
    }
});

const CommentModel = mongoose.model("Comment", schema);

export default CommentModel;