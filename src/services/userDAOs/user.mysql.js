import { providerEnum } from "../../utils/enums/provider.enum.js";
import tryCatchHandler from "../../utils/functions/tryCatch.utils.js";
import bcrypt from "bcryptjs";
import authMessages from "../../utils/messages/messages.auth.utils.js";
import errorCodes from "../../utils/enums/errorCodes.enum.js";
import customErrorCodes from "../../utils/enums/errorCodes.custom.enum.js";
import userMessages from "../../utils/messages/messages.user.utils.js";
import ErrorHandler from "../../utils/classes/errorHandler.utils.js";
import AdminModel from "../../models/mysql/admin.mysql.models.js";
import DeletedProductsModel from "../../models/mysql/adminOptions/deletedProducts.mysql.models.js";
import { ProductModel, UserModel } from "../../models/mysql/index.js";

class UserService {
  getUser = async ({ auth }) => {
    return await tryCatchHandler({
      fn: async () => {
        const user = await UserModel.findOne({
          where: {
            email: auth.email,
            provider: providerEnum.EMAIL_PASSWORD_AUTH
          }
        });
        if (!user || bcrypt.compareSync(auth.password, user.password))
          throw new ErrorHandler(
            authMessages.FAIL_LOGIN,
            "",
            errorCodes.UNAUTHORIZED,
            customErrorCodes.INVALID_REQUEST
          );
        return user;
      }
    });
  };

  getUserById = async (_id) => {
    return await tryCatchHandler({
      fn: async () => {
        const user = await UserModel.findByPk(_id, {
          attributes: {
            exclude: ["password"]
          }
        });
        if (!user)
          throw new ErrorHandler(
            userMessages.NOT_FOUND,
            "",
            errorCodes.NOT_FOUND,
            customErrorCodes.INVALID_REQUEST
          );
        return user;
      }
    });
  };

  getUserOrCreateOne = async (data) => {
    return await tryCatchHandler({
      fn: async () => {
        let user = await UserModel.findOne({
          where: {
            email: data.auth.email
          }
        });
        if (!user) {
          user = await UserModel.create(
            { ...data },
            {
              returning: true
            }
          );
          return user;
        } else if (user.provider !== data.auth.provider)
          throw new ErrorHandler(
            authMessages.PROVIDER_COLLISION,
            "",
            errorCodes.UNAUTHORIZED,
            customErrorCodes.INVALID_REQUEST
          );
        return user;
      }
    });
  };

  createUser = async ({ auth, ...data }) => {
    return await tryCatchHandler({
      fn: async () => {
                const existUser = await UserModel?.findOne({
                  where: {
                    email: auth.email
                  }
                });
        
                if (existUser) {
                  throw new ErrorHandler(
                    authMessages.DUPLICATE_EMAIL,
                    "",
                    errorCodes.DUPLICATE_FIELD,
                    customErrorCodes.INVALID_REQUEST
                  );
                }

        if (!auth.password) {
          throw new ErrorHandler(
            authMessages.PASSWORD_MISSING,
            "",
            errorCodes.BAD_REQUEST,
            customErrorCodes.INVALID_REQUEST
          );
        }

        const {dataValues: user} = await UserModel.create({ ...data, ...auth });
        return user;
      }
    });
  };

  getUsers = async (skip = 0) => {
    return await tryCatchHandler({
      fn: async () => {
        const users = await UserModel.findAll({
          offset: skip,
          limit: 20,
          attributes: {
            include: ["name", "last_name", "email", "provider"],
            exclude: ["password"]
          }
        });
        return users;
      }
    });
  };

  getAdmins = async () => {
    return await tryCatchHandler({
      fn: async () => {
        const users = await UserModel.findAll({
          include: {
            model: AdminModel,
            required: true,
            as: "AdminOptions"
          },
          attributes: {
            exclude: ["password"]
          }
        });
        return users;
      }
    });
  };

  userToAdmin = async (superAdminId, userId) => {
    return await tryCatchHandler({
      fn: async () => {
        const user = await UserModel.findOne({
          where: {
            id: userId
          }
        });

        if (!user)
          throw new ErrorHandler(
            userMessages.NOT_FOUND,
            "",
            errorCodes.NOT_FOUND,
            customErrorCodes.INVALID_REQUEST
          );
        await user.setToAdmin({
          superAdminId,
          userId,
          isSetAdmin: true
        });

        return {
          message: userMessages.ADMIN_UPDATE(user.name)
        };
      }
    });
  };

  unsetUserToAdmin = async (superAdminId, userId) => {
    return await tryCatchHandler({
      fn: async () => {
        const user = await UserModel.findOne({
          where: {
            id: userId
          }
        });

        if (!user)
          throw new ErrorHandler(
            userMessages.NOT_FOUND,
            "",
            errorCodes.NOT_FOUND,
            customErrorCodes.INVALID_REQUEST
          );
        await user.setToAdmin({
          superAdminId,
          userId,
          isSetAdmin: false
        });

        return {
          message: userMessages.UNSET_ADMIN(user.name)
        };
      }
    });
  };

  getDeletedProducts = async (adminId) => {
    return await tryCatchHandler({
      fn: async () => {
        const products = await DeletedProductsModel.findAll({
          where: {
            adminId
          },
          include: {
            model: ProductModel,
            required: true
          }
        });

        if (!products)
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
}

export default new UserService();
