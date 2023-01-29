import CommentModel from "../models/comment.model.js";
import ProductModel from "../models/product.model.js";

export const createComment = async (productRef, data) => {
    try {
        const comment = new CommentModel({...data});
        // const comment = CommentModel.create({...data, createdBy});
        const result = await comment.save(productRef);
        return result;
    }
    catch (err) {
        throw new Error(err);
    }
}

export const getComments = async (_id) => {

    try {
        const comments = await ProductModel.findOne({_id}).populate({path: "comments", populate: {path: "userCreator"} }).lean();

        console.log("comments from the service");
        console.log(comments);
        return comments;
    }
    catch (err) {
        throw new Error(err);
    }
}

export const editComment = async (userCreator, data) => {
    try {
        const product = await CommentModel.findOneAndUpdate({ userCreator }, data, { new: true });
        return product;
    }
    catch (err) {
        throw new Error(err);
    }
}

export const getCommentsOfUser = async (userCreator) => {
    try {
        const product = await CommentModel.find({userCreator});
        return product;
    }
    catch (err) {
        throw new Error(err);
    }
}