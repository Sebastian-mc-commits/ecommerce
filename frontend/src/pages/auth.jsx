import { Input, Loader, PageLayout } from "@/components";
import React, { useEffect, useReducer, useState } from "react";
import styles from "@/styles/Auth.module.css";
import Image from "next/image";
import { formTypes, stateTypes } from "@/utils/const/types";
import validateFields from "@/utils/functions/validateFields";
import formReducer from "@/utils/functions/formReducer";
import buildServerUrl from "@/utils/const/serverUrls";
import fetchData from "@/utils/functions/fetcher";
import { toast } from "react-toastify";
import { useRouter } from "next/router";

function Auth() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeLoader, setActiveLoader] = useState(false);

  useEffect(() => {
    const { message = "" } = router.query;
    if (message) {
      toast.error(message);

      router.push(
        {
          pathname: router.pathname
        },
        undefined,
        {
          shallow: true
        }
      );
    }
  }, [router]);

  const formValueMessage = isLoggedIn ? "Log in" : "Sign Up";
  const toggleAuth = isLoggedIn
    ? "Don't you Have an account?"
    : "Do you already have an account?";

  const { EMAIL, LAST_NAME, NAME, PASSWORD } = formTypes;
  const initialState = {
    email: {
      type: EMAIL,
      value: "",
      hasError: true,
      touched: false,
      error: ""
    },

    password: {
      type: PASSWORD,
      value: "",
      hasError: true,
      touched: false,
      error: ""
    },

    name: {
      type: NAME,
      value: "",
      hasError: true,
      touched: false,
      error: ""
    },

    lastName: {
      type: LAST_NAME,
      value: "",
      hasError: true,
      touched: false,
      error: ""
    },

    isFormValid: false
  };

  const { UPDATE_FORM, IS_VALID_FORM_UPDATE } = stateTypes;

  const [formState, dispatch] = useReducer(formReducer, initialState);

  const onHandlerValidateFormFields = ({
    currentError = false,
    makeGivenFieldsOptional = false
  }) => {
    let isFormValid = true;
    for (let key in formState) {
      const value = formState[key];

      if (
        (isLoggedIn || makeGivenFieldsOptional) &&
        (key === NAME || key === LAST_NAME)
      ) {
        continue;
      } else if (currentError || value.hasError) {
        isFormValid = false;
        break;
      }
    }
    return isFormValid;
  };

  const handleChangeInput = ({ value }, functionType, valueType) => {
    const { hasError, error } = validateFields({
      value,
      type: valueType
    });

    dispatch({
      type: UPDATE_FORM,
      payload: {
        type: valueType,
        value,
        hasError,
        error,
        touched: functionType === "blur",
        isFormValid: onHandlerValidateFormFields({
          currentError: hasError
        })
      }
    });
  };

  const onSubmitForm = async (event) => {
    event.preventDefault();
    let formData = {};

    for (let key in formState) {
      const { value } = formState[key];
      if (value) formData[key] = value;
    }

    setActiveLoader(true);

    const { errorFound, error } = await fetchData({
      url: buildServerUrl({
        url: ["auth", isLoggedIn ? "login" : "signup"]
      }),
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },

      body: JSON.stringify(formData)
    });
    setActiveLoader(false);

    if (errorFound) {
      return toast.warn("🦢 " + error);
    }

    router.push("/");
  };

  const handleExternAuth = async (event, provider) => {
    event.preventDefault();
    router.push(
      buildServerUrl({
        url: ["auth", provider]
      })
    );
  };
  return (
    <PageLayout
      mainStyles={[
        styles.mainContainer,
        isLoggedIn ? styles.changeMainContainerColor : ""
      ]}
    >
      <form
        onSubmit={onSubmitForm}
        className={`${styles.formContainer} ${
          isLoggedIn ? styles.moveForm : ""
        } card`}
      >
        <h2>{formValueMessage}</h2>
        {isLoggedIn || (
          <>
            <Input
              error={formState.name.error}
              optionalErrorMessageStyles={`${
                styles.optionalErrorMessageStyles
              } ${isLoggedIn ? styles.moveOptionalErrorMessageStyles : ""}`}
              labelTitle="Name"
              hasError={formState.name.hasError && formState.name.touched}
              name="name"
              type="text"
              placeholder="Write your Name (Sebastian)"
              value={formState.name.value}
              onChange={({ target }) =>
                handleChangeInput(target, "input", NAME)
              }
              onBlur={({ target }) => handleChangeInput(target, "blur", NAME)}
            />

            <Input
              error={formState.lastName.error}
              labelTitle="Last Name"
              optionalErrorMessageStyles={`${
                styles.optionalErrorMessageStyles
              } ${isLoggedIn ? styles.moveOptionalErrorMessageStyles : ""}`}
              hasError={
                formState.lastName.hasError && formState.lastName.touched
              }
              name="lastName"
              type="text"
              placeholder="Write your Last name (Optional)"
              value={formState.lastName.value}
              onChange={({ target }) =>
                handleChangeInput(target, "input", LAST_NAME)
              }
              onBlur={({ target }) =>
                handleChangeInput(target, "blur", LAST_NAME)
              }
            />
          </>
        )}
        <Input
          error={formState.email.error}
          htmlFor="email"
          labelTitle="Email"
          optionalErrorMessageStyles={`${styles.optionalErrorMessageStyles} ${
            isLoggedIn ? styles.moveOptionalErrorMessageStyles : ""
          }`}
          hasError={formState.email.hasError && formState.email.touched}
          name="email"
          type="email"
          placeholder="Write your Email @"
          value={formState.email.value}
          onChange={({ target }) => handleChangeInput(target, "input", EMAIL)}
          onBlur={({ target }) => handleChangeInput(target, "blur", EMAIL)}
        />

        <Input
          error={formState.password.error}
          htmlFor="password"
          labelTitle="Password"
          optionalErrorMessageStyles={`${styles.optionalErrorMessageStyles} ${
            isLoggedIn ? styles.moveOptionalErrorMessageStyles : ""
          }`}
          hasError={formState.password.hasError && formState.password.touched}
          name="password"
          type="password"
          placeholder="Write your Password ****"
          value={formState.password.value}
          onChange={({ target }) =>
            handleChangeInput(target, "input", PASSWORD)
          }
          onBlur={({ target }) => handleChangeInput(target, "blur", PASSWORD)}
        />

        {activeLoader ? (
          <Loader />
        ) : (
          <>
            <div className={styles.externAuthButtonsContainer}>
              <button
                className={styles.buttonGoogle}
                onClick={(event) => handleExternAuth(event, "google")}
              >
                Google
              </button>
              <button
                className={styles.buttonGitHub}
                onClick={(event) => handleExternAuth(event, "github")}
              >
                GitHub
              </button>
            </div>

            <input
              type="submit"
              value={
                formState.isFormValid
                  ? formValueMessage
                  : "Local Authentication (Fill the values)"
              }
              style={{
                backgroundColor: `${
                  formState.isFormValid
                    ? isLoggedIn
                      ? "var(--aqua)"
                      : "var(--dark-cyan)"
                    : "var(--dark-gray)"
                }`
              }}
              disabled={!formState.isFormValid}
            />

            <span
              className={styles.toggleAuth}
              onClick={() => {
                dispatch({
                  type: IS_VALID_FORM_UPDATE,
                  payload: {
                    isFormValid: onHandlerValidateFormFields({
                      makeGivenFieldsOptional: true
                    })
                  }
                });
                setIsLoggedIn((prevValue) => !prevValue);
              }}
            >
              {toggleAuth}
            </span>
          </>
        )}
      </form>

      <div className={styles.blurredCoverImage}>
        <Image
          src={`/images/${isLoggedIn ? "spiralV2" : "spiral"}.jpg`}
          className={isLoggedIn ? styles.moveBlurredCoverImage : ""}
          alt="Spiral"
          width={1000}
          height={1000}
        />
      </div>
    </PageLayout>
  );
}

export default Auth;
