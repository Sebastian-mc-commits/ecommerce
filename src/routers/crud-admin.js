import { Router } from "express";
import __dirname from "../__dirname.js";
import { authenticate, authenticateAdmin } from "../lib/middleware/authentication.js";

const router = Router();



router.get("/", authenticateAdmin, async (req, res) => {
    try {
        // res.render("crud-admin", { products: await product.getProducts() });
        const user = req.session?.user;
        res.render("crud-admin", { getUser: JSON.stringify(user) });

    }
    catch (err) {
        req.flash("message", { message: "Has been a problem with the Admin page render", type: "warning", error: err.message });
        return res.status(500).render("errorHandler");
    }
});

export default router;