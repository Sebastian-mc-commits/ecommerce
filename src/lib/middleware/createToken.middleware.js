import jwt from "jsonwebtoken";
import config from "../../config/config.js"

export const createToken = (req, res, next) => {

    const authenticateAdmin = req.signedCookies?.authenticateAdmin
    if (req.user.adminOptions.isAdmin || req.user.superAdminOptions.isSuperAdmin && (!authenticateAdmin)) {
        const token = jwt.sign({ _id: req.user._id }, config.SECRET_JWT, { expiresIn: "1d" });
        res.cookie("authenticateAdmin", { token }, { maxAge: 24 * 60 * 60 * 1000, httpOnly: true, signed: true });
    }
    return next();
}