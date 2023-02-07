import { Router } from "express";
import { authenticate, authenticateSuperAdmin } from "../lib/middleware/authentication.js";
import { getUserForSuperAdmin } from "../services/user.service.js";

const router = Router();

router.get("/", authenticate, (req, res) => {
    try {
        const selectedUser = req.session.user;
        res.render("user", {
            selectedUser
        });
    }
    catch (err) {
        req.flash("message", { message: "user Not Found", type: "warning", error: err.message });
        return res.status(404).render("errorHandler");
    }
});

router.get("/visitUser", authenticateSuperAdmin, async (req, res) => {
    try {
        const {_id} = req.query;
        const selectedUser = await getUserForSuperAdmin(_id);
        console.log("visit user");
        console.log(selectedUser);
        res.render("user", {
            selectedUser
        });
    }
    catch (err) {
        req.flash("message", { message: "user Not Found", type: "warning", error: err.message });
        return res.status(404).render("errorHandler");
    }
});

router.get("/logout", authenticate, (req, res) => {
    req.session.destroy();
    req.session = null
    res.render("home");
});
export default router;