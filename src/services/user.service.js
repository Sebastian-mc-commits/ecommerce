import AdminModel from "../models/admin.model.js";
import UserModel from "../models/user.models.js";
import ErrorHandler from "../utils/classes/errorHandler.utils.js";
import customErrorCodes from "../utils/enums/errorCodes.custom.enum.js";
import errorCodes from "../utils/enums/errorCodes.enum.js";
import { providerEnum } from "../utils/enums/provider.enum.js";
import tryCatchHandler from "../utils/functions/tryCatch.utils.js";
import authMessages from "../utils/messages/messages.auth.utils.js";
import userMessages from "../utils/messages/messages.user.utils.js";
import { existSuperAdminByUserId } from "./superAdmin.service.js";

export const getUser = async ({ auth }) => {
  return await tryCatchHandler({
    fn: async () => {
      const user = await UserModel.findOne({
        "auth.email": auth.email,
        "auth.provider": providerEnum.EMAIL_PASSWORD_AUTH
      });
      if (!user || !(await user?.comparePassword(auth.password)))
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

export const getUserById = async (_id) => {
  return await tryCatchHandler({
    fn: async () => {
      const user = await UserModel.findOne({ _id })?.select("-auth.password");
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

export const getUserOrCreateOne = async (data) => {
  return await tryCatchHandler({
    fn: async () => {
      let user = await UserModel.findOne({ "auth.email": data.auth.email });
      if (!user) {
        user = await UserModel.create({ ...data });
        return user;
      } else if (user.auth.provider !== data.auth.provider)
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

export const createUser = async (data) => {
  return await tryCatchHandler({
    fn: async () => {
      if (await UserModel.exists({ "auth.email": data.auth.email })) {
        throw new ErrorHandler(
          authMessages.DUPLICATE_EMAIL,
          "",
          errorCodes.DUPLICATE_FIELD,
          customErrorCodes.INVALID_REQUEST
        );
      }

      if (!data?.auth.password) {
        throw new ErrorHandler(
          authMessages.PASSWORD_MISSING,
          "",
          errorCodes.BAD_REQUEST,
          customErrorCodes.INVALID_REQUEST
        );
      }

      const user = await UserModel.create({ ...data });
      return user;
    }
  });
};

export const getUsers = async (skip = 0) => {
  const aggregate = [
    {
      $skip: skip
    },

    {
      $limit: 20
    },

    {
      $project: {
        name: 1,
        last_name: 1,
        auth: 1
      }
    },

    {
      $project: {
        "auth.password": 0
      }
    }
  ];

  return await tryCatchHandler({
    fn: async () => {
      const users = await UserModel.aggregate(aggregate);
      return users;
    }
  });
};

export const getAdmins = async () => {
  const aggregate = [
    {
      $lookup: {
        from: "admins",
        foreignField: "admin",
        localField: "_id",
        as: "adminOptions"
      }
    }
  ];
  return await tryCatchHandler({
    fn: async () => {
      const users = await UserModel.aggregate(aggregate).select(
        "-auth.password -cart -orders"
      );
      return users;
    }
  });
};

export const userToAdmin = async (adminId, _id) => {
  return await tryCatchHandler({
    fn: async () => {
      const user = await UserModel.findOne({ _id });

      if (!user)
        throw new ErrorHandler(
          userMessages.NOT_FOUND,
          "",
          errorCodes.NOT_FOUND,
          customErrorCodes.INVALID_REQUEST
        );
      await user.setToAdmin(adminId);
      return user;
    }
  });
};

export const unsetUserToAdmin = async (adminId, _id) => {
  return await tryCatchHandler({
    fn: async () => {
      const user = await UserModel.findOne({
        _id
      });

      if ((await existSuperAdminByUserId(_id)) || !user)
        throw new ErrorHandler(
          userMessages.NOT_FOUND,
          "",
          errorCodes.NOT_FOUND,
          customErrorCodes.INVALID_REQUEST
        );
      await user.unsetUserToAdmin(adminId);
      return user;
    }
  });
};

export const getDeletedProducts = async (_id) => {
  return await tryCatchHandler({
    fn: async () => {
      const products = await AdminModel.findOne({ admin: _id }).populate(
        "deletedProducts"
      );

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
