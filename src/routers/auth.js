import { Router } from "express";
import { isAuthenticate } from "../lib/middleware/authentication.js";
import __dirname from "../__dirname.js";

const router = Router();

// router.use(isAuthenticate);

router.get("/", isAuthenticate, async (req, res) => {
    res.render("auth");
});

export default router;