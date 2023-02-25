import * as product from "../services/product.service.js";
import { Router } from "express";

const router = Router();

router.get("/", async (req, res) => {
    try {
        const { page, ...filters } = req.query;

        const render = {}
        const { products: productsViwed = [] } = req.signedCookies?.seenProducts || {}

        if (!!productsViwed.length) render.cookie = true;
        else if ("cookie" in render) delete render.cookie;

        if (Object.values(filters).length) {

            if ("types" in filters) {

                if (typeof filters.types === "string") {
                    filters.types = filters.types.replace(/[+]/g, " ");
                }
                else if (filters.types?.length) {

                    filters.types = filters.types.map(filter => filter.replace(/[+]/g, " "));
                }

            }

            const filterProducts = await product.handleApplyFilters(filters);
            const { length = 0, content = [] } = filterProducts[0] ?? {};

            return res.render("home", {
                ...render,
                products: content,
                len: length,
            });
        }
        // const seenProducts = req.cookies("seenProducts")?.products;
        // res.clearCookie("seenProducts");

        if (!!req.session?.filterData) {
            const { length, content } = await req.session.filterData[0];
            delete req.session.filterData;
            return res.render("home", {
                ...render,
                products: content,
                len: length
            });
        }

        const { docs, ...pagination } = await product.getProducts(parseInt(page) || 1);

        res.render("home", {
            ...render,
            products: docs,
            pagination: JSON.stringify(pagination),
        });
    }
    catch (err) {
        req.flash("message", { message: "Products Not Found", type: "warning", error: err.message });
        return res.status(500).render("errorHandler");
    }
});

router.get("/products", async (req, res) => {
    const products = await product.getAllProducts();
    res.json(products);
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

router.get("/getRandomProducts:api", async (req, res) => {
    try {
        const { products: productsSaved } = req.signedCookies.seenProducts;
        const products = await product.getRandomProduct(productsSaved);

        res.json(products);
    }
    catch (err) {
        res.sendStatus(401);
    }
});

router.get("/clearProductCookies:api", async (req, res) => {
    try {
        res.clearCookie("seenProducts");
        res.sendStatus(200);
    }
    catch {
        res.sendStatus(401);
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