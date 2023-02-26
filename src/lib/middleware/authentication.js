import userMessages from "../../utils/messages/messages.user.utils.js";

export const authenticate = (req, res, next) => {
    if (req.session?.user) {
        req.session.touch();
        return next()
    };
    req.flash("message", { message: userMessages.AUTHENTICATION_REQUIRED, type: "warning" });
    res.status(403).redirect("/home");
}

export const authenticateAdmin = (req, res, next) => {
    if (req.session?.user?.adminOptions.isAdmin) {
        req.session.touch();
        return next();
    }
    req.flash("message", { message: userMessages.ADMIN_ONLY, type: "info" });
    res.status(403).redirect("/home");
}

export const authenticateSuperAdmin = (req, res, next) => {
    if (req.session?.user?.superAdminOptions.isSuperAdmin) {
        req.session.touch();
        return next();
    }
    req.flash("message", { message: userMessages.ADMIN_ONLY, type: "info" });
    res.status(403).redirect("/home");
}

export const isAuthenticate = (req, res, next) => {
    if (req.session?.user) {
        req.session.touch();
        req.flash("message", { message: userMessages.ALREADY_AUTHENTICATE(req.session.user.auth.email), type: "info" });
        return res.status(403).redirect("/home");
    }
    return next();
}