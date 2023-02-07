import mongoose from "mongoose";

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

    timsetamp: {
        type: Date,
        default: Date.now
    }
});

const MessageModel = mongoose.model("Message", schema);

export default MessageModel;