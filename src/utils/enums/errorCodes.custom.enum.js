const customErrorCodes = {
  SPECIFIED_REDIRECT: (url = "") => {
    return {
      code: 6,
      url
    };
  },
  SERVER_FAILURE: () => {
    return {
      code: 5
    };
  },
  DATABASE_ERROR: () => {
    return {
      code: 4
    };
  },
  INVALID_REQUEST: () => {
    return {
      code: 3
    };
  },
  INVALID_TOKEN: () => {
    return {
      code: 2
    };
  },
  DEFAULT: () => {
    return {
      code: 1
    };
  }
};

export default customErrorCodes;
