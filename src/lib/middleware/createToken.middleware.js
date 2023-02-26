import { config } from "dotenv";
import jwt from "jsonwebtoken";

config();

export const createToken = (req, res, next) => {

    const authenticateAdmin = req.signedCookies?.authenticateAdmin
    if (req.user.adminOptions.isAdmin || req.user.superAdminOptions.isSuperAdmin && (!authenticateAdmin)) {
        const token = jwt.sign({ _id: req.user._id }, process.env.SECRET_JWT, { expiresIn: "1d" });
        res.cookie("authenticateAdmin", { token }, { maxAge: 24 * 60 * 60 * 1000, httpOnly: true, signed: true });
    }
    return next();
}