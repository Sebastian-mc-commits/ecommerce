import customErrorCodes from "../../utils/enums/errorCodes.custom.enum.js";
import errorCodes from "../../utils/enums/errorCodes.enum.js";
import buildFrontEndUrl from "../../utils/functions/frontEndParser.utils.js";

const errorMiddleware = (err, _req, res, _next) => {
  const {
    message,
    status = errorCodes.INTERNAL_SERVER_ERROR,
    errorCached = "",
    errorCode = customErrorCodes.SERVER_FAILURE()
  } = err;

  if (errorCode?.code === customErrorCodes.SPECIFIED_REDIRECT().code) {
    return res.status(status).redirect(
      buildFrontEndUrl({
        url: [errorCode.url],
        params: {
          message
        }
      })
    );
  }

  return res.status(status).json({
    message,
    status,
    errorCached,
    errorCode: errorCode.code
  });
};

export default errorMiddleware;
