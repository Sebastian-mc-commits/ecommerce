import { Router } from "express";

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

export default router;