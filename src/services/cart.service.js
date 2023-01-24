import ProductModel from "../models/product.model.js";

export const addToCart = async (userId, _id) => {
    try {
        const product = await ProductModel.findOne({_id});
        product.cart.push({user: userId});
        const result = await product.save();
        // const result = await product.updateOne({_id}, product);
        return result;
    }
    catch (err) {
        throw new Error(err);
    }
}

export const deleteFromUserToCart = async (userId, _id) => {
    try {
        const result = await ProductModel.updateOne({_id}, {$pull: {cart: {user: userId }} });
        return result;
    }
    catch (err) {
        throw new Error(err);
    }
}

export const getProductsFromCart = async (userId) => {
    try {
        // const products = await ProductModel.find({cart: {$elemMatch: {user: "63cdd07de2db59a79ded8f17"}} }).lean();
        const products = await ProductModel.find({"cart.user": userId}).lean();
        return products;
    }
    catch (err) {
        throw new Error(err);
    }
}

export const countProductsOfCart = async (userId) => {
    try {
        const count = await ProductModel.countDocuments({cart: {user: userId}}).lean();
        console.log(count);
        return count;
    }
    catch (err) {
        throw new Error(err);
    }
}

export const deleteAll = async (userId) => {
    try {
        // const result = await ProductModel.updateOne({_id}, {$pull: {cart: {user: userId }} });
        const result = await ProductModel.updateMany({}, {$pull: {cart: {user: userId }} });
        return result;
    }
    catch (err) {
        throw new Error(err);
    }
}