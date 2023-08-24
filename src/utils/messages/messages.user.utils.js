const userMessages = {
    NOT_FOUND: "Sorry, we could not find a user with the provided information. Please check your search criteria and try again",

    ADMIN_ONLY: `We're sorry, but it seems that you do not have the necessary permissions to perform this action. 
    This feature is restricted to admins only.
    If you believe that you should have access 
    to this feature or require assistance with anything else, 
    please contact our support team. We'll be happy to help you with any questions or concerns.`,

    DATA_NOT_FOUND_REQUEST: "No products were found matching your search criteria.",

    ADMIN_UPDATE: name => `The account of ${name} has been updated to an admin account.`,

    UNSET_ADMIN: name => `The ${name} user is no longer an admin`,

    COOKIE_NOT_FOUND: "Authorization failed: cookie not found.",

    AUTHENTICATION_REQUIRED: "Please authenticate yourself to access this resource. You may do so by logging in or creating an account if you haven't already done so.",

    ALREADY_AUTHENTICATE: email => `You're already logged in as ${email}. Please log out first if you want to log in with a different account`,

    ALREADY_AN_ADMIN_UPDATE: "It appears that this user is already an admin"
}

export default userMessages;