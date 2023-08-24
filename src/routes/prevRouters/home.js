import { product } from "../classes/index.js";
import { Router } from "express";
import {extname} from "path";
import {v4} from "uuid";
import __dirname from "../__dirname.js";
import multer from "multer";

const router = Router();

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, __dirname("public", "uploads", "images")),
    filename: (req, file, cb) => cb(null, v4() + extname(file.originalname))
});

const upload = multer({ 
    storage,
    fileFilter: (req, file, cb) => {
        const fileType = /jpg|jpeg|png|gift/;
        const mimetype = fileType.test(extname(file.originalname));

        if(mimetype) return cb(null, true);

        return cb("Error");
    }
});


router.get("/", (req, res) => {
    const { limit } = req.query;
    res.render("home", { products: product.getProducts(limit) });
});

router.get("/crud-admin", (req, res) => {
    res.render("crud-admin", { product: product.getProducts() });
});

router.get("/:pid", (req, res) => {
    const { pid } = req.params;
    const productId = product.getProductById(pid);
    console.log(productId);
    if (!productId) return res.status(404).send(`Product with id ${pid} Not Found`);
    res.render("home", { products: productId, getProductById: true });
});

router.get("/delete/:pid", (req, res) => {
    const { pid } = req.params;
    const productId = product.deleteProduct(pid);
    if (!productId) return res.status(404).send(`Product with id ${pid} Not Exist`);
    res.redirect("/home/crud-admin");
});

router.post("/addProduct", upload.single("thumbnail"), (req, res) => {
    console.log(req.file);
    const file = req.file?.filename;
    if (file) req.body.thumbnail = `/public/uploads/images/${file}`;
    const addProduct = product.addProduct(req.body);
    if (!addProduct) return res.status(400).redirect("/home/crud-admin");

    res.redirect("/home/crud-admin");
});

router.post("/updateProduct/:pid", (req, res) => {
    const { pid } = req.params;
    const updateProduct = product.updateProduct(pid, req.body);
    if (!updateProduct) return res.status(400).send(`Cannot update the product because
        has the same code than other or the field not exist. Check it out!`);

    res.redirect("/home/crud-admin");
});

export default router;