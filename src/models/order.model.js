import { Schema, model } from "mongoose";

const schema = new Schema({
  deliverEstimatedTime: {
    type: Date,
    required: true,
    default: () => new Date(Date.now() + 10 * 24 * 60 * 60 * 1000)
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "users",
    required: true
  },
  productsPurchased: [
    {
      productPurchased: {
        type: Schema.Types.ObjectId,
        ref: "products"
      }
    }
  ],

  deliverDirection: {
    type: String,
    required: true
  },

  isDeliverSet: {
    type: Boolean,
    default: false
  }
});

const OrderModel = model("orders", schema);

export default OrderModel;
