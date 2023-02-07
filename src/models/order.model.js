import { v4 } from "uuid";
import mongoose from "mongoose";

const schema = new mongoose.Schema({
    deliverEstimatedTime: {
        type: Date,
        required: true,
        default: () => new Date(Date.now() + 10 * 24 * 60 * 60 * 1000)
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    productPurchased: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product"
    },

    deliverDirection: {
        type: String,
        required: true
    },

    isDeliverSet: {
        type: Boolean,
        default: false
    }
});

const OrderModel = mongoose.model("Order", schema);

export default OrderModel;