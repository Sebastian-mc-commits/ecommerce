import { Router } from "express";
import { authenticate } from "../lib/middleware/authentication.js";

const router = Router();

router.get("/", authenticate, (req, res) => {
    try {
        res.render("user");
    }
    catch (err) {
        req.flash("message", { message: "user Not Found", type: "warning", error: err.message });
        return res.status(404).render("errorHandler");
    }
})
export default router;