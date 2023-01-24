import mongoose from "mongoose";

const schema = new mongoose.Schema({
    rate: {
        type: Number,
        required: true,
    },

    header: {
        type: String,
        requred: true
    },

    message: {
        type: String,
        requred: true
    },

    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    
    prductRef: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true
    }

});

schema.pre("find", function () {
    this.model.populate("createdBy").populate("productRef").lean();
});

const CommentModel = mongoose.model("Comment", schema);

export default CommentModel;