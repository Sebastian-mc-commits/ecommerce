import AdminModel from "../models/admin.model.js";
import ErrorHandler from "../utils/classes/errorHandler.utils.js";
import customErrorCodes from "../utils/enums/errorCodes.custom.enum.js";
import errorCodes from "../utils/enums/errorCodes.enum.js";
import tryCatchHandler from "../utils/functions/tryCatch.utils.js";
import userMessages from "../utils/messages/messages.user.utils.js";

export const getAdminByUserId = async (id) => {
  return await tryCatchHandler({
    fn: async () => {
      const admin = await AdminModel.find({ admin: id });
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

export const existAdminByUserId = async (id) => {
  return await tryCatchHandler({
    fn: async () => {
      const admin = await AdminModel.exists({ admin: id });

      return admin;
    }
  });
};
