import mongoose from "mongoose";
import UserModel from "./user.models.js";

const schema = new mongoose.Schema({

    from: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    
    to: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    message: {
        type: String,
        required: true
    },

    timestamp: {
        type: Date,
        default: Date.now
    }
});

schema.pre("save", async function (next) {

    try {
        const { from, to, _id } = this;
        const request = await UserModel.updateMany({ $or: [{_id: from}, {_id: to}] }, { $push: { messages: _id } }, {upsert: false});
        if (!request) throw new Error("User not exists");
        next();
    }
    catch (err) {
        throw new Error(err);
    }
});

const MessageModel = mongoose.model("Message", schema);

export default MessageModel;