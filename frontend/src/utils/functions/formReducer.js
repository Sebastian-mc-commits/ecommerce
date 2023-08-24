import { stateTypes } from "../const/types";

const { UPDATE_FORM, IS_VALID_FORM_UPDATE } = stateTypes;

const formReducer = (state, { payload, type }) => {
  const { type: valueType = "", isFormValid, ...data } = payload;

  switch (type) {
    case UPDATE_FORM: {
      return {
        ...state,
        [valueType]: {
          ...state,
          ...data
        },

        isFormValid
      };
    }

    case IS_VALID_FORM_UPDATE: {
      return {
        ...state,
        isFormValid
      };
    }
    default: {
      return state;
    }
  }
};

export default formReducer;
