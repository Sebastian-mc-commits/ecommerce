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
        index: true

    },

    password: {
        type: String,
        required: true,
        index: true
    },

    adminOptions: {
        isAdmin: {
            type: Boolean,
            default: false,
            required: true
        },

        deletedProducts: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
            unique: true
        }],
        
        updatedProducts: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
            unique: true
        }]
    },
    
    superAdminOptions: {
        isSuperAdmin: {
            type: Boolean,
            default: false,
            required: true
        },
        usersSetToAdmin: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            unique: true
        }],

        // usersUnsetToAdmin: [{
        //     type: mongoose.Schema.Types.ObjectId,
        //     ref: "User"
        // }]
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

    orders: {
        type: [{
            order: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Order"
            }
        }],

        default: []
    }
    // cart: [{
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: "Product"
    // }]

});


schema.pre("save", async function (next) {
    console.log("is modified");
    console.log(!this.isModified("password"));
    if (!this.isModified("password")) return next();
    const salt = await bcryptjs.genSalt(10);
    UserModel.create
    this.password = await bcryptjs.hash(this.password, salt);
    next()
});

schema.methods.comparePassword = async function (password) {
    const isValidPassword = await bcryptjs.compare(password, this.password);
    return isValidPassword;
};

schema.methods.setToAdmin = async function (_id) {

    try {
        await UserModel.updateOne({ _id }, {$push: {"superAdminOptions.usersSetToAdmin": this._id } } );
        this.adminOptions.isAdmin = true;
        return await this.save();
    }
    catch (err) {
        throw new Error(err);
    }
}

schema.methods.unsetUserToAdmin = async function (_id) {
    try {
        await UserModel.updateOne({ _id }, {$pull: {"superAdminOptions.usersSetToAdmin": this._id } } );
        this.adminOptions.isAdmin = false;
        return await this.save();
    }
    catch (err) {
        throw new Error(err);
    }
}

schema.pre("remove", async function (next) {
    if (this.adminOptions.isAdmin) {
        try {
            await ProductModel.deleteMany({ createdBy: this._id });
        }
        catch (err) {
            return next(Error(err));
        }
    }
    next();
});

const UserModel = mongoose.model("User", schema);


export default UserModel;

const students = [{ "first_name": "John", "last_name": "Doe", "email": "johndoe@example.com", "gender": "male", "grade": "A", "group": "1" },
{ "first_name": "Jane", "last_name": "Doe", "email": "janedoe@example.com", "gender": "female", "grade": "B", "group": "2" },
{ "first_name": "Bob", "last_name": "Smith", "email": "bobsmith@example.com", "gender": "male", "grade": "C", "group": "1" },
{ "first_name": "Alice", "last_name": "Johnson", "email": "alicejohnson@example.com", "gender": "female", "grade": "A", "group": "2" },
{ "first_name": "Charlie", "last_name": "Williams", "email": "charliewilliams@example.com", "gender": "male", "grade": "B", "group": "1" },
{ "first_name": "Emma", "last_name": "Jones", "email": "emmajones@example.com", "gender": "female", "grade": "C", "group": "2" },
{ "first_name": "Sebastian", "last_name": "Mc", "email": "sm9349168gmail.com", "gender": "male", "grade": "A", "group": "2" }]