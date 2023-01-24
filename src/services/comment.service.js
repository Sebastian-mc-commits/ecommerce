import CommentModel from "../models/comment.model.js";

export const createComment = async (createdBy, productRef, data) => {
    try {
        const comment = new CommentModel({...data, createdBy, productRef});
        const result = comment.save();
        return result;
    }
    catch (err) {
        throw new Error(err);
    }
}

export const getComments = async (productRef) => {
    try {
        const comments = await CommentModel.find({productRef});

        const eachComment = [...comments].map(comment => {
            const data = {
                rate: comment.rate,
                header: comment.header,
                message: comment.message,
                createdBy: comment.createdBy
            }
            return data;
        });
        const parseComments = {
            product: getComments.productRef[0],
            eachComment
        }
        // const mapComments = comments.map(comment => comment.productRef);
        return parseComments;
    }
    catch (err) {
        throw new Error(err);
    }
}

export const editComment = async ({productRef, createdBy}, data) => {
    try {
        const product = await CommentModel.findOneAndUpdate({ productRef, createdBy }, data, { new: true });
        return product;
    }
    catch (err) {
        throw new Error(err);
    }
}

export const getCommentsOfUser = async (createdBy) => {
    try {
        const product = await CommentModel.find({createdBy});
        return product;
    }
    catch (err) {
        throw new Error(err);
    }
}