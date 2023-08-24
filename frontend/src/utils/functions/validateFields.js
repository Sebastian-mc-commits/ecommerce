import { emailRegex, passwordRegex } from "../const/regex";
import { formTypes } from "../const/types";

const validateFields = ({ value, type }) => {
  let hasError = false;
  let error = "";

  const { EMAIL, NAME, PASSWORD, LAST_NAME } = formTypes;
  switch (type) {
    case EMAIL: {
      if (!value || !emailRegex.test(value)) {
        hasError = true;
        error = `The email address you provided is not formatted 
        correctly. Please ensure that it includes an '@' symbol 
        and a valid domain name.`;
      }
      break;
    }

    case NAME: {
      if (!value || !value.length > 2) {
        hasError = true;
        error = `The name must be at least 3 characters`;
      }
      break;
    }

    case LAST_NAME: {
      if (value.length >= 15) {
        hasError = true;
        error = `The last name is sort of optional but
        cannot be more than 15 characters`;
      }
      break;
    }
    case PASSWORD: {
      if (!value || !passwordRegex.test(value)) {
        hasError = true;
        error = `Sorry, the password you entered doesn't meet 
        the complexity requirements. Please ensure that it 
        contains at least one uppercase letter, one lowercase 
        letter, one digit, and one special character.`;
      }
      break;
    }
  }

  return {
    hasError,
    error
  };
};

export default validateFields;
