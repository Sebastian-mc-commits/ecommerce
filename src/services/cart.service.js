import UserModel from "../models/user.models.js";

export const addToCart = async (_id, productId) => {
    try {
        const user = await UserModel.findOne({_id});
        user.cart.push({product: productId});
        const result = await user.save();
        return result;
    }
    catch (err) {
        throw new Error(err);
    }
}

export const deleteFromUserToCart = async (_id, productId) => {
    try {
        const result = await UserModel.updateOne({_id}, {$pull: {cart: {product: productId}} });
        return result;
    }
    catch (err) {
        throw new Error(err);
    }
}

export const getProductsFromCart = async (userId) => {
    try {
        const products = await UserModel.findOne({_id: userId}).populate("cart.product").lean();
        const getProducts = products.cart.map(product => product.product);
        return getProducts;
    }
    catch (err) {
        throw new Error(err);
    }
}

export const countProductsOfCart = async (userId) => {
    try {
        const count = await UserModel.countDocuments({userId}).lean();
        return count;
    }
    catch (err) {
        throw new Error(err);
    }
}

export const deleteAll = async (userId) => {
    try {
        // const result = await ProductModel.updateOne({_id}, {$pull: {cart: {user: userId }} });
        const result = await UserModel.updateOne({_id: userId}, {$set: {cart: [] } });
        console.log("result");
        console.log(result);
        return result;
    }
    catch (err) {
        throw new Error(err);
    }
}