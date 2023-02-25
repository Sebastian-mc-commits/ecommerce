import mongoose from "mongoose";
import bcryptjs from "bcryptjs";
import { emailRegex } from "../const/regex.js";
import ProductModel from "./product.model.js";
import authMessages from "../utils/messages/messages.auth.utils.js";
import userMessages from "../utils/messages/messages.user.utils.js";
import serverMessages from "../utils/messages/messages.server.utils.js";

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
        type: String
    },

    auth: {
        email: {
            type: String,
            required: true,
            index: true,
            unique: true
        },

        provider: {
            type: String,
            required: true,
            default: "EmailPasswordAuth",
            enum: ["EmailPasswordAuth", "github", "google"]
        },

        password: {
            type: String,
            index: true
        },
    },

    // email: {
    //     type: String,
    //     required: true,
    //     unique: true,
    //     index: true

    // },


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
    },

    messages: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Message"
        }
    ]

});


schema.pre("save", async function (next) {

    if (this.auth.provider === "EmailPasswordAuth" && !!!this.auth.password) return next(authMessages.FAIL_PASSWORD);
    if (!this.isModified("auth.password") || this.auth.provider !== "EmailPasswordAuth") return next();
    const salt = await bcryptjs.genSalt(10);
    this.auth.password = await bcryptjs.hash(this.auth.password, salt);
    return next()
});

schema.methods.comparePassword = async function (password) {
    if (this.auth.provider !== "EmailPasswordAuth") return;
    const isValidPassword = await bcryptjs.compare(password, this.auth.password);
    return isValidPassword;
};

schema.methods.setToAdmin = async function (_id) {

    try {

        const user = await UserModel.findOne({ _id, "adminOptions.isAdmin": true });
        if (!user) throw new Error(userMessages.ADMIN_ONLY);

        const isAlreadySetByAdmin = [...user.superAdminOptions.usersSetToAdmin].includes(this._id);

        if (!isAlreadySetByAdmin) {
            user.superAdminOptions.usersSetToAdmin.push(this._id);
        }

        await Promise.all([
            await user.save(),
            this.adminOptions.isAdmin = true,
            await this.save()

        ]);


    }
    catch (err) {

        if (err.message !== userMessages.ADMIN_ONLY) {
            err.message = serverMessages.SERVER_FAILURE
        }
        throw new Error(err);
    }
}

schema.methods.unsetUserToAdmin = async function (_id) {
    try {

        const user = await UserModel.findOne({ _id, "adminOptions.isAdmin": true });
        if (!user) throw new Error(userMessages.ADMIN_ONLY);

        const isNotAnAdmin = [...user.superAdminOptions.usersSetToAdmin].includes(this._id);

        if (isNotAnAdmin) {
            user.superAdminOptions.usersSetToAdmin.pull(this._id);
        }

        await Promise.all([
            await user.save(),
            this.adminOptions.isAdmin = false,
            await this.save()

        ]);

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