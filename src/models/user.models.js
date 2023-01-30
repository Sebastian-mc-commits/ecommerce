import mongoose from "mongoose";
import bcryptjs from "bcryptjs";
import { emailRegex } from "../const/regex.js";
import ProductModel from "./product.model.js";

const schema = new mongoose.Schema({
    image: {
        type: String,
        required: true,
        default: "https://th.bing.com/th/id/R.6c6bff6f40d420c8a756db79a369681c?rik=suTO6OOqRmSAJQ&pid=ImgRaw&r=0"
    },

    name: {
        type: String,
        required: true
    },

    last_name: {
        type: String,
        required: true

    },

    email: {
        type: String,
        required: true,
        unique: true,
        
    },

    password: {
        type: String,
        required: true
    },

    isAdmin: {
        type: Boolean,
        required: true,
        default: false
    },

    isSuperAdmin: {
        type: Boolean,
        required: true,
        default: false
    },

    cart: {
        type: [{
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Product"
            }
        }],
        
        default: []
    },

    // cart: [{
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: "Product"
    // }]

});


schema.pre("save", async function (next){
    const salt = await bcryptjs.genSalt(10);
    this.password = await bcryptjs.hash(this.password, salt);
    next()
});

schema.methods.comparePassword = async function(password) {
    const isValidPassword = await bcryptjs.compare(password, this.password);
    console.log("isValidPassword")
    console.log(isValidPassword)
    console.log("password");
    console.log(this.password);
    console.log("password2");
    console.log(password);
   return isValidPassword; 
};

schema.methods.setToAdmin = async function() {
    this.isAdmin = true;
    return await this.save();
}

schema.pre("remove", async function(next) {
    if (this.isAdmin) {
        try {
            await ProductModel.deleteMany({createdBy: this._id});
        }
        catch(err) {
            return next(Error(err));
        }
    }
    next();
});

const UserModel = mongoose.model("User", schema);


export default UserModel;