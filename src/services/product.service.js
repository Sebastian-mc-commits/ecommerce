import ProductModel from "../models/product.model.js"
import UserModel from "../models/user.models.js";
import productMessages from "../utils/messages/messages.product.utils.js";
import serverMessages from "../utils/messages/messages.server.utils.js";
import userMessages from "../utils/messages/messages.user.utils.js";
import { Types } from "mongoose";

export const createProduct = async (id, data) => {
    try {
        // if (await ProductModel.find({code: data.code})) throw new Error("Code already in use");
        // const product = await ProductModel.create({createdBy: id, ...data});
        // let createdBy = mongoose.Types.ObjectId.isValid(id);
        // if (!createdBy) createdBy = mongoose.Types.ObjectId(id);

        const product = new ProductModel({ ...data, createdBy: id });
        await product.save();
        // console.log(result);
        return product;
    }
    catch (err) {
        if (err.message.split(":")[0] === "E11000 duplicate key error collection") {
            err.message = productMessages.DUPLICATE_ENTRY;
        }
        console.log(err.message);
        throw new Error(err);
    }
}

export const getProducts = async (page) => {
    try {
        // if (limit) {
        // const products = await ProductModel.find({}).skip(limit).limit(limit);
        // return products
        // }
        // const products = await ProductModel.find({deleted: {$exists: false}}).lean();
        const products = await ProductModel.paginate(
            { $or: [{ deleted: false }, { deleted: { $exists: false } }] },
            { limit: 5, page, lean: true }
        );

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
        // const products = await ProductModel.find({deleted: {$exists: false}}).lean();
        const products = await ProductModel.find({ $or: [{ deleted: false }, { deleted: { $exists: false } }] });
        return products;
    }
    catch (err) {
        throw new Error(err);
    }
}

export const handleApplyFilters = async ({ minPrice, maxPrice, sort, types }) => {

    try {
        let aggregate = [
            {
                $match: {
                    $or: [{ deleted: false }, { deleted: { $exists: false } }],
                    price: maxPrice !== minPrice && maxPrice > minPrice ? { $gte: parseInt(minPrice), $lte: parseInt(maxPrice) } : { $gte: parseInt(minPrice) },
                    categoryType: types?.length > 0 ? { $in: [types].flat(1) } : { $exists: true }
                }
            }
        ];

        if (!!sort) {
            const sortBy = sort.split(" ");
            aggregate.push({ $sort: { [sortBy[0]]: parseInt(sortBy[1]) } });
        }
        // if (maxPrice !== minPrice && maxPrice > minPrice) {
        //     aggregate.push({ $match: { price: { $gte: parseInt(minPrice), $lte: parseInt(maxPrice) } } });
        // } else {
        //     aggregate.push({ $match: { price: { $gte: parseInt(minPrice) } } });
        // }

        // if (!!types?.length) {
        //     aggregate.push({ $match: { categoryType: { $in: [types].flat(1) } } });
        // }

        aggregate.push({ $group: { _id: null, length: { $sum: 1 }, content: { $push: "$$ROOT" } } });

        console.log("types");
        console.log(types);
        const products = await ProductModel.aggregate(aggregate);
        return products
    } catch (err) {
        throw new Error(err);
    }
}

export const getDeletedProducts = async (userId) => {
    try {
        // userId = (await import("mongoose")).Types.ObjectId(userId);
        userId = Types.ObjectId(userId);

        const aggregate = [
            {
                $match: {
                    _id: userId,
                    "adminOptions.isAdmin": true
                }
            },

            {
                $limit: 1
            },

            {
                $lookup: {
                    from: "products",
                    localField: "adminOptions.deletedProducts",
                    foreignField: "_id",
                    as: "products"
                }
            },

            {
                $project: {
                    _id: 0,
                    "products._id": 1,
                    "products.title": 1,
                    "products.thumbnail": 1,
                    "products.code": 1
                }
            },

            // {
            //     $group: {
            //         _id: "",
            //         productsFound: { $sum: 1 },
            //         data: { $push: "$$ROOT" }
            //     }
            // }
        ];

        const [{ products }] = await UserModel.aggregate(aggregate);

        if (!products.length) throw new Error(userMessages.DATA_NOT_FOUND_REQUEST);

        return { products, count: products.length };
    }
    catch (err) {
        if (err.message !== userMessages.DATA_NOT_FOUND_REQUEST) {
            err.message = serverMessages.SERVER_FAILURE;
        }
        throw new Error(err.message);
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
        const product = await ProductModel.findOne({ _id, $or: [{ deleted: false }, { deleted: { $exists: false } }] });
        return product;
    }
    catch (err) {
        throw new Error(err);
    }
}

export const getCreatedByAdminProducts = async (_id) => {

    try {

        const products = await ProductModel.find({ createdBy: _id, $or: [{ deleted: false }, { deleted: { $exists: false } }] });
        return { products, count: products.length };
    }
    catch {
        throw new Error(serverMessages.SERVER_FAILURE);
    }
}

export const deleteProduct = async (userId, _id) => {
    try {
        // const result = await ProductModel.deleteOne({ _id }, { new: true });
        const product = await ProductModel.findOne({ _id, $or: [{ deleted: false }, { deleted: { $exists: false } }] });
        await product.handleDelete(userId);

        return product;
    }
    catch (err) {
        throw new Error(serverMessages.SERVER_FAILURE);
    }
}

export const irreversibleDelete = async (userId, _id) => {
    try {
        // const result = await ProductModel.deleteOne({ _id }, { new: true });
        const product = await ProductModel.findOne({ _id, deleted: true });
        await product.irreversibleDeleteProduct(userId);
        return product;
    }
    catch (err) {
        throw new Error(serverMessages.SERVER_FAILURE);
    }
}

export const restoreDeletedProduct = async (userId, _id) => {
    try {
        // const result = await ProductModel.deleteOne({ _id }, { new: true });
        const product = await ProductModel.findOne({ _id });
        await product.restoreProduct(userId);
        return product;
    }
    catch (err) {
        throw new Error(serverMessages.SERVER_FAILURE);
    }
}

export const updateProduct = async (_id, data) => {
    try {
        const product = await ProductModel.findByIdAndUpdate({ _id, $or: [{ deleted: false }, { deleted: { $exists: false } }] }, data, { new: true });
        return product;
    }
    catch {
        throw new Error(serverMessages.SERVER_FAILURE);
    }
}

export const getAvailableCategories = async () => {
    try {
        const categories = ProductModel.distinct("categoryType", { $or: [{ deleted: false }, { deleted: { $exists: false } }] });
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
                $match: {
                    $or: [{ deleted: false }, { deleted: { $exists: false } }]
                }
            },

            {
                $sort: { price: -1 }
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

export const getRandomProduct = async (fields) => {

    if (!!!fields.length) return [];

    try {
        let $match = {
            _id: {
                $nin: []
            },

            categoryType: {
                $in: []
            },

            $or: [{ deleted: false }, { deleted: { $exists: false } }]
        }

        for (let { _id, categoryType } of fields) {
            $match._id.$nin.push(_id);
            $match.categoryType.$in.push(categoryType);
        }

        const aggregate = [
            {
                $match
            },

            {
                $sample: {
                    size: fields.length
                }
            },

            {
                $project: {
                    title: 1,
                    price: 1,
                    thumbnail: 1
                }
            }
        ];

        const products = await ProductModel.aggregate(aggregate);
        return [...products];
    }
    catch {
        throw new Error(serverMessages.SERVER_FAILURE);
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


// const data = [
//     {
//         title: "Product 1",
//         description: "This is the description for product 1",
//         price: 10.99,
//         thumbnail: "https://i.pinimg.com/originals/73/a6/c4/73a6c4e772e4aad4e6ec37de2f52af74.png",
//         code: "PROD001",
//         stock: 100,
//         status: true,
//         createdBy: "63e022a6040934599eb02a27",
//         comments: [],
//         categoryType: "Electronics"
//     },
//     {
//         title: "Product 2",
//         description: "This is the description for product 2",
//         price: 20.99,
//         thumbnail: "https://i.pinimg.com/originals/73/a6/c4/73a6c4e772e4aad4e6ec37de2f52af74.png",
//         code: "PROD002",
//         stock: 50,
//         status: true,
//         createdBy: "63e022a6040934599eb02a27",
//         comments: [],
//         categoryType: "Clothing"
//     },
//     {
//         title: "Product 3",
//         description: "This is the description for product 3",
//         price: 15.99,
//         thumbnail: "https://i.pinimg.com/originals/73/a6/c4/73a6c4e772e4aad4e6ec37de2f52af74.png",
//         code: "PROD003",
//         stock: 75,
//         status: true,
//         createdBy: "63e022a6040934599eb02a27",
//         comments: [],
//         categoryType: "Food"
//     },
//     {
//         title: "Product 4",
//         description: "This is the description for product 4",
//         price: 30.99,
//         thumbnail: "https://i.pinimg.com/originals/73/a6/c4/73a6c4e772e4aad4e6ec37de2f52af74.png",
//         code: "PROD004",
//         stock: 25,
//         status: true,
//         createdBy: "63e022a6040934599eb02a27",
//         comments: [],
//         categoryType: "Home"
//     },
//     {
//         title: "Product 5",
//         description: "This is the description for product 5",
//         price: 5.99,
//         thumbnail: "https://i.pinimg.com/originals/73/a6/c4/73a6c4e772e4aad4e6ec37de2f52af74.png",
//         code: "PROD005",
//         stock: 200,
//         status: true,
//         createdBy: "63e022a6040934599eb02a27",
//         comments: [],
//         categoryType: "Electronics"
//     },
//     {
//         title: "Product 6",
//         description: "This is the description for product 6",
//         price: 12.99,
//         thumbnail: "https://i.pinimg.com/originals/73/a6/c4/73a6c4e772e4aad4e6ec37de2f52af74.png",
//         code: "PROD006",
//         stock: 60,
//         status: true,
//         createdBy: "63e022a6040934599eb02a27",
//         comments: [],
//         categoryType: "example"
//     },

//     {
//         title: "Wireless Bluetooth Earbuds",
//         description: "High-quality earbuds with advanced Bluetooth technology for wireless connectivity.",
//         price: 79.99,
//         thumbnail: "https://images.unsplash.com/photo-1584210860820-ea5d7c1f35d1",
//         code: "WB-987",
//         stock: 50,
//         status: true,
//         createdBy: "63e022a6040934599eb02a27",
//         comments: [],
//         categoryType: "Electronics"
//     },
//     {
//         title: "Large Gaming Mousepad",
//         description: "Extra-large mousepad for gaming enthusiasts.",
//         price: 29.99,
//         thumbnail: "https://images.unsplash.com/photo-1613672787458-6af53e6b870f",
//         code: "GM-762",
//         stock: 100,
//         status: true,
//         createdBy: "63e022a6040934599eb02a27",
//         comments: [],
//         categoryType: "Computer Accessories"
//     },
//     {
//         title: "Portable Power Bank",
//         description: "A compact and powerful power bank to charge your devices on-the-go.",
//         price: 39.99,
//         thumbnail: "https://images.unsplash.com/photo-1549298916-78db4aea3f3f",
//         code: "PB-312",
//         stock: 20,
//         status: true,
//         createdBy: "63e022a6040934599eb02a27",
//         comments: [],
//         categoryType: "Electronics"
//     },
//     {
//         title: "Leather Briefcase",
//         description: "A sleek and stylish leather briefcase for professionals.",
//         price: 149.99,
//         thumbnail: "https://images.unsplash.com/photo-1571081214584-8d4f5084d4f3",
//         code: "LB-543",
//         stock: 10,
//         status: true,
//         createdBy: "63e022a6040934599eb02a27",
//         comments: [],
//         categoryType: "Fashion"
//     },
//     {
//         title: "Smart Thermostat",
//         description: "A smart thermostat with voice control and energy-saving features.",
//         price: 199.99,
//         thumbnail: "https://images.unsplash.com/photo-1526880795257-2b22af9e7207",
//         code: "ST-217",
//         stock: 5,
//         status: true,
//         createdBy: "63e022a6040934599eb02a27",
//         comments: [],
//         categoryType: "Home Appliances"
//     },
//     {
//         title: "Waterproof Hiking Boots",
//         description: "Sturdy and comfortable hiking boots for all-weather conditions.",
//         price: 129.99,
//         thumbnail: "https://images.unsplash.com/photo-1558879374-af71f9de9f46",
//         code: "HB-876",
//         stock: 15,
//         status: true,
//         createdBy: "63e022a6040934599eb02a27",
//         comments: [],
//         categoryType: "Footwear"
//     },
//     {
//         title: "Outdoor Gas Grill",
//         description: "A high-quality gas grill for outdoor cooking and entertaining.",
//         price: 599.99,
//         thumbnail: "https://images.unsplash.com/photo-1603462447055-13a5ed5ea5a5",
//         code: "GG-124",
//         stock: 3,
//         status: true,
//         createdBy: "63e022a6040934599eb02a27",
//         comments: [],
//         categoryType: "wood"
//     },

//     {
//         title: "Product 8",
//         description: "Description for product 8",
//         price: 15.99,
//         thumbnail: "https://i.pinimg.com/originals/73/a6/c4/73a6c4e772e4aad4e6ec37de2f52af74.png",
//         code: "P008",
//         stock: 75,
//         status: true,
//         createdBy: "63e022a6040934599eb02a27",
//         comments: [],
//         categoryType: "Category 1"
//     },
//     {
//         title: "Product 9",
//         description: "Description for product 9",
//         price: 8.99,
//         thumbnail: "https://i.pinimg.com/originals/73/a6/c4/73a6c4e772e4aad4e6ec37de2f52af74.png",
//         code: "P009",
//         stock: 250,
//         status: true,
//         createdBy: "63e022a6040934599eb02a27",
//         comments: [],
//         categoryType: "Category 2"
//     },
//     {
//         title: "Product 10",
//         description: "Description for product 10",
//         price: 29.99,
//         thumbnail: "https://i.pinimg.com/originals/73/a6/c4/73a6c4e772e4aad4e6ec37de2f52af74.png",
//         code: "P010",
//         stock: 50,
//         status: true,
//         createdBy: "63e022a6040934599eb02a27",
//         comments: [],
//         categoryType: "Category 3"
//     },
//     {
//         title: "Product 11",
//         description: "Description for product 11",
//         price: 12.49,
//         thumbnail: "https://i.pinimg.com/originals/73/a6/c4/73a6c4e772e4aad4e6ec37de2f52af74.png",
//         code: "P011",
//         stock: 100,
//         status: true,
//         createdBy: "63e022a6040934599eb02a27",
//         comments: [],
//         categoryType: "Category 1"
//     },
//     {
//         title: "Product 12",
//         description: "Description for product 12",
//         price: 21.99,
//         thumbnail: "https://i.pinimg.com/originals/73/a6/c4/73a6c4e772e4aad4e6ec37de2f52af74.png",
//         code: "P012",
//         stock: 200,
//         status: true,
//         createdBy: "63e022a6040934599eb02a27",
//         comments: [],
//         categoryType: "Category 2"
//     },
//     {
//         title: "Product 13",
//         description: "Description for product 13",
//         price: 14.99,
//         thumbnail: "https://i.pinimg.com/originals/73/a6/c4/73a6c4e772e4aad4e6ec37de2f52af74.png",
//         code: "P013",
//         stock: 150,
//         status: true,
//         createdBy: "63e022a6040934599eb02a27",
//         comments: [],
//         categoryType: "Category 3"
//     }

// ]



// const execute = async () => {
//     try {
//         await ProductModel.insertMany(data);
//         console.log("work");
//     }
//     catch (err) {
//         console.log("Error");
//         console.log(err.message);
//     }
// };

// execute().then(data => console.log(data)).catch(data => console.log(data));