import { Router } from "express";
import { authenticate as isLogin, isAuthenticate } from "../../lib/middleware/authentication.js";
import passport from "../../utils/passport.util.js";
import { createToken } from "../../lib/middleware/createToken.middleware.js";

const router = Router();


router.get("/logout", isLogin, (req, res) => {
    req.session.destroy();
    res.redirect("/home");
});

router.use(isAuthenticate);

router.get("/github", passport.authenticate("github", { scope: ["user:email"] }));

router.get("/github/callback", passport.authenticate("github", {
    failureRedirect: "/auth",
    failureFlash: true
}), createToken, (req, res) => {

    req.session.user = req.user;
    res.redirect("/home");
});

router.get("/google", passport.authenticate("google", { scope: ["email"] }));

router.get("/google/redirect", passport.authenticate("google", {
    failureRedirect: "/auth",
    failureFlash: true
}), createToken, (req, res) => {
    req.session.user = req.user;
    res.redirect("/home");
});

router.get("/failAuth", (req, res) => {
    const flash = req.flash("error");
    res.status(403).json({ message: flash[0] });
});

router.post("/signup", passport.authenticate("signup", {
    failureRedirect: "/api/auth/failAuth",
    failureFlash: true
}), createToken, (req, res) => {

    req.session.user = req.user;
    res.redirect("/home");
});

router.post("/login", passport.authenticate("login", {
    failureRedirect: "/api/auth/failAuth",
    // failureFlash: authMessages.FAIL_LOGIN,
    failureFlash: true
    
}), createToken, (req, res) => {
    req.session.user = req.user;
    res.redirect("/home");
});

export default router;
// http://localhost:4000/api/auth/github/callback