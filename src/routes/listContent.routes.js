import cookieParser from "cookie-parser";
import { config } from "dotenv";
import { Router } from "express";
import * as comments from "../services/comment.service.js";
import { retrieveProductsViewedByCookie } from "../utils/retrieveProductsViewed.js";
config();
const router = Router();

router.get("/:id", cookieParser(process.env.SECRET_COOKIE), async (req, res) => {
    try {
        const { id } = req.params;
        const getComments = await comments.getComments(id);
        const existsCookie = req.signedCookies.seenProducts;

        retrieveProductsViewedByCookie(existsCookie, "products", "seenProducts", res, getComments);

        // if (existsCookie && existsCookie.products?.length && existsCookie.products?.length <= 10) {
        //     res.cookie("seenProducts", {
        //         products: [...existsCookie.products, {
        //             title,
        //             thumbnail,
        //             code,
        //             _id
        //         }]
        //     }); {
        //     }
        // }
        
        // else if (existsCookie && existsCookie.products?.length && existsCookie.products?.length > 1) {
        //     existsCookie.products[existsCookie.products.length - 1] = {
        //         title,
        //         thumbnail,
        //         code,
        //         _id
        //     }
        // }

        // else {
        //     const date = new Date();
        //     res.cookie("seenProducts", {
        //         products: [{
        //             title,
        //             thumbnail,
        //             code,
        //             _id
        //         }]
        //     }, { expires: new Date(date.getTime() + 5 * 24 * 60 * 60 * 1000) });
        // }

        // res.clearCookie("seenProducts");
        res.render("listContent", { getProduct: getComments });
    }
    catch (err) {
        req.flash("message", { message: "Product Not Found", type: "warning", error: err.message });
        return res.status(404).render("errorHandler");
    }
})

export default router;