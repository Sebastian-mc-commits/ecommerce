import { Router } from "express";
import { isAuthenticate } from "../lib/middleware/authentication.js";
import * as user from "../services/user.service.js";
import __dirname from "../__dirname.js";

const router = Router();

// router.use(isAuthenticate);

router.get("/", isAuthenticate, async (req, res) => {
    res.render("auth");
});

router.post("/login", isAuthenticate, async (req, res) => {
    try {
        const getUser = await user.getUser(req.body);
        req.session.user = getUser;
        req.flash("message", {message: `Welcome ${getUser.name}`, type: "success"});

        req.io.emit("newUser", {user: getUser});
        res.redirect("/home");
    }
    catch(err) {
        req.flash("message", {message: "The user not exists", type: "warning", error: err.message});
        return res.status(400).redirect("/auth");
    }
});


router.post("/singup", isAuthenticate, async (req, res) => {
    try {
        const getUser = await user.createUser(req.body);
        req.session.user = getUser;
        req.io.emit("newUser", {user: getUser});
        req.flash("message", {message: `Welcome ${getUser.name}`, type: "success"});
        res.redirect("/home");
    }
    catch(err) {
        req.flash("message", {message: "The user already exists", type: "warning", error: err.message});
        return res.status(400).redirect("/auth");
    }
});

export default router;