import config from "../../config/config.js";
import { existAdminByUserId } from "../../services/admin.service.js";
import { existSuperAdminByUserId } from "../../services/superAdmin.service.js";
import ErrorHandler from "../../utils/classes/errorHandler.utils.js";
import customErrorCodes from "../../utils/enums/errorCodes.custom.enum.js";
import errorCodes from "../../utils/enums/errorCodes.enum.js";
import buildFrontEndUrl from "../../utils/functions/frontEndParser.utils.js";
import userMessages from "../../utils/messages/messages.user.utils.js";

const { LOCALHOST_CORS } = config;
export const authenticate = (req, res, next) => {
  req.session.touch();
  if (req.session?.user) {
    return next();
  }

  throw new ErrorHandler(
    userMessages.AUTHENTICATION_REQUIRED,
    "",
    errorCodes.FORBIDDEN,
    customErrorCodes.INVALID_REQUEST
  );
};

export const authenticateAdmin = async (req, _res, next) => {
  req.session.touch();
  if (await existAdminByUserId(req.session.user._id)) {
    return next();
  }

  throw new ErrorHandler(
    userMessages.ADMIN_ONLY,
    "",
    errorCodes.FORBIDDEN,
    customErrorCodes.INVALID_REQUEST
  );
};

export const authenticateSuperAdmin = async (req, _res, next) => {
  req.session.touch();
  if (await existSuperAdminByUserId(req.session.user._id)) {
    return next();
  }
  throw new ErrorHandler(
    userMessages.ADMIN_ONLY,
    "",
    errorCodes.FORBIDDEN,
    customErrorCodes.INVALID_REQUEST
  );
};

export const isAuthenticate = (req, res, next) => {
  req.session.touch();
  if (req.session?.user) {
    throw new ErrorHandler(
      userMessages.ALREADY_AUTHENTICATE,
      "",
      errorCodes.FORBIDDEN,
      customErrorCodes.SPECIFIED_REDIRECT(
        buildFrontEndUrl({
          url: [LOCALHOST_CORS]
        })
      )
    );
  }
  return next();
};
