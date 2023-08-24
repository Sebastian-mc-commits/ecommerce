import ErrorHandler from "../classes/errorHandler.utils.js";
import customErrorCodes from "../enums/errorCodes.custom.enum.js";
import errorCodes from "../enums/errorCodes.enum.js";
import serverMessages from "../messages/messages.server.utils.js";

const tryCatchHandler = async ({
  evaluateCode = customErrorCodes.DEFAULT,
  fn
}) => {
  try {
    return await fn();
  } catch (err) {
    if ("errorCode" in err && err.errorCode !== evaluateCode) {
      throw new ErrorHandler(
        err.message,
        err?.errorCached,
        err?.status,
        err?.errorCode
      );
    }
    throw new ErrorHandler(
      serverMessages.SERVER_FAILURE,
      err.message,
      errorCodes.INTERNAL_SERVER_ERROR,
      customErrorCodes.SERVER_FAILURE
    );
  }
};

export default tryCatchHandler;
