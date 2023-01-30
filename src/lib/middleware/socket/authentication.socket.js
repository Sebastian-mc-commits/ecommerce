
export const onAuthenticateSocket = (socket, next) => {
    const userSession = socket.request.session;
    if (userSession._id) {
        console.log("User exists", userSession);
        return next()
    }
    else {
        console.log("User not exists");
        const err = new Error("Not authorized");
        return next(err);
    }
}