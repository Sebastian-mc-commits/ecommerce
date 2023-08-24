import customErrorCodes from "../enums/errorCodes.custom.enum.js";
import errorCodes from "../enums/errorCodes.enum.js";

class ErrorHandler extends Error {

  constructor(message, errorCached, status = errorCodes.INTERNAL_SERVER_ERROR, errorCode = customErrorCodes.DEFAULT){
    super(message);
    this.errorCached = errorCached;
    this.status = status;
    this.errorCode = errorCode;
  }
}

export default ErrorHandler