import * as product from "../services/product.service.js";
import { Router } from "express";

const router = Router();

router.get("/", async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        
        if (!!req.session?.filterData) {
            const {length, content} = await req.session.filterData[0];
            delete req.session.filterData;
            return res.render("home", {
                products: content,
                len: length
            });
        }
        const { docs, ...pagination } = await product.getProducts(page);
        
        res.render("home", {
            products: docs,
            pagination: JSON.stringify(pagination),
        });
    }
    catch (err) {
        req.flash("message", { message: "Products Not Found", type: "warning", error: err.message });
        return res.status(500).render("errorHandler");
    }
});

router.get("/availableCategories", async (req, res) => {
    // const page = parseInt(req.query.page) || 1;
    // res.json(filtersApplyed);
    const authorization = req.get("Authorization");

    if (authorization === "123456") {
        const categories = await product.getAvailableCategories();
        return res.status(200).json(categories);
    }
    //401
    return res.status(403).redirect("/home");
});

router.get("/getPrice", async (req, res) => {
    // const page = parseInt(req.query.page) || 1;
    // res.json(filtersApplyed);
    const authorization = req.get("Authorization");

    if (authorization === "123456") {
        // const min = await product.getPrice("min");
        const max = await product.getTheHighestPrice();
        return res.status(200).json({
            // min: min[0].price,
            max: max[0].price
        });
    }
    return res.status(403).redirect("/home");
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

router.post("/applyFilters", async (req, res) => {
    // const page = parseInt(req.query.page) || 1;
    const filters = req.body;
    // res.json(filtersApplyed);
    const products = await product.handleApplyFilters(filters);
    req.session.filterData = products;
    res.redirect("/home");
    // res.json(products[0].content);
});

export default router;