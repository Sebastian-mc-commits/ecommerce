import { Router } from "express";
import { authenticate as isLogin, isAuthenticate } from "../../lib/middleware/authentication.js";
import passport from "../../utils/passport.util.js";
const router = Router();


router.get("/github", isAuthenticate, passport.authenticate("github", { scope: ["user:email"] }));

router.get("/logout", isLogin, (req, res) => {
    req.session.destroy();
    res.redirect("/home");
});

router.get("/github/callback", isAuthenticate, passport.authenticate("github", {
    failureRedirect: "/auth",
    failureFlash: true
}), (req, res) => {
    req.session.user = req.user;
    res.redirect("/home");
});

router.get("/google", isAuthenticate, passport.authenticate("google", { scope: ["email"] }));

router.get("/google/redirect", passport.authenticate("google", {
    failureRedirect: "/auth",
    failureFlash: true
}), (req, res) => {
    req.session.user = req.user;
    res.redirect("/home");
});

router.get("/failAuth", (req, res) => {
    const flash = req.flash("error");
    res.status(403).json({ message: flash[0] });
});

router.post("/signup", isAuthenticate, passport.authenticate("signup", {
    failureRedirect: "/auth/failAuth",
    // failureFlash: authMessages.FAIL_SIGNUP,
    failureFlash: true
    // successRedirect: "/home"
}), (req, res) => {
    req.session.user = req.user;
    res.redirect("/home");
});

router.post("/login", isAuthenticate, passport.authenticate("login", {
    failureRedirect: "/auth/failAuth",
    // failureFlash: authMessages.FAIL_LOGIN,
    failureFlash: true

}), (req, res) => {
    req.session.user = req.user;
    res.redirect("/home");
});

export default router;
// http://localhost:4000/api/auth/github/callback