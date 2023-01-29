import * as product from "../services/product.service.js";
import { Router } from "express";

const router = Router();

router.get("/", async (req, res) => {
    try {
        // const {limit} = req.query;
        // const products = await product.getProducts(limit);
        const products = await product.getProducts();
        res.render("home", {
            products
        });
        // res.json(products);
    }
    catch (err) {
        req.flash("message", { message: "Has been a problem with the products render", type: "warning", error: err.message });
        return res.status(500).render("errorHandler");
    }
});

router.get("/:pid", async (req, res) => {
    const { pid } = req.params;

    try {
        const productId = await product.getProduct(pid);

        res.render("home", { products: productId, getProductById: true });
    }
    catch (err) {
        req.flash("message", { message: "Product Not Found", type: "warning", error: err.message });
        return res.status(404).render("errorHandler");
    }
});

export default router;