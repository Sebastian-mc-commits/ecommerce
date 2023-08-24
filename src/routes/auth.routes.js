import { Router } from "express";
import {
  isAuthenticate,
  authenticate as isLogin
} from "../lib/middleware/authentication.js";
import passport from "../utils/passport.util.js";
import { createToken } from "../lib/middleware/createToken.middleware.js";
import authMessages from "../utils/messages/messages.auth.utils.js";
import config from "../config/config.js";

const { LOCALHOST_CORS, FRONT_END_VIEWS } = config;
const router = Router();

router.get("/logout", isLogin, (req, res) => {
  req.session.destroy();
  res.json({
    message: authMessages.LOGOUT_SUCCESSFULLY
  });
});

router.use(isAuthenticate);

router.get(
  "/github",
  passport.authenticate("github", { scope: ["user:email"] })
);

router.get(
  "/github/callback",
  passport.authenticate("github", {
    successRedirect: LOCALHOST_CORS
  }),
  (req, res) => {
    req.session.user = req.user;
    res.redirect(LOCALHOST_CORS);
  }
);

router.get("/google", passport.authenticate("google", { scope: ["email"] }));

router.get(
  "/google/redirect",
  passport.authenticate("google", {
    successRedirect: LOCALHOST_CORS
  }),
  (req, res) => {
    req.session.user = req.user;
    res.redirect(LOCALHOST_CORS);
  }
);

router.post("/signup", passport.authenticate("signup"), (req, res) => {
  req.session.user = req.user;
  res.json({
    user: req.session.user
  });
});

router.post("/login", passport.authenticate("login"), (req, res) => {
  req.session.user = req.user;
  res.json({
    user: req.session.user
  });
});
export default router;
