import jwt from "jsonwebtoken";
import { config } from "dotenv";
import userMessages from "../../utils/messages/messages.user.utils.js";
import { getUserById } from "../../services/user.service.js";

config();

export const verifyTokenAdmin = async (req, res, next) => {
    const { authenticateAdmin = "" } = req.signedCookies
    if (!authenticateAdmin?.token) {
        req.flash("message", {
            message: userMessages.COOKIE_NOT_FOUND,
            type: "warning"
        });
        return res.status(401).redirect("/home");
    }

    const { _id = "" } = jwt.verify(authenticateAdmin.token, process.env.SECRET_JWT);

    const user = await getUserById(_id);

    if (user && user.adminOptions.isAdmin) {
        return next();
    }

    req.flash("message", {
        message: userMessages.ADMIN_ONLY,
        type: "warning"
    });
    return res.status(403).redirect("/home");
}

export const verifyTokenSuperAdmin = async (req, res, next) => {
    const { authenticateAdmin = "" } = req.signedCookies
    if (!authenticateAdmin?.token) {
        req.flash("message", {
            message: userMessages.COOKIE_NOT_FOUND,
            type: "warning"
        });
        return res.status(401).redirect("/home");
    }

    const { _id = "" } = jwt.verify(authenticateAdmin.token, process.env.SECRET_JWT);

    const user = await getUserById(_id);

    if (user && user.adminOptions.isAdmin && user.superAdminOptions.isSuperAdmin) {
        return next();
    }

    req.flash("message", {
        message: userMessages.ADMIN_ONLY,
        type: "warning"
    });
    return res.status(403).redirect("/home");
}