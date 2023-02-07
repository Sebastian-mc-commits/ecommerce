import ProductModel from "../models/product.model.js"
export const createProduct = async (id, data) => {
    try {
        // if (await ProductModel.find({code: data.code})) throw new Error("Code already in use");
        // const product = await ProductModel.create({createdBy: id, ...data});
        // let createdBy = mongoose.Types.ObjectId.isValid(id);
        // if (!createdBy) createdBy = mongoose.Types.ObjectId(id);

        const product = new ProductModel({ ...data, createdBy: id });
        const result = await product.save();
        // console.log(result);
        return result;
    }
    catch (err) {
        throw new Error(err);
    }
}

export const getProducts = async (page) => {
    try {
        // if (limit) {
        // const products = await ProductModel.find({}).skip(limit).limit(limit);
        // return products
        // }
        // const products = await ProductModel.find({deleteAt: {$exists: false}}).lean();
        const products = await ProductModel.paginate({ deleteAt: { $exists: false } }, { limit: 5, page, lean: true });
        return products;
    }
    catch (err) {
        throw new Error(err);
    }
}

export const getAllProducts = async () => {
    try {
        // if (limit) {
        // const products = await ProductModel.find({}).skip(limit).limit(limit);
        // return products
        // }
        // const products = await ProductModel.find({deleteAt: {$exists: false}}).lean();
        const products = await ProductModel.find({ deleteAt: { $exists: false }});
        return products;
    }
    catch (err) {
        throw new Error(err);
    }
}

export const handleApplyFilters = async ({minPrice, maxPrice, sort, types}) => {

    try {
        let aggregate = [];
        
        if (!!sort) {
            const sortBy = sort.split(" ");
            aggregate.push({ $sort: { [sortBy[0]]: parseInt(sortBy[1]) } });
        }
        if (maxPrice !== minPrice && maxPrice > minPrice) {
            aggregate.push({ $match: { price: { $gte: parseInt(minPrice), $lte: parseInt(maxPrice) } } });
        } else {
            aggregate.push({ $match: { price: { $gte: parseInt(minPrice) } } });
        }

        if (!!types?.length) {
            aggregate.push({ $match: { categoryType: { $in: [types].flat(1) } } });
        }
        
        aggregate.push({$group: {_id: null, length: {$sum: 1}, content: {$push: "$$ROOT"} } });
        const products = await ProductModel.aggregate(aggregate);
        return products
    } catch (err) {
        throw new Error(err);
    }
}

export const getProductsAdminView = async (createdBy) => {
    try {
        const products = await ProductModel.find({ createdBy }).populate("createdBy");
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

export const getAvailableCategories = async () => {
    try {
        const categories = ProductModel.distinct("categoryType");
        return categories;
    }
    catch (err) {
        throw new Error(err);
    }
}

export const getTheHighestPrice = async () => {
    try {
        const aggregate = [
            {
                $sort: {price: -1}
            },
            {
                $limit: 1
            },
            {
                $project: {
                    _id: 0,
                    price: 1
                }
            }
        ];
        const price = ProductModel.aggregate(aggregate);
        return price;
    }
    catch (err) {
        throw new Error(err);
    }
}
// export const updatemany = async () => {
//     try {
//         const random = Math.ceil(Math.random() * 3);
//         const word = ["clothes", "food", "makeup", "videogames", "toys", "technology"];
//         const product = await ProductModel.updateMany({}, {$set: {categoryType: ["clothes", "food", "makeup", "videogames", "toys", "technology"][Math.ceil(Math.random() * 3)]} }, { new: true });
//         return product;
//     }
//     catch (err) {
//         throw new Error(err);
//     }
// }

// console.log("hi");
// getPrice("max").then(data => console.log(data)).catch(() => console.log("Something went wrong"));