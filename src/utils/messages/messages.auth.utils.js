const authMessages = {
  FAIL_LOGIN: `The email and password combination provided does not match our records. 
    Please ensure that you have entered your login credentials correctly and try again.`,

  FAIL_SIGNUP: `We're sorry, but the email address you provided is already associated 
    with an account in our system. Please try again with a different email address, or 
    if you have already registered, try logging in instead.`,

  FAIL_PASSWORD: "The password is required",

  PROVIDER_COLLISION: `There was a problem authenticating your account. 
    It appears that you have used the same provider (e.g. Google) to sign in with
     multiple accounts (e.g. personal and work email). Please select the correct 
     account.
    `,

  PASSWORD_MISSING: "Please enter your password to login.",

  EMAIL_VERIFICATION_REQUIRED: `Verify Your Email Address
    We need to confirm your email address before you can proceed`,

  DUPLICATE_EMAIL: `Email address is already in use. 
    Please use a different email or log in with your existing account.`,

  LOGOUT_SUCCESSFULLY: "Login Successfully",

  FAIL_AUTH: "It seems either the email nor password are correct"
};

export default authMessages;
