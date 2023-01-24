
export const authenticate = (req, res, next) => {
    if ( req.session?.user ) return next();
    req.flash("message", {message: "The authentication is required", type: "warning"});
    res.status(401).redirect("/home");
}

export const authenticateAdmin = (req, res, next) => {
    if ( req.session?.user?.isAdmin ) return next();
    req.flash("message", {message: "You need the admin permission", type: "info"});
    res.status(403).redirect("/home");
}

export const isAuthenticate = (req, res, next) => {
    if ( req.session?.user?.isAdmin ) {
        req.flash("message", {message: "You already hava an account in use", type: "info"});
        return res.status(403).redirect("/home");
    }
    return next();
}