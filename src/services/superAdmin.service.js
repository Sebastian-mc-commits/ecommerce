
import SuperAdminModel from "../models/superAdmin.model.js";
import ErrorHandler from "../utils/classes/errorHandler.utils.js";
import customErrorCodes from "../utils/enums/errorCodes.custom.enum.js";
import errorCodes from "../utils/enums/errorCodes.enum.js";
import tryCatchHandler from "../utils/functions/tryCatch.utils.js";
import userMessages from "../utils/messages/messages.user.utils.js";

export const getSuperAdminByUserId = async (id) => {
  return await tryCatchHandler({
    fn: async () => {
      const admin = await SuperAdminModel.find({ superAdmin: id });
      if (!admin)
        throw new ErrorHandler(
          userMessages.NOT_FOUND,
          "",
          errorCodes.FORBIDDEN,
          customErrorCodes.INVALID_REQUEST
        );

      return admin;
    }
  });
};

export const existSuperAdminByUserId = async (id) => {
  return await tryCatchHandler({
    fn: async () => {
      const admin = await SuperAdminModel.exists({ superAdmin: id });

      return admin;
    }
  });
};
