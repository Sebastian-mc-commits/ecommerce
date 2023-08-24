import jwt from "jsonwebtoken";
import userMessages from "../../utils/messages/messages.user.utils.js";
import config from "./../../config/config.js";
import ErrorHandler from "../../utils/classes/errorHandler.utils.js";
import errorCodes from "../../utils/enums/errorCodes.enum.js";
import customErrorCodes from "../../utils/enums/errorCodes.custom.enum.js";
import { existAdminByUserId } from "../../services/admin.service.js";
import { existSuperAdminByUserId } from "../../services/superAdmin.service.js";

const { SECRET_JWT } = config;

export const verifyTokenAdmin = async (req, _res, next) => {
  const { authenticateAdmin = "" } = req.signedCookies;
  if (!authenticateAdmin?.token) {
    throw new ErrorHandler(userMessages.COOKIE_NOT_FOUND, '', errorCodes.UNAUTHORIZED, customErrorCodes.INVALID_REQUEST)
  }
  
  const { _id = "" } = jwt.verify(authenticateAdmin.token, SECRET_JWT);
  
  
  if (await existAdminByUserId(_id)) {
    return next();
  }

  throw new ErrorHandler(userMessages.ADMIN_ONLY, '', errorCodes.FORBIDDEN, customErrorCodes.INVALID_REQUEST)
};

export const verifyTokenSuperAdmin = async (req, res, next) => {
  const { authenticateAdmin = "" } = req.signedCookies;
  if (!authenticateAdmin?.token) {
    throw new ErrorHandler(userMessages.COOKIE_NOT_FOUND, '', errorCodes.UNAUTHORIZED, customErrorCodes.INVALID_REQUEST)
  }
  
  const { _id = "" } = jwt.verify(authenticateAdmin.token, SECRET_JWT);

  if (await existSuperAdminByUserId(_id)) {
    return next();
  }

  req.flash("message", {
    message: userMessages.ADMIN_ONLY,
    type: "warning"
  });
  throw new ErrorHandler(userMessages.ADMIN_ONLY, '', errorCodes.FORBIDDEN, customErrorCodes.INVALID_REQUEST)
};
