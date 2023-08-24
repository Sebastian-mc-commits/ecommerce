import config from "../config/config.js";
import AdminModel from "../models/admin.model.js";
import ProductModel from "../models/product.model.js";
import customErrorCodes from "../utils/enums/errorCodes.custom.enum.js";
import tryCatchHandler from "../utils/functions/tryCatch.utils.js";
import userMessages from "../utils/messages/messages.user.utils.js";
import { Types } from "mongoose";

const { DATABASE_OPS } = config;
export const createProduct = (id, data) => {
  return tryCatchHandler({
    fn: async () => {
      const product = new ProductModel({ ...data, createdBy: id });
      await product.save();
      return product;
    }
  });
};

export const getProducts = async (page) => {
  return await tryCatchHandler({
    fn: async () => {
      const products = await ProductModel.paginate(
        {
          $or: [{ deleted: false }, { deleted: { $exists: false } }]
        },
        {
          limit: DATABASE_OPS.PAGINATE,
          page,
          select: {
            comments: 0
          }
        }
      );

      return products;
    }
  });
};

export const getAllProducts = async (skip) => {
  return await tryCatchHandler({
    evaluateCode: customErrorCodes.DEFAULT,

    fn: async () => {
      const products = await ProductModel.find({
        $or: [{ deleted: false }, { deleted: { $exists: false } }]
      })
        .skip(skip)
        .limit(DATABASE_OPS.PAGINATE);
      return products;
    }
  });
};

export const handleApplyFilters = async ({
  minPrice,
  maxPrice,
  sort,
  types
}) => {
  return await tryCatchHandler({
    evaluateCode: customErrorCodes.DEFAULT,

    fn: async () => {
      let aggregate = [
        {
          $match: {
            $or: [{ deleted: false }, { deleted: { $exists: false } }],
            price:
              maxPrice !== minPrice && maxPrice > minPrice
                ? { $gte: parseInt(minPrice), $lte: parseInt(maxPrice) }
                : { $gte: parseInt(minPrice) },
            categoryType:
              types?.length > 0 ? { $in: [types].flat(1) } : { $exists: true }
          }
        }
      ];

      if (!!sort) {
        const sortBy = sort.split(" ");
        aggregate.push({ $sort: { [sortBy[0]]: parseInt(sortBy[1]) } });
      }

      aggregate.push({
        $group: { _id: null, length: { $sum: 1 }, content: { $push: "$$ROOT" } }
      });
      const products = await ProductModel.aggregate(aggregate);
      return products;
    }
  });
};

export const getDeletedProducts = async (userId, skip) => {
  return await tryCatchHandler({
    evaluateCode: customErrorCodes.DEFAULT,

    fn: async () => {
      userId = Types.ObjectId(userId);

      const aggregate = [
        {
          $match: {
            _id: userId,
            "adminOptions.isAdmin": true
          }
        },

        {
          $lookup: {
            from: "products",
            localField: "deletedProducts",
            foreignField: "_id",
            as: "products"
          }
        },

        {
          $project: {
            _id: 0,
            admin: 0,
            "products._id": 1,
            "products.title": 1,
            "products.thumbnail": 1,
            "products.code": 1
          }
        },

        {
          $skip: skip
        },

        {
          $limit: DATABASE_OPS.PAGINATE
        }
      ];

      const [{ products }] = await AdminModel.aggregate(aggregate);

      if (!products.length)
        throw new Error(userMessages.DATA_NOT_FOUND_REQUEST);

      return products;
    }
  });
};

export const getProduct = async (_id) => {
  const aggregate = [
    {
      $match: {
        _id: new Types.ObjectId(_id)
      }
    },
    {
      $lookup: {
        from: "comments",
        localField: "comments",
        foreignField: "_id",
        as: "comments"
      }
    },
    {
      $unwind: "$comments"
    },
    {
      $lookup: {
        from: "users",
        localField: "comments.userCreator",
        foreignField: "_id",
        as: "comments.userCreator"
      }
    },
    {
      $unwind: "$comments.userCreator"
    },
    {
      $group: {
        _id: "$_id",
        title: { $first: "$title" },
        description: { $first: "$description" },
        price: { $first: "$price" },
        thumbnail: { $first: "$thumbnail" },
        code: { $first: "$code" },
        stock: { $first: "$stock" },
        status: { $first: "$status" },
        createdBy: { $first: "$createdBy" },
        categoryType: { $first: "$categoryType" },
        deleted: { $first: "$deleted" },
        __v: { $first: "$__v" },
        comments: {
          $push: {
            _id: "$comments._id",
            rate: "$comments.rate",
            message: "$comments.message",
            userCreator: "$comments.userCreator"
          }
        }
      }
    },
    {
      $project: {
        "comments.userCreator.auth": 0,
        "comments.userCreator.cart": 0,
        "comments.userCreator.orders": 0,
        "comments.userCreator.messages": 0
      }
    }
  ];

  return await tryCatchHandler({
    evaluateCode: customErrorCodes.DEFAULT,

    fn: async () => {
      // const product = await ProductModel.findOne({
      //   _id,
      //   $or: [{ deleted: false }, { deleted: { $exists: false } }]
      // }).populate({
      //   path: "comments",
      //   populate: {
      //     path: "userCreator",
      //     model: users
      //   }
      // });

      const product = ProductModel.aggregate(aggregate);
      return product;
    }
  });
};

export const getCreatedProductsByAdmin = async (_id, skip) => {
  return await tryCatchHandler({
    fn: async () => {
      const products = await ProductModel.find({
        createdBy: _id,
        $or: [{ deleted: false }, { deleted: { $exists: false } }]
      })
        .skip(skip)
        .limit(DATABASE_OPS.PAGINATE);
      return products;
    }
  });
};

export const deleteProduct = async (userId, _id) => {
  return await tryCatchHandler({
    fn: async () => {
      const product = await ProductModel.findOne({
        _id,
        $or: [{ deleted: false }, { deleted: { $exists: false } }]
      });
      await product.handleDelete(userId);

      return product;
    }
  });
};

export const irreversibleDelete = async (userId, _id) => {
  return await tryCatchHandler({
    fn: async () => {
      const product = await ProductModel.findOne({ _id, deleted: true });
      await product.irreversibleDeleteProduct(userId);
      return product;
    }
  });
};

export const restoreDeletedProduct = async (userId, _id) => {
  return await tryCatchHandler({
    fn: async () => {
      const product = await ProductModel.findOne({ _id });
      await product.restoreProduct(userId);
      return product;
    }
  });
};

export const updateProduct = async (_id, data) => {
  return await tryCatchHandler({
    fn: async () => {
      const product = await ProductModel.findByIdAndUpdate(
        { _id, $or: [{ deleted: false }, { deleted: { $exists: false } }] },
        data,
        { new: true }
      );
      return product;
    }
  });
};

export const getAvailableCategories = async () => {
  return await tryCatchHandler({
    evaluateCode: customErrorCodes.DEFAULT,

    fn: async () => {
      const categories = await ProductModel.distinct("categoryType", {
        $or: [{ deleted: false }, { deleted: { $exists: false } }]
      });
      return categories;
    }
  });
};

export const getTheHighestPrice = async () => {
  return await tryCatchHandler({
    evaluateCode: customErrorCodes.DEFAULT,

    fn: async () => {
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
  });
};

export const getRandomProduct = async (fields) => {
  if (!fields.length) return [];

  return await tryCatchHandler({
    evaluateCode: customErrorCodes.DEFAULT,

    fn: async () => {
      let $match = {
        _id: {
          $nin: []
        },

        categoryType: {
          $in: []
        },

        $or: [{ deleted: false }, { deleted: { $exists: false } }]
      };

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
  });
};
