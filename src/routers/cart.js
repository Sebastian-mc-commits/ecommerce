// import {product, cart} from "../classes/index.js"
import { Router } from "express";
import { authenticate } from "../lib/middleware/authentication.js";
import * as cart from "../services/cart.service.js";
import { retrieveProductsViewedByCookie } from "../utils/retrieveProductsViewed.js";
const router = Router();

router.get("/", authenticate, async (req, res) => {
    try {
        const userId = req.session.user._id;
        const products = await cart.getProductsFromCart(userId);
        const getRandomProduct = Math.floor(Math.random() * 1);
        const existsCookie = req.cookies.seenProducts;

        // retrieveProductsViewedByCookie(existsCookie, "products",
        //     res,
        //     products[getRandomProduct]
        // );
        res.render("cart", { products });
    }
    catch (err) {
        req.flash("message", { message: "Has been a problem with the products render", type: "warning", error: err.message });
        return res.status(500).render("errorHandler");
    }
});

router.get("/addToCart/:id", authenticate, async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.session.user._id;
        await cart.addToCart(userId, id);
        res.status(201).redirect("/home");
    }
    catch (err) {
        req.flash("message", { message: "Has been a problem with the product", type: "warning", error: err.message });
        return res.status(400).render("errorHandler");
    }
});

router.get("/delete/:pid", authenticate, async (req, res) => {
    try {
        const { pid } = req.params;
        const userId = req.session.user._id;
        await cart.deleteFromUserToCart(userId, pid);
        res.redirect("/cart");
    }
    catch (err) {
        req.flash("message", { message: "Has been a problem with the product", type: "warning", error: err.message });
        return res.status(400).render("errorHandler");
    }
});

router.get("/deleteAll", authenticate, async (req, res) => {
    try {
        const userId = req.session.user._id;
        await cart.deleteAll(userId);
        res.redirect("/cart");
    }
    catch (err) {
        req.flash("message", { message: "Has been a problem with the products render", type: "warning", error: err.message });
        return res.status(500).render("errorHandler");
    }
});

// router.get("/edit/:pid", (req, res) => {
//     const {pid} = req.params;
//     res.json(cart.updateProduct(pid, req.body ));
// });

export default router;