import { Op, fn, col, QueryTypes } from "sequelize";
import customErrorCodes from "../../utils/enums/errorCodes.custom.enum.js";
import tryCatchHandler from "../../utils/functions/tryCatch.utils.js";
import DeletedProductsModel from "../../models/mysql/adminOptions/deletedProducts.mysql.models.js";
import userMessages from "../../utils/messages/messages.user.utils.js";
import ErrorHandler from "../../utils/classes/errorHandler.utils.js";
import errorCodes from "../../utils/enums/errorCodes.enum.js";
import productMessages from "../../utils/messages/messages.product.utils.js";
import sequelize from "../../config/mysqlDB/db.config.js";
import { ProductModel } from "../../models/mysql/index.js";
import config from "../../config/config.js";

const { DATABASE_OPS } = config;
class ProductService {
  createProduct = (createdBy, data) => {
    return tryCatchHandler({
      fn: async () => {
        const { dataValues: product } = await ProductModel.create(
          { ...data, createdBy },
          {
            returning: true
          }
        );
        return product;
      }
    });
  };

  getProducts = (page) => {
    return tryCatchHandler({
      evaluateCode: customErrorCodes.DEFAULT,

      fn: async () => {
        const paginate = {
          limit: DATABASE_OPS.PAGINATE
        };

        if (page > 1) {
          paginate.offset = DATABASE_OPS.PAGINATE * page;
        }

        const products = await ProductModel.findAll({
          where: {
            isDeleted: false
          },

          ...paginate
        });

        return products;
      }
    });
  };

  getAllProducts = (skip = 0) => {
    return tryCatchHandler({
      evaluateCode: customErrorCodes.DEFAULT,

      fn: async () => {
        const products = await ProductModel.findAll({
          where: {
            isDeleted: false
          },

          offset: skip,
          limit: DATABASE_OPS.PAGINATE * 2
        });

        return products;
      }
    });
  };

  handleApplyFilters = ({ minPrice, maxPrice, sort, types }) => {
    return tryCatchHandler({
      evaluateCode: customErrorCodes.DEFAULT,

      fn: async () => {
        const where = {
          isDeleted: false,
          price:
            maxPrice !== minPrice && maxPrice > minPrice
              ? {
                  [Op.gte]: +minPrice,
                  [Op.lte]: +maxPrice
                }
              : {
                  [Op.gte]: +minPrice
                },

          categoryType:
            types?.length > 0
              ? {
                  [Op.in]: [types].flat(1)
                }
              : {
                  [Op.is]: "not null"
                }
        };

        const orderBy = sort?.split(" ") || [];
        const products = await ProductModel.findAll({
          where,
          ...(orderBy.length
            ? {
                order: [
                  [orderBy[0], parseInt(orderBy[1]) === -1 ? "DESC" : "ASC"]
                ]
              }
            : {})
        });

        return products;
      }
    });
  };

  getDeletedProducts = (userId) => {
    return tryCatchHandler({
      evaluateCode: customErrorCodes.DEFAULT,

      fn: async () => {
        const products = await DeletedProductsModel.findAll({
          where: {
            adminId: userId
          },

          include: {
            model: ProductModel,
            required: true
          },

          // raw: true,

          attributes: {
            // include: [
            //   ...Object.values(productValues).map((p) => {
            //     return [literal(`product.${p}`), p];
            //   })
            // ],
            exclude: ["adminId", "productDeleted"]
          }
        });

        if (!products.length)
          throw new ErrorHandler(
            userMessages.DATA_NOT_FOUND_REQUEST,
            "",
            errorCodes.BAD_REQUEST,
            customErrorCodes.INVALID_REQUEST
          );

        return products;
      }
    });
  };

  getProduct = (_id) => {
    return tryCatchHandler({
      fn: async () => {
        const { dataValues: product } = await ProductModel.findOne({
          where: {
            id: _id,
            isDeleted: false
          }
          // include: {
          //   model
          // }
        });
        return product;
      }
    });
  };

  getCreatedProductsByAdmin = (_id, skip = 0) => {
    return tryCatchHandler({
      evaluateCode: customErrorCodes.DEFAULT,

      fn: async () => {
        const products = await ProductModel.findAll({
          where: { createdBy: _id, isDeleted: false },
          limit: DATABASE_OPS.PAGINATE,
          offset: skip
        });

        return products;
      }
    });
  };

  deleteProduct = (userId, _id) => {
    return tryCatchHandler({
      fn: async () => {
        const product = await ProductModel.findOne({
          where: {
            id: _id,
            isDeleted: false
          }
        });

        if (!product) {
          throw new ErrorHandler(
            productMessages.NOT_FOUND,
            "",
            errorCodes.BAD_REQUEST,
            customErrorCodes.INVALID_REQUEST
          );
        }
        await product.handleDelete(userId, _id);

        return {
          ...product.dataValues,
          isDeleted: true
        };
      }
    });
  };

  irreversibleDelete = (userId, _id) => {
    return tryCatchHandler({
      evaluateCode: customErrorCodes.DEFAULT,

      fn: async () => {
        const product = await ProductModel.findByPk(_id);
        if (!product) {
          throw new ErrorHandler(
            productMessages.FIELD_ERROR,
            "",
            errorCodes.BAD_REQUEST,
            customErrorCodes.INVALID_REQUEST
          );
        }
        await product.irreversibleDeleteProduct(userId, _id);

        return product.dataValues;
      }
    });
  };

  restoreDeletedProduct = (userId, _id) => {
    return tryCatchHandler({
      fn: async () => {
        const product = await ProductModel.findOne({
          where: {
            id: _id,
            isDeleted: true
          }
        });
        if (!product) {
          throw new ErrorHandler(
            productMessages.FIELD_ERROR,
            "",
            errorCodes.BAD_REQUEST,
            customErrorCodes.INVALID_REQUEST
          );
        }
        await product.restoreDeletedProduct(userId);
        return {
          ...product.dataValues,
          isDeleted: false
        };
      }
    });
  };

  updateProduct = (id, data) => {
    return tryCatchHandler({
      evaluateCode: customErrorCodes.DEFAULT,

      fn: async () => {
        const product = await ProductModel.update(data, {
          where: {
            id
          }
        });
        return product;
      }
    });
  };

  getAvailableCategories = () => {
    return tryCatchHandler({
      evaluateCode: customErrorCodes.DEFAULT,

      fn: async () => {
        const categories = await ProductModel.findAll({
          where: {
            isDeleted: false
          },

          attributes: [[fn("DISTINCT", col("categoryType")), "categoryType"]]
        });

        return categories;
      }
    });
  };

  getTheHighestPrice = () => {
    return tryCatchHandler({
      evaluateCode: customErrorCodes.DEFAULT,

      fn: async () => {
        //I like this more
        const [price] = await sequelize.query(
          "SELECT MAX(price) as maxPrice FROM products WHERE isDeleted = :deleted",
          {
            replacements: { deleted: false },
            type: QueryTypes.SELECT
          }
        );

        // const {dataValues} = await ProductModel.findAll({
        //   attributes: [
        //     [fn("MAX", col("price")), "maxPrice"]
        //   ]
        // })

        return price;
      }
    });
  };

  getRandomProduct = (fields) => {
    if (!fields.length) return [];

    return tryCatchHandler({
      evaluateCode: customErrorCodes.DEFAULT,

      fn: async () => {
        const products = await ProductModel.findAll({
          where: {
            isDeleted: false,
            id: { [Op.not]: [...fields._id] },
            categoryType: { [Op.in]: [...fields.categoryType] }
          },

          order: sequelize.literal("RAND()"),
          limit: fields.length
        });

        return [...products];
      }
    });
  };
}

export default new ProductService();
