import { Router } from "express";
import { product } from "../classes/index.js"

const router = Router();

router.get("/:id", (req, res) => {
    const {id} = req.params;
    const getProduct = product.getProductById(id);
    res.render("listContent", {getProduct});
})

export default router;