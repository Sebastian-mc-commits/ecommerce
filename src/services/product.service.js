import ProductModel from "../models/product.model.js"
export const createProduct = async (id, data) => {
    try {
        // if (await ProductModel.find({code: data.code})) throw new Error("Code already in use");
        // const product = await ProductModel.create({createdBy: id, ...data});
        console.log(id);
        // let createdBy = mongoose.Types.ObjectId.isValid(id);
        // if (!createdBy) createdBy = mongoose.Types.ObjectId(id);

        const product = new ProductModel({...data, createdBy: id});
        const result = await product.save();
        // console.log(result);
        return result;
    }
    catch (err) {
        throw new Error(err);
    }
}

export const getProducts = async () => {
    try {
        // if (limit) {
        // const products = await ProductModel.find({}).skip(limit).limit(limit);
        // return products
        // }
        const products = await ProductModel.find().lean();
        return products;
    }
    catch (err) {
        throw new Error(err);
    }
}

export const getProductsAdminView = async (createdBy) => {
    try {
        const products = await ProductModel.find({createdBy}).populate("createdBy");
        return products;
    }
    catch (err) {
        throw new Error(err);
    }
}


export const getProduct = async (_id) => {
    try {
        const product = await ProductModel.findById({ _id });
        return product;
    }
    catch (err) {
        throw new Error(err);
    }
}

export const deleteProduct = async (_id) => {
    try {
        await ProductModel.deleteOne({ _id });
    }
    catch (err) {
        throw new Error(err);
    }
}

export const updateProduct = async (_id, data) => {
    try {
        const product = await ProductModel.findByIdAndUpdate({ _id }, data, { new: true });
        return product;
    }
    catch (err) {
        throw new Error(err);
    }
}