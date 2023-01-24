import {product, cart} from "../classes/index.js"
import { Router } from "express";
const router = Router();

router.get("/", (req, res) => {
    const {limit} = req.query;
    res.render("cart", {products: cart.getProducts(limit)});
});

router.get("/addToCart/:id", (req, res) => {
    //cart.addProduct(product)
    const {id} = req.params;
    const getProduct = product.getProductById( id );
    cart.addProduct(getProduct);
    res.redirect("/home");
});
router.get("/delete/:pid", (req, res) => {
    const {pid} = req.params;
    cart.deleteProduct(pid);
    res.redirect("/cart");
});

router.get("/deleteAll", (req, res) => {
    cart.deleteAll();
    res.redirect("/cart");
});

router.get("/edit/:pid", (req, res) => {
    const {pid} = req.params;
    res.json(cart.updateProduct(pid, req.body ));
});

export default router;