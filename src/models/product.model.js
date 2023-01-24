import mongoose from "mongoose";
import getUser from "./user.models.js";
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
        type: String,
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
        require: true,
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },

    cart: {
        type: [{
            user: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User"
            }
        }],
        
        default: []
    }
});

// schema.pre("save", async function (next) {
//     console.log(this.createdBy);
//     const user = await getUser.findOne({_id: this.createdBy}).lean();
//     console.log(user);
//     if (!user.isAdmin) throw new Error("permission denied");
//     next();
// });

const ProductModel = mongoose.model("Product", schema);

export default ProductModel;